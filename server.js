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
  // strObj = req.body.toString();
  // console.log(JSON.parse(strObj.toString('utf8')))
  const pyProgram = spawn("Python", ["./machine-learning/test.py",JSON.stringify(req.body)])

  pyProgram.stdout.on("data", (chunk) => {
    console.log("return");
    console.log(chunk);
    console.log(chunk.toString('utf8'))
    // var textChunk = JSON.parse(chunk.toString('utf8'))
    // console.log(chunk)
    // res.json(textChunk)
  })

  // res.json("successfully received form submission")
})

// Example
// app.get("/api/pyTest", (req, res) => {
//   const pyProgram = spawn('Python', ['./machine-learning/test.py', 1, 2, 3])

//   pyProgram.stdout.on('data', (chunk) => {
//     var textChunk = JSON.parse(chunk.toString('utf8'));
//     res.json(textChunk);
//   })
// })

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
