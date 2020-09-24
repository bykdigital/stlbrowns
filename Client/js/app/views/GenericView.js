var fs = require('fs');

var Class = require('./../components/oop/Class');
var View = require('./../components/View');
var Velocity = require('velocity-animate');
var $ = require('./../components/DOM');

var Data = require('./../Data');
var Config = require('./../Config');
var Serialize = require('./../components/FormSerializer');
var Loader = require('./../components/Loader');
var Util = require('./../components/Utils');

var SmoothScroll = require('./../components/SmoothScroll');

var headerDark = false, headerHeight;
var footer = fs.readFileSync(__dirname + '/templates/footer.html', 'utf8');

var testEmail = function(email) {

	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

var isVisible = function(el) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= -rect.height &&
        rect.bottom >= 0
    );
};

var GenericView = new Class({

	name: "generic-view",
	Extends: View,
	templates: {

		"about": fs.readFileSync(__dirname + '/templates/about.html', 'utf8'),
		"membership": fs.readFileSync(__dirname + '/templates/membership.html', 'utf8'),
		"news-and-events": fs.readFileSync(__dirname + '/templates/blog.html', 'utf8'),
		"contact": fs.readFileSync(__dirname + '/templates/contact.html', 'utf8')

	},

	init: function( data, onComplete ) {

		var _this = this;
		var r = data.route.split('/')[ 1 ]
		this.template = this.templates[ r ];
		Data.Config = Config;

		Data.trimmedTitle = function() {

			return function (text, render) {

				var t = render(text);

				if( t.length > 70 ) {
					var tr = Util.truncate(t, 70) + '...';
					return tr;
				} else {
					return t;
				}
			}
		};

		var nav = this.navController = $.select('.nav-controller');
		$.removeClass(nav, 'dark');

		this.render(Data, Stage);

		$.addClass('page ' + r + '-view', this.div);

		//- set up smooth scroll renderer
		this.renderer = new SmoothScroll( this.onRender.bind(this) );

		this.content = $.select('.content', this.div);
		this.title = $.select('.page-title h1', this.div);
		this.backgroundImage = $.select('.bg', Stage);

		var header = $.select('.page-title', this.div);
		headerHeight = header[ 0 ].scrollHeight;

		// attach footer to content div
		this.content[ 0 ].innerHTML += footer;

		this.bindUI();

		setTimeout(onComplete, 100);
	},

	bindUI: function() {

		var form = this.form = $.select('form', this.div)[ 0 ];

		if( form ) $.on(form, 'submit', this.formSubmit);

		$.on(this.div, 'click', function(e) {

			if( $.hasClass(e.target, 'twitter') || $.hasClass(e.target, 'facebook') ) {

				e.preventDefault();

				var href = e.target.getAttribute('href');

				window.open(href, null, 'height=420, width=550');
			}
		});
	},

	formSubmit: function( e ) {

		var form = this.form;

		var error = $.select('.error', form)[ 0 ];
		var button = $.select('.submit', form)[ 0 ];

		e.preventDefault();

		$.css(error, { display: 'none' });
		button.disabled = true;

		var valid = true;
		var required = $.select('[data-required]', form);

		for( var i = 0; i < required.length; i ++ ) {

			var input = $.select('input, textarea, select', required[ i ])[ 0 ];
			var type = input.getAttribute('type') || 'text';
			var val = input.value;

			if( type == 'text' && val == '' ) valid = false;
			if( type == 'email' && !testEmail(val) ) valid = false;
		}

		if( valid ) {

			var data = Serialize(e.target);
			var form = $.select('#contact')[ 0 ];

			$.css(form, {
				height: form.scrollHeight
			});

			Loader.post('/api/contact?', data, function( res ) {

				form.innerHTML = '<p>' + res.message + '</p>';
			});
		} else {

			$.css(error, { display: 'block' });
			button.disabled = false;
		}
	},

	animateOut: function( onComplete ) {

		Velocity(this.div, {
			opacity: [ 0, 1 ]
		}, {
			duration: 1000,
			complete: onComplete
		});

		this.renderer.stopRender();
	},

	animateIn: function( onComplete ) {

		this.renderer.startRender();

		Velocity(this.div, {
			opacity: [ 1, 0 ]
		}, {
			duration: 1000,
			complete: onComplete,
			easing: 'linear'
		});

		this.backgroundImage = $.select('.bg', Stage);
		this.sections = $.select('.top', this.div);
		this.resize();
	},

	onRender: function( scr ) {

		var op = 1 - ((scr / 2) / -100);

		$.transform(this.content, {
			y: scr
		});

		$.transform(this.backgroundImage, {
			y: (scr * -0.075)
		});

		$.transform(this.title, {
			y: (scr * 0.15)
		}).css(this.title, {
			opacity: op
		});

		for( var i = 0; i < this.sections.length; i ++ ) {

			var visible = isVisible(this.sections[ i ]);

			if( scr < -headerHeight ) {

				if( visible && !headerDark ) {

					$.addClass('dark', this.navController);
					headerDark = true;
				} else if( !visible && headerDark ) {

					$.removeClass(this.navController, 'dark');
					headerDark = false;
				}
			} else {

				if( headerDark ) {

					$.removeClass(this.navController, 'dark');
					headerDark = false;
				}
			}
		}
	},

	resize: function( w, h ) {

		var max = Math.max(0, (this.div.scrollHeight - window.innerHeight));
		this.renderer.setLimits((max * -1), 0);

		var header = $.select('.page-title', this.div);
		headerHeight = header[ 0 ].scrollHeight;
	}
});

module.exports = GenericView;