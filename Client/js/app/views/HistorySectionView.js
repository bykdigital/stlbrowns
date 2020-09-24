
var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var _ = require('underscore');

var Hero = require('./../components/HistoryHero');
var HistoryTimeline = require('./../components/HistoryTimeline');

var $ = require('./../components/DOM');
var _data = require('./../Data').historySection;
var Config = require('./../Config');
var Util = require('./../components/Utils');
var Device = require('./../components/Device');

var Overlay = require('./../components/Overlay');
var Carousel = require('./../components/Carousel');

var SmoothScroll = require('./../components/SmoothScroll');
var VirtualScroll = require('./../components/VirtualScroll')();

var threshold = 0.8;

var isVisible = function(el) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top <= (window.innerHeight * threshold) &&
        rect.bottom >= (window.innerHeight * threshold) &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth
    );
};

var HistoryView = new Class({

	name: "history-section-view",
	Extends: View,
	overlay: new Overlay(),
	
	templates: {
		"the-early-years": fs.readFileSync(__dirname + '/templates/history/the-early-years.html', 'utf8'),
		"the-bottom-dwellers": fs.readFileSync(__dirname + '/templates/history/the-bottom-dwellers.html', 'utf8'),
		"the-war-years": fs.readFileSync(__dirname + '/templates/history/the-war-years.html', 'utf8'),
		"the-bill-veeck-era": fs.readFileSync(__dirname + '/templates/history/the-bill-veeck-era.html', 'utf8')
	},

	init: function( routeData, onComplete ) {

		var id = routeData.params.id;

		//- set up container
		$.addClass(id + ' page', this.div);

		$.css(this.div, {
			padding: 0
		});

		var nav = this.nav = $.select('.nav-controller', document.body);
		$.removeClass(nav, 'dark');

		//- save current section
		var id = this.id = routeData.params.id;
		this.template = this.templates[ id ];

		var sectionData = this.data = _.findWhere(_data.sections, { key: id });
		sectionData.Config = Config;

		//- render main view
		this.render( sectionData );

		//- build hero
		this.hero = new Hero( sectionData );

		//- build timeline
		this.timeline = new HistoryTimeline();

		//- render hero and timeline
		$.prepend( this.hero.div, this.div);
		$.prepend( this.timeline.div, this.div);

		//- add to the scene
		$.append(this.div, Stage);

		//- save DOM queries
		this.wrapper = 		$.select('.inner', this.div);
		this.sections = 	$.select('section', this.div);
		this.borders = 		$.select('.border', this.div);
		this.years = 		$.select('[data-year]', this.div);
		this.timelineBar = 	$.select('.timeline-bar', this.div);
		this.carousels = 	[];

		this.currentYear = 		null;
		this.currentSection = 	null;

		//- create carousel(only one of them...)
		var c = $.select('.carousel', this.div);

		for( var i = 0; i < c.length; i ++ ) {
			this.carousels[ i ] = new Carousel( c[ i ], {} );
		}

		//- save scroll position
		this.scr = 0;

		//- wire event listeners
		this.addListeners();

		//- set up renderer for smooooooooooth scrolling
		this.renderer = new SmoothScroll( this.onRender.bind(this) );

		//- set scroll limits on renderer
		this.resize();

		Velocity.hook(this.timeline.div, "opacity", 0);

		this.overlay.init( this );

		//- animate in
		onComplete();
	},

	addListeners: function() {

		var _this = this;
		var bug = $.select('.scroll', this.div);
		var wrapper = $.select('.inner', this.div);
		var max = Math.max(0, wrapper[0].scrollHeight);

		$.on(bug[ 0 ], 'click', function() {

			_this.renderer.setTarget(window.innerHeight * -1);

			setTimeout(function() {
				_this.scrollCheck();
			}, 350);
		});

		var handler = function(e) {

			if( $.hasClass(e.target, 'show-overlay') ) {

				e.preventDefault();

				var section = $.attr(e.target, 'data-overlay');
				var data = _this.data[ 'overlayData' ][ section ];

				_this.overlay.populate(data, 'history-section');
			}

			if( $.hasClass(e.target, 'close') ) {

				_this.overlay.animateOut();
			}
		};

		if( Device.system.touch ) {
			$.on(this.div, 'touchend', handler);
		} else {
			$.on(this.div, 'click', handler);
		}

		VirtualScroll.on(function(e) {
			_this.scrollCheck(e);
		});
	},

	scrollCheck: Util.debounce(function(e) {

		threshold = (e.deltaY > 0) ? 0 : 0.8;

		if( this.scr > -100 ) {

			$.removeClass(this.borders, 'light dark');
			$.removeClass(this.timeline.div, 'light dark');
			$.removeClass(this.timelineBar, 'light dark');
			$.removeClass(this.nav, 'light dark');

			this.currentSection = 'hero';
			this.currentYear = '';
		}

		if( this.scr <= (window.innerHeight * -0.65) ) {

			if( !this.timeline.active ) {

				this.timeline.active = true;

				Velocity(this.timeline.div, {
					opacity: 1
				}, {
					duration: 1000,
					easing: 'easeOutCubic',
				});
			}
		} else {

			if( this.timeline.active ) {

				this.timeline.active = false;
				
				Velocity(this.timeline.div, {
					opacity: 0
				}, {
					duration: 250,
					easing: 'easeOutCubic',
				});
			}
		}

		//- check viewport vis for sections
		for( var i = 0; i < this.sections.length; i ++ ) {

			var _this = this.sections[ i ];

			if( isVisible(_this) && _this !== this.currentSection ) {

				this.currentSection = _this;
				var content = $.select('.content', _this);

				if( !$._bonzo(content).data('visible') ) {

					$._bonzo(content).data('visible', true);

					Velocity(content, {
						opacity: [ 1, 0 ],
						translateY: [ 0, 50 ]
					}, {
						duration: 1200,
						easing: 'easeOutCubic',
						delay: 250
					});
				}
			}
		}

		//- check viewport vis for items tagged with years
		for( var i = 0; i < this.years.length; i ++ ) {

			var _this = this.years[ i ];

			if( isVisible(_this) && this.currentYear !== _this ) {

				// console.log(_this);

				this.currentYear = _this;

				var year = $.attr(_this, 'data-year');
				var title = $.attr(_this, 'data-section-title');
				var theme = $.attr(_this, 'data-theme') || '';
				var navTheme = ( theme == "dark" ) ? '' : 'dark';

				$.removeClass(this.borders, 'light dark');
				$.removeClass(this.timeline.div, 'light dark');
				$.removeClass(this.timelineBar, 'light dark');
				$.removeClass(this.nav, 'light dark');

				$.addClass(theme, this.borders);
				$.addClass(theme, this.timeline.div);
				$.addClass(theme, this.timelineBar);
				$.addClass(navTheme, this.nav);
				
				this.timeline.update(year, title);
			}
		}
	}, 15),

	onRender: function( scr ) {

		this.scr = scr;

		this.hero.onRender(scr);

		$.transform(this.wrapper, {
			y: scr
		});
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 0, 1 ]
		}, {
			duration: 1000,
			complete: onComplete
		});

		this.hero.animateOut();
		this.renderer.stopRender();
	},

	animateIn: function( onComplete ) {

		var _this = this;

		setTimeout(function() {
			_this.resize();
		}, 100);

		Velocity(this.div, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1000,
			complete: onComplete,
			easing: 'linear'
		});

		this.renderer.startRender();
		this.hero.animateIn();
	},

	resize: function( w, h ) {

		this.hero.resize( w, h );

		var wrapper = $.select('.inner', this.div);
		var max = Math.max(0, wrapper[0].scrollHeight);

		this.renderer.setLimits((max * -1), 0);

		for( var i = 0; i < this.carousels.length; i ++ ) {
			Util.debounce(this.carousels[ i ].resize( w, h ), 1000, false);
		}
	}
});

module.exports = HistoryView;