var gulp = require("gulp");
var gls = require('gulp-live-server');
var babel = require("gulp-babel");

gulp.task('default', function() {
  // place code for your default task here
  return gulp.src("public/javascripts/*.jsx")
    .pipe(babel())
    .pipe(gulp.dest("public/build"));
});

gulp.task('server', ['default'], function(){

  var server = gls.new('./bin/www');
  server.start();

  gulp.watch(['public/**/*.js', 'public/**/*.css'], function(event){
      server.notify.apply(server, [event])
  });
  //
  gulp.watch(['bin/www', 'app.js', 'server/routes/**/*.js' ,'server/*.js', 'server/views/**/*.vash'], function(){
     server.start.bind(server)
   });
});
