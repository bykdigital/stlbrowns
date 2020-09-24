var express = require('express');
var router = express.Router();

// GET /
router.get('/', function (req, res) {
    
    res.render('admin/index', {
    	section: 'Admin'
    });
});

// News & Events API
router.use('/news', require('./news'));

// Player API
router.use('/players', require('./players'));

module.exports = router;