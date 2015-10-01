var gulp = require("gulp");
var server = require('gulp-express');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('server', function(){
  
  server.run(['bin/www']);
  
  gulp.watch(['public/**/*.js', 'public/**/*.css', 'server/views/**/*.vash'], function(event){
      server.notify(event)
      console.log('something changed', arguments);
  });
  
  gulp.watch(['bin/www', 'app.js', 'server/routes/**/*.js'], [server.run]);
});