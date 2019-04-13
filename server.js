const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const db = require('./queries')
const app = express();
const http = require("http");
const { spawn } = require('child_process');


// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on ${port}`);

/* Endpoints */
// Commenting out the database stuff for now
// app.get('/api/users', db.getUsers)

app.get("/api", (req, res) => {
  res.json("HELLO WORLD");
})

app.post("/api/airbnbListings", (req, res) => {
  console.log("received")
  console.log(JSON.stringify(req.body))
  const pyProgram = spawn("Python", ["./machine-learning/test.py",JSON.stringify(req.body)])

  pyProgram.stdout.on("data", (chunk) => {
    console.log("return");
    console.log(chunk);
    console.log(chunk.toString('utf8'))
  })

  // res.json("successfully received form submission")
})

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
