$(function () {
    if (!window.history ||
        !window.history.pushState ||
        !window.history.replaceState) {
        return;
    }

    function scrollToMainTop() {
        const postTop = document.getElementById("kratos-blog-post").offsetTop
        const navHeight = document.getElementById("kratos-desktop-topnav").offsetHeight;
        const theTop = navHeight ? postTop - navHeight : 0;
        $("body,html").animate({ scrollTop: theTop }, 600);
    }

    function setMetaProperty(doc, property, content) {
        var meta = doc.querySelector('meta[property="' + property + '"]');
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
        document.title = data.title || 'Untitled';
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
        for (var i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            if (!script.type || script.type.toLowerCase() === "text/javascript") {
                var newScript = document.createElement("script");
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

        // 更新外域变量
        OriginTitile = document.title;
    }
    function getPageData(url, doc) {
        return {
            url: url,
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
                pjax(e.state.url, false);
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
            location.href = reqUrl;
            window.dispatchEvent(pjaxEvents.error);
        }
        const onComplete = (responseText) => {
            window.dispatchEvent(pjaxEvents.success);

            const newDoc = document.implementation.createHTMLDocument("pjax");
            newDoc.documentElement.innerHTML = responseText;
            const isSuccessRequest = !!newDoc.getElementById("main");
            if (isSuccessRequest) {
                history.replaceState(getPageData(location.href, document), document.title, location.href);
                const data = getPageData(reqUrl, newDoc)
                if (needPushState) {
                    window.history.pushState(data, data.title, data.url);
                }
                replacePageContent(data, newDoc);

                // 如果URL里有指定节点ID，则滚动到相应的节点位置
                const reqId = reqUrl.match(/\#.+$/);
                if (reqId) {
                    $("body,html").animate({ scrollTop: $(reqId[0]).offset().top - 40 }, 600);
                }
            } else {
                // 其实是失败的
                // 不如打开一个新页面？
                window.open(reqUrl);
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
    $(document).on("click", 'a[target!=_blank][rel!=gallery][class!=toc-link]', function () {
        const reqUrl = $(this).attr("href");
        if (typeof reqUrl === 'undefined') return true;
        else if (reqUrl.includes("javascript:")) return true;
        else pjax(decodeURI(reqUrl), true);
        return false;
    });
});
