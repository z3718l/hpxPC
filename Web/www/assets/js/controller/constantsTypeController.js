hpxAdminApp.controller('constantsTypeController', function ($scope, $rootScope, $state, NgTableParams, constantsTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    //constantsTypeService.queryAll().then(function (data) {
    //    $scope.constantsTypes = data.constant_types;
    //});

    //获取所有的常量类型
    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            return constantsTypeService.query(params, $scope.filter.keyword).then(function (data) {
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
        if ($scope.model.id == null) {          //新建常量类型
            constantsTypeService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine(); 
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改常量类型信息
            constantsTypeService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除某条常量类型信息
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.constant_type_name + ' 吗？ ')) {
            constantsTypeService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});