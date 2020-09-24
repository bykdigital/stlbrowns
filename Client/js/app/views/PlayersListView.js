var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var Loop = require('raf-loop');

var $ = require('./../components/DOM');
var Config = require('./../Config');
var VirtualScroll = require('./../components/VirtualScroll')();
var Util = require('./../components/Utils');

var _ = require('underscore');
var _data = require('./../Data').players;

var PlayersView = new Class({

	name: "players-list-view",
	Extends: View,
	template: fs.readFileSync(__dirname + '/templates/players-list.html', 'utf8'),

	init: function( data, onComplete ) {

		var sorted = _.sortBy(_data.players, "lastName");
		_data.players = sorted;

		this.render(_data);

		var content = $.select('.content', '.players-view');
		$.append(this.div, content);

		this.list = $.select('li', this.div);

		$.hide(this.div);

		Velocity.hook(this.list, "opacity", 0);
	},

	animateOut: function( newContent ) {

		var _this = this;

		Velocity(this.div, {
			opacity: 0
		}, {
			mobileHA: false,
			stagger: 100,
			duration: 250,
			display: 'none',
			complete: function() {

				// _this.destroy();
				if( newContent && newContent.animateIn ) newContent.animateIn();
			}
		});
	},

	animateIn: function( onComplete ) {

		$.show(this.div);

		Velocity(this.div, {
			opacity: 1
		}, {
			mobileHA: false,
			duration: 500
		});

		Velocity(this.list, "transition.fadeIn", {
			stagger: 40,
			duration: 400,
			mobileHA: false
		});
	},

	resize: function( w, h ) {

		// console.log(w, h);
	}
});

module.exports = PlayersView;