// 生成运行时调用的配置专用JS文件

hexo.theme.on('processAfter', () => {

    hexo.extend.generator.register('configMain', function(locals){
        return {
            path: 'config/main.json',
            data: JSON.stringify(Object.assign({
                site_root: hexo.config.root,
            }, hexo.theme.config.jsconfig.main))
        };
    });
    // hexo.extend.generator.register('configSnow', function(locals){
    //     return {
    //         path: 'config/snow.json',
    //         data: JSON.stringify(hexo.theme.config.jsconfig.snow)
    //     };
    // });
});