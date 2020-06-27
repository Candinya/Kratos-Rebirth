$(function() {
    var row_content = '#kratos-blog-post .row';
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
                $(row_content).html( e.state.html );
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
                    html: $(document).find(row_content).html()
                    }, document.title, location.href);
                $("body,html").animate({scrollTop:theTop}, 600);
                NProgress.start();
            },
            success: function(data) {
                if (typeof $(data).find(row_content).html() === 'undefined') {
                    location.href = reqUrl;
                } else {
                    $(row_content).html($(data).find(row_content).html());
                }
                document.title = $(data).filter("title").text();
                if (needPushState) {
                    window.history.pushState({
                        url: reqUrl,
                        title: $(data).filter("title").text(),
                        html: $(data).find(row_content).html()
                    }, $(data).filter("title").text(), reqUrl);
                }
            },
            complete: function() {
                window.load =  reload_func();
                NProgress.done();
            },
            timeout: 8000,
            error: function() {
                location.href = reqUrl;
            }
        });
    }
    $(document).on("click", 'a[target!=_blank][rel!=gallery][class!=toc-link]', function() {
      var req_url = $(this).attr("href");
      if (req_url === undefined) return true;
      else if (req_url.indexOf( "javascript:") !== -1) return true;
      else ajax(req_url, true);
      return false;
    });
});
