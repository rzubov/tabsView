var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  path = require('path'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  cssmin = require('gulp-minify-css'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  through2 = require('through2'),
  reload = browserSync.reload,
  browserify = require('browserify'),
  del = require('del'),
  argv = require('yargs').argv,
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  babelify = require("babelify");



gulp.task('browser-sync', function () {
  browserSync({
    notify: !!argv.notify,
    server: {
      baseDir: "./dist"
    },
    ghostMode: false
  });
});

gulp.task('styles', function () {
  return gulp.src('./src/stylesheets/**/*.{scss,sass}')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: ['src/stylesheets/'],
      outputStyle: 'compressed',
      sourceMap: true,
      errLogToConsole: true
    }))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/stylesheets'))
    .pipe(reload({stream: true}));
});



gulp.task('js', function() {
  return gulp.src('src/scripts/*.js')
    .pipe($.plumber())
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path, { debug: true })
        .transform(babelify)
        .transform(require('debowerify'))
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
          next(null, file);
        });
    }))
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end')
    })
    .pipe( $.rename('app.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe( gulp.dest('dist/scripts/'));
});

gulp.task('js:vendor', function () {
  gulp.src('src/vendor/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(reload({stream: true}));
});


gulp.task('clean', function (cb) {
  del('./dist', cb);
});

gulp.task('images', function () {
  return gulp.src('./src/images/**/*')
    .pipe($.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./dist/images'))
});

gulp.task('templates', function () {
  return gulp.src('src/**/*.html')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/'))
});


gulp.task('build', ['styles', 'js', 'templates', 'images','js:vendor']);

gulp.task('serve', ['build', 'browser-sync'], function () {
  gulp.watch('src/stylesheets/**/*.{scss,sass}', ['styles', reload]);
  gulp.watch('src/scripts/**/*.js', ['js', reload]);
  gulp.watch('src/vendor/**/*.js', ['js:vendor', reload]);
  gulp.watch('src/images/**/*', ['images', reload]);
  gulp.watch('src/*.html', ['templates', reload]);
});

gulp.task('default', ['serve']);
