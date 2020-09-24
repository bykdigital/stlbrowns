var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');

var _data = require('./../Data').blog;

var BlogView = new Class({

	name: "blog-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/blog.html', 'utf8'),

	init: function( routeData, onComplete ) {

		var nav = $.select('.nav-controller');
		$.removeClass(nav, 'dark');

		this.render(_data, Stage);
		$.addClass('page', this.div);

		onComplete();
		this.addListeners();
	},

	addListeners: function() {

		$.on('click', this.div, function(e) {

			// console.log('wat');

			if( $.hasClass(e.target, 'twitter') || $.hasClass(e.target, 'facebook') ) {

				

				e.preventDefault();
			}
		});
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
			complete: onComplete,
			easing: 'linear'
		});
	},

	resize: function( w, h ) {

		// console.log(w, h);
	}
});

module.exports = BlogView;