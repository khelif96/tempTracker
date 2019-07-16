
console.log('Starting Server');
const apiRouter = require('./routes/api');

// Lets check for necessary dependencies
try {
  var express = require('express');
  var cors = require('cors');
  var bodyParser = require('body-parser');
  var mongoose = require('mongoose');
  require('dotenv').config();

} catch (e) {
  console.log('Error loading dependencies');
  console.log('Did you run npm install?');
  process.exit(1);
}

if (!process.env.DB_URL) {
  console.log('Could not find required DB_URL env variable');
  console.log('Did you forget to set it');
  process.exit(1);
}

// mongodb config
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true}); // Connect to database on Server
console.log("Connecting too " + process.env.DB_URL);
var db = mongoose.connection;

db.once('open', function() {
  // we're connected!
  console.log("Status Code " + mongoose.connection.readyState + " Connected");
});

// When the connection is disconnected
db.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

db.on('error', function(){
  console.log('ERROR Status Code ' + mongoose.connection.readyState);
});

process.on('SIGINT', () => {
  server.close(function() {
    console.log('Closed Server');
    process.exit(0);
  });
});

var app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Configure app to use bodyParser()
// This will let us get data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', apiRouter);

var server = app.listen(port, () => {
  console.log('Server is Listening on port ' + port);
}).on('error', () => {
  console.log('Server through an exception when trying to listen on port %d', port);
  console.log('Is there anything running on port %d ?', port);
  process.exit(1);
});
