var hpxAdminApp = angular.module('hpxAdminApp', [
    'ui.router',
    'ui.calendar',
    'ui.bootstrap',
    'oc.lazyLoad',
    'ngTable',
    'ngFileUpload',
    'restangular',
    'ngCookies',
    'ngAnimate',
    'ui.bootstrap.datetimepicker'

]);

hpxAdminApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$cookiesProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $cookiesProvider) {
    $urlRouterProvider.otherwise('/');
    //$locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: '/',
            data: { pageTitle: '首页' },
            templateUrl: 'views/home.html'


        })
        .state('app', {
            url: '/app',
            templateUrl: 'template/app.html',
            abstract: true
        })
        .state('app.signup', {
            url: '/signup',
            data: { pageTitle: '注册' },
            templateUrl: 'views/signup.html'
        })
        //.state('app.loginInfo', {
        //    url: '/loginInfo',
        //    data: { pageTitle: '登录' },
        //    templateUrl: 'views/loginInfo.html'
        //})
        .state('app.loginInfo', {
            url: '/loginInfo',
            data: { pageTitle: '登录' },
            templateUrl: 'views/loginInfo.html'
        })
        .state('app.forgetPassword', {
            url: '/forgetPassword',
            data: { pageTitle: '忘记密码' },
            templateUrl: 'views/forgetPassword.html'
        })
        .state('app.free', {
            url: '/free',
            templateUrl: 'template/free.html',
            abstract: true
        })
        .state('app.free.aaa', {
            url: '/aaa',
            templateUrl:'views/aaa.html'
        })
        .state('app.free.information', {
            url: '/information?id',
            templateUrl: 'views/information.html'
        })
        .state('app.free.informationList', {
            url: '/informationList?type',
            templateUrl: 'views/informationList.html'
        })
        .state('app.free.queryBill', {
            url: '/queryBill?id&type',
            data: { pageTitle: '汇票查询' },
            templateUrl: 'views/queryBill.html',
            reload: true,
        })
        .state('app.free.readBill', {
            url: '/readBill?id&check',
            data: { pageTitle: '汇票详细信息' },
            templateUrl: 'views/readBill.html'
        })
        .state('app.free.readBillSup', {
            url: '/readBillSup?id&check',
            data: { pageTitle: '汇票详细信息' },
            templateUrl: 'views/readBill.html',
            reload: true,
        })
        .state('app.free.readBillBid', {
            url: '/readBillBid?id&check',
            data: { pageTitle: '汇票详细信息' },
            templateUrl: 'views/readBill.html'
        })
        .state('app.free.readBillSelf', {
            url: '/readBillSelf?id&check',
            data: { pageTitle: '汇票详细信息' },
            templateUrl: 'views/readBill.html'
        })
        .state('app.free.queryOffer', {
            url: '/myOffer?id',
            data: { pageTitle: '报价查询' },
            templateUrl: 'views/queryOffer.html'
        })
        .state('app.free.readOffer', {
            url: '/readOffer?id',
            data: { pageTitle: '报价详细信息' },
            templateUrl: 'views/readOffer.html'
        })
        .state('app.free.calculator', {
             url: '/calculator',
            data: { pageTitle: '贴现计算器' },
            templateUrl: 'views/discountCalculator.html'
        })
        .state('app.free.calendar', {
            url: '/calendar',
            data: { pageTitle: '开票日历' },
            templateUrl: 'views/billCalendar.html'
        })
        .state('app.free.querybank', {
            url: '/querybank',
            data: { pageTitle: '行号查询' },
            templateUrl: 'views/bankQuery.html'
        })
        .state('app.free.querypublic', {
            url: '/querypublic',
            data: { pageTitle: '挂失查询' },
            templateUrl: 'views/publicQuery.html'
        })
        .state('app.free.queryenterprise', {
            url: '/queryenterprise',
            data: { pageTitle: '工商查询' },
            templateUrl: 'views/businessQuery.html'
        })


        .state('app.main', {
            url: '/main',
            templateUrl: 'template/main.html',
            abstract: true
        })
        .state('app.main.accountInfo', {
            url: '/accountInfo',
            data: { pageTitle: '客户信息' },
            templateUrl: 'views/accountInfo.html'
        })
        .state('app.main.enterpriseAccountInfo', {
            url: '/enterpriseAccountInfo',
            data: { pageTitle: '账户信息' },
            templateUrl: 'views/enterpriseAccountInfo.html'
        })
        .state('app.main.electronicAccount', {
            url: '/electronicAccount',
            data: { pageTitle: '--电子账户' },
            templateUrl: 'views/electronicAccount.html'
        })
        .state('app.main.operater', {
            url: '/operater',
            data: { pageTitle: '操作员' },
            templateUrl: 'views/operater.html'
        })
        .state('app.main.addressInfo', {
            url: '/addressInfo',
            data: { pageTitle: '地址信息' },
            templateUrl: 'views/addressInfo.html'
        })
        .state('app.main.recharge', {
            url: '/recharge',
            data: { pageTitle: '在线充值' },
            templateUrl: 'views/recharge.html'
        })
        .state('app.main.messageCenter', {
            url: '/messageCenter',
            data: { pageTitle: '消息中心' },
            templateUrl: 'views/messageCenter.html'
        })
        .state('app.main.publish', {
            url: '/publish?id&bidId&accountId',
            data: { pageTitle: '发布汇票' },
            templateUrl: 'views/publish.html'
        })

        .state('app.main.hpxTest', {
            url: '/hpxTest',
            data: { pageTitle: '汇票线测试' },
            templateUrl:'views/hpxTest.html'
        })

        .state('app.main.myBillFail', {
            url: '/myBillFail',
            data: { pageTitle: '发布审核中' },
            templateUrl: 'views/myBillFail.html'
        })
        .state('app.main.myBill', {
            url: '/myBill',
            data: { pageTitle: '我的发布' },
            templateUrl: 'views/myBill.html'
        })

        .state('app.main.myBidding', {
            url: '/myBidding',
            data: { pageTitle: '我的竞价' },
            templateUrl: 'views/myBidding.html'
        })
        .state('app.main.endorsement', {
            url: '/endorsement',
            data: { pageTitle: '背书' },
            templateUrl: 'views/endorsement.html'
        })
        .state('app.main.orderDrawer', {
            url: '/orderDrawer',
            data: { pageTitle: '出票订单' },
            templateUrl: 'views/orderDrawer.html'
        })
        .state('app.main.orderDrawerInfo', {
            url: '/orderDrawerInfo?id',
            data: { pageTitle: '出票订单详细信息' },
            templateUrl: 'views/orderDrawerInfo.html'
        })
        .state('app.main.quote', {
            url: '/quote',
            data: { pageTitle: '报价' },
            templateUrl: 'views/quote.html'
        })
        .state('app.main.editQuote', {
            url: '/editQuote?id',
            data: { pageTitle: '报价详细信息' },
            templateUrl: 'views/editQuote.html'
        })
        .state('app.main.orderReceiver', {
            url: '/orderReceiver',
            data: { pageTitle: '收票订单' },
            templateUrl: 'views/orderReceiver.html'
        })
        .state('app.main.orderReceiverInfo', {
            url: '/orderReceiverInfo?id',
            data: { pageTitle: '收票订单详细信息' },
            templateUrl: 'views/orderReceiverInfo.html'
        })
        .state('app.main.payment', {
            url: '/payment',
            data: { pageTitle: '付款' },
            templateUrl: 'views/payment.html'
        })
        .state('app.main.orderWait', {
            url: '/orderWait',
            data: { pageTitle: '待确认交易' },
            templateUrl: 'views/orderWait.html'
        })
        .state('app.main.enterpriseInfo', {
            url: '/enterpriseInfo',
            cache:false,
            data: { pageTitle: '客户信息' },
            templateUrl: 'views/enterpriseInfo.html'
        })
        .state('app.main.modifyPassword', {
            url: '/modifyPassword?id',
            data: { pageTitle: '修改密码' },
            templateUrl: 'views/modifyPassword.html'
        })
        .state('app.main.customerInfo', {
            url: '/customerInfo',
            data: { pageTitle: '用户资料' },
            templateUrl: 'views/customerInfo.html'
        })
        .state('app.main.autonymAuthentication', {
            url: '/autonymAuthentication',
            data: { pageTitle: '用户资料' },
            templateUrl: 'views/autonymAuthentication.html'
        })
        .state('app.main.accountStatus', {
            url: '/accountStatus',
            data: { pageTitle: '账户状态' },
            templateUrl: 'views/accountStatus.html'
        })
        .state('app.main.approveCustomer', {
            url: '/approveCustomer',
            data: { pageTitle: '机构认证' },
            templateUrl: 'views/approveCustomer.html'
        })
        .state('app.main.approveEnterprise', {
            url: '/approveEnterprise',
            data: { pageTitle: '机构认证' },
            templateUrl: 'views/approveEnterprise.html'
        })
        .state('app.main.approveAgent', {
            url: '/approveAgent',
            data: { pageTitle: '业务授权' },
            templateUrl: 'views/approveAgent.html'
        })
        .state('app.main.approveAccount', {
            url: '/approveAccount',
            data: { pageTitle: '账户绑定' },
            templateUrl: 'views/approveAccount.html'
        })
        .state('app.main.portalSuggestion', {
            url: '/portalSuggestion',
            data: { pageTitle: '投诉建议' },
            templateUrl: 'views/portalSuggestion.html'
        })
        .state('app.main.evaluate', {
            url: '/evaluate?type_id&to_id&gettype',
            data: { pageTitle: '评价' },
            templateUrl: 'views/evaluate.html'
        })
        .state('app.main.evaluates', {
            url: '/evaluates?type_id&to_id&gettype',
            data: { pageTitle: '评价' },
            templateUrl: 'views/evaluates.html'
        })
        .state('app.main.bankQuery', {
            url: '/bankQuery',
            data: { pageTitle: '行号查询' },
            templateUrl: 'views/bankQuery.html'
        })
        .state('app.main.publicQuery', {
            url: '/publicQuery',
            data: { pageTitle: '挂失查询' },
            templateUrl: 'views/publicQuery.html'
        })
        .state('app.main.businessQuery', {
            url: '/businessQuery',
            data: { pageTitle: '工商查询' },
            templateUrl: 'views/businessQuery.html'
        })
        .state('app.main.billCalendar', {
            url: '/billCalendar',
            data: { pageTitle: '开票日历' },
            templateUrl: 'views/billCalendar.html'
        })
        .state('app.main.discountCalculator', {
            url: '/discountCalculator',
            data: { pageTitle: '贴现计算器' },
            templateUrl: 'views/discountCalculator.html'
        })

        .state('img', {
            url: '/img?path',
            templateUrl: 'views/img.html'
        })
        .state('calendar', {
            url: '/calendar',
            templateUrl: 'views/calendar.html'
        })
        .state('app.Business management', {
            url: '/Business management',
            templateUrl: 'views/Business management.html'
        })
    $cookiesProvider.defaults.path = '/';
}]);

hpxAdminApp.run(function ($rootScope, $templateCache) {
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        if (typeof (current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    });
});

hpxAdminApp.run(function ($rootScope, $state, API_URL, Restangular, $cookieStore) {
    Restangular.setBaseUrl(API_URL);
    $rootScope.identity = $cookieStore.get('customer');

    var token = '';
    if ($rootScope.identity) {
        token = $rootScope.identity.token;
        Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + token });
    }

    Restangular.setRequestInterceptor(function (elem, operation, what) {
        if (!$rootScope.proc) {
            $rootScope.proc = 1;
        }
        else {
            $rootScope.proc++;
        }
        $rootScope.loading = true;

        return elem;
    });
    Restangular.setResponseInterceptor(function (data, operation, what, url, response, deferred) {
        $rootScope.proc--;
        if ($rootScope.proc <= 0) {
            $rootScope.proc = 0;
            $rootScope.loading = false;
        }

        if (data.meta.code == 411) {
            deferred.reject(data);
            $rootScope.identity = null;
            $cookieStore.put('customer', null);
            window.location.href = '/index.aspx';
        }
        else if (data.meta.code >= 300) {
            deferred.reject(data);
            swal(data.meta.message);
        }
        else {
            return data.data;
        }
    });

    Restangular.setErrorInterceptor(function (resp) {
        $rootScope.proc--;
        if ($rootScope.proc <= 0) {
            $rootScope.proc = 0;
            $rootScope.loading = false;
        }
        if (resp.status == 401) {
            window.location.href = '/index.aspx';
        }
        else {
            if (resp.data && resp.data.meta) {
                swal(resp.data.meta.message + "(" + resp.data.meta.code + ")");
            }
            else {
                swal("未知错误! " + resp.status);
            }

            return false;
        }
    });
});

hpxAdminApp.run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});

// set moment to zh-cn
moment.locale('zh-cn');


hpxAdminApp.filter("getEndorsementURL", function () {
    return function (input) {
        if (typeof input =="undefined") return "";
        if (input.length > 0) {
            var url = input.split(".");
            url[url.length - 2] = url[url.length - 2] + "-1";
            return url.join(".");
        }
        return "";
    }
});

hpxAdminApp.filter("addTimestamp", function () {
    return function (input) {
        if (typeof input == "undefined") return "";
        if (input.length > 0) {
            return input + "?" + new Date().getTime();
        }
        return "";
    }
});