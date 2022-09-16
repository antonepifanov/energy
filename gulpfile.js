import gulp from 'gulp';
const { src, dest, watch } = gulp;
import sass from 'gulp-dart-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import fileinclude from 'gulp-file-include';
import htmlmin from 'gulp-htmlmin';
import libsquoosh from 'gulp-libsquoosh';
import svgstore from 'gulp-svgstore';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';
import rename from 'gulp-rename';
import del from 'del';
import browser from 'browser-sync';

//Styles

const styles = () => {
    return src('src/sass/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(rename('styles.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browser.stream());
}

//JS

const scripts = () => {
    return src('src/js/main.js')
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(dest('dist/js'))
}

//Clean

const clean = () => {
    return del('dist')
}

//HTML

const html = () => {
    return src('src/html/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src',
            context: {
                test: 'text'
            }
        }))
        .pipe(htmlmin({
            sortAttributes: true,
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(dest('dist'));
}

//Images

const images = () => {
    return src('src/img/*.{jpg,png,svg}')
        .pipe(libsquoosh())
        .pipe(dest('dist/img'))
}

//WebP

const webp = () => {
    return src('src/img/webp/*.{jpg,png}')
        .pipe(libsquoosh({
            webp: {}
        }))
        .pipe(dest('dist/img/webp'))
}

//Sprite

const sprite = () => {
    return src('src/img/sprite/*.svg')
        .pipe(libsquoosh())
        .pipe(svgstore())
        .pipe(rename('sprite.svg'))
        .pipe(dest('dist/img'))
}

//Copy

const copy = () => {
    return src(['src/fonts/*.{woff2,woff}',
        'src/favicon.ico',
        'src/manifest.webmanifest',
        'src/data/**/*.json',
        'src/video/*.{mp4,webm,ogv}'
    ], {
        base: 'src',
        allowEmpty: true
    })
        .pipe(dest('dist'))
}

// Server

const server = (done) => {
    browser.init({
        server: {
            baseDir: 'dist'
        },
        cors: true,
        notify: false,
        ui: false,
    });
    done();
}

// Reload

const reload = (done) => {
    browser.reload();
    done();
}

//Watcher

const watcher = () => {
    watch('src/**/*.scss', gulp.series(styles));
    watch('src/**/*.js', gulp.series(scripts));
    watch('src/**/*.html', gulp.series(html, reload));
    watch('src/img/sprite/*.svg', gulp.series(sprite));
    watch('src/img/*.{jpg,png,svg}', gulp.series(images));
    watch('src/img/webp/.{jpg,png}', gulp.series(webp));
}

//Default

export default gulp.series(
    clean,
    copy,
    gulp.parallel(
        images,
        webp,
        sprite,
        styles,
        html,
        scripts
    ),
    gulp.series(
        server,
        watcher
    )
)
