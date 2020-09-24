
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var util = require('util');

var assets = [];

var stream = fs.createWriteStream(__dirname + "/Client/js/app/components/Bundle.js");

function dirTree( filename ) {

	var stats = fs.lstatSync( filename );
	
	// the filename has to be split, due to wildcard routing
	var info = {
			path: filename.split('Public/')[ 1 ],
			name: path.basename( filename )
		};

	if ( stats.isDirectory() ) {

		info.type = "folder";

		info.children = fs.readdirSync(filename).map(function(child) {
			return dirTree( filename + '/' + child );
		});
	} else {

		// Assuming its a file. In real life it could be
		// a symlink or something else

		var type = mime.lookup( filename );
		info.type = type;

		var pathArr = info.path.split('/');
		var i = pathArr [ 1 ]; 
		var qualified = i && i.indexOf('.') > -1; // prevent recursion...

		if( qualified && (type == 'image/png' || type == 'image/jpeg') ) {

			assets.push('"' + info.path + '"');
		}
	}

	return ( info );
}

stream.once('open', function() {

	var data = util.inspect(dirTree(process.argv[2]), false, null);

	stream.write('module.exports = [' + assets + '];');

	stream.end();

	console.log(assets);
	console.log('\n Asset bundle saved...\n \n');
});