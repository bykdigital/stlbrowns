
//-
//- deps
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var watch = require('gulp-watch');
var sass = require('gulp-sass');
var plz = require('gulp-pleeease');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');


//-
// js
gulp.task('js', function() {

	var bundler = watchify(browserify('./Client/js/main.js', watchify.args));

	// add any other browserify options or transforms here
	bundler.transform('brfs');

	function bundle() {

		gutil.log('Rebundling js');

		return bundler.bundle()
			// log errors if they happen
			.on('error', gutil.log.bind(gutil, 'Browserify Error'))
			.pipe(source('browns.min.js'))
			// optional, remove if you dont want sourcemaps
			.pipe(buffer())
			.pipe(gulp.dest('./Public'));
	}

	bundler.on('update', function() {

		bundle();
	});

	bundle();
});


//-
//- styles
gulp.task('styles', function() {

	return gulp.src('./Client/css/main.scss')
	  .pipe(sass({ sourcemap: false, style: 'expanded', quiet: true }))
		.pipe(plz({ minifier: false }))
		.pipe(rename({
			suffix: '.min',
			basename: 'browns'
		}))
		.pipe(gulp.dest('./Public'))
});

gulp.task('fallback-styles', function() {

	return gulp.src('./Client/fallback/css/main.scss')
	  .pipe(sass({ sourcemap: false, style: 'expanded', quiet: true }))
		.pipe(plz({ minifier: false }))
		.pipe(rename({
			suffix: '.min',
			basename: 'browns-fallback'
		}))
		.pipe(gulp.dest('./Public'))
});

gulp.task('fallback-js', function() {

	gulp.src(['./Client/fallback/js/main.js'])
	    .pipe(rename({
			suffix: '.min',
	    	basename: 'browns-fallback'
	    }))
	    .pipe(gulp.dest('./Public'))
});

//-
//- pre-commit build
gulp.task('compress', function() {

	gulp.src('./Public/browns.min.css')
		.pipe(plz())
		.pipe(minifycss())
		.pipe(gulp.dest('./Public'))

	gulp.src('./Public/browns-fallback.min.css')
		.pipe(plz())
		.pipe(minifycss())
		.pipe(gulp.dest('./Public'));

	gulp.src(['./Public/browns.min.js'])
		.pipe(uglify())
		.pipe(gulp.dest('./Public'))

	gulp.src(['./Public/browns-fallback.min.js'])
		.pipe(uglify())
		.pipe(gulp.dest('./Public'))

	gulp.src('./Public/images/**/*')
		.pipe(imagemin({
				use: [ pngquant() ]
		}))
		.pipe(gulp.dest('./Public/images'))
});

//-
// default task
gulp.task('default', ['js', 'fallback-js', 'styles', 'fallback-styles'], function() {

	watch('./Client/css/**/*.scss', function() { gulp.start('styles'); });

	watch('./Client/fallback/css/**/*.scss', function() { gulp.start('fallback-styles'); });

	watch('./Client/fallback/js/**/*.js', function() { gulp.start('fallback-js'); });
});
