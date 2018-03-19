hpxAdminApp.controller('informationController', function ($rootScope, $scope, $state, $stateParams, $sce, portalService) {
    //获取指定id的发布信息
    portalService.getInformation($stateParams.id).then(function (data) {
        $scope.model = data;
        $scope.detail = $sce.trustAsHtml(data.detail);
    });
});
