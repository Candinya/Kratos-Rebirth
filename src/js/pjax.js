$(function() {
    const mainElement = '#kratos-blog-post .row';
    theTop = notMobile ? $("#kratos-blog-post").offset().top-40 : 0;
    window.addEventListener('popstate', (e) => {
        if ( e.state ) {
            document.title = e.state.title || document.title;
            $("body,html").animate({scrollTop:theTop}, 600);
            if (typeof e.state.html === 'undefined') {
                ajax(e.state.url, false);
            } else {
                $(mainElement).html( e.state.html );
            }
            OriginTitile = document.title;
            window.dispatchEvent(pjaxEvents.complete);
        }
    });

    const pjaxEvents = {
        before:   new Event('pjax:before')  ,
        success:  new Event('pjax:success') ,
        complete: new Event('pjax:complete'),
        error:    new Event('pjax:error')   ,
    };

    function ajax(reqUrl, needPushState) {
        $.ajax({
            url: reqUrl,
            beforeSend: function () {
                window.dispatchEvent(pjaxEvents.before);

                // 防止评论区再被加载，重置加载函数
                if (typeof load_comm !== 'undefined' && load_comm !== null) {
                    load_comm = null;
                }
                history.replaceState({
                    url: location.href,
                    title: document.title,
                    html: $(document).find(mainElement).html()
                    }, document.title, location.href);
                $("body,html").animate({scrollTop:theTop}, 600);
                NProgress.start();
            },
            success: function(data) {
                window.dispatchEvent(pjaxEvents.success);
                
                if (typeof $(data).find(mainElement).html() === 'undefined') {
                    location.href = reqUrl;
                } else {
                    $(mainElement).html($(data).find(mainElement).html());
                }
                document.title = $(data).filter("title").text();
                if (needPushState) {
                    window.history.pushState({
                        url: reqUrl,
                        title: $(data).filter("title").text(),
                        html: $(data).find(mainElement).html()
                    }, $(data).filter("title").text(), reqUrl);
                }
            },
            complete: function() {
                window.dispatchEvent(pjaxEvents.complete);

                OriginTitile = document.title;
                NProgress.done();
                
                // 如果URL里有指定节点ID，则滚动到相应的节点位置
                const reqId = reqUrl.match(/\#.+$/);
                if (reqId) {
                    $("body,html").animate({scrollTop:$(reqId[0]).offset().top - 40}, 600);
                }
            },
            timeout: 6000,
            error: function() {
                window.dispatchEvent(pjaxEvents.error);

                location.href = reqUrl;
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
