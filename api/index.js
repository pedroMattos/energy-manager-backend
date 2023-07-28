const pgDbConnection = require('../pgConfig')
require("dotenv").config()

function setInvoiceData(data) {
  pgDbConnection('invoice').insert({
    contract_number: data.get('contractNumber'),
    instalation_number: data.get('instalationNumber'),
    reference_month: data.get('referenceMonth'),
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
  }).catch((error) => {
    console.error('Houve um erro ao tentar inserir os dados:', error)
  })
}

function getInvoicesData(req, res) {
  pgDbConnection('invoice').select('*').then((data) => {
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
  pgDbConnection('invoice').select('hfp_price', 'compensated_kwh_price')
  .orderBy([{ column: 'invoice_due_date', order }])
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
  pgDbConnection('invoice').select('total_invoice_price', 'invoice_due_date')
  .orderBy([{ column: 'invoice_due_date', order }])
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

function getLastkWhConsumption(req, res) {
  pgDbConnection('invoice').select('kwh')
  .orderBy([{ column: 'invoice_due_date', order: 'asc' }])
  .then((data) => {
    res.send(data.at(-1))
  })
}

function getLastInvoicePrice(req, res) {
  pgDbConnection('invoice').select('total_invoice_price')
  .orderBy([{ column: 'invoice_due_date', order: 'asc' }])
  .then((data) => {
    res.send(data.at(-1))
  })
}

function getLastMoneySave(req, res) {
  pgDbConnection('invoice').select('hfp_price', 'compensated_kwh_price')
  .orderBy([{ column: 'invoice_due_date', order: 'asc' }])
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
  getContractNumber
}
