const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const db = require('./queries');
const app = express();
const http = require("http");
const { spawn } = require('child_process');
const retrieveImage = require('./web-scraping')
// const readData = require('./processListings')

// retrieveImage(2539)
//   .then(res => console.log(res))
// console.log(webScraper(2595));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

async function asyncForEach(array, cb) {
  // array.forEach((d) => {
  //   await cb(d)
  // })
  for (let i = 0; i < array.length; i++) {
    await cb(array[i]);
  }
}

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

  res.json(listingId)
})

app.post("/api/getListings", (req, res) => {
  /* Use python scripts and req to obtain the 
   * listing ID's, for now, listingID is hard
   * coded below */
  console.log("here")

  let listingId = [2539, 2595, 3330, 3647, 3831] 
  let listingPromises = []
  let listings = []

  listingId.forEach((listing) => {
    listingPromises.push(retrieveImage(listing))
  })

  Promise.all(listingPromises)
  .then(() => {
    for (let i = 0; i < listingPromises.length; i++) {
      listingPromises[i].then(d => listings.push(
        {
          listingID: listingId[i],
          listingURL: d
        }
      ))
    }
    return listings;
  })
  .then((d) => {
    console.log(d);
    res.json(d);
  })
})

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
