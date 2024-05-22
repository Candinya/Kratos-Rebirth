(() => {
    if (!window.history ||
        !window.history.pushState ||
        !window.history.replaceState) {
        return;
    }

    function scrollToMainTop() {
        const postTop = document.getElementById("kratos-blog-post").offsetTop
        const navHeight = document.getElementById("kratos-desktop-topnav").offsetHeight;
        const theTop = navHeight ? postTop - navHeight : 0;
        window.scrollTo({ top: theTop, behavior: 'smooth' });
    }

    function setMetaProperty(doc, property, content) {
        let meta = doc.querySelector('meta[property="' + property + '"]');
        if (meta) {
            if (content) {
                meta.setAttribute('content', content);
            } else {
                // 兼容性考虑，不直接使用 remove
                if (meta.parentNode) {
                    meta.parentNode.removeChild(meta);
                }
            }
        } else {
            if (!content) {
                return;
            }
            meta = doc.createElement('meta');
            meta.setAttribute('property', property);
            meta.setAttribute('content', content);
            doc.head.appendChild(meta);
        }
    }

    function getMetaProperty(doc, property) {
        const els = doc.querySelector('meta[property="' + property + '"]');
        return els ? els.getAttribute('content') : null;
    }

    function replacePageContent(data, doc) {
        document.title = data.title || '无标题';
        if (doc) {
            const oldMain = document.getElementById("main");
            if (typeof oldMain.replaceWith === 'function') {
                // 避免多次解析DOM树带来的性能损失
                oldMain.replaceWith(doc.getElementById("main"));
            } else {
                document.getElementById("main").innerHTML = data.content;
            }
        } else {
            document.getElementById("main").innerHTML = data.content;
        }
        // JS必须手动执行
        const scripts = document.getElementById("main").getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            if (!script.type || script.type.toLowerCase() === "text/javascript") {
                const newScript = document.createElement("script");
                newScript.setAttribute('type', 'text/javascript');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.appendChild(document.createTextNode(script.text));
                }
                if (typeof script.replaceWith === 'function') {
                    script.replaceWith(newScript);
                } else {
                    // 兼容性考虑
                    script.parentNode.insertBefore(newScript, script);
                    script.parentNode.removeChild(script);
                }
            }
        }
        // 更新部分元数据
        // 使用部分组件时可能会自动读取这些数据（如LiveRe评论系统）
        setMetaProperty(document, 'og:title', data.ogTitle);
        setMetaProperty(document, 'og:url', data.ogUrl);
    }
    function getPageData(doc) {
        return {
            title: doc.title,
            ogTitle: getMetaProperty(doc, 'og:title'),
            ogUrl: getMetaProperty(doc, 'og:url'),
            content: doc.getElementById("main").innerHTML,
        }
    }

    function popStateHandler(e) {
        if (e.state) {
            scrollToMainTop();
            if (typeof e.state.content === 'undefined') {
                pjax(location.href, false);
            } else {
                replacePageContent(e.state)
            }
            window.dispatchEvent(pjaxEvents.complete);
        }
    };
    window.addEventListener('popstate', popStateHandler);

    const pjaxEvents = {
        before: new Event('pjax:before'),
        success: new Event('pjax:success'),
        complete: new Event('pjax:complete'),
        error: new Event('pjax:error'),
    };

    function pjax(reqUrl, needPushState) {
        const beforeSend = () => {
            // 防止评论区再被加载，重置加载函数
            if (typeof load_comm !== 'undefined' && load_comm !== null) {
                load_comm = null;
            }

            scrollToMainTop();
            NProgress.start();

            window.dispatchEvent(pjaxEvents.before);
        }
        const onError = () => {
            window.dispatchEvent(pjaxEvents.error);
            // 请求失败，强制跳转
            location.href = reqUrl;
        }
        const onComplete = (responseText) => {
            window.dispatchEvent(pjaxEvents.success);

            const newDoc = document.implementation.createHTMLDocument("pjax");
            newDoc.documentElement.innerHTML = responseText;
            const isSuccessRequest = !!newDoc.getElementById("main");
            if (isSuccessRequest) {
                if (needPushState) {
                    history.replaceState(getPageData(document), document.title, location.href);
                }
                const data = getPageData(newDoc)
                if (needPushState) {
                    window.history.pushState(data, data.title, reqUrl);
                }
                replacePageContent(data, newDoc);

                // 如果URL里有指定节点ID，则滚动到相应的节点位置
                const reqId = reqUrl.match(/\#(.+)$/);
                if (reqId) {
                    window.scrollTo({ top: document.getElementById(reqId[1]).offsetTop - 40, behavior: 'smooth' });
                }
            } else {
                // 不是可以 pjax 的页面
                onError();
                return;
            }
            NProgress.done();
            window.dispatchEvent(pjaxEvents.complete);
        }
        const request = new XMLHttpRequest();
        request.onerror = function (e) {
            console.error(e);
            onError();
        };
        request.ontimeout = function () {
            onError();
        };
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                onComplete(request.responseText);
            }
        };
        request.open("GET", reqUrl, true);
        request.timeout = 6000;
        beforeSend();
        request.send();
    }

    const maxBubbleDepth = 3; // 最大冒泡层数
    
    document.addEventListener("click", (e) => {

        let el = e.target;
        let bub = 0;
        
        // 向上寻找 a 标签
        while (!!el && el.tagName.toLowerCase() !== "a" && bub < maxBubbleDepth) {
            el = el.parentElement;
            bub++;
        }

        if (!el || el.tagName.toLowerCase() !== "a") {
            // 不是跳转
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

    // 基于 navigate event 的实现
    // 警告：这是一个实验特性，目前只有 Chromium 系的浏览器支持（参考 https://developer.mozilla.org/en-US/docs/Web/API/Navigation/navigate_event#browser_compatibility ）
    // navigation.addEventListener("navigate", (event) => {
    //     const url = new URL(event.destination.url);

    //     if (
    //         url.origin !== location.origin || // 不是同源的请求
    //         url.toString() === location.toString() // 是强制重新加载 // 这个处理还有点问题（同页面刷新会和上面的 PJAX 失败后直接跳转冲突），如果要使用的话要再优化一下
    //     ) {
    //         // 忽略
    //         return;
    //     }

    //     // 使用自定义处理函数执行 PJAX
    //     event.intercept({
    //         async handler() {
    //             pjax(event.destination.url, false);
    //         },
    //     });
    // });

})();
