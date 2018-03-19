hpxAdminApp.controller('accountInfoController', function ($scope, $rootScope, $state, ngTableParams, Upload, FILE_URL, $timeout, customerService, orderService, billService) {
    $scope.filter = {
        count:0,
    }
    //获取进行中的出票订单数量
    orderService.getOrderRunning('drawer').then(function (data) {
        if (data == undefined) {
            $scope.drawerCount = 0;
        } else {
            $scope.drawerCount = data;
        }
    });
    //获取进行中的订票订单数量
    orderService.getOrderRunning('receiver').then(function (data) {
        if (data == undefined) {
            $scope.receiverCount = 0;
        } else {
            $scope.receiverCount = data;
        }
    });
    //var count = 0;
    billService.getOwnBidding().then(function (data) {
        //return data;
        for (var i = 0, n = data.length; i < n; i++) {
            if (data[i].bid_result == 1) {
                $scope.filter.count++;
            }
        }
    });
    if ($rootScope.identity.is_verified == 0) {
        customerService.getCustomer().then(function (data) {
            $scope.customer = data;
        })
    }
    //获取所有的银行账户信息，并显示是否为默认银行账户
    customerService.getAllEnterpriseAccount().then(function (data) {
        $scope.AccountData = data;
    });
    //生成数组
    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }



});
