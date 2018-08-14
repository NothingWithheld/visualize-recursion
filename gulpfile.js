'use strict';

const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass-main', function() {
    gulp.src('./src/styles/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('sass-modules', function() {
    gulp.src('./src/styles/recursive_modules/*')
        .pipe(sass())
        .pipe(gulp.dest('./dist/styles/recursive_modules'));
});

gulp.task('clean', function() {
    del('./dist/**/*');
});
