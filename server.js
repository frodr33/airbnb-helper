const express = require('express');
const path = require('path');
const db = require('./queries')
const app = express();
const http = require("http");

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/* Endpoints */
app.get('/api/users', db.getUsers)

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


/* Ping Heroku Address so that website doesn't sleep. Pings
   Every 5 minutes */
   setInterval(function() {
    http.get("http://airbnb-helper.herokuapp.com/");
}, 300000); 

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on ${port}`);
