/* eslint-env node es6 */
'use strict';

import gulp from 'gulp';
import gutil from 'gulp-util';
import less from 'gulp-less';
import minify from 'gulp-minify-css';
import watch from 'gulp-watch';

import run from 'run-sequence';
import browserSync from 'browser-sync';

import path from 'path';
import del from 'del';

import webpack from 'webpack';

// Start a webpack-dev-server
const webpackConfig = {
    context: path.resolve('source'),
    entry: {
        app: './app.module.js'
    },
    output: {
        path: path.resolve('app')
    },
    module: {
        loaders: [{
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    }
};

const sync = browserSync.create();

gulp.task('clean', del.bind(null, ['app']));

gulp.task('templates', () =>
    gulp.src('source/**/*.html')
        .pipe(gulp.dest('app/'))
        .pipe(sync.stream({once: true}));
);

gulp.task('styles', () => {
    return gulp.src('source/styles/main.less')
        .pipe(less())
        .pipe(minify())
        .pipe(gulp.dest('app'))
        .pipe(sync.stream({once: true}));
});

gulp.task('scripts', (done) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack]', stats.toString({
            colors: true
        }));

        sync.reload('bundle.js');

        done();
    });
});

gulp.task('build', (done) => {
    run('clean', ['scripts', 'styles', 'templates'], done);
});

gulp.task('watch', () => {
    watch('source/**/*.js', () => run('scripts'));
    watch('source/**/*.less', () => run('styles'));
    watch('source/**/*.html', () => run('templates'));
});

gulp.task('default', ['build', 'watch'], function () {
    sync.init({
        server: 'app'
    });

    gulp.watch('source/styles/**/*.less', ['styles']);
    gulp.watch('source/scripts/**/*.js', ['scripts'])
    gulp.watch('source/**/*.html', ['templates'])
});
