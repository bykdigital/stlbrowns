
var fs = require('fs');

var Class = require('./oop/Class');
var View = require('./View');

var $ = require('./DOM');
var Loader = require('./Loader');
var Config = require('./../Config');
var Velocity = require('velocity-animate');
var Device = require('./../components/Device');

var Overlay = new Class({

	Extends: View,
	name: 'overlay',
	template: '',
	templates: {
		players: fs.readFileSync(__dirname + '/../views/templates/players-overlay.html', 'utf8'),
		'history-section': fs.readFileSync(__dirname + '/../views/templates/history/overlay.html', 'utf8')
	},
	active: false,

	init: function( parent ) {

		this.parent = parent;

		Velocity.hook(this.div, "opacity", 0);

		$.append(this.div, parent.div);
	},

	populate: function( playerData, tpl ) {

		this.template = this.templates[ tpl ];
		var _this = this;

		this.render(playerData);
		this.content = $.select('.inner', this.div);
		this.items = $.select('.stats > div', this.div);
		this.mouseBug = $.select('.mouse-bug', this.div);
		this.closeBtn = $.select('.close', this.div);

		setTimeout(function() {
			_this.resize();
		}, 100);

		this.animateIn();
	},

	animateIn: function() {

		var url = $.select('.url', this.div);
		var controller = $.select('.nav-controller');

		$.removeClass(controller, 'dark');

		Velocity(this.div, {
			opacity: 1,
			translateZ: 0
		}, {
			display: 'block',
			easing: 'easeOutCubic',
			duration: 500
		});

		Velocity(this.content, {
			blur: [ 0, 5 ],
			top: [ 0, 35 ],
			opacity: [ 1, 0 ],
			translateZ: 0
		}, {
			easing: 'easeOutCubic',
			duration: 1200
		});

		Velocity(this.items, "transition.slideUpIn", {
			stagger: 100
		});

		Velocity(this.closeBtn, {
			opacity: [ 1, 0 ]
		}, {
			duration: 500,
			easing: "easeOutCubic"
		});

		Velocity(url, {
			opacity: [ 1, 0 ]
		}, {
			duration: 750,
			delay: 1000,
			easing: "easeOutCubic"
		});
	},

	animateOut: function() {

		Velocity(this.div, {
			opacity: 0
		}, {
			display: 'none',
			easing: 'easeOutCubic',
			duration: 500
		});

		var controller = $.select('.nav-controller');

		$.addClass('dark', controller);
	},

	resize: function( w, h ) {

		
	}
});

module.exports = Overlay;