hpxAdminApp.controller('queryOfferController', function ($rootScope, $scope, $stateParams, $state, $filter ,ngTableParams, billService, addressService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    $scope.filter = {
        'billStyleId': 201,      //默认选中银纸大票
    };
    //获取票据类型数据
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    });

    $scope.tableParams = new ngTableParams({ 'sorting': { 'offer_time': 'desc' } }, {
        getData: function (params) {
            var newdate = new Date();
            $scope.filter.publishingTimeS = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日期
            $scope.filter.publishingTimeB = $filter('date')(newdate, 'yyyy-MM-dd');
            //获取当前日期的报价信息
            return billService.searchBillOffer(params, $scope.filter.func, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId, $scope.filter.enterpriseName).then(function (data) {
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
});
