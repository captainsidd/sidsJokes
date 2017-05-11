var config = {
  apiKey: "AIzaSyD4YwHeE2pKlDAWTeBfdEJsIIZb4WLAG-s",
  authDomain: "sidsjokes-adb9b.firebaseapp.com",
  databaseURL: "https://sidsjokes-adb9b.firebaseio.com",
  storageBucket: "sidsjokes-adb9b.appspot.com",
  messagingSenderId: "383575493897"
};
firebase.initializeApp(config);

var app = angular.module('sidsJokesApp', ['firebase']);

app.controller('formCtrl', function($scope, $firebaseArray) {
  var ref = firebase.database().ref().child('tweets');
  $scope.tweets = $firebaseArray(ref);
  $scope.submit = function() {
    if($scope.joke.length <= 140) {
      $scope.tweets.$add({
        joke: $scope.joke
      });
    }
    $scope.joke = '';
    toastr.options = {"positionClass": "toast-bottom-left"};
    toastr.success('Joke submitted!');
  };
});
