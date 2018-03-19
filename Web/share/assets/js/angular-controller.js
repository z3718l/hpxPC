hpxAdminApp.controller('shareController', function ($rootScope, $scope, $state, $stateParams) {

});

hpxAdminApp.controller('shareBillController', function ($rootScope, $scope, $state, $stateParams, $filter, $timeout, billService) {
    $scope.read_hpx = false;
    $scope.close_hpx = function () {
        $scope.read_hpx = false;
    }
    $scope.show_hpx = function () {
        $scope.read_hpx = true;
    }
    //根据id获取对应的票据详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            console.log(data)
            if ($state.includes('share.shareBill')) {
                var titly = document.getElementById('titly').innerHTML;
                document.getElementById('titly').innerHTML = "票据详情";
            } else if ($state.includes('share.shareOffer')) {
                var titly = document.getElementById('titly').innerHTML;
                document.getElementById('titly').innerHTML = "机构报价-" + $scope.model.bill_style_name;
            }
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

hpxAdminApp.controller('shareOfferController', function ($rootScope, $scope, $state, $stateParams, billService, customerService) {
    //根据id获取报价详细信息
    $scope.read_hpx = false;
    $scope.close_hpx = function () {
        $scope.read_hpx = false;
    }
    $scope.show_hpx = function () {
        $scope.read_hpx = true;
    }
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
            $scope.model.bill_style_name = data.bill_style_name;
            $scope.model.bill_style_id = data.bill_style_id;
            if ($state.includes('share.shareBill')) {
                var titly = document.getElementById('titly').innerHTML;
                document.getElementById('titly').innerHTML = "票据详情";
            } else if ($state.includes('share.shareOffer')) {
                var titly = document.getElementById('titly').innerHTML;
                document.getElementById('titly').innerHTML = "机构报价-" + $scope.model.bill_style_name;
            }
            try {
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
            catch (e) {

            }
            customerService.findEnterprise($scope.model.enterprise_id).then(function (data) {
                $scope.enterpriseDetail = data;
            })
        });

    }

    !function (t) { "use strict"; !function () { t(document).on("click", ".js_details", function (e) { e.preventDefault(), t(".alert-details").fadeIn(300) }), t(document).on("click", ".alert-details", function (e) { e.preventDefault(), t(this).fadeOut("300") }) }() }(jQuery);
    //生成数组
    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }

});