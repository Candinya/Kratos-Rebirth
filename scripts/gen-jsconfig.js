// 生成运行时调用的配置专用JS文件

hexo.once('generateBefore', () => {

    hexo.extend.generator.register('jsconfig', () => {

        const themeConfig = hexo.theme.config;

        const jsCfg = {
            createTime: themeConfig.footer_components.uptime.since,
            siteLeaveEvent: themeConfig.inactive_notice.enabled,
            leaveLogo: themeConfig.inactive_notice.favicon.leave,
            leaveTitle: themeConfig.inactive_notice.message.leave,
            returnTitle: themeConfig.inactive_notice.message.return,
            copyrightNoticeEnabled: themeConfig.copyright_notice.enabled,
            copyrightNotice: themeConfig.copyright_notice.template,
            copyrightNoticeThreshold: themeConfig.copyright_notice.threshold,
            expire_day: themeConfig.posts.expire_after,
            topNavScrollToggle: themeConfig.top_nav.auto_hide,
        };

        return {
            path: 'config.json',
            data: JSON.stringify(jsCfg)
        };
    });
});