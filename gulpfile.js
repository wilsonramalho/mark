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
    rename        = require('gulp-rename'),
    server        = lr(),
    uglify        = require('gulp-uglify');

gulp.task('images', function() {
  return gulp.src('source/images/**/*')
  .pipe(cache(imagemin({interlaced: true, optimizationLevel: 5, progressive: true})))
  .pipe(gulp.dest('build/images/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Images task complete.'}));
});

gulp.task('stylesheets', function() {
  return gulp.src('source/stylesheets/*.less')
  .pipe(less())
  .pipe(autoprefixer('last 2 versions', 'ie 8', 'ie 9'))
  .pipe(gulp.dest('build/stylesheets/'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('build/stylesheets/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Stylesheets task complete.'}));
});

gulp.task('scripts', function() {
  return gulp.src('source/scripts/**/*.coffee')
  .pipe(coffee())
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('application.js'))
  .pipe(gulp.dest('build/scripts/'))
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('build/scripts/'))
  .pipe(livereload(server))
  .pipe(notify({message: 'Scripts task complete.'}));
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

gulp.task('default', ['clean'], function() {
  gulp.start('images', 'stylesheets', 'scripts', 'templates');
});

gulp.task('watch', function() {
  server.listen(35729, function(err) {
    if (err) {
      return console.log(err)
    };
    gulp.watch('source/images/**/*', ['images']);
    gulp.watch('source/stylesheets/**/*.less', ['stylesheets']);
    gulp.watch('source/scripts/**/*.coffee', ['scripts']);
    gulp.watch('source/**/*.jade', ['templates']
    );
  });
});
