var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

gulp.task('concat', function() {
    return gulp.src('./client/javascript/app/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./client/javascript/dist'));
});

gulp.task('minify', function() {
    gulp.src('./client/javascript/dist/all.js')
        .pipe(minify())
        .pipe(gulp.dest('./client/javascript/dist'))
});

gulp.task('uglify', function() {
    return gulp.src('./client/javascript/dist/all.js')
        .pipe(uglify())
        .pipe(gulp.dest('./client/javascript/dist/'));
});

gulp.task('pre-test', function () {
    return gulp.src(['server/**/*.js'])
        // Covering files
        .pipe(istanbul())
        // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    return gulp.src(['test/server/**/*.js'])
        .pipe(mocha())
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports())
});
