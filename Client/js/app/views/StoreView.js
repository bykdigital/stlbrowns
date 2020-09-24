var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');

var StoreView = new Class({

	name: "store-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/store.html', 'utf8'),

	init: function( data, onComplete ) {

		var nav = $.select('.nav-controller');
		$.addClass('dark', nav);

		var stage = document.querySelector('#stage');		
		this.render(data, stage);
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
			complete: onComplete,
			easing: 'linear'
		});
	},

	resize: function( w, h ) {

		// console.log(w, h);
	}
});

module.exports = StoreView;