﻿<%@ Page Language="C#" AutoEventWireup="true" Inherits="DTcms.Web.UI.Page.index" ValidateRequest="false" %>
<%@ Import namespace="System.Collections.Generic" %>
<%@ Import namespace="System.Text" %>
<%@ Import namespace="System.Data" %>
<%@ Import namespace="DTcms.Common" %>

<script runat="server">
override protected void OnInit(EventArgs e)
{

	/* 
		This page was created by DTcms Template Engine at 2017/2/22 10:28:55.
		本页面代码由DTcms模板引擎生成于 2017/2/22 10:28:55. 
	*/

	base.OnInit(e);
	StringBuilder templateBuilder = new StringBuilder(220000);

	templateBuilder.Append("<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"utf-8\" />\r\n    <title>汇票线_平台优势</title>\r\n    <meta name=\"viewport\" content=\"width=1200px, initial-scale=1.0, user-scalable=true\">\r\n    <meta name=\"keywords\" content=\"");
	templateBuilder.Append(Utils.ObjectToStr(site.seo_keyword));
	templateBuilder.Append("\" />\r\n    <meta name=\"description\" content=\"汇票线平台票据交易安全、便利、人性化、服务专业化。\" />\r\n    <script src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/js/jquery.min.js\" type=\"text/javascript\"></");
	templateBuilder.Append("script>\r\n    <script src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/js/jquery.cookie.js\" type=\"text/javascript\"></");
	templateBuilder.Append("script>\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/bootstrap.min.css\" rel=\"stylesheet\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/style.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n    <link href=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/css/all.css\" rel=\"stylesheet\" type=\"text/css\" />\r\n</head>\r\n<body>\r\n    <!--Header-->\r\n    ");

	templateBuilder.Append("<div>\r\n    <!-- 头部 start-->\r\n    <script type=\"text/javascript\">\r\n        $(function () {\r\n            if ($.cookie('customer') && $.cookie('customer') != \"null\") {\r\n                var identity = JSON.parse($.cookie('customer'));\r\n                $(\"#userName\").html(identity.customer_name);\r\n                $(\"#divAnonymous\").hide();\r\n            }\r\n            else {\r\n                $(\"#divUser\").hide();\r\n\r\n                $('#link2').attr('href', 'javascript:swal(\\'请先登录账号！登录后即可进行出票操作。\\');');\r\n                $('#link4').attr('href', 'javascript:swal(\\'请先登录账号！登录后即可进行机构报价。\\');');\r\n            }\r\n        });\r\n\r\n        logout = function () {\r\n            if (confirm('确定要退出吗？')) {\r\n                $.cookie('customer', null);\r\n                window.location.href = window.location.href;\r\n            }\r\n        }\r\n    </");
	templateBuilder.Append("script>\r\n    <header>\r\n        <!-- 顶部 start-->\r\n        <nav class=\"header\">\r\n            <div class=\"container\">\r\n                <div class=\"row\">\r\n                    <div class=\"col-md-3 col-xs-4\">\r\n                        <div class=\"telBox\">\r\n                            <span class=\"tel\"><em></em>客服电话：400-772-0575</span>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"col-md-9 col-xs-8 contact text-right\">\r\n                        <!--<a href=\"\" class=\"phone icontu\"></a>手机\r\n                        <a href=\"\" class=\"weixin icontu\" onmouseover=\"showWeixin()\" onmouseout=\"hideWeixin()\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/weixin.jpg\" id=\"weixin\" style=\"display: none; position: absolute; left:-140px; top:40px; z-index:999;\" /></a>微信-->\r\n                    </div>\r\n                    <span id=\"divUser\" class=\"col-md-9 col-xs-8 contact text-right\">\r\n                        欢迎您！<span id=\"userName\"></span>\r\n                        <span>|</span>\r\n                        <a href=\"/www/index.html#/app/main/accountInfo\">个人中心</a>\r\n                        <span>|</span>\r\n                        <a href=\"javascript:logout();\">退出登录</a>\r\n                    </span>\r\n                    <span id=\"divAnonymous\" class=\"col-md-9 col-xs-8 contact text-right\">\r\n                        <a href=\"/aspx/main/help.aspx\" target=\"_blank\">新手引导</a>\r\n                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\r\n                        <a href=\"/www/index.html#/app/loginInfo\">登录</a>\r\n                        <span>|</span>\r\n                        <a href=\"/www/index.html#/app/signup\">注册</a>\r\n                        <!--&nbsp;&nbsp;\r\n                        <a class=\"phone icontu\" href=\"javascript:;\"></a>\r\n                        <a class=\"weixin icontu\" href=\"javascript:;\"></a>-->\r\n                    </span>\r\n                    <div class=\"clearfix\"></div>\r\n                </div>\r\n            </div>\r\n        </nav>\r\n        <!-- 顶部 end-->\r\n        <!-- logo+导航 start-->\r\n        <nav class=\"main-nav hpx-nav\">\r\n            <div class=\"container\">\r\n                <div class=\"row\">\r\n                    <!-- logo start-->\r\n                    <h1 class=\"col-md-5 col-xs-12\">\r\n                        <a href=\"/index.aspx\" target=\"_self\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/logo.jpg\" class=\"logo\" /></a>\r\n                    </h1>\r\n                    <!-- logo end-->\r\n                    <!-- 导航 start-->\r\n                    <div class=\"col-md-7 col-xs-12\">\r\n                        <ul class=\"navbar\">\r\n                            <li><a href=\"/index.aspx\">首页</a></li>\r\n                            <li><a id=\"link2\" href=\"/www/index.html#/app/main/publish\">我要出票</a></li>\r\n                            <li><a href=\"/www/index.html#/app/free/queryBill\">我要收票</a></li>\r\n                            <li><a id=\"link4\" href=\"/www/index.html#/app/main/editQuote\">机构报价</a></li>\r\n                            <li><a href=\"/index.aspx#agent\">汇票助手</a></li>\r\n                        </ul>\r\n                    </div>\r\n                    <!-- 导航 end-->\r\n                </div>\r\n            </div>\r\n        </nav>\r\n        <!-- logo+导航 end-->\r\n\r\n    </header>\r\n    <!-- 头部 end-->\r\n</div>\r\n<script>\r\n    function showWeixin() {\r\n        document.getElementById(\"weixin\").style.display = \"block\";\r\n    }\r\n    function hideWeixin() {\r\n        document.getElementById(\"weixin\").style.display = \"none\";\r\n    }\r\n</");
	templateBuilder.Append("script>");


	templateBuilder.Append("\r\n    <!--/Header-->\r\n    <strong><em></em></strong>\r\n    <div class=\"bg3\">\r\n        <div class=\"banner2\"></div>\r\n        <div class=\"pt3\">\r\n            <div class=\"nav2\">\r\n                <ul>\r\n                    <li><a href=\"about.aspx\">关于我们</a></li>\r\n                    <li><a href=\"/list-54.html\">新闻公告</a></li>\r\n                    <li><a href=\"announce.aspx\">网站声明</a></li>\r\n                    <li><a href=\"platform.aspx\" style=\"background-color: #f55a14; color: #fff; padding: 10px 24px;\">平台优势</a></li>\r\n                    <li><a href=\"business.aspx\">商务合作</a></li>\r\n                    <li><a href=\"hr.aspx\">招纳贤士</a></li>\r\n                    <li><a href=\"help.aspx\">帮助中心</a></li>\r\n                    <li><a href=\"insurance.aspx\">安全保障</a></li>\r\n                </ul>\r\n            </div>\r\n            <div class=\"an\"><img src=\"pic/四大优势.png\"</div>\r\n        </div>\r\n    </div>\r\n    <!--Footer-->\r\n    ");

	templateBuilder.Append("<div>\r\n    <footer>\r\n        <div class=\"footer-warp\">\r\n            <div class=\"container\">\r\n                <!--底部栏目 start-->\r\n                <div class=\"row\">\r\n                    <ul class=\"nav navbar-nav col-md-12\">\r\n                        <li><a href=\"/aspx/main/about.aspx\" target=\"_blank\">关于我们</a></li>\r\n                        <li class=\"line\">|</li>\r\n                        <li><a href=\"/list-54.html\">新闻公告</a></li>\r\n                        <li class=\"line\">|</li>\r\n                        <li><a href=\"/aspx/main/announce.aspx\" target=\"_blank\">网站声明</a></li>\r\n                        <li class=\"line\">|</li>\r\n                        <li><a href=\"/aspx/main/platform.aspx\" target=\"_blank\">平台优势</a></li>\r\n                        <li class=\"line\">|</li>\r\n                        <li><a href=\"/aspx/main/business.aspx\" target=\"_blank\">商务合作</a></li>\r\n                        <li class=\"line\">|</li>\r\n                        <li><a href=\"/aspx/main/hr.aspx\" target=\"_blank\">招贤纳士</a></li>\r\n                        <li class=\"line\">|</li>\r\n                        <li><a href=\"/aspx/main/help.aspx\" target=\"_blank\">帮助中心</a></li>\r\n                        <li class=\"line\">|</li>\r\n                        <li><a href=\"/aspx/main/insurance.aspx\" target=\"_blank\">安全保障</a></li>\r\n                    </ul>\r\n                </div>\r\n                <!--底部栏目 ens-->\r\n                <!-- 第一行 start-->\r\n                <div class=\"ft-first row\">\r\n                    <div class=\"ft-service col-md-3 col-xs-5\">\r\n                        <div class=\"customer-service\">客服热线：</div>\r\n                        <div class=\"customer-service-phone\">400-772-0575</div>\r\n                    </div>\r\n                    <div class=\"ft-service-tu col-md-1 col-xs-1\"><img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/hpx-bot.jpg\" /></div>\r\n                    <div class=\"ft-nav col-md-4 col-xs-6\">\r\n                        <p>邮箱：service@huipiaoxian.com</p>\r\n                        <p>\r\n                            地址：上海市浦东新区浦三路21弄55号604室<br />\r\n                            （银亿滨江中心壹号）\r\n                        </p>\r\n                    </div>\r\n                    <div class=\"bar-code col-md-4 hidden-xs\"></div>\r\n                    <div class=\"clearfix\"></div>\r\n                </div>\r\n                <!-- 第一行 end-->\r\n                <!-- 第二行 start-->\r\n                <div class=\"ft-sec row\">\r\n                    <div class=\"aut-copyright col-md-12 text-center\">\r\n                        <p>\r\n                            ©Copyright 2016  汇票线-上海票趣信息科技有限公司&nbsp; &nbsp; &nbsp; &nbsp;\r\n                            <img src=\"");
	templateBuilder.Append("/templates/main");
	templateBuilder.Append("/images/icp.jpg\">\r\n                            沪ICP备16031524号-1\r\n                        </p>\r\n                    </div>\r\n                    <!--\r\n                    <div class=\"link-nav col-xs-6\">\r\n                        <ul>\r\n                            <li class=\"lk1\"><a href=\"\"></a></li>\r\n                            <li class=\"lk2\"></li>\r\n                            <li class=\"lk3\"></li>\r\n                            <li class=\"lk4\"></li>\r\n                            <li class=\"lk5\"></li>\r\n                        </ul>\r\n                    </div>\r\n                    -->\r\n                </div>\r\n                <!-- 第二行 end-->\r\n            </div>\r\n        </div>\r\n    </footer>\r\n</div>");


	templateBuilder.Append("\r\n    <!--/Footer-->\r\n</body>\r\n</html>");
	Response.Write(templateBuilder.ToString());
}
</script>