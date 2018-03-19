hpxAdminApp.controller('orderWaitController', function ($rootScope, $scope, $stateParams, $state, ngTableParams, billService, constantsService, orderService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
    };
    //获取支付方式类型
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.payTypes = data;
    })

   //获取账户所有的待确认订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return billService.getOrderWait(params).then(function (data) {
               // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取对应id的待确认交易的票据详情，弹出窗口
    $scope.edit = function (item) {
        $scope.model = item;

        $('#modal-edit').modal('show');
        $('.jqzoom').imagezoom();
    };

    //$scope.showFront = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    //}
    //$scope.showBack = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    //}
    //选择支付方式，确认交易
    $scope.confirm = function () {
        if (!$scope.model.order_pay_type_id) {
            alert("请选择支付方式！")
        }
        else if (confirm('确认该交易吗？')) {
            billService.confirmOrderWait($scope.model.id, { 'is_confirm': 1, 'order_pay_type_id': $scope.model.order_pay_type_id }).then(function (data) {
                alert('确认交易成功！');

                $scope.tableParams.reload();
                $('#modal-edit').modal('hide');
                $('#modal-appraisal').modal('show');
            });
        }
    };
    //提交评价
    $scope.submit = function () {
        if (confirm('确认提交该评价吗？')) {
            orderService.orderAppraisal($scope.model.id, { 'appraisal_message': $scope.model.appraisal_message }).then(function (data) {
                alert('确认评价成功！');

                $scope.tableParams.reload();
                $('#modal-appraisal').modal('hide');
            });
        }
    };
    //拒绝交易
    $scope.reject = function () {
        if (confirm('拒绝该交易吗？')) {
            billService.confirmOrderWait($scope.model.id, { 'is_confirm': 0 }).then(function (data) {
                alert('拒绝交易成功！');

                $scope.tableParams.reload();
                $('#modal-edit').modal('hide');
            });
        }
    };
});
