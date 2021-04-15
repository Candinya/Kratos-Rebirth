const path = require('path');

const { version } = require(path.normalize('../package.json'));

// 使用CDN提供静态资源，改写URL
hexo.theme.on('processAfter', () => {
    hexo.extend.helper.register('url_cdn', (file) => {
        return (
            hexo.theme.config.cdn
            ? `https://cdn.jsdelivr.net/gh/Candinya/Kratos-Rebirth@${version}/source/`
            : hexo.config.root
        ) + file;
    });
});
