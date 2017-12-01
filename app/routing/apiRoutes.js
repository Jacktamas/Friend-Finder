var fs = require('fs');
var data = fs.readFileSync('./app/data/friends.js');
var friendsDB = JSON.parse(data.toString());
var apiController = require('../controllers/apiController.js')

module.exports = function(app) {

  app.get("/api/friends", function(req, res) {
    res.json(friendsDB);
  });
  
  app.post('/api/friends', apiController)
};
