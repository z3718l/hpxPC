hpxAdminApp.controller('queryBillController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        //billTypeAll: true,
        billStyleAll: true,
        acceptorTypeAll: true,
        billCharacterAll: true,
        billStatusAll: true,
        tradeTypeCode: '',
        billTypeID: '',
        billStatusCode: '800,801,802,803,804,805,806,807,808,809,810,811,812',
        billCharacterCode: ''
    };

    if ($stateParams.type == 101) {
        $scope.filter.billTypeID = 101;
    } else if ($stateParams.type == 102) {
        $scope.filter.billTypeID = 102;
    } else {
        $scope.filter.billTypeAll = true;
    }

 //获取票据类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
        $scope.billTypeData.unshift({ 'code': '', 'constant_name': '全部' });
        if ($stateParams.type) {
            $scope.filter.billTypeAll = false;
            for (var i = 0; i < $scope.billTypeData.length; i++) {
                if ($scope.billTypeData[i].code == $stateParams.type) {
                    $scope.billTypeData[i].checked = true;
                }
            }
            $scope.tableParams.reload();
        }
    });
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    });
    //承兑机构全选
    $scope.acceptorTypeChangeAll = function () {
        for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
            if($scope.filter.acceptorTypeAll) {
                $scope.acceptorTypeData[i].checked = false;

            }
        }
    };
    //选中某个选项时，‘全部’为不勾选状态
    $scope.acceptorTypeChange = function () {
        for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
            if ($scope.acceptorTypeData[i].checked)
                $scope.filter.acceptorTypeAll = false;
        }
    };

    //获取汇票特点类型
    constantsService.queryConstantsType(14).then(function (data) {
        $scope.billCharacterData = data;
        $scope.billCharacterData.unshift({ 'code': '', 'constant_name': '全部' });
    });
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeData = data;
        $scope.tradeTypeData.unshift({ 'code': '', 'constant_name': '全部' });
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        $scope.filterProvinceChange();
    });
    //获取对应的省下所有的市级地址
    $scope.filterProvinceChange = function () {
        if ($scope.filter.ProvinceID == null) {
            return;
        }
        else {
            return addressService.getCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time ': 'desc' } }, {
        getData: function (params) {

            var acceptorTypeID = [];
            if (!$scope.filter.acceptorTypeAll) {           //获取选中的承兑机构
                for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
                    if ($scope.acceptorTypeData[i].checked) {
                        acceptorTypeID.push($scope.acceptorTypeData[i].code)
                    }
                }
            }
            $scope.filter.acceptorTypeID = acceptorTypeID.join(",");

            //查看票据
            return billService.searchBillProduct(params, 1, $scope.filter.billTypeID, $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.CityID, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //如果id不等于0，获取对应id的票据详情
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
        });
    }
    //提示信息
    $scope.Reminder = function () {
        alert('大票是指汇票面额大于100万的电票、纸票。\n足月是指从对该银行承兑汇票进行电查或者实查当日起计算到该汇票票面到期日之间的天数，到期日为周末或者法定节假日顺延，另外在加上异地在途3日，算头不算尾，所计算出来的天数>180天，即为足月！');
    }
    //显示详细信息
    $scope.show = function (data) {
        $scope.model = angular.copy(data);
    };
    //获取对应id的票据的出价记录信息
    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
            $('#modal-bidding').modal('show');
        });
    };
    //弹出出价记录窗口
    $scope.showAddBidding = function (item) {
        $scope.biddingModel = {
            bill_product_id: $scope.model.id
        };
        $('#modal-addBidding').modal('show');
    };
    //撤销报价功能
    $scope.cancelBidding = function (item) {
        if (confirm('确定要撤销报价吗？')) {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            });
        }
    };
    //我要出价功能
    $scope.addBidding = function () {
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            alert('出价成功！');
            //获取出价记录详情
            billService.getBillProductBidding($scope.model.id).then(function (data) {
                $scope.biddings = data;
                $('#modal-addBidding').modal('hide');
            });
        });
    };
});
