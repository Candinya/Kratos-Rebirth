let kr = {};

/**
 * 因为后台任务API还是相当新的，而你的代码可能需要在那些仍不支持此API的浏览器上运行。
 * 你可以把 setTimeout() 用作回调选项来做这样的事。
 * 这个并不是 polyfill ，因为它在功能上并不相同； 
 * setTimeout() 并不会让你利用空闲时段，而是使你的代码在情况允许时执行你的代码，
 * 以使我们可以尽可能地避免造成用户体验性能表现延迟的后果。
 */
// https://developer.mozilla.org/zh-CN/docs/Web/API/Background_Tasks_API 
window.requestIdleCallback = window.requestIdleCallback || function(handler) {
    let startTime = Date.now();
    return setTimeout(function() {
      handler({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50.0 - (Date.now() - startTime));
        }
      });
    }, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
    clearTimeout(id);
};

(()=>{
    const loadConfig = (cb) => {
        // 读取配置文件
        fetch((window.kr?.siteRoot || '/') + 'config/main.json')
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
    const pageScrollDownInit = ()=>{
        let isScrolledDown = false;
        const pageScrollDownClass = () => {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 200){
                    if (!isScrolledDown) {
                        document.body.classList.add('scroll-down');
                        isScrolledDown = true;
                    }
                } else {
                    if (isScrolledDown) {
                        document.body.classList.remove('scroll-down');
                        isScrolledDown = false;
                    }
                }
            });
        };
        $('.gotop-box').on('click',function(event){
            // event.preventDefault();
            $('html, body').animate({
                scrollTop:$('html').offset().top
            },500);
            return false;
        });
        pageScrollDownClass();
        window.addEventListener('scroll', pageScrollDownClass);
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
        // 图片
        const imageboxs = document.getElementsByClassName("kratos-entry-thumb-new-img");
        let prefix = window.kr?.siteRoot || '/';
        if (kr.picCDN || kr.pic?.CDN) {
            switch (kr.picCDN) {
                case 'unpkg':
                    prefix = "//unpkg.com/kratos-rebirth@latest/source/";
                    break;
                case 'jsdelivr':
                default:
                    prefix = "//cdn.jsdelivr.net/npm/kratos-rebirth@latest/source/";
                    break;
            }
        }
        const randomAmount = parseInt(kr.pic?.random_amount) || 20;
        let picFileNameTemplate = "images/thumb/thumb_{no}.webp";
        if (kr.pic && kr.pic.filename) {
            if (kr.pic.filename.includes('//')) {
                // 是绝对路径，那么忽略 CDN 选项
                picFileNameTemplate = kr.pic.filename;
            } else {
                // 是相对主题根目录的路径
                picFileNameTemplate = prefix + kr.pic.filename;
            }
        }
        const usedPics = new Array(randomAmount + 1);

        const generateNewPicID = () => {
            let remailFailCounts = 5; // set max fail counts
            let picNo;
            while (remailFailCounts > 0) {
                // rand one
                picNo = Math.floor(Math.random() * randomAmount + 1);
                if (!usedPics[picNo]) {
                    // valid
                    break;
                } else {
                    // fails
                    remailFailCounts--;
                }
            }

            if (remailFailCounts <= 0) {
                // rand failed, find one manually
                picNo = -1;
                for (let i = 1; i <= randomAmount; i++) {
                    if (!usedPics[i]) {
                        // use first
                        picNo = i;
                        break;
                    }
                }
                if (picNo === -1) {
                    // All used
                    // clear all
                    for (let i = 1; i <= randomAmount; i++) {
                        usedPics[i] = false;
                    }
                    // rand one
                    picNo = Math.floor(Math.random() * randomAmount + 1);
                }
            }

            // mark as used
            usedPics[picNo] = true;
            
            // return
            return picNo;
        }

        for (let i = 0, len = imageboxs.length; i < len; i++) {
            if (!($(imageboxs[i]).attr("src"))) {
                const picNo = generateNewPicID();
                const picFileName = picFileNameTemplate.replace("{no}", picNo.toString());
                $(imageboxs[i]).attr("src", picFileName);
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

    const getTimeString = (msec, exact = true) => {
        let tString;
        const sec = msec / 1000;
        const dnum = Math.floor(sec / 60 / 60 / 24);
        const hnum = Math.floor(sec / 60 / 60 - (24 * dnum));
        const mnum = Math.floor(sec / 60 - (24 * 60 * dnum) - (60 * hnum));
        const snum = Math.floor(sec - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum));
        let dstr = dnum.toString();
        let hstr = hnum.toString();
        let mstr = mnum.toString();
        let sstr = snum.toString();
        if (exact) {
            if (dstr && dstr.length === 1) {
                dstr = '0' + dstr;
            }
            if (hstr && hstr.length === 1) {
                hstr = '0' + hstr;
            }
            if (mstr && mstr.length === 1) {
                mstr = '0' + mstr;
            }
            if (sstr && sstr.length === 1) {
                sstr = '0' + sstr;
            }
            tString = dstr + "天" + hstr + "小时" + mstr + "分" + sstr + "秒";
        } else {
            // 大概值
            if (dnum < 540) {
                // 一年半内
                if (dnum < 60) {
                    // 两个月内
                    tString = dstr + "天";
                } else {
                    // 年内月外
                    tString = Math.floor(dnum / 30).toString() + '个月';
                }
            } else {
                // 年外
                tString = Math.floor(dnum / 365).toString() + '年';
            }
        }
        return tString;
    };

    const initTime = () => {
        const createTime = new Date(kr.createTime);
        const upTimeNode = document.getElementById("span_dt");
        setInterval(() => {
            upTimeNode.innerText = getTimeString(Date.now() - createTime);
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

    const commentsLazyLoad = () => {
        // 检查当前是否在浏览器中运行
        const runningOnBrowser = typeof window !== "undefined";
        // 通过检查 scroll 事件 API 和 User-Agent 来匹配爬虫
        const isBot = runningOnBrowser && !("onscroll" in window) || typeof navigator !== "undefined" && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent);
        // 检查当前浏览器是否支持 IntersectionObserver API
        const supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;
        // 需要懒加载的评论区块
        const commsArea = document.querySelector('.post-comments.lazy-load');
        // 加载评论的函数
        const loadwork = () => {
            if (window.loadCommentsEventHandler) {
                // 取消上一个加载事件
                window.cancelIdleCallback(window.loadCommentsEventHandler);
            }
            // 加载新评论模块
            window.loadCommentsEventHandler = window.requestIdleCallback(load_comm);
            // 防止二次加载，清理掉函数
            load_comm = null;
        };
        if (runningOnBrowser && !isBot && supportsIntersectionObserver && commsArea !== null) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadwork();
                    observer.disconnect();
                }
            }, { threshold: 0 });
            observer.observe(commsArea);
        } else if (typeof load_comm !== 'undefined' && load_comm !== null) {
            // 直接加载
            loadwork();
        }
    };

    const expireNotify = () => {
        if (kr.expire_day) {
            const expireAlert = document.getElementById('expire-alert');
            if (expireAlert) {
                const dateTimeTag = expireAlert.querySelector('time');
                const updateDateTime = new Date(parseInt(dateTimeTag.getAttribute('datetime')));
                const nowDateTime = Date.now();
                const gap = nowDateTime - updateDateTime;
                if (gap > kr.expire_day * 24 * 3600 * 1000) {
                    // 内容可能过期，需要提示
                    dateTimeTag.innerText = getTimeString(gap, false);
                    expireAlert.classList.remove('hidden');
                }
            }
            
        }
    };

    const tocAnimInit = () => {
        if (document.getElementById('krw-toc') !== null) {
            // 有toc的页面
            // 获取侧边栏所有的toc项
            const tocDOMs = document.getElementById("krw-toc").getElementsByClassName('toc-item');
            // 元素高度映射记录
            const tocHeightMap = [];
            try {
                Array.from(tocDOMs).forEach((tocItem) => {
                    // 获取链接子元素
                    const linkItem = tocItem.getElementsByClassName('toc-link')[0];
                    // 获取链接地址
                    const titleText = decodeURI(linkItem.getAttribute('href'));
                    // 检测链接是否有效：无效则进行回落处理
                    if (!titleText.includes('#')) {
                        throw new Error('TOC 小标题链接无效，进行回落处理');
                    }
                    // 获取目标标题高度
                    const titleHeight = document.getElementById(titleText.replace('#', '')).offsetTop;
                    // 压入记录
                    tocHeightMap.push({
                        h: titleHeight,
                        el: tocItem
                    });
                });
            } catch (e) {
                console.log('错误：', e.message);
                Array.from(tocDOMs).forEach((tocItem) => {
                    tocItem.classList.add('show');
                });
                return;
            }

            // 排序
            tocHeightMap.sort((a, b) => {
                return a.h - b.h;
            });

            // 标题定位函数
            const tocGetId = (startPos = -1) => {
                let newPos;
                if (!Number.isInteger(startPos) || startPos < 0 || startPos > tocHeightMap.length - 1) {
                    newPos = 0;
                } else {
                    newPos = startPos;
                }
                const nowY = window.scrollY;
                if (tocHeightMap[0].h > nowY) {
                    // 还没到第一级标题
                    newPos = -1;
                } else if (tocHeightMap[tocHeightMap.length - 1].h <= nowY) {
                    // 最后一级标题
                    newPos = tocHeightMap.length - 1;
                } else {
                    while (!(tocHeightMap[newPos].h <= nowY && tocHeightMap[newPos+1].h > nowY)) {
                        if (tocHeightMap[newPos].h > nowY && newPos > 0) {
                            newPos--;
                        } else if (tocHeightMap[newPos+1].h <= nowY && newPos < tocHeightMap.length - 1) {
                            newPos++;
                        }
                    }
                }
                return newPos;
            }

            // 标题激活状态修改函数
            const tocActivate = (oldId, newId) => {
                if (oldId === newId) {
                    // Do nothing...
                    return;
                }
                if (oldId !== -1) {
                    // 清除旧标题激活状态
                    tocHeightMap[oldId].el.classList.remove('active');
                    tocHeightMap[oldId].el.classList.remove('show');
                    // 清除旧元素层级展示状态
                    let nCur = tocHeightMap[oldId].el
                    while (!nCur.classList.contains('toc')) {
                        if (nCur.classList.contains('toc-item')) {
                            nCur.classList.remove('show');
                        }
                        nCur = nCur.parentNode;
                    }
                }
                if (newId !== -1) {
                    // 构建新标题激活状态
                    tocHeightMap[newId].el.classList.add('active');
                    tocHeightMap[newId].el.classList.add('show');
                    // 建立新元素层级展示状态
                    let nCur = tocHeightMap[newId].el
                    while (!nCur.classList.contains('toc')) {
                        if (nCur.classList.contains('toc-item')) {
                            nCur.classList.add('show');
                        }
                        nCur = nCur.parentNode;
                    }
                }
            };

            // 初始化为不存在的标题
            let curTocId = -1;
            // 切换 toc 状态的处理函数
            const toggleToc = () => {
                const newTocId = tocGetId(curTocId);
                tocActivate(curTocId, newTocId);
                curTocId = newTocId;
            };

            // 处理事件的函数
            const handleTocAnim = () => {
                // 现在的检测事件ID
                let nowEvent = 0;
                window.requestAnimationFrame(() => {
                    if (nowEvent) {
                        // 为避免高频触发，使用检测事件来控制频率
                        clearTimeout(nowEvent);
                    }
                    nowEvent = setTimeout((nowY) => {
                        if (nowY === window.scrollY) {
                            // 0.1s位置没有变化，视为页面停止
                            toggleToc();
                        }
                    }, 100, window.scrollY);
                });
            }

            window.addEventListener('scroll', handleTocAnim);

            // 初始化完成运行一次
            toggleToc();

            // pjax前销毁
            window.addEventListener('pjax:before', () => {
                tocHeightMap.length = 0; // 奇妙的数组清空方式
                window.removeEventListener('scroll', handleTocAnim);
            }, { once: true });

            // 阅读进度
            const readProgBar = document.getElementsByClassName('toc-progress-bar')[0];
            const setPercent = () => {
                readProgBar.style.width = (window.scrollY / document.body.clientHeight * 100).toString() + '%';
            }
            window.addEventListener('scroll', () => {
                window.requestAnimationFrame(setPercent);
            });
            setPercent(); // 初始运行一次

            /**
             * 现在的问题：
             * 首次打开页面时候由于会有 window.onload 事件的等待存在，
             * 所以会等待所有图片加载完成再调用核心的函数，因而基本保证
             * 各标题间的位置不会乱动，但代价就是要等页面加载完成才能加
             * 载toc样式，问题不是太大；
             * pjax后则会由于没有 window.onload 事件的限制，因而容易
             * 出现图片还没加载但是标题已经计算完成的情况，进而导致标题
             * 定位乱飘，失去引导意义；
             * 有一种解决方案是每次触发定位事件时都重新计算各元素高度，
             * 但是怀疑那样会非常耗费时间，降低用户使用体验；
             * 或者就是定时检测变化，但总觉得也非常不优雅，比较难受；
             * 之后会考虑重载 hexo 的辅助函数，重写 asset_img 标签
             * 用来内置 fancybox 的调用、计算图片大小进行格式转换与预
             * 设置大小，但不知道 hexo 是否支持这样的操作，是否会报错，
             * 还是说需要提交一个 PR 才能正确运行（猫咪摊手.jpg
             */
        }
    };

    const topNavScrollToggleInit = () => {
        // 判断设置参数
        if (!kr.topNavScrollToggle) {
            return; // 没有启用
        }
        // 记录上一次滚动高度，用于判断滚动方向
        let lastHeight = window.innerHeight;
        // 记录顶部栏隐藏状态
        let isTopNavHidden = false;

        // 处理事件的函数
        const handleTopNavScrollToggle = () => {
            window.requestAnimationFrame(() => {
                if (lastHeight < window.scrollY) {
                    // 向下滚动
                    if (!isTopNavHidden) {
                        document.body.classList.add('nav-up');
                        isTopNavHidden = true;
                    }
                } else if (lastHeight > window.scrollY) {
                    // 向上滚动
                    if (isTopNavHidden) {
                        document.body.classList.remove('nav-up');
                        isTopNavHidden = false;
                    }
                }
                // 相等则不做处理
                lastHeight = window.scrollY;
            });
        };

        // 仅处理鼠标滚动
        window.addEventListener('wheel', handleTopNavScrollToggle);

    };

    const pjaxReload = () => {
        setrandpic();
        fancyboxInit();
        setCopyright();
        saveTitle();
        initMathjax();
        codeCopyInit();
        commentsLazyLoad();
        expireNotify();
        tocAnimInit();
    };

    const funcUsingConfig = () => {
        // 因为涉及到配置文件，所以这些是只有在完成配置加载后才能调用的函数
        pjaxReload();

        copyEventInit();
        leaveEventInit();
        initTime();
        donateConfig();
        topNavScrollToggleInit();
    };

    window.addEventListener('pjax:complete', pjaxReload);

    window.addEventListener('window:onload', () => {
        loadConfig(funcUsingConfig);
        pageScrollDownInit();
        offcanvas();
        mobiClick();
        xControl();
        shareMenu();
        tocNavInit();
    }, { once: true });

    window.onload = () => {
        window.dispatchEvent(new Event('window:onload'));
        console.log('页面加载完毕！消耗了 %c'+Math.round(performance.now()*100)/100+' ms','background:#282c34;color:#51aded;');
    };

})();
