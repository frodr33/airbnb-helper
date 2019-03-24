const express = require('express');
const path = require('path');
const { Pool, Client } = require('pg');
// const db = require('./queries')

const app = express();

// This is just for Monday, its just to display
// our names and netIds...I could easily but this on 
// the front end but now you guys can see how data 
// from the backend is transferred to front end
const team = {
  'Frank Rodriguez': 'Fsr32',
  'Aditya Jha': 'Aj377',
  'Jacob Mathai': 'Jm2463',
  'Orvill De La Torre':'Od52',
  'Tharun Sankur':'Tps87'
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Endpoint definitions
app.get('/api/passwords', (req, res) => {

  // Return them as json
  res.json(team);

  console.log(`Sent team names`);
});


app.get('/api/users', (req, res) => {
  let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })
  
  pool.connect().then( client => {
    client.query('SELECT * FROM team_members;', (err, res) => {
      release();
      if (err) console.log(err);
      res.status(200).json(res.rows)
    })
  })
  .catch(e=> {
    console.log(e)
  })
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);