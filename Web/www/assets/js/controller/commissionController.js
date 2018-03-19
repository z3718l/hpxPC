hpxAdminApp.controller('commissionController', function ($rootScope, $scope, $stateParams, $state, API_URL, NgTableParams, commissionService) {
    $scope.filter = {};
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    //初始化列表
    $scope.tableParams = new NgTableParams({ sorting: { 'enterprise_id': 'asc' } }, {
        getData: function (params) {
            return commissionService.query(params,$scope.filter.enterpriseName).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    $scope.refresh = function () {
        $scope.tableParams.reload();
    };

    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        commissionService.update($scope.model).then(function () {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    };
});
