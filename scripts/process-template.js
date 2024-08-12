const { createHash } = require("crypto");

hexo.extend.helper.register("process_template_path", (template, path, type) => {
  const hasher = hexo.theme.config[type].path_hasher;
  const hash = createHash(hasher);
  hash.update(path);
  const digest = hash.digest("hex");

  return template.replaceAll("$PATH_HASH", digest).replaceAll("$PATH", path);
});
