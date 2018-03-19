hpxAdminApp.controller('hpxHelpController', function ($rootScope, $scope, $state, toolService, customerService, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService) {
    // 计算器
    $scope.model = {};
    var date = new Date();
    var tormorrow = new Date();
    tormorrow.setDate(tormorrow.getDate() + 1);
    $scope.model = {
        "start_time": date.toISOString().slice(0, 10),
        "end_time": tormorrow.toISOString().slice(0, 10),
        "interest_type": "year",
        "bill_type": "elec",
        "adjust_day": 0,
        "days": "",
    };
    $scope.initModel = {};
    angular.copy($scope.model, $scope.initModel);

    $scope.calcuInterest = function (func) {
        var query = {};
        angular.copy($scope.model, query);
        if (!$scope.model.denomination) {
            swal('请输入票面金额.');
            return;
        }
        //通过利率计算
        if (!func) {
            if (!$scope.model.interest) {
                swal('请输入利率.');
                return;
            }
            if (!$scope.model.start_time || !$scope.model.end_time) {
                swal('请输入开始和结束时间.');
                return;
            }
            if (parseInt($scope.model.start_time.replace(/-/g, "")) >= parseInt($scope.model.end_time.replace(/-/g, ""))) {
                swal('贴现时间必须小于到期时间.');
                return;
            }
            if ($scope.model.interest) {
                query['interest_year'] = null;
                query['interest_month'] = null;
                query['interest_' + $scope.model.interest_type] = query.interest;
            }
        } else {
            //十万计算
            if (!$scope.model.every_plus) {
                swal('请输入贴息.');
                return;
            }
            query.start_time = null;
            query.end_time = null;
            if ($scope.model.many_start_time && $scope.model.many_end_time) {
                if (parseInt($scope.model.many_start_time.replace(/-/g, "")) >= parseInt($scope.model.many_end_time.replace(/-/g, ""))) {
                    swal('贴现时间必须小于到期时间.');
                    return;
                }
                query.start_time = $scope.model.many_start_time;
                query.end_time = $scope.model.many_end_time;
            }
        }
        toolService.calculator(query, func).then(function (data) {
            $scope.interestResult = data;
        });
    }
    //选择时间，请求是否假期
    $scope.onTimeSet = function (newDate, oldDate, key) {
        toolService.isCalendarSpecial(newDate).then(function (data) {
            $scope.model[key + '_tip'] = data.holiday_name;
        });
    }
    //重置表单
    $scope.clear = function () {
        angular.copy($scope.initModel, $scope.model);
        $scope.interestResult = "";
    }

    $scope.changeMode = function (mode) {
        $scope.chooseMany = mode;
        $scope.clear();
    }


    // 挂失查询
    $scope.model = {
        "billNumber": null,
    };

    //更改输入框检验
    $scope.updateBillNumber = function () {
        if (!$scope.model.billNumber) {
            $scope.model.billNumberValidate = null;
            return;
        }
        if (!/^[0-9]{16}$/.test($scope.model.billNumber) && !/^[0-9]{8}$/.test($scope.model.billNumber)) {
            $scope.model.billNumberValidate = false;
        } else {
            $scope.model.billNumberValidate = true;
        }
    }

    //查询
    $scope.query = function () {
        if (!$scope.model.billNumber) {
            swal("请输入汇票票号.");
            return;
        }
        if (!/^[0-9]{16}$/.test($scope.model.billNumber) && !/^[0-9]{8}$/.test($scope.model.billNumber)) {
            swal("请输入16位或后8位汇票票号.");
            return;
        }
        toolService.serviceByPublication($scope.model).then(function (data) {
            if (data.page_info.items_number)
                $scope.queryResult = data['service_by_publications'][0];
            else {
                $scope.queryResult = null;
                swal("该票号目前暂无挂失信息.");
            }
        });
    }
    //清理
    $scope.clear = function () {
        $scope.model.billNumber = null;
        $scope.queryResult = null;
        $scope.updateBillNumber();
    }
    //行号查询
    //获取所有的银行账户信息，并显示是否为默认银行账户
    $scope.tableParams = new ngTableParams({}, {
        getData: function (params) {
            if ($scope.filter.headBankId || $scope.filter.bankAddressId || $scope.filter.keyword) {
                //return bankService.getBank($scope.filter.headBankId, $scope.filter.bankAddressId, $scope.filter.keyword).then(function (data) {
                //    return data;
                //});
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
    //工商查询
    $scope.submitEnterprise = function () {
        if ($scope.enterpriseModel.keyword.length < 4) {
            swal("至少输入四个关键字！");
            return;
        } else {
            customerService.enterpriseDetail($scope.enterpriseModel.keyword).then(function (data) {
                $scope.enterpriseResult = data[0];
            })
        }
    }
});