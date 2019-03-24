const { Pool, Client } = require('pg');
var config = require('./db-config.js');

var getUsers;
if (config.production){
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  client.connect();
  getUsers = (request, response) => {
    client.query('SELECT * FROM team_members', (error, results) => {
      if (error) {
        console.log("ERRORRRR");
        console.log(error);
      }
      response.status(200).json(results.rows)
    })
    client.end()
  } 

} else {
  const pool = new Pool({
    port: config.local_db.port,
    database: config.local_db.database,
    user: config.local_db.user,
    password: config.local_db.password,
    host: config.local_db.host
  }); 
  getUsers = (request, response) => {
    pool.query('SELECT * FROM team_members', (error, results) => {
      if (error) {
        console.log(error);
      }
      response.status(200).json(results.rows)
    })
  }
}

module.exports = {
  getUsers
}