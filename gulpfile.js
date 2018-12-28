'use strict';

const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackStream = require('webpack-stream');

gulp.task('webpack-task', function(done) {
    return gulp.src('./src/scripts/recursive_modules/*.js')
        .pipe(webpackStream(webpackConfig), webpack)
        .pipe(gulp.dest('./dist/scripts'))
});

gulp.task('js-modules', function() {
    return gulp.src('./src/scripts/recursive_modules/*')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(rename((path) => path.basename += '.min'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/scripts/recursive_modules'));
});

gulp.task('js', [ /* 'js-modules' */ 'webpack-task']);

gulp.task('sass-main', function() {
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(rename((path) => path.basename += '.min'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('sass-modules', function() {
    return gulp.src('./src/styles/recursive_modules/*')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(rename((path) => path.basename += '.min'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/styles/recursive_modules'));
});

gulp.task('sass', ['sass-main', 'sass-modules']);

gulp.task('clean', function() {
    return del('./dist/**/*');
});

gulp.task('build', function() {
    return runSequence('clean', ['js', 'sass']);
})

gulp.task('default', ['build'], function() {
    gulp.watch('./src/scripts/**/*.js', ['js'])
    gulp.watch(['./src/styles/**/*.scss', '!./src/styles/recursive_modules/*'], ['sass-main'])
    gulp.watch('./src/styles/recursive_modules/*', ['sass-modules'])
})
