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

app.get('/get-all-invoices', api.getInvoicesData)
app.get('/get-kwh', api.getInvoicesKwh)
app.get('/get-hfp', api.getInvoicesHfp)
app.get('/get-icms', api.getInvoicesIcms)
app.get('/get-invoices-prices-by-order/:order', api.getInvoicesPricesByOrder)
app.get('/get-invoices-by-instalation-number/:number', api.getInvoicesByInstalationNumber)
app.get('/get-invoices-pb-contrib-by-order/:order', api.getInvoicesContributionByOrder)
app.get('/get-money-save-by-date-order/:order', api.getMoneySavePricesByOrder)
app.get('/get-invoices-prices-by-due-date-order/:order', api.getInvoicesByDateOrdered)
app.get('/get-most-recent-kWh', api.getLastkWhConsumption)
app.get('/get-contract-number', api.getContractNumber)
app.get('/get-most-recent-invoice-price', api.getLastInvoicePrice)
app.get('/get-most-recent-money-save', api.getLastMoneySave)


app.listen(process.env.PORT, () => {
  console.log('Backend executando...', process.env.PORT)
})