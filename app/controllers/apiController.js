var friendsDB = require("../data/friends.js");
var lodash = require('lodash');

module.exports = function (req, res){
  var newFriend = req.body;
  var bestMatch = {
    name: '',
    photo: '',
    totalDiff: 50
  };
  function subtractarrays(array1, array2){
    var difference = [];
    for( var i = 0; i < array1.length; i++ ) {
      difference.push(Math.abs(array1[i] - array2[i]));
    }
    var friendTotal = lodash.reduce(difference, function(sum, n) {
      return sum + n;
    }, 1);
    return friendTotal;
  }

  for(var j=0; j < friendsDB.length; j++){
    var friendArr = friendsDB[j];
    var newFriendScoreArr = newFriend['scores[]'];
    var scoreDiff = subtractarrays((friendArr.scores || friendArr['scores[]']), newFriendScoreArr);
    if(scoreDiff <= bestMatch.totalDiff){
      bestMatch.name = friendArr.name;
      bestMatch.photo = friendArr.photo;
      bestMatch.totalDiff = scoreDiff;
    }
  }
  res.json(bestMatch);
  friendsDB.push(req.body)
}
