/// <reference path="controller/accountBind.js" />
/// <reference path="controller/signupController.js" />
var ionicApp = angular.module('hpx', [
    'ionic',
    'ngCordova',
    'restangular',
    'LocalStorageModule'
]);

ionicApp.run(function (JPUSH, $ionicPlatform, $rootScope, $ionicConfig, $timeout, localStorageService) {
    $ionicPlatform.on("deviceready", function () {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }

        //启动极光推送服务
        if (JPUSH) {
            window.plugins.jPushPlugin.init();
        }
    });

    $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
    });
})

ionicApp.run(function ($rootScope, $state, API_URL, $ionicLoading, $ionicPopup, Restangular, localStorageService) {
    $rootScope.$state = $state;

    Restangular.setBaseUrl(API_URL);


    //加入请求头
    $rootScope.identity = localStorageService.get('customer');
    var token = '';
    if ($rootScope.identity) {
        token = $rootScope.identity.token;
        Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + token });
    }

    Restangular.setRequestInterceptor(function (elem, operation, what) {
        $ionicLoading.show({ template: '加载中...' });
        return elem;
    });
    Restangular.setResponseInterceptor(function (data, operation, what, url, response, deferred) {
        $ionicLoading.hide();

        if (data.meta.code == 411) {
            deferred.reject(data);
            $rootScope.identity = null;
            localStorageService.set('customer', null);
            $state.go('app.home');
        }
        else if (data.meta.code >= 300) {
            deferred.reject(data);
            $ionicPopup.alert({
                title: data.meta.message,
                okText: '确定',
                okType: 'button-assertive',
            });
        }
        else {
            return data.data;
        }
    });
    Restangular.setErrorInterceptor(function (resp) {
        $ionicLoading.hide();
        if (resp.status == 401) {
            $state.go('app.home');
        }
        else if (resp.status == 0) {
            $ionicPopup.alert({
                title: '请检查网络连接！',
                okText: '确定',
                okType: 'button-assertive',
            });
        }
        else {
            if (resp.data != null && resp.data.Message != null) {
                $ionicPopup.alert({
                    title: resp.data.Message,
                    okText: '确定',
                    okType: 'button-assertive',
                });
            }
            else {
                $ionicPopup.alert({
                    title: "未知错误 " + resp.status,
                    okText: '确定',
                    okType: 'button-assertive',
                });
            }

            return false;
        }
    });
});

ionicApp.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $urlRouterProvider.otherwise('app/home');

    $stateProvider
    .state('tour', {
        url: "/tour",
        templateUrl: "views/tour.html",
        controller: 'tourController'
    })
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "views/app/app.html",
        controller: 'appController'
    })
    .state('app.test', {
        url: '/test',
        templateUrl: 'views/app/test.html',
        controller: 'testController'
    })
    .state('app.home', {
        url: "/home",
        templateUrl: "views/app/home.html",
        controller: 'homeController'
    })
    .state('app.signup', {
        url: "/signup",
        templateUrl: "views/app/register.html",
        controller: 'signupController'
    })
    .state('app.signin', {
        url: "/signin",
        templateUrl:"views/app/login.html",
        controller:"signinController"
    })
    .state('app.signinEnterprise', {
        url: "/signinEnterprise",
        templateUrl: "views/app/loginEnterprise.html",
        controller: "signinEnterpriseController"
    })
    .state('app.forgetPassword', {
        url: "/forgetPassword",
        templateUrl: "views/app/forgetPassword.html",
        controller: "forgetPasswordController"
    })
    .state('app.billQuery', {
        url: "/billQuery",
        templateUrl: "views/app/billQuery.html",
        controller: 'billQueryController'
    })
    .state('app.user', {
        url: "/user",
        templateUrl: "views/app/user.html",
        controller: 'userController'
    })
    .state('app.setting', {
        url: "/setting",
        templateUrl: "views/app/setting.html",
        controller: 'setController'
    })
    .state('app.userInfo', {
        url: "/userInfo",
        templateUrl: "views/app/userInfo.html",
        controller: 'userInfoController'
    })
    .state('app.recharge', {
        url: "/recharge",
        templateUrl: "views/app/recharge.html",
        controller: 'rechargeController'
    })
    .state('app.myReleaseElecAll', {
        url: "/myReleaseElecAll",
        templateUrl: "views/app/myReleaseElecAll.html",
        controller: 'myReleaseElecAllController'
    })
    .state('app.myBidding', {
        url: "/myBidding",
        templateUrl: "views/app/myBidding.html",
        controller: 'myBiddingController'
    })
    .state('app.myTask', {
        url: "/myTask",
        templateUrl: "views/app/myTask.html",
        controller: 'myTaskController'
    })
    .state('app.accredit', {
        url: "/accredit",
        templateUrl: "views/app/accredit.html",
        controller: 'accreditController'//机构认证
    })
    .state('app.accountBind', {
        url: "/accountBind",
        templateUrl: "views/app/accountBind.html",
        controller: 'accountBindController'
    })
    .state('app.security', {
        url: "/security",
        templateUrl: "views/app/security.html",
        controller: 'securityController'
    })
    .state('app.message', {
        url: "/message",
        templateUrl: "views/app/message.html",
        controller: 'messageController'
    })
    .state('app.follow', {
        url: "/follow",
        templateUrl: "views/app/follow.html",
        controller: 'followController'
    })
    .state('app.billOffer', {
        url: "/billOffer",
        templateUrl: "views/app/billOffer.html",
        controller: 'billOfferController'
    })
    .state('app.receiveBill', {
        url: "/receiveBill",
        templateUrl: "views/app/receiveBill.html",
        controller: 'receiveBillController'
    })
   .state('app.receiveBillResult', {
       url: "/receiveBillResult",
       templateUrl: "views/app/receiveBillResult.html",
       controller: 'receiveBillResultController'
   })
    .state('app.drawBill', {
        url: "/drawBill?id&bidId&accountId",
        templateUrl: "views/app/drawBill.html",
        controller: 'drawBillController'
    })
    .state('app.newBillOffer', {
        url: "/:newBillOffer?id",
        templateUrl: "views/app/newBillOffer.html",
        controller: 'newBillOfferController'
    })
    .state('app.addAccount', {
        url: "/addAccount",
        templateUrl: "views/app/addAccount.html",
        controller: 'addAccountController'
    })
    .state('app.modifyPhone', {
        url: "/modifyPhone",
        templateUrl: "views/app/modifyPhone.html",
        controller: 'modifyPhoneController'
    })
    .state('app.modifyPass', {
        url: "/modifyPass",
        templateUrl: "views/app/modifyPass.html",
        controller: 'modifyPassController'
    })
    .state('app.smearBill', {
        url: "/smearBill",
        templateUrl: "views/app/smearBill.html",
        controller: 'smearBillController'
    })
    .state('app.businessQuery', {
        url: "/businessQuery",
        templateUrl: "views/app/businessQuery.html",
        controller: 'businessQueryController'
    })
     .state('app.jobQuery', {
         url: "/jobQuery",
         templateUrl: "views/app/jobQuery.html",
         controller: 'jobQueryController'
     })
     .state('app.calendar', {
         url: "/calendar",
         templateUrl: "views/app/calendar.html",
         controller: 'calendarController'
     })
     .state('app.bankQuery', {
         url: "/bankQuery",
         templateUrl: "views/app/bankQuery.html",
         controller: 'bankQueryController'
     })
     .state('app.calculator', {
         url: "/calculator",
         templateUrl: "views/app/calculator.html",
         controller: 'calculatorController'
     })
    .state('app.guide', {
        url: "/guide",
        templateUrl: "views/app/guide.html"
    })
    .state('app.agreement', {
        url: "/agreement",
        templateUrl: "views/app/agreement.html"
    })
    .state('app.about', {
        url: "/about",
        templateUrl: "views/app/about.html"
    })
    .state('app.photoTest', {
        url: "/photoTest",
        templateUrl: "views/app/photoTest.html",
        controller: 'photoTestController'
    })
    .state('app.rechargerecord', {
        url: "/rechargerecord",
        templateUrl: "views/app/rechargerecord.html",
        controller: 'rechargerecordController'
    })
    .state('app.billOfferDetail', {
        url: "/billOfferDetail",
        templateUrl: "views/app/billOfferDetail.html",
        controller: 'billOfferDetailController'
    })
    .state('app.billDetail', {
        url: "/billDetail",
        templateUrl: "views/app/billDetail.html",
        controller: 'billDetailController'
    })
    .state('app.myReleaseDetail', {
        url: "/:myReleaseDetail?myReleaseBillId&myReleaseOrderId&check",
        templateUrl: "views/app/myReleaseDetail.html",
        controller: 'myReleaseDetailController'
    })
    .state('app.transactionDetail', {
        url: "/transactionDetail",
        templateUrl: "views/app/transactionDetail.html",
        controller: 'transactionDetailController'
    })
    .state('app.rechargePay', {
        url: "/rechargePay",
        templateUrl: "views/app/rechargePay.html",
        controller: 'rechargePayController'
    })
    .state('app.billOfferQuery', {
        url: "/billOfferQuery",
        templateUrl: "views/app/billOfferQuery.html",
        controller: 'billOfferQueryController'
    })
    .state('app.billSearchCity', {
        url: "/billSearchCity",
        templateUrl: "views/app/billSearchCity.html",
        controller: 'billSearchCityController'
    })
    .state('app.billOfferSearchCity', {
        url:"/billOfferSearchCity",
        templateUrl:"views/app/billOfferSearchCity.html",
        controller:'billOfferSearchCityController'
    })
    //.state('app.evaluate', {
    //    url:"/evaluate",
    //    templateUrl: "views/app/evaluate.html",
    //    controller: 'evaluateCityController'
    //})
    .state('app.messageDetail', {
        url: '/:messageDetail?notificationId&check',
        templateUrl: 'views/app/messageDetail.html',
        controller: 'messageDetailController'
    })
    .state('app.authorizate', {
        url: '/authorizate',
        templateUrl: 'views/app/authorizate.html',
        controller: 'authorizateController'
    })
});