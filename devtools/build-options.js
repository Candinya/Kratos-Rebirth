const sassPlugin = require("esbuild-plugin-sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");

const buildCSSOpts = {
  entryPoints: [
    // 核心样式
    "src/scss/kr-core.scss",

    // 配色主题
    "src/scss/kr-theme/light.scss",
    "src/scss/kr-theme/dark.scss",
  ],
  outExtension: { ".css": ".min.css" },
  outdir: "source/css",
  bundle: false,
  minify: true,
  plugins: [
    sassPlugin({
      async transform(source, resolveDir) {
        const { css } = await postcss([
          autoprefixer,
          postcssPresetEnv({ stage: 0 }),
        ]).process(source, { from: undefined });
        return css;
      },
    }),
  ],
};

const buildHighlightJSCSSOpts = {
  entryPoints: [
    // highlight.js
    "src/scss/highlight/highlight.js/theme/light.scss",
    "src/scss/highlight/highlight.js/theme/night.scss",
    "src/scss/highlight/highlight.js/theme/night-blue.scss",
    "src/scss/highlight/highlight.js/theme/night-bright.scss",
    "src/scss/highlight/highlight.js/theme/night-eighties.scss",
  ],
  outExtension: { ".css": ".min.css" },
  outdir: "source/css/highlight/highlight.js",
  bundle: false,
  minify: true,
  plugins: [
    sassPlugin({
      async transform(source, resolveDir) {
        const { css } = await postcss([
          autoprefixer,
          postcssPresetEnv({ stage: 0 }),
        ]).process(source, { from: undefined });
        return css;
      },
    }),
  ],
};

const buildPrismJSCSSOpts = {
  entryPoints: [
    // prismjs
    "src/scss/highlight/prismjs/theme/atom-dark.scss",
  ],
  outExtension: { ".css": ".min.css" },
  outdir: "source/css/highlight/prismjs",
  bundle: false,
  minify: true,
  plugins: [
    sassPlugin({
      async transform(source, resolveDir) {
        const { css } = await postcss([
          autoprefixer,
          postcssPresetEnv({ stage: 0 }),
        ]).process(source, { from: undefined });
        return css;
      },
    }),
  ],
};

const buildJSOpts = {
  entryPoints: [
    "src/js/kr-core.js",
    "src/js/kr-theme.js",
    "src/js/kr-search.js",
    "src/js/kr-pjax.js",
  ],
  outExtension: { ".js": ".min.js" },
  outdir: "source/js",
  bundle: false,
  minify: true,
  plugins: [],
  target: ["es2020", "chrome58", "edge16", "firefox57", "node12", "safari11"],
};

module.exports = {
  buildCSSOpts,
  buildHighlightJSCSSOpts,
  buildPrismJSCSSOpts,
  buildJSOpts,
};