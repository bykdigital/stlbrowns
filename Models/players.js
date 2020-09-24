var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playersSchema = new Schema({
	name: String
});

mongoose.model('players', playersSchema)