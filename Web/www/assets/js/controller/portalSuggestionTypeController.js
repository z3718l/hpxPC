// JavaScript source code
hpxAdminApp.controller('portalSuggestionTypeController', function ($scope, $rootScope, $state, NgTableParams, portalSuggestionTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};

    
    $scope.tableParams = new NgTableParams({ sorting: { 'username': 'asc' } }, {
        getData: function (params) {
            portalSuggestionTypeService.queryAll().then(function (data) {
                $scope.portal_suggestion_types = data.portal_suggestion_types;
            });
            //if ($scope.filter.keyword != null) {

            //  return portalSuggestionTypeService.queryKey($scope.filter.keyword).then(function (data) {
            //      $scope.first = $scope.getFirst(params);
            //      return data;
            //  });

            //}
        }
    });




    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //$scope.edit = function (data) {
    //    if (data == null) {
    //        $scope.model = newEntity;
    //    }
    //    else {
    //        $scope.model = angular.copy(data);
    //    }
    //    //$scope.roleChange();
    //    $('#modal-edit').modal('show');
    //};

    //$scope.save = function () {
    //    if (!$scope.model.id) {
    //        portalSuggestionTypeService.add($scope.model).then(function (data) {
    //            $scope.tableParams.reload();
    //            angular.copy(emptyEntity, newEntity);
    //            $scope.editForm.$setPristine();
    //            $('#modal-edit').modal('hide');
    //        });
    //    }
    //    else {
    //        portalSuggestionTypeService.update($scope.model).then(function (data) {
    //            $scope.tableParams.reload();
    //            $scope.editForm.$setPristine();
    //            $('#modal-edit').modal('hide');
    //        });
    //    }
    //};

    ////$scope.resetPassword = function () {
    ////    if (confirm('确定要重置密码吗？')) {
    ////        portalSuggestionTypeService.resetPassword($scope.model.id).then(function (data) {
    ////            alert("已被重置为初始密码");
    ////        });
    ////    }
    ////};
    //$scope.remove = function (data) {
    //    if (confirm('确定要删除' + data.username + '吗')) {
    //        portalSuggestionTypeService.remove(data.id).then(function (data) {
    //            $scope.tableParams.reload();
    //        });
    //    }
    //};
})