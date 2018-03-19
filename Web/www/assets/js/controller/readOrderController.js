hpxAdminApp.controller('readOrderController', function ($rootScope, $stateParams, $scope, $state, API_URL, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};

    if ($stateParams.id != 0) {
        orderService.getOrder($stateParams.id).then(function (data) {
            $scope.model = data;
        });
    };

});
