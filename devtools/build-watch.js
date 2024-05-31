const buildOnce = require("./build-once");
const chokidar = require("chokidar");

chokidar.watch("src").on("change", (path) => {
  console.log(
    `[${new Date().toLocaleTimeString()}]`,
    `${path} 变化，正在重新构建...`,
  );
  buildOnce();
});
