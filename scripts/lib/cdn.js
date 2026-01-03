const path = require("path");

const theme = require(path.normalize("../../package.json"));

const js_helper = (url, options) =>
  `<script ${options?.id ? 'id="' + options?.id + '" ' : ""}${
    options?.defer ? "defer " : ""
  }${options?.async ? "async " : ""}src="${url}"${
    options?.integrity ? ' integrity="' + options.integrity + '"' : ""
  }></script>`;
const css_helper = (url, options) =>
  `<link rel="stylesheet"${
    options?.id ? ' id="' + options.id + '"' : ""
  } href="${url}"${
    options?.integrity ? ' integrity="' + options.integrity + '"' : ""
  }${options?.media ? ' media="' + options.media + '"' : ""}>`;

// 关键 CSS 资源的预加载辅助函数
const css_preload_helper = (url, options) =>
  `<link rel="preload" href="${url}" as="style"${
    options?.integrity ? ' integrity="' + options.integrity + '"' : ""
  }${
    options?.crossorigin
      ? ' crossorigin="' + options.crossorigin + '"'
      : " crossorigin" // 默认 crossorigin="anonymous" ，此处使用省略写法
  }>`;

// 异步 CSS 加载辅助函数，使用 media="print" + onload 技术，防止 CSS 阻塞初始渲染
const css_async_helper = (url, options) =>
  `<link rel="stylesheet" ${
    options?.id ? ' id="' + options.id + '"' : ""
  } href="${url}"${
    options?.integrity ? ' integrity="' + options.integrity + '"' : ""
  } media="print" onload="this.media='${options?.media || "all"}'" onerror="this.media='${options?.media || "all"}'">` +
  // 为禁用 JS 的浏览器提供回退方案
  `<noscript>${css_helper(url, {
    ...options,
    id: undefined,
  })}</noscript>`;

const url_join = (p1, p2) => {
  if (!p1 || p2.includes("//")) {
    return p2;
  }
  if (!p2) {
    return p1;
  }
  if (p1.substring(p1.length - 1) === "/") {
    return `${p1}${p2}`;
  } else {
    return `${p1}/${p2}`;
  }
};

const file_info_npm_cdn = (locals, packageName, path) => {
  // 获取基础信息
  const isThemePackage = packageName === theme.name;
  const allVendorPackages = locals.theme.config.vendors.packages;
  const vendorPackageInfo = isThemePackage
    ? undefined
    : allVendorPackages?.[packageName];
  const version = isThemePackage
    ? theme.version
    : vendorPackageInfo?.version || "latest";
  // 检查是否有预定义的资源前缀
  let cdnPrefix = vendorPackageInfo?.cdn_url;
  // 如果没有定义链接，或是使用生成模式处理链接
  if (cdnPrefix === undefined || cdnPrefix === true) {
    // 检查是否定义了 CDN 的前缀
    const npm_cdn = locals.theme.config.vendors.npm_cdn;
    if (npm_cdn) {
      // 拼接得到带有 CDN 前缀的资源链接
      cdnPrefix = url_join(
        npm_cdn,
        `${packageName}@${version}/${
          // 主题资源在 npm 包中放置于 source 目录，所以需要补充资源前缀
          isThemePackage ? "source/" : ""
        }`,
      );
    }
  }
  // 如果没有在上面的步骤中得到资源前缀
  if (!cdnPrefix) {
    if (isThemePackage) {
      // 是主题资源，但因为构建的时候 source 目录里的东西会自动被放置到站点根目录下，
      // 所以不用加上 source 目录，直接使用站点根路径作为前缀
      cdnPrefix = locals.config.root;
    } else {
      // 是第三方资源，需要设置 vendors 前缀，并参照对应的包组织方式
      cdnPrefix = url_join(
        locals.config.root,
        `vendors/${packageName}@${version}/`,
      );
    }
  }
  // 检查文件是否需要变更位置
  const allPackageFiles = vendorPackageInfo?.files;
  const packageFileInfo = allPackageFiles?.[path];
  const actualPath =
    packageFileInfo?.relocate === undefined ||
    packageFileInfo?.relocate === null ||
    packageFileInfo?.relocate === false
      ? path
      : packageFileInfo.relocate;
  // 拼接完整资源路径
  const actualUrl = url_join(cdnPrefix, actualPath);
  const fileInfo = {
    url: actualUrl,
  };
  // 追加摘要参数，避免供应链投毒攻击
  if (packageFileInfo?.integrity) {
    fileInfo.integrity = packageFileInfo.integrity;
  }
  return fileInfo;
};
const url_npm_cdn = (locals, packageName, path) => {
  return file_info_npm_cdn(locals, packageName, path).url;
};
const js_npm_cdn = (locals, packageName, path, options) => {
  const { url, integrity } = file_info_npm_cdn(locals, packageName, path);
  return js_helper(url, {
    integrity,
    ...options,
  });
};
const css_npm_cdn = (locals, packageName, path, options) => {
  const { url, integrity } = file_info_npm_cdn(locals, packageName, path);
  return css_helper(url, {
    integrity,
    ...options,
  });
};
// css_npm_cdn 的异步版本，用于非关键 CSS
const css_npm_cdn_async = (locals, packageName, path, options) => {
  const { url, integrity } = file_info_npm_cdn(locals, packageName, path);
  return css_async_helper(url, {
    integrity,
    ...options,
  });
};

const file_info_theme_cdn = (locals, path) => {
  return file_info_npm_cdn(locals, theme.name, path);
};
const url_theme_cdn = (locals, path) => {
  return url_npm_cdn(locals, theme.name, path);
};
const js_theme_cdn = (locals, path, options) => {
  return js_helper(url_theme_cdn(locals, path), options);
};
const css_theme_cdn = (locals, path, options) => {
  return css_helper(url_theme_cdn(locals, path), options);
};
// css_theme_cdn 的异步版本，用于非关键 CSS
const css_theme_cdn_async = (locals, path, options) => {
  return css_async_helper(url_theme_cdn(locals, path), options);
};
// css_theme_cdn 的预加载版本，用于关键 CSS
const css_theme_cdn_preload = (locals, path, options) => {
  return css_preload_helper(url_theme_cdn(locals, path), options);
};

module.exports = {
  file_info_npm_cdn: file_info_npm_cdn,
  url_npm_cdn: url_npm_cdn,
  js_npm_cdn: js_npm_cdn,
  css_npm_cdn: css_npm_cdn,
  css_npm_cdn_async: css_npm_cdn_async,

  file_info_theme_cdn: file_info_theme_cdn,
  url_theme_cdn: url_theme_cdn,
  js_theme_cdn: js_theme_cdn,
  css_theme_cdn: css_theme_cdn,
  css_theme_cdn_async: css_theme_cdn_async,
  css_theme_cdn_preload: css_theme_cdn_preload,
};
