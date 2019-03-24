const { Pool, Client } = require('pg');
var config = require('./db-config.js');
var getUsers;

if (config.production){
  getUsers = (req, response) => {
    let pool = new Pool({
      connectionString: config.host,
      ssl: true
    });
    
    pool.connect().then( client => {
      client.query('SELECT * FROM team_members;', (err, res) => {
        if (err) {
          console.log(err);
        }
        response.status(200).json(res.rows);
      })
    })
    .catch(e=> {
      console.log(e);
    })
  };

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
  };
}

module.exports = {
  getUsers
}