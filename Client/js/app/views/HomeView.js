var fs = require('fs');

var Device = require('./../components/Device');
var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');
var Config = require('./../Config');

var HomeView = new Class({

	name: "home-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/home.html', 'utf8'),

	init: function( data, onComplete ) {

		var _this = this;
		var nav = $.select('.nav-controller');
		$.removeClass(nav, 'dark');

		data.config = Config;

		this.render( data );
		$.addClass('page', this.div);

		this.titles = $.select('.title', this.div);

		Velocity.hook(this.titles, "opacity", 0);

		if( !Device.system.touch ) {

			var video = document.createElement('video');
			video.autoplay = true;
			video.loop = true;

			video.src = Config.cdn + 'video/home-loop.' + Device.media.video;

			$.css(video, {
				opacity: 0
			});

			video.addEventListener('loadeddata', function(e) {
				
				_this.div.appendChild(video);

				Velocity(video, {
					opacity: 1
				}, {
					duration: 500
				});
			});
			
		}

		$.append(this.div, Stage);
		
		onComplete();
	},

	animateIn: function( onComplete ) {

		var content = $.select('.content .inner', this.div);

		Velocity(this.div, {
			opacity: [ 1, 0 ],
			translateZ: 0
		}, {
			duration: 4000,
			complete: onComplete,
			easing: 'easeOutCubic'
		});

		Velocity(this.titles, "transition.slideUpIn", {
			stagger: 400,
			duration: 1000,
			easing: 'easeOutCubic'
		});

		Velocity(content, {
			rotateX: [ 0, 15 ]
		}, {
			duration: 1200,
			easing: 'easeOutCubic'
		});

		setInterval(function() {

			var x = (Math.random() * 6) - 3;
			var y = (Math.random() * 6) - 3;

			Velocity(content, {
				blur: 3,
				translateX: x,
				translateY: y,
				translateZ: 0
			}, {
				duration: 10,
				loop: 1
			});
		}, 4000);
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: 0,
			translateZ: 0
		}, {
			duration: 2000,
			complete: onComplete,
			easing: 'easeOutCubic'
		});

		Velocity(this.titles, "transition.slideDownOut", {
			stagger: 100,
			duration: 500,
			easing: 'easeOutCubic'
		});

	},

	resize: function( w, h ) {

		// console.log(w, h);
	}
});

module.exports = HomeView;