// 生成运行时调用的配置专用JS文件

hexo.once("generateBefore", () => {
  hexo.extend.generator.register("jsconfig", () => {
    const themeConfig = hexo.theme.config;

    const jsCfg = {
      createTime: themeConfig.footer.components.uptime.since,
      siteLeaveEvent: themeConfig.inactive_notice.enable,
      leaveLogo: themeConfig.inactive_notice.favicon.leave,
      leaveTitle: themeConfig.inactive_notice.message.leave,
      returnTitle: themeConfig.inactive_notice.message.return,
      copyrightNoticeEnable: themeConfig.copyright_notice.append_copy.enable,
      copyrightNotice: themeConfig.copyright_notice.append_copy.template,
      copyrightNoticeThreshold:
        themeConfig.copyright_notice.append_copy.threshold,
      expire_day: themeConfig.posts.expire_after,
      topNavScrollToggle: themeConfig.nav.auto_hide,
    };

    return {
      path: "config.json",
      data: JSON.stringify(jsCfg),
    };
  });
});
