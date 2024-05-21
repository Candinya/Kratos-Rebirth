const sassPlugin = require('esbuild-plugin-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

const buildCSSOpts = {
    entryPoints: [
        "src/scss/kratosr.scss",
        "src/scss/kr-color-dark.scss",
    ],
    outExtension: {'.css': '.min.css'},
    outdir: "source/css",
    bundle: false,
    minify: true,
    plugins: [
        sassPlugin({
            async transform(source, resolveDir) {
              const { css } = await postcss([autoprefixer, postcssPresetEnv({stage: 0})]).process(source, {from: undefined})
              return css
            }
        }),
    ],
};

const buildHighlightCSSOpts = {
    entryPoints: [
        "src/scss/highlight/theme/light.scss",
        "src/scss/highlight/theme/night.scss",
        "src/scss/highlight/theme/night-blue.scss",
        "src/scss/highlight/theme/night-bright.scss",
        "src/scss/highlight/theme/night-eighties.scss",
    ],
    outExtension: {'.css': '.min.css'},
    outdir: "source/css/highlight",
    bundle: false,
    minify: true,
    plugins: [
        sassPlugin({
            async transform(source, resolveDir) {
              const { css } = await postcss([autoprefixer, postcssPresetEnv({stage: 0})]).process(source, {from: undefined})
              return css
            }
        }),
    ],
};

const buildJSOpts = {
    entryPoints: [
        "src/js/kratosr.js",
        "src/js/kr-dark.js",
        "src/js/local-search.js",
        "src/js/pjax.js",
    ],
    outExtension: {'.js': '.min.js'},
    outdir: "source/js",
    bundle: false,
    minify: true,
    plugins: [],
    target: [
        'es2020',
        'chrome58',
        'edge16',
        'firefox57',
        'node12',
        'safari11',
    ],
};

module.exports = {
    buildCSSOpts,
    buildHighlightCSSOpts,
    buildJSOpts,
};
