var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');
var Config = require('./../Config');

var Preloader = require('./../components/PreLoader');
var Ticker = require('./../components/Ticker');

var Images = require('./../components/Bundle');
var ImagesContainer = $.select('#image-store')[ 0 ];

var PreloaderView = new Class({

	name: "preloader",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/preloader.html', 'utf8'),

	initialize: function( onComplete ) {

		var _this = this;
		var data = {
			config: Config
		};

		this.onPreloadComplete = onComplete;

		this.loader = new Preloader(Images, {
			pipeline: true,
			onProgress: _this.onProgress.bind(this),
			onComplete: _this.onComplete.bind(this)
		});

		this.render(data, document.body);

		this.progress = $.select('.progress', this.div)[ 0 ];
	},

	animateIn: function( onComplete ) {

		
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: 0
		}, {
			display: 'none',
			duration: 1200,
			complete: onComplete
		});
	},

	onProgress: function( img, imageEl, index ) {

		// fires every time an image is done or errors. 
		// imageEl will be falsy if error
		// console.log('just ' +  (!imageEl ? 'failed: ' : 'loaded: ') + img);

		ImagesContainer.appendChild( imageEl );
		
		var percent = Math.floor((100 / this.loader.queue.length) * this.loader.completed.length);

		this.progress.innerHTML = percent + '%';
	},

	onComplete: function( loaded, errors ) {

		// fires when whole list is done. cache is primed.
		// console.log('done', loaded);

		ImagesContainer.parentNode.removeChild( ImagesContainer );
		
		if ( errors ) {
			console.log('the following failed', errors);
		}

		this.onPreloadComplete();
	},

	destroy: function() {

		document.body.removeChild(this.div);
	}
});

module.exports = PreloaderView;