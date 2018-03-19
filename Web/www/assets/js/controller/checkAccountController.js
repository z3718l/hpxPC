hpxAdminApp.controller('checkAccountController', function ($interval,$rootScope, $scope, $state, API_URL, NgTableParams, billService, constantsService, addressService, customerService) {
    $scope.filter = {
        'checkedType': 0,   //默认未审核
    };
    //获取未审核或已审核的银行账户信息数据
    $scope.tableParams = new NgTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return customerService.query(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    }); 

    //点击跳转到新页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //定时两分钟刷新
    var timer = $interval($scope.reflash, 60*1000);
    //页面销毁时 取消 不然会一直刷新
    $scope.$on(
        "$destroy",
        function( event ) {
            $interval.cancel( timer );
        }
    );
    //获取某条详细信息，弹出审核窗口
    $scope.check = function (item) {
        $scope.model = item;
        $('#modal-check').modal('show');
    };
    //银行账户认证
    //$scope.approve = function (item) {
    //    customerService.ReviewEnterPriseAccount(item.id, { 'verify_string': 'infogate' }).then(function (data) {
    //        $scope.tableParams.reload();
    //    });
    //};
    //审核通过
    $scope.pass = function () {
        if (confirm('确认通过吗？')) {
            if (!$scope.model.check_description) {
                $scope.model.check_description = "审核通过";
            }
            customerService.checkAccount($scope.model.id,{ 'is_verified': 1, 'description': $scope.model.check_description }).then(function (data) {
                $scope.tableParams.reload();
                $scope.checkForm.$setPristine();
                $('#modal-check').modal('hide');
            });
        }
    };
    //审核不通过
    $scope.reject = function () {
        if (!$scope.model.check_description || $scope.model.check_description.length == 0) {
            alert('请填写不通过原因！');
            return;
        }

        if (confirm('确认不通过吗？')) {
            customerService.checkAccount($scope.model.id,{ 'is_verified': -1, 'description': $scope.model.check_description }).then(function (data) {
                $scope.tableParams.reload();
                $scope.checkForm.$setPristine();
                $('#modal-check').modal('hide');
            });
        }
    };

});
