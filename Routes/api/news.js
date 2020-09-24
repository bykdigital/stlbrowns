// routes/api/news.js

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var post = mongoose.model('posts');
// var aws = require('aws-sdk');

// GET /posts
router.get('/', function (req, res) {
	
	mongoose.model('posts').find({ state: 'published' }, function(err, posts) {
		res.send(posts);
	});

});

// POST /posts/create
router.post('/create', function (req, res) {

	var Post = new post({
		title: req.body.title,
		state: req.body.state,
		date: req.body.date,
		image: req.body.image,
		content: req.body.content
	});

	Post.save(function(err, pst) {
		console.log(pst);
		res.redirect('/admin/news');
	})

});

// GET /posts/delete/:id
router.get('/delete/:id', function (req, res) {

	post.remove({ _id: req.params.id }, function(err, plyr) {
		res.redirect('/admin/news');
	});

});

// POST /posts/update
router.post('/update', function (req, res) {

	post.findById(req.body.postID, function (err, pst) {

		pst.title = req.body.title;
		pst.state = req.body.state;
		pst.date = req.body.date;
		pst.image = req.body.image;
		pst.content = req.body.content;

		pst.save(function (err) {
			if (err) console.log(err);
			res.redirect('/admin/news');
		});

	});

});

router.get('/sign_s3', function(req, res) {

	aws.config.update({ accessKeyId: "", secretAccessKey: "" });

	var s3 = new aws.S3();

	var s3_params = {
		Bucket: "cdn.thestlbrowns.com",
		Key: 'images/news/upload/' + req.query.s3_object_name,
		Expires: 60,
		ContentType: req.query.s3_object_type,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3_params, function(err, data){
		if (err) { console.log(err); }
		else {
			var return_data = {
				signed_request: data,
				url: 'https://' + s3_params.Bucket + '.s3.amazonaws.com/images/news/upload/' + req.query.s3_object_name
			};
			res.write(JSON.stringify(return_data));
			res.end();
		}
	});

});

module.exports = router;