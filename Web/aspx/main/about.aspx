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

	templateBuilder.Append("<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\" />\r\n    <title>电票在线交易平台_票据支付宝_互联网票据交易平台_汇票线</title>\r\n    <meta name=\"viewport\" content=\"width=1200px, initial-scale=1.0, user-scalable=true\">\r\n    <meta name=\"keywords\" content=\"票据贴现,网络票据在线交易,汇票线票据交易平台\" />\r\n    <meta name=\"description\" content=\"关于我们汇票线平台,承载着改善传统票据交易模式的梦想,降低票据交易贴现成本,在票据行业转型期强调立身之本、发展基石、价值取向,汇票线平台终会成为网络票据交易平台的标杆。\" />\r\n   \r\n    <meta http-equiv=”X-UA-Compatible” content=”IE =Edge,chrome =1″>\r\n    <meta name=\"baidu-site-verification\" content=\"8wHB899l5W\" />\r\n    <meta name=\"sogou_site_verification\" content=\"QY1qSYeHpf\" />\r\n    <meta name=\"viewport\" content=\"width=1200px, user-scalable=true\" />\r\n    <meta name=\"keywords\" content=\"");
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
	templateBuilder.Append("/css/sweetalert.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/style.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/all.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/contenle.css\" rel=\"stylesheet\" />\r\n\r\n    <script type=\"text/javascript\">\r\n    logout = function () {\r\n        swal({\r\n            title: \"确认要退出登录吗?\",\r\n            type: \"warning\",\r\n            showCancelButton: true,\r\n            confirmButtonText: \"是\",\r\n            cancelButtonText: \"否\",\r\n            closeOnConfirm: true\r\n        }, function () {\r\n\r\n            $.cookie('customer', null);\r\n            window.location.href = window.location.href;;\r\n\r\n        })\r\n\r\n\r\n    }\r\n   \r\n\r\n    </");
	templateBuilder.Append("script>\r\n</head>\r\n<body>\r\n    <!--Header-->\r\n    ");

	templateBuilder.Append("<script type=\"text/javascript\">\r\n    $(function () {\r\n        if ($.cookie('customer') && $.cookie('customer') != \"null\") {\r\n            var identity = JSON.parse($.cookie('customer'));\r\n            $(\"#userName\").html(identity.customer_name);\r\n            $(\"#divAnonymous\").hide();\r\n            $(\"#divLogin\").hide();\r\n            \r\n        }\r\n        else {\r\n            $(\"#divUser\").hide();\r\n            $('#link2').attr('href', 'javascript:window.location.href=\"/www/index.html#/app/loginInfo\"');\r\n            $('#link4').attr('href', 'javascript:window.location.href=\"/www/index.html#/app/loginInfo\"');\r\n            $(\"#divLogin\").show();\r\n        }\r\n    });\r\n\r\n    logout = function () {\r\n        if (confirm('确定要退出吗？')) {\r\n            $.cookie('customer', null);\r\n            window.location.href = window.location.href;\r\n        }\r\n    }\r\n    \r\n   \r\n</");
	templateBuilder.Append("script>\r\n\r\n<style>\r\n\r\n</style>\r\n<div class=\"container-fluid lkteheader\" >\r\n    <div class=\"container-fluid lktetop\">\r\n        <div class=\"row-fluid \">\r\n         <div class=\"htop\">\r\n          <div class=\"kf\"><div class=\"nmbph\"></div><span>客服热线：400-772-0575</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>客服时间：上午9：00---下午17：30 ( 工作日 ) </span></div>\r\n         <div class=\"kfs\">\r\n             <span id=\"divUser\" class=\"col-md-9 col-xs-9 contact text-right wez\">\r\n                 欢迎您！<span id=\"userName\" style=\"color:#fff;\"></span>\r\n                 <span style=\"color:#fff\">|</span>\r\n                 <a href=\"/www/index.html#/app/main/accountInfo\" style=\"color:#fff\">个人中心</a>\r\n                 <span style=\"color:#fff\">|</span>\r\n                 <a href=\"javascript:logout();\" style=\"color:#fff\">退出登录</a>\r\n             </span>\r\n             <span id=\"divAnonymous\" class=\"col-md-9 col-xs-8 contact text-right wez\">\r\n                 <a href=\"/aspx/main/insurance.aspx\" target=\"_blank\" style=\"color:#fff\">安全保障</a>\r\n                 &nbsp;&nbsp;&nbsp;\r\n                 <a href=\"/aspx/main/guide1.aspx\" target=\"_blank\" style=\"color:#fff\">新手引导</a>\r\n                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n                 <a href=\"/www/index.html#/app/loginInfo\"   style=\"color:#fff\">登录</a>\r\n                 <span>|</span>\r\n                 <a href=\"/www/index.html#/app/signup\" style=\"color:#fff\">注册</a>\r\n                 <!--&nbsp;&nbsp;\r\n        <a class=\"phone icontu\" href=\"javascript:;\"></a>\r\n        <a class=\"weixin icontu\" href=\"javascript:;\"></a>-->\r\n             </span>\r\n\r\n         </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"container-fluid lktebottom\">\r\n        <div class=\"bomp\">\r\n         <div class=\"bomp1\">\r\n             <img onclick=\"javascript: window.location.href = 'index.aspx'\"  src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/logo1.png\" />\r\n<img style=\"margin: 20px 0 0 20px;width: 199px\" src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/png.png\" />\r\n         </div>\r\n            <div class=\"bomp2\"> \r\n                <div class=\"nvmenu  eeee\">\r\n                    <ul>\r\n                        <li class=\"homeindex\"><a href=\"/index.aspx\" class=\"fav\">首页</a></li>\r\n                        <li><a id=\"link2\" href=\"/www/index.html#/app/main/publish\">我要出票</a></li>\r\n                        <li><a href=\"/www/index.html#/app/free/queryBill\">我要收票</a></li>\r\n                        <li><a id=\"link4\" href=\"/www/index.html#/app/main/editQuote\">机构报价</a></li>\r\n                        <li class=\"hpzs\"><a href=\"#\">汇票助手</a></li>\r\n                    </ul>\r\n                </div>\r\n\r\n            </div>\r\n           \r\n        </div>\r\n          \r\n\r\n </div>\r\n        <div class=\"container-fluid kbottom\">\r\n          \r\n               \r\n                    <ul>\r\n                        <li class=\"bv1\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/calculator'\">\r\n                            <div class=\"bv1s\"></div>\r\n\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                贴现计算器\r\n                            </label>\r\n\r\n                        </li>\r\n                        <li class=\"bv2\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/calendar'\">\r\n                            <div class=\"bv2s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                开票日历\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv3\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/querypublic'\">\r\n                            <div class=\"bv3s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                挂失查询\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv4\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/querybank'\">\r\n                            <div class=\"bv4s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                行号查询\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv5\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/queryenterprise'\">\r\n                            <div class=\"bv5s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                工商查询\r\n                            </label>\r\n                        </li>\r\n                    </ul>\r\n               \r\n            \r\n        </div>\r\n\r\n</div>\r\n</div>\r\n\r\n\r\n<script>\r\n           \r\n\r\n                $(\".hpzs\").hover(function () {\r\n                    $(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    //$(\".kbottom\").hide();\r\n\r\n                });\r\n                $(\".kbottom\").hover(function () {\r\n                    $(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    $(\".kbottom\").hide();\r\n\r\n                });\r\n                $(\".lkteheader\").hover(function () {\r\n                    //$(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    $(\".kbottom\").hide();\r\n\r\n                });\r\n\r\n                $(\".bv1\").hover(function () {\r\n                    $(\".bv1 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv1s\").css(\"background-position\",\"601px -131px\");\r\n                }, function () {\r\n                    $(\".bv1 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv1s\").css(\"background-position\", \"601px -70px\");\r\n\r\n                });\r\n                $(\".bv2\").hover(function () {\r\n                    $(\".bv2 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv2s\").css(\"background-position\", \"470px -131px\");\r\n                }, function () {\r\n                    $(\".bv2 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv2s\").css(\"background-position\", \"470px -70px\");\r\n\r\n                });\r\n                $(\".bv3\").hover(function () {\r\n                    $(\".bv3 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv3s\").css(\"background-position\", \"340px -131px\");\r\n                }, function () {\r\n                    $(\".bv3 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv3s\").css(\"background-position\", \"340px -70px\");\r\n\r\n                });\r\n                $(\".bv4\").hover(function () {\r\n                    $(\".bv4 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv4s\").css(\"background-position\", \"214px -131px\");\r\n                }, function () {\r\n                    $(\".bv4 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv4s\").css(\"background-position\", \"214px -70px\");\r\n\r\n                });\r\n                $(\".bv5\").hover(function () {\r\n                    $(\".bv5 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv5s\").css(\"background-position\", \"82px -131px\");\r\n                }, function () {\r\n                    $(\".bv5 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv5s\").css(\"background-position\", \"82px -70px\");\r\n\r\n                });\r\n                function showWeixin() {\r\n                    document.getElementById(\"weixin\").style.display = \"block\";\r\n                }\r\n                function hideWeixin() {\r\n                    document.getElementById(\"weixin\").style.display = \"none\";\r\n                }\r\n                $(\".nvmenu ul li\").hover(function () {\r\n                    $(\".homeindex\").removeClass(\"homeindex\");\r\n                    $(\".fav\").removeClass(\"fav\");\r\n\r\n                }, function () {\r\n                    //$(\".homeindex\").addClass(\"homeindex\");\r\n                    //$(\".fav\").addClass(\"fav\");\r\n                })\r\n     \r\n\r\n</");
	templateBuilder.Append("script>\r\n");


	templateBuilder.Append("\r\n    <!--/Header-->\r\n    <strong><em></em></strong>\r\n\r\n    <div class=\"bg\">\r\n        <div class=\"banner\"></div>\r\n        <div class=\"pt\" style=\"height:1750px;\">\r\n            <div class=\"nav2\">\r\n                <ul>\r\n                    <li>\r\n                        <a href=\"/aspx/main/about.aspx\" style=\"background-color: #f55a14; color: #fff;	padding: 10px 24px;\">关于我们</a>\r\n                    </li>\r\n                    <li><a href=\"/list-54.html\">新闻公告</a></li>\r\n                    <li><a href=\"/aspx/main/announce.aspx\">网站声明</a></li>\r\n                    <li><a href=\"/aspx/main/platform.aspx\">平台优势</a></li>\r\n                    <li><a href=\"/aspx/main/business.aspx\">商务合作</a></li>\r\n                    <li><a href=\"/aspx/main/hr.aspx\">招纳贤士</a></li>\r\n                    <li><a href=\"/aspx/main/help.aspx\">帮助中心</a></li>\r\n                    <li><a href=\"/aspx/main/insurance.aspx\">安全保障</a></li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"pt-rigth\" style=\"height:887px\">\r\n                <div class=\"jian\">\r\n                    <div>\r\n                        <span>平台简介</span>\r\n                    </div>\r\n                </div>\r\n                <div class=\"nr\">\r\n                    “汇票线”是上海票趣信息科技有限公司在“互联网+”的大背景下，打造的票据在线交易一站式服务平台。汇票线依托行业多年的深耕与扎实的互联网信息技术，通过改造升级“传统票据”交易方式，创新发展为互联网+票据交易模式(B2B)。通过一站式服务，全方位为广大有票据流转交易需求的中小企业、金融机构、票据中介，提供电票、纸票、银票、商票的出票、收票、报价、撮合、交易等的专业平台，让天下没有贴不了的票。安全、高效、低成本、专业地解决了目前行业的痛点。 <br />\r\n                    <br />\r\n                    平台与--银行集团子公司--数字金融服务（上海）股份有限公司（以下简称“--数金”）达成战略合作伙伴关系，双方进行了深度合作。平台通过--数金研发的--执剑人见证代管系统监管票款流转，采取“先打款、后背书”方式，--银行集团代管户保障资金安全，打造票据行业的“电票支付宝”模式，制度性地解决了电票交易对手的信用风险及票款流转不同步的安全问题。<br />\r\n                    <br />\r\n                    <div class=\"ntr\">\r\n                        平台以打造中国互联网票据交易平台的标杆为己任，通过技术领先努力让票据交易触手可及，计划在3-5年完成从银票流转拓展到更加蓝海的商票一二级市场及提供融资、理财等票据衍生的B端布局，成为综合的一流持牌互联网票据公司，最终低成本解决企业票据融资难题，为推动实体经济的发展做出不懈地努力。\r\n\r\n                        平台将充分利用“互联网+票据”的优势，紧抓行业痛点与央行力推电票的市场机会，作为与上海票交所定位的差异化角色，秉承稳健、规范的发展理念，努力构筑国内票据交易的良性生态系统。\r\n\r\n\r\n\r\n                    </div>\r\n\r\n                    <div class=\"\"></div>\r\n                </div>\r\n                <div class=\"hpx\"><img src=\"pic/hpx.png\" width=\"288\" height=\"401\" style=\"margin-top:30px\" /></div>\r\n                <div class=\"clear\"></div>\r\n                <div class=\"yuan\">\r\n                    <div style=\"width: 101%; height: 22px;background: #f2f2f2;\"></div>\r\n                    <div class=\"jing\" style=\"width: 100%; \"><span>愿景使命</span></div>\r\n                    <div class=\"box\" style=\"width: 100%; \">\r\n                        <div class=\"nr2\"> <span><b>愿景：</b>互联网票据交易平台的标杆 </span> </div>\r\n                        <div class=\"nr3\"> <span> <b>使命：</b>让票据交易触手可及，低成本解决企业票据融资难题</span></div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n\r\n\r\n            <div class=\"CEO\">\r\n                <div class=\"ceo\">\r\n                    <div class=\"jiyu\"><span>CEO寄语</span> </div>\r\n                    <div class=\"nr4\">\r\n                    伴随着互联网思维与大数据时代的到来，作为2004年入行的票据“老兵”，一路走来，我见证着票据的风风雨雨，经历着时代因素给票据行业带来的巨变。也深刻认识到，我们唯有付出更多的汗水，承载更多的嬗变之因，才能收获更多的惊喜与快乐。\r\n\r\n                    <br /><br />紧跟票据行业转型发展，票据在线交易一站式服务平台“汇票线”应运而生！\r\n\r\n                    <br /><br />自成立以来，汇票线始终以“票据在线交易一站式服务平台”为目标，围绕一站式理念让票据在线交易变得安全、高效、简捷、专业，通过互联网改造提升传统票据行业的效率，解决客户痛点。这是汇票线的立身之本，也是汇票线平台的发展基石，更是汇票线人的价值取向。\r\n\r\n                    <br /><br />在甚嚣尘上的浮躁环境中，面对票据行业转型发展所带来的机遇与挑战，汇票线仍将一如既往地以这种专业专注的“深耕”精神，不断完善平台的成熟度，提升客户服务质量，紧抓市场动向与时机，在战略上乐观应对，在战术上积极调整。\r\n\r\n                    <br /><br />千里之行，始于足下。且让我们静下心来，踏踏实实走好每一步！\r\n                </div>\r\n                    <div class=\"qian\">\r\n                        <span>汇票线创始人兼CEO ：</span><img src=\"pic/qianming.png\" width=\"105px;\" height=\"52px;\"\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!--Footer-->\r\n    ");

	templateBuilder.Append("\r\n<div class=\"container-fluid tlan\">\r\n    <div class=\"row-fluid\">\r\n        <div class=\"container-fluid fop\">\r\n            <div class=\"row-fluid\">\r\n                <div class=\"span12\">\r\n                    <div class=\"container-fluid\">\r\n                        <div class=\"fot\">\r\n                            <ul>\r\n                                <li><a href=\"/aspx/main/about.aspx\" target=\"_blank\">关于我们</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/list-54.html\">新闻公告</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/announce.aspx\" target=\"_blank\">网站声明</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/platform.aspx\" target=\"_blank\">平台优势</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/business.aspx\" target=\"_blank\">商务合作</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/hr.aspx\" target=\"_blank\">招贤纳士</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/help.aspx\" target=\"_blank\">帮助中心</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/insurance.aspx\" target=\"_blank\">安全保障</a></li>\r\n\r\n                            </ul>\r\n                        </div>\r\n                        <div class=\"ftjs\">\r\n                            <ul>\r\n                                <li style=\"width:41%\">\r\n                                    <div>\r\n                                        <div class=\"h_kefu\">\r\n                                            <!--<div class=\"customer-service\"><a href=\"../../aspx/main/Rease.aspx\">客服热线</a>：</div>-->\r\n                                            <div class=\"customer-service\"><a>客服热线</a>：</div>\r\n                                            <div class=\"customer-service-phone\">400-772-0575</div>\r\n                                            <div class=\"customer-service-time\">客服时间：上午9:00 - 下午17:30（工作日）</div>\r\n                                        </div>\r\n\r\n\r\n\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n\r\n                                    <p class=\"h_email\" style=\"margin-top:68px\"><div class=\"yximg\"></div>邮箱：service@huipiaoxian.com</p>\r\n                                    <p class=\"h_address\" style=\"margin-top:10px\">\r\n                                        <div class=\"dizimg\"></div>地址：上海市浦东新区浦三路21弄55号604室\r\n                                        <span style=\"margin: 0 0 0 12%;\">（银亿滨江中心壹号）</span>\r\n                                    </p>\r\n                                </li>\r\n                                <li style=\"margin-left: 7%;margin-top: -1%;\">\r\n                                    <div class=\"bdes\">\r\n                                        <div class=\"xgo1\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/qr-codes-1.png\" /><div class=\"dyh\">订阅号</div></div>\r\n                                        <div class=\"xgo2\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/qr-codes-2.png\" /><div class=\"dyh\">App</div></div>\r\n                                    </div>\r\n                                    <div class=\"bcde\">\r\n                                        <ul>\r\n                                            <li>\r\n                                                <div class=\"kmk1\"><img class=\"wx3\" src=\"../../templates/main/images/wx3.png\" /></div>\r\n                                                <label>微信公众号</label>\r\n                                            </li>\r\n                                            <li>\r\n                                                <div class=\"kmk2\"><img class=\"wx2\" src=\"../../templates/main/images/wx2.png\" /></div>\r\n                                                <label>汇票线APP</label>\r\n                                            </li>\r\n                                            <li onclick=\"javascript: window.open('http://weibo.com/huipiaoxian')\">\r\n                                                <div class=\"kmk3\"><img class=\"wx1\" src=\"../../templates/main/images/wx1.png\" /></div>\r\n                                                <label>官方微博</label>\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                        <div style=\"text-align:center\">\r\n                            <p>\r\n                                <img onclick=\"javascript: window.location.href = 'http://www.gsxt.gov.cn/corp-query-homepage.html'\" src=\"../../templates/main/images/renmin.png\" /> Copyright 2016  汇票线-上海票趣信息科技有限公司&nbsp; &nbsp; &nbsp; &nbsp;\r\n                                <img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/icp.jpg\">\r\n                                沪ICP备16031524号-1\r\n                            </p>\r\n                        </div>\r\n                    </div>\r\n\r\n\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n\r\n<script>\r\n    $(\".kmk1\").hover(function () {\r\n     $(\".xgo1\").show();\r\n }, function () {\r\n     $(\".xgo1\").hide();\r\n });\r\n\r\n    $(\".kmk2\").hover(function () {\r\n        $(\".xgo2\").show();\r\n    }, function () {\r\n        $(\".xgo2\").hide();\r\n    });\r\n</");
	templateBuilder.Append("script>");


	templateBuilder.Append("\r\n    <!--/Footer-->\r\n\r\n</body>\r\n</html>");
	Response.Write(templateBuilder.ToString());
}
</script>
