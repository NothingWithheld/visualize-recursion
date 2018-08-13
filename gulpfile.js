'use strict';

import gulp from 'gulp';
import * as sass from 'gulp-sass';

gulp.task('sass', function(done) {
    gulp.src('./src/styles/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/main'));
});
