hpxAdminApp.controller('accountInfoController', function ($scope, $rootScope, $state, ngTableParams, Upload, FILE_URL, $timeout, customerService, orderService, billService, notisService, messageService, payingService) {
    $scope.filter = {
        isRead: 0,
        is_agentChecked: 3,
    };
    $scope.ReceveiverNumber = {
        all_ele_bid_running_order_number: 0,
        all_paper_bid_running_number: 0,
    };
    $scope.DrawerNumber = {
        all_ele_bid_running_order_number: 0,
        all_paper_bid_running_number: 0,
    }
    //获取进行中的出票订单数量
    $scope.messagek = function () {
        $state.go('app.main.messageCenter')
    }

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
    billService.getOwnBidding().then(function (data) {
        for (var i = 0, n = data.length; i < n; i++) {
            if (data[i].bid_result == 1) {
                $scope.filter.count++;
            }
        }
    });
    init = function () {
        //if ($rootScope.identity.is_verified == 0) {
        customerService.getCustomer().then(function (data) {
                $scope.Hcustomer = data;
            })
        //}
        billService.getBillsNumber(101).then(function (data) {
            $scope.eleNumber = data;
        })
        billService.getBillsNumber(102).then(function (data) {
            $scope.paperNumber = data;
        })
        
        if ($rootScope.identity.is_verified == 2 || $rootScope.identity.is_verified == 3) {
            payingService.getAgentTreasurer($rootScope.identity.enterprise_id).then(function (result) {
                $scope.agentModel = result;
                $timeout(function () {
                    if ($scope.agentModel.isChecked == 0) {
                        $scope.filter.is_agentChecked = 1;
                    } else if ($scope.agentModel.isChecked == -1) {
                        $scope.filter.is_agentChecked = 2;
                    } else if ($scope.agentModel.isChecked == 1) {
                        $scope.filter.is_agentChecked = 3;
                    } else {
                        $scope.filter.is_agentChecked = 0;
                    }
                }, 250);
            });
        }
    };
    init();
    //获取所有的银行账户信息，并显示是否为默认银行账户
    customerService.getAllEnterpriseAccount().then(function (data) {
        $scope.AccountData = data;
    });

    //获取未读消息
    phxM = function () {
       messageService.getMessage().then(function (data) {
           $scope.pagemessage = data.page_info.items_number;
       })
    }
    phxM();

    //生成数组
    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }


});
