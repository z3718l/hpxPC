hpxAdminApp.controller('constantsController', function ($scope, $rootScope, $state, API_URL, NgTableParams, constantsService, constantsTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };

    //constantsService.queryAll().then(function (data) {
    //    $scope.constantsData = data.constants;
    //    $scope.filterTypeChange();
    //});
    //$scope.filterTypeChange = function () {
    //    if ($scope.filter.constant_type_id == null) {
    //        $scope.filterConstants = [];
    //    }
    //    else {
    //        constantsService.queryByConstantTypeID($scope.filter.constant_type_id).then(function (data) {
    //            $scope.filterConstants = data;
    //        });
    //    }
    //};

    //获取所有的常量类型的对应常量（即是获取所有的常量）
    constantsTypeService.queryByConstantTypeID($scope.filter.constantTypeId).then(function (data) {
        $scope.constantsTypes = data;
    }); 
    //constantsTypeService.queryAll().then(function (data) {
    //    $scope.constantsTypes = data.constant_types;
    //});

    //获取对应的常量类型的所有常量信息
    $scope.tableParams = new NgTableParams({ sorting: { 'code': 'asc' } }, {
        getData: function (params) {
            return constantsService.query(params, $scope.filter.constantTypeId, $scope.filter.keyword).then(function (data) {
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
        if (data == null) {         //弹出新建常量窗口
            $scope.model = newEntity;
            $scope.model.constant_type_id = $scope.filter.constantTypeId;
        }
        else {          //弹出修改常量窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {          //新建对应常量类型的常量
            constantsService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改对应常量类型的常量
            constantsService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除对应常量类型的常量
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.constant_name + ' 吗？')) {
            constantsService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});