

var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Mandrill',
    auth: {
        user: 'hlkdigital',
        pass: 'b9s_WnbUNNnYdnujxS4JiA'
    }
});

// POST /api/submit
router.post('/', function (req, res) {

	// console.log(req.body);

	var name = req.body.name;
	var phone = req.body.phone;
	var email = req.body.email;
	var comment = req.body.comment;
	var membershipLevel = req.body.memberlevel;

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: 'St. Louis Browns Inquiries <do-not-reply@thestlbrowns.com>', // sender address
		to: 'stlbrowns@swbell.net',
		subject: 'An inquiry about the St. Louis Browns Historical Society', // Subject line
		text: '', // plaintext body
		html: '<h1>An inquiry about the St. Louis Browns Historical Society</h1><hr />' // html body
	};

	if( name ) mailOptions.html += '<p><b>Name:</b> ' + name + '</p>';
	if( phone ) mailOptions.html += '<p><b>Phone:</b> ' + phone + '</p>';
	if( email ) mailOptions.html += '<p><b>Email:</b> ' + email + '</p>';
	if( membershipLevel ) mailOptions.html += '<p><b>Membership Level:</b> ' + membershipLevel + '</p>';
	if( comment ) mailOptions.html += '<p><b>Comment:</b> ' + comment + '</p>';

	// send mail with defined transport object
	transporter.sendMail( mailOptions, function(err, info ) {

		if( err ) {

			res.send({
				success: false,
				message: "There was an error submitting your request",
				info: err
			});
	    } else {

			res.send({
				success: true,
				message: "Thank you for contacting us.",
				info: info
			});
	    }
	});
});

module.exports = router;