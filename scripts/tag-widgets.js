/*!
  标签小组件文件
  Created by [Candinya](https://candinya.com)
  Created for [Kratos-Rebirth](https://github.com/Candinya/Kratos-Rebirth)
*/

const alertIconMap = {
  primary: "refresh",
  success: "check",
  danger: "exclamation",
  info: "info",
  warning: "warning",
};

// 提示横幅 // 参数： 0.类型 1.内容
hexo.extend.tag.register(
  "alertbar",
  (args) =>
    `<div class="alert alert-${args[0]}">
  <div class="icon"><i class="fa fa-${alertIconMap[args[0]]}"></i></div>
  <div class="text">
  ${hexo.render.renderSync({ text: args[1], engine: "markdown" })}
  </div>
  </div>`,
);

// 提示面板 // 参数： 0.类型 1.标题 内部内容
hexo.extend.tag.register(
  "alertpanel",
  (args, content) =>
    `<div class="panel panel-${args[0]}">
    <div class="panel-title"><i class="fa fa-${alertIconMap[args[0]]}"></i>${args[1]}</div>
    <div class="panel-body">
        ${hexo.render.renderSync({ text: content, engine: "markdown" })}
    </div>
    </div>`,
  { ends: true },
);

// 折叠内容 // 参数： 0.标题 1.状态 内部内容
hexo.extend.tag.register(
  "collapse",
  (args, content) =>
    `<div class="collapse-box-control${args[1] === "open" ? " active" : ""}">
    <div class="collapse-box-header"><div class="collapse-box-icon"><i class="fa fa-plus"></i></div><span>${args[0]}</span></div>
    <div class="collapse-box-content"><div class="inner">
        ${hexo.render.renderSync({ text: content, engine: "markdown" })} 
    </div></div>
    </div>`,
  { ends: true },
);

// 模糊隐藏 // 参数： 0.内容
hexo.extend.tag.register(
  "blur",
  (args) => `<span class="blur">${args[0]}</span>`,
);

// 链接列表 // 参数： 0.排序依据 (order / random) 1.列表ID（仅当为 random 模式时需要）
hexo.extend.tag.register(
  "linklist",
  (args, content) =>
    args[0] === "order"
      ? `<div class="linklist">
  <ul>${JSON.parse(content)
    .map(
      (link) =>
        `<li>
      <a target="_blank" href="${link.link}">
        <img src="${link.image}" alt=${link.title} />
        <div>
          <span>${link.title}</span>
          <p>${link.summary}</p>
        </div>
      </a>
    </li>`,
    )
    .join("")}</ul>
</div>`
      : `<div class="linklist">
  <ul id="kr-linklist-${args[1]}"></ul>

  <script type="text/javascript">
  (() => {
      const flist = ${content};
      let friendNodes = '';
      while (flist.length > 0) {
          const randID = Math.floor(Math.random()*flist.length);
          friendNodes += \`<li>
            <a target="_blank" href="\${flist[randID].link}">
              <img src="\${flist[randID].image}" alt=\${flist[randID].title} />
              <div>
                <span>\${flist[randID].title}</span>
                <p>\${flist[randID].summary}</p>
              </div>
            </a>
          </li>\`;
          flist.splice(randID, 1);
      }
      document.getElementById("kr-linklist-${args[1]}").innerHTML = friendNodes;
  })();
  </script>
</div>`,
  { ends: true },
);
