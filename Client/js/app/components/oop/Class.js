var BaseClass = require( './BaseClass' );

var Class = function( descriptor ) {

	var rval = undefined;

	if ( descriptor === undefined ) {

		descriptor = {};
	}

	if( descriptor.initialize ) {

		rval = descriptor.initialize;
		delete descriptor.initialize;
	} else {

		rval = function() { 

			Array.prototype.splice.apply( arguments, [ 0, 0, this ] );

			Class.parent.apply( undefined, arguments );
		};
	}

	if( descriptor.Extends !== undefined ) {

		descriptor.Extends();
		descriptor.Extends._isConstructor = true;

		rval.prototype = Object.create( descriptor.Extends.prototype );
		
		// this will be used to call the parent constructor
		rval._parentConstructor = descriptor.Extends;
		delete descriptor.Extends;
	} else {

		rval.prototype = Object.create( BaseClass );
		rval._parentConstructor = function() {};
	}

	rval.prototype._getters = {};
	rval.prototype._setters = {};

	for( var i in descriptor ) {
		if( typeof descriptor[ i ] == 'function' ) {
			descriptor[ i ]._name = i;
			descriptor[ i ]._owner = rval.prototype;

			rval.prototype[ i ] = descriptor[ i ];
		} else if( descriptor[ i ] && typeof descriptor[ i ] == 'object' && ( descriptor[ i ].get || descriptor[ i ].set ) ) {
			Object.defineProperty( rval.prototype, i , descriptor[ i ] );

			if( descriptor[ i ].get ) {
				rval.prototype._getters[ i ] = descriptor[ i ].get;
				descriptor[ i ].get._name = i;
				descriptor[ i ].get._owner = rval.prototype;
			}

			if( descriptor[ i ].set ) {
				rval.prototype._setters[ i ] = descriptor[ i ].set;
				descriptor[ i ].set._name = i;
				descriptor[ i ].set._owner = rval.prototype;	
			}
		} else {
			rval.prototype[ i ] = descriptor[ i ];
		}
	}

	// this will be used to check if the caller function is the consructor
	rval._isConstructor = true;

	// now we'll check interfaces
	for( var i = 1; i < arguments.length; i++ ) {
		arguments[ i ].compare( rval );
	}

	return rval;
};	

Class.parent = function( scope ) {

	var caller = Class.parent.caller;

	arguments = Array.prototype.slice.apply( arguments, [ 1 ] )

	// if the current function calling is the constructor
	if( caller._isConstructor ) {
		var parentFunction = caller._parentConstructor;
	} else {
		if( caller._name ) {
			var callerName = caller._name;
			var isGetter = caller._owner._getters[ callerName ];
			var isSetter = caller._owner._setters[ callerName ];

			if( arguments.length == 1 && isSetter ) {
				var parentFunction = Object.getPrototypeOf( caller._owner )._setters[ callerName ];

				if( parentFunction === undefined ) {
					throw 'No setter defined in parent';
				}
			} else if( arguments.length == 0 && isGetter ) {
				var parentFunction = Object.getPrototypeOf( caller._owner )._getters[ callerName ];

				if( parentFunction === undefined ) {
					throw 'No getter defined in parent';
				}
			} else if( isSetter || isGetter ) {
				throw 'Incorrect amount of arguments sent to getter or setter';
			} else {
				var parentFunction = Object.getPrototypeOf( caller._owner )[ callerName ];	

				if( parentFunction === undefined ) {
					throw 'No parent function defined for ' + callerName;
				}
			}
		} else {
			throw 'You cannot call parent here';
		}
	}

	return parentFunction.apply( scope, arguments );
};

module.exports = Class;