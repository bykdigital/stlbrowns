// routes/api/news.js

var express = require('express');
var router = express.Router();

// GET /fallback
router.get('/', function (req, res) {
	
	res.render('fallback/history', {
    	section: 'History'
    });
});

// GET /fallback/history
router.get('/history', function (req, res) {
	
	res.render('fallback/history', {
    	section: 'History'
    });
});

// GET /fallback/about
router.get('/about', function (req, res) {
	
	res.render('fallback/about', {
    	section: 'About'
    });
});

// GET /fallback/contact
router.get('/contact', function (req, res) {
	
	res.render('fallback/contact', {
    	section: 'Contact'
    });
});

module.exports = router;