hpxAdminApp.controller('informationListController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, portalService) {
    //获取发布信息类型
    portalService.getInformationType($stateParams.type).then(function (data) {
        $scope.typeName = data.information_type_name;
    });
    //获取所有发布信息
    portalService.queryInformation($stateParams.type).then(function (data) {
        $scope.informations = data;
    });
});
