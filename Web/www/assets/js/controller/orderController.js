hpxAdminApp.controller('orderController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        status: 808,
    };

    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })

    //获取已签收808的需要打款的订单
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return orderService.query(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        if($scope.filter.isPaid == 0){
            $scope.filter.status=808;
            $scope.filter.orderPayTypeId=null;
            $scope.filter.func=null;
        }else{
            $scope.filter.status=null;
            $scope.filter.orderPayTypeId='1202';
            $scope.filter.func='paid';
        }
        $scope.tableParams.reload();
    }

    $scope.check = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();
    };

    $scope.save = function () {
    //调用宝付代付接口
    payService.payDrawer($scope.model.id, $scope.model.pay_to_drawer_info).then(function (data) {
            $scope.tableParams.reload();
            $scope.checkForm.$setPristine();
            $('#modal-check').modal('hide');
        });
    };

});