(() => {
  // 检查是否支持 pjax
  if (
    !window.history ||
    !window.history.pushState ||
    !window.history.replaceState
  ) {
    return;
  }

  /**
   * 滚动到页面顶端
   */
  const scrollToMainTop = () => {
    const postTop = document.getElementById("kratos-blog-post").offsetTop;
    const navHeight = document.getElementById(
      "kratos-desktop-topnav",
    ).offsetHeight;
    const theTop = navHeight ? postTop - navHeight : 0;
    window.scrollTo({ top: theTop, behavior: "smooth" });
  };

  /**
   * 设置 meta 标签的参数
   * @param {Document} dom 指定页面的 DOM 对象
   * @param {string} property 需要设置的属性名
   * @param {string} content 需要设置的属性值
   * @param {string} key 键名 （默认是 property ）
   */
  const setMetaProperty = (dom, property, content, key = "property") => {
    let metaEl = dom.querySelector(`meta[${key}="${property}"]`);
    if (metaEl) {
      if (content) {
        metaEl.setAttribute("content", content);
      } else {
        // 兼容性考虑，不直接使用 remove
        if (metaEl.parentNode) {
          metaEl.parentNode.removeChild(metaEl);
        }
      }
    } else if (content) {
      metaEl = dom.createElement("meta");
      metaEl.setAttribute("property", property);
      metaEl.setAttribute("content", content);
      dom.head.appendChild(metaEl);
    }
  };

  /**
   * 从 meta 标签提取参数
   * @param {Document} dom 指定页面的 DOM 对象
   * @param {string} property 属性名
   * @param {string} key 键名 （默认是 property ）
   * @returns {string} 提取结果
   */
  const getMetaProperty = (dom, property, key = "property") =>
    dom.querySelector(`meta[${key}="${property}"]`)?.getAttribute("content");

  /**
   * 替换页面内容
   * @param {object} data 页面数据
   * @param {Document} dom 指定页面的 DOM 对象
   */
  const replacePageContent = (data, dom) => {
    // 更新标题
    document.title = data.title || "无标题";

    // 更新部分元数据
    // 使用部分组件时可能会自动读取这些数据（如LiveRe评论系统）
    setMetaProperty(document, "og:title", data.ogTitle);
    setMetaProperty(document, "og:url", data.ogUrl);
    setMetaProperty(document, "og:description", data.ogDescription);
    setMetaProperty(document, "author", data.metaAuthor, "name");
    setMetaProperty(document, "description", data.metaDescription, "name");

    // 更新页面主体
    if (dom) {
      const oldMain = document.getElementById("main");
      if (typeof oldMain.replaceWith === "function") {
        // 避免多次解析DOM树带来的性能损失
        oldMain.replaceWith(dom.getElementById("main"));
      } else {
        document.getElementById("main").innerHTML = data.content;
      }
    } else {
      document.getElementById("main").innerHTML = data.content;
    }

    // 手动执行 JavaScript 脚本
    const scripts = document
      .getElementById("main")
      .getElementsByTagName("script");
    for (const script of scripts) {
      if (!script.type || script.type.toLowerCase() === "text/javascript") {
        const newScript = document.createElement("script");
        newScript.setAttribute("type", "text/javascript");
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.appendChild(document.createTextNode(script.text));
        }
        if (typeof script.replaceWith === "function") {
          script.replaceWith(newScript);
        } else {
          // 兼容性考虑
          script.parentNode.insertBefore(newScript, script);
          script.parentNode.removeChild(script);
        }
      }
    }
  };

  /**
   * 从给定的 DOM 中提取需要的数据
   * @param {*} dom 指定页面的 DOM 对象
   * @returns {object} 需要的数据
   */
  const getPageData = (dom) => ({
    title: dom.title,
    ogTitle: getMetaProperty(dom, "og:title"),
    ogUrl: getMetaProperty(dom, "og:url"),
    ogDescription: getMetaProperty(dom, "og:description"),
    metaAuthor: getMetaProperty(dom, "author", "name"),
    metaDescription: getMetaProperty(dom, "description", "name"),
    content: dom.getElementById("main").innerHTML,
  });

  /**
   * 处理浏览器后退状态
   * @param {PopStateEvent} e 后退事件
   */
  const popStateHandler = (e) => {
    if (e.state) {
      scrollToMainTop();
      if (typeof e.state.content === "undefined") {
        pjax(location.href, false);
      } else {
        replacePageContent(e.state);
      }
      window.dispatchEvent(pjaxEvents.complete);
    }
  };

  // 监听后退事件
  window.addEventListener("popstate", popStateHandler);

  // 全局事件整理，方便在需要的时候调用
  const pjaxEvents = {
    before: new Event("pjax:before"),
    success: new Event("pjax:success"),
    complete: new Event("pjax:complete"),
    error: new Event("pjax:error"),
  };

  /**
   * PJAX 核心处理函数
   * @param {string} reqUrl 请求的目标 URL
   * @param {boolean} needPushState 是否需要更新状态
   */
  const pjax = async (reqUrl, needPushState) => {
    /**
     * 错误处理函数
     */
    const onError = () => {
      // 发出错误提示信息
      window.dispatchEvent(pjaxEvents.error);
      // 请求失败，强制跳转
      location.href = reqUrl;
    };

    /**
     * PJAX 加载完成后事件
     * @param {string} responseText 请求得到的文档内容
     * @param {boolean} isPushStateRequired 是否需要更新浏览器状态
     */
    const onComplete = (responseText, isPushStateRequired) => {
      // 发出请求成功的好消息
      window.dispatchEvent(pjaxEvents.success);

      // 使用得到的文档内容创建一个 DOM 对象
      const newDoc = document.implementation.createHTMLDocument("pjax");
      newDoc.documentElement.innerHTML = responseText;

      // 检查是否有需要的元素（即可被替换的主元素）
      const isSuccessRequest = !!newDoc.getElementById("main");
      if (isSuccessRequest) {
        // 有元素，这个页面就是该动态加载

        // 检查是否需要更新历史记录
        if (isPushStateRequired) {
          history.replaceState(
            getPageData(document),
            document.title,
            location.href,
          );
        }

        // 从文档中提取信息
        const data = getPageData(newDoc);

        // 追加新的历史记录
        if (isPushStateRequired) {
          window.history.pushState(data, data.title, reqUrl);
        }

        // 替换页面内容
        replacePageContent(data, newDoc);

        // 如果URL里有指定节点ID，则滚动到相应的节点位置
        const reqId = reqUrl.match(/\#(.+)$/);
        if (reqId) {
          window.scrollTo({
            top: document.getElementById(reqId[1]).offsetTop - 40,
            behavior: "smooth",
          });
        }
      } else {
        // 没有元素，不是可以 pjax 的页面
        onError();
        return;
      }
      NProgress.done();
      window.dispatchEvent(pjaxEvents.complete);
    };

    // 让页面滚动到最顶端，避免长页面更新为短页面时的抖动
    scrollToMainTop();

    // NProgress 开始
    NProgress.start();

    // 发出启动事件
    window.dispatchEvent(pjaxEvents.before);

    // 设置一个超时终止控制器
    const abc = new AbortController();

    const timeoutAbortID = setTimeout(() => abc.abort(), 6_000);

    // 尝试请求数据
    try {
      const responseText = await fetch(reqUrl, {
        signal: abc.signal,
      }).then((res) => res.text());

      // 清理超时控制器
      clearTimeout(timeoutAbortID);

      // 加载完成
      onComplete(responseText, needPushState);
    } catch (e) {
      // 请求出错
      console.error(e);
      onError();
    }
  };

  const maxBubbleDepth = 3; // 最大向上冒泡层数

  // 监听页面点击事件
  document.addEventListener("click", (e) => {
    let el = e.target;
    let bub = 0;

    // 向上寻找 a 标签
    while (!!el && el.tagName.toLowerCase() !== "a" && bub < maxBubbleDepth) {
      el = el.parentElement;
      bub++;
    }

    if (!el || el.tagName.toLowerCase() !== "a") {
      // 不是点击 a 标签
      return;
    }

    // 检查是否为特殊标签
    if (
      el.getAttribute("target") === "_blank" || // 在新标签页打开
      el.getAttribute("rel") === "gallery" || // 是图片
      el.getAttribute("class") === "toc-link" // 是文章目录
    ) {
      // 不用处理
      return;
    }

    // 检查是否为有效标签
    const targetHref = el.getAttribute("href");
    if (
      !targetHref || // 没有 href
      targetHref.startsWith("#") // 是 HASH
    ) {
      // 也不用处理
      return;
    }

    // 检查是否为有效目标路径
    let targetUrl;
    try {
      // 以当前源为参照构建 URL ，以规范化可能存在的相对路径
      targetUrl = new URL(targetHref, location.origin);
      if (
        !targetUrl.protocol.toLowerCase().includes("http") || // 不是 HTTP 请求
        targetUrl.origin !== location.origin // 不是同源请求
      ) {
        return;
      }
    } catch (e) {
      // 无效的路径
      return;
    }

    // 是有效路径，开始 PJAX 执行

    e.preventDefault(); // 避免浏览器默认的 navigation 行为

    if (targetUrl.href === location.href) {
      // 是相同路径，忽略
      return;
    }

    // PJAX 执行
    pjax(targetUrl.toString(), true);
  });
})();
