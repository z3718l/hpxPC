hpxAdminApp.controller('querybankController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //登录事件
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //登录功能，登录成功后跳转到个人中心
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            $cookieStore.put('customer', data);

            // TODO
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };




    //获取所有的银行账户信息，并显示是否为默认银行账户
    $scope.tableParams = new ngTableParams({}, {
        getData: function (params) {
            if ($scope.filter.headBankId || $scope.filter.bankAddressId || $scope.filter.keyword) {
                return bankService.query(params, $scope.filter.headBankId, $scope.filter.bankAddressId, $scope.filter.keyword).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    return data;
                });
            }
        }
    });
    //刷新
    $scope.submitBank = function () {
        $scope.tableParams.reload();
    }

    //获取所有的银行账户总行信息
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });

    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });

    //获取对应省的市级地址
    $scope.ProvinceChange = function () {
        if ($scope.filter.bankprovince) {
            return addressService.getCity($scope.filter.bankprovince).then(function (data) {
                $scope.BankCityData = data;
                addressService.queryAll().then(function (Pdata) {       //获取所有的地址信息，找到对应的id，把对应的addressname发给银行所在省
                    for (var i = 0; i < Pdata.length; i++) {
                        if ($scope.model.bankprovince == Pdata[i].id) {
                            $scope.model.bank_province = Pdata[i].address_name;
                        };
                    }
                });
            });
        }
    }
});
