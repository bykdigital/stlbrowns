var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var player = mongoose.model('players');

// GET /players
router.get('/', function (req, res) {

    mongoose.model('players').find(function(err, players) {
    	res.send(players);
    });

});

// POST /players/create
router.post('/create', function (req, res) {

	console.log(req.body);

	var Player = new player({
		name: req.body.name
	});

	Player.save(function(err, plyr) {
		res.redirect('/admin/players');
	});

});

// GET /players/delete/:id
router.get('/delete/:id', function (req, res) {

	player.remove({ _id: req.params.id }, function(err, plyr) {
		res.redirect('/admin/players');
	});

});

// POST /players/update
router.post('/update', function (req, res) {

	player.findById(req.body.playerID, function (err, plyr) {
		plyr.name = req.body.name;

		plyr.save(function (err) {
			if (err) return handleError(err);
			res.redirect('/admin/players');
		});
	});
	

});

module.exports = router;