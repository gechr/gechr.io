'use strict';

var gulp = require('gulp'),
  del = require('del'),
  svgmin = require('gulp-svgmin'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  livereload = require('gulp-livereload'),
  connect = require('gulp-connect'),
  exec = require('child_process').exec;

var sourceDir = '_src';
var publicDir = 'public';

var src = {
  svg: [sourceDir + '/assets/img/*.svg'],
  css: [sourceDir + '/assets/sass/*.scss'],
  js: [sourceDir + '/assets/js/*.js'],
}

var dest = {
  svg: publicDir + '/assets/img',
  css: publicDir + '/assets/css',
  js: publicDir + '/assets/js',
}

var staticFiles = [
  sourceDir + '/favicon.ico',
  sourceDir + '/index.html',
  sourceDir + '/keybase.txt',
  sourceDir + '/robots.txt',
]

function buildSVG() {
  return gulp.src(src.svg)
    .pipe(svgmin())
    .pipe(gulp.dest(dest.svg));
}

function buildCSS() {
  return gulp.src(src.css)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(dest.css))
    .pipe(livereload());
}

function buildJS() {
  return gulp.src(src.js)
    .pipe(uglify())
    .pipe(gulp.dest(dest.js))
    .pipe(livereload())
}

function copyStatic() {
  return gulp.src(staticFiles)
    .pipe(gulp.dest(publicDir))
    .pipe(livereload());
}

function render(done) {
  buildSVG();
  buildCSS();
  buildJS();
  copyStatic();
  done();
}

function clean() {
  return del(publicDir);
}

function watch() {
  livereload.listen();
  return gulp.watch(sourceDir + '/**', ['render']);
}

function serve() {
  return connect.server({
    root: publicDir,
    port: 8000
  });
}

function sync() {
  return exec(`rsync -a --delete ${publicDir}/ gechr.io:/var/www/html/`)
}

exports.clean = clean
exports.render = render
exports.serve = gulp.series(render, serve)
exports.sync = gulp.series(render, sync)
exports.watch = gulp.series(serve, watch)
