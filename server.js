console.log(new Date().toLocaleString() + ' Server.js started');

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
console.log(new Date().toLocaleString() + ' Firebase app initialized');

//cron job for twitter posting
var job = new CronJob({
  cronTime: '00 23 5 * * *',
  onTick: function() {
    console.log(new Date().toLocaleString() + ' Cron job running');

    var tweetsArray = [];
    firebase.database().ref('/tweets').orderByKey().once('value').then(function(snapshot) {
      console.log(new Date().toLocaleString() + ' Jokes fetched from database');
      var jokeKey = null;
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        if(childData.joke.length <= 140) {
          tweetsArray.push(childData);
          if(jokeKey == null) {
            jokeKey = childSnapshot.key;
          }
        } else {
          console.log(new Date().toLocaleString() + ' Invalid tweet found');
          var ref = firebase.database().ref('tweets/' + childSnapshot.key);
          ref.remove().then(function() {
            console.log(new Date().toLocaleString() + ' Removed invalid tweet');
          }).catch(function(error) {
            console.log(new Date().toLocaleString() + ' Removal of invalid tweet failed: ' + error.message);
          });
        }
      });
      if(tweetsArray.length != 0) {
        var message = { status: tweetsArray[0].joke };
        client.post('statuses/update', message,  function(error, tweet, response) {
          if(error) {
            throw error;
          }
          console.log(new Date().toLocaleString() + ' Tweet successfully sent');
        });
        var ref = firebase.database().ref('tweets/' + jokeKey);
        ref.remove().then(function() {
          console.log(new Date().toLocaleString() + ' Removed sent joke');
        }).catch(function(error) {
          console.log(new Date().toLocaleString() + ' Removal of sent joke failed: ' + error.message);
        });
      } else {
        console.log(new Date().toLocaleString() + ' No jokes to tweet');
      }
    });

  },
  start: false,
  timeZone: 'America/New_York'
});

job.start();
console.log(new Date().toLocaleString() + ' Cron job initialized');
