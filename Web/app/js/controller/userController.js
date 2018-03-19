ionicApp.controller('userController', function ($scope, $rootScope, $state, customerService, appHomeService, $ionicModal, $ionicPopup) {
    $scope.isSignIn = false;
    $scope.customerInfo = {
        /*id:1,
        enterprise_name:1,
        platform_balance:1,
        phone_number:1,
        customer_name:1,
        mission_number:1,
        publish_active_number:1,
        bid_active_number:1,
        notification_number:1,*/
    }
    $scope.alertOnlineService = false;
    /*customerService.getCustomer().then(function (data) {
        if (data != null) {
            $scope.isSignIn = true;
        }
        $scope.customerInfo.phone_number = data.phone_number;
    });*/
    if ($rootScope.identity) {
        appHomeService.getAppHome().then(function (data) {
            if (data != null) {
                $scope.isSignIn = true;
                $scope.customerInfo = data;
            }
        });
    }
    $scope.alertOnline = function () {
        $scope.alertOnlineService = true;
        alert($scope.alertOnlineService)
    }
    //(function (a, h, c, b, f, g) { a["UdeskApiObject"] = f; a[f] = a[f] || function () { (a[f].d = a[f].d || []).push(arguments) }; g = h.createElement(c); g.async = 1; g.src = b; c = h.getElementsByTagName(c)[0]; c.parentNode.insertBefore(g, c) })(window, document, "script", "http://assets-cli.huipiaoxian.udesk.cn/im_client/js/udeskApi.js?1484906754367", "ud");

    //ud({
    //    "code": "19hb4g1h",
    //    "link": "http://www.huipiaoxian.udesk.cn/im_client?web_plugin_id=23504",
    //    "targetSelector": "#online-service",
    //    "mobile": {
    //        "mode": "inner",
    //        "color": "#307AE8",
    //        "pos_flag": "srm",
    //        "onlineText": "联系客服，在线咨询",
    //        "offlineText": "客服下班，请留言",
    //        "pop": {
    //            "direction": "top",
    //            "arrow": {
    //                "top": 0,
    //                "left": "70%"
    //            }
    //        }
    //    }
    //});
    $scope.openService = function () {
        $scope.alertOnlineService = true;
    }
    $scope.closeService = function () {
        $scope.alertOnlineService = false;
    }
    $scope.onlineService = function () {
        $ionicPopup.alert({
            title: "通知",
            template: "暂不支持！",
            okType: "button-assertive",
        });
    }
})