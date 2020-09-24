var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');
var SmoothScroll = require('./../components/SmoothScroll');

var _ = require('underscore');
var _data = require('./../Data').blog;

var headerDark = false;

var BlogView = new Class({

	name: "blog-post-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/blog-post.html', 'utf8'),

	init: function( routeData, onComplete ) {

		var _this = this;

		this.renderer = new SmoothScroll( this.onRender.bind(this) );

		var postId = routeData.params.id;

		var postData = _.findWhere(_data.posts, { slug: postId });

		this.render(postData, Stage);
		$.addClass('page', this.div);

		this.content = $.select('.post', this.div);
		this.title = $.select('.page-title h1', this.div);

		var header = $.select('.page-title', this.div);
		this.headerHeight = header[ 0 ].scrollHeight;

		onComplete();

		setTimeout(function() {

			_this.resize();
		}, 100);

		this.addListeners();
	},

	addListeners: function() {
		
		$.on(this.div, 'click', function(e) {

			if( $.hasClass(e.target, 'twitter') || $.hasClass(e.target, 'facebook') ) {

				e.preventDefault();

				var href = e.target.getAttribute('href');

				window.open(href, null, 'height=420, width=550');
			}
		});
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 0, 1 ]
		}, {
			duration: 1000,
			complete: onComplete
		});

		this.renderer.stopRender();
	},

	animateIn: function( onComplete ) {

		this.renderer.startRender();

		Velocity(this.div, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1000,
			complete: onComplete,
			easing: 'linear'
		});
	},

	onRender: function( scr ) {

		var op = 1 - ((scr / 5) / -100);

		$.transform(this.content, {
			y: scr
		});

		$.transform(this.title, {
			y: (scr * 0.15)
		}).css(this.title, {
			opacity: op
		});

		if( scr < -this.headerHeight && !headerDark ) {

			$.addClass('dark', this.navController);
			headerDark = true;
		} else if( scr > -this.headerHeight && headerDark ) {

			$.removeClass(this.navController, 'dark');
			headerDark = false;
		}
	},

	resize: function( w, h ) {

		var max = Math.max(0, (this.div.scrollHeight - window.innerHeight));
		this.renderer.setLimits((max * -1), 0);

		var header = $.select('.page-title', this.div);
		this.headerHeight = header[ 0 ].scrollHeight;
	}
});

module.exports = BlogView;