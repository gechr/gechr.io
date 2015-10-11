'use strict';

var gulp = require('gulp'),
    del = require('del'),
    svgmin = require('gulp-svgmin'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    rsync = require('gulp-rsync');

var sourceDir = '_src';
var publicDir = 'public';

var src = {
  svg: [sourceDir + '/assets/img/*.svg'],
  css: [sourceDir + '/assets/sass/*.scss'],
  js:  [sourceDir + '/assets/js/*.js'],
}

var dest = {
  svg: publicDir + '/assets/img',
  css: publicDir + '/assets/css',
  js:  publicDir + '/assets/js',
}

var staticFiles = [
  sourceDir + '/favicon.ico',
  sourceDir + '/index.html',
  sourceDir + '/robots.txt',
]

function buildAll() {
  buildSVG();
  buildCSS();
  buildJS();
  copyStatic();
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

function copyStatic() {
  return gulp.src(staticFiles)
    .pipe(gulp.dest(publicDir));
}

gulp.task('clean', function () {
  del([publicDir + '/assets/']);
});

gulp.task('render', buildAll);
gulp.task('render:watch', function () {
  gulp.watch([src.svg, src.css, src.js], ['render']);
});

gulp.task('copy-static', copyStatic);

gulp.task('serve', ['render', 'copy-static'], function() {
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
