/* eslint-env node es6 */

import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import prefixer from 'gulp-autoprefixer';
import minify from 'gulp-minify-css';
import watch from 'gulp-watch';
import sync from 'browser-sync';

import run from 'run-sequence';
import nodemon from 'gulp-nodemon';

import path from 'path';
import del from 'del';

import webpack from 'webpack';

//
// Client Config
const clientSource = 'source/client';

const clientConfig = {
    context: path.resolve(clientSource),
    devtool: 'source-map',
    entry: {
        app: './app.module.js'
    },
    output: {
        path: path.resolve('app/client'),
        filename: 'client.js'
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


//
// Server Config
const serverSource = 'source/server';

const serverConfig = {
    context: path.resolve(serverSource),
    devtool: 'source-map',
    target: 'node',
    node: {
        console: true
    },
    entry: {
        app: './index.js'
    },
    output: {
        path: path.resolve('app'),
        filename: 'server.js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    }
}

let server = {restart: () => {}};

gulp.task('clean', del.bind(null, ['app']));

gulp.task('templates', () => {
    return gulp.src(clientSource + '/**/*.html')
        .pipe(gulp.dest('app/client/'));
});

gulp.task('assets', () => {
    return gulp.src([
            clientSource + '/assets/**/*.*',
            '!' + clientSource + '/assets/**/*.css',
            '!' + clientSource + '/assets/**/*.scss'
        ])
        .pipe(gulp.dest('app/client/'));
});

gulp.task('styles', () => {
    return gulp.src(clientSource + '/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minify())
        .pipe(prefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/client/'));
});

gulp.task('icons', () => {
    return gulp.src(clientSource + '/assets/icons.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(minify())
        .pipe(prefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/client/'));
});

gulp.task('client-source', (done) => {
    webpack(clientConfig, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack]', stats.toString({
            colors: true
        }));

        done();
    });
});

gulp.task('server-source', (done) => {
    webpack(serverConfig, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }

        gutil.log('[webpack]', stats.toString({
            colors: true
        }));

        server.restart();

        done();
    });
});

gulp.task('build', (done) => {
    run('clean', ['client-source', 'server-source', 'icons', 'styles', 'templates', 'assets'], done);
});

gulp.task('watch', () => {
    watch(clientSource + '/**/*.js', () => run('client-source'));
    watch(clientSource + '/**/*.{scss, css}', () => run('styles'));
    watch(clientSource + '/**/*.html', () => run('templates'));
    watch(clientSource + '/assets/**/*.*', () => run('assets'));

    watch(serverSource + '/**/*.*', () => run('server-source'));
});

gulp.task('browser-sync', () =>
    sync.init(null, {
        proxy: 'http://localhost:3000',
        files: ['app/client/**/*.js', 'app/client/**/*.css', 'app/client/**/*.html'],
        ui: false,
        open: false,
        port: 7000
    })
);

gulp.task('default', ['build', 'watch'], () => {
    let started = false;

    server = nodemon({
            script: './app/server.js',
            env: { 'NODE_ENV': 'development'},
            ignore: ['*']
        });

    server.on('start', () => {
        if (started === false) {
            run('browser-sync');
        }
        started = true;
    });
});
