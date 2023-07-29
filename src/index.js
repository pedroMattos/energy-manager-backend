const express = require("express");
require("dotenv").config();
const api = require('../api');
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
require('../migrations/createTableInvoiceAndSartProcess')()

app.get('/', (req, res) => {
  res.send('Energy backend')
})
app.get('/get-all-invoices/:contractNumber', api.getInvoicesData)
app.get('/contracts', api.getContracts)
app.get('/get-kwh', api.getInvoicesKwh)
app.get('/get-hfp', api.getInvoicesHfp)
app.get('/get-icms', api.getInvoicesIcms)
app.get('/get-invoices-prices-by-order/:order', api.getInvoicesPricesByOrder)
app.post('/invoices-by-instalation-number/:number', api.getInvoicesByInstalationNumber)
app.post('/invoices-by-contract-number/:number', api.invoicesByContractNumber)
app.post('/invoices-by-reference-month/:date/:contractNumber', api.invoicesByReferenceMonth)
app.get('/get-invoices-pb-contrib-by-order/:order', api.getInvoicesContributionByOrder)
app.get('/get-money-save-by-date-order/:order/:contractNumber', api.getMoneySavePricesByOrder)
app.get('/get-invoices-prices-by-due-date-order/:order/:contractNumber', api.getInvoicesByDateOrdered)
app.get('/get-most-recent-kWh/:contractNumber', api.getLastkWhConsumption)
app.get('/get-most-recent-invoice-price/:contractNumber', api.getLastInvoicePrice)
app.get('/get-most-recent-money-save/:contractNumber', api.getLastMoneySave)
app.get('/get-contract-number', api.getContractNumber)


app.listen(process.env.PORT, () => {
  console.log('Backend executando...', process.env.PORT)
})