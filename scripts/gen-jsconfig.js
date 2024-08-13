// 生成运行时调用的配置专用JS文件

hexo.once("generateBefore", () => {
  const themeConfig = hexo.theme.config;

  hexo.extend.generator.register("file-jsconfig", () => ({
    path: "config.json",
    data: JSON.stringify({
      uptime: {
        since: themeConfig.footer.components.uptime.since,
      },
      copyrightNoticeForCopy: {
        enable: themeConfig.copyright_notice.append_copy.enable,
        template: themeConfig.copyright_notice.append_copy.template,
        threshold: themeConfig.copyright_notice.append_copy.threshold,
      },
      topNavScrollToggle: {
        enable: themeConfig.nav.auto_hide,
      },
      viewerjs: {
        enable: themeConfig.viewerjs,
      },
    }),
  }));
});
