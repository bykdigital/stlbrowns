
var fs = require('fs');
var Config = require('./../Config');
var Class = require('./oop/Class');
var hasNative = 'addEventListener' in ( new Image() );

function checkProgress( src, image ) {

	// intermediate checker for queue remaining. not exported.
	// called on preLoader instance as scope
	var args = [];
	var o = this.options;

	// call onProgress
	o.onProgress && src && o.onProgress.call(this, src, image, this.completed.length);

	if (this.completed.length + this.errors.length === this.queue.length) {
		args.push(this.completed);
		this.errors.length && args.push(this.errors);
		o.onComplete.apply(this, args);
	}

	return this;
}

var Preloader = new Class({

	initialize: function(images, options) {

		this.options = {
			pipeline: false,
			auto: true,
			prefetch: false,
			onComplete: function() {}
		};

		options && typeof options == 'object' && this.setOptions(options);

		this.addQueue(images);
		this.queue.length && this.options.auto && this.processQueue();
	},

	animateIn: function( onComplete ) {


	},

	animateOut: function( onComplete ) {

		var _this = this;

		Velocity(this.div, {
			opacity: 0
		}, {
			duration: 500,
			complete: function() {

				_this.engine.stop();
				onComplete();
			}
		});
	},

	setOptions: function( options ) {
		
		// shallow copy
		var o = this.options, key;

		for (key in options) options.hasOwnProperty(key) && (o[key] = options[key]);

		return this;
	},

	addQueue: function( images ) {
		
		this.queue = images;

		return this;
	},

	reset: function() {

		this.completed = [];
		this.errors = [];

		return this;
	},

	addEvents: function(image, src, index) {

		var _this = this;
		var o = this.options;

		var cleanup = function() {

				this.removeEventListener('error', abort);
				this.removeEventListener('abort', abort);
				this.removeEventListener('load', load);
			};

		var abort = function() {

				cleanup.call(this);

				_this.errors.push(src);
				o.onError && o.onError.call(_this, src);
				checkProgress.call(_this, src);
				o.pipeline && _this.loadNext(index);
			};

		var load = function() {

				cleanup.call(this);

				// store progress. this === image
				_this.completed.push(src); // this.src may differ
				checkProgress.call(_this, src, this);
				o.pipeline && _this.loadNext(index);
			};

		image.addEventListener('error', abort, false);
		image.addEventListener('abort', abort, false);
		image.addEventListener('load', load, false);

		return this;
	},

	load: function( src, index ) {

		var image = new Image;

		this.addEvents(image, Config.cdn + src, index);

		// actually load
		image.src = Config.cdn + src;

		return this;
	},

	loadNext: function( index ) {

		// when pipeline loading is enabled, calls next item
		index++;
		this.queue[index] && this.load(this.queue[index], index);

		return this;
	},

	processQueue: function() {

		// runs through all queued items.
		var i = 0,
			queue = this.queue,
			len = queue.length;

		// process all queue items
		this.reset();

		if (!this.options.pipeline)
			for (; i < len; ++i) this.load(queue[i], i);
		else this.load(queue[0], 0);

		return this;
	}
})

module.exports = Preloader;