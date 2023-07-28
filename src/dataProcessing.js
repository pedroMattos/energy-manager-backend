const fs = require('fs');
const readline = require('readline');
const PDFParser = require('pdf-parse');
const api = require('../api')

function startDataProcessing(folderName) {
  console.log(folderName)
  const files = fs.readdirSync(`./${folderName}`)
  files.forEach((file) => {
    readPdf(`./${folderName}/${file}`)
  })
}

function readPdf(pathPdfile) {
  const payloadData = new Map()
  const dataBuffer = fs.readFileSync(pathPdfile)
  PDFParser(dataBuffer).then((data) => {
    const txtName = new Date().getTime()
    const scrapPath = `./scraps/${txtName}.txt`
    fs.writeFileSync(scrapPath, data.text)
    const scrapTxtSreadStream = fs.createReadStream(scrapPath)
    readline.createInterface({
      input: scrapTxtSreadStream,
      terminal: false
    }).on('line', (line) => {
      const contractNumber = getContractNumber(line)
      const referenceMonth = getReferenceMonth(line)
      const invoiceDueDate = getInvoiceDueDate(line)
      const kwh = getKwhOrInjectEnergy(line)
      const hfp = getKwhOrInjectEnergy(line, false)
      const icms = getICMS(line)
      const compEnergy = getCompensatedEnergy(line)
      const totalInvoicePrice = getTotalInvoicePrice(line)
      const publicEnergyContribution = getPublicEnergyContribution(line)
      const instalationNumber = getInstalationNumber(line)
      if (contractNumber) payloadData.set('contractNumber', contractNumber)
      if (referenceMonth) payloadData.set('referenceMonth', referenceMonth)
      if (invoiceDueDate) payloadData.set('invoiceDueDate', invoiceDueDate)
      if (publicEnergyContribution) payloadData.set('publicEnergyContribution', publicEnergyContribution)
      if (totalInvoicePrice) payloadData.set('totalInvoicePrice', totalInvoicePrice)
      if (instalationNumber) payloadData.set('instalationNumber', instalationNumber)
      if (kwh) {
        payloadData.set('kwh', kwh.quantity)
        payloadData.set('kwhUnit', kwh.unitPrice)
        payloadData.set('kwhPrice', kwh.price)
      }
      if (hfp) {
        payloadData.set('hfp', hfp.quantity)
        payloadData.set('hfpUnit', hfp.unitPrice)
        payloadData.set('hfpPrice', hfp.price)
      }
      if (icms) {
        payloadData.set('icms', icms.quantity)
        payloadData.set('icmsUnit', icms.unitPrice)
        payloadData.set('icmsPrice', icms.price)
      }
      if (compEnergy) {
        payloadData.set('compEnergy', compEnergy.quantity)
        payloadData.set('compEnergyUnit', compEnergy.unitPrice)
        payloadData.set('compEnergyPrice', compEnergy.price)
      }
    }).on('close', () => {
      fs.rm(scrapPath, (error) => {
        if (error) console.log(error)
      })
      api.setInvoiceData(payloadData)
    })
  }).catch((error) => {
    console.log(error)
  })
}

function getContractNumber(line) {
  // Match busca pelo número a partir dos espaços em branco até o próximo espaço em branco
  const contractNumberMatch = /^(\s{2}\d+)/gm
  const matches = line.match(contractNumberMatch)
  if (matches?.length) {
    const contractNumber = matches.at(0).trim()

    return contractNumber
  }
}

function getReferenceMonth(line) {
  // Match busca pelos 4 espaços em branco no inicio, logo após pelo mês abreviado
  const referenceMonth = /^(\s{4}[A-Z]{3})/gm
  const matches = line.match(referenceMonth)
  if (matches?.length) {
    const month = matches.at(0).trim()

    return month
  }
}

function getInvoiceDueDate(line) {
  // Busca pelo inicio da linha que começa por 008 passando por caracteres ou não, até chegar
  // na data de vencimento, até os caracteres "R$" com lookahead positivo não incluindo
  const invoiceDueDateLinePattern = /^008.*?(\d{2}\/\d{2}\/\d{4})(?=R\$)/gm
  // Encontra a data
  const datePattern = /\d{2}\/\d{2}\/\d{4}(?=R\$)/
  const matches = line.match(invoiceDueDateLinePattern)
  if(matches?.length) {
    const dateMatch = line.match(datePattern)
    const invoiceDueDate = dateMatch.at(0)
    const englishDate = `${invoiceDueDate.substring(3,5)}/${invoiceDueDate.substring(0,2)}/${invoiceDueDate.substring(6,10)}`

    return englishDate
  }
}

function getKwhOrInjectEnergy(line, kwh = true) {
  // Após a frase energia eletrica ou injetada, achar o numero do kwh até o final da linha
  const linePattern =  kwh ? /Energia ElétricakWh.*?(\d+).*$/gm : /Energia injetada HFPkWh.*?(\d+).*$/gm
  const matches = line.match(linePattern)
  if (matches?.length) {
    // Encontra os valores, buscando tanto por decimais quanto por numeros inteiros separados por
    // "," ou ".", até espaços em branco terminando no fim da linha
    const valuesPattern = /(?:\b|(?<=\s))-?\d{1,3}(?:\.\d{3})*(?:,\d+)?(?=\s|$)/g
    const valuesMatch = line.match(valuesPattern)
    const values = {
      quantity: valuesMatch.at(0),
      unitPrice: valuesMatch.at(1).replace(/[,.]/g, m => (m === ',' ? '.' : '')),
      price: valuesMatch.at(2).replace(/[,.]/g, m => (m === ',' ? '.' : ''))
    }

    return values
  }
}

function getICMS(line) {
  // Após a palavra ICMSkWh, achar o numero do kwh até o final da linha
  const linePattern =  /ICMSkWh.*?(\d+).*$/gm
  const matches = line.match(linePattern)
  if (matches?.length) {
    // Encontra os valores, buscando tanto por decimais quanto por numeros inteiros separados por
    // "," ou ".", até espaços em branco terminando no fim da linha
    const valuesPattern = /(?:\b|(?<=\s))-?\d{1,3}(?:\.\d{3})*(?:,\d+)?(?=\s|$)/g
    const valuesMatch = line.match(valuesPattern)
    const values = {
      quantity: valuesMatch.at(0),
      unitPrice: valuesMatch.at(1).replace(/[,.]/g, m => (m === ',' ? '.' : '')),
      price: valuesMatch.at(2).replace(/[,.]/g, m => (m === ',' ? '.' : ''))
    }

    return values
  }
}

function getCompensatedEnergy(line) {
  // Após a frase Energia compensada GD IkWh, achar o numero do ikwh até o final da linha
  const linePattern =  /Energia compensada GD IkWh.*?(\d+).*$/gm
  const matches = line.match(linePattern)
  if (matches?.length) {
    // Encontra os valores, buscando tanto por decimais quanto por numeros inteiros separados por
    // "," ou ".", até espaços em branco terminando no fim da linha
    const valuesPattern = /(?:\b|(?<=\s))-?\d{1,3}(?:\.\d{3})*(?:,\d+)?(?=\s|$)/g
    const valuesMatch = line.match(valuesPattern)
    const values = {
      quantity: valuesMatch.at(0),
      unitPrice: valuesMatch.at(1).replace(/[,.]/g, m => (m === ',' ? '.' : '')),
      price: valuesMatch.at(2).replace(/[,.]/g, m => (m === ',' ? '.' : ''))
    }

    return values
  }
}

function getPublicEnergyContribution(line) {
  // Busca a linha que começa com Contrib
  const contributionPattern = /Contrib.*?(\d+).*$/gm
  const matches = line.match(contributionPattern)
  if (matches?.length) {
    // Busca caaracteres alfanumericos de 1 a 3 digitos após . ou , globalmente até o fim da linha
    const publicEnergyContribuitionPattern = /\b\d{1,3}(?:\.\d{3})*(?:,\d+)?\b/g
    const publicEnergyContribuitionMatch = line.match(publicEnergyContribuitionPattern)
    const contribuition = publicEnergyContribuitionMatch.at(0).replace(/,/, '.')


    return contribuition
  }
}

function getTotalInvoicePrice(line) {
  const totalInvoicePriceLinePattern = /TOTAL.*?(\d+).*$/gm
  const matches = line.match(totalInvoicePriceLinePattern)
  if (matches?.length) {
    const totalInvoicePricePattern = /\b\d{1,3}(?:\.\d{3})*(?:,\d+)?\b/g
    const totalInvoicePriceMatch = line.match(totalInvoicePricePattern)
    const totalInvoice = totalInvoicePriceMatch.at(0).replace(/,/, '.')

    return totalInvoice
  }
}

function getInstalationNumber(line) {
  const contractAndInstalationNumberLinePattern = /^(\s{2}\d+)/gm
  const matches = line.match(contractAndInstalationNumberLinePattern)
  if (matches?.length) {
    const contractAndInstalationPattern = /\d+/g
    const instalationNumberMatch = line.match(contractAndInstalationPattern)
    const instalationNumber = instalationNumberMatch.at(1).trim()

    return instalationNumber
  }
}

module.exports = startDataProcessing;