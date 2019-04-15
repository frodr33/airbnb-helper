const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const db = require('./queries');
const app = express();
const { spawn } = require('child_process');
const retrieveImage = require('./web-scraping')
require('dotenv').config()
const foursquareRequest = require('./api.js')

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
let venues = foursquareRequest(40.7128, -74.0060, 10);
venues.then(d => console.log(d))
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
