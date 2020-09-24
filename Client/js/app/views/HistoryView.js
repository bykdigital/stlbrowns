var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');

var Config = require('./../Config');
var _data = require('./../Data').historySection;
var Util = require('./../components/Utils');
var SnappyScroll = require('./../components/SnappyScroll');
var Shuffle = require('./../components/ShuffleLetters')();

var HistoryView = new Class({

	name: "history-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/history.html', 'utf8'),

	init: function( routeData, onComplete ) {

		_data.config = Config;

		var nav = $.select('.nav-controller');
		$.addClass('dark', nav);

		this.render(_data);
		$.addClass('page', this.div);

		this.sections = $.select('.grid-item', this.div);
		Velocity.hook(this.sections, "opacity", 0);

		$.append(this.div, Stage);

		this.wrapper = $.select('.history-sections', this.div);
		this.content = $.select('li', this.wrapper);
		this.title = $.select('.title', this.div);

		this.renderer = new SnappyScroll( this.onRender.bind(this) );
		this.renderer.setWidth( 770 );
		this.renderer.setMaxIndex( this.content.length );
		this.renderer.onScrollUpdate = this.onScrollUpdate.bind(this);

		this.addListeners();
		onComplete();
	},

	addListeners: function() {

		var _this = this;

		$.on(this.div, 'click', function(e) {

			var t = e.target.parentNode.parentNode; // ...

			if( t !== _this.currentItem ) {

				e.preventDefault();

				var idx = _this.content.indexOf( t );
				_this.renderer.setIndex(idx);
			}
		});
	},

	onRender: function( scr ) {

		$.transform(this.wrapper, {
			x: scr
		});

		for( var i = 0; i < this.content.length; i ++ ) {

			var offset = this.content[ i ].offsetLeft;
			var position = offset + scr;
			var absPosition = Math.abs(position);

			//- opacity
			var o = (( absPosition / 15 ) / 100);
				o = Util.clamp(o, 0, 1);
				o = 1 - o;

			//- scale
			var s = (( absPosition / 50 ) / 100);
				s = Util.clamp(s, 0, 1);
				s = 1 - s;

			$.css(this.content[ i ], {
				opacity: o
			}).transform(this.content[ i ], {
				scale: s
			});
		}
	},

	onScrollUpdate: function( index ) {

		if( index !== this.lastScroll ) {

			var item = this.currentItem = this.content[ index ];

			var d = _data.sections[ index ];
			var ch = 'Chapter ' + (parseInt(index) + 1) + ':';

			var l = $.select('a', this.title);
			var p = $.select('span', this.title);

			Shuffle(p, ch);
			Shuffle(l, d.title)

			l[ 0 ].href = '#/history/' + d.key;
		}

		this.lastScroll = index;
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 0, 1 ]
		}, {
			duration: 1000,
			complete: onComplete
		});

		Velocity(this.sections, "transition.fadeOut", {
			stagger: 500,
			duration: 1000,
			delay: 500
		});

		this.renderer.stopRender();
	},

	animateIn: function( onComplete ) {

		var content = $.select('.inner', this.div);
		var bug = $.select('.scroll-bug');
		$.show(bug);

		Velocity(this.div, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1000,
			complete: onComplete,
			easing: 'linear'
		});

		Velocity(this.sections, "transition.fadeIn", {
			stagger: 500,
			duration: 1000,
			delay: 500
		});

		Velocity(content, {
			opacity: [ 1, 0 ],
			translateX: [ 0, -100 ]
		}, {
			duration: 1500,
			display: 'block',
			easing: 'easeOutCubic'
		});

		Velocity(bug, {
			opacity: [ 1, 0 ]
		}, {
			duration: 500,
			easing: 'easeOutCubic'
		});

		this.renderer.startRender();
	},

	resize: function( w, h ) {

		var wrapper = $.select('.history-sections', this.div);
		var max = Math.max(0, wrapper[0].scrollWidth - 770);

		this.renderer.setLimits(-max, 0);
	}
});

module.exports = HistoryView;