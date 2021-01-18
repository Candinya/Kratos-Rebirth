// 生成404页面
hexo.extend.generator.register('notfoundPage', function(locals){
    return {
        path: '404.html',
        data: {
            type: '404',
            title: '这个页面走丢了呢…'
        },
        layout: '_pages/404'
    };
});