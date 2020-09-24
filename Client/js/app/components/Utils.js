
var $ = require('./DOM');

var Utils = {

	randomChar: function(type){

		var pool = "";
		
		if (type == "lowerLetter"){
			pool = "abcdefghijklmnopqrstuvwxyz0123456789";
		}
		else if (type == "upperLetter"){
			pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		}
		else if (type == "symbol"){
			pool = ",.?/\\(^)![]{}*&^%$#'\"";
		}
		
		var arr = pool.split('');
		return arr[Math.floor(Math.random()*arr.length)];
	},

	clamp: function(value, start, end) {
		if(value < start) return start;
		else if(value > end) return end;
		else return value;
	},

	scrollCheck: function(el, scr, callback) {

		var all = $.select(el);

		for (var i = 0; i < all.length; i ++) {
			
			var _this = all[i];
			
			if ( $.hasClass(_this, 'active') ) {
				continue
			}

			var top_fifth_of_object = _this.offsetTop + _this.scrollHeight / 3 - 100;
			var bottom_of_window = scr + window.innerHeight;

			/* If the object is a third over the fold, fade it in */
			if( bottom_of_window > top_fifth_of_object ) {
				$.addClass(_this, 'active');
				callback(_this, i);
			}
		}
	},

	debounce: function(func, wait, immediate) {

		var timeout;
		return function() {
			
			var context = this, args = arguments;

			var later = function() {

				timeout = null;
				if (!immediate) func.apply(context, args);
			};

			var callNow = immediate && !timeout;

			clearTimeout(timeout);

			timeout = setTimeout(later, wait);

			if (callNow) func.apply(context, args);
		}
	},

	norm: function(value , min, max) {
		//- Normalizes a number from another range into a value between 0 and 1.
		return (value - min) / (max - min);
	},

	splitText: function(el) {

		var t = el.innerText;
		var arr = t.split('');
		var inject = '';

		if (arr.length) {

			for( var i = 0; i < arr.length; i ++ ) {

				var item = arr[ i ];

				if( item == ' ' )
					item = '&nbsp;';
				inject += '<span>' + item + '</span>';
			}

			el.innerHTML = '';
			el.innerHTML = inject;
		}
	},

	randomBtwn: function(minVal, maxVal) {
		return minVal + (Math.random() * (maxVal - minVal));
	},

	truncate: function(str, len) {

		//trim the string to the maximum length
		var trimmedString = str.substr(0, len);

		//re-trim if we are in the middle of a word
		trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

		return trimmedString;
	}

};

module.exports = Utils;