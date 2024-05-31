const esbuild = require("esbuild");
const buildOpts = require("./build-options");

const buildOnce = () => {
  console.log("构建资源...");
  esbuild.build(buildOpts.buildCSSOpts);
  esbuild.build(buildOpts.buildHighlightJSCSSOpts);
  esbuild.build(buildOpts.buildPrismJSCSSOpts);
  esbuild.build(buildOpts.buildJSOpts);
};

buildOnce();

module.exports = buildOnce;
