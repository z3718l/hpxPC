hpxAdminApp.controller('portalInformationTypeController', function ($scope, $rootScope, $state, NgTableParams, portalInformationTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            return portalInformationTypeService.query(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //$scope.tableParams = new NgTableParams({}, {
    //    getData: function () {
    //        return portalInformationTypeService.queryByInformationTypeId().then(function (data) {
    //            $scope.first = $scope.getFirst();
    //            return data;
    //        });
    //    }
    //});

    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
        $('#modal-edit').draggable();
    };
  

    $scope.save = function () {
        if ($scope.model.id == null) {
            portalInformationTypeService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            portalInformationTypeService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.information_type_name + ' 吗？ ')) {
            portalInformationTypeService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});