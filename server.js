//import dependencies
require('dotenv').config();
var CronJob = require('cron').CronJob;
var Twitter = require('twitter');
var firebase = require('firebase');

//twitter object setup
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//read from firebase
var config = {
  apiKey: "AIzaSyD4YwHeE2pKlDAWTeBfdEJsIIZb4WLAG-s",
  authDomain: "sidsjokes-adb9b.firebaseapp.com",
  databaseURL: "https://sidsjokes-adb9b.firebaseio.com",
  storageBucket: "sidsjokes-adb9b.appspot.com",
  messagingSenderId: "383575493897"
};
firebase.initializeApp(config);
var ref = firebase.database().ref().child('tweets');
var tweetsArray = $firebaseArray(ref);
setTimeout(function () {

}, 1000);
console.log(tweetsArray);


//cron job for twitter posting
var job = new CronJob({
  cronTime: '00 45 5 * * 1-5',
  onTick: function() {

    //get next in tweetsArray, store as message

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
