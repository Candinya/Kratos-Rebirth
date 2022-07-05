// 生成友链页面
hexo.once('generateBefore', () => {
    const cdn = require('./lib/cdn');
    // 需要等到初步处理完成后才能注册，因为要使用一些配置文件中的内容
    const friends = hexo.theme.config.friends;
    if (!friends || !friends.list) {
        // 无需构建，直接返回
        return;
    }

    const defaultAvatar = cdn.url_theme_cdn(hexo, "images/avatar.webp");
    const flist = friends.list.map(friend => ({
        name: friend.name,
        link: friend.link,
        avatar: friend.avatar,
        bio: friend.bio || '',
    }));
    // Module模式
    const friendsModule = 
`<div class="linkpage">
    <ul id="friendsList"></ul>
</div>

<script type="text/javascript">
{
    const flist = ${JSON.stringify(flist)};
    let friendNodes = '';
    while (flist.length > 0) {
        const rndNum = Math.floor(Math.random()*flist.length);
        friendNodes += \`<li><a target="_blank" href="\${flist[rndNum].link}"><img src="\${flist[rndNum].avatar}" onerror="this.src='${defaultAvatar}';this.onerror=null;"><h4>\${flist[rndNum].name}</h4><p>\${flist[rndNum].bio}</p></a></li>\`;
        flist.splice(rndNum, 1);
    }
    document.getElementById("friendsList").innerHTML = friendNodes;
}
</script>`;

    if (friends.href) {
        // Page模式
        hexo.extend.generator.register('friendsPage', () => {
            return {
                path: friends.href + '/index.html',
                data: Object.assign(friends.page, {content: friendsModule}), // 直接传递JSON串，运行时解析
                layout: 'page'
            };
        });
    } else {
        // Tag模式
        hexo.extend.tag.register('friends', () => {
            return friendsModule;
        });
    }
});

hexo.once('generateAfter', () => {
    // 完全处理完成后
    const friends = hexo.theme.config.friends;
    if (!friends || !friends.list || !friends.verify) {
        // 无需构建，直接返回
        return;
    }
    
    const https = require('https');
    friends.list.forEach((friend) => {

        try {
            // 尝试请求 URL
            https.get(friend.link)
                .on('error', err => {
                    hexo.log.warn(`友链"${friend.name}"(${friend.link})出现错误，以下是错误信息：`);
                    hexo.log.warn(err);
                });
        } catch (e) {
            // 如果出现问题（例如无效的 URL ），给出提示
            hexo.log.warn(`友链"${friend.name}"(${friend.link})无法被请求，以下是错误信息：`);
            hexo.log.warn(e);
        }
    });
});
