hpxAdminApp.controller('imgController', function ($rootScope, $scope, $state, $stateParams) {
    $scope.path = decodeURI($stateParams.path);
});
