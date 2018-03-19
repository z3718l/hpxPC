hpxAdminApp.controller('portalInformationController', function ($scope, $rootScope, $state, $window, API_URL, NgTableParams, portalInformationService, portalInformationTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    portalInformationTypeService.queryByInformationTypeID($scope.filter.information_type_id).then(function (data) {
        $scope.informationTypes = data;
    });

    //portalInformationService.queryByPublishingTime($scope.filter.publishing_time).then(function (data) {
    //    $scope.information = data;
    //});

    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {

            return portalInformationService.query(params, $scope.filter.keyword, $scope.filter.informationTypeId, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    $scope.reflash = function () {
        $scope.filter.publishingTimeS = document.getElementById("publishingTimeS").value;
        $scope.filter.publishingTimeB = document.getElementById("publishingTimeB").value;
        $scope.tableParams.reload();
    }

    //$scope.add = function () {
    //    window.location.href = "/www/index.html#/app/portalInformation/test";
    //}
    $scope.edit = function (item) {
        if (item == null) {
            $scope.model = newEntity;
        }
        else {
            portalInformationService.get(item.id).then(function (data) {
                $scope.model = data;
            });
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {
            portalInformationService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            portalInformationService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }

    };

    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + '【' + data.information_type_name + '】' + data.title + ' 吗？ ')) {
            portalInformationService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

});