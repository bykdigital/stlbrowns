var Framework = require('./app/components/Application');
var $ = require('./app/components/DOM');

var PreLoader = require('./app/views/PreloaderView');
var Nav = require('./app/components/Nav');
var HomeView = require('./app/views/HomeView');
var HistoryView = require('./app/views/HistoryView');
var HistorySectionView = require('./app/views/HistorySectionView');
var PlayersView = require('./app/views/PlayersView');
var StoreView = require('./app/views/StoreView');
var BlogPostView = require('./app/views/BlogPostView');
var ContactView = require('./app/views/ContactView');
var GenericView = require('./app/views/GenericView');

var Device = require('./app/components/Device');

(function() {

	var nav = new Nav();

	var app = Framework({
		autoResize: true,
		overlap: !Device.system.touch,
		initSection: PreLoader,
		onRoute: nav.animateOut.bind( nav ),
		routes: {
			'/': HomeView,
			'/history': HistoryView,
			'/history/:id': HistorySectionView,
			'/players': PlayersView,
			'/about': GenericView,
			'/membership': GenericView,
			'/store': StoreView,
			'/news-and-events': GenericView,
			'/news-and-events/:id': BlogPostView,
			'/contact': GenericView
		}
	});

	//- kickitoff
	var exp = window && Device.system.pushstate && window.innerWidth > 767;

	if( exp ) {

		window.Stage = $.select('#stage')[ 0 ];
		app.init();

		if( Device.system.touch ) {

			document.addEventListener('touchmove', function(e) {

				e.preventDefault();
			});
		}
	} else {

		window.location = '/fallback';
	}
})();