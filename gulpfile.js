var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');


var htmlSources = ['builds/development/*.html'];


gulp.task('watch',function(){
	gulp.watch(htmlSources,['html']);
});

gulp.task('connect',function(){
	connect.server({
		root:'builds/development/',
		livereload:true
	});
});

gulp.task('html',function(){
	gulp.src(htmlSources)
		.pipe(connect.reload())
});


gulp.task('default',['html','connect','watch']);