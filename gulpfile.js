'use strict';

var gulp = require('gulp'),
    rsync = require('gulp-rsync');

gulp.task('default', function() {
  // Where the magic happens...
});

gulp.task('sync', function() {
  gulp.src('public/**')
    .pipe(rsync({
      root: 'public',
      hostname: 'gechr.io',
      destination: '/usr/share/nginx/html',
      clean: true,
      compress: true,
      incremental: true,
      recursive: true
    }));
});
