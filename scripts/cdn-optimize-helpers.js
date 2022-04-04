// 使用CDN提供静态资源，改写URL
hexo.once('generateBefore', () => {
    const cdn = require('./lib/cdn');
    hexo.extend.helper.register('url_cdn', cdn.url_cdn.bind(null, hexo));
    hexo.extend.helper.register('url_npm_cdn', cdn.url_npm_cdn.bind(null, hexo));
});
