hpxAdminApp.controller('shareBillController', function ($rootScope, $scope, $state, $stateParams, $filter, $timeout, billService) {

    //根据id获取对应的票据详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;

            if (!$scope.model.remaining_day) {
                $scope.model.remaining_day = 0;
            }

        });
        //$timeout(function () {
        //    if ($rootScope.identity) {
        //        $scope.filter.isidentity = 1;
        //        $('.jqzoom').imagezoom();
        //    };
        //    if ($rootScope.identity) {
        //        $scope.filter.isidentity = 1;
        //        $('.backjqzoom').imagezoom();
        //    }
        //}, 500);
    }

    !function (t) { "use strict"; !function () { t(document).on("click", ".js_details", function (e) { e.preventDefault(), t(".alert-details").fadeIn(300) }), t(document).on("click", ".alert-details", function (e) { e.preventDefault(), t(this).fadeOut("300") }) }() }(jQuery);

});