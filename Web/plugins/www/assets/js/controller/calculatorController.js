hpxAdminApp.controller('calculatorController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //登录事件
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //登录功能，登录成功后跳转到个人中心
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            localStorageService.set('customer', data);

            // TODO
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };


    $scope.submitCalculator = function () {
        toolService.calculator($scope.calculatorModel).then(function (data) {
            $scope.calculatorResult = data;
        })
    }




    ////获取新闻信息
    //portalService.lastInformation(2).then(function (data) {
    //    $scope.news = data;
    //});
    ////获取承兑机构类型
    //constantsService.queryConstantsType(4).then(function (data) {
    //    $scope.acceptorTypeData = data;
    //})
    ////新手引导
    //portalService.lastInformation(3).then(function (data) {
    //    $scope.guides = data;
    //});
    ////跳转到注册界面
    //$scope.tosignup = function () {
    //    $state.go("app.signup");
    //}
    ////获取交易额
    //orderService.orderCount().then(function (data) {
    //    $scope.orderCount = data;
    //});
    ////获取首页电票数据信息
    //billService.billProductElectronic().then(function (data) {
    //    $scope.billProductElectronic = data.bill_products;
    //});
    ////获取首页纸票数据信息
    //billService.billProductPaper().then(function (data) {
    //    $scope.billProductPaper = data.bill_products;
    //});
    ////获取首页报价数据信息
    //billService.billOfferPaper().then(function (data) {
    //    $scope.billOfferPaper = data.bill_offers;

    //    for (var i = 0; i < $scope.billOfferPaper.length; i++) {
    //        try {
    //            $scope.billOfferPaper[i].offer_detail = JSON.parse($scope.billOfferPaper[i].offer_detail);
    //        }
    //        catch (e) {
    //        }
    //    }
    //});
    ////toolService.interestRate().then(function (data) {
    ////    $scope.interestRate = data;
    ////});

    ////toolService.priceTrend().then(function (data) {
    ////    $scope.priceTrend = data;
    ////}); 


    //$scope.showCalculator = function () {
    //    $('#modal-calculator').modal('show');
    //}



    //$scope.showEnterprise = function () {
    //    $('#modal-enterprise').modal('show');
    //}

    //$scope.submitEnterprise = function () {
    //    customerService.enterpriseDetail($scope.enterpriseModel.keyword).then(function (data) {
    //        $scope.enterpriseResult = data[0];
    //    })
    //}

    //$scope.showBank = function () {
    //    $('#modal-bank').modal('show');
    //}

    ////$scope.showCalendar = function () {
    ////    $('#modal-calendar').modal('show');
    ////}

    ////$scope.submitCalendar = function () {

    ////}

    ////获取所有的银行账户信息，并显示是否为默认银行账户
    //$scope.tableParams = new ngTableParams({}, {
    //    getData: function (params) {
    //        if ($scope.filter.headBankId || $scope.filter.bankAddressId || $scope.filter.keyword) {
    //            return bankService.getBank($scope.filter.headBankId, $scope.filter.bankAddressId, $scope.filter.keyword).then(function (data) {
    //                return data;
    //            });
    //        }
    //    }
    //});
    ////刷新
    //$scope.submitBank = function () {
    //    $scope.tableParams.reload();
    //}

    ////获取所有的银行账户总行信息
    //bankService.queryAll().then(function (data) {
    //    $scope.bankData = data;
    //});

    ////获取所有的省级地址
    //addressService.queryAll().then(function (data) {
    //    $scope.ProAddressData = data;
    //    $scope.ProvinceChange();
    //});

    ////获取对应省的市级地址
    //$scope.ProvinceChange = function () {
    //    if ($scope.filter.bankprovince) {
    //        return addressService.getCity($scope.filter.bankprovince).then(function (data) {
    //            $scope.BankCityData = data;
    //            addressService.queryAll().then(function (Pdata) {       //获取所有的地址信息，找到对应的id，把对应的addressname发给银行所在省
    //                for (var i = 0; i < Pdata.length; i++) {
    //                    if ($scope.model.bankprovince == Pdata[i].id) {
    //                        $scope.model.bank_province = Pdata[i].address_name;
    //                    };
    //                }
    //            });
    //        });
    //    }
    //}

    //$scope.showCalendar = function () {
    //    $('#modal-calendar').modal('show');
    //}
});
