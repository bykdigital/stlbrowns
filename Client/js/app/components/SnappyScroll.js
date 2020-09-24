
var Class = require('./oop/Class');

var Easer = require('./Easer');
var VirtualScroll = require('./VirtualScroll')();
var Loop = require('raf-loop');
var Util = require('./Utils');

var lastAnimation = null;
var timeNow = null;
var waitTime = 1000;
var index = 0;

var SnappyScroll = new Class({

	initialize: function( callback, easeVal, wait ) {

		easeVal = easeVal || 0.15;

		if( wait ) waitTime = wait;

		this.callback = callback;
		this.easer = new Easer( easeVal );
		this.engine = new Loop( this.onRender.bind(this) );
		this.scrAmt = 0;
	},

	setIndex: function( idx ) {

		var e = {
			deltaX: (index < idx) ? -1 : 1,
			deltaY: 0,
			x: 0,
			Y: 0,
			originalEvent: {
				type: null
			}
		}

		this.onScroll(e);
	},

	setMaxIndex: function( i ) {

		this.maxIndex = parseInt(i) - 1;
	},

	setWidth: function( _width ) {

		this.scrAmt = _width;
	},

	setLimits: function(_min, _max) {

		this.easer.setLimits(_min, _max);
	},

	addListeners: function() {

		VirtualScroll.on( this.onScroll.bind(this) );
	},

	removeListeners: function() {

		VirtualScroll.off( this.onScroll.bind(this) );
	},

	onScroll: function(e) {

		if( e.originalEvent.type && e.originalEvent.type !== 'keydown' ) e.originalEvent.preventDefault();

		timeNow = new Date().getTime();

		if (timeNow - lastAnimation < waitTime) {
			
			return false;
		} else {

			// update scroll position here
			var a;
			var b = this.easer.getTarget();
			var amtX = Math.abs( e.deltaX );
			var amtY = Math.abs( e.deltaY );

			if( amtX > amtY ) {

				a = e.deltaX < 0 ? this.scrAmt * -1 : this.scrAmt;
				(e.deltaX < 0) ? (index = index + 1) : (index = index - 1);
			} else if( amtY > amtX ) {

				a = e.deltaY < 0 ? this.scrAmt * -1 : this.scrAmt;
				(e.deltaY < 0) ? (index = index + 1) : (index = index - 1);
			}

			index = Util.clamp(index, 0, this.maxIndex);
			
			b += a;

			this.easer.setTarget(b);

			if( this.onScrollUpdate )
				this.onScrollUpdate( index );
		}

		lastAnimation = timeNow;
	},

	onRender: function(delta) {

		var scr = this.easer.easeVal();
		this.callback(scr, delta);
	},

	startRender: function() {

		this.addListeners();
		this.engine.start();

		if( this.onScrollUpdate )
			this.onScrollUpdate( index );
	},

	stopRender: function() {

		this.engine.stop();
		this.removeListeners();
	},

	setTarget: function( target ) {

		this.easer.setTarget( target );
	}
});

module.exports = SnappyScroll;