var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');

var ContactView = new Class({

	name: "contact-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/contact.html', 'utf8'),

	init: function( data, onComplete ) {

		var nav = $.select('.nav-controller');
		$.addClass('dark', nav);

		this.render(data, Stage);
		$.addClass('page', this.div);

		onComplete();
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 0, 1 ]
		}, {
			duration: 1000,
			complete: onComplete
		});
	},

	animateIn: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1000,
			complete: onComplete
		});
	},

	resize: function( w, h ) {

		// console.log(w, h);
	}
});

module.exports = ContactView;