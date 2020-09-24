
var Router = require('./Router');
var ViewManager = require('./ViewManager');
var ViewMediator = require('./ViewMediator');

function Application( descriptor ) {

	if( !( this instanceof Application ) )
		return new Application( descriptor );

	this.settings = descriptor;
}

Application.prototype = {

	init: function() {

		var s = this.settings;

		if( s === undefined )
			throw new Error( 'You must define a settings object at initialization' );

		if( s.routes === undefined )
			throw new Error( 'You must define routes in your settings object' );

		s.autoResize = s.autoResize === undefined ? true : s.autoResize;

		this.onRouteCallback = s.onRoute;
		s.routes.onRoute = this.show.bind( this );
		this.router = Router(s.routes);

		this.vm = ViewManager( this.settings );

		if( s.autoResize ) {

			window.addEventListener( 'resize', this.onResize.bind( this ) );
			window.addEventListener( 'orientationchange', this.onResize.bind( this ) );
			this.onResize();
		}

		if( s.initSection ) {
			this.show( s.initSection.bind( undefined, this.router.init.bind( this.router ) ) );
		} else {
			this.router.init();
		}
	},

	show: function( content, data ) {

		if( this.onRouteCallback )
			this.onRouteCallback( content, data );

		if( Array.isArray( content ) ) {

			var contents = [];

			for( var i = 0, l = content.length; i < l; i ++ ) {

				if( typeof content[ i ] == 'object' ) {
					contents[ i ] = content[ i ];
				} else if( typeof content[ i ] == 'function' ) {
					contents[ i ] = new content[ i ];
				}
			}

			this.doShow( ViewMediator.apply( undefined, contents ), data );
		} else if( typeof content == 'object' ) {

			this.doShow( content, data );
		} else if( typeof content == 'function' ) {

			this.doShow( new content, data );
		}
	},

	doShow: function( content, data ) {

		this.vm.show( content, data );
	},

	resize: function( w, h ) {

		this.vm.resize( w, h );
	},

	onResize: function( w, h ) {

		this.resize( window.innerWidth, window.innerHeight );
	},

	go: function( to ) {

		this.router.go( to );
	}
}

module.exports = Application;