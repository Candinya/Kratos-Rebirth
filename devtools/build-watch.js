const esbuild = require('esbuild');
const buildOpts = require("./build-options");

const startWatch = async () => {
    const cssCtx = await esbuild.context(buildOpts.buildCSSOpts);
    const hlCtx = await esbuild.context(buildOpts.buildHighlightCSSOpts);
    const jsCtx = await esbuild.context(buildOpts.buildJSOpts);

    await cssCtx.watch();
    await hlCtx.watch();
    await jsCtx.watch();

    console.log("esbuild watch start");
}

startWatch();

// 卡住进程避免结束
// setInterval(() => {}, 1 << 30);
