'use strict';

var gulp = require('gulp'),
    del = require('del'),
    svgmin = require('gulp-svgmin'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    rsync = require('gulp-rsync');

var publicDir = 'public';

var src = {
  svg: ['_assets/img/*.svg'],
  css: ['_assets/sass/*.scss'],
  js: ['_assets/js/*.js'],
}

var dest = {
  svg: 'public/assets/img',
  css: 'public/assets/css',
  js: 'public/assets/js',
}

function buildAll() {
  buildSVG();
  buildCSS();
  buildJS();
}

function buildSVG() {
  return gulp.src(src.svg)
    .pipe(svgmin())
    .pipe(gulp.dest(dest.svg));
}

function buildCSS() {
  return gulp.src(src.css)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(dest.css));
}

function buildJS() {
  return gulp.src(src.js)
    .pipe(uglify())
    .pipe(gulp.dest(dest.js))
}

gulp.task('clean', function () {
  return del([
    publicDir + '/assets/',
  ]);
});

gulp.task('render', buildAll);
gulp.task('render:watch', function () {
  gulp.watch([src.svg, src.css, src.js], ['render']);
});

gulp.task('serve', function() {
  connect.server({
    root: publicDir
  });
});

gulp.task('sync', function() {
  gulp.src(publicDir + '/**')
    .pipe(rsync({
      root: publicDir,
      hostname: 'gechr.io',
      destination: '/usr/share/nginx/html',
      clean: true,
      compress: true,
      incremental: true,
      recursive: true
    }));
});

gulp.task('default', ['serve'])
