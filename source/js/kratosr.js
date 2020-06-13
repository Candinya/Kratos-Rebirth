var kr = new Object();
//-------------------参数设置区 开始-------------------
    kr.thome = "/";
    kr.ctime = "03/24/2018 15:31:36";
    kr.donate = "支持我~";
    kr.scan = "扫一扫，好不好？";
    kr.alipay = "/images/alipayqr.jpg";
    kr.wechat = "/images/wechatpayqr.png";
    kr.copy_notify = false;
    kr.copy_notify_text = "欢迎转载，请记得标明出处哦~";
    kr.site_logo = "images/favicon.png";
    kr.enable_site_leave_event = false;
    kr.site_logo_leave = "images/failure.ico";
    kr.site_title_leave = "{{{(>_<)}}}哦哟，崩溃啦~ ";
    kr.site_title_return = "(*´∇｀*)欸，又好啦~ ";
//-------------------参数设置区 结束-------------------

(function(){
    let shareMenu = ()=>{
        $(document).on("click",".Share",()=>{$(".share-wrap").fadeToggle("slow");});
    };

    var mainOffset;
    let sidebarAffixInit = ()=>{
        $('#sidebar').removeClass('affix');
        $('#sidebar').removeClass('affix-top');
        $('#sidebar').removeClass('affix-bottom');
        $('#sidebar').css('top', '');
        mainOffset = $('#main').offset().top;
    };
    let sidebarAffix = ()=>{
        sidebarAffixInit();
        if ($("#sidebar").height()){
            $(window).scroll(()=>{
                if ($('#main').children('section').outerHeight(true) > $('#sidebar').outerHeight(true)) {
                    if ($(window).scrollTop() < mainOffset - 56){
                        $('#sidebar').addClass('affix-top');
                        $('#sidebar').removeClass('affix');
                        $('#sidebar').css('top', '');
                    } else if ($(window).scrollTop() > $('#footer').offset().top - $('#sidebar').outerHeight(true) - 56){
                        $('#sidebar').addClass('affix-bottom');
                        $('#sidebar').removeClass('affix');
                        $('#sidebar').css('top', $('#footer').offset().top - $('#sidebar').outerHeight(true) - 345 + 'px');
                    } else {
                        $('#sidebar').addClass('affix');
                        $('#sidebar').removeClass('affix-top');
                        $('#sidebar').removeClass('affix-bottom');
                        $('#sidebar').css('top', '');
                    }
                } else {
                    sidebarAffixInit();
                }
            });
        }
    };
    
    // var toSearch = function(){
    //     $('.search-box').on("click",function(e){
    //         $("#searchform").animate({width:"200px"},200),
    //         $("#searchform input").css('display','block');
    //         $(document).one("click", function(){
    //             $("#searchform").animate({width:"0"},100),
    //             $("#searchform input").hide();
    //         });
    //         e.stopPropagation();
    //     });
    //     $('#searchform').on("click",function(e){e.stopPropagation();})
    // }
    let gotop = ()=>{
        $('.gotop-box').on('click',function(event){
            event.preventDefault();
            $('html, body').animate({
                scrollTop:$('html').offset().top
            },500);
            return false;
        });
        $(window).scroll(()=>{
            if ($(window).scrollTop()>200){
                $('.cd-tool').addClass('scrollDown');
            }else{
                $('.cd-tool').removeClass('scrollDown');
            }
        });
    };
    let offcanvas = ()=>{
        var $clone = $('#kratos-menu-wrap').clone();
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
            var w = $(window);
            $('#offcanvas-menu').css('height',w.height());
            if(w.width()>769){
                if($('.nav-toggle').hasClass('toon')){
                    $('.nav-toggle').removeClass('toon');
                    $('#offcanvas-menu').css('right','-240px');
                }
            }
        });
    };
    let mobiClick = ()=>{
        $(document).click((e)=>{
            var container = $("#offcanvas-menu,.js-kratos-nav-toggle");
            if(!container.is(e.target)&&container.has(e.target).length===0){
                if($('.nav-toggle').hasClass('toon')){
                    $('.nav-toggle').removeClass('toon');
                    $('#offcanvas-menu').css('right','-240px');
                }
            }
        });
    };
    let xControl = ()=>{
        $(document).on("click",".xHeading",()=>{
            var $this = $(this);
            $this.closest('.xControl').filter('.xContent').slideToggle(300);
            if ($this.closest('.xControl').hasClass('active')){
                $this.closest('.xControl').removeClass('active');
            }else{
                $this.closest('.xControl').addClass('active');
            }
            event.preventDefault();
        });
    };
    let donateConfig = ()=>{
        $(document).on("click",".Donate",()=>{
            layer.open({
                type:1,
                area:['300px', '370px'],
                title:kr.donate,
                resize:false,
                scrollbar:false,
                content:'<div class="donate-box"><div class="meta-pay text-center"><strong>'+kr.scan+'</strong></div><div class="qr-pay text-center"><img class="pay-img" id="alipay_qr" src="'+kr.alipay+'"><img class="pay-img d-none" id="wechat_qr" src="'+kr.wechat+'"></div><div class="choose-pay text-center mt-2"><input id="alipay" type="radio" name="pay-method" checked><label for="alipay" class="pay-button"><img src="' + kr.thome + 'images/alipay.png"></label><input id="wechatpay" type="radio" name="pay-method"><label for="wechatpay" class="pay-button"><img src="' + kr.thome + 'images/wechat.png"></label></div></div>'
            });
            $(".choose-pay input[type='radio']").click(()=>{
                var id= $(this).attr("id");
                if(id=='alipay'){$(".qr-pay #alipay_qr").removeClass('d-none');$(".qr-pay #wechat_qr").addClass('d-none')};
                if(id=='wechatpay'){$(".qr-pay #alipay_qr").addClass('d-none');$(".qr-pay #wechat_qr").removeClass('d-none')};
            });
        });
    };

    let setrandpic = ()=>{
        //图片
        var imageboxs = document.getElementsByClassName("kratos-entry-thumb-new-img");
        for(var i = 0, len = imageboxs.length; i < len; i++) {
            if (!($(imageboxs[i]).attr("src")))
                $(imageboxs[i]).attr("src", kr.thome + "images/thumb/thumb_"+Math.floor(Math.random()*20+1)+".jpg");

        }
    };

    let fancyboxInit = ()=>{
          if (typeof $.fancybox !== 'undefined'){
            $.fancybox.defaults.hash = false;
            $('.kratos-hentry').each(function(i){
                $(this).find('img').each(function(){
                  if ($(this).parent().hasClass('fancybox') || $(this).parent().hasClass('qrcode') || $(this).parent().is('a')) return;
                  var alt = this.alt;
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

    let tocNavInit = ()=> {
        $(document).on("click", 'a[class=toc-link]', function(){
            $('html, body').animate({
                scrollTop:$($(this).attr("href")).offset().top - 60
            },500);
            return false;
        });
    };

    $.fn.pjax_reload = ()=>{
        setrandpic();
        sidebarAffixInit();
        fancyboxInit();
    };

    

    $(()=>{
        shareMenu();
        gotop();
        // toSearch();
        offcanvas();
        mobiClick();
        xControl();
        donateConfig();
        sidebarAffix();
        tocNavInit();
        $(this).pjax_reload();
    });
}());

var now = new Date();
function createtime(){
    var grt = new Date(kr.ctime);
    now.setTime(now.getTime()+1000);
    days = (now-grt)/1000/60/60/24;dnum = Math.floor(days);
    hours = (now-grt)/1000/60/60-(24*dnum);hnum = Math.floor(hours);
    if(String(hnum).length==1){hnum = "0"+hnum;}
    minutes = (now-grt)/1000/60-(24*60*dnum)-(60*hnum);mnum = Math.floor(minutes);
    if(String(mnum).length==1){mnum = "0"+mnum;}
    seconds = (now-grt)/1000-(24*60*60*dnum)-(60*60*hnum)-(60*mnum);snum = Math.round(seconds);
    if(String(snum).length==1){snum = "0"+snum;}
    document.getElementById("span_dt_dt").innerHTML = dnum+"天"+hnum+"小时"+mnum+"分"+snum+"秒";
}
setInterval("createtime()",1000);

if (kr.copy_notify) {
    document.body.oncopy = ()=>{alert(kr.copy_notify_text);}
}

window.onload = ()=>{
    console.log('%c页面加载完毕消耗了'+Math.round(performance.now()*100)/100+'ms','background:#fff;color:#333;text-shadow:0 0 2px #eee,0 0 3px #eee,0 0 3px #eee,0 0 2px #eee,0 0 3px #eee;');
    // if (!(notMobile)) {
    //     $('.group-box').attr("style", "display:none");
    // }
};

if (kr.enable_site_leave_event) {
    var OriginTitile = document.title, titleTime;
    document.addEventListener('visibilitychange', ()=>{
        if (document.hidden) {
            document.title = kr.site_title_leave + OriginTitile;
            $('[rel="icon"]').attr("href", kr.thome + kr.site_logo_leave);
            clearTimeout(titleTime);
        } else {
            document.title = kr.site_title_return + OriginTitile;
            $('[rel="icon"]').attr("href", kr.thome + kr.site_logo);
            titleTime = setTimeout(()=>{
                document.title = OriginTitile;
            }, 2000);
        }
    });
}