const util = require('hexo-util');
hexo.extend.helper.register('kratos_canonical', function () {
    const { canonical } = hexo.theme.config;
    if (!canonical) return '';
    return `<link rel="canonical" href="${util.prettyUrls(this.url, hexo.config.pretty_urls || {})}">`;
});