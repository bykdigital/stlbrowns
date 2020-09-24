
var $ = require('./DOM');
var Class = require('./oop/Class');
var Device = require('./Device');
var Util = require('./Utils');
var Velocity = require('velocity-animate');

var arrowRight, arrowLeft;

var Carousel = new Class({

	initialize: function( element, opts ) {

		this.options = opts;
		this.index = 0;
		this.el = element;
		this.wrapper = $.select('.slides', element);
		this.slides = $.select('.slide', element);

		this.addListeners();
		this.move();
	},

	addListeners: function() {

		var _this = this;
		arrowRight = $.select('.arrow-right', this.el)[ 0 ];
		arrowLeft = $.select('.arrow-left', this.el)[ 0 ];

		if( Device.system.touch ) {

			$.on( arrowRight, 'touchend', function() { _this.updateIndex(1) } );
			$.on( arrowLeft, 'touchend', function() { _this.updateIndex(-1) } );
		} else {

			$.on( arrowRight, 'click', function() { _this.updateIndex(1) } );
			$.on( arrowLeft, 'click', function() { _this.updateIndex(-1) } );
		}
	},

	move: function() {

		var amt = (this.slides[ 0 ].scrollWidth) * (this.index * -1);

		Velocity(this.wrapper, {
			translateX: amt,
			translateZ: 0
		}, {
			duration: this.options.speed || 350,
			easing: this.options.easing || 'easeInOutCubic',
			queue: false
		});

		$.show(arrowLeft);
		$.show(arrowRight);

		if( this.index == 0 ) $.hide(arrowLeft);
		if( this.index == (this.slides.length - 1) ) $.hide(arrowRight);
	},

	updateIndex: function( amt ) {

		this.index = Util.clamp(this.index + amt, 0, this.slides.length - 1);
		this.move();
	},

	resize: function() {

		this.move();
	}
});

module.exports = Carousel;