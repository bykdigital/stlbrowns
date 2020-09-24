// routes/api/players.js

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var player = mongoose.model('players');

// GET /admin/players
router.get('/', function (req, res) {

	mongoose.model('players').find(function(err, p) {

		res.render('admin/players/players', {
			section: 'Players',
			players: p
		});

	});
    
});

// GET /admin/players/create
router.get('/create', function (req, res) {

	res.render('admin/players/create', {
		section: 'Players'
	});
    
});

// GET /admin/players/edit/:id
router.get('/edit/:id', function (req, res) {

	console.log(req.params.id);
	player.findOne({ _id: req.params.id }, function (err, plyr) {
		res.render('admin/players/edit', {
			"player": plyr
		});
	});
    
});

module.exports = router;