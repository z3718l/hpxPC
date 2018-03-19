hpxAdminApp.controller('portalInfoController', function ($scope, $rootScope, $state, NgTableParams, portalInformationService) {
    var information_type_id = 1

    //获取主页内容信息
    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            return portalInformationService.query(params, null, information_type_id, null, null).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //编辑主页内容某一栏目信息
    $scope.edit = function (item) {
        portalInformationService.get(item.id).then(function (data) {
            $scope.model = data;
        });
        $('#modal-edit').modal('show');
    };
    //更新主页内容某一栏目信息
    $scope.save = function () {
        portalInformationService.update($scope.model).then(function (data) {
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    };
});