

var Class = require('./oop/Class');

var Easer = require('./Easer');
var VirtualScroll = require('./VirtualScroll')();
var Loop = require('raf-loop');

var SmoothScroll = new Class({

	initialize: function( callback, easeVal ) {

		easeVal = easeVal || 0.15;

		this.callback = null;
		this.callback = callback;
		this.easer = new Easer( easeVal );
		this.engine = new Loop( this.onRender.bind(this) );
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

		var d = (e.deltaX + e.deltaY) * 0.5;
		this.easer.updateTarget(d);
	},

	onRender: function(delta) {

		var scr = this.easer.easeVal();
		this.callback(scr, delta);
	},

	startRender: function() {

		this.addListeners();
		this.engine.start();
	},

	stopRender: function() {

		this.engine.stop();
		this.removeListeners();
	},

	setTarget: function( target ) {

		this.easer.setTarget( target );
	}
});

module.exports = SmoothScroll;