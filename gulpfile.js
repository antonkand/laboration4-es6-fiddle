'use strict';
var gulp = require('gulp');
var traceur = require('gulp-traceur');

gulp.task('es6', function () {
  return gulp.src('src/lab4.js')
    .pipe(traceur())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('src/lab4.js', ['es6']);
});

gulp.task('default', ['watch', 'es6']);

