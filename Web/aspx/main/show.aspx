<%@ Page Language="C#" AutoEventWireup="true" Inherits="DTcms.Web.UI.Page.article_show" ValidateRequest="false" %>
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

	templateBuilder.Append("<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    ");
	string category_title = get_category_title(model.category_id,"");

	templateBuilder.Append("\r\n    <meta charset=\"utf-8\" />\r\n    <title>");
	templateBuilder.Append(Utils.ObjectToStr(model.seo_title));
	templateBuilder.Append("</title>\r\n    <meta http-equiv=”X-UA-Compatible” content=”IE =Edge,chrome =1″>\r\n    <meta name=\"baidu-site-verification\" content=\"8wHB899l5W\" />\r\n    <meta name=\"sogou_site_verification\" content=\"QY1qSYeHpf\" />\r\n    <meta name=\"viewport\" content=\"width=1200px, user-scalable=true\" />\r\n    <meta name=\"keywords\" content=\"");
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
	templateBuilder.Append("/css/sweetalert.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n\r\n</head>\r\n\r\n<body style=\"background:#f1f1f0\">\r\n    <!--Header-->\r\n    ");

	templateBuilder.Append("<script type=\"text/javascript\">\r\n    $(function () {\r\n        if ($.cookie('customer') && $.cookie('customer') != \"null\") {\r\n            var identity = JSON.parse($.cookie('customer'));\r\n            $(\"#userName\").html(identity.customer_name);\r\n            $(\"#divAnonymous\").hide();\r\n            $(\"#divLogin\").hide();\r\n            \r\n        }\r\n        else {\r\n            $(\"#divUser\").hide();\r\n            $('#link2').attr('href', 'javascript:window.location.href=\"/www/index.html#/app/loginInfo\"');\r\n            $('#link4').attr('href', 'javascript:window.location.href=\"/www/index.html#/app/loginInfo\"');\r\n            $(\"#divLogin\").show();\r\n        }\r\n    });\r\n\r\n    logout = function () {\r\n        if (confirm('确定要退出吗？')) {\r\n            $.cookie('customer', null);\r\n            window.location.href = window.location.href;\r\n        }\r\n    }\r\n    \r\n   \r\n</");
	templateBuilder.Append("script>\r\n\r\n<style>\r\n\r\n</style>\r\n<div class=\"container-fluid lkteheader\" >\r\n    <div class=\"container-fluid lktetop\">\r\n        <div class=\"row-fluid \">\r\n         <div class=\"htop\">\r\n          <div class=\"kf\"><div class=\"nmbph\"></div><span>客服热线：400-772-0575</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>客服时间：上午9：00---下午17：30 ( 工作日 ) </span></div>\r\n         <div class=\"kfs\">\r\n             <span id=\"divUser\" class=\"col-md-9 col-xs-9 contact text-right wez\">\r\n                 欢迎您！<span id=\"userName\" style=\"color:#fff;\"></span>\r\n                 <span style=\"color:#fff\">|</span>\r\n                 <a href=\"/www/index.html#/app/main/accountInfo\" style=\"color:#fff\">个人中心</a>\r\n                 <span style=\"color:#fff\">|</span>\r\n                 <a href=\"javascript:logout();\" style=\"color:#fff\">退出登录</a>\r\n             </span>\r\n             <span id=\"divAnonymous\" class=\"col-md-9 col-xs-8 contact text-right wez\">\r\n                 <a href=\"/aspx/main/insurance.aspx\" target=\"_blank\" style=\"color:#fff\">安全保障</a>\r\n                 &nbsp;&nbsp;&nbsp;\r\n                 <a href=\"/aspx/main/guide1.aspx\" target=\"_blank\" style=\"color:#fff\">新手引导</a>\r\n                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n                 <a href=\"/www/index.html#/app/loginInfo\"   style=\"color:#fff\">登录</a>\r\n                 <span>|</span>\r\n                 <a href=\"/www/index.html#/app/signup\" style=\"color:#fff\">注册</a>\r\n                 <!--&nbsp;&nbsp;\r\n        <a class=\"phone icontu\" href=\"javascript:;\"></a>\r\n        <a class=\"weixin icontu\" href=\"javascript:;\"></a>-->\r\n             </span>\r\n\r\n         </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"container-fluid lktebottom\">\r\n        <div class=\"bomp\">\r\n         <div class=\"bomp1\">\r\n             <img onclick=\"javascript: window.location.href = 'index.aspx'\"  src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/logo1.png\" />\r\n<img style=\"margin: 20px 0 0 20px;width: 199px\" src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/png.png\" />\r\n         </div>\r\n            <div class=\"bomp2\"> \r\n                <div class=\"nvmenu  eeee\">\r\n                    <ul>\r\n                        <li class=\"homeindex\"><a href=\"/index.aspx\" class=\"fav\">首页</a></li>\r\n                        <li><a id=\"link2\" href=\"/www/index.html#/app/main/publish\">我要出票</a></li>\r\n                        <li><a href=\"/www/index.html#/app/free/queryBill\">我要收票</a></li>\r\n                        <li><a id=\"link4\" href=\"/www/index.html#/app/main/editQuote\">机构报价</a></li>\r\n                        <li class=\"hpzs\"><a href=\"#\">汇票助手</a></li>\r\n                    </ul>\r\n                </div>\r\n\r\n            </div>\r\n           \r\n        </div>\r\n          \r\n\r\n </div>\r\n        <div class=\"container-fluid kbottom\">\r\n          \r\n               \r\n                    <ul>\r\n                        <li class=\"bv1\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/calculator'\">\r\n                            <div class=\"bv1s\"></div>\r\n\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                贴现计算器\r\n                            </label>\r\n\r\n                        </li>\r\n                        <li class=\"bv2\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/calendar'\">\r\n                            <div class=\"bv2s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                开票日历\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv3\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/querypublic'\">\r\n                            <div class=\"bv3s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                挂失查询\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv4\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/querybank'\">\r\n                            <div class=\"bv4s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                行号查询\r\n                            </label>\r\n                        </li>\r\n                        <li class=\"bv5\" onclick=\"javascript: window.location.href = '/www/index.html#/app/free/queryenterprise'\">\r\n                            <div class=\"bv5s\"></div>\r\n                            <label class=\"lbtext\" style=\"color:#fff\">\r\n                                工商查询\r\n                            </label>\r\n                        </li>\r\n                    </ul>\r\n               \r\n            \r\n        </div>\r\n\r\n</div>\r\n</div>\r\n\r\n\r\n<script>\r\n           \r\n\r\n                $(\".hpzs\").hover(function () {\r\n                    $(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    //$(\".kbottom\").hide();\r\n\r\n                });\r\n                $(\".kbottom\").hover(function () {\r\n                    $(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    $(\".kbottom\").hide();\r\n\r\n                });\r\n                $(\".lkteheader\").hover(function () {\r\n                    //$(\".kbottom\").show();\r\n                }, function () {\r\n\r\n                    $(\".kbottom\").hide();\r\n\r\n                });\r\n\r\n                $(\".bv1\").hover(function () {\r\n                    $(\".bv1 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv1s\").css(\"background-position\",\"601px -131px\");\r\n                }, function () {\r\n                    $(\".bv1 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv1s\").css(\"background-position\", \"601px -70px\");\r\n\r\n                });\r\n                $(\".bv2\").hover(function () {\r\n                    $(\".bv2 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv2s\").css(\"background-position\", \"470px -131px\");\r\n                }, function () {\r\n                    $(\".bv2 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv2s\").css(\"background-position\", \"470px -70px\");\r\n\r\n                });\r\n                $(\".bv3\").hover(function () {\r\n                    $(\".bv3 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv3s\").css(\"background-position\", \"340px -131px\");\r\n                }, function () {\r\n                    $(\".bv3 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv3s\").css(\"background-position\", \"340px -70px\");\r\n\r\n                });\r\n                $(\".bv4\").hover(function () {\r\n                    $(\".bv4 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv4s\").css(\"background-position\", \"214px -131px\");\r\n                }, function () {\r\n                    $(\".bv4 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv4s\").css(\"background-position\", \"214px -70px\");\r\n\r\n                });\r\n                $(\".bv5\").hover(function () {\r\n                    $(\".bv5 label\").css(\"color\", \"#ff5a14\");\r\n                    $(\".bv5s\").css(\"background-position\", \"82px -131px\");\r\n                }, function () {\r\n                    $(\".bv5 label\").css(\"color\", \"#fff\");\r\n                    $(\".bv5s\").css(\"background-position\", \"82px -70px\");\r\n\r\n                });\r\n                function showWeixin() {\r\n                    document.getElementById(\"weixin\").style.display = \"block\";\r\n                }\r\n                function hideWeixin() {\r\n                    document.getElementById(\"weixin\").style.display = \"none\";\r\n                }\r\n                $(\".nvmenu ul li\").hover(function () {\r\n                    $(\".homeindex\").removeClass(\"homeindex\");\r\n                    $(\".fav\").removeClass(\"fav\");\r\n\r\n                }, function () {\r\n                    //$(\".homeindex\").addClass(\"homeindex\");\r\n                    //$(\".fav\").addClass(\"fav\");\r\n                })\r\n     \r\n\r\n</");
	templateBuilder.Append("script>\r\n");


	templateBuilder.Append("\r\n    <!--/Header-->\r\n\r\n    <container>\r\n        <div class=\"kind-money-all-bg hpx-padding\">\r\n            <div class=\"container\">\r\n                <div class=\"list-cont row\">\r\n                    <div class=\"panel-heading text-center\">");
	templateBuilder.Append(Utils.ObjectToStr(model.title));
	templateBuilder.Append("</div>\r\n                    <div class=\"time text-center\">\r\n                        <span>来源：汇票线</span>\r\n                        <span>发布日期：");	templateBuilder.Append(Utils.ObjectToDateTime(model.add_time).ToString(" yyyy-MM-dd"));

	templateBuilder.Append("</span>\r\n                    </div>\r\n                    <div class=\"article-cont\">\r\n                        ");
	templateBuilder.Append(Utils.ObjectToStr(model.content));
	templateBuilder.Append("\r\n                    </div>\r\n                </div>\r\n                <!--附件列表-->\r\n                <div class=\"conttit\"></div>\r\n                <ul class=\"attach-list\">\r\n                    ");
	if (model.attach!=null)
	{

	foreach(DTcms.Model.article_attach modelt in model.attach)
	{

	templateBuilder.Append("\r\n                    <li>\r\n                        <a href=\"javascript:;\" onclick=\"downLink(");
	templateBuilder.Append(Utils.ObjectToStr(modelt.point));
	templateBuilder.Append(",'");
	templateBuilder.Append(Utils.ObjectToStr(config.webpath));
	templateBuilder.Append("tools/download.ashx?site=");
	templateBuilder.Append(Utils.ObjectToStr(site.build_path));
	templateBuilder.Append("&id=");
	templateBuilder.Append(Utils.ObjectToStr(modelt.id));
	templateBuilder.Append("');\">\r\n                            附件：");
	templateBuilder.Append(Utils.ObjectToStr(modelt.file_name));
	templateBuilder.Append("\r\n                        </a>\r\n                        <i>\r\n                            大小：\r\n                            ");
	if (modelt.file_size>1024)
	{

	                            string tempSize = (modelt.file_size/1024f).ToString("#.##");
	                            

	templateBuilder.Append("\r\n                            ");
	templateBuilder.Append(Utils.ObjectToStr(tempSize));
	templateBuilder.Append("MB\r\n                            ");
	}
	else
	{

	templateBuilder.Append("\r\n                            ");
	templateBuilder.Append(Utils.ObjectToStr(modelt.file_size));
	templateBuilder.Append("KB\r\n                            ");
	}	//end for if

	templateBuilder.Append("\r\n                        </i>\r\n                        <i>\r\n                            下载：\r\n                            <script type=\"text/javascript\" src=\"");
	templateBuilder.Append(Utils.ObjectToStr(config.webpath));
	templateBuilder.Append("tools/submit_ajax.ashx?action=view_attach_count&id=");
	templateBuilder.Append(Utils.ObjectToStr(modelt.id));
	templateBuilder.Append("\"></");
	templateBuilder.Append("script>次\r\n                        </i>\r\n                        </a>\r\n                    </li>\r\n                    ");
	}	//end for if

	}	//end for if

	templateBuilder.Append("\r\n                </ul>\r\n                <!--/附件列表-->\r\n            </div>\r\n        </div>\r\n    </container>\r\n\r\n    <!--Footer-->\r\n    ");

	templateBuilder.Append("\r\n<div class=\"container-fluid tlan\">\r\n    <div class=\"row-fluid\">\r\n        <div class=\"container-fluid fop\">\r\n            <div class=\"row-fluid\">\r\n                <div class=\"span12\">\r\n                    <div class=\"container-fluid\">\r\n                        <div class=\"fot\">\r\n                            <ul>\r\n                                <li><a href=\"/aspx/main/about.aspx\" target=\"_blank\">关于我们</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/list-54.html\">新闻公告</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/announce.aspx\" target=\"_blank\">网站声明</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/platform.aspx\" target=\"_blank\">平台优势</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/business.aspx\" target=\"_blank\">商务合作</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/hr.aspx\" target=\"_blank\">招贤纳士</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/help.aspx\" target=\"_blank\">帮助中心</a></li>\r\n                                <li class=\"line\">|</li>\r\n                                <li><a href=\"/aspx/main/insurance.aspx\" target=\"_blank\">安全保障</a></li>\r\n\r\n                            </ul>\r\n                        </div>\r\n                        <div class=\"ftjs\">\r\n                            <ul>\r\n                                <li style=\"width:41%\">\r\n                                    <div>\r\n                                        <div class=\"h_kefu\">\r\n                                            <!--<div class=\"customer-service\"><a href=\"../../aspx/main/Rease.aspx\">客服热线</a>：</div>-->\r\n                                            <div class=\"customer-service\"><a>客服热线</a>：</div>\r\n                                            <div class=\"customer-service-phone\">400-772-0575</div>\r\n                                            <div class=\"customer-service-time\">客服时间：上午9:00 - 下午17:30（工作日）</div>\r\n                                        </div>\r\n\r\n\r\n\r\n                                    </div>\r\n                                </li>\r\n                                <li>\r\n\r\n                                    <p class=\"h_email\" style=\"margin-top:68px\"><div class=\"yximg\"></div>邮箱：service@huipiaoxian.com</p>\r\n                                    <p class=\"h_address\" style=\"margin-top:10px\">\r\n                                        <div class=\"dizimg\"></div>地址：上海市浦东新区浦三路21弄55号604室\r\n                                        <span style=\"margin: 0 0 0 12%;\">（银亿滨江中心壹号）</span>\r\n                                    </p>\r\n                                </li>\r\n                                <li style=\"margin-left: 7%;margin-top: -1%;\">\r\n                                    <div class=\"bdes\">\r\n                                        <div class=\"xgo1\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/qr-codes-1.png\" /><div class=\"dyh\">订阅号</div></div>\r\n                                        <div class=\"xgo2\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/qr-codes-2.png\" /><div class=\"dyh\">App</div></div>\r\n                                    </div>\r\n                                    <div class=\"bcde\">\r\n                                        <ul>\r\n                                            <li>\r\n                                                <div class=\"kmk1\"><img class=\"wx3\" src=\"../../templates/main/images/wx3.png\" /></div>\r\n                                                <label>微信公众号</label>\r\n                                            </li>\r\n                                            <li>\r\n                                                <div class=\"kmk2\"><img class=\"wx2\" src=\"../../templates/main/images/wx2.png\" /></div>\r\n                                                <label>汇票线APP</label>\r\n                                            </li>\r\n                                            <li onclick=\"javascript: window.open('http://weibo.com/huipiaoxian')\">\r\n                                                <div class=\"kmk3\"><img class=\"wx1\" src=\"../../templates/main/images/wx1.png\" /></div>\r\n                                                <label>官方微博</label>\r\n                                            </li>\r\n                                        </ul>\r\n                                    </div>\r\n                                </li>\r\n                            </ul>\r\n                        </div>\r\n                        <div style=\"text-align:center\">\r\n                            <p>\r\n                                <img onclick=\"javascript: window.location.href = 'http://www.gsxt.gov.cn/corp-query-homepage.html'\" src=\"../../templates/main/images/renmin.png\" /> Copyright 2016  汇票线-上海票趣信息科技有限公司&nbsp; &nbsp; &nbsp; &nbsp;\r\n                                <img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/icp.jpg\">\r\n                                沪ICP备16031524号-1\r\n                            </p>\r\n                        </div>\r\n                    </div>\r\n\r\n\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n\r\n<script>\r\n    $(\".kmk1\").hover(function () {\r\n     $(\".xgo1\").show();\r\n }, function () {\r\n     $(\".xgo1\").hide();\r\n });\r\n\r\n    $(\".kmk2\").hover(function () {\r\n        $(\".xgo2\").show();\r\n    }, function () {\r\n        $(\".xgo2\").hide();\r\n    });\r\n</");
	templateBuilder.Append("script>");


	templateBuilder.Append("\r\n    <!--/Footer-->\r\n</body>\r\n</html>");
	Response.Write(templateBuilder.ToString());
}
</script>
