// const PRODUCTION = false;
var config = {
    production: false,
    local_db : {
      host:"localhost",
      database:"api",
      user:"me",
      password:"password",
      port: "5432"
    },
    prod_db : {
      host:"process.env.DATABASE_URL",
    }
  }
  
// Temporary
// var config_production = {
//   db:{
//     host:"process.env.DATABASE_URL",
//   },
// }

module.exports = config;
