
ionicApp.controller('billQueryController', function ($scope, $rootScope, $state, $filter, billService, addressService, $cordovaGeolocation, $ionicGesture) {
    //$scope.$on('$stateChangeSuccess', function () {
    //    TouchSlide({
    //        slideCell: "#tabBox1",
    //        endFun: function (e) {
    //            var t = document.getElementById("tabBox1-bd");
    //            t.parentNode.style.height = t.children[e].children[0].offsetHeight + 50 + "px",
    //            e > 0 && (t.parentNode.style.transition = "200ms")
    //        }
    //    });
    //});
    //date类型转换
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    $scope.dateFilter = { date_index: 0 };
    $scope.dates = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];
    $scope.dateTimes = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];
    $scope.date = new Date();
    for (var i = 0; i < 5; i++) {
        $scope.dates[i].date = $scope.date.pattern("yyyy-MM-dd EE");
        $scope.dateTimes[i].date = $scope.date.pattern("yyyy-MM-dd");
        $scope.date.setDate(($scope.date.getDate() - 1));
    }

    //定位
    $scope.geoLocation = function () {
        $scope.locationModel = {
            city_name: "未知"
        };
        if (navigator.geolocation) {
            $scope.isGeoLocation = true;
            navigator.geolocation.getCurrentPosition(
                function (position) {

                    //杭州: 30，120 上海: 121.48,31.22
                    addressService.geoLocation(position.coords.latitude, position.coords.longitude).then(function (data) {
                        if (data) {
                            //普通城市
                            if (data.locationIdList) {
                                $scope.locationModel.province_name = data.locationIdList[0].provinceName;
                                $scope.locationModel.province_id = data.locationIdList[0].provinceId;
                                $scope.locationModel.city_id = data.locationIdList[0].citytId;
                                $scope.locationModel.city_name = data.locationIdList[0].cityName;
                            }
                                //直辖市
                            else if (data.districtId) {
                                $scope.locationModel.province_name = data.cityName;
                                $scope.locationModel.province_id = data.cityId
                                $scope.locationModel.city_id = data.districtId;
                                $scope.locationModel.city_name = data.districtName;
                            }
                                //特别行政区
                            else {
                                $scope.locationModel.province_name = data.cityName;
                                $scope.locationModel.province_id = data.cityId;
                            }
                        }
                        else {
                            //$ionicPopup.alert({
                            //    title: '通知',
                            //    template: '该城市不在定位范围内！',
                            //    okType: 'button-assertive',
                            //});
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
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
    }
    //手势滑动
    $scope.onSwipeLeft = function () {
        if ($scope.tab != 2) {
            $scope.setTab($scope.tab + 1);
        }
    }

    $scope.onSwipeRight = function () {
        if ($scope.tab != 1) {
            $scope.setTab($scope.tab - 1);
        }
    }
    $rootScope.billQuerybillProductId = null;
    $scope.changeBillProductId = function (billProductId) {
        $rootScope.billQuerybillProductId = billProductId;
        //$state.go('app.billDetail');
    };

    $scope.filter = {
        acceptorTypeID: '',
        billStatusAll: true,
        tradeTypeCode: '',
        billTypeID: ['101', '102'],
        billStatusCode: '801',
        billCharacterCode: '',
        billStyleID: '',
        sort : 0,
        priceArrow: true,
        deadlineTimeArrow: false
    };
    $scope.doRefresh = function () {
        switch ($scope.filter.sort) {
            case 0:
                if ($scope.filter.priceArrow) {
                    $scope.params = $scope.Params.Create('-bill_sum_price', 10);
                }
                else {
                    $scope.params = $scope.Params.Create('+bill_sum_price', 10);
                }
                break;
            case 1:
                if ($scope.deadlineTimeArrow) {
                    $scope.params = $scope.Params.Create('-deadline_time', 10);
                }
                else {
                    $scope.params = $scope.Params.Create('+deadline_time', 10);
                }
                break;
        }
        $scope.listData101 = [];
        $scope.listData102 = [];
        $scope.loadMore();
    };
    $scope.show = true;
    $scope.loadMore = function (first) {
        if ($rootScope.billSearchModel && $rootScope.billSearchModel.submit == true) {
            if ($rootScope.billSearchModel.date instanceof Date) {
                $scope.show = false;
                $rootScope.billSearchModel.date.setDate($rootScope.billSearchModel.date.getDate() + 1);
                $rootScope.billSearchModel.date = $rootScope.billSearchModel.date.toISOString().slice(0, 10);
            }
            if ($rootScope.billSearchModel.city_id) {
                $scope.filter.locationId = $rootScope.billSearchModel.city_id;
            }
            else if ($rootScope.billSearchModel.province_id) {
                $scope.filter.locationId = $rootScope.billSearchModel.province_id;
            }
        }
        if ($scope.filter.sort == 0) {
            billService.searchBillProduct($scope.params, $scope.filter.billTypeID[0], $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].publishing_time = new Date(data[item].publishing_time).pattern("yyyy-MM-dd");
                }
                $scope.listData101 = first ? data : $scope.listData101.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        else {
            billService.searchBillProduct($scope.params, $scope.filter.billTypeID[1], $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].publishing_time = new Date(data[item].publishing_time).toISOString().slice(0, 10);
                }
                $scope.listData102 = first ? data : $scope.listData102.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        $scope.params.next();
    };

    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
    //$scope.sort = 0;
    //$scope.priceArrow = true;
    $scope.changeArrow = function (func) {
        switch (func) {
            case 'price':
                $scope.filter.sort = 0;
                $scope.filter.priceArrow = !$scope.filter.priceArrow;
                break;
            case 'deadline_time':
                $scope.filter.sort = 1;
                $scope.filter.deadlineTimeArrow = !$scope.filter.deadlineTimeArrow;
                break;
        }
        $scope.doRefresh();
    }
});