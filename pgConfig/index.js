// const pg = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: config.DATABASE_URL,
//     host: config["DB_HOST"],
//     port: config["DB_PORT"],
//     user: config["DB_USER"],
//     database: config["DB_NAME"],
//     password: config["DB_PASSWORD"],
//     ssl: config["DB_SSL"] ? { rejectUnauthorized: false } : false,
//   }
// });

const knex = require('knex')({
  client: 'postgres',
  connection: async () => {

    return {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'suporte123',
      database : 'energy-manager',
    };
  }
});

module.exports = knex;

