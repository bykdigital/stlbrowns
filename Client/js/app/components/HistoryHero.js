
var fs = require('fs');

var Class = require('./oop/Class');
var View = require('./View');

var $ = require('./DOM');
var Config = require('./../Config');

var Ticker = require('./../components/Ticker');

var winHeight = window.innerHeight;
var winWidth = window.innerWidth;

var mouse = {
	x: winWidth / 2,
	y: winHeight / 2
};

var mouseTarget = {
	x: mouse.x,
	y: mouse.y
};

var onMouseMove = function(e) {

	mouse.x = (winWidth / 2) - e.pageX;
	mouse.y = (winHeight / 2) - e.pageY;
};

var Hero = new Class({

	name: 'hero',
	Extends: View,
	template: fs.readFileSync(__dirname + '/../views/templates/history/hero.html', 'utf8'),

	initialize: function( data ) {

		var _this = this;

		data.config = Config;

		this.render(data);

		this.addListeners();

		this.coverImg = $.select('.cover-image', this.div);
		this.backgroundImg = $.select('.background-image', this.div);

		//- build number tickers for years
		this.ticker1 = new Ticker(data.dates.from);
		this.ticker2 = new Ticker(data.dates.to);

		$.append(this.ticker1.div, this.div);
		$.append(this.ticker2.div, this.div);
	},

	addListeners: function() {

		$.on(document, "mousemove", onMouseMove);
	},

	removeListeners: function() {

		$.off(document, 'mousemove', onMouseMove);
	},

	onRender: function(scr) {

		mouseTarget.x += (mouseTarget.x - mouse.x) * -0.075;
		mouseTarget.y += (mouseTarget.y - mouse.y) * -0.075;

		$.css(this.div, {
			transform: 'translateY(' + scr * 0.35 + 'px)'
		});

		var x = mouseTarget.x / -100;
		var y = mouseTarget.y / -100;

		var op = 1 - ((scr / 10) / -100);

		$.css(this.coverImg, {
			marginTop: (y * 1.5) + (scr * 0.175),
			marginLeft: x * 1.5,
			opacity: op
		});

		$.css(this.backgroundImg, {
			marginTop: y * 1,
			marginLeft: x * 1
		});

		$.transform(this.ticker1.div, {
			y: (y * 3) + (scr * 0.175),
			x: x * 3
		}).css(this.ticker1.div, {
			opacity: op
		});

		$.transform(this.ticker2.div, {
			y: (y * 3) + (scr * 0.175),
			x: x * 3
		}).css(this.ticker2.div, {
			opacity: op
		});
	},

	animateIn: function() {

		this.ticker1.animateIn();
		this.ticker2.animateIn();		
	},

	animateOut: function() {

		this.removeListeners();
	},

	resize: function( w, h ) {

		$.css(this.div, {
			width: w,
			height: h
		});
	}
});

module.exports = Hero;