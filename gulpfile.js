var gulp          = require('gulp'),

    jade          = require('gulp-jade'),

    cache         = require('gulp-cache'),
    imagemin      = require('gulp-imagemin'),

    autoprefixer  = require('gulp-autoprefixer'),
    less          = require('gulp-less'),
    minifycss     = require('gulp-minify-css'),

    coffee        = require('gulp-coffee'),
    concat        = require('gulp-concat'),
    jshint        = require('gulp-jshint'),
    uglify        = require('gulp-uglify'),

    clean         = require('gulp-clean'),
    notify        = require('gulp-notify'),
    rename        = require('gulp-rename'),

    livereload    = require('gulp-livereload'),
    lr            = require('tiny-lr'),
    server        = lr();

gulp.task('images', function() {
  return gulp.src('source/images/**/*')
  .pipe(cache(
    imagemin({
      interlaced: true,
      optimizationLevel: 5,
      progressive: true
    })
  ))
  .pipe(gulp.dest(
    'build/images/'
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: 'Sir, "Images" task complete.'
  }));
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/*.less')
  .pipe(less())
  .pipe(autoprefixer(
    'last 2 versions',
    'ie 8',
    'ie 9'
  ))
  .pipe(gulp.dest(
    'build/stylesheets/'
  ))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(minifycss())
  .pipe(gulp.dest(
    'build/stylesheets/'
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: 'Sir, "Stylesheets" task complete.'
  }));
});

gulp.task('scripts', function() {
  return gulp.src('source/scripts/**/*.coffee')
  .pipe(coffee())
  .pipe(jshint())
  .pipe(jshint.reporter(
    'default'
  ))
  .pipe(concat(
    'application.js'
  ))
  .pipe(gulp.dest(
    'build/scripts/'
  ))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(uglify())
  .pipe(gulp.dest(
    'build/scripts/'
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: 'Sir, "Scripts" task complete.'
  }));
});

gulp.task('templates', function() {
  return gulp.src('source/*.jade')
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest(
    'build/'
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: 'Sir, "Templates" task complete.'
  }))
});

gulp.task('clean', function() {
  return gulp.src(
    'build/',
    {
      read: false
    }
  )
  .pipe(clean());
});

gulp.task('default', ['clean'], function() {
  gulp.start(
    'images',
    'stylesheets',
    'scripts',
    'templates'
  );
});

gulp.task('watch', function() {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err)
    };
    gulp.watch(
      'source/images/**/*',
      [
        'images'
      ]
    );
    gulp.watch(
      'source/stylesheets/**/*.less',
      [
        'stylesheets'
      ]
    );
    gulp.watch(
      'source/scripts/**/*.coffee',
      [
        'scripts'
      ]
    );
    gulp.watch(
      'source/**/*.jade',
      [
        'templates'
      ]
    );
  });
});
