hpxAdminApp.controller('queryOfferController', function ($rootScope, $scope, $stateParams, $state, $filter ,ngTableParams, billService, addressService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    $scope.filter = {
        'billStyleId': 202,      //默认选中银电大票
    };
    //获取票据类型数据
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    });

    //获取全部省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取各省市下面的市区
    $scope.provinceChange = function () {
        if (!$scope.filter.product_province_id) {
            $scope.cityData = [];
        } else if ($scope.filter.product_province_id == 1 || $scope.filter.product_province_id == 20 || $scope.filter.product_province_id == 860 || $scope.filter.product_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.filter.product_province_id + 1;
            $scope.filter.tradeLocationId = $scope.filter.product_province_id;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.filter.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    $scope.locationChange = function () {
        $scope.filter.tradeLocationId = $scope.filter.tradeLocationId;
    }
    $scope.tableParams = new ngTableParams({ 'sorting': { 'offer_time': 'desc' } }, {
        getData: function (params) {
            var newdate = new Date();
            $scope.filter.publishingTimeS = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日期
            $scope.filter.publishingTimeB = $filter('date')(newdate, 'yyyy-MM-dd');
            if ($scope.filter.tradeLocationId==null) {
                $scope.filter.tradeLocationId = $scope.filter.product_province_id;
            } else {
                $scope.filter.tradeLocationId = $scope.filter.tradeLocationId;
            }
            //获取当前日期的报价信息
            return billService.searchBillOffer(params, $scope.filter.func, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId, $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
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
    $scope.choiceCounty = function () {
        $scope.filter.tradeLocationId = "";
        document.getElementById("country").className = "highlight";
        document.getElementById("shanghai").className = "";
        document.getElementById("beijing").className = "";
        document.getElementById("guangzhou").className = "";
        document.getElementById("shenzhen").className = "";
        document.getElementById("hangzhou").className = "";
        $scope.tableParams.reload();
    }
    $scope.choiceSH = function () {
        $scope.filter.tradeLocationId = 860;
        document.getElementById("country").className = "";
        document.getElementById("shanghai").className = "highlight";
        document.getElementById("beijing").className = "";
        document.getElementById("guangzhou").className = "";
        document.getElementById("shenzhen").className = "";
        document.getElementById("hangzhou").className = "";
        $scope.tableParams.reload();
    }
    $scope.choiceBJ = function () {
        $scope.filter.tradeLocationId = 1;
        document.getElementById("country").className = "";
        document.getElementById("shanghai").className = "";
        document.getElementById("beijing").className = "highlight";
        document.getElementById("guangzhou").className = "";
        document.getElementById("shenzhen").className = "";
        document.getElementById("hangzhou").className = "";
        $scope.tableParams.reload();
    }
    $scope.choiceGZ = function () {
        $scope.filter.tradeLocationId = 2132;
        document.getElementById("country").className = "";
        document.getElementById("shanghai").className = "";
        document.getElementById("beijing").className = "";
        document.getElementById("guangzhou").className = "highlight";
        document.getElementById("shenzhen").className = "";
        document.getElementById("hangzhou").className = "";
        $scope.tableParams.reload();
    }
    $scope.choiceSZ = function () {
        $scope.filter.tradeLocationId = 2158;
        document.getElementById("country").className = "";
        document.getElementById("shanghai").className = "";
        document.getElementById("beijing").className = "";
        document.getElementById("guangzhou").className = "";
        document.getElementById("shenzhen").className = "highlight";
        document.getElementById("hangzhou").className = "";
        $scope.tableParams.reload();
    }
    $scope.choiceHZ = function () {
        $scope.filter.tradeLocationId = 1007;
        document.getElementById("country").className = "";
        document.getElementById("shanghai").className = "";
        document.getElementById("beijing").className = "";
        document.getElementById("guangzhou").className = "";
        document.getElementById("shenzhen").className = "";
        document.getElementById("hangzhou").className = "highlight";
        $scope.tableParams.reload();

    };
    
    // 排序
    //$scope.sortByType = function (type) {
    //    $scope.sort = type;
    //    $scope.desc = !$scope.desc;
    //}
    //$(".shang2").click(function () {
    //    $(".shang1").css("background-position", "0 -14px")
    //    $(".xia1").css("background-position", "0 -14px")
    //});
    //$(".xia1").click(function () {
    //    $(".xia1").css("background-position", "0 1px")
    //    $(".shang1").css("background-position", "0 1px")
    //});
});
