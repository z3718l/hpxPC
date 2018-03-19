hpxAdminApp.controller('quoteController', function ($rootScope, $scope, $timeout, $state, addressService, customerService, ngTableParams, billService, constantsService) {
    //判断是否可以报价
    if ($rootScope.identity.can_publish_offer != 1) {
        swal("您暂时还不能报价！");
        window.history.back();
        return;
    }
    if ($rootScope.identity.is_verified == -1 || $rootScope.identity.is_verified == 0 || $rootScope.identity.is_verified == 2) {
        swal("您是个人客户，不能进行机构报价！");
        $('#link4').attr("disabled",true)
    }
    $scope.filter = { };
    //获取所有我的报价信息
    $scope.tableParams = new ngTableParams({ 'sorting': {'offer_time':'desc'} }, {
        getData: function (params) {
            return billService.getAllOwnBillOffer(params, $scope.filter.billTypeId, $scope.filter.billStyleId, $scope.filter.maxPrice, $scope.filter.tradeLocationId, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
               
                for (var i = 0; i < data.length; i++) {
                    try {
                        data[i].offer_detail = JSON.parse(data[i].offer_detail);
                      
                    }
                    catch (e) {
                    }
                }
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };
    //删除报价
    $scope.remove = function (data) {
        swal({
            title: "确定要删除该报价吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            billService.deleteBillOffer(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    }
    
    $scope.edit = function (data) {
        if (data == null) {         //跳转至新建报价
            $state.go('app.main.editQuote');
        } 
        else {      //跳转到报价详细信息
            $state.go('app.main.editQuote', { 'id': data.id });
        }
    };
});