// 使用CDN提供静态资源，改写URL
hexo.once('generateBefore', () => {
    const cdn = require('./lib/cdn');
    hexo.extend.helper.register('file_info_theme_cdn', cdn.file_info_theme_cdn.bind(null, hexo));
    hexo.extend.helper.register('url_theme_cdn', cdn.url_theme_cdn.bind(null, hexo));
    hexo.extend.helper.register('js_theme_cdn', cdn.js_theme_cdn.bind(null, hexo));
    hexo.extend.helper.register('css_theme_cdn', cdn.css_theme_cdn.bind(null, hexo));

    hexo.extend.helper.register('file_info_npm_cdn', cdn.file_info_npm_cdn.bind(null, hexo));
    hexo.extend.helper.register('url_npm_cdn', cdn.url_npm_cdn.bind(null, hexo));
    hexo.extend.helper.register('js_npm_cdn', cdn.js_npm_cdn.bind(null, hexo));
    hexo.extend.helper.register('css_npm_cdn', cdn.css_npm_cdn.bind(null, hexo));
});
