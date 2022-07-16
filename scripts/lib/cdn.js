const path = require('path');

const theme = require(path.normalize('../../package.json'));

const js_helper = (url, options) => {
    return `<script ${options?.id ? 'id="' + options?.id + '" ' : ''}${options?.defer ? 'defer ' : ''}${options?.async ? 'async ' : ''}src="${url}"${options?.integrity ? ' integrity="' + options.integrity + '"' : ''}></script>`
}
const css_helper = (url, options) => {
    return `<link rel="stylesheet" ${options?.id ? 'id="' + options.id + '" ' : ''}href="${url}"${options?.integrity ? ' integrity="' + options.integrity + '"' : ''}${options?.media ? ' media="' + options.media + '"' : ''}></script>`
}

const url_join = (p1, p2) => {
    if (!p1 || p2.includes("//")) {
        return p2;
    }
    if (!p2) {
        return p1;
    }
    if (p1.substring(p1.length - 1) === '/') {
        return `${p1}${p2}`
    } else {
        return `${p1}/${p2}`
    }
}

const file_info_npm_cdn = (locals, packageName, path) => {
    const packages = locals.theme.config.vendors?.packages
    const thisPackage = packages && packages[packageName]
    const version = thisPackage?.version || (packageName != theme.name ? 'latest' : theme.version)
    var cdn_url = thisPackage?.cdn_url;
    if (cdn_url === undefined || cdn_url === true) {
        const npm_cdn = locals.theme.config.vendors?.npm_cdn;
        if (npm_cdn) {
            cdn_url = url_join(npm_cdn, `${packageName}@${version}/`)
        }
    }
    if (!cdn_url) {
        if (packageName != theme.name) {
            cdn_url = url_join(locals.config.root, `vendors/${packageName}@${version}/`)
        } else {
            cdn_url = locals.config.root
        }
    }
    const files = thisPackage?.files
    const thisFile = files && files[path]
    const actualPath = (thisFile?.relocate === undefined || thisFile?.relocate === null || thisFile?.relocate === false)
        ? path
        : thisFile.relocate
    const actualUrl = url_join(cdn_url, actualPath)
    var fileInfo = {
        "url": actualUrl,
    }
    if (thisFile?.integrity) {
        fileInfo.integrity = thisFile.integrity
    }
    return fileInfo;
}
const url_npm_cdn = (locals, packageName, path) => {
    return file_info_npm_cdn(locals, packageName, path).url
}
const js_npm_cdn = (locals, packageName, path, options) => {
    var file_info = file_info_npm_cdn(locals, packageName, path)
    return js_helper(file_info.url, {
        integrity: file_info.integrity,
        ...options
    });
}
const css_npm_cdn = (locals, packageName, path, options) => {
    var file_info = file_info_npm_cdn(locals, packageName, path)
    return css_helper(file_info.url, {
        integrity: file_info.integrity,
        ...options
    });
}

const file_info_theme_cdn = (locals, path) => {
    return file_info_npm_cdn(locals, theme.name, path);
}
const url_theme_cdn = (locals, path) => {
    return url_npm_cdn(locals, theme.name, path);
}
const js_theme_cdn = (locals, path, options) => {
    return js_helper(url_theme_cdn(locals, path), options);
}
const css_theme_cdn = (locals, path, options) => {
    return css_helper(url_theme_cdn(locals, path), options);
}

module.exports = {
    "file_info_npm_cdn": file_info_npm_cdn,
    "url_npm_cdn": url_npm_cdn,
    "js_npm_cdn": js_npm_cdn,
    "css_npm_cdn": css_npm_cdn,

    "file_info_theme_cdn": file_info_theme_cdn,
    "url_theme_cdn": url_theme_cdn,
    "js_theme_cdn": js_theme_cdn,
    "css_theme_cdn": css_theme_cdn,
}
