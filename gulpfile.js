const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();

sass.compiler = require('sass');

const configs = {
    autoprefixer: {
        overrideBrowserslist: [
            'last 2 versions',
            '> 1%',
            'Chrome >= 30',
            'Firefox >= 30',
            'ie >= 9',
            'Safari >= 8',
        ],
    },
    cleanCSS: {
        level: 2
    },
    terser: {
        output: {
            comments: /^!/
        }
    }
};

function buildSass(cb) {
    src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(configs.autoprefixer))
        .pipe(cleanCSS(configs.cleanCSS))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('source/css'))
        .pipe(browserSync.reload({stream: true}));
    cb();
}

function buildHighlight(cb) {
    src('src/scss/highlight/theme/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(configs.autoprefixer))
        .pipe(cleanCSS(configs.cleanCSS))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('source/css/highlight'))
        .pipe(browserSync.reload({stream: true}));
    cb();
}

function minifyJs(cb) {
    src('src/js/*.js')
        .pipe(terser(configs.terser))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('source/js'))
        .pipe(browserSync.reload({stream: true}));
    cb();
}

const build = parallel(buildSass, minifyJs, buildHighlight);

function build_watch(cb) {
    browserSync.init({
      proxy: 'http://127.0.0.1:4000/'
    });
    watch('src/**', {ignoreInitial: true}, build).on('change', browserSync.reload);
}

// watch('src/**', parallel(minifycss, minifyjs));

exports.default = build;
exports.build = build;
exports.watch = build_watch;