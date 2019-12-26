const gulp = require('gulp');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const less = require('gulp-less');

var target = {
  pug: 'src/index.pug',
  less: 'src/main.less',
};

gulp.task('pug', () => {
  delete require.cache[require.resolve('./src/config.js')];
  const config = require('./src/config.js');

  return gulp.src(target.pug)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(pug({
      pretty: true,
      locals: {
        config
      },
    }))
    .pipe(gulp.dest('dist'))
    ;
});

gulp.task('copy', () => {
  gulp.src(target.less)
    .pipe(gulp.dest('dist'));
});

gulp.task('less', () => {
  gulp.src(target.less)
    .pipe(less())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch(['./src/**/*'], gulp.task('pug'));
  gulp.watch(['./src/**/*'], gulp.task('less'));
  gulp.watch(['./src/public/**/*'], gulp.task('copy'));
});

gulp.task('browser-sync', () => {
  browserSync({
    notify: false,
    server: {
      baseDir: './dist',
    },
  });
  gulp.watch(['./dist/**/*'], (done) => {
    browserSync.reload();
    done();
  });
});

gulp.task('default', gulp.series('copy', 'pug', 'less'));
gulp.task('dev', gulp.parallel('browser-sync', 'watch'));
