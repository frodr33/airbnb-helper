const { Pool } = require('pg');
var config = require('./db-config.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var getUsers;

let pool;
if (config.production){
  getUsers = (req, response) => {
    pool = new Pool({
      connectionString: config.prod_db.host,
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
  pool = new Pool({
    port: config.local_db.port,
    database: config.local_db.database,
    user: config.local_db.user,
    password: config.local_db.password,
    host: config.local_db.host
  }); 
  
getUsers = (request, response) => {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
        console.log(error);
      }
      response.status(200).json(results.rows)
    })
  };
}

registerUser = (request, response) => {
  pool.query(`CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, username VARCHAR(100)
   NOT NULL, password VARCHAR(100) NOT NULL)`)
    .then(() => signUp(request.body))
    .then(() => response.send("User Registered"))
    .catch((err) => console.error("ERROR Executing query: ", err.stack))
}

// works
// logInUser = (request, response) => {
//   let {username, password} = request.body;
//   pool.query(`SELECT password FROM users WHERE username = $1 `, [username])
//   .then((data) => bcrypt.compare(password, data.rows[0].password))
//   .then((result) => {
//     if (result) response.send("SUCCESSFUL LOGIN");
//     else response.send("LOGIN FAILED")
//   })
//   .catch((err) => console.error("ERROR Logging in: ", err.stack)) 
// }

logInUser = (request, response) => {
  let {username, password} = request.body;
  pool.query(`SELECT password FROM users WHERE username = $1 `, [username])
  .then((data) => bcrypt.compare(password, data.rows[0].password, (err, result) => {
    if (!result) response.status(401).send("Incorrect Username or Password")
    else {
      console.log("SUCCESSFUL LOGIN");
      const SECRET = "tripitsecret"; // PUT IN ENV VARIABLES LATER! DO NOT HARD CODE
      const token = jwt.sign({username}, SECRET, {
        expiresIn: "1h"
      });
      response.cookie('token', token, {httpOnly: true})
        .sendStatus(200);
    }
  }))
  .catch((err) => {
    console.log(err);
    response.status(401).send("Incorrect Username or Password")
  })


  // pool.query(`SELECT password FROM users WHERE username = $1 `, [username])
  // .then((data) => bcrypt.compare(password, data.rows[0].password))
  // .then((result) => {
  //   if (result) response.send("SUCCESSFUL LOGIN");
  //   else response.send("LOGIN FAILED")
  // })
  // .catch((err) => {
  //   console.error("ERROR Logging in: ", err.stack);
  //   response.send("INCORRECT EMAIL OR PASSWORD")
  // }) 
}

dropDB = () => {
  pool.query(`DROP TABLE users`, (err, res) => {
    if (err) console.log(err);
  })
}

signUp = (user) => {
  hashPassword(user.password)
    .then((hashedPassword) => {
      console.log(hashedPassword)
      delete user.password
      user.secret_password = hashedPassword
    })
    .then(() => createToken())
    .then(token => user.token = token)
    .then(() => createUser(user))
    .then(user => {
      delete user.secret_password
    })
}

// app/models/user.js
// check out bcrypt's docs for more info on their hashing function
const hashPassword = (password) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) =>
    bcrypt.hash(password, saltRounds, (err, hash) => {
      err ? reject(err) : resolve(hash)
    })
  )
}

// user will be saved to db - we're explicitly asking postgres to return back helpful info from the row created
const createUser = (user) => {
  pool.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING *', [user.username, user.secret_password], (error, results) => {
    if (error) {
      console.log(error);
    }
    console.log(results);
  })
}

// crypto ships with node - we're leveraging it to create a random, secure token
const createToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, data) => {
      err ? reject(err) : resolve(data.toString('base64'))
    })
  })
}


module.exports = {
  getUsers,
  logInUser,
  registerUser,
  dropDB
}