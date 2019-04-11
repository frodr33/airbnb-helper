const express = require('express');
const path = require('path');
const db = require('./queries')
const app = express();
const http = require("http");
const { spawn } = require('child_process');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/* Endpoints */
// Commenting out the database stuff for now
// app.get('/api/users', db.getUsers)

app.get("/api", (req, res) => {
  res.json("HELLO WORLD");
})

app.get("/api/pyTest", (req, res) => {
  const pyProgram = spawn('Python', ['./machine-learning/test.py', 1, 2, 3])

  pyProgram.stdout.on('data', (chunk) => {
    var textChunk = JSON.parse(chunk.toString('utf8'));
    res.json(textChunk);
    // res.end();
  })
})

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on ${port}`);
