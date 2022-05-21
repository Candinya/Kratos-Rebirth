const path = require('path');

const { version } = require(path.normalize('../../package.json'));

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

module.exports = {
    url_cdn: (locals, file) => {
        return npmCDNHandler(locals.config.root, locals.theme.config.cdn, `hexo-theme-kratos-rebirth@${version}/source/`) + file;
    },
    url_npm_cdn: (locals, file) => {
        return npmCDNHandler('https://unpkg.com/', locals.theme.config.cdn) + file;
    }
}
