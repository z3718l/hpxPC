hpxAdminApp.controller('editQuoteController', function ($rootScope, $scope, $timeout, $state, $stateParams, addressService, customerService, ngTableParams, billService, constantsService) {
    //判断是否可进行报价，不行就直接返回
    if ($rootScope.identity.can_publish_offer != 1) {
        alert("您暂时还不能报价！");
        window.history.back();
        return;
    }
    //设置默认的内容
    var emptyEntity = {
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        'offer_detail': {},
        'bill_style_id': 201,
        'deadline_type_code': 1701,
        'trade_type_id': 1801,
        'trade_background_code': 1601,
        'max_price_type': 0,
    };
    //如果id不为0，获取指定报价信息
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
            if ($scope.model.max_price > 0) {
                $scope.model.max_price_type = 1;
            }

            try {
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
            catch (e) {
            }
        });
    }
    else {
        $scope.model = emptyEntity;
    }
    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取所有市级地址
    $scope.provinceChange = function () {
        if ($scope.model.trade_province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.trade_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取票据类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类型
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //票据属性发生变化时，获取不同的承兑机构
    $scope.billStyleChange = function () {
        constantsService.queryAcceptorTypeforOffer($scope.model.bill_style_id).then(function (data) {
            $scope.acceptorTypeData = data;
            for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
                if ($scope.acceptorTypeData[i].code == 2001) {
                    $scope.acceptorTypeData[i].checked = true;
                }
            }
            $scope.acceptorTypeChange();
        })
    }
    //获取贸易背景
    constantsService.queryConstantsType(16).then(function (data) {
        $scope.tradeBackgroundData = data;
    })
    //获取期限类型
    constantsService.queryConstantsType(17).then(function (data) {
        $scope.deadlineTypeData = data;
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取交易类型
    constantsService.queryConstantsType(18).then(function (data) {
        $scope.tradeType = data;
    })
    //获取勾选的承兑机构
    $scope.acceptorTypeChange = function () {
        $scope.offer_acceptorType = [];
        for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
            if ($scope.acceptorTypeData[i].checked) {
                $scope.offer_acceptorType.push($scope.acceptorTypeData[i]);
            }
        }
        $scope.offer_acceptorType.push($scope.plus);
    }

    $scope.save = function () {
        if ($scope.model.bill_style_id == 201 || $scope.model.bill_style_id == 203 || $scope.model.bill_style_id == 205) {
            if (!$scope.model.trade_location_id) {
                alert("请选择交易地点。");
                return;
            }
        }

        $scope.model.offer_detail = JSON.stringify($scope.model.offer_detail);

        if ($scope.model.id == null) {
            //新增报价
            billService.insertBillOffer($scope.model).then(function (data) {
                alert('新增报价成功！');
                $state.go('app.main.quote');
            });
        }
        else {
            //修改报价
            billService.updateBillOffer($scope.model).then(function (data) {
                alert('修改报价成功！');
                $state.go('app.main.quote');
            });
        }
    };
});