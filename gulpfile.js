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
    server        = lr(),

    paths         = {
                    fonts: 'source/fonts/**/*',
                    images: 'source/images/**/*',
                    scripts: 'source/scripts/**/*.coffee',
                    stylesheets: 'source/stylesheets/**/*.less',
                    templates: [
                      'source/*.jade'
                    ]
                  };

gulp.task('templates', function() {
  return gulp.src(paths.templates)
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
    message: '"Templates" task complete.',
    title: "Sir,"
  }))
});

gulp.task('images', function() {
  return gulp.src(paths.images)
  .pipe(cache(
    imagemin({
      interlaced: true,
      optimizationLevel: 5,
      progressive: true
    })
  ))
  .pipe(gulp.dest(
    'build/images'
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: '"Images" task complete.',
    title: 'Sir,'
  }));
});

gulp.task('stylesheets', function() {
  return gulp.src(paths.stylesheets)
  .pipe(less())
  .pipe(autoprefixer(
    'last 2 versions',
    'ie 8',
    'ie 9'
  ))
  .pipe(gulp.dest(
    'build/stylesheets'
  ))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(minifycss())
  .pipe(gulp.dest(
    'build/stylesheets'
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: '"Stylesheets" task complete.',
    title: 'Sir,'
  }));
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
  .pipe(coffee())
  .pipe(jshint())
  .pipe(jshint.reporter())
  .pipe(concat(
    'application.js'
  ))
  .pipe(gulp.dest(
    'build/scripts'
  ))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(uglify())
  .pipe(gulp.dest(
    'build/scripts'
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: '"Scripts" task complete.',
    title: 'Sir,'
  }));
});

gulp.task('default', function() {



});
