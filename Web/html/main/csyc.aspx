<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="csyc.aspx.cs" Inherits="Web.html.main.csyc" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
   <meta charset="utf-8" />
    <meta name="baidu-site-verification" content="8wHB899l5W" />
    <meta name="sogou_site_verification" content="QY1qSYeHpf" />
    <meta name="viewport" content="width=1200px, user-scalable=true" />
    <meta name="keywords" content="{site.seo_keyword}" />
    <meta name="description" content="{site.seo_description}" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="bookmark" href="/favicon.ico" />
    <link href="../../templates/main/css/bootstrap.min.css" rel="stylesheet" />
    
    <link href="../../templates/main/css/sweetalert.css" rel="stylesheet" type="text/css" />
    <link href="../../templates/main/css/service.css" rel="stylesheet" type="text/css" />
    <link href="<%templateskin%>/css/style.css" rel="stylesheet" type="text/css" />




    <script type="text/javascript">
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
    </script>
    <script>
        (function (a, h, c, b, f, g) { a["UdeskApiObject"] = f; a[f] = a[f] || function () { (a[f].d = a[f].d || []).push(arguments) }; g = h.createElement(c); g.async = 1; g.src = b; c = h.getElementsByTagName(c)[0]; c.parentNode.insertBefore(g, c) })(window, document, "script", "http://assets-cli.huipiaoxian.udesk.cn/im_client/js/udeskApi.js?1484906754367", "ud");
        ud({
            "code": "19hb4g1h",
            "link": "http://www.huipiaoxian.udesk.cn/im_client?web_plugin_id=23504",
            "targetSelector": "#div_udesk_im",
        });
    </script>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div class="fix-service">
        <div class="sev-trg">
            <div id="div_udesk_im" class="sev-item olask">
                <div class="flash-info"></div>
                <span class="ico"><img src= "../../templates/main/images/serv.png" /></span>
                <span class="lab">在线客服</span>
            </div>
            <div class="sev-item calt" id="qq">
                <i class="icon icon-qq"></i>
                <span class="lab">QQ客服</span>
            </div>
            <div class="sev-item downapp">
                <i class="icon icon-phone"></i>
                <span class="lab">手机APP</span>
                <div class="sev-sub cf">
                    <div class="sev-follow">
                        <i class="img"><img src="../../templates/main/images/qr-codes-3.png" alt="" /></i>
                        <span>扫描下载汇票线App<br /></span>
                    </div>
                </div>
            </div>
            <div class="sev-item weixin">
                <i class="icon icon-weixin"></i>
                <span class="lab">微信</span>
                <div class="sev-sub">
                    <div class="sev-follow"><i class="img"><img src="../../templates/main/images/qr-codes-1.png" alt="" /></i><span>汇票线官方服务号</span></div>
                    <div class="sev-follow"><i class="img"><img src="../../templates/main/images/qr-codes-2.png" alt="" /></i><span>汇票线官方订阅号</span></div>
                </div>
            </div>
            <div class="sev-item totop">
                <i class="icon icon-totop"></i>
                <span class="lab">回到顶部</span>
            </div>
        </div>
    </div>
    </form>
</body>
</html>
