const strip_html = hexo.extend.helper.get("strip_html").bind(hexo);

const parseSearchItem = (item, includeContent, url_for) => {
  let _item = {};
  if (item.title) {
    _item.title = item.title;
  }
  if (item.date) {
    _item.date = item.date;
  }
  if (item.path) {
    _item.url = url_for(item.path);
  }
  if (item.tags && item.tags.length > 0) {
    _item.tags = [];
    item.tags.forEach((tag) => {
      _item.tags.push([tag.name, url_for(tag.path)]);
    });
  }
  _item.categories = [];
  if (item.categories && item.categories.length > 0) {
    item.categories.forEach((cate) => {
      _item.categories.push([cate.name, url_for(cate.path)]);
    });
  } else {
    _item.categories.push(["undefined", ""]);
  }
  if (includeContent && item.content) {
    _item.content = strip_html(
      item.content.trim().replace(/<pre(.*?)\<\/pre\>/gs, ""),
    )
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .replace(
        new RegExp(
          "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]",
          "g",
        ),
        "",
      );
  }
  return _item;
};

hexo.once("generateBefore", () => {
  if (hexo.theme.config.search.provider === "local") {
    // 生成搜索数据库

    let config = hexo.theme.config.search;

    // 设置默认搜索路径
    if (!config.path.index_file) {
      config.path.index_file = "search-index.json";
    }

    hexo.extend.generator.register("file-search-index", function (locals) {
      const url_for = hexo.extend.helper.get("url_for").bind(this);

      const searchIncludes = config.includes;

      let res = [];

      if (searchIncludes.includes("post")) {
        locals.posts.sort("-date").each((post) => {
          res.push(
            parseSearchItem(post, hexo.theme.config.search.content, url_for),
          );
        });
      }
      if (searchIncludes.includes("page")) {
        locals.pages.each((page) => {
          res.push(
            parseSearchItem(page, hexo.theme.config.search.content, url_for),
          );
        });
      }

      return {
        path: config.path.index_file,
        data: JSON.stringify(res),
      };
    });
  }

  if (hexo.theme.config.search.provider !== "none") {
    // 生成搜索页面
    hexo.extend.generator.register("page-search", (locals) => ({
      path: `${hexo.theme.config.search.path.page}/index.html`,
      data: {
        title_i18n: "title.search",
      },
      layout: "_pages/search",
    }));
  }
});
