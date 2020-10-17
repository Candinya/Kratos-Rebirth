let kr = {};

(()=>{
    const loadConfig = (cb) => {
        // 读取配置文件
        fetch('/config/main.json')
            .then((res) => {
                return res.json();
            })
            .then((cfg) => {
                kr = cfg;
            })
            .then(()=>{
                cb();
            });
    };
    const gotopInit = ()=>{
        const toolScroll = ()=>{
            if ($(window).scrollTop()>200){
                $('.kr-tool').addClass('scroll-down');
            } else {
                $('.kr-tool').removeClass('scroll-down');
            }
        }
        $('.gotop-box').on('click',function(event){
            // event.preventDefault();
            $('html, body').animate({
                scrollTop:$('html').offset().top
            },500);
            return false;
        });
        toolScroll();
        $(window).scroll(()=>{
            toolScroll();
        });
    };
    const offcanvas = ()=>{
        let $clone = $('#kratos-menu-wrap').clone();
        $clone.attr({
            'id':'offcanvas-menu'
        });
        $clone.filter('> ul').attr({
            'class':'ul-me',
            'id':''
        });
        $('#kratos-page').prepend($clone);
        $('.js-kratos-nav-toggle').on('click',()=>{
            if($('.nav-toggle').hasClass('toon')){
                $('.nav-toggle').removeClass('toon');
                $('#offcanvas-menu').css('right','-240px');
            }else{
                $('.nav-toggle').addClass('toon');
                $('#offcanvas-menu').css('right','0px');
            }
        });
        $('#offcanvas-menu').css('height',$(window).height());
        $('#offcanvas-menu').css('right','-240px');
        $(window).resize(()=>{
            const w = $(window);
            $('#offcanvas-menu').css('height',w.height());
            if(w.width()>769){
                if($('.nav-toggle').hasClass('toon')){
                    $('.nav-toggle').removeClass('toon');
                    $('#offcanvas-menu').css('right','-240px');
                }
            }
        });
    };
    const mobiClick = ()=>{
        $(document).click((e)=>{
            const container = $("#offcanvas-menu,.js-kratos-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('.nav-toggle').hasClass('toon')) {
                    $('.nav-toggle').removeClass('toon');
                    $('#offcanvas-menu').css('right','-240px');
                }
            }
        });
    };
    const xControl = ()=>{
        $(document).on("click",".xHeading", function(event){
            $(this).next().slideToggle(300);
            if ($(this).parent('.xControl').hasClass('active')) {
                $(this).parent('.xControl').removeClass('active');
            } else {
                $(this).parent('.xControl').addClass('active');
            }
            event.preventDefault();
        });
    };

    const donateConfig = ()=>{
        $(document).on("click",".donate",()=>{
            layer.open({
                type:1,
                area:['300px', '370px'],
                title:kr.donateBtn,
                resize:false,
                scrollbar:false,
                content:'<div class="donate-box"><div class="meta-pay text-center"><strong>'+kr.scanNotice+'</strong></div><div class="qr-pay text-center"><img class="pay-img" id="alipay_qr" src="'+kr.qr_alipay+'"><img class="pay-img d-none" id="wechat_qr" src="'+kr.qr_wechat+'"></div><div class="choose-pay text-center mt-2"><input id="alipay" type="radio" name="pay-method" checked><label for="alipay" class="pay-button"><img src="/images/alipay.webp"></label><input id="wechatpay" type="radio" name="pay-method"><label for="wechatpay" class="pay-button"><img src="/images/wechat.webp"></label></div></div>'
            });
            $(".choose-pay input[type='radio']").click(function(){
                const id = $(this).attr("id");
                if (id == 'alipay') {
                    $(".qr-pay #alipay_qr").removeClass('d-none');
                    $(".qr-pay #wechat_qr").addClass('d-none');
                }
                if (id == 'wechatpay') {
                    $(".qr-pay #alipay_qr").addClass('d-none');
                    $(".qr-pay #wechat_qr").removeClass('d-none');
                }
            });
        });
    };

    const shareMenu = ()=>{
        $(document).on("click",".share",()=>{$(".share-wrap").fadeToggle("slow");});
    };

    const setrandpic = ()=>{
        //图片
        const imageboxs = document.getElementsByClassName("kratos-entry-thumb-new-img");
        const prefix = kr.picCDN ? "//cdn.jsdelivr.net/gh/Candinya/Kratos-Rebirth@latest/source/" : "/";
        for (let i = 0, len = imageboxs.length; i < len; i++) {
            if (!($(imageboxs[i]).attr("src"))) {
                $(imageboxs[i]).attr("src", prefix + `images/thumb/thumb_${Math.floor(Math.random()*20+1)}.webp`);
            }
                
        }
    };

    const initMathjax = ()=>{
        if (typeof MathJax !== 'undefined') {
            // 渲染Mathjax的初始化函数（用于处理ajax后的情况）
            // 使用了同步处理的方式，可惜第一次加载页面时会双倍触发
            // （MathJax载入时会自动初始化一次）
            MathJax.Hub.Typeset();
        }
    };

    const fancyboxInit = ()=>{
          if (typeof $.fancybox !== 'undefined'){
            $.fancybox.defaults.hash = false;
            $('.kratos-hentry').each(function(i){
                $(this).find('img').each(function(){
                  if ($(this).parent().hasClass('fancybox') || $(this).parent().hasClass('qrcode') || $(this).parent().is('a')) return;
                  const alt = this.alt;
                  if (alt) $(this).after('<span class="caption">' + alt + '</span>');
                  $(this).wrap('<a rel="gallery" href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
                });
            
                $(this).find('.fancybox').each(function(){
                  $(this).attr('rel', 'article' + i);
                });
              });
            $('.fancybox').fancybox();
          }
    };

    const tocNavInit = ()=>{
        $(document).on("click", 'a[class=toc-link]', function(){
            $('html, body').animate({
                scrollTop:$(decodeURI($(this).attr("href"))).offset().top - 60
            },500);
            return false;
        });
    };

    let copyrightString;
    const setCopyright = ()=>{
        copyrightString = `

-------------------------
${kr.copyrightNotice}
作者：${document.querySelector("meta[name='author']").getAttribute('content')}
来源：${document.title}
链接：${window.location.href}
`;
    }

    const copyEventInit = ()=>{
        if (kr.copyrightNotice) {
            document.body.oncopy = (e)=>{
                const copiedContent = window.getSelection().toString();
                if (copiedContent.length > 150) {
                    e.preventDefault();
                    if (e.clipboardData) {
                        e.clipboardData.setData("text/plain", copiedContent + copyrightString);
                    }
                }
            };
        }
    };

    let docTitle = '';
    const saveTitle = () => {
        docTitle = document.title;
    };

    const leaveEventInit = () => {
        if (kr.siteLeaveEvent) {
            let titleTime;
            const OriginLogo = $('[rel="icon"]').attr("href");
            document.addEventListener('visibilitychange', ()=>{
                if (document.hidden) {
                    document.title = kr.leaveTitle;
                    if (kr.leaveLogo) {
                        $('[rel="icon"]').attr("href", kr.leaveLogo);
                    }
                    clearTimeout(titleTime);
                } else {
                    document.title = kr.returnTitle + " " + docTitle;
                    if (kr.leaveLogo) {
                        $('[rel="icon"]').attr("href", OriginLogo);
                    }
                    titleTime = setTimeout(()=>{
                        document.title = docTitle;
                        titleTime = 0;
                    }, 2000);
                }
            });
        }
    };

    const initTime = () => {
        let now = new Date();
        const grt = new Date(kr.createTime);
        const upTimeNode = document.getElementById("span_dt");
        setInterval(() => {
            now.setTime(now.getTime() + 1000);
            days = (now - grt) / 1000 / 60 / 60 / 24;
                dnum = Math.floor(days);
            hours = (now - grt) / 1000 / 60 / 60 - (24 * dnum);
                hnum = Math.floor(hours);
            if (String(hnum).length === 1) {
                hnum = "0" + hnum;
            }
            minutes = (now - grt) / 1000 / 60 - (24 * 60 * dnum) - (60 * hnum);
                mnum = Math.floor(minutes);
            if (String(mnum).length === 1) {
                mnum = "0" + mnum;
            }
            seconds = (now - grt) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
                snum = Math.round(seconds);
            if (String(snum).length === 1) {
                snum = "0" + snum;
            }
            upTimeNode.innerText = dnum + "天" + hnum + "小时" + mnum + "分" + snum + "秒";
        }, 1000);
    };

    const codeCopyInit = () => {
        // 使用了clipboard.js，所以非常的简洁，只需在前端生成对应的按钮和指定代码框的ID即可
        const codeFigures = document.querySelectorAll('figure.highlight');
        codeFigures.forEach((figure, count) => {
            figure
                .getElementsByTagName('table')[0]
                .getElementsByTagName('tbody')[0]
                .getElementsByTagName('tr')[0]
                .getElementsByClassName('code')[0]
            .setAttribute('id', `code-${count}`);

            figure.innerHTML += 
            `<button class="copy" data-clipboard-target="#code-${count}">
                <i class="fa fa-copy"></i>&nbsp;复制
            </button>`;
        });

        const clipboard = new ClipboardJS('button.copy');

        clipboard.on('success', (e) => {
            const origInner = e.trigger.innerHTML;
            e.trigger.innerHTML = `<i class="fa fa-check-circle"></i>&nbsp;成功~`;
            setTimeout(() => {
                e.trigger.innerHTML = origInner;
            }, 3000);

            e.clearSelection();
        });
    };

    $.fn.pjax_reload = ()=>{
        setrandpic();
        fancyboxInit();
        setCopyright();
        saveTitle();
        initMathjax();
        codeCopyInit();
    };

    const finishInfo = () => {
        console.log('页面加载完毕！消耗了 %c'+Math.round(performance.now()*100)/100+' ms','background:#282c34;color:#51aded;');
    };

    const funcUsingConfig = () => {
        // 因为涉及到配置文件，所以这些是只有在完成配置加载后才能调用的函数
        $(this).pjax_reload();
        copyEventInit();
        leaveEventInit();
        initTime();
        donateConfig();
    };

    $(() => {
        loadConfig(funcUsingConfig);
        gotopInit();
        offcanvas();
        mobiClick();
        xControl();
        shareMenu();
        tocNavInit();
    });

    window.onload = finishInfo();

})();
