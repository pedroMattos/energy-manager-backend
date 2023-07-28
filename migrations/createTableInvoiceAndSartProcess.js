const pgDbConnection = require('../pgConfig')
const dataProcessing = require('../src/dataProcessing')

function createTableInvoiceAndSartProcess() {
  pgDbConnection.schema.withSchema('public').hasTable('invoice').then((exists) => {
    if (exists) return
    return pgDbConnection.schema.withSchema('public').createTable('invoice', (table) => {
      table.increments()
      table.bigint('contract_number')
      table.bigint('instalation_number')
      table.string('reference_month')
      table.bigint('invoice_due_date')
      table.integer('kwh')
      table.float('kwh_unit')
      table.float('kwh_price')
      table.float('icms')
      table.float('icms_unit')
      table.float('icms_price')
      table.float('hfp')
      table.float('hfp_unit')
      table.float('hfp_price')
      table.float('compensated_kwh')
      table.float('compensated_kwh_unit')
      table.float('compensated_kwh_price')
      table.float('public_energy_contribution')
      table.float('total_invoice_price')

      dataProcessing(process.env.FILES_FOLDER_NAME)
    })
  }).catch((error) => {
    console.error(error)
  })
}

module.exports = createTableInvoiceAndSartProcess