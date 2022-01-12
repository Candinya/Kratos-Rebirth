const path = require('path');

const { version } = require(path.normalize('../package.json'));

const npmCDNHandler = (defaultRoot, cdnConfig, cdnSuffix = '') => {
    let cdnBase = defaultRoot;
    if (cdnConfig) {
        switch (cdnConfig.toLowerCase()) {
            case 'unpkg':
                cdnBase = 'https://unpkg.com/' + cdnSuffix;
                break;
            case 'jsdelivr':
            default:
                cdnBase = 'https://cdn.jsdelivr.net/npm/' + cdnSuffix;
                break;
        }
    }
    return cdnBase;
}

// 使用CDN提供静态资源，改写URL
hexo.theme.on('processAfter', () => {
    hexo.extend.helper.register('url_cdn', (file) => {
        return npmCDNHandler(hexo.config.root, hexo.theme.config.cdn, `kratos-rebirth@${version}/source/`) + file;
    });
    hexo.extend.helper.register('url_npm_cdn', (file) => {
        return npmCDNHandler('https://unpkg.com/', hexo.theme.config.cdn) + file;
    });
});
