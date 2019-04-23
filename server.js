const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const db = require('./queries');
const app = express();
const { spawn } = require('child_process');
const retrieveImage = require('./web-scraping')
require('dotenv').config()
const foursquareRequest = require('./api.js')
var http = require("http");
let listingVenueMap = new Map();

// setInterval(function() {
//     http.get("http://trip-it-v2.herokuapp.com");
// }, 300000); 

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on ${port}`);

/* Endpoints */
app.get("/api/getVenues/:id", (req, res) => {
  /* Returns the venue information given the specific
   * listing ID provided as a query parameter to the
   * endpoint */
  res.json(listingVenueMap.get(parseInt(req.params.id)))
});

app.get("/api/getYelpData", (req, res) => {
  getYelpData(37.782907, -122.418898, "dinner")
  .then(d => res.send(d));
})

function getYelpData(lat, long, term) {
  // console.log("INSIDE OF GET YELP DATA")
  // console.log(lat, long, term)
  let input = {
    term: term,
    latitude: lat,
    longitude: long,
    radius: "none"
  }
  let yelpProgram = spawn("python", ["./machine-learning/query_yelp.py",JSON.stringify(input)])
  
  return new Promise((resolve, reject) => {
    yelpProgram.stdout.on("data", (chunk) => {
      // console.log("OUTPUT OF YELP PROGRAM")
      // console.log(input)
      // console.log(chunk.toString('utf8'))
      let out = JSON.parse(chunk.toString('utf8'));
      // console.log(out);
      resolve(out);
    })    
  })
}

app.post("/api/getListings", (req, res) => {
  /* Use python scripts and req to obtain the
   * listing ID's, for now, listingID is hard
   * coded below */

  let result;
  const pyProgram = spawn("python", ["./machine-learning/keywords.py",JSON.stringify(req.body)])
  pyProgram.stdout.on("data", (chunk) => {
    // console.log(chunk.toString('utf8'))
    let df = JSON.parse(chunk.toString('utf8'));
    // console.log("RETURN FROM KEYWORDS");
    // console.log(df);
    let listingPromises = []
    let venuePromises = []
    let listings = []
    let listingObjs = df.listings;

    let globalListings;


    for (let i = 0; i < listingObjs.length; i++) {
      let coordinates = [listingObjs[i].location.latitude, listingObjs[i].location.longitude]
      let venues = getYelpData(coordinates[0], coordinates[1], "dinner"); 
      listingPromises.push(retrieveImage(listingObjs[i].id));
      venuePromises.push(venues)
    }

    Promise.all(listingPromises)
    .then(() => {
      for (let i = 0; i < listingPromises.length; i++) {

        listingPromises[i].then(d => listings.push(
          {
            listingID: listingObjs[i].id,
            name: listingObjs[i].name,
            host_name: listingObjs[i].host_name,
            price: listingObjs[i].price,
            listingURL: d,
            keywords: listingObjs[i].keywords
          }
        ))
      }
      return listings;
    })
    .then((listings) => {
      globalListings = listings;
      return Promise.all(venuePromises).then((data) => data).catch(err => console.log(err))
    })
    .then((res) => {
      console.log(res)
      return new Promise((resolve, reject) => {
        for (let i = 0; i < res.length; i++) {
          console.log(res[i])
          let data = res[i].results;
          let venueDatas = [];
          data.forEach((venue) => {
            let venueData = {
              name: venue[1],
              rating: venue[0],
              latitude: venue[4][0],
              longitude: venue[4][1],
              type: venue[3],
              source: venue[2]
            }
            venueDatas.push(venueData);
          })
          listingVenueMap.set(listingObjs[i].id, venueDatas)  
        }   
        resolve("Done")     
      })
    })
    .then((d) => {
      return globalListings;
    })
    .then((d) => res.send(d))
    .catch((err) => {
      console.log(err);
    })
  })
})

app.post('/api/register', db.registerUser);

app.post('/api/login', db.logInUser)

// app.get('/api/getUsers', db.getUsers)

// app.get('/api/clearDB', (req, res) => {
//   db.dropDB();
// })

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
