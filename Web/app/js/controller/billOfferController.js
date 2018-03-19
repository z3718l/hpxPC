
ionicApp.controller('billOfferController', function ($scope, $rootScope, $state, $filter, billService, toolService, addressService) {
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

    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
        $scope.doRefresh();
    }

    //手势滑动
    $scope.onSwipeLeft = function () {
        //alert($scope.tab)
        if ($scope.tab != 4) {
            $scope.setTab($scope.tab + 1);
        }
    }

    $scope.onSwipeRight = function () {
        //alert($scope.tab)
        if ($scope.tab != 1) {
            $scope.setTab($scope.tab - 1);
        }
    }
    $scope.onSwipeDown = function () {

        if ($scope.hasMore) {
            $socpe.loadMore();
        }
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
    $scope.changeBillOfferId = function (billOfferId) {
        $rootScope.billOfferbillOfferId = billOfferId;
    };
    $scope.filter = {
        //func: 'home',
        billStyleId: ['202', '203', '204', '205'],
        //n:10
        search: 'search',
        publishingTimeS: '',
        publishingTimeB: '',
        enterpriseName: '',
        tradeLocationId: '',
        sort:0,
        rate01: true,
        rate02: false,
        rate03: false,
        rate04: false,
        rate05: false,
        rate06: false,
    };
    $scope.doRefresh = function () {
        if ($scope.filter.rate01) {
            $scope.params = $scope.Params.Create('-offer_rate01', 10);
        }
        else {
            $scope.params = $scope.Params.Create('+offer_rate01', 10);
        }
        $scope.listData202 = [];
        $scope.listData203 = [];
        $scope.listData204 = [];
        $scope.listData205 = [];
        $scope.filter.publishingTimeS = '';
        $scope.filter.publishingTimeB = '';
        $scope.loadMore();
    };
    /*
    searchBillOffer: function (params, search, publishingTimeS, publishingTimeB, billStyleId, enterpriseName, tradeLocationId)
    */
    $scope.show = [true, true, true];
    $scope.loadMore = function (first) {
        if ($rootScope.billOfferSearchModel && $rootScope.billOfferSearchModel.submit == true) {
            if ($rootScope.billOfferSearchModel.date instanceof Date) {
                $scope.show[0] = false;
                $rootScope.billOfferSearchModel.date.setDate($rootScope.billOfferSearchModel.date.getDate() + 1);
                $rootScope.billOfferSearchModel.date = $rootScope.billOfferSearchModel.date.toISOString().slice(0, 10);
            }
            if ($rootScope.billOfferSearchModel.city_id) {
                $scope.show[1] = false;
            }
            else if ($rootScope.billOfferSearchModel.province_id) {
                $scope.show[2] = false;
            }
        }
        if ($scope.tab == 1) {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[0], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[0], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).pattern("yyyy-MM-dd");
                }
                $scope.listData202 = first ? data : $scope.listData202.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                for (var i = 0; i < ($scope.listData202).length; i++) {
                    //toolService.getStars($scope.listData202[i].enterprise_id).then(function (data) {
                    //    $scope.listData202[i].star = data;
                    //});
                    toolService.setStars2($scope.listData202[i]);
                };
                //for (let i = 0; i < ($scope.listData202).length; i++) {
                //    toolService.getStars($scope.listData202[i].enterprise_id).then(function (data) {
                //        $scope.listData202[i].star = data;
                //    });
                //};
            });
        }
        else if ($scope.tab == 2) {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[1], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[1], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).toISOString().slice(0, 10);
                }
                $scope.listData203 = first ? data : $scope.listData203.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //for (let i = 0; i < ($scope.listData203).length; i++) {
                //    toolService.getStars($scope.listData203[i].enterprise_id).then(function (data) {
                //        $scope.listData203[i].star = data;
                //    });
                //};
                for (var i = 0; i < ($scope.listData203).length; i++) {
                    //toolService.getStars($scope.listData203[i].enterprise_id).then(function (data) {
                    //    $scope.c.star = data;
                    //});
                    toolService.setStars2($scope.listData203[i]);
                };
            });
        }
        else if ($scope.tab == 3) {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[2], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[2], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).toISOString().slice(0, 10);
                }
                $scope.listData204 = first ? data : $scope.listData204.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //for (let i = 0; i < ($scope.listData204).length; i++) {
                //    toolService.getStars($scope.listData204[i].enterprise_id).then(function (data) {
                //        $scope.listData204[i].star = data;
                //    });
                //};
                for (var i = 0; i < ($scope.listData204).length; i++) {
                    //toolService.getStars($scope.listData204[i].enterprise_id).then(function (data) {
                    //    $scope.listData204[i].star = data;
                    //});
                    toolService.setStars2($scope.listData204[i]);
                };
            });
        }
        else {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[3], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[3], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).toISOString().slice(0, 10);
                }
                $scope.listData205 = first ? data : $scope.listData205.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //for (let i = 0; i < ($scope.listData205).length; i++) {
                //    toolService.getStars($scope.listData205[i].enterprise_id).then(function (data) {
                //        $scope.listData205[i].star = data;
                //    });
                //};
                for (var i = 0; i < ($scope.listData205).length; i++) {
                    //toolService.getStars($scope.listData205[i].enterprise_id).then(function (data) {
                    //    $scope.listData205[i].star = data;
                    //});
                    toolService.setStars2($scope.listData205[i]);
                };
            });
        }
        $scope.params.next();
        //$scope.filter.n += 10;
    };

    $scope.rateClick = function (func) {
        $scope.filter.sort = func;
        switch (func) {
            case 0:
                $scope.filter.rate01 = !$scope.filter.rate01;
                break;
            case 1:
                $scope.filter.rate02 = !$scope.filter.rate02;
                break;
            case 2:
                $scope.filter.rate03 = !$scope.filter.rate03;
                break;
            case 3:
                $scope.filter.rate04 = !$scope.filter.rate04;
                break;
            case 4:
                $scope.filter.rate05 = !$scope.filter.rate05;
                break;
            case 5:
                $scope.filter.rate06 = !$scope.filter.rate06;
                break;
        }
        $scope.doRefresh();
    }
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
});