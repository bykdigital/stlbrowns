var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var Device = require('./../components/Device');

var $ = require('./../components/DOM');
var Config = require('./../Config');
var Util = require('./../components/Utils');
var SmoothScroll = require('./../components/SmoothScroll');
var Config = require('./../Config');

var _ = require('underscore');
var _data = require('./../Data').players;

var lastCategory = "";
var isVisible = function(el) {

    var rect = el.getBoundingClientRect();
    var threshold = 0.25;

    return (
        rect.top <= (window.innerHeight * threshold) &&
        rect.bottom >= (window.innerHeight * threshold) &&
        rect.left >= -100 &&
        rect.right <= window.innerWidth
    );
};

var PlayersPhotoView = new Class({

	name: "players-photo-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/players-photo.html', 'utf8'),

	init: function( data, onComplete ) {

		var lastCategory;

		_data.activeCategories = [];

		var sorted = _.sortBy(_data.players, "lastName");
		var grouped = _.each(sorted, function( player ) { 

			var category = player['lastName'].substr(0, 1).toLowerCase();
			
			if( category !== lastCategory ) {

				player.category = category;
			    lastCategory = category;

			    _data.activeCategories.push(category);
			}
		});

		_data.players = grouped;
		_data.config = Config;

		this.render(_data);

		var content = $.select('.content', '.players-view');
		$.append(this.div, content);

		this.controls = $.select('.alpha-controls', this.div);
		this.list = $.select('li', this.div);
		this.wrapper = $.select('.player-photos', this.div);

		this.renderer = new SmoothScroll( this.onRender.bind(this), 0.0875 );

		_.each(_data.activeCategories, function(e) {

			var el = $.select('[data-category=' + e + ']', this.controls);
			$.addClass('selected', el);
		});

		this.addListeners();
	},

	addListeners: function() {

		var _this = this;
		var controls = $.select('div', this.controls);
		var indicator = $.select('.indicator', this.controls);

		$.on(this.controls[ 0 ], 'click', function(e) {

			if( !$.hasClass(e.target, 'indicator') ) {

				var category = e.target.innerHTML.toLowerCase();
				var target = $.select('.player-photos [data-category=' + category + ']', Stage)[ 0 ];
				
				if( target ) {

					_this.renderer.easer.setTarget(-target.offsetLeft);

					$.removeClass(controls, 'active');
					$.addClass('active', e.target);

					var active = $.select('.active', _this.controls[ 0 ]);
					var offset = active[ 0 ].offsetLeft;

					Velocity(indicator, {
						translateX: offset
					}, {
						duration: 500,
						easing: 'easeInOutCubic'
					});
				}
			}
		});

		$.on(this.div, 'click', function(e) {

			if( $.hasClass(e.target, 'player') ) {

				var t = e.target.parentNode;
				var offset = t.offsetLeft * -1;

				_this.renderer.setTarget(offset);
			}
		});
	},

	onRender: function( scr ) {

		$.transform(this.wrapper, {
			x: scr
		});

		for( var i = 0; i < this.list.length; i ++ ) {

			var offset = this.list[ i ].offsetLeft;
			var position = offset + scr;
			var absPosition = Math.abs(position);
			var category = $.attr(this.list[ i ], 'data-category');
			
			// get current letter in view
			if( category && category !== lastCategory && isVisible(this.list[ i ]) ) {

				lastCategory = category;
				var controls = $.select('div', this.controls);
				var control = $.select('[data-category="' + category + '"]', this.controls);
				var offset = control[ 0 ].offsetLeft;
				var indicator = $.select('.indicator', this.controls);
				
				$.removeClass(controls, 'active');
				$.addClass('active', control);

				Velocity(indicator, {
					translateX: offset
				}, {
					duration: 500,
					easing: 'easeOutCubic',
					queue: false
				});
			}

			if( !Device.system.touch ) {
				//- opacity
				var o = (( absPosition / 8 ) / 100);
					o = Util.clamp(o, 0, 1);
					o = 1 - o;

				//- x offset
				var tx = absPosition / 7;
					Util.clamp(tx, 0, 100);

				$.transform(this.list[ i ], {
					x: tx
				});

				$.css(this.list[ i ], {
					opacity: o
				});
			}
		}
	},

	animateOut: function( newContent ) {

		var _this = this;

		Velocity(this.div, {
			opacity: 0,
			left: [ 100, 0 ]
		}, {
			duration: 750,
			easing: 'easeOutCubic',
			display: 'none',
			mobileHA: false,
			complete: function() {

				if( newContent && newContent.animateIn ) newContent.animateIn();
			}
		});

		// accomodate for whole div moving...
		Velocity(this.controls, {
			translateX: [ -100, 0 ],
			translateZ: 0
		}, {
			duration: 750,
			display: 'block',
			easing: 'easeOutCubic'
		});

		var bug = $.select('.scroll-bug');
		
		Velocity(bug, {
			opacity: 0
		}, {
			duration: 500,
			easing: 'easeOutCubic'
		});

		this.renderer.stopRender();
	},

	animateIn: function( onComplete ) {

		$.show(this.div);

		this.renderer.startRender();

		Velocity(this.div, {
			opacity: [ 1, 0 ],
			left: [ 0, -100 ]
		}, {
			duration: 1500,
			display: 'block',
			easing: 'easeOutCubic',
			mobileHA: false
		});

		// accomodate for whole div moving...
		Velocity(this.controls, {
			translateX: [ 0, 100 ],
			translateZ: 0
		}, {
			duration: 1500,
			display: 'block',
			easing: 'easeOutCubic'
		});

		var bug = $.select('.scroll-bug');
		Velocity.hook(bug, "opacity", 0);
		$.show(bug);

		Velocity(bug, {
			opacity: 1
		}, {
			duration: 500,
			easing: 'easeOutCubic'
		});
	},

	resize: function( w, h ) {

		var wrapper = $.select('.player-photos', this.div);
		var max = Math.max(0, ( wrapper[0].scrollWidth - (window.innerWidth - 400) ));

		this.renderer.setLimits((max * -1), 0);
	}
});

module.exports = PlayersPhotoView;