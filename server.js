const express = require('express');
const path = require('path');
const db = require('./queries')
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

/* Endpoints */
app.get('/api/users', db.getUsers)

app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Server listening on ${port}`);