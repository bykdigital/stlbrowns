function ViewManager( settings ) {

	if( !( this instanceof ViewManager ) )
		return new ViewManager( settings );

	var s = this.settings = settings || {};
	s.overlap = s.overlap === undefined ? true : s.overlap;
	this.width = s.width || 1000;
	this.height = s.height || 800;

	this.currentContent = null;
	this.newContent = null;
}

ViewManager.prototype = {

	get overlap() {

		return this.settings.overlap;
	},

	set overlap( value ) {

		this.settings.overlap = value;
	},

	show: function( content, data, onComplete ) {

		if( onComplete === undefined && typeof data == 'function' ) {

			onComplete = data;
			data = null;
		}

		if( content != this.newContent && content != this.currentContent ) {

			if( this.newContent && this.newContent.destroy )
				this.newContent.destroy();

			this.newContent = content;

			if( content.init ) {

				if( data )
					content.init( data, this.swap.bind( this, this.newContent, onComplete ) );
				else
					content.init( this.swap.bind( this, this.newContent, onComplete ) );
			} else {

				this.swap( this.newContent, onComplete );
			}
		}
	},

	clear: function( onComplete ) {

		if( this.newContent && this.newContent.destroy )
			this.newContent.destroy();

		if( this.currentContent ) {

			var oldOut = function( oldContent ) {

				if( oldContent.destroy )
					oldContent.destroy();

				if( onComplete )
					onComplete( oldContent );
			}.bind( this, this.currentContent );

			if( this.currentContent.animateOut )
				this.currentContent.animateOut( oldOut );
			else
				oldOut();
		}
	},

	resize: function( w, h ) {

		var s = this.settings;

		s.width = w;
		s.height = h;

		if( this.currentContent && this.currentContent.resize )
			this.currentContent.resize( w, h );
	},

	swap: function( newContent, onComplete ) {

		if( newContent == this.newContent ) {

			var s = this.settings;
			var oldContent = this.currentContent;
			var onOldContentOut;
			var onNewContentIn = function() {

				if( s.endAnimateIn )
					s.onEndAnimateIn( newContent, onComplete );

				if( onComplete )
					onComplete( newContent, oldContent );
			}

			//- resize content if it can be resized
			newContent.resize && newContent.resize( s.width, s.height );

			//- start animate in callback
			if( s.onStartAnimateIn )
				s.onStartAnimateIn( newContent, this.currentContent );

			//- check for content on screen already
			if( this.currentContent ) {

				onOldContentOut = function() {

					if( s.onEndAnimateOut )
						s.onEndAnimateOut( newContent, oldContent );

					if( oldContent.destroy )
						oldContent.destroy();

					if( !s.overlap ) {

						if( newContent.animateIn )
							newContent.animateIn( onNewContentIn );
						else 
							onNewContentIn();
					}
				};

				if( s.onStartAnimateOut )
					s.onStartAnimateOut( newContent, oldContent );

				if( oldContent.animateOut )
					oldContent.animateOut( onOldContentOut );
				else
					onOldContentOut();

				if( s.overlap ) {

					if( newContent.animateIn )
						newContent.animateIn( onNewContentIn );
					else
						onNewContentIn();
				}
			} else {

				//- just bring in new content
				if( newContent.animateIn )
					newContent.animateIn( onNewContentIn );
				else 
					onNewContentIn();
			}

			this.currentContent = newContent;
			this.newContent = null;
		}
	}
};

module.exports = ViewManager;