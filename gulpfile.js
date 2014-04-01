var gulp          = require('gulp'),
    autoprefixer  = require('gulp-autoprefixer'),
    cache         = require('gulp-cache'),
    clean         = require('gulp-clean'),
    coffee        = require('gulp-coffee'),
    concat        = require('gulp-concat'),
    imagemin      = require('gulp-imagemin'),
    jade          = require('gulp-jade'),
    jshint        = require('gulp-jshint'),
    less          = require('gulp-less'),
    livereload    = require('gulp-livereload'),
    lr            = require('tiny-lr'),
    minifycss     = require('gulp-minify-css'),
    notify        = require('gulp-notify'),
    server        = lr(),
    uglify        = require('gulp-uglify');

gulp.task('images', function() {
  return gulp.src('source/images/**/*')
  .pipe(cache(imagemin({interlaced: true, optimizationLevel: 5, progressive: true})))
  .pipe(gulp.dest('build/images/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Images task complete.'}));
});

gulp.task('coffee', function() {
  return gulp.src('source/scripts/**/*.coffee')
  .pipe(coffee())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('scripts.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/scripts/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Coffee task complete.'}));
});

gulp.task('libraries', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/js/transition.js',
    'bower_components/bootstrap/js/alert.js',
    'bower_components/bootstrap/js/button.js',
    'bower_components/bootstrap/js/carousel.js',
    'bower_components/bootstrap/js/collapse.js',
    'bower_components/bootstrap/js/dropdown.js',
    'bower_components/bootstrap/js/modal.js',
    'bower_components/bootstrap/js/tooltip.js',
    'bower_components/bootstrap/js/popover.js',
    'bower_components/bootstrap/js/scrollspy.js',
    'bower_components/bootstrap/js/tab.js',
    'bower_components/bootstrap/js/affix.js',
    'source/scripts/**/*.js'
  ])
  .pipe(concat('libraries.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/scripts/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Libraries task complete.'}));
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/stylesheets.less')
  .pipe(less())
  .pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe(minifycss({keepSpecialComments: 0, removeEmpty: true}))
  .pipe(gulp.dest('build/stylesheets/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Stylesheets task complete.'}));
});

gulp.task('templates', function() {
  return gulp.src('source/*.jade')
  .pipe(jade({pretty: true}))
  .pipe(gulp.dest('build/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Templates task complete.'}))
});

gulp.task('clean', function() {
  return gulp.src('build/', {read: false})
  .pipe(clean());
});

gulp.task('default', function() {
  gulp.start('images', 'stylesheets', 'coffee', 'libraries', 'templates');
});

gulp.task('watch', ['default'], function() {
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };
    gulp.watch('source/images/**/*', ['images']);
    gulp.watch('source/stylesheets/**/*.less', ['stylesheets']);
    gulp.watch('source/scripts/**/*.coffee', ['coffee']);
    gulp.watch(['gulpfile.js', 'source/scripts/**/*.js'], ['libraries']);
    gulp.watch('source/**/*.jade', ['templates']);
  });
});
