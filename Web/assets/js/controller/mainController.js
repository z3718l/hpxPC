hpxAdminApp.controller('mainController', function ($rootScope, $scope, $state, $timeout, customerService, localStorageService) {
    customerService.testLogin().then(function (data) {
        $rootScope.identity.can_publish = data.can_publish;
        $rootScope.identity.can_receive = data.can_receive;
        $rootScope.identity.can_bid_paper_bill = data.can_bid_paper_bill;
        $rootScope.identity.can_bid_electronic_bill = data.can_bid_electronic_bill;
        $rootScope.identity.can_sell_paper_bill = data.can_sell_paper_bill;
        $rootScope.identity.can_sell_electronic_bill = data.can_sell_electronic_bill;
        $rootScope.identity.can_see_bill_detail = data.can_see_bill_detail;
        $rootScope.identity.can_publish_offer = data.can_publish_offer;
        $rootScope.identity.can_see_offer_detail = data.can_see_offer_detail;
        $rootScope.identity.is_verified = data.is_verified;

        localStorageService.set('customer', $rootScope.identity);
    })
});
