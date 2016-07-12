var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);

gulp.task('hello', function () {
    console.log('Hello khocef');
});

gulp.task('sass', function () {
    return gulp.src('app/scss/**/**.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('live', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('watch', ['live', 'sass'], function () {
    gulp.watch('app/scss/**/**.scss', ['sass']);
    gulp.watch('app/**/**.html', browserSync.reload);
    gulp.watch('app/**/**.js', browserSync.reload);
});

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify())) // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.css', cssnano())) // Minifies only if it's a CSS file
        .pipe(gulp.dest('dist'));
});

gulp.task('clean:dist', function () {
    return del.sync('dist');
});

gulp.task('build', function (cb) {
    console.log('Building files...');
    runSequence('clean:dist',
        ['sass', 'useref'],
        cb);
});

gulp.task('default', function(cb) {
    runSequence(['sass', 'live', 'watch'], cb);
});