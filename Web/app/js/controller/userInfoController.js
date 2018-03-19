ionicApp.controller('userInfoController', function ($scope, $rootScope, $state, customerService, addressService, $ionicPopup) {
    $scope.model = {};
    $scope.filter = {
        isModified: 1,
        tradCity: true,
        tip: false
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.provinceChange();
        if ($scope.model.trade_location_province_id != 1 || $scope.model.trade_location_province_id != 20 || $scope.model.trade_location_province_id != 860 || $scope.model.trade_location_province_id != 2462) {
            $scope.cityChange();
        }
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.provinceChange = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            $scope.filter.isModified == 0;
            //document.getElementById("tradCity").style.display = "none";
            $scope.filter.tradCity = false;
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            $scope.filter.isModified == 1;
            //document.getElementById("tradCity").style.display = "block";
            $scope.filter.tradCity = true;
            $scope.AddressData = null;
            return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取对应市的区
    $scope.cityChange = function () {
        if ($scope.model.trade_location_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.trade_location_city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
    }
    $scope.modified = function () {
        $scope.model.is_verified = 0;
        var tempList = $scope.model.telephone_number.split('-');
        $scope.model.telephone_code = tempList[0];
        $scope.model.telephone_number_number = tempList[1];
        $scope.filter.isModified = 1;
        setTimeout(function () {
            if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
                $scope.filter.tradCity = false;
            }
        }, 50);
    };
    //提交客户信息进行审核
    $scope.save = function () {
        if (!$scope.model.customer_name) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入联系人！',
                okType: 'button-assertive',
            });
            return;
        }
        if ($scope.model.telephone_code && $scope.model.telephone_number_number) {
            $scope.model.telephone_number = $scope.model.telephone_code + '-' + $scope.model.telephone_number_number;
        }
        customerService.updateCustomer($scope.model).then(function (data) {
            //$state.go("app.main.enterpriseInfo");
            //$ionicPopup.alert({
            //    title: '警告',
            //    template: '提交成功，请继续完善企业信息！',
            //    okType: 'button-assertive',
            //});
            $scope.filter.tip = true;
        });
    };
})