const path = require('path');

const { version } = require(path.normalize('../package.json'));

const npmCDNHandler = (file, root, cdnConfig) => {
    let cdnBase = root;
    if (cdnConfig) {
        switch (cdnConfig.toLowerCase()) {
            case 'unpkg':
                cdnBase = 'https://unpkg.com/';
                break;
            case 'jsdelivr':
            default:
                cdnBase = 'https://cdn.jsdelivr.net/npm/';
                break;
        }
    }
    return cdnBase + file;
}

// 使用CDN提供静态资源，改写URL
hexo.theme.on('processAfter', () => {
    hexo.extend.helper.register('url_cdn', (file) => {
        return npmCDNHandler(`kratos-rebirth@${version}/source/` + file, hexo.config.root, hexo.theme.config.cdn);
    });
    hexo.extend.helper.register('url_npm_cdn', (file) => {
        return npmCDNHandler(file, 'https://cdn.jsdelivr.net/npm/', hexo.theme.config.cdn);
    });
});
