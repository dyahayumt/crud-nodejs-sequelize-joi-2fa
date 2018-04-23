/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util');
const autostart = require('gulp-nodemon');


// create a default task and just log a message
gulp.task('default', function() {
  console.log('Gulp is running!')
});

gulp.task('autostart', function() {
  autostart({
    script: './bin/www'
  }).on('start', function() {
    console.log('Gulp is running again');
  });
});

gulp.task('default', ['autostart']);