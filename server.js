const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const db = require('./queries');
const app = express();
const { spawn } = require('child_process');
const retrieveImage = require('./web-scraping')
require('dotenv').config()
const foursquareRequest = require('./api.js')
let listingVenueMap = new Map();

// AFter user makes itinerary, call foursquarerequest for each
// venue and store that data on server. So, for each app.post
// to /api/airbnbListings endpoint, add to Map where key is the
// listingID and the values are a json? of top10 venues at the
// latitude and longitude of that location. Then create another
// endpoint app.get(/api/restauraunts) that contains the listingID
// of the listing clicked on the front end and returns as a response
// returns name of venue, distance, addres. Then on front end, 
// display on right side the top 10 menues when airbnb listing clicked!
// Possible to get picture of listing from places api
// NOTE: Can use other endpoints GET https://api.foursquare.com/v2/venues/VENUE_ID to
// get even more details about the venue! and another endpoint GET https://api.foursquare.com/v2/venues/explore
// returns recommended venues! Can also get a venue's photos here 
// GET https://api.foursquare.com/v2/venues/VENUE_ID/photos
// let venues = foursquareRequest(40.7128, -74.0060, 10);
// venues.then(d => console.log(d))

// venues.then(d => console.log(JSON.parse(d).response['venues']))
// venues.then(d => console.log(d));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on ${port}`);

/* Endpoints */
// app.get('/api/users', db.getUsers)
app.get("/api", (req, res) => {
  // res.json("HELLO WORLD");

  var t = {"destination":"nyc","maxPrice":194,"dates":["2019-04-12T03:42:22.217Z","2019-05-21T03:42:22.217Z"],"numberAdults":3,"duration":"4","neighborhood":"Hell's Kitchen","keywords":["Hot","Cool","Pool"]}
  const pyProgram = spawn("python", ["./machine-learning/keywords.py",JSON.stringify(t)])
  
  pyProgram.stdout.on("data", (chunk) => {
    console.log("return");
    console.log(chunk);
    console.log(chunk.toString('utf8'))
  });

})

app.get("/api/getVenues/:id", (req, res) => {
  /* Returns the venue information given the specific 
   * listing ID provided as a query parameter to the
   * endpoint */
  res.json(listingVenueMap.get(parseInt(req.params.id)))
});

app.post("/api/getListings", (req, res) => {
  /* Use python scripts and req to obtain the 
   * listing ID's, for now, listingID is hard
   * coded below */
  let result;
  const pyProgram = spawn("Python", ["./machine-learning/keywords.py",JSON.stringify(req.body)])
  pyProgram.stdout.on("data", (chunk) => {
    let df = JSON.parse(chunk.toString('utf8'));
    let listingPromises = []
    let listings = []
    let listingObjs = df.listings;
  
    for (let i = 0; i < listingObjs.length; i++) {
      let coordinates = [listingObjs[i].location.latitude, listingObjs[i].location.longitude]
      let venues = foursquareRequest(coordinates[0], coordinates[1], 10);
      venues.then((d) => {
        let venueDatas = [];
        d.forEach((venueResponse) => {
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
            host_name: listingObjs[i].host_name,
            price: listingObjs[i].price,
            listingURL: d
          }
        ))
      }
      return listings;
    })
    .then((d) => {
      result = d;
    })
    .catch((err) => {
      console.log(err);
    })
  });

  pyProgram.on("close", code => {
    res.send(result);
  })
  
})

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
