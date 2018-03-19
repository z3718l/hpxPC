hpxAdminApp.controller('orderReceiverInfoController', function ($rootScope, $scope, $timeout, $state, $stateParams, API_URL, ngTableParams, orderService, customerService, payingService, constantsService) {

    //获取收票订单详情
    init = function () {
        orderService.getOrder($stateParams.id).then(function (data) {
            $scope.model = data;
            $timeout(function () {
                $('.jqzoom').imagezoom();
            });
        });
    }
    init();
    //图片放大镜功能
    if ($stateParams.id) {
        $('.jqzoom').imagezoom();
    }
    //获取背书账号
    customerService.getAllEnterpriseAccount(502).then(function (data) {
        $scope.accounts = data;
        $scope.addressModel = {};
        $scope.addressModel.receiver_account_id = data[0].id;
    })
    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })

    //获取企业对应的收货地址信息
    customerService.getAllCustomerAddress().then(function (data) {
        $scope.addresses = data;
    })
    //支付手续费
    $scope.payCommission = function () {
        if (confirm('确定要支付手续费吗？')) {
            orderService.orderPayCommission($scope.model.id).then(function () {
                payingService.GetPlatformAccount().then(function (data) {
                    $scope.PlatformData = data;
                })
                if ($scope.PlatformData.platform_account_balance > $scope.model.receiver_commission) {
                    alert('手续费支付成功！');
                } else {
                    alert('账户余额不足！请充值！');
                }

                init();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //弹出付款窗口
    $scope.showPay = function () {
        $('#modal-address').modal('show');
    };
    //支付票据款
    $scope.pay = function () {
        if (confirm('确定要支付票据款吗？')) {
            orderService.updateOrderReceiver($scope.model.id, $scope.addressModel).then(function () {
                window.open(API_URL + '/orders/orderPay/' + $scope.model.id.toString() + '?orderPayTypeId=' + $scope.addressModel.order_pay_type_id.toString());
                $('#modal-address').modal('hide');
            });
        }
    };
    //签收背书
    $scope.confirm = function () {
        if (confirm('确认签收背书并完成交易吗？')) {
            orderService.orderConfirm($scope.model.id).then(function () {
                alert('背书签收完成！');

                init();
                $('#modal-edit').modal('hide');
            });
        }
    };
});
