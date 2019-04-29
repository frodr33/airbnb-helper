const { Pool } = require('pg');
var config = require('./db-config.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
var getUsers;

let pool;
if (config.production){
  pool = new Pool({
    connectionString: config.prod_db.host,
    ssl: true    
  })
  console.log("Set up Production Database");
  
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
    .then(() => {
      console.log("REGISTERED USER")
      const SECRET = "tripitsecret"; // PUT IN ENV VARIABLES LATER! DO NOT HARD CODE
      const username = request.body.username;
      const token = jwt.sign({username}, SECRET, {
        expiresIn: "1h"
      });      
      response.cookie('token', token, {httpOnly: true})
        .sendStatus(200);
    })
    .catch((err) => console.error("ERROR Executing query: ", err.stack))
}

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
}

dropListings = () => {
  pool.query(`DROP TABLE listings`, (err, res) => {
    if (err) console.log(err);
  })
}

dropDB = () => {
  pool.query(`DROP TABLE users`, (err, res) => {
    if (err) console.log(err);
  })
}

signUp = (user) => {
  hashPassword(user.password)
    .then((hashedPassword) => {
      delete user.password
      user.secret_password = hashedPassword
    })
    .then(() => createToken())
    .then(token => user.token = token)
    .then(() => createUser(user))
    .catch((err) => console.log(err))
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

seeListings = (request, response) => {
  pool.query('SELECT * FROM listings', (error, results) => {
    if (error) {
      console.log(error);
    }
    response.status(200).json(results.rows)
  })
};

retriveListings = (req, res) => {
  const token = req.cookies.token;
  const secret =  "tripitsecret";
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.log("Not Authorized")
      res.status(401).send('Unauthorized: Invalid token');
    } else {
      let user = decoded.username;
      pool.query(`SELECT data FROM listings WHERE username = $1`, [user])
      .then((data) => {
        console.log(data.rows)
        res.send(data.rows)
      })  
      .catch((err) => console.log(err))
    }    
  })
}


saveListings = (req,res) => {
  const token = req.cookies.token;
  const SECRET = "tripitsecret"
  jwt.verify(token, SECRET, function(err, decoded) {
    if (err) {
      console.log("Not Authorized")
      res.status(401).send('Unauthorized: Invalid token');
    } else {
      let user = decoded.username;

      pool.query(`CREATE TABLE IF NOT EXISTS listings(id SERIAL PRIMARY KEY, username VARCHAR(100)
      NOT NULL, data jsonb)`)
      .then(() => {
        pool.query(`INSERT INTO listings(username, data) VALUES($1, $2)`, [user, req.body], (err, results) => {
          if (err) res.send("INVALID REQUEST")
          else res.send("GOOD")
          
        })
      })  
      .catch((err) => res.send("ERROR Executing query: ", err.stack))
    }
  });
}


module.exports = {
  getUsers,
  logInUser,
  registerUser,
  dropDB,
  saveListings,
  seeListings,
  retriveListings,
  dropListings
}