const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const db = require('./queries');
const app = express();
const { spawn } = require('child_process');
const retrieveImage = require('./web-scraping')
const withAuth = require('./middleware');
var cookieParser = require('cookie-parser')
require('dotenv').config()
const {foursquareCreateRequest, uberCreateRequest} = require('./api.js')
// const uberPriceRequest = require('./uber_api.js')
var http = require("http");
let listingVenueMap = new Map();

// setInterval(function() {
//     http.get("http://trip-it-v2.herokuapp.com");
// }, 300000); 

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post("/api/uberPrices", (req, res) => {
  const body = req.body;
  uberCreateRequest(body.lat1,body.long1,body.lat2,body.long2)
  .then((prices) => {
    res.send(prices);
  })
  .catch((err) => console.log(err))
})

app.get("/api/getYelpData", (req, res) => {
  const input = {
    term: "dinner",
    latitude: 37.782907,
    longitude: -122.418898,
    radius: "none"
  }
  const yelpProgram = spawn("python", ["./machine-learning/query_yelp.py",JSON.stringify(input)])
  yelpProgram.stdout.on("data", (chunk) => {
    console.log(chunk.toString('utf8'))
    let out = JSON.parse(chunk.toString('utf8'));
    console.log(out);
    res.send(out)
  })
})

function getYelpData(lat, long, term) {
  const input = {
    term: term,
    latitude: lat,
    longitude: long,
    radius: "none"
  }
  const yelpProgram = spawn("python", ["./machine-learning/query_yelp.py",JSON.stringify(input)])
  yelpProgram.stdout.on("data", (chunk) => {
    console.log(chunk.toString('utf8'))
    let out = JSON.parse(chunk.toString('utf8'));
    console.log(out);
    res.send(out)
  })
}

app.post("/api/getListings", (req, res) => {
  /* Use python scripts and req to obtain the
   * listing ID's, for now, listingID is hard
   * coded below */

  // console.log("RECEVIED REQUEST FOR GET LISTINGS")
  let result;
  const pyProgram = spawn("python", ["./machine-learning/keywords.py",JSON.stringify(req.body)])
  pyProgram.stdout.on("data", (chunk) => {
    
    let stringChunk;
    let df;
    try {
      stringChunk = chunk.toString('utf8');
      df = JSON.parse(stringChunk);
      console.log("succsesfully parsed JSON from keywords...", df, stringChunk)
      let listingPromises = []
      let listings = []
      let listingObjs = df.listings;
  
      for (let i = 0; i < listingObjs.length; i++) {
        let coordinates = [listingObjs[i].location.latitude, listingObjs[i].location.longitude]
        let venues = foursquareCreateRequest(coordinates[0], coordinates[1], 10);
        venues.then((d) => {
          let venueDatas = [];
          d.forEach((venueResponse) => {
            // console.log(venueResponse)
            let venue = venueResponse.venue;
            let location = venue.location;
            let venueData = {
              id: venue.id,
              name: venue.name,
              address: location.address,
              crossStreet: location.crossStreet,
              latitude: location.lat,
              longitude: location.lng,
              distance: location.distance,
              postalAddress: location.address + " " + location.city + " " + location.state + ", " + location.cc + ", " + location.postalCode
            }
            venueDatas.push(venueData);
          })
          listingVenueMap.set(listingObjs[i].id, venueDatas)
        })
  
        listingPromises.push(retrieveImage(listingObjs[i].id));
      }
  
      Promise.all(listingPromises)
      .then(() => {
        for (let i = 0; i < listingPromises.length; i++) {
  
          listingPromises[i].then(d => listings.push(
            {
              listingID: listingObjs[i].id,
              name: listingObjs[i].name,
              latitude: listingObjs[i].location.latitude,
              longitude: listingObjs[i].location.longitude,
              host_name: listingObjs[i].host_name,
              price: listingObjs[i].price,
              listingURL: d,
              keywords: listingObjs[i].keywords,
              numAdults: df.numberAdults,
              checkin: df.start_date,
              checkout: df.end_date,
              reviewScore: listingObjs[i].review_score
            }
          ))
        }
        return listings;
      })
      .then((d) => {  
        // console.log("...Sending Listings", d)
        res.send(d);
      })
      .catch((err) => {
        console.log(err);
      })
    } catch (err) {
      console.log("SYSTEM CRASHED");
      console.log("raw keywords output", chunk)
      console.log("string chunk", stringChunk);
      console.log("CRASHED", err);
      res.status(401).send(err)
      return;
    }
  });
})

app.post('/api/saveListings', withAuth, db.saveListings);

app.get('/api/checkToken', withAuth, (req, res) => {
  res.sendStatus(200);
});

app.get('/api/guestLogIn', db.guestLogIn)

app.post('/api/register', db.registerUser);

app.post('/api/login', db.logInUser)

app.get('/api/seeListings', db.seeListings)

app.get('/api/retrieveListings', db.retriveListings)

app.get('/api/clearListings', (req, res) => {
  db.dropListings();
})

// app.get('/api/getUsers', db.getUsers)

// app.get('/api/clearDB', (req, res) => {
//   db.dropDB();
// })

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
