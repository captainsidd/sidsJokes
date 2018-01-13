logMessage('Server.js started');

//import dependencies
require('dotenv').config();
var CronJob = require('cron').CronJob;
var Twitter = require('twitter');
var firebase = require('firebase');

function logMessage(message) {
  message = message + ' :  ' + new Date().toLocaleString()
  require('fs').appendFile('log.txt', message + '\n', function(err) {
    if(err) {
      logMessage(err);
    }
  });
}

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
logMessage('Firebase app initialized');

//cron job for twitter posting
var job = new CronJob({
  cronTime: '00 37 6 * * *',
  onTick: function() {
    logMessage('Cron job running');

    //fetch data from firebase
    firebase.database().ref('/tweets').orderByKey().once('value').then(function(snapshot) {
      logMessage('Jokes fetched from database');

      var jokeKey = null;
      var keys = Object.keys(snapshot.val());
      var data = Object.values(snapshot.val()); // now data is an array of objects
      for(var i = 0; i < data.length; i++) {
        object = data[i];
        jokeKey = keys[i];
        if(object.joke.length <= 140) {
          //awesome! we have a valid tweet, lets tweet it out.
          var message = { status: object.joke };
          client.post('statuses/update', message,  function(error, tweet, response) {
            if(error) {
              logMessage('Tweet failed: ' + error.message);
            } else {
              //remove sent tweet from database
              var ref = firebase.database().ref('tweets/' + jokeKey);
              ref.remove().then(function() {
                logMessage('Removed sent joke');
              }).catch(function(error) {
                logMessage('Removal of sent joke failed: ' + error.message);
              });
            }
            logMessage('Tweet successfully sent');
          });
          break;
        } else { // if not valid, remove the tweet
          logMessage('Invalid tweet found');
          var ref = firebase.database().ref('tweets/' + childSnapshot.key);
          ref.remove().then(function() {
            logMessage('Removed invalid tweet');
          }).catch(function(error) {
            logMessage('Removal of invalid tweet failed: ' + error.message);
          });
        }
      }
    }).catch(function(error) {
      logMessage('Fetching data from Firebase failed: ' + error.message);
    });
  },
  start: false,
  timeZone: 'America/New_York'
});

job.start();

logMessage('Cron job initialized');
