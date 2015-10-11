'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    rsync = require('gulp-rsync');

var publicDir = 'public';

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
