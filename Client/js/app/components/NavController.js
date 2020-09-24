var fs = require('fs');

var Velocity = require('velocity-animate');
var Class = require('./oop/Class');
var View = require('./../components/View');
var $ = require('./../components/DOM');
var Device = require('./../components/Device');

var Nav = require('./Nav');
var Config = require('./../Config');
var _data = require('./../Data');

var NavController = new Class({

	name: "nav-controller",
	template: fs.readFileSync(__dirname + '/../views/templates/nav-controller.html', 'utf8'),
	Extends: View,

	initialize: function( parent ) {

		this.render(_data, document.body, true);

		Velocity.hook(this.div, "opacity", 0);

		setTimeout(this.addListeners( parent ), 10000);
	},

	addListeners: function( parent ) {

		var _this = this;
		var icon = $.select('.icon', this.div);
		var items = $.select('span', icon);
		var text = $.select('.text', this.div);

		function handler(e) {

			e.preventDefault();

			if( parent.active ) {
				parent.animateOut();
				$.removeClass(_this.div, 'active');
				parent.active = false;
			}
			else {
				parent.animateIn();
				$.addClass('active', _this.div);
				parent.active = true;
			}
		}

		if( Device.system.touch ) {
			$.on(this.div, 'touchend', handler);
		} else {
			$.on(this.div, 'click', handler);
		}
	},

	animateIn: function() {

		var t = $.select('.title-text', document.body);

		Velocity(this.div, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1200,
			easing: 'easeOutCubic',
			delay: 500
		});

		Velocity(t, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1200,
			easing: 'easeOutCubic',
			delay: 500
		});
	}
});

module.exports = NavController;