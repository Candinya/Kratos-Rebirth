const esbuild = require("esbuild");
const buildOpts = require("./build-options");

esbuild.build(buildOpts.buildCSSOpts);
esbuild.build(buildOpts.buildHighlightCSSOpts);
esbuild.build(buildOpts.buildJSOpts);
