var fs = require('fs');

var Velocity = require('velocity-animate');
var UIPack = require('velocity-animate/velocity.ui');
var Class = require('./oop/Class');
var View = require('./../components/View');
var $ = require('./../components/DOM');
var Util = require('./Utils');
var Device = require('./Device');

var NavController = require('./NavController');
var Config = require('./../Config');
var data = require('./../Data').navigation;

var Nav = new Class({

	name: "nav",
	Extends: View,
	active: false,
	template: fs.readFileSync(__dirname + '/../views/templates/nav.html', 'utf8'),

	initialize: function( onComplete ) {

		data.config = Config;

		this.Controller = new NavController(this);
		this.render(data, document.body, true);

		this.Controller.animateIn();

		this.Sections = $.select('.section, .social', this.div);

		Velocity.hook(this.div, "transform-origin", "top center");
	},

	animateIn: function() {

		this.active = true;

		this.dark = $.hasClass(this.Controller.div, 'dark');

		$.css(this.div, {
			display: 'block'
		});

		var controllers = $.select('.nav-controller', document.body);
		$.addClass('dark', controllers);

		Velocity(this.Sections, "transition.fadeIn",
		{
			stagger: 100,
			duration: 400,
			display: 'block',
			delay: 500
		});

		Velocity(this.div, {
			opacity: [ 1, 0 ],
			translateY: [ 0, 25 ]
		}, {
			duration: 1200,
			delay: 500,
			easing: 'easeOutCubic'
		});

		Velocity(Stage, {
			blur: ( Device.system.touch ) ? 0 : [ 10, 0 ],
			scale: ( Device.system.touch ) ? 1 : 1.01,
			opacity: ( Device.system.touch ) ? 0.15 : 0.25,
			translateZ: 0
		}, {
			duration: 2000,
			easing: 'easeOutCubic'
		});
	},

	animateOut: function() {

		var controller = $.select('.nav-controller');

		if( this.dark ) {
			$.addClass('dark', controller);
		} else {
			$.removeClass(controller, 'dark');
		}
		
		$.removeClass(controller, 'active');

		this.active = false;

		Velocity(this.Sections, "transition.fadeOut",
		{
			stagger: 50,
			duration: 250,
			display: 'block'
		});

		Velocity(this.div, {
			opacity: 0,
			translateY: 10
		}, {
			duration: 350,
			display: 'none'
		});

		Velocity(Stage, {
			blur: 0,
			opacity: 1,
			scale: 1,
			translateZ: 0
		}, {
			duration: 1000,
			easing: 'linear'
		});
	}
});

module.exports = Nav;