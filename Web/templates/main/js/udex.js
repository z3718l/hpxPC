$(function () {
    var fixWrap = $('.fix-service');
    var fixOver = fixWrap.next('.sev-overlay');
    var fixMain = fixWrap.find('.sev-main');
    var fixCont = fixWrap.find('.sev-content');
    var fixFlash = fixWrap.find('.flash-info');
    var sevItem = fixWrap.find('.sev-item');
    var sevOLask = fixWrap.find('.sev-item.olask');

    sevItem.hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    });

    function setHeight() {
        winH = $(window).height();
        contH = fixCont.outerHeight();
        winH > contH ? fixCont.css('top', (winH - contH) / 2) : fixCont.css('top', 0);
        fixWrap.css('height', winH);
        fixMain.css('height', winH);
    }
    function showMain() {
        sevOLask.addClass('opened');
        fixFlash.fadeOut(300);
        $('html,body').addClass('fixHide');
        fixOver.fadeIn(300);
        fixMain.animate({
            'width': 240
        }, {
            duration: 300,
            queue: false,
            complete: function () {

            }
        });
    }
    function hideMain() {
        sevOLask.removeClass('opened');
        fixFlash.fadeIn(300);
        fixMain.animate({
            'width': 0
        }, {
            duration: 300,
            queue: false,
            complete: function () {
                fixOver.fadeOut(300);
                $('html,body').removeClass('fixHide');
            }
        });
    }

    sevOLask.click(function () {
        //easemobim.bind({tenantId: 26293});//28603
        //sevOLask.hasClass('opened') ? hideMain() : showMain();
    });
    fixOver.click(function () {
        hideMain();
    });
    setHeight();

    var flashInfo = setInterval(function () {
        fixFlash.animate({
            'top': -50
        }, {
            duration: 400,
            queue: false,
            complete: function () {
                fixFlash.animate({
                    'top': -40
                }, 300);
            }
        });
    }, 700);


    fixWrap.find('.sev-item.totop').click(function () {
        hideMain();
        $('html, body').animate({ scrollTop: 0 });
    });

    $("#qq").click(function () {
        window.open('http://wpa.qq.com/msgrd?v=3&uin=1926998270&site=qq&menu=yes');
    });

    $(window).resize(function () { setHeight() });
})
  (function (a, h, c, b, f, g) { a["UdeskApiObject"] = f; a[f] = a[f] || function () { (a[f].d = a[f].d || []).push(arguments) }; g = h.createElement(c); g.async = 1; g.src = b; c = h.getElementsByTagName(c)[0]; c.parentNode.insertBefore(g, c) })(window, document, "script", "http://assets-cli.huipiaoxian.udesk.cn/im_client/js/udeskApi.js?1484906754367", "ud");
ud({
    "code": "19hb4g1h",
    "link": "http://www.huipiaoxian.udesk.cn/im_client?web_plugin_id=23504",
    "targetSelector": "#div_udesk_im",
});