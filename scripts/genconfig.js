// 生成运行时调用的配置专用JS文件

hexo.once('generateBefore', () => {

    hexo.extend.generator.register('configMain', function(){
        const cdn = require('./lib/cdn');
        var configMain = hexo.theme.config.jsconfig.main;
        const defaultCoverBaseUrl = cdn.url_theme_cdn(hexo, "source/images/thumb/");
        configMain.site_root = hexo.config.root
        if (!configMain.cover){
            configMain.cover = {
                "baseUrl": defaultCoverBaseUrl
            }
        } else if (configMain.cover.baseUrl === undefined) {
            configMain.cover.baseUrl = defaultCoverBaseUrl
        }
        return {
            path: 'config/main.json',
            data: JSON.stringify(configMain)
        };
    });
    // hexo.extend.generator.register('configSnow', function(locals){
    //     return {
    //         path: 'config/snow.json',
    //         data: JSON.stringify(hexo.theme.config.jsconfig.snow)
    //     };
    // });
});