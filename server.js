var fs = require('fs');
var path = require('path');
var express = require('express');
// var mongoose = require('mongoose');

var bodyParser = require('body-parser');
var app = express();

var compress = require('compression');
// var serveStatic = require('serve-static');

var port = process.argv[3] || (process.env.PORT || 8000);
var env = process.argv[2] || (process.env.NODE_ENV || 'prod');

// app locals for easy comm from server -> client
app.locals.moment = require('moment');
app.locals.env = env;

// helper for fixing paths for various environments
var fixPath = function (pathString) {
	return path.resolve(path.normalize(pathString));
};

// -----------------
// Configure express
// -----------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/Public'));
app.use(compress());
app.set('view engine', 'jade');
app.set('views', fixPath('Views'));

if( 'dev' == env ) {
	app.use(express.static(fixPath('Client')));
	// mongoose.connect('mongodb://jfisher:11111575@kahana.mongohq.com:10055/browns_test');
}

if( 'prod' == env ) {
	// mongoose.connect('mongodb://jfisher:11111575@kahana.mongohq.com:10055/browns_prod');
}

//- pull in models
fs.readdirSync(fixPath('Models')).forEach(function(filename){
	if( ~filename.indexOf('.js') ) require( fixPath('Models/' + filename) );
});

//-
var router = require('./Routes/index.js')(app);

// Error Handling
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
});

// export main app object
module.exports = app;

// -----------------
// Set our client config cookie
// -----------------
// app.use(function (req, res, next) {
//     res.cookie('config', JSON.stringify(config.client));
//     next();
// });

// listen for incoming http requests on the port as specified in our config
app.listen(port);
console.log("Da Browns are running at: http://0.0.0.0:" + port);
