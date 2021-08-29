$(function() {
    const mainElement = '#kratos-blog-post .row';
    theTop = window.kr?.notMobile ? $("#kratos-blog-post").offset().top-40 : 0;

    const popStateHandler = (e) => {
        if ( e.state ) {
            document.title = e.state.title || document.title;
            $("body,html").animate({scrollTop:theTop}, 600);
            if (typeof e.state.content === 'undefined') {
                ajax(e.state.url, false);
            } else {
                $(mainElement).html( e.state.content );
            }
            // 更新外域变量
            OriginTitile = document.title;
            window.dispatchEvent(pjaxEvents.complete);
        }
    };
    window.addEventListener('popstate', popStateHandler);

    const pjaxEvents = {
        before:   new Event('pjax:before')  ,
        success:  new Event('pjax:success') ,
        complete: new Event('pjax:complete'),
        error:    new Event('pjax:error')   ,
    };

    function ajax(reqUrl, needPushState) {

        let isSuccessRequest = false;

        $.ajax({
            url: reqUrl,
            beforeSend: function () {

                // 防止评论区再被加载，重置加载函数
                if (typeof load_comm !== 'undefined' && load_comm !== null) {
                    load_comm = null;
                }

                // 运动到顶部
                $("body,html").animate({scrollTop:theTop}, 600);

                // 进度条开始
                NProgress.start();
                
                window.dispatchEvent(pjaxEvents.before);
            },
            success: function(data, textStatus, jqXHR) {
                
                if (typeof $(data).find(mainElement).html() !== 'undefined') {
                    // 这样才成功嘛
                    isSuccessRequest = true;
                }

                window.dispatchEvent(pjaxEvents.success);
            },
            complete: function(jqXHR, textStatus) {

                if (isSuccessRequest) {
                    const data = jqXHR.responseText;

                    // 替换记录的当前状态
                    history.replaceState({
                        url: location.href,
                        title: document.title,
                        content: $(document).find(mainElement).html(),
                    }, document.title, location.href);

                    // 记录新状态的一些信息
                    const newTitle = $(data).filter("title").text();
                    const newContent = $(data).find(mainElement).html();

                    // 如果需要压入新的状态
                    if (needPushState) {
                        // 压入新的状态
                        window.history.pushState({
                            url: reqUrl,
                            title: newTitle,
                            content: newContent,
                        }, newTitle, reqUrl);
                    }

                    // 更新当前页面需要更新的内容
                    document.title = newTitle;
                    $(mainElement).html(newContent);

                    // 更新外域变量
                    OriginTitile = document.title;
                    
                    // 如果URL里有指定节点ID，则滚动到相应的节点位置
                    const reqId = reqUrl.match(/\#.+$/);
                    if (reqId) {
                        $("body,html").animate({scrollTop:$(reqId[0]).offset().top - 40}, 600);
                    }
                } else {
                    // 其实是失败的
                    // 不如打开一个新页面？
                    window.open(reqUrl);
                }

                // 进度条结束
                NProgress.done();

                window.dispatchEvent(pjaxEvents.complete);
            },
            timeout: 6000,
            error: function(jqXHR, textStatus, errorThrown) {

                console.error(errorThrown);

                location.href = reqUrl;
                
                window.dispatchEvent(pjaxEvents.error);
            }
        });
    }
    $(document).on("click", 'a[target!=_blank][rel!=gallery][class!=toc-link]', function() {
        const reqUrl = $(this).attr("href");
        if (typeof reqUrl === 'undefined') return true;
        else if (reqUrl.includes( "javascript:")) return true;
        else ajax(decodeURI(reqUrl), true);
        return false;
    });
});
