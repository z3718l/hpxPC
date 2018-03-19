// JavaScript source code
hpxAdminApp.controller('resourceInfoController', function ($scope, $rootScope, $state, NgTableParams, resourceService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    
    $scope.filter = {};
    //获取所有可管理的资源信息
    $scope.tableParams = new NgTableParams({ sorting: { 'resource_name': 'asc' } }, {
        getData: function (params) {
            return resourceService.query(params).then(function (data) {
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
        //$scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.id) {         //新建某一资源
            resourceService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //修改某一资源
            resourceService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //重置密码
    $scope.resetPassword = function () {
        if (confirm('确定要重置密码吗？')) {
            resourceService.resetPassword($scope.model.id).then(function (data) {
                alert("已被重置为初始密码");
            });
        }
    };
    //删除某一资源
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.username + '吗')) {
            resourceService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
})