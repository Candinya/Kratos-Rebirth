const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require('gulp-rename');

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

function minifycss(cb) {
    src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(configs.autoprefixer))
        .pipe(cleanCSS(configs.cleanCSS))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('source/css'));
    cb();
}

function minifyjs(cb) {
    src('src/js/*.js')
        .pipe(terser(configs.terser))
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('source/js'));
    cb();
}

// watch('src/**', parallel(minifycss, minifyjs));

exports.build = parallel(minifycss, minifyjs);
exports.default = parallel(minifycss, minifyjs);