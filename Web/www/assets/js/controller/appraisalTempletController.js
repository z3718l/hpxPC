hpxAdminApp.controller('appraisalTempletController',function ($scope, $rootScope, $state, API_URL, NgTableParams,appraisalTempletService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            var type = "";
            if(angular.isDefined($scope.filter)){
                type = $scope.filter.starType;
            }
            return appraisalTempletService.query(params,type ).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

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
            appraisalTempletService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改常量类型信息
            appraisalTempletService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除
    $scope.remove = function (data) {
        if (confirm('确定要删除此模板吗?')) {
            appraisalTempletService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});