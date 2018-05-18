var xb = new Object();
    xb.thome = "/";
    xb.ctime = "03/24/2018 15:31:36";
    xb.donate = "支持咱~";
    xb.scan = "扫一扫，好不好？";
    xb.alipay = "/images/alipayqr.jpg";
    xb.wechat = "/images/wechatpayqr.jpg";
    xb.site_sh = 55; //有待更改

(function(){
    'use strict';
    var shareMenu = function(){
        $(document).on("click",".Share",function(){$(".share-wrap").fadeToggle("slow");});
    }
    var sidebaraffix = function(){
        if($("#sidebar").height()&&xb.site_sh){
            if($("#main").height()>$("#sidebar").height()){
                var footerHeight = 0;
                if($('#page-footer').length>0){
                    footerHeight = $('#page-footer').outerHeight(true);
                }
                $('#sidebar').affix({
                    offset:{
                        top:$('#sidebar').offset().top-xb.site_sh,
                        bottom:$('#footer').outerHeight(true)+footerHeight+6
                    }
                });
            }
        }
    }
    var toSearch = function(){
        $('.search-box').on("click",function(e){
            $("#searchform").animate({width:"200px"},200),
            $("#searchform input").css('display','block');
            $(document).one("click", function(){
                $("#searchform").animate({width:"0"},100),
                $("#searchform input").hide();
            });
            e.stopPropagation();
        });
        $('#searchform').on("click",function(e){e.stopPropagation();})
    }
    // var showlove = function(){
    //     $(document).on("click",".Love",function(){
    //         if($(this).hasClass('done')){
    //             layer.msg('您已经支持过了',function(){});
    //             return false;
    //         }else{
    //             $(this).addClass('done');
    //             layer.msg('感谢您的支持');
    //             var id = $(this).data("id"),
    //                 action = $(this).data('action'),
    //                 rateHolder = $(this).children('.count');
    //             var ajax_data = {
    //                 action:"love",
    //                 um_id:id,
    //                 um_action:action
    //             };
    //             $.post("/wp-admin/admin-ajax.php",ajax_data,function(data){
    //                 $(rateHolder).html(data);
    //             });
    //             return false;
    //         }
    //     });
    // }
    var gotop = function(){
        $('.gotop-box').on('click',function(event){
            event.preventDefault();
            $('html, body').animate({
                scrollTop:$('html').offset().top
            },500);
            return false;
        });
        $(window).scroll(function(){
            var $win = $(window);
            if ($win.scrollTop()>200){
                $('.gotop-box').addClass('active');
            }else{
                $('.gotop-box').removeClass('active');
            }
        });
    }
    var qqpic = function(){
        $("#qqg-img").mouseout(function(){
            $("#qqg-pic")[0].style.display = 'none';
        })
        $("#qqg-img").mouseover(function(){
            $("#qqg-pic")[0].style.display = 'block';
        })
    }
    var showPhotos = function(){
        layer.photos({
          photos:'.kratos-post-content',
          anim: 0
        });
    }
    var offcanvas = function(){
        var $clone = $('#kratos-menu-wrap').clone();
        $clone.attr({
            'id':'offcanvas-menu'
        });
        $clone.find('> ul').attr({
            'class':'ul-me',
            'id':''
        });
        $('#kratos-page').prepend($clone);
        $('.js-kratos-nav-toggle').on('click',function(){
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
        $(window).resize(function(){
            var w = $(window);
            $('#offcanvas-menu').css('height',w.height());
            if(w.width()>769){
                if($('.nav-toggle').hasClass('toon')){
                    $('.nav-toggle').removeClass('toon');
                    $('#offcanvas-menu').css('right','-240px');
                }
            }
        });
    }
    var mobiClick = function(){
        $(document).click(function(e){
            var container = $("#offcanvas-menu,.js-kratos-nav-toggle");
            if(!container.is(e.target)&&container.has(e.target).length===0){
                if($('.nav-toggle').hasClass('toon')){
                    $('.nav-toggle').removeClass('toon');
                    $('#offcanvas-menu').css('right','-240px');
                }
            }
        });
    }
    var xControl = function(){
        $(document).on("click",".xHeading",function(){
            var $this = $(this);
            $this.closest('.xControl').find('.xContent').slideToggle(300);
            if ($this.closest('.xControl').hasClass('active')){
                $this.closest('.xControl').removeClass('active');
            }else{
                $this.closest('.xControl').addClass('active');
            }
            event.preventDefault();
        });
    }
    var donateConfig = function(){
        $(document).on("click",".Donate",function(){
            layer.open({
                type:1,
                area:['300px', '370px'],
                title:xb.donate,
                resize:false,
                scrollbar:false,
                content:'<div class="donate-box"><div class="meta-pay text-center"><strong>'+xb.scan+'</strong></div><div class="qr-pay text-center"><img class="pay-img" id="alipay_qr" src="'+xb.alipay+'"><img class="pay-img d-none" id="wechat_qr" src="'+xb.wechat+'"></div><div class="choose-pay text-center mt-2"><input id="alipay" type="radio" name="pay-method" checked><label for="alipay" class="pay-button"><img src="'+'/images/alipay.png"></label><input id="wechatpay" type="radio" name="pay-method"><label for="wechatpay" class="pay-button"><img src="'+'/images/wechat.png"></label></div></div>'
            });
            $(".choose-pay input[type='radio']").click(function(){
                var id= $(this).attr("id");
                if(id=='alipay'){$(".qr-pay #alipay_qr").removeClass('d-none');$(".qr-pay #wechat_qr").addClass('d-none')};
                if(id=='wechatpay'){$(".qr-pay #alipay_qr").addClass('d-none');$(".qr-pay #wechat_qr").removeClass('d-none')};
            });
        });
    }

    var setrandpic = function() {
        //图片
        var imageboxs = document.getElementsByClassName("kratos-entry-thumb-new-img");
        for(var i = 0, len = imageboxs.length; i < len; i++) {
            $(imageboxs[i]).attr("src", "/images/thumb/thumb_"+Math.floor(Math.random()*20+1)+".jpg");
        }
    }
    // var OwOcfg = function(){
    //     if($("#commentform").height()){
    //         var OwO_demo = new OwO({
    //             logo:'OωO表情',
    //             container:document.getElementsByClassName('OwO')[0],
    //             target:document.getElementsByClassName('OwO')[0],
    //             api:xb.thome+'/inc/OwO.json',
    //             position:'down',
    //             width:'90%',
    //             maxHeight:'250px'
    //         });
    //     }
    // }
    $(document).on('pjax:complete', function() {
        showPhotos();
        setrandpic();
        //OwOcfg();
    });
    $(function(){
        shareMenu();
        //showlove();
        gotop();
        qqpic();
        toSearch();
        showPhotos();
        offcanvas();
        mobiClick();
        xControl();
        donateConfig();
        //OwOcfg();
        sidebaraffix();
        setrandpic();
        
    });
}());
var now = new Date();
function createtime(){
    var grt = new Date(xb.ctime);
    now.setTime(now.getTime()+250);
    days = (now-grt)/1000/60/60/24;dnum = Math.floor(days);
    hours = (now-grt)/1000/60/60-(24*dnum);hnum = Math.floor(hours);
    if(String(hnum).length==1){hnum = "0"+hnum;}
    minutes = (now-grt)/1000/60-(24*60*dnum)-(60*hnum);mnum = Math.floor(minutes);
    if(String(mnum).length==1){mnum = "0"+mnum;}
    seconds = (now-grt)/1000-(24*60*60*dnum)-(60*60*hnum)-(60*mnum);snum = Math.round(seconds);
    if(String(snum).length==1){snum = "0"+snum;}
    document.getElementById("span_dt_dt").innerHTML = dnum+"天"+hnum+"小时"+mnum+"分"+snum+"秒";
}
setInterval("createtime()",250);
document.body.oncopy=function(){alert('欢迎转载，请记得标明出处哦~');}
window.onload = function(){
    var now = new Date().getTime();
    var page_load_time = now-performance.timing.navigationStart;
    console.log('%c页面加载完毕消耗了'+Math.round(performance.now()*100)/100+'ms','background:#fff;color:#333;text-shadow:0 0 2px #eee,0 0 3px #eee,0 0 3px #eee,0 0 2px #eee,0 0 3px #eee;');
};

var OriginTitile = document.title, titleTime;
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.title = '(つェ⊂)哦哟，崩溃啦~ ' + OriginTitile;
        $('[rel="icon"]').attr("href", "/images/failure.ico");
        clearTimeout(titleTime);
    } else {
        document.title = '(*´∇｀*)欸，又好啦~ ' + OriginTitile;
        $('[rel="icon"]').attr("href", "/images/favicon.ico");
        titleTime = setTimeout(function() {
            document.title = OriginTitile;
        }, 2000);
    }
});


// PJAX相关

