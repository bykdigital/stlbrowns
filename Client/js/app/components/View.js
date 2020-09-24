
var Class = require('./oop/Class');
var Mustache = require('mustache');
var bonzo = require('bonzo');

var View = new Class({
	
	initialize: function() {

		this.div = document.createElement('div');

		if( this.name )
			this.div.className = this.name;

		if( this.template )
			Mustache.parse(this.template);
	},

	render: function( data, parent, prepend ) {

		var html = Mustache.render( this.template, data );
		
		this.div.innerHTML = html;

		if( parent ) {
			
			if( prepend )
				bonzo(parent).prepend(this.div);
			else
				bonzo(parent).append(this.div);
		}
	},

	destroy: function() {

		this.div.parentNode.removeChild( this.div );
	}
});

module.exports = View;