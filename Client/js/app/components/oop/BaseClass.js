module.exports = {

	parent: function() {

		//- if the current function calling is the constructor
		if( this.parent.caller._isConstructor ) {

			var parentFunction = this.parent.caller._parentConstructor;
		} else {

			if( this.parent.caller._name ) {

				var callerName = this.parent.caller._name;
				var isGetter = this.parent.caller._owner._getters[ callerName ];
				var isSetter = this.parent.caller._owner._setters[ callerName ];

				if( arguments.length == 1 && isSetter ) {

					var parentFunction = Object.getPrototypeOf( this.parent.caller._owner )._setters[ callerName ];

					if( parentFunction === undefined ) {
						throw 'No setter defined in parent';
					}
				} else if( arguments.length == 0 && isGetter ) {

					var parentFunction = Object.getPrototypeOf( this.parent.caller._owner )._getters[ callerName ];

					if( parentFunction === undefined ) {
						throw 'No getter defined in parent';
					}
				} else if( isSetter || isGetter ) {

					throw 'Incorrect amount of arguments sent to getter or setter';
				} else {

					var parentFunction = Object.getPrototypeOf( this.parent.caller._owner )[ callerName ];	

    				if( parentFunction === undefined ) {
						throw 'No parent function defined for ' + callerName;
					}
				}
			} else {

				throw 'Parent cannot be used in this context';
			}
		}

		return parentFunction.apply( this, arguments );
	}
};