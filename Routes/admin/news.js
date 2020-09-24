var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var posts = mongoose.model('posts');

// GET /admin/news
router.get('/', function (req, res) {

	posts.find(function(err, p) {

		res.render('admin/news/news', {
    		section: 'News & Events',
    		posts: p
    	});

	});
    
});

router.get('/create', function (req, res) {

	res.render('admin/news/create', {
    	section: 'News & Events'
    });
    
});

// GET /admin/players/edit/:id
router.get('/edit/:id', function (req, res) {

	posts.findOne({ _id: req.params.id }, function (err, pst) {
		res.render('admin/news/edit', {
			section: 'News & Events',
			post: pst
		});
	});
    
});

module.exports = router;