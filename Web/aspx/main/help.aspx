﻿<%@ Page Language="C#" AutoEventWireup="true" Inherits="DTcms.Web.UI.Page.index" ValidateRequest="false" %>
<%@ Import namespace="System.Collections.Generic" %>
<%@ Import namespace="System.Text" %>
<%@ Import namespace="System.Data" %>
<%@ Import namespace="DTcms.Common" %>

<script runat="server">
override protected void OnInit(EventArgs e)
{

	/*
		This page was created by DTcms Template Engine at 2017/10/9 10:13:48.
		本页面代码由DTcms模板引擎生成于 2017/10/9 10:13:48.
	*/

	base.OnInit(e);
	StringBuilder templateBuilder = new StringBuilder(220000);

	templateBuilder.Append("<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\" />\r\n    <title>汇票线新手指引_票据常见问题_票面常见问题</title>\r\n    <meta name=\"viewport\" content=\"width=1200px, initial-scale=1.0, user-scalable=true\">\r\n    <meta name=\"keywords\" content=\"票据在线转让,票据贴现,汇票线会员平台交易帮助中心\" />\r\n    <meta name=\"description\" content=\"企业收票出票在汇票线平台,告别票据传统交易方式,获得票源信息和票据交易优势,机构报价信息全面到位,解决你对于票据常见的知识性问题,注册成为汇票线会员是值得信赖的一步。\" />\r\n  \r\n    <meta http-equiv=”X-UA-Compatible” content=”IE =Edge,chrome =1″>\r\n    <meta name=\"baidu-site-verification\" content=\"8wHB899l5W\" />\r\n    <meta name=\"sogou_site_verification\" content=\"QY1qSYeHpf\" />\r\n    <meta name=\"viewport\" content=\"width=1200px, user-scalable=true\" />\r\n    <meta name=\"keywords\" content=\"");
	templateBuilder.Append(Utils.ObjectToStr(site.seo_keyword));
	templateBuilder.Append("\" />\r\n    <meta name=\"description\" content=\"");
	templateBuilder.Append(Utils.ObjectToStr(site.seo_description));
	templateBuilder.Append("\" />\r\n    <script src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/js/jquery.min.js\" type=\"text/javascript\"></");
	templateBuilder.Append("script>\r\n    <script src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/js/jquery.cookie.js\" type=\"text/javascript\"></");
	templateBuilder.Append("script>\r\n    <script src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/js/sweetalert.min.js\" type=\"text/javascript\"></");
	templateBuilder.Append("script>\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/bootstrap.min.css\" rel=\"stylesheet\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/style.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/all.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/contenle.css\" rel=\"stylesheet\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/sweetalert.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n    <script type=\"text/javascript\">\r\n        $(function () {\r\n            $('.wenti2 li, .wenti3 li').click(function () {\r\n                $('.wenti2 li, .wenti3 li').not(this).find('div').hide(200);\r\n                $('.wenti2 li, .wenti3 li').css('color', '#3a3a3a').css('font-weight', 'normal')\r\n                    .css('background', 'url(pic/sanjiaoxing.png) no-repeat top 18px left');\r\n                if ($(this).find('div').css('display') == 'none') {\r\n                    $(this).css('color', '#11216a').css('font-weight', 'bold')\r\n                        .css('background', 'url(pic/sanjiaoxinglan.png) no-repeat top 18px left');\r\n                }\r\n                $(this).find('div').toggle(200);\r\n                  $(this).find('div').toggleClass(\"tgclass\");\r\n            });\r\n        });\r\n    </");
	templateBuilder.Append("script>\r\n</head>\r\n<body style=\"background:#f1f1f0\">\r\n    <!--Header-->\r\n    ");

	templateBuilder.Append("<script type=\"text/javascript\">\r\n    $(function () {\r\n        if ($.cookie('customer') && $.cookie('customer') != \"null\") {\r\n            var identity = JSON.parse($.cookie('customer'));\r\n            $(\"#userName\").html(identity.customer_name);\r\n            $(\"#divAnonymous\").hide();\r\n            $(\"#divLogin\").hide();\r\n            \r\n        }\r\n        else {\r\n            $(\"#divUser\").hide();\r\n            $('#link2').attr('href', 'javascript:window.location.href=\"/www/index.html#/app/loginInfo\"');\r\n            $('#link4').attr('href', 'javascript:window.location.href=\"/www/index.html#/app/loginInfo\"');\r\n            $(\"#divLogin\").show();\r\n        }\r\n    });\r\n\r\n    logout = function () {\r\n        if (confirm('确定要退出吗？')) {\r\n            $.cookie('customer', null);\r\n            window.location.href = window.location.href;\r\n        }\r\n    }\r\n    \r\n   \r\n</");
	templateBuilder.Append("script>\r\n\r\n<style>\r\n\r\n</style>\r\n<div class=\"container-fluid lkteheader\" >\r\n    <div class=\"container-fluid lktetop\">\r\n        <div class=\"row-fluid \">\r\n         <div class=\"htop\">\r\n          <div class=\"kf\"><div class=\"nmbph\"></div><span>客服热线：400-772-0575</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>客服时间：上午9：00---下午17：30 ( 工作日 ) </span></div>\r\n         <div class=\"kfs\">\r\n             <span id=\"divUser\" class=\"col-md-9 col-xs-9 contact text-right wez\">\r\n                 欢迎您！<span id=\"userName\" style=\"color:#fff;\"></span>\r\n                 <span style=\"color:#fff\">|</span>\r\n                 <a href=\"/www/index.html#/app/main/accountInfo\" style=\"color:#fff\">个人中心</a>\r\n                 <span style=\"color:#fff\">|</span>\r\n                 <a href=\"javascript:logout();\" style=\"color:#fff\">退出登录</a>\r\n             </span>\r\n             <span id=\"divAnonymous\" class=\"col-md-9 col-xs-8 contact text-right wez\">\r\n                 <a href=\"/aspx/main/insurance.aspx\" target=\"_blank\" style=\"color:#fff\">安全保障</a>\r\n                 &nbsp;&nbsp;&nbsp;\r\n                 <a href=\"/aspx/main/guide1.aspx\" target=\"_blank\" style=\"color:#fff\">新手引导</a>\r\n                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n                 <a href=\"/www/index.html#/app/loginInfo\"   style=\"color:#fff\">登录</a>\r\n                 <span>|</span>\r\n                 <a href=\"/www/index.html#/app/signup\" style=\"color:#fff\">注册</a>\r\n                 <!--&nbsp;&nbsp;\r\n        <a class=\"phone icontu\" href=\"javascript:;\"></a>\r\n        <a class=\"weixin icontu\" href=\"javascript:;\"></a>-->\r\n             </span>\r\n\r\n         </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"container-fluid lktebottom\">\r\n        <div class=\"bomp\">\r\n         <div class=\"bomp1\">\r\n             <img onclick=\"javascript: window.location.href = 'index.aspx'\"  src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/logo1.png\" />\r\n<img style=\"margin: 20px 0 0 20px;width: 199px\" src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/png.png\" />\r\n         </div>\r\n            <div class=\"bomp2\"> \r\n                <div class=\"nvmenu  eeee\">\r\n                    <ul>\r\n                        <li class=\"homeindex\"><a href=\"/index.aspx\" class=\"fav\">首页</a></li>\r\n                        <li><a id=\"link2\" href=\"/www/index.html#/app/main/publish\">我要出票</a></li>\r\n                        <li><a href=\"/www/index.html#/app/free/queryBill\">我要收票</a></li>\r\n                        <li><a id=\"link4\" href=\"/www/index.html#/app/main/editQuote\">机构报价</a></li>\r\n                        <li class=\"hpzs\"><a href=\"#\">汇票助手</a></li>\r\n                    </ul>\r\n                </div>\r\n\r\n            </div>\r\n           \r\n        </div>\r\n          \r\n\r\n </div>\r\n        <div class=\"container-fluid kbottom\">\r\n          \r\n               \r\n                    <ul>\r\n                        <li class=\"bv1\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/calculator'\">\r\n                            <div class=\"bv1s\"></div>\r\n\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                贴现计算器\r\n                            </label>\r\n\r\n                        </li>\r\n                        <li class=\"bv2\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/calendar'\">\r\n                            <div class=\"bv2s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                开票日历\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv3\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/querypublic'\">\r\n                            <div class=\"bv3s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                挂失查询\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv4\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/querybank'\">\r\n                            <div class=\"bv4s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                行号查询\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv5\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/queryenterprise'\">\r\n                            <div class=\"bv5s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                工商查询\r\n                            </label>\r\n                        </li>\r\n                    </ul>\r\n               \r\n            \r\n        </div>\r\n\r\n</div>\r\n</div>\r\n\r\n\r\n<script>\r\n           \r\n\r\n                $(\".hpzs\").hover(function () {\r\n                    $(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    //$(\".kbottom\").hide();\r\n\r\n                });\r\n                $(\".kbottom\").hover(function () {\r\n                    $(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    $(\".kbottom\").hide();\r\n\r\n                });\r\n                $(\".lkteheader\").hover(function () {\r\n                    //$(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    $(\".kbottom\").hide();\r\n\r\n                });\r\n\r\n                $(\".bv1\").hover(function () {\r\n                    $(\".bv1 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv1s\").css(\"background-position\",\"601px -131px\");\r\n                }, function () {\r\n                    $(\".bv1 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv1s\").css(\"background-position\", \"601px -70px\");\r\n\r\n                });\r\n                $(\".bv2\").hover(function () {\r\n                    $(\".bv2 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv2s\").css(\"background-position\", \"470px -131px\");\r\n                }, function () {\r\n                    $(\".bv2 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv2s\").css(\"background-position\", \"470px -70px\");\r\n\r\n                });\r\n                $(\".bv3\").hover(function () {\r\n                    $(\".bv3 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv3s\").css(\"background-position\", \"340px -131px\");\r\n                }, function () {\r\n                    $(\".bv3 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv3s\").css(\"background-position\", \"340px -70px\");\r\n\r\n                });\r\n                $(\".bv4\").hover(function () {\r\n                    $(\".bv4 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv4s\").css(\"background-position\", \"214px -131px\");\r\n                }, function () {\r\n                    $(\".bv4 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv4s\").css(\"background-position\", \"214px -70px\");\r\n\r\n                });\r\n                $(\".bv5\").hover(function () {\r\n                    $(\".bv5 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv5s\").css(\"background-position\", \"82px -131px\");\r\n                }, function () {\r\n                    $(\".bv5 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv5s\").css(\"background-position\", \"82px -70px\");\r\n\r\n                });\r\n                function showWeixin() {\r\n                    document.getElementById(\"weixin\").style.display = \"block\";\r\n                }\r\n                function hideWeixin() {\r\n                    document.getElementById(\"weixin\").style.display = \"none\";\r\n                }\r\n                $(\".nvmenu ul li\").hover(function () {\r\n                    $(\".homeindex\").removeClass(\"homeindex\");\r\n                    $(\".fav\").removeClass(\"fav\");\r\n\r\n                }, function () {\r\n                    //$(\".homeindex\").addClass(\"homeindex\");\r\n                    //$(\".fav\").addClass(\"fav\");\r\n                })\r\n     \r\n\r\n</");
	templateBuilder.Append("script>\r\n");


	templateBuilder.Append("\r\n    <!--/Header-->\r\n    <strong><em></em></strong>\r\n    <script>\r\n        window.onload = function () {\r\n            $(\".fter\").css('margin', '3% 0 0 0');\r\n            $(\".fter\").css('width', '100%')\r\n        }\r\n    </");
	templateBuilder.Append("script>\r\n    <div class=\"bg5\">\r\n        <div class=\"banner\"></div>\r\n        <div class=\"nr\">\r\n            <div class=\"pt5\" style=\"height:2129px\">\r\n                <div class=\"nav5\">\r\n                    <ul>\r\n                        <li><a href=\"/aspx/main/about.aspx\">关于我们</a></li>\r\n                        <li><a href=\"/list-54.html\">新闻公告</a></li>\r\n                        <li><a href=\"/aspx/main/announce.aspx\">网站声明</a></li>\r\n                        <li><a href=\"/aspx/main/platform.aspx\">平台优势</a></li>\r\n                        <li><a href=\"/aspx/main/business.aspx\">商务合作</a></li>\r\n                        <li><a href=\"/aspx/main/hr.aspx\">招纳贤士</a></li>\r\n                        <li><a href=\"/aspx/main/help.aspx\" style=\"background-color: #f55a14;color: #fff;padding: 10px 24px;\">帮助中心</a></li>\r\n                        <li><a href=\"/aspx/main/insurance.aspx\">安全保障</a></li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"zhiyin\">\r\n                    <div class=\"xinshou\">\r\n                        <div class=\"xsh\">新手指引 </div>\r\n                    </div>\r\n                    <div class=\"wenti\">\r\n                        <ul>\r\n                            <li><a href=\"guide1.aspx\">1、怎么样注册成为汇票线会员？</a></li>\r\n                            <li><a href=\"guide2.aspx\">2、使用汇票线平台，机构报价的具体流程是怎样？</a></li>\r\n                            <li><a href=\"guide3.aspx\">3、使用汇票线平台，用户进行电票交易的流程是怎样的？</a></li>\r\n                            <li><a href=\"guide4.aspx\">4、使用汇票线平台，用户进行纸票交易的流程是怎样的？</a></li>\r\n                            <li><a href=\"guide5.aspx\">5、用户在平台交易过程中，操作--执剑人系统的流程是怎样的？</a></li>\r\n                            <li><a href=\"guide6.aspx\">6、用户在平台交易过程中，操作--网银系统的流程是怎样的？</a></li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n\r\n\r\n                <div class=\"ptchj\">\r\n                    <div class=\"chjian\">\r\n                        <div class=\"wt\">平台常见问题 </div>\r\n                        <div class=\"wenti2\">\r\n                            <ul>\r\n                                <li>\r\n                                    汇票线是干什么的？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                               “汇票线”是上海票趣信息科技有限公司在“互联网+”的大背景下，打造的票据在线交易一站式服务平台。定位于企业之间票据的流转，企业与银行之间的贴现。全方位为有票据流转交易需求的中小企业、金融机构、票据中介，提供电票、纸票、银票、商票的出票、收票、报价、撮合、交易等的专业平台，让天下没有贴不了的票。安全、高效、低成本、专业地解决目前行业的痛点。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                    ---=是什么?如何保证监管资金的安全?\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                 ---=全称为----服务（上海）股份有限公司，是--银行集团旗下的--服务行业，于2015年年底正式成立，其特点在于结合传统金融行业与现代金融行业，更具开放性和包容性，并承接--银行“银银平台”的科技输出优势，为中小银行、非银行金融机构、中小企业提供金融信息云服务。汇票线平台与--银行集团子公司----服务（上海）股份有限公司（以下简称“---=”）达成战略合作伙伴关系，双方进行了深度合作。平台通过---=研发的--执剑人见证代管系统监管票款流转，采取“先打款、后背书”方式，--银行集团代管户保障资金安全，打造票据行业的“电票支付宝”模式，制度性地解决了电票交易对手的信用风险及票款流转不同步的安全问题。\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                    使用汇票线平台进行交易时，需要收取服务费吗？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                为了回馈广大注册会员，目前汇票线对于所有注册用户使用本平台进行交易时，都不收取交易服务费用。具体免费时限未定，如果后续调整收费政策（收取服务费用），将以通知形式告知用户。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                    企业创建--（执剑人）电子账户前，需要准备什么资料？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                           \r\n                                            <li style=\"background:none\">\r\n                                             \r\n                                                （1）营业执照正本彩色原件扫描件</br>\r\n                                                （2）法定代表人的身份证正、反面彩色原件扫描件</br>\r\n                                                （3）企业授权委托书扫描件，必须盖有公司公章及法人签章或法人签字</br>\r\n                                                （4）任一对公银行账户，可以是基本户或一般户（收票类型企业，须关联--银行对公账户）</br>\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                 注册成为汇票线会员后，忘记登录密码怎么办？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                               点击汇票线“用户登录”界面，右下方“忘记密码”，即可进入修改登录密码界面；按要求输入手机号，获取验证码，修改密码即可。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                    ---=执剑人虚拟账户的作用是什么？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                               \r\n                                                ---=与汇票线的关系，即类似于淘宝与支付宝的合作关系，为保证用户的票据交易的资金安全，汇票线仅提供给用户一个票据撮合交易的平台，做到“不碰钱、不管票”的原则；用户在平台生成--执剑人虚拟账户，通过---=研发的--执剑人系统对票据交易款进行安全代管，依托--银行电票系统完成电票流转的验证和判别，保障交易真实安全。\r\n                                            <li >\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                   注册过程中，为什么会出现获取验证码失败的情况？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                您的手机话费不足，或其他原因导致的停机；\r\n                                                被手机上安装的安全软件误判而拦截；\r\n                                                手机信号不佳导致的；\r\n                                                排除上述原因的，可直接咨询汇票线客服，热线：400-772-0575。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                   能否对注册的手机号码进行更换？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                               注册的手机号码可以变更，需要注意变更的手机号码需要注册为平台会员，但不能绑定过企业。\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                是否仅有汇票线账号注册人（联系人）才能进行平台操作？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                        并不是仅有汇票线账号注册人（联系人）才能进行平台操作，汇票线平台注册、联系人（管理员）可以授权多个操作员在本平台，操作员可被多家企业授权绑定。\r\n                                                </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                   是否需要在--银行开通公司账户？账户需要开通哪些功能？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                 卖方：持票企业选择，可以关联任一对公银行账户,用于提现使用。\r\n                                                买方：收票企业选择，须关联--银行对公账户才可以进行交易，用于付款账户和签收电票使用。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                   怎样在平台上查看票源信息？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                可在汇票线平台首页的票源信息栏快速浏览票源信息，可随意点击切换“电票、纸票”两个选项，查看不同类型票源信息；还可点击“更多”，查看更多票源信息及参与竞价。\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>怎样在平台上查看机构报价信息？\r\n                                \r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                可在汇票线平台首页的机构报价信息栏中快速浏览各机构报价信息，点击“更多”可查看更多机构报价信息及了解各报价信息详情。\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                 <li>\r\n                                  什么是汇票助手？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                汇票助手是汇票线平台特有的功能助手，其中包括贴现计算器、开票日历、挂失查询、行号查询、工商查询等一系列方便用户的功能性应用工具，满足用户的多样性工具需求。\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li><a href=\"../../aspx/main/platform.aspx\">汇票线平台有什么优势？</a>\r\n\r\n                                <li>\r\n                                    如何登陆汇票线平台？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                               点击进入登录页面，如未注册用户需要先注册会员；已注册用户在“登录”页面中输入账号和交易密码，点击“登录”即可。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n<li>交易完成后，出票方跨行提现时收取手续费吗？\r\n                                <div class=\"dt\">\r\n                                    <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                        <li style=\"background:none\">\r\n                                          \r\n                                            出票方在汇票线平台提现不收取手续费，此提现费由收票方支付，跨行提现由银行按规定收取手续费。\r\n                                            提现手续费扣费标准：\r\n                                            10W以下（包含10W）                 10元\r\n                                            10W-50W（包含50W）                 15元\r\n                                            50W-100W（包含100W）               20元\r\n                                            100W以上                           0.002% 200元封顶.\r\n                                        </li>\r\n                                    </ul>\r\n</div></li>\r\n                                <li>\r\n                                    登录汇票线平台，为什么会出现登录失败的情况？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                输入的账号或密码不正确；网络问题导致：如有“网页错误”的提示，可稍后尝试。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n\r\n\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"pj\">\r\n                    <div class=\"pjcj\">\r\n                        <div class=\"wt2\">票据常见问题 </div>\r\n                        <div class=\"wenti3\">\r\n                            <ul>\r\n                                <!--<li>\r\n                                    办理电子商业汇票业务具体需要哪些条件？\r\n    \r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                          \r\n                                            <li style=\"background:none\">\r\n                                                一般分为以下两种情况：</br>\r\n                                                (1)银行、财务公司提供电子商业汇票业务服务需具备的条件：a、申请加入经中国人民银行批准建立的电子商业汇票系统；b、具有中华人民共和国组织机构代码和支付系统行号。\r\n                                                <br>\r\n                                                (2)企事业单位客户办理电子商业汇票业务应具备的条件：a、在银行开立人民币结算账户或财务公司开立账户；b、具有中华人民共和国组织机构代码；c、具有数字证书，能够做出电子签名；d、与接入行、接入财务公司签订《电子商业汇票业务服务协议》。\r\n                                                需特别注意：企业在办理电票前，首先要开通企业网银，并且开通电子商业汇票功能。（银行客户经理会帮企业操作、开通。）</br>\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>-->\r\n                                <li>\r\n                                   “足月”和“不足月”分别指什么？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\" >\r\n                                                足月银行承兑汇票，具体是指贴现日距离出票日一般不超过七天的银行承兑汇票，根据贴现行要求，天数可以有变动。<br />半年期的不足月银行承兑汇票，一般是指剩余日期不足180天，一年期的一般是指剩余日期不足360天。\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                 什么叫贴现率？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                贴现率＝[贴现利息]/票据面额×100%\r\n                                                贴现利息=票据金额×贴现天数×贴现年利率/360\r\n                                                贴现利息=汇票金额×贴现天数×贴现月利率/30\r\n                                                贴现天数=贴现到期日-贴现日（注意节假日调整，异地票据加三天、电票不用加）\r\n                                                贴现所得金额=票据金额-贴现利息\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                  电子商业汇票系统支持的最大票据金额是多少？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                             目前而言，电子商业汇票系统支持的最大票据金额为10亿元，人民银行可根据需要进行调整。另外，商业银行、财务公司可在此额度内设定自身系统支持的最大票据金额。\r\n                                                </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                    怎么样才表示企业间转让背书成功了？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                 在企业间转让背书过程中，当电子商业汇票系统将票据状态从“背书待签收”修改为“背书已签收”。与此同时，修改票据所有人为被背书人，这样的状态就表示企业间转让背书已经成功。\r\n                                            </li>\r\n                                            </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                    大票和小票如何区别？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                本平台通常而言，票面金额大于等于300万元人民币的汇票称为“大票”；票面金额小于300万元人民币的汇票称为“小票”。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n                                电子商业汇票系统与哪几个系统相连？\r\n                                    <div class=\"dt\">\r\n                                        <ul style=\"width: 82%;background: #ebebeb;\">\r\n                                            <li style=\"background:none\">\r\n                                                 电子商业汇票系统与人民银行大额支付系统、征信系统、人民银行再贴现系统以及商业银行或者财务公司的内部系统相连。\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n<div style=\"margin: -15% 0 0 0;\">\r\n    <!--Footer-->\r\n    ");

	templateBuilder.Append("\r\n<div class=\"container-fluid tlan\">\r\n    <div class=\"row-fluid\">\r\n        <div class=\"container-fluid fop\">\r\n            <div class=\"row-fluid\">\r\n                <div class=\"span12\">\r\n                    <div class=\"container-fluid\">\r\n                        <div class=\"fot\">\r\n                            <ul>\r\n                                <li><a href=\"/aspx/main/about.aspx\" target=\"_blank\">关于我们</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/list-54.html\">新闻公告</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/announce.aspx\" target=\"_blank\">网站声明</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/platform.aspx\" target=\"_blank\">平台优势</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/business.aspx\" target=\"_blank\">商务合作</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/hr.aspx\" target=\"_blank\">招贤纳士</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/help.aspx\" target=\"_blank\">帮助中心</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/insurance.aspx\" target=\"_blank\">安全保障</a></li>\r\n\r\n                            </ul>\r\n                        </div>\r\n                        <div class=\"ftjs\">\r\n                            <ul>\r\n                                <li style=\"width:41%\">\r\n                                    <div>\r\n                                        <div class=\"h_kefu\">\r\n                                            <!--<div class=\"customer-service\"><a href=\"../../aspx/main/Rease.aspx\">客服热线</a>：</div>-->\r\n                                            <div class=\"customer-service\"><a>客服热线</a>：</div>\r\n                                            <div class=\"customer-service-phone\">400-772-0575</div>\r\n                                            <div class=\"customer-service-time\">客服时间：上午9:00 - 下午17:30（工作日）</div>\r\n                                        </div>\r\n\r\n\r\n\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n\r\n                                    <p class=\"h_email\" style=\"margin-top:68px\"><div class=\"yximg\"></div>邮箱：service@huipiaoxian.com</p>\r\n                                    <p class=\"h_address\" style=\"margin-top:10px\">\r\n                                        <div class=\"dizimg\"></div>地址：上海市浦东新区浦三路21弄55号604室\r\n                                        <span style=\"margin: 0 0 0 12%;\">（银亿滨江中心壹号）</span>\r\n                                    </p>\r\n                                </li>\r\n                                <li style=\"margin-left: 7%;margin-top: -1%;\">\r\n                                    <div class=\"bdes\">\r\n                                        <div class=\"xgo1\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/qr-codes-1.png\" /><div class=\"dyh\">订阅号</div></div>\r\n                                        <div class=\"xgo2\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/qr-codes-2.png\" /><div class=\"dyh\">App</div></div>\r\n                                    </div>\r\n                                    <div class=\"bcde\">\r\n                                        <ul>\r\n                                            <li>\r\n                                                <div class=\"kmk1\"><img class=\"wx3\" src=\"../../templates/main/images/wx3.png\" /></div>\r\n                                                <label>微信公众号</label>\r\n                                            </li>\r\n                                            <li>\r\n                                                <div class=\"kmk2\"><img class=\"wx2\" src=\"../../templates/main/images/wx2.png\" /></div>\r\n                                                <label>汇票线APP</label>\r\n                                            </li>\r\n                                            <li onclick=\"javascript: window.open('http://weibo.com/huipiaoxian')\">\r\n                                                <div class=\"kmk3\"><img class=\"wx1\" src=\"../../templates/main/images/wx1.png\" /></div>\r\n                                                <label>官方微博</label>\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                        <div style=\"text-align:center\">\r\n                            <p>\r\n                                <img onclick=\"javascript: window.location.href = 'http://www.gsxt.gov.cn/corp-query-homepage.html'\" src=\"../../templates/main/images/renmin.png\" /> Copyright 2016  汇票线-上海票趣信息科技有限公司&nbsp; &nbsp; &nbsp; &nbsp;\r\n                                <img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/icp.jpg\">\r\n                                沪ICP备16031524号-1\r\n                            </p>\r\n                        </div>\r\n                    </div>\r\n\r\n\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n\r\n<script>\r\n    $(\".kmk1\").hover(function () {\r\n     $(\".xgo1\").show();\r\n }, function () {\r\n     $(\".xgo1\").hide();\r\n });\r\n\r\n    $(\".kmk2\").hover(function () {\r\n        $(\".xgo2\").show();\r\n    }, function () {\r\n        $(\".xgo2\").hide();\r\n    });\r\n</");
	templateBuilder.Append("script>");


	templateBuilder.Append("\r\n    <!--/Footer-->\r\n</div>\r\n\r\n\r\n\r\n\r\n</body>\r\n</html>");
	Response.Write(templateBuilder.ToString());
}
</script>
