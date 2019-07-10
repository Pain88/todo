'use strict'
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const newer = require('gulp-newer');
const imageMin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
const prettify = require('gulp-prettify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const webpackStream = require('webpack-stream');
const webpack = webpackStream.webpack;
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const named = require('vinyl-named');
const gulplog = require('gulplog');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

let webConfig = {
    mode:'development',
    watch: isDevelopment,
    // devtool: isDevelopment ? 'cheap-module-inline-source-map' : null,
    output: {
        filename: 'main.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: '/node_modules/'
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
            // use: [
            //     'style-loader',
            //     'css-loader'
            // ]
        }]
    },
    optimization: {
        noEmitOnErrors: true
    },
    plugins: [
        new ExtractTextPlugin("hellos.css"),
    ]
};

gulp.task('webpack', function (callback) {
    let firstBuildReady = false;

    function done(err, stats) {
        firstBuildReady = true;
        if (err) {
            return;
        }
        gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
            colors: true
        }))
    }
    return gulp.src('./src/js/main.js')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'webpack',
                    message: err.message
                };
            })
        }))
        .pipe(named())
        .pipe(webpackStream(webConfig, null, done))
        .pipe(gulp.dest('./build/js'))
        .on('data', function () {
            if (firstBuildReady) {
                callback();
            }
        })
})
gulp.task('server', function () {
    browserSync.init({
        server: "build",
        notify: false
    })
    browserSync.watch('build/**/*.*').on('change', browserSync.reload)
})

gulp.task('sass', function () {
    return gulp.src('./src/sass/main.sass')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/css'))
})

const renderHtml = () => {
    nunjucksRender.nunjucks.configure({
        watch: false,
        trimBlocks: true,
        lstripBlocks: false
    });

    return gulp
        .src(['./src/templates/**/[^_]*.html'])
        .pipe(nunjucksRender({
            path: './src/templates'
        }))
        .pipe(prettify({
            indent_size: 2,
            wrap_attributes: 'auto', // 'force'
            preserve_newlines: false,
            end_with_newline: true
        }))
        .pipe(gulp.dest('build'));
}

gulp.task('nunjucks', () => renderHtml());

gulp.task('clean', function () {
    return del('build')
})

gulp.task('img', function () {
    return gulp.src('src/img/**/*.*', {
            since: gulp.lastRun('img')
        })
        .pipe(newer('build'))
        .pipe(gulp.dest('build/img'))
})
gulp.task('fonts', function () {
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'))
})

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.*', gulp.series('sass'));
    gulp.watch('src/img/**/*.*', gulp.series('img'));
    gulp.watch('src/fonts/**/*.*', gulp.series('fonts'));
    gulp.watch('src/templates/**/*.*', gulp.series('nunjucks'));
    // gulp.watch('src/js/**/*.*', gulp.series('webpack'))
})

gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'img', 'fonts', 'nunjucks', 'webpack')));

gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')))