// 生成友链页面
hexo.theme.on('processAfter', () => {
    // 需要等到初步处理完成后才能注册，因为要使用一些配置文件中的内容
    const friends = hexo.theme.config.friends;
    if (!friends || !friends.href) {
        // 无需构建，直接返回
        return;
    }
    hexo.extend.generator.register('notfoundPage', function(locals){
        return {
            path: friends.href + '/index.html',
            data: Object.assign(friends.page, {flist: JSON.stringify(friends.list)}), // 直接传递JSON串，运行时解析
            layout: '_pages/friends'
        };
    });
});