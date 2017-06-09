const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

gulp.task('lint', function() {
  return gulp.src('src/js/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
});

gulp.task('imagemin', function() {
  return gulp.src('src/images/**/*')
    .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true})))
    .pipe(gulp.dest('dist/images'))
});


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src',
      index: 'html/index.html'
    }
  })
});

gulp.task('useref', function() {
  return gulp.src('src/html/*.html')
    .pipe(plugins.useref())
    .pipe(plugins.if('*.js', plugins.uglify()))
    .pipe(plugins.if('*.css', plugins.cssnano()))
    .pipe(gulp.dest('dist/html'))
});

gulp.task('watch', ['browserSync'], function() {
  gulp.watch('src/css/*.css').on('change', browserSync.reload);
  gulp.watch('src/html/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
});

gulp.task('build', ['useref', 'imagemin']);