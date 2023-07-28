require("dotenv").config();
const knex = require('knex')({
  client: 'postgres',
  connection: async () => {

    return {
      host: process.env.HOST,
      port: 5432,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    };
  }
});

module.exports = knex;

