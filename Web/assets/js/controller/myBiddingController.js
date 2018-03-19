hpxAdminApp.controller('myBiddingController', function ($rootScope, $scope, $state, ngTableParams, billService) {
    $scope.filter = {};
    //获取我的出价信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillBidding(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //$scope.reflash = function () {
    //    $scope.tableParams.reload();
    //}

    //$scope.show = function (data) {
    //    $scope.model = angular.copy(data);
    //};

    //$scope.showBidding = function (item) {
    //    billService.getBillProductBidding(item.id).then(function (data) {
    //        $scope.biddings = data;
    //        $scope.model = item;
    //    });

    //    $('#modal-bidding').modal('show');
    //};

    //$scope.finishBidding = function (item) {
    //    if (confirm('确认选择该收票人进行交易吗？')) {
    //        billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
    //            alert('确认交易方成功！');

    //            $scope.tableParams.reload();
    //            $('#modal-bidding').modal('hide');
    //        });
    //    }
    //};
});
