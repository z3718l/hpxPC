hpxAdminApp.controller('informationListController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, portalService) {
    //��ȡ������Ϣ����
    portalService.getInformationType($stateParams.type).then(function (data) {
        $scope.typeName = data.information_type_name;
    });
    //��ȡ���з�����Ϣ
    portalService.queryInformation($stateParams.type).then(function (data) {
        $scope.informations = data;
    });
});
