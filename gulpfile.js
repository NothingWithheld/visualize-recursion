'use strict';

const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('./src/styles/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('clean', function() {
    del('./dist/**/*');
});
