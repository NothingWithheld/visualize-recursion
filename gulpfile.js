'use strict';

const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

gulp.task('js-modules', function() {
    return gulp.src('./src/scripts/recursive_modules/*')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/scripts/recursive_modules'));
});

gulp.task('sass-main', function() {
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
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
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/styles/recursive_modules'));
});

gulp.task('sass', ['sass-main', 'sass-modules']);

gulp.task('clean', function() {
    return del('./dist/**/*');
});
