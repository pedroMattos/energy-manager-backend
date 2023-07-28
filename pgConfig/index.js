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
      host : 'containers-us-west-116.railway.app',
      port : 7044,
      user : 'postgres',
      password : 'yxWGXRSIBR3AKVOXhFvN',
      database : 'railway',
    };
  }
});

module.exports = knex;

