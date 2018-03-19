hpxAdminApp.controller('accountInfoController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, customerService, orderService, billService) {
    $scope.filter = {
        count:0,
    }
    //��ȡ�����еĳ�Ʊ��������
    orderService.getOrderRunning('drawer').then(function (data) {
        if (data == undefined) {
            $scope.drawerCount = 0;
        } else {
            $scope.drawerCount = data;
        }
    });
    //��ȡ�����еĶ�Ʊ��������
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



});
