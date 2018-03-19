var hpxAdminApp = angular.module('hpxAdminApp', [
    'ui.router',
    'ui.calendar',
    'ui.bootstrap',
    'oc.lazyLoad',
    'ngTable',
    'ngFileUpload',
    'restangular',
    'LocalStorageModule',
    'ngAnimate'
]);

hpxAdminApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

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
            templateUrl: 'views/queryBill.html'
        })
        .state('app.free.readBill', {
            url: '/readBill?id',
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
        .state('app.main.publish', {
            url: '/publish?id',
            data: { pageTitle: '发布汇票' },
            templateUrl: 'views/publish.html'
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
        .state('app.main.portalSuggestion', {
            url: '/portalSuggestion',
            data: { pageTitle: '投诉建议' },
            templateUrl: 'views/portalSuggestion.html'
        })
        .state('img', {
            url: '/img?path',
            templateUrl: 'views/img.html'
        })
        .state('calendar', {
            url: '/calendar',
            templateUrl: 'views/calendar.html'
        })
}]);

hpxAdminApp.run(function ($rootScope, $templateCache) {
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        if (typeof (current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    });
});

hpxAdminApp.run(function ($rootScope, $state, API_URL, Restangular, localStorageService) {
    Restangular.setBaseUrl(API_URL);

    $rootScope.identity = localStorageService.get('customer');
    var token = '';
    if ($rootScope.identity != undefined) {
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
            localStorageService.set('customer', null);
            //alert('请先登录！');
            $state.go('home');
        }
        else if (data.meta.code >= 300) {
            deferred.reject(data);
            alert(data.meta.message);
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
            $state.go('home');
        }
        else {
            if (resp.data && resp.data.meta) {
                alert(resp.data.meta.message + "(" + resp.data.meta.code + ")");
            }
            else {
                alert("未知错误! " + resp.status);
            }

            return false;
        }
    });
});

hpxAdminApp.run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});