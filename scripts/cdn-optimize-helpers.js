// 使用CDN提供静态资源，改写URL
hexo.theme.on('processAfter', () => {
    hexo.extend.helper.register('url_cdn', (file) => {
        if (hexo.theme.config.cdn) {
            return 'https://cdn.jsdelivr.net/gh/Candinya/Kratos-Rebirth@latest/source/' + file;
        } else {
            return hexo.config.root + file;
        }
    });
});