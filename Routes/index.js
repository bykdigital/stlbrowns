module.exports = function(app) {

	//- Admin area
	// app.use('/admin', require('./admin/index'));

	//- News & Events API
	// app.use('/api/news', require('./api/news'));

	//- Player API
	// app.use('/api/players', require('./api/players'));

	//- Contact Forms
	app.use('/api/contact', require('./api/contact'));

	//- Fallback page
	app.use('/fallback', require('./fallback/index'));

	//- wildcard route for all things front-end
	app.get('*', function(req, res){

		res.render('index', {
			env: app.locals.env
		});
	});

};
