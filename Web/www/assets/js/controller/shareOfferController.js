hpxAdminApp.controller('shareOfferController', function ($rootScope, $scope, $state, $stateParams, billService) {
    //根据id获取报价详细信息
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
    !function (t) { "use strict"; !function () { t(document).on("click", ".js_details", function (e) { e.preventDefault(), t(".alert-details").fadeIn(300) }), t(document).on("click", ".alert-details", function (e) { e.preventDefault(), t(this).fadeOut("300") }) }() }(jQuery);
});