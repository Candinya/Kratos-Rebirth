$(function() {
    var ajx_main = '#main',
    theTop = notMobile ? $("#kratos-blog-post").offset().top-40 : 0;
    function reload_func() {
        $(this).pjax_reload();
        OriginTitile = document.title;
    }
    window.addEventListener('popstate', function(e) {
        if( e.state ){
            document.title = e.state.title;
            $("body,html").animate({scrollTop:theTop}, 600);
            if (e.state.html === undefined) {
                ajax(e.state.url, false);
            } else {
                $(ajx_main).html( e.state.html );
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
                    html: $(document).find(ajx_main).html()
                    }, document.title, location.href);
                $("body,html").animate({scrollTop:theTop}, 600);
                NProgress.start();
            },
            success: function(data) {
                if ($(data).find(ajx_main).html() === undefined) {
                    location.href = reqUrl;
                } else {
                    $(ajx_main).html($(data).find(ajx_main).html());
                }
                document.title = $(data).filter("title").text();
                if (needPushState) {
                    window.history.pushState({
                        url: reqUrl,
                        title: $(data).filter("title").text(),
                        html: $(data).find(ajx_main).html()
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
    $(document).on("click", 'a[target!=_blank][rel!=gallery]', function() {
      //var fancybox = $(this).data('fancybox');
      //if(fancybox && fancybox === 'gallery') return false;
      var req_url = $(this).attr("href");
      if (req_url === undefined) return true;
      else if (req_url.indexOf( "javascript:") !== -1) return true;
      else ajax(req_url, true);
      return false;
    });
});
