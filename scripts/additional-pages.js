// 生成404页面
hexo.extend.generator.register('page-notfound', function(locals){
    return {
        path: '404.html',
        data: {
            type: '404',
            title: '这个页面走丢了呢…'
        },
        layout: '_pages/404',
    };
});

// 生成 tags 页面
hexo.extend.generator.register('page-tags', function(locals){
    return {
        path: 'tags/index.html',
        data: locals.posts,
        layout: '_pages/tags',
    };
});

// 生成 categories 页面
hexo.extend.generator.register('page-categories', function(locals){
    return {
        path: 'categories/index.html',
        data: locals.posts,
        layout: '_pages/categories',
    };
});
