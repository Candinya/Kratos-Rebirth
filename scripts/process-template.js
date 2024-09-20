const { createHash } = require("crypto");

hexo.extend.helper.register(
  "process_template_path",
  function (template, path, type) {
    const url_for = hexo.extend.helper.get("url_for").bind(this);
    const full_url_for = hexo.extend.helper.get("full_url_for").bind(this);

    const pathWithRoot = url_for(path);
    const pathFull = full_url_for(path);

    const hasher = hexo.theme.config[type].path_hasher;
    const hash = createHash(hasher);
    hash.update(pathWithRoot);
    const digest = hash.digest("hex");

    return template
      .replaceAll("$PATH_HASH", digest)
      .replaceAll("$PATH_FULL", pathFull)
      .replaceAll("$PATH", pathWithRoot);
  },
);
