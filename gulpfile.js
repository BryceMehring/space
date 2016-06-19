
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var exit = require('gulp-exit');

function compile(watch) {
  var bundler = watchify(browserify('./source/app.js', { debug: true }).transform(babel));

  function rebundle() {
    lint();

    var bundle = bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      //.pipe(uglify())
      .pipe(gulp.dest('public/javascripts'));

    if(!watch) {
      bundle.pipe(exit());
    }
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

function lint() {
  return gulp.src('js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });
gulp.task('lint', function() { return lint(); });

gulp.task('default', ['watch']);
