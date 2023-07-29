require("dotenv").config();
const knex = require('knex')({
  client: 'postgres',
  connection: async () => {

    return {
      host: "containers-us-west-116.railway.app",
      port: 5432,
      user: "postgres",
      password: "yxWGXRSIBR3AKVOXhFvN",
      database: "railway",
    };
  }
});

module.exports = knex;

