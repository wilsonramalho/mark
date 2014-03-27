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
                      source: {
                        allFiles: {
                          fonts: 'source/fonts/**/*',
                          images: 'source/images/**/*',
                          scripts: 'source/scripts/**/*.coffee',
                          stylesheets: 'source/stylesheets/**/*.less',
                          templates: 'source/**/*.jade'
                        },
                        rootFiles: {
                          fonts: 'source/fonts/*',
                          images: 'source/images/*',
                          scripts: 'source/scripts/*.coffee',
                          stylesheets: 'source/stylesheets/*.less',
                          templates: 'source/*.jade'
                        }
                      },
                      build: {
                        folders: {
                          root: 'build/',
                          fonts: 'build/fonts/',
                          images: 'build/images/',
                          scripts: 'build/scripts/',
                          stylesheets: 'build/stylesheets/'
                        }
                      }
                    };

gulp.task('images', function() {
  return gulp.src(paths.source.allFiles.images)
  .pipe(cache(
    imagemin({
      interlaced: true,
      optimizationLevel: 5,
      progressive: true
    })
  ))
  .pipe(gulp.dest(
    paths.build.folders.images
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: 'Sir, "Images" task complete.'
  }));
});

gulp.task('stylesheets', function() {
  return gulp.src(paths.source.rootFiles.stylesheets)
  .pipe(less())
  .pipe(autoprefixer(
    'last 2 versions',
    'ie 8',
    'ie 9'
  ))
  .pipe(gulp.dest(
    paths.build.folders.stylesheets
  ))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(minifycss())
  .pipe(gulp.dest(
    paths.build.folders.stylesheets
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: 'Sir, "Stylesheets" task complete.'
  }));
});

gulp.task('scripts', function() {
  return gulp.src(paths.source.allFiles.scripts)
  .pipe(coffee())
  .pipe(jshint())
  .pipe(jshint.reporter(
    'default'
  ))
  .pipe(concat(
    'application.js'
  ))
  .pipe(gulp.dest(
    paths.build.folders.scripts
  ))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(uglify())
  .pipe(gulp.dest(
    paths.build.folders.scripts
  ))
  .pipe(livereload(
    server
  ))
  .pipe(notify({
    message: 'Sir, "Scripts" task complete.'
  }));
});

gulp.task('templates', function() {
  return gulp.src(paths.source.rootFiles.templates)
  .pipe(jade({
    pretty: true
  }))
  .pipe(gulp.dest(
    paths.build.folders.root
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
    paths.build.folders.root,
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
      paths.source.allFiles.images,
      [
        'images'
      ]
    );
    gulp.watch(
      paths.source.allFiles.stylesheets,
      [
        'stylesheets'
      ]
    );
    gulp.watch(
      paths.source.allFiles.scripts,
      [
        'scripts'
      ]
    );
    gulp.watch(
      paths.source.allFiles.templates,
      [
        'templates'
      ]
    );
  });
});
