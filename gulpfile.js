'use strict';

var gulp = require('gulp'),
    del = require('del'),
    svgmin = require('gulp-svgmin'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
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
  sourceDir + '/keybase.txt',
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

gulp.task('clean', function () {
  del(publicDir);
});

gulp.task('render', buildAll);

gulp.task('watch', ['serve'], function() {
  livereload.listen();
  gulp.watch(sourceDir + '/**', ['render']);
});

gulp.task('serve', ['render'], function() {
  connect.server({
    root: publicDir,
    port: 8000
  });
});

gulp.task('sync', ['render'], function() {
  gulp.src(publicDir + '/**')
    .pipe(rsync({
      root: publicDir,
      hostname: 'gechr.io',
      destination: '/var/www/html',
      clean: true,
      compress: true,
      incremental: true,
      recursive: true
    }));
});

gulp.task('default', ['serve'])
