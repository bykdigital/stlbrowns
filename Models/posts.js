var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var createSlug = function(title) {
	return title.toString().toLowerCase()
    	.replace(/\s+/g, '-')        // Replace spaces with -
    	.replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    	.replace(/\-\-+/g, '-')      // Replace multiple - with single -
    	.replace(/^-+/, '')          // Trim - from start of text
    	.replace(/-+$/, '');         // Trim - from end of text
}

var postsSchema = new Schema({
	title: String,
	slug: String,
	date: { type: Date, default: Date.now },
	image: String,
	content: String,
	state: String
});

postsSchema.pre('save', function (next) {
	this.slug = createSlug(this.title);
	next(); 
});

mongoose.model('posts', postsSchema)