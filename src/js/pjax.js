$(function() {
    const mainElement = '#kratos-blog-post .row';
    theTop = notMobile ? $("#kratos-blog-post").offset().top-40 : 0;
    function reload_func() {
        $(this).pjax_reload();
        OriginTitile = document.title;
    }
    window.addEventListener('popstate', function(e) {
        if( e.state ){
            document.title = e.state.title || document.title;
            $("body,html").animate({scrollTop:theTop}, 600);
            if (typeof e.state.html === 'undefined') {
                ajax(e.state.url, false);
            } else {
                $(mainElement).html( e.state.html );
            }
            window.load = reload_func();
        }
    });
    function ajax(reqUrl, needPushState) {
        $.ajax({
            url: reqUrl,
            beforeSend: function () {
                history.replaceState({
                    url: location.href,
                    title: document.title,
                    html: $(document).find(mainElement).html()
                    }, document.title, location.href);
                $("body,html").animate({scrollTop:theTop}, 600);
                NProgress.start();
            },
            success: function(data) {
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
                window.load = reload_func();
                NProgress.done();
                
                // 如果URL里有指定节点ID，则滚动到相应的节点位置
                const reqId = reqUrl.match(/\#.+$/);
                if (reqId) {
                    $("body,html").animate({scrollTop:$(reqId[0]).offset().top - 40}, 600);
                }
            },
            timeout: 6000,
            error: function() {
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
