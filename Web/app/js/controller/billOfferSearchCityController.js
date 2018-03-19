ionicApp.controller('billOfferSearchCityController', function ($scope, $rootScope, $http, $state, $ionicPopup, addressService, $cordovaGeolocation, $ionicScrollDelegate) {
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;

    }

    $rootScope.billOfferSearchModel = {
        submit:false,
    };
    $scope.geoLocation = function(){
        if (navigator.geolocation) {
            $scope.isGeoLocation = true;
            navigator.geolocation.getCurrentPosition(
                function (position) {

                    //杭州: 30，120 上海: 121.48,31.22
                    addressService.geoLocation(30,120).then(function (data) {
                        if (data) {
                            //普通城市
                            if (data.locationIdList) {
                                $rootScope.billOfferSearchModel.province_name = data.locationIdList[0].provinceName;
                                $rootScope.billOfferSearchModel.province_id = data.locationIdList[0].provinceId;
                                $rootScope.billOfferSearchModel.city_id = data.locationIdList[0].cityId;
                                $rootScope.billOfferSearchModel.city_name = data.locationIdList[0].cityName;
                                addressService.queryCity($rootScope.billOfferSearchModel.province_id).then(function (data) {
                                    $scope.CityData = data;
                                });
                            }
                            //直辖市
                            else if (data.districtId) {
                                $rootScope.billOfferSearchModel.province_name = data.cityName;
                                $rootScope.billOfferSearchModel.province_id = data.cityId
                                $rootScope.billOfferSearchModel.city_id = data.districtId;
                                $rootScope.billOfferSearchModel.city_name = data.districtName;
                                addressService.queryCity($rootScope.billOfferSearchModel.province_id + 1).then(function (data) {
                                    $scope.CityData = data;
                                });
                            }
                            //特别行政区
                            else {
                                $rootScope.billOfferSearchModel.province_name = data.cityName;
                                $rootScope.billOfferSearchModel.province_id = data.cityId;
                            }
                        }
                        else {
                            $ionicPopup.alert({
                                title: '通知',
                                template: '该城市不在定位范围内！',
                                okType: 'button-assertive',
                            });
                        }
                    });
                },
                function (err) {
                    console.log(err.message);
                }
            );
        }
        else {
            $scope.isGeoLocation = false;
            console.log("不支持地理定位");
            //alert("不支持地理定位");
        }
    }
    $scope.geoLocation();

    //热门城市
    $scope.hotCity = function (location_id, location_name) {
        $scope.isGeoLocation = false;
        if (!location_id) {
            $rootScope.billOfferSearchModel.province_id = null;
            $rootScope.billOfferSearchModel.province_name = '';
            $rootScope.billOfferSearchModel.city_id = null;
            $rootScope.billOfferSearchModel.city_name = '';
        }
        else {
            if (location_id == 1 || location_id == 20 || location_id == 860 || location_id == 2462) {
                $rootScope.billOfferSearchModel.province_id = location_id;
                $rootScope.billOfferSearchModel.province_name = location_name;
                $rootScope.billOfferSearchModel.city_id = null;
                $rootScope.billOfferSearchModel.city_name = '';
                $scope.setProvince(location_id, location_name);
            }
            else {
                if (location_id == 1007) {
                    $rootScope.billOfferSearchModel.province_id = 1006;
                    $rootScope.billOfferSearchModel.province_name = '浙江省';
                }
                else if (location_id == 2132 || location_id == 2158) {
                    $rootScope.billOfferSearchModel.province_id = 2131;
                    $rootScope.billOfferSearchModel.province_name = '广东省';
                }
                $scope.setProvince($rootScope.billOfferSearchModel.province_id, $rootScope.billOfferSearchModel.province_name);
                $rootScope.billOfferSearchModel.city_id = location_id;
                $rootScope.billOfferSearchModel.city_name = location_name;
            }
        }
    }
    //获取所有省区地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应的省区的市级地址
    $scope.setProvince = function (province_id, province_name) {
        $scope.isGeoLocation = false;
        $rootScope.billOfferSearchModel.province_id = province_id;
        $rootScope.billOfferSearchModel.province_name = province_name;
        $rootScope.billOfferSearchModel.city_id = null;
        $rootScope.billOfferSearchModel.city_name = '';
        if (province_id == null) {
            return;
        } else if (province_id == 1 || province_id == 20 || province_id == 860 || province_id == 2462) {
            province_id = province_id + 1;
            return addressService.queryCity(province_id).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            return addressService.queryCity(province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    $scope.setCity = function (city_id, city_name) {
        $scope.isGeoLocation = false;
        $rootScope.billOfferSearchModel.city_name = city_name;
        $rootScope.billOfferSearchModel.city_id = city_id;
    }
    $scope.submit = function () {
        if ($rootScope.billOfferSearchModel.province_id == 1 || $rootScope.billOfferSearchModel.province_id == 20 || $rootScope.billOfferSearchModel.province_id == 860 || $rootScope.billOfferSearchModel.province_id == 2462) {
            if (!$rootScope.billOfferSearchModel.city_id) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '直辖市必须选择区后才能提交！',
                    okType: 'button-assertive',
                });
                return;
            }
        }
        if ($rootScope.billOfferSearchModel.province_id && !$rootScope.billOfferSearchModel.city_id) {
            $ionicPopup.alert({
                title: '警告',
                template: '省必须选择市后才能提交！',
                okType: 'button-assertive',
            });
            return;
        }
        $rootScope.billOfferSearchModel.submit = true;
        $state.go('app.billOffer');
    }
    //滑动轮回到顶部
    $scope.scrollCityToTop = function () {
        $ionicScrollDelegate.$getByHandle('city').scrollTop();
    };
})