

var Class = require('./oop/Class');
var View = require('./View');

var $ = require('./DOM');
var Velocity = require('velocity-animate');

var Ticker = new Class({

	name: 'ticker',
	Extends: View,

	initialize: function( _num ) {

		this.div = document.createElement('div');
		this.div.className = 'ticker';

		var numbers = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].join('\n');
		var num = '<span>' + numbers + '</span>';
		var tpl = '<div class="row row-top">' + num + num + '</div><div class="row row-bottom">' + num + num + '</div>';

		this.div.innerHTML = tpl;

		this.arr = _num.toString().split('');
	},

	animateIn: function() {

		var _this = this;
		var el = $.select('span', this.div);

		for( var i = 0; i < this.arr.length; i ++ ) {

			var amt = parseInt(this.arr[ i ]) * -10 + '%';

			Velocity(el[ i ], {
				translateY: amt
			}, {
				duration: 1000,
				delay: (100 * i) + 250,
				easing: 'easeOutCubic'
			});
		}
	},

	animateOut: function() {


	}
});

module.exports = Ticker;