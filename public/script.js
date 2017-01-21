var app = angular.module('sidsJokesApp', ['firebase']);

app.controller('formCtrl', function($scope, $firebaseArray) {
  var ref = firebase.database().ref().child('tweets');
  $scope.tweets = $firebaseArray(ref);
  $scope.submit = function() {
    $scope.tweets.$add({
      joke: $scope.joke
    });
  };
});
