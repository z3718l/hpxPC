hpxAdminApp.controller('readOfferController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService) {
    //����id��ȡ������ϸ��Ϣ
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
            try {
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
            catch (e) {
            }
        });
    }
});
