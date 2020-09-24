var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');

var ListView = require('./PlayersListView');
var PhotoView = require('./PlayersPhotoView');
var Overlay = require('./../components/Overlay');

var $ = require('./../components/DOM');
var Config = require('./../Config');
var VirtualScroll = require('./../components/VirtualScroll')();
var Util = require('./../components/Utils');

var _ = require('underscore');
var _data = require('./../Data').players;


var PlayersView = new Class({

	name: "players-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/players-main.html', 'utf8'),
	overlay: new Overlay(),

	init: function( data, onComplete ) {

		var nav = $.select('.nav-controller');
		$.addClass('dark', nav);

		_data.config = Config;

		this.data = _data;

		this.render(this.data);
		$.addClass('page', this.div);

		$.append(this.div, Stage);

		//- initialize separate views
		this.photoView = new PhotoView();
		this.listView = new ListView();

		this.listView.init();
		this.photoView.init();

		this.overlay.init( this );
		this.currentView = this.photoView;

		this.addListeners();
		onComplete();
	},

	addListeners: function() {

		var _this = this;
		var controls = $.select('.controls', this.div);
		var controlItems = $.select('li', controls);

		$.on(controls[ 0 ], 'click', function(e) {

			if( $.hasClass(e.target, 'list') ) {

				$.removeClass(controlItems, 'active');
				_this.swap(_this.listView);
				_this.currentView = _this.listView;
				$.addClass('active', controlItems[ 1 ]);
			} else if( $.hasClass(e.target, 'explore') ) {

				$.removeClass(controlItems, 'active');
				_this.swap(_this.photoView);
				_this.currentView = _this.photoView;
				$.addClass('active', controlItems[ 0 ]);
			}
		});

		$.on(this.div, 'click', function(e) {

			var attr = $.attr(e.target, 'data-href');
			var btn = $.hasClass(e.target, 'info');
			var overlay = e.target.className == 'close';

			if( attr && btn ) {

				e.preventDefault();
				e.stopPropagation();

				var player = _.findWhere(_data.players, { "key": attr });
				_this.showOverlay( player );
			} else if( overlay ) {

				e.preventDefault();
				_this.hideOverlay();
			}
		});
	},

	swap: function( newContent ) {

		this.currentView.animateOut(newContent);
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 0, 1 ]
		}, {
			duration: 1000,
			complete: onComplete
		});

		this.currentView.animateOut();
	},

	animateIn: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1000,
			complete: onComplete,
			easing: 'linear'
		});

		this.currentView.animateIn();
	},

	showOverlay: function( playerData ) {

		this.overlay.populate( playerData, "players" );

		Velocity(this.currentView.div, {
			opacity: [ 0.5, 1 ]
		}, {
			duration: 1500,
			easing: 'easeOutCubic',
			mobileHA: false
		});

		if( this.currentView == this.photoView ) {

			this.photoView.renderer.stopRender();
		}	
	},

	hideOverlay: function() {

		Velocity(this.currentView.div, {
			opacity: [ 1, 0.5 ]
		}, {
			duration: 500,
			easing: 'easeOutCubic',
			mobileHA: false
		});

		this.overlay.animateOut();

		if( this.currentView == this.photoView ) {

			this.photoView.renderer.startRender();
		}
	},

	resize: function( w, h ) {

		this.photoView.resize( w, h );
		this.overlay.resize( w, h );
	}
});

module.exports = PlayersView;