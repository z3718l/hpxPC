hpxAdminApp.controller('customerLevelController', function ($scope, $rootScope, $state, NgTableParams, customerLevelService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有的客户级别信息
    customerLevelService.queryAll().then(function (data) {
        $scope.customerLevel = data.customer_levels;
    });
    //获取客户级别的所有数据
    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            //customerLevelService.queryAll().then(function (data) {
            //    $scope.customerLevel = data.customer_levels;
            //});
            return customerLevelService.query(params, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    
    $scope.edit = function (data) {
        if (data == null) {         //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {          //新建客户级别信息
            customerLevelService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改客户级别信息
            customerLevelService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除某条客户级别信息
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.customer_level_name + ' 吗？')) {
            customerLevelService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});
