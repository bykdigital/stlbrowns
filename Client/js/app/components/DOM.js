
var Class = require('./oop/Class');
var qwery = require('qwery');
var bonzo = require('bonzo');
var on = require('dom-event');
var off = on.off;

var DOMObj = {

	_bonzo: bonzo,

	select: function( selector, context ) {

		var el = qwery( selector, context );

		return el;
	},

	addChild: function( type, parent ) {

		var el = document.createElement(type);

		parent.appendChild(el);

		return el;
	},

	append: function( el, parent ) {

		bonzo(parent).append(el);
	},

	prepend: function( el, parent ) {

		bonzo(parent).prepend(el);
	},

	addClass: function( klass, element ) {

		if( !element ) {

			var html = qwery('html');
			bonzo(html).addClass(klass);
			
		} else {
			bonzo( element ).addClass( klass );
		}

		return this;
	},

	setClass: function( klass, element ) {

		bonzo( element ).attr('class', klass);
	},

	removeClass: function( element, klass ) {

		bonzo(element).removeClass(klass);

		return this;
	},

	attr: function( element, attribute ) {

		return bonzo(element).attr(attribute);
	},

	hasClass: function(element, klass) {

		return bonzo(element).hasClass(klass);
	},

	css: function( element, styles ) {

		bonzo( element ).css( styles );

		return this;
	},

	hide: function( element ) {

		bonzo( element ).hide();

		return this;
	},

	show: function( element ) {

		bonzo( element ).show();

		return this;
	},

	center: function( element, w, h ) {

		var height = w || bonzo( element ).dim().height;
		var width = h || bonzo( element ).dim().width;

		bonzo( element ).css({
			position: 'absolute',
			top: '50%',
			left: '50%',
			marginTop: height / -2,
			marginLeft: width / -2
		});

		return this;
	},

	size: function( element, w, h ) {

		var styles = {
			width: w,
			height: h ? h : w
		};

		bonzo(element).css(styles);

		return this;
	},

	on: function( el, ev, func ) {

		on(el, ev, func);
	},

	off: function( el, ev, func ) {

		off(el, ev, func);
	},

	html: function( el, html ) {

		bonzo(el).html(html);
	},

	hover: function( el, over, out ) {

		this.css(el, { cursor: 'pointer' });

		on(el, 'mouseover', over);
		on(el, 'mouseout', out);
	},

	width: function( el, w ) {

		if( !w )
			return bonzo(el).dim().width
		else
			bonzo(el).css({
				width: h
			});
	},

	height: function( el, h ) {

		if( !w ) {
			
			return bonzo(el).dim().height
		} else {

			bonzo(el).css({
				height: h
			});
		}
	},

	transform: function( el, values ) {

		var t = "";
		var force2d = false;

		if ( values.x ) t += "translateX(" + values.x + "px) ";
		if ( values.y ) t += "translateY(" + values.y + "px) ";
		if ( !force2d ) t += "translateZ(0) ";

		if ( values.rotX ) t += "rotateX(" + values.rotX + "deg)  ";
		if ( values.rotY ) t += "rotateY(" + values.rotY + "deg)";
		if ( values.rotZ ) t += "rotateZ(" + values.rotZ + "deg) ";
		else if (values.rotZ ) t += "rotate(" + values.rotZ + "deg) ";

		if ( values.scaleX && values.scaleX != 1 ) t += "scaleX(" + values.scaleX + ") ";
		if ( values.scaleY && values.scaleY != 1 ) t += "scaleY(" + values.scaleY + ") ";
		if ( values.scaleZ && values.scaleZ != 1 ) t += "scaleZ(" + values.scaleZ + ")";
		if ( values.scale && values.scale != 1 ) t += "scale(" + values.scale + ")";

		bonzo(el).css({
			"transform": t
		});

		return this;
	}

};

module.exports = DOMObj;