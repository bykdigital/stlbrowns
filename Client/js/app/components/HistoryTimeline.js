
var fs = require('fs');

var Class = require('./oop/Class');
var View = require('./View');

var $ = require('./DOM');
var Config = require('./../Config');

var ShuffleLetters = require('./ShuffleLetters')();

var HistoryTimeline = new Class({

	name: 'history-timeline',
	Extends: View,
	template: fs.readFileSync(__dirname + '/../views/templates/history/timeline.html', 'utf8'),
	active: false,

	initialize: function( data ) {

		this.render();

		this.bar = $.select('.bar', this.div);
		this.year = $.select('.year', this.div);
		this.title = $.select('.title', this.div);
		this.indicator = $.select('.indicator', this.div);
	},

	update: function( _year, _title ) {

		ShuffleLetters(this.year, _year);
		ShuffleLetters(this.title, _title);
	},

	animateIn: function() {

		
	},

	animateOut: function() {

		this.removeListeners();
	}
});

module.exports = HistoryTimeline;