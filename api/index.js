const monthsEnum = require('../monthsEnum')
const pgDbConnection = require('../pgConfig')
require("dotenv").config()
let lastContract = null
function setInvoiceData(data) {
  const month = data.get('referenceMonth').split('/').at(0)
  const year = data.get('referenceMonth').split('/').at(1)
  const date = `${monthsEnum[month]}/${year}`
  pgDbConnection('invoice').insert({
    contract_number: data.get('contractNumber'),
    instalation_number: data.get('instalationNumber'),
    reference_month: new Date(date).getTime(),
    invoice_due_date: new Date(data.get('invoiceDueDate')).getTime(),
    kwh: data.get('kwh'),
    kwh_unit: data.get('kwhUnit'),
    kwh_price: data.get('kwhPrice'),
    icms: data.get('icms'),
    icms_unit: data.get('icmsUnit'),
    icms_price: data.get('icmsPrice'),
    hfp: data.get('hfp'),
    hfp_unit: data.get('hfpUnit'),
    hfp_price: data.get('hfpPrice'),
    compensated_kwh: data.get('compEnergy'),
    compensated_kwh_unit: data.get('compEnergyUnit'),
    compensated_kwh_price: data.get('compEnergyPrice'),
    public_energy_contribution: data.get('publicEnergyContribution'),
    total_invoice_price: data.get('totalInvoicePrice')
  }).then(() => {
    console.log('Dados de fatura inseridos na tabela invoice')
    if (lastContract === data.get('contractNumber')) return
    setContractNumberData(data.get('contractNumber'))
  }).catch((error) => {
    console.error('Houve um erro ao tentar inserir os dados:', error)
  })
}

function setContractNumberData(contractNumber) {
  lastContract = contractNumber
  pgDbConnection('contract_number').select('*')
  .where({ number: contractNumber })
  .then((data) => {
    if (data.length) return
    console.log(contractNumber, data)
    pgDbConnection('contract_number').insert({
      number: contractNumber
    }).catch((error) => {
      console.log(error)
    })
  })
}

function getInvoicesData(req, res) {
  const constractNumber = req.params.contractNumber
  pgDbConnection('invoice').select('*').where({contract_number: constractNumber}).then((data) => {
    res.send(data)
  })
}

function getContracts(req, res) {
  pgDbConnection('contract_number').select('*')
  .then((data) => {
    res.send(data)
  })
}

function getInvoicesKwh(req, res) {
  pgDbConnection('invoice').select('kwh', 'kwh_unit', 'kwh_price').then((data) => {
    res.send(data)
  })
}

function getInvoicesHfp(req, res) {
  pgDbConnection('invoice').select('hfp', 'hfp_unit', 'hfp_price').then((data) => {
    res.send(data)
  })
}

function getInvoicesIcms(req, res) {
  pgDbConnection('invoice').select('icms', 'icms_unit', 'icms_price').then((data) => {
    res.send(data)
  })
}

function getInvoicesPricesByOrder(req, res) {
  const order = req.params.order
  pgDbConnection('invoice').select('total_invoice_price')
  .orderBy([{ column: 'total_invoice_price', order }])
  .then((data) => {
    res.send(data)
  })
}

function getMoneySavePricesByOrder(req, res) {
  const order = req.params.order
  const contractNumber = req.params.contractNumber
  pgDbConnection('invoice').select('hfp_price', 'compensated_kwh_price')
  .orderBy([{ column: 'invoice_due_date', order }])
  .where({ contract_number: contractNumber })
  .then((data) => {
    res.send(data)
  })
}

function getInvoicesContributionByOrder(req, res) {
  const order = req.params.order
  pgDbConnection('invoice').select('public_energy_contribution')
  .orderBy([{ column: 'public_energy_contribution', order }])
  .then((data) => {
    res.send(data)
  })
}

function getInvoicesByDateOrdered(req, res) {
  const order = req.params.order
  const contractNumber = req.params.contractNumber
  pgDbConnection('invoice').select('total_invoice_price', 'invoice_due_date')
  .orderBy([{ column: 'invoice_due_date', order }])
  .where({ contract_number: contractNumber })
  .then((data) => {
    res.send(data)
  })
}

function getInvoicesByInstalationNumber(req, res) {
  const number = req.params.number
  pgDbConnection('invoice').select('*')
  .where({ instalation_number: number })
  .then((data) => {
    res.send(data)
  })
}

function invoicesByContractNumber(req, res) {
  const number = req.params.number
  pgDbConnection('invoice').select('*')
  .where({ contract_number: number })
  .then((data) => {
    res.send(data)
  })
}

function invoicesByReferenceMonth(req, res) {
  const contractNumber = req.params.contractNumber
  const date = req.params.date
  pgDbConnection('invoice').select('*')
  .where({ reference_month: date, contract_number: contractNumber })
  .then((data) => {
    res.send(data)
  })
}

function getLastkWhConsumption(req, res) {
  const contractNumber = req.params.contractNumber
  pgDbConnection('invoice').select('kwh')
  .where({ contract_number: contractNumber })
  .orderBy([{ column: 'invoice_due_date', order: 'asc' }])
  .then((data) => {
    res.send(data.at(-1))
  })
}

function getLastInvoicePrice(req, res) {
  const contractNumber = req.params.contractNumber
  pgDbConnection('invoice').select('total_invoice_price')
  .orderBy([{ column: 'invoice_due_date', order: 'asc' }])
  .where({ contract_number: contractNumber })
  .then((data) => {
    res.send(data.at(-1))
  })
}

function getLastMoneySave(req, res) {
  const contractNumber = req.params.contractNumber
  pgDbConnection('invoice').select('hfp_price', 'compensated_kwh_price')
  .orderBy([{ column: 'invoice_due_date', order: 'asc' }])
  .where({ contract_number: contractNumber })
  .then((data) => {
    res.send(data.at(-1))
  })
}

function getContractNumber(req, res) {
  pgDbConnection('invoice').first('contract_number')
  .then((data) => {
    res.send(data)
  })
}

module.exports = {
  setInvoiceData,
  getInvoicesData,
  getInvoicesKwh,
  getInvoicesHfp,
  getInvoicesIcms,
  getInvoicesPricesByOrder,
  getInvoicesContributionByOrder,
  getInvoicesByDateOrdered,
  getInvoicesByInstalationNumber,
  getLastkWhConsumption,
  getLastInvoicePrice,
  getLastMoneySave,
  getMoneySavePricesByOrder,
  getContractNumber,
  invoicesByReferenceMonth,
  invoicesByContractNumber,
  setContractNumberData,
  getContracts
}
