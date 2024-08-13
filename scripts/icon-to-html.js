hexo.extend.helper.register("icon_to_html", (input) =>
  input.includes("<")
    ? input // HTML 裸标签
    : `<i class="fa fa-${input}"></i>`, // FontAwesome ID
);
