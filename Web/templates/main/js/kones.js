window.onload = function () {
    $(".color1").css("color", "#ff5a14");
    $(function () {
        var username;
        var password;

        var baseURL = 'http://183.247.168.4:8000/v1';

        if ($.cookie('username')) {
            $("#username").val($.cookie('username'));
            $("#rememberme").prop("checked", true);
        }

        $("#username").keyup(function (event) {
            if (event.keyCode == 13) {
                preLogin();
            }
        });

        $("#password").keyup(function (event) {
            if (event.keyCode == 13) {
                preLogin();
            }
        });

        $('#logon').click(function () {
            preLogin();
        });

        var failTimes = 0;

        login = function (enterprise_id) {
            $.ajax({
                type: "post",
                contentType: "application/json",
                url: baseURL + "/customers/customerLogin",
                data: JSON.stringify({ 'username': username, 'password': password, 'enterprise_id': enterprise_id }),
                dataType: "json",
                success: function (response) {
                    if (response.meta.code == 201) {
                        $.cookie('customer', JSON.stringify(response.data));

                        if ($("#rememberme").prop("checked") == true) {
                            $.cookie('username', username, { expires: 365 });
                        }
                        else {
                            $.cookie('username', '');
                        }

                        document.location.href = "/www/index.html#/app/main/accountInfo"
                    }
                    else {
                        swal("登录失败", response.meta.message, "error");
                    }
                },
                error: function () {
                    swal("登录失败", "请求失败", "error");
                }
            });
        }

        if ($.cookie('customer') && $.cookie('customer') != "null") {
            $("#divLogin").hide();
        }

        preLogin = function () {
            if ($('#logon').attr('disabled')) {
                return;
            }

            $('#logon').attr('disabled', "true");
            username = $('#username').val();
            password = $('#password').val();

            $.ajax({
                type: "post",
                contentType: "application/json",
                url: baseURL + "/customers/customerLoginEnterprise",
                data: JSON.stringify({ 'username': username, 'password': password }),
                dataType: "json",
                success: function (response) {
                    if (response.meta.code == 201) {
                        var enterprises = response.data.enterprises;
                        if (enterprises.length == 1) {
                            login(enterprises[0].enterprise_id);
                        }
                        else {
                            var content = '';

                            for (var i = 0; i < enterprises.length; i++) {
                                content += '<div class="form-group">';
                                content += '<div class="col-md-3 text-right">';
                                content += '<button type="button" class="btn btn-sm btn-warning" onclick="login(' + enterprises[i].enterprise_id + ')"><i class="fa fa-share-square-o"></i> 选择登录</button>';
                                content += '</div>';
                                content += '<div class="col-md-9">';
                                content += enterprises[i].enterprise_name;
                                content += '</div>';
                                content += '</div>';
                            }

                            $('#divEnterprise').html(content);
                            $('#modal-enterprise').modal('show');
                            $('#logon').removeAttr("disabled");
                        }
                    }
                    else {
                        $('#logon').removeAttr("disabled");
                        swal("登录失败", response.meta.message, "error");

                        failTimes++;
                        if (failTimes > 2) {
                            $('#drag').drag();
                            $('#dragDiv').show();
                            $('#logon').attr('disabled', "true");
                        }
                    }
                },
                error: function () {
                    $('#logon').removeAttr("disabled");
                    swal("登录失败", "请求失败", "error");
                }
            });
        }

        $('#electricTab').mouseover(function () {
            $('#electricTab').addClass('current white');
            $('#paperTab').removeClass('current white');
            $('#electric-memo').removeClass('hidden');
            $('#paper-memo').addClass('hidden');
            $('#electric-money-list').removeClass('hidden');
            $('#paper-money-list').addClass('hidden');
            $('#electric-money-list-more').removeClass('hidden');
            $('#paper-money-list-more').addClass('hidden');
        });

        $('#paperTab').mouseover(function () {
            $('#electricTab').removeClass('current white');
            $('#paperTab').addClass('current white');
            $('#electric-memo').addClass('hidden');
            $('#paper-memo').removeClass('hidden');
            $('#electric-money-list').addClass('hidden');
            $('#paper-money-list').removeClass('hidden');
            $('#electric-money-list-more').addClass('hidden');
            $('#paper-money-list-more').removeClass('hidden');
        });

        $('#billOfferTab1').mouseover(function () {
            $('#billOfferTab1').addClass('current white');
            $('#billOfferTab2').removeClass('current white');
            $('#billOfferTab3').removeClass('current white');
            $('#billOfferTab4').removeClass('current white');
            $('#billOffer1-list').removeClass('hidden');
            $('#billOffer2-list').addClass('hidden');
            $('#billOffer3-list').addClass('hidden');
            $('#billOffer4-list').addClass('hidden');
        });

        $('#billOfferTab2').mouseover(function () {
            $('#billOfferTab1').removeClass('current white');
            $('#billOfferTab2').addClass('current white');
            $('#billOfferTab3').removeClass('current white');
            $('#billOfferTab4').removeClass('current white');
            $('#billOffer1-list').addClass('hidden');
            $('#billOffer2-list').removeClass('hidden');
            $('#billOffer3-list').addClass('hidden');
            $('#billOffer4-list').addClass('hidden');
        });

        $('#billOfferTab3').mouseover(function () {
            $('#billOfferTab1').removeClass('current white');
            $('#billOfferTab2').removeClass('current white');
            $('#billOfferTab3').addClass('current white');
            $('#billOfferTab4').removeClass('current white');
            $('#billOffer1-list').addClass('hidden');
            $('#billOffer2-list').addClass('hidden');
            $('#billOffer3-list').removeClass('hidden');
            $('#billOffer4-list').addClass('hidden');
        });

        $('#billOfferTab4').mouseover(function () {
            $('#billOfferTab1').removeClass('current white');
            $('#billOfferTab2').removeClass('current white');
            $('#billOfferTab3').removeClass('current white');
            $('#billOfferTab4').addClass('current white');
            $('#billOffer1-list').addClass('hidden');
            $('#billOffer2-list').addClass('hidden');
            $('#billOffer3-list').addClass('hidden');
            $('#billOffer4-list').removeClass('hidden');
        });




        // 交易统计
        $.get(baseURL + "/orders/orderCount", {}, function (response) {
            $('#total_trade_price').html('￥' + formatCurrency(response.data.total_trade_price));
            $('#total_electronic_trade_price').html('￥' + formatCurrency(response.data.total_electronic_trade_price));
            $('#yesterday_trade_price').html('￥' + formatCurrency(response.data.yesterday_trade_price));
            $('#average_trade_time').html(response.data.average_trade_time);
        });

        // 电票
        $.get(baseURL + "/bills/billProduct", { 'billTypeId': 101, 'func': 'home' }, function (response) {
            var data = response.data.bill_products;
            var content = '';

            for (var i = 0; i < data.length; i++) {
                content += '<tr>';
                content += '<td>' + data[i].acceptor_type_name + '<div  class="jglx">机构类型</div></td>';
                content += '<td class="g-orange">' + (data[i].bill_sum_price / 10000).toFixed(2) + '万 <div  class="jglx">票面金额</div></td>';
                content += '<td>' + (data[i].bill_deadline_time ? $.convert.UnixToDate(data[i].bill_deadline_time / 1000).toLocaleString().split(' ')[0] : '--') + '<div  class="jglx">汇票到期日</div></td>';
                content += '<td>' + (data[i].remaining_day ? data[i].remaining_day : '--') + '<div  class="jglx">剩余天数</div></td>';
                content += '<td>' + (data[i].product_location ? data[i].product_location : '--') + '<div  class="jglx">所在地区</div></td>';
                content += '<td class="col-md-2 col-xs-2 text-center"><a style="margin-left: -11%;" href="/www/index.html#/app/free/readBill?id=' + data[i].id + '" target="_blank" class="electric-money-button btn-color-border ">我要竞价</a></td>';
                content += '</tr>';
            }

            $('#electric-money-list tbody').html(content);
        });

        // 纸票
        $.get(baseURL + "/bills/billProduct", { 'billTypeId': 102, 'func': 'home' }, function (response) {
            var data = response.data.bill_products;
            var content = '';

            for (var i = 0; i < data.length; i++) {
                content += '<tr>';
                content += '<td>' + data[i].acceptor_type_name + '<div  class="jglx">机构类型</div></td>';
                content += '<td class="g-orange">' + (data[i].bill_sum_price / 10000).toFixed(2) + '万<div  class="jglx">票面金额</div></td>';
                content += '<td>' + (data[i].bill_deadline_time ? $.convert.UnixToDate(data[i].bill_deadline_time / 1000).toLocaleString().split(' ')[0] : '--') + '<div  class="jglx">汇票到期日</div></td>';
                content += '<td>' + (data[i].remaining_day ? data[i].remaining_day : '--') + '<div  class="jglx">剩余天数</div></td>';
                content += '<td>' + (data[i].product_location ? data[i].product_location : '--') + '<div  class="jglx">所在地区</div></td>';
                content += '<td class="col-md-2 col-xs-2 text-center"><a style="margin-left: -11%;" href="/www/index.html#/app/free/readBill?id=' + data[i].id + '" target="_blank" class="electric-money-button btn-color-border ">我要竞价</a></td>';
                content += '</tr>';
            }

            $('#paper-money-list tbody').html(content);
        });

        // 银电大票
        $.get(baseURL + "/bills/billOffer", { 'func': 'home', 'billStyleId': 202, 'n': 4 }, function (response) {
            var data = response.data.bill_offers;
            var content = '';

            for (var i = 0; i < data.length; i++) {
                var offer_detail = JSON.parse(data[i].offer_detail);
                content += '<li><div class="qym"><div class="majgs"><div class="majg"><span style="margin-left: 4%;">' + data[i].enterprise_name + '</span></div></div><div class="magkm"><ul><li style="margin-left: 1%;"><div class="moly">' + (offer_detail.offer_rate01 ? offer_detail.offer_rate01 : '--') + '</div><div class="molys">国股</div></li><li><div class="moly">' + (offer_detail.offer_rate02 ? offer_detail.offer_rate02 : '--') + '</div><div class="molys">城商</div></li><li><div class="moly">' + (offer_detail.offer_rate03 ? offer_detail.offer_rate03 : '--') + '</div><div class="molys">三农</div></li><li><div class="moly">' + (offer_detail.offer_rate04 ? offer_detail.offer_rate04 : '--') + '</div><div class="molys">村镇</div></li><li><div class="moly">' + (offer_detail.offer_rate05 ? offer_detail.offer_rate05 : '--') + '</div><div class="molys">外资</div></li><li style="width:9%"><div class="moly">' + (offer_detail.offer_rate06 ? offer_detail.offer_rate06 : '--') + '</div><div class="molys" style=width:100%;>财务公司</div></li><li style="width: 12%;"> <div class="moly">' + (data[i].trade_location ? data[i].trade_location : '--') + '</div>     <div class="molys">所在地区</div></li><li style="width:12%"><div class="moly">' + $.convert.UnixToDate(data[i].offer_time / 1000).toLocaleString().split(' ')[0] + '</div><div class="molys">报价时间</div></li><li><div class="col-md-2 col-xs-2 text-center  xq"><a href="/www/index.html#/app/free/readOffer?id=' + data[i].id + '" target="_blank" class="electric-money-button2 btn-color-border">查看详情</a></div></li></ul></div></div>';

            }

            $('#billOffer1-list').html(content);
        });

        // 银纸小票
        $.get(baseURL + "/bills/billOffer", { 'func': 'home', 'billStyleId': 203, 'n': 4 }, function (response) {
            var data = response.data.bill_offers;
            var content = '';

            for (var i = 0; i < data.length; i++) {
                var offer_detail = JSON.parse(data[i].offer_detail);
                content += '<li><div class="qym"><div class="majgs"><div class="majg"><span style="margin-left: 4%;">' + data[i].enterprise_name + '</span></div></div><div class="magkm"><ul><li style="margin-left: 1%;"><div class="moly">' + (offer_detail.offer_rate01 ? offer_detail.offer_rate01 : '--') + '</div><div class="molys">国股</div></li><li><div class="moly">' + (offer_detail.offer_rate02 ? offer_detail.offer_rate02 : '--') + '</div><div class="molys">城商</div></li><li><div class="moly">' + (offer_detail.offer_rate03 ? offer_detail.offer_rate03 : '--') + '</div><div class="molys">三农</div></li><li><div class="moly">' + (offer_detail.offer_rate04 ? offer_detail.offer_rate04 : '--') + '</div><div class="molys">村镇</div></li><li><div class="moly">' + (offer_detail.offer_rate05 ? offer_detail.offer_rate05 : '--') + '</div><div class="molys">外资</div></li><li style="width:9%"><div class="moly">' + (offer_detail.offer_rate06 ? offer_detail.offer_rate06 : '--') + '</div><div class="molys" style=width:100%;>财务公司</div></li><li style="width: 12%;"> <div class="moly">' + (data[i].trade_location ? data[i].trade_location : '--') + '</div>     <div class="molys">所在地区</div></li><li style="width:12%"><div class="moly">' + $.convert.UnixToDate(data[i].offer_time / 1000).toLocaleString().split(' ')[0] + '</div><div class="molys">报价时间</div></li><li><div class="col-md-2 col-xs-2 text-center  xq"><a href="/www/index.html#/app/free/readOffer?id=' + data[i].id + '" target="_blank" class="electric-money-button2 btn-color-border">查看详情</a></div></li></ul></div></div>';

            }

            $('#billOffer2-list').html(content);
        });

        // 银电小票
        $.get(baseURL + "/bills/billOffer", { 'func': 'home', 'billStyleId': 204, 'n': 4 }, function (response) {
            var data = response.data.bill_offers;
            var content = '';

            for (var i = 0; i < data.length; i++) {
                var offer_detail = JSON.parse(data[i].offer_detail);
                content += '<li><div class="qym"><div class="majgs"><div class="majg"><span style="margin-left: 4%;">' + data[i].enterprise_name + '</span></div></div><div class="magkm"><ul><li style="margin-left: 1%;"><div class="moly">' + (offer_detail.offer_rate01 ? offer_detail.offer_rate01 : '--') + '</div><div class="molys">国股</div></li><li><div class="moly">' + (offer_detail.offer_rate02 ? offer_detail.offer_rate02 : '--') + '</div><div class="molys">城商</div></li><li><div class="moly">' + (offer_detail.offer_rate03 ? offer_detail.offer_rate03 : '--') + '</div><div class="molys">三农</div></li><li><div class="moly">' + (offer_detail.offer_rate04 ? offer_detail.offer_rate04 : '--') + '</div><div class="molys">村镇</div></li><li><div class="moly">' + (offer_detail.offer_rate05 ? offer_detail.offer_rate05 : '--') + '</div><div class="molys">外资</div></li><li style="width:9%"><div class="moly">' + (offer_detail.offer_rate06 ? offer_detail.offer_rate06 : '--') + '</div><div class="molys" style=width:100%;>财务公司</div></li><li style="width: 12%;"> <div class="moly">' + (data[i].trade_location ? data[i].trade_location : '--') + '</div>     <div class="molys">所在地区</div></li><li style="width:12%"><div class="moly">' + $.convert.UnixToDate(data[i].offer_time / 1000).toLocaleString().split(' ')[0] + '</div><div class="molys">报价时间</div></li><li><div class="col-md-2 col-xs-2 text-center  xq"><a href="/www/index.html#/app/free/readOffer?id=' + data[i].id + '" target="_blank" class="electric-money-button2 btn-color-border">查看详情</a></div></li></ul></div></div>';

            }

            $('#billOffer3-list').html(content);
        });

        // 商票
        $.get(baseURL + "/bills/billOffer", { 'func': 'home', 'billStyleId': 205, 'n': 4 }, function (response) {
            var data = response.data.bill_offers;
            var content = '';

            for (var i = 0; i < data.length; i++) {
                var offer_detail = JSON.parse(data[i].offer_detail);
                content += '<li><div class="qym"><div class="majgs"><div class="majg"><span style="margin-left: 4%;">' + data[i].enterprise_name + '</span></div></div><div class="magkm"><ul><li style="margin-left: 1%;"><div class="moly">' + (offer_detail.offer_rate01 ? offer_detail.offer_rate01 : '--') + '</div><div class="molys">电票</div></li><li><div class="moly">' + (offer_detail.offer_rate02 ? offer_detail.offer_rate02 : '--') + '</div><div class="molys">纸票</div></li><li><div class="moly">' + (offer_detail.offer_rate03 ? offer_detail.offer_rate03 : '--') + '</div><div class="molys">三农</div></li><li><div class="moly">' + (offer_detail.offer_rate04 ? offer_detail.offer_rate04 : '--') + '</div><div class="molys">村镇</div></li><li><div class="moly">' + (offer_detail.offer_rate05 ? offer_detail.offer_rate05 : '--') + '</div><div class="molys">外资</div></li><li style="width:9%"><div class="moly">' + (offer_detail.offer_rate06 ? offer_detail.offer_rate06 : '--') + '</div><div c</li><li style="width: 12%;"> <div class="moly">' + (data[i].trade_location ? data[i].trade_location : '--') + '</div>     <div class="molys">所在地区</div></li><li style="width:12%"><div class="moly">' + $.convert.UnixToDate(data[i].offer_time / 1000).toLocaleString().split(' ')[0] + '</div><div class="molys">报价时间</div></li><li><div class="col-md-2 col-xs-2 text-center  xq"><a href="/www/index.html#/app/free/readOffer?id=' + data[i].id + '" target="_blank" class="electric-money-button2 btn-color-border">查看详情</a></div></li></ul></div></div>';;
                content += '<div class="col-md-1 col-xs-1 text-center"><p>' + (offer_detail.offer_rate01 ? offer_detail.offer_rate01 : '--') + '</p><span class="g-gray">电票</span></div>';
                content += '<div class="col-md-1 col-xs-2 text-center"><p>' + (offer_detail.offer_rate02 ? offer_detail.offer_rate02 : '--') + '</p><span class="g-gray">纸票</span></div>';
                content += '<div class="col-md-2 col-xs-2 text-center"><p>' + data[i].trade_location + '</p><span class="g-gray">所在地区</span></div>';
                content += '<div class="col-md-2 col-xs-2 text-center"><p>' + $.convert.UnixToDate(data[i].offer_time / 1000).toLocaleString().split(' ')[0] + '</p><span class="g-gray">报价时间</span></div>';
                content += '</div><div class="col-md-2 col-xs-2 text-center "><a href="/www/index.html#/app/free/readOffer?id=' + data[i].id + '" target="_blank" class="electric-money-button2 btn-color-border">查看详情</a></div></li>';
            }

            $('#billOffer4-list').html(content);
        });

        // 判断ie版本
        var DEFAULT_VERSION = "8.0";
        var ua = navigator.userAgent.toLowerCase();
        var showTitle = ua.indexOf("msie 8.0") == -1;

        // 图片新闻
        $("#slide").player({
            showTitle: showTitle,
            width: '280px',
            height: '180px',
            time: '5000',
            transition: 1,
            duration: 500,
            //method:'4',
            animate: { 'direction': 'fix' },
            divCSS: { 'border': 'none' },
            ulCSS: { 'bottom': '5px', 'right': '10px', 'line-height': '10px' },
            titleCSS: { 'background': '#434343', 'text-align': 'left', 'line-height': '30px', 'height': '30px', 'color': '#fff', 'font-size': '14px' }
        }).play();
        $("#slide img").css("height", "180px").css("width", "280px");

        // 挂失
        $.get(baseURL + "/tools/serviceByPublication", { 'n': 20, 'func': 'latest', 'orderBy': '-id' }, function (response) {
            var data = response.data.service_by_publications;
            var content = '';

            for (var i = 0; i < data.length; i++) {
                content += '<li style=\"color: #505050;  line-height: 33px;\"><span style=\"display:inline-block; width: 36%; text-align:center;\">' + data[i].bill_number + '</span><span style=\"display:inline-block; width: 42%; text-align:center;\">' + data[i].announce_court.substring(0, 10) + '</span><span style="display:inline-block; width: 22%; text-align:center;">' + $.convert.UnixToDate(data[i].announce_time / 1000).toLocaleString().split(' ')[0] + '</span></li>';
            }

            $('#lost ul').html(content);

            $('#lost').vTicker({
                showItems: 4,
                pause: 3000
            });
        });
    });
}




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
