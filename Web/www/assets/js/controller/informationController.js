hpxAdminApp.controller('informationController', function ($rootScope, $scope, $state, $stateParams, $sce, portalService) {
    //��ȡָ��id�ķ�����Ϣ
    portalService.getInformation($stateParams.id).then(function (data) {
        $scope.model = data;
        $scope.detail = $sce.trustAsHtml(data.detail);
    });
});
