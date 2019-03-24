const { Pool } = require('pg');
var config = require('./db-config');

const pool = new Pool({
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  host: config.db.host
});

const getUsers = (request, response) => {
    pool.query('SELECT * FROM team_members', (error, results) => {
      if (error) {
        console.log(error);
      }
      response.status(200).json(results.rows)
    })
  }

module.exports = {
  getUsers
}