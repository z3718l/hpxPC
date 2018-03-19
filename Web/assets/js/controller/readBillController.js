hpxAdminApp.controller('readBillController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService, orderService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
    };

    //根据id获取对应的票据详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            $('.jqzoom').imagezoom();

            //根据条件判断，成立则获取出价记录
            if ($stateParams.id && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.model.publisher_id == $rootScope.identity.customer_id)) {
                billService.getBillProductBidding($stateParams.id).then(function (data) {
                    $scope.biddings = data;
                });
            }
        });
    }

    //$scope.showAddBidding = function (item) {
    //    $scope.biddingModel = {
    //        bill_product_id: $scope.model.id,
    //        bill_type_id: $scope.model.bill_type_id,
    //    };
    //    $('#modal-addBidding').modal('show');
    //};

    //选择交易方
    $scope.finishBidding = function (item) {
        if (confirm('确认选择该收票人进行交易吗？')) {
            billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
                alert('确认交易方成功！');
                billService.getBillProduct($stateParams.id).then(function (data) {
                    $scope.model = data;
                    $('.jqzoom').imagezoom();

                    billService.getBillProductBidding($stateParams.id).then(function (data) {
                        $scope.biddings = data;
                    });
                });
            });
        }
    };

    //撤销报价
    $scope.cancelBidding = function (item) {
        if (confirm('确定要撤销报价吗？')) {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            });
        }
    };
    //新增报价信息
    $scope.addBidding = function () {
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            alert('出价成功！');
            $('#modal-addBidding').modal('hide');
            //if ($scope.model.id && identity && (identity.can_see_bill_detail == 1 || model.publisher_id == identity.customer_id)) {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            //}
        });
    };

    $scope.showAddBidding = function (item) {
        $scope.biddingModel = {
            bill_product_id: $scope.model.id
        };
        $('#modal-addBidding').modal('show');
    };
});
