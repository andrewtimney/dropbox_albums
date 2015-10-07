var gulp = require("gulp");
var server = require('gulp-express');
var babel = require("gulp-babel");

gulp.task('default', function() {
  // place code for your default task here
  return gulp.src("public/javascripts/*.jsx")
    .pipe(babel())
    .pipe(gulp.dest("public/build"));
});

gulp.task('server', ['default'], function(){
  
  server.run(['bin/www']);
  
  gulp.watch(['public/**/*.js', 'public/**/*.css', 'server/views/**/*.vash'], function(event){
      server.notify(event)
      console.log('something changed', arguments);
  });
  
  gulp.watch(['bin/www', 'app.js', 'server/routes/**/*.js' ,'server/*.js'], [server.run]);
});