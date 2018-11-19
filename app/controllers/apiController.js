var lodash = require('lodash');
var fs = require('fs');


var friendsDB;
module.exports = function (req, res){
  //Reading my database file
  var data = fs.readFileSync('./app/data/friends.js');
  //Converting my data coming from database file to JSON
  friendsDB = JSON.parse(data.toString());
  var newFriend = req.body;

  var bestMatch = {
    name: '',
    photo: '',
    totalDiff: 50
  };
  //Substracting the scores arrays of new friend and friend from the database file
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
  //looping over the friends database and check
  //which friend scores array is the cloeset to the new friend scores array
  var userExists = false;
  for(var j=0; j < friendsDB.length; j++){
    var friendArr = friendsDB[j];
    var newFriendScoreArr = newFriend['scores[]'];
    var scoreDiff = subtractarrays((friendArr.scores || friendArr['scores[]']), newFriendScoreArr);
    if(scoreDiff <= bestMatch.totalDiff){
      bestMatch.name = friendArr.name;
      bestMatch.photo = friendArr.photo;
      bestMatch.totalDiff = scoreDiff;
    }
    if(friendsDB[j].name.toLowerCase().indexOf(req.body.name.toLowerCase()) === 0 ){
      userExists = true;
    }

  }

  if(userExists === false){
    res.json(bestMatch);
    friendsDB.push(req.body);
    var updatedFriendsDB = new Buffer.from(JSON.stringify(friendsDB));
    fs.writeFile('./app/data/friends.js', updatedFriendsDB);
  }
  else {
    res.json(false);
  }
  //updating my database file with the new friend that has been added if friend exists don not add
}
