import gulp from 'gulp';
const { src, dest, watch } = gulp;
import sass from 'gulp-dart-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import libsquoosh from 'gulp-libsquoosh';
import svgstore from 'gulp-svgstore';
import rename from 'gulp-rename';
import del from 'del';
import browser from 'browser-sync';

//Styles

const styles = () => {
    return src('src/sass/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(rename('styles.css'))
        .pipe(dest('dist/css'))
        .pipe(browser.stream());
}

//JS

const scripts = () => {
    return src('src/*.js')
    .pipe(dest('dist'))
}

//Clean

const clean = () => {
    return del('dist')
}

//HTML

const html = () => {
    return src('src/*.html')
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
        .pipe(dest('dist/img'))
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
    return src('src/fonts/*.{woff2,woff}')
        .pipe(dest('dist/fonts'))
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
    watch('src/*.js', gulp.series(scripts));
    watch('src/*.html', gulp.series(html, reload));
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
