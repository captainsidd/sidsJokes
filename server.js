//import dependencies
require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var CronJob = require('cron').CronJob;
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//set up server
var port = 4242;
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

//handle joke posting
app.post('/api/joke', function(req, res) {
  console.log(req.body);
  //put into jokes.json
});

//host webpage
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port);
console.log('Serving on: http://localhost:' + port);

//cron job for twitter posting
var job = new CronJob({
  cronTime: '00 30 11 * * 1-5',
  onTick: function() {
    //read from jokes.json
    var message = {};

    client.post('statuses/update', message,  function(error, tweet, response) {
      if(error) throw error;
      console.log(tweet);  // Tweet body.
      console.log(response);  // Raw response object.
    });

  },
  start: false,
  timeZone: 'America/New_York'
});
job.start();
