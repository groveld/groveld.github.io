// gulpfile.js
var gulp        = require('gulp');
var browserSync = require('browser-sync');
var cssnano     = require('gulp-cssnano');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var purify      = require('gulp-purifycss');
var cp          = require('child_process');

var supported = [
  'last 2 versions',
  'safari >= 8',
  'ie >= 10',
  'ff >= 20',
  'ios 6',
  'android 4'
];

gulp.task('minify-css', function() {
  return gulp.src('./html/**/*.css')
    .pipe(concat('style.min.css'))
    .pipe(purify(['./html/**/*.js', './html/**/*.html']))
    .pipe(cssnano({autoprefixer: {browsers: supported, add: true}}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify-js', function() {
  return gulp.src('./html/static/**/*.js')
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['minify-css', 'minify-js']);
