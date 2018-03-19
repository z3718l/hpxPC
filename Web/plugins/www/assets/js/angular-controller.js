hpxAdminApp.controller('accountInfoController', function ($scope, $rootScope, $state, ngTableParams, Upload, FILE_URL, $timeout, customerService, orderService, billService) {
    $scope.filter = {
        count:0,
    }
    //获取进行中的出票订单数量
    orderService.getOrderRunning('drawer').then(function (data) {
        if (data == undefined) {
            $scope.drawerCount = 0;
        } else {
            $scope.drawerCount = data;
        }
    });
    //获取进行中的订票订单数量
    orderService.getOrderRunning('receiver').then(function (data) {
        if (data == undefined) {
            $scope.receiverCount = 0;
        } else {
            $scope.receiverCount = data;
        }
    });
    //var count = 0;
    billService.getOwnBidding().then(function (data) {
        //return data;
        for (var i = 0, n = data.length; i < n; i++) {
            if (data[i].bid_result == 1) {
                $scope.filter.count++;
            }
        }
    });
    if ($rootScope.identity.is_verified == 0) {
        customerService.getCustomer().then(function (data) {
            $scope.customer = data;
        })
    }
    //获取所有的银行账户信息，并显示是否为默认银行账�?
    customerService.getAllEnterpriseAccount().then(function (data) {
        $scope.AccountData = data;
    });
    //生成数组
    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }



});

hpxAdminApp.controller('addressController', function ($scope, $rootScope, $state, ngTableParams, addressService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有省级地址名称
    addressService.queryAll().then(function (data) {
        $scope.PData = data;
        $scope.filterProvince();
    });
    //根据省级地址id，获取本省市区地址名称
    $scope.filterProvince = function () {
        if ($scope.model.province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.province_id).then(function (data) {
                $scope.CData = data;
            });
        }
        $scope.filterCity();
    },
    //根据市级地址id，获取本市区的地址名称
    $scope.filterCity = function () {
        if ($scope.model.city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.city_id).then(function (data) {
                $scope.DstrictData = data;
            });
        }
    },
    //获取客户对应的所有客户地址
   $scope.tableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
       getData: function (params) {
           return customerService.getAllCustomerAddress(params).then(function (data) {
               $scope.first = $scope.getFirst(params);
               $scope.AddressData = data;
               for (var i = 0; i < $scope.AddressData.length; i++) {
                   if ($scope.AddressData[i].is_default == 1) {
                       $scope.AddressData[i].is_default = "�?;
                   } else {
                       $scope.AddressData[i].is_default = null;
                   }
               }
           });
       }
   });
    //刷新表格
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //设置默认地址
    $scope.default = function (item) {
        customerService.updateAddressDefault(item).then(function (data) {
            $scope.tableParams.reload();
        });
    }
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内�?
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
            $scope.filterProvince();
            $scope.filterCity();
        }
        $('#modal-edit').modal('show');
    };
    //若id为空，则新增客户地址；否则为更新客户地址
    $scope.save = function () {
        if ($scope.model.id == null) {
            //新增客户地址
            customerService.addAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            //更新客户地址
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除客户地址信息，默认地址不能删除
    $scope.delete = function (data) {
        if (data.is_default == 1) {
            swal("不能删除默认地址信息�?);
        } else {
            swal({
                title: "确定要删除本条地址信息�?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "�?,
                cancelButtonText: "�?,
                closeOnConfirm: true
            }, function () {
                customerService.removeAddress(data.id).then(function (data) {
                    $scope.tableParams.reload();
                });
            });
        }
    };

});
hpxAdminApp.controller('appController', function ($rootScope, $scope, $state) {
    $scope.getFirst = function (params) {
        if (params.total() <= (params.page() - 1) * params.count()) {
            return Math.floor(params.total() / params.count()) * params.count() + 1;
        }
        else {
            return (params.page() - 1) * params.count() + 1;
        }
    };

    $scope.tbd = function () {
        swal('此功能正在开发中，敬请期�?..');
    };

    //大写的金�?
    $scope.amountInWords = function(n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "";
        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/�?千|百|拾|�?/g, "�?).replace(/(�?+/g, "�?).replace(/�?万|亿|�?/g, "$1").replace(/(�?万|�?�?/g, "$1$2").replace(/^元零?|零分/g, "").replace(/�?/g, "元整");
    }

    //禁止鼠标右键功能
    function click(e) {
        if (document.all) {
            if (event.button == 1 || event.button == 2 || event.button == 3) {
                oncontextmenu = 'return false';
            }
        }
        if (document.layers) {
            if (e.which == 3) {
                oncontextmenu = 'return false';
            }
        }
    }
    if (document.layers) {
        document.captureEvents(Event.MOUSEDOWN);
    }
    document.onmousedown = click;
    document.oncontextmenu = new Function("return false;")

    var travel = true
    var hotkey = 17      /* hotkey即为热键的键�?是ASII�?这里99代表c�?*/
    if (document.layers)
        document.captureEvents(Event.KEYDOWN)
    function gogo(e) {
        if (document.layers) {
            if (e.which == hotkey && travel) {
                alert("操作错误.或许是您按错了按�?");
            }
        }
        else if (document.all) {
            if (event.keyCode == hotkey && travel) { alert("操作错误.或许是您按错了按�?"); }
        }
    }

    document.onkeydown = gogo();
});

hpxAdminApp.controller('bankQueryController', function ($rootScope, $scope, $state, ngTableParams, addressService, bankService, customerService) {
    $scope.model = {
        "head_bank_id": null,
        "address_id": null,
        "keyword": null,
    }
    $scope.filter = {
        "findPrecise": false,
    }

    $scope.tableParams = new ngTableParams({ 'sorting': { 'bank_number': 'desc' } }, {
        getData: function (params) {
            if ($scope.filter.findPrecise) {
                return bankService.findSpecificBank($scope.filter.find_id).then(function (data) {
                    if (data) {
                        $scope.branchData = [data];
                        return [data];
                    } else {
                        swal('查询结果为空，建议使用模糊查询！');
                        return [];
                    }
                });
            } else {
                return bankService.getBank($scope.model.head_bank_id, $scope.model.address_id, $scope.model.keyword, params).then(function (data) {
                    $scope.branchData = data;
                    return data;
                });
            }
        }
    });

    //精确查询
    $scope.queryPrecise = function (id) {
        if (!id)
            return;
        if (id.length != 12) {
            swal("请输入正确的行号，行号长度为12位！");
            return;
        }
        $scope.filter.find_id = id;
        $scope.filter.findPrecise = true;
        $scope.tableParams.reload();
    }

    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        //$scope.model.address_id = $scope.model.province_id;
    });
    //获取对应省的�?
    $scope.provinceChange = function () {
        if ($scope.model.province_id == null) {
            return;
        }
        else {
            return addressService.getCity($scope.model.province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    //获取对应市的�?
    //$scope.cityChange = function () {
    //    if ($scope.model.city_id == null) {
    //        return;
    //    }
    //    else {
    //        return addressService.queryDstrict($scope.model.city_id).then(function (data) {
    //            $scope.AddressData = data;
    //            $scope.model.address_id = $scope.model.city_id;
    //        });
    //    }
    //}
    //获取所有的银行账户总行信息
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });

    //根据总行，所在市，关键字找到对应的分行数�?
    $scope.queryVague = function () {
        $scope.filter.findPrecise = false;
        if (($scope.model.head_bank_id && $scope.model.province_id && $scope.model.address_id) || $scope.model.keyword) {
            $scope.tableParams.reload();
        } else {
            swal("请省�?直辖�?、市级、银行名称填写完整后查询�?);
        }
    }

});

hpxAdminApp.controller('billCalendarController', function ($rootScope, $scope, $state, toolService) {
    var date = new Date();
    $scope.model = {
        "billTypeId": 101,
        "year": date.getFullYear(),
        "month": date.getMonth() + 1,
        "day": date.getDate(),
        "number": 6,
    }
    $scope.initModel = {};
    s = $scope.model.year;
    if ($scope.model.month < 10)
        s = s + '-0' + $scope.model.month;
    else
        s = s + '-'+$scope.model.month;
    if ($scope.model.day < 10)
        s = s + '-0' + $scope.model.day;
    else
        s = s + '-'+$scope.model.day;
    //$scope.todayStr = $scope.model.year + '-' + $scope.model.month + '-' + $scope.model.day;
    $scope.todayStr = s;    //当前日期字符�?
    angular.copy($scope.model, $scope.initModel);

    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }
    //初始化数�?设置最大查询允许月�?
    $scope.maxMonth = 2;
    function init_data() {
        $scope.allYears = new Array(20);
        $scope.allYears[0] = (date.getMonth() + 1) > 10 ? date.getFullYear() + 1 : date.getFullYear();
        for (var i = 1; i < $scope.allYears.length; i++)
            $scope.allYears[i] = $scope.allYears[i - 1] - 1;
        $scope.allMonths = $scope.getNumber((date.getMonth() + 1) > (12 - $scope.maxMonth) ? $scope.model.year > date.getFullYear() ? (date.getMonth() + 1 + $scope.maxMonth) % 12 : 12 : date.getMonth() + 1 + $scope.maxMonth);
        $scope.weekMap_en = {
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6,
            "Sunday": 7,
        };
        $scope.weekMap = {
            "星期一": 1,
            "星期�?: 2,
            "星期�?: 3,
            "星期�?: 4,
            "星期�?: 5,
            "星期�?: 6,
            "星期�?: 7,
        };
    }
    init_data();

    //reset
    $scope.reset = function () {
        $scope.model.day = $scope.initModel.day;
        $scope.setYear($scope.initModel.year);
        $scope.setMonth($scope.initModel.month);
    }
    $scope.setYear = function (year) {
        if ($scope.model.year != year) {
            if (date.getFullYear() <= year) {
                $scope.allMonths = $scope.getNumber((date.getMonth() + 1) > (12 - $scope.maxMonth) ? year > date.getFullYear() ? (date.getMonth() + 1 + $scope.maxMonth) % 12 : 12 : date.getMonth() + 1 + $scope.maxMonth);
            } else {
                $scope.allMonths = $scope.getNumber(12);
            }
            //判断不超过最大月�?
            if ($scope.allMonths[$scope.allMonths.length - 1] < $scope.model.month) {
                $scope.model.month = $scope.allMonths[$scope.allMonths.length - 1];
            }
            $scope.model.year = year;
            $scope.queryCalendar();
        }
    }
    $scope.setMonth = function (month) {
        if ($scope.model.month != month) {
            if ($scope.allMonths[$scope.allMonths.length - 1] < month) {
                return;
            }
            $scope.model.month = month;
            $scope.queryCalendar();
        }
    }

    //查询Calendar
    $scope.queryCalendar = function () {
        toolService.searchCalendar($scope.model.year, $scope.model.month, $scope.model.billTypeId, $scope.model.number).then(function (data) {
            $scope.calendarResult = new Array(5);
            var firstDayIndex = $scope.weekMap[data[0].week_name] - 1;
            var calendarPrev = new Array();
            for(var i=0;i<firstDayIndex;i++)
                calendarPrev.push({ "week_name": null, "bill_calendar_days": null })
            for (var i = 0; i < 6; i++) {
                if (i == 0)
                    $scope.calendarResult[i] = calendarPrev.concat(data.slice(0, 7 - firstDayIndex))
                else
                    $scope.calendarResult[i] = data.slice(i * 7 - firstDayIndex, i * 7 + 7 - firstDayIndex);
                if ($scope.calendarResult[i].length != 7) {
                    for (var j = 0; j < 7 - $scope.calendarResult[i].length; j++)
                        $scope.calendarResult[i].push({ "week_name": null, "bill_calendar_days": null });
                }
            }
        });
    }
    $scope.queryCalendar();

    $scope.refresh = function (id) {
        $scope.model.billTypeId = id;
        if (id = 102)
            $scope.model.number = 6;
        $scope.queryCalendar();
    }

    $scope.refreshCycle = function (cycle) {
        $scope.model.number = cycle;
        $scope.queryCalendar();
    }
});

hpxAdminApp.controller('businessQueryController', function ($rootScope, $scope, $state, customerService) {

    //公商查询
    $scope.query = function (name) {
        if (!name || name.length < 4) {
            swal("至少输入四个关键字！");
            return;
        }
        customerService.enterpriseDetail(name, 1).then(function (data) {
            $scope.enterpriseInfo = data;
            //if (data == null) {
            //    swal("查询无结果！");
            //}
        });
    }
    //查看详情
    $scope.read = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.model = data;
            $('#modal-read').modal('show');
        });
    };

});

hpxAdminApp.controller('calculatorController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //登录事件
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //登录功能，登录成功后跳转到个人中�?
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
    ////跳转到注册界�?
    //$scope.tosignup = function () {
    //    $state.go("app.signup");
    //}
    ////获取交易�?
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

    ////获取所有的银行账户信息，并显示是否为默认银行账�?
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

hpxAdminApp.controller('calendarController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //登录事件
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //登录功能，登录成功后跳转到个人中�?
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            $cookieStore.put('customer', data);

            // TODO
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };

    $scope.submitCalendar = function () {

    }


    //$scope.submitCalculator = function () {
    //    toolService.calculator($scope.calculatorModel).then(function (data) {
    //        $scope.calculatorResult = data;
    //    })
    //}

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
    ////跳转到注册界�?
    //$scope.tosignup = function () {
    //    $state.go("app.signup");
    //}
    ////获取交易�?
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

    ////获取所有的银行账户信息，并显示是否为默认银行账�?
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

hpxAdminApp.controller('customerAddressController', function ($scope, $rootScope, $state, ngTableParams, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };
    //获取客户对应的所有客户地址
    $scope.tableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getAllCustomerAddress(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新表格
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内�?
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };
    //若id为空，则新增客户地址；否则为更新客户地址
    $scope.save = function () {
        if ($scope.model.id == null) {
            customerService.addAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除客户地址信息
    $scope.remove = function (data) {
        swal({
            title: "确定要删除本条地址信息�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            customerService.removeAddress(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    };
});
hpxAdminApp.controller('customerController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {

    $scope.filter = {
        isModified : 0,
    };
    //默认客户类型为企业客�?
    $scope.model = {
        customer_type_code: 301
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图�?
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.provinceChange();
        if ($scope.model.trade_location_province_id != 1 || $scope.model.trade_location_province_id != 20 || $scope.model.trade_location_province_id != 860 || $scope.model.trade_location_province_id != 2462) {
            $scope.cityChange();
        }
        if (!$scope.model.job_photo_address) {
            $scope.model.job_photo_address = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.id_front_photo_address) {
            $scope.model.id_front_photo_address = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.id_back_photo_address) {
            $scope.model.id_back_photo_address = 'assets/img/hpx-15.jpg';
        }
    });
    //获取客户类型
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeData = data;
    })
    // 获取教育程度
    constantsService.queryConstantsType(21).then(function (data) {
        $scope.educationalStatus = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的�?
    $scope.provinceChange = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            if ($scope.filter.isModified == 1) {
                document.getElementById("tradCity").style.display = "none";
            }
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            if ($scope.filter.isModified == 1) {
                document.getElementById("tradCity").style.display = "block";
            }
            $scope.AddressData = null;
            return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    //获取对应市的�?
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
    //提示信息按钮
    $scope.Reminder = function () {
        $('#modal-license').modal('show');
    }
    //刷新页面信息
    $scope.reflash = function () {
        customerService.getCustomer().then(function (data) {
            $scope.model = data;
        });
    }
    //提交客户信息进行审核
    $scope.save = function () {
        if (!$scope.model.customer_name) {
            swal('请输入联系人�?);
            return;
        }

        swal({
            title: "是否确认提交?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            if ($scope.model.telephone_code && $scope.model.telephone_number_number)
                $scope.model.telephone_number = $scope.model.telephone_code + '-' + $scope.model.telephone_number_number;
            customerService.updateCustomer($scope.model).then(function (data) {
                swal({ 'title': '提交成功，请继续完善企业信息�? }, function () {
                    $state.go("app.main.enterpriseInfo");
                });
            });
        });
    };

    $scope.modified = function () {
        $scope.model.is_verified = 0;
        var tempList = $scope.model.telephone_number.split('-');
        $scope.model.telephone_code = tempList[0];
        $scope.model.telephone_number_number = tempList[1];
        $scope.filter.isModified = 1;
        setTimeout(function () {
            if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
                document.getElementById("tradCity").style.display = "none";
            }
        }, 50);
    };

    //获取文件的url
    $scope.getFileURL = function (id) {
        if (id != null) {
            return FILE_URL + '/file' + id;
        }
    }
    //上传文件
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //设置证件照片为上传的文件
    $scope.setJobID = function (response) {
        $timeout(function () {
            $scope.model.job_photo_id = response.data.data.id;
            $scope.model.job_photo_address = response.data.data.file_path;
        })
    };
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.id_front_photo_id = response.data.data.id;
            $scope.model.id_front_photo_address = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.id_back_photo_id = response.data.data.id;
            $scope.model.id_back_photo_address = response.data.data.file_path;
        })
    };
});
hpxAdminApp.controller('discountCalculatorController', function ($rootScope, $scope, $state, toolService) {
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
            swal('请输入票面金�?');
            return;
        }
        //通过利率计算
        if (!func) {
            if (!$scope.model.interest) {
                swal('请输入利�?');
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
                swal('请输入贴�?');
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
    //选择时间，请求是否假�?
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

});

hpxAdminApp.controller('editQuoteController', function ($rootScope, $scope, $timeout, $state, $stateParams, addressService, customerService, ngTableParams, billService, constantsService) {
    //判断是否可进行报价，不行就直接返�?
    if ($rootScope.identity.can_publish_offer != 1) {
        swal("您暂时还不能报价�?);
        window.history.back();
        return;
    }

    $scope.filter = {};

    //设置默认的内�?
    var emptyEntity = {
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        'offer_detail': {},
        'bill_style_id': 202,
        'deadline_type_code': 1701,
        'trade_type_id': 1801,
        'trade_background_code': 1601,
        'max_price_type': 0,
    };

    //获取客户信息中的省市地址信息
    init = function () {
        customerService.getCustomer().then(function (AddData) {
            if (AddData.trade_location_province_id && AddData.trade_location_city_id) {
                //addressService.queryAll().then(function (data) {
                //    console.log(data);
                //});
                //addressService.queryCity(data.trade_location_province_id).then(function (data) {
                //    $scope.CityData = data;
                //});
                $scope.model.trade_province_id = AddData.trade_location_province_id;
                if ($scope.model.trade_province_id == 1 || $scope.model.trade_province_id == 20 || $scope.model.trade_province_id == 860 || $scope.model.trade_province_id == 2462) {
                    $scope.filter.tradeProvinceId = $scope.model.trade_province_id + 1;
                    return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                        $scope.CityData = data;
                        $scope.model.trade_location_id = AddData.trade_location_id;
                    });
                } else {
                    return addressService.queryCity($scope.model.trade_province_id).then(function (data) {
                        $scope.CityData = data;
                        $scope.model.trade_location_id = AddData.trade_location_city_id;
                    });
                }

                
            }
        });
    };

    //如果id不为0，获取指定报价信�?
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
            $scope.provinceChange();
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
        init();
    }
    

    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取所有市级地址
    $scope.provinceChange = function () {
        if ($scope.model.trade_province_id == null) {
            return;
        } else if ($scope.model.trade_province_id == 1 || $scope.model.trade_province_id == 20 || $scope.model.trade_province_id == 860 || $scope.model.trade_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.trade_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取票据类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类�?
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
        console.log($scope)
        if ($scope.model.bill_style_id == 201 || $scope.model.bill_style_id == 203 || $scope.model.bill_style_id == 205) {
            if (!$scope.model.trade_location_id) {
                swal("请选择交易地点�?);
                return;
            }
        }

        $scope.model.offer_detail = JSON.stringify($scope.model.offer_detail);

        if ($scope.model.id == null) {
            //新增报价
            billService.insertBillOffer($scope.model).then(function (data) {
                swal('新增报价成功�?);
                $state.go('app.main.quote');
            });
        }
        else {
            //修改报价
            billService.updateBillOffer($scope.model).then(function (data) {
                swal('修改报价成功�?);
                $state.go('app.main.quote');
            });
        }
    };

    $scope.colse = function () {
        $state.go('app.main.quote');
    }
});
hpxAdminApp.controller('endorsementController', function ($rootScope, $scope, $timeout, $state, FILE_URL, Upload, billService, fileService) {
    //默认显示的图�?
    $scope.model = {
        'bill_front_photo_address': 'assets/img/hpx-14.jpg',
        'bill_back_photo_address': 'assets/img/hpx-15.jpg',
    };
    $scope.filter = {};
    //获取文件url
    $scope.getFileURL = function (id) {
        if (id != null) {
            return FILE_URL + '/file' + id;
        }
    }
    //上传文件
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //设置图片id，url
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_address = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_address = response.data.data.file_path;
        })
    };
    //保存上传的图片，并提示上传成�?
    $scope.save = function () {
        swal("图片上传成功�?);
        location.reload(false);
    };

});

hpxAdminApp.controller('enterpriseAccountController', function ($scope, $rootScope, $state, ngTableParams, API_URL, payingService, customerService, bankService, addressService, constantsService) {
    var emptyEntity = {  };
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        choiceBill: 1,
    };
    //获取账户类型
    constantsService.queryConstantsType(5).then(function (data) {
        $scope.accountTypeData = data;
    })
    //获取所有的银行账户信息，并显示是否为默认银行账�?
    $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getAllEnterpriseAccount().then(function (data) {
                $scope.first = $scope.getFirst(params);
                $scope.AccountData = data;
                for (var i = 0; i < $scope.AccountData.length; i++) {
                    if ($scope.AccountData[i].is_default == 1) {
                        $scope.AccountData[i].is_default = "�?;
                    } else {
                        $scope.AccountData[i].is_default = null;
                    }
                }
            });
        }
    });
    //获取宝付数据
    $scope.queryBaofu = function () {
        payingService.bfapi.queryBalance(1, 2).then(function (data) {
            if (data.member_id)
                $scope.baofuData = [data];
        })
    };
    $scope.queryBaofu();
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //设置为默认账�?
    $scope.default = function (item) {
        customerService.updateEnterpriseDefault(item).then(function (data) {
            $scope.tableParams.reload();
        });
    }
    //读取对应银行账户的详细信�?
    $scope.read = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-read').modal('show');
    };
    //获取对应银行账户的信息，用于修改银行账户信息
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        if ($scope.model.bank_name) {
            $scope.model.keyword = $scope.model.bank_name;
            $scope.BankChange();
        }
        $scope.model.keyword = null;
        $('#modal-add').modal('show');
    };
    //新增银行账户
    $scope.add = function (type) {
        if (type != null) {
            $scope.model = newEntity;
            $scope.model = {
                'account_person': $rootScope.identity.enterprise_name,
                'account_type_code': type,
            };
            $('#modal-add').modal('show');  // 显示增加银行账号的弹出窗�?
        }
    };

    $scope.submit = function () {
        if (!$scope.model.account_person) {
            swal("没有注册企业账户，请先注册企业账户再注册银行账户�?);
        } else {
            if ($scope.model.id == null) {
                //新增银行账户信息
                customerService.insertEnterpriseAccount($scope.model).then(function (data) {
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.addForm.$setPristine();
                    $('#modal-add').modal('hide');
                });
            }
            else {
                //更新银行账户信息
                if (!$scope.model.is_default) {
                    $scope.model.is_default = 1;
                } else {
                    $scope.model.is_default = null;
                }
                customerService.updateWnterpriseAccount($scope.model).then(function (data) {
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.addForm.$setPristine();
                    $('#modal-add').modal('hide');
                });
            }
        }
    };
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
        if ($scope.model.bankprovince) {
            return addressService.getCity($scope.model.bankprovince).then(function (data) {
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
    },
    //根据总行，所在市，关键字找到对应的分行数�?
    $scope.BankChange = function () {
        if ($scope.filter.HeadBankID || $scope.model.bankcity || $scope.model.keyword) {
            return bankService.getBank($scope.filter.HeadBankID, $scope.model.bankcity, $scope.model.keyword).then(function (data) {
                $scope.branchData = data;
                if ($scope.model.bankprovince) {
                    addressService.getCity($scope.model.bankprovince).then(function (Cdata) {       //获取对应省的地址信息，找到对应的id，把对应的addressname发给银行所在市
                        for (var i = 0; i < Cdata.length; i++) {
                            if ($scope.model.bankcity == Cdata[i].id) {
                                $scope.model.bank_city = Cdata[i].address_name;
                            };
                        }
                    });
                }
            });
        }
    },
    $scope.BankNumberChange = function () {
        bankService.getSpecificBank($scope.model.bank_id).then(function (data) {
            $scope.model.bank_number = data.bank_number;
        });
    }
    //删除银行账户
    $scope.remove = function (data) {
        swal({
            title: "确定要删除本银行账户�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            customerService.deleteEnterpriseAccount(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    };
    //弹出验证窗口
    $scope.verify = function (data) {
        $scope.model = data;
        $('#modal-verify').modal('show');
    };
    //调用后台功能进行自动验证
    $scope.verifySubmit = function () {
        if (parseInt($scope.model.verify_string) != 0) {
            swal('请输入不超过1元的金额!');
            return;
        }
        customerService.verify($scope.model.id, $scope.model.verify_string).then(function () {
            swal('验证成功�?);
            $scope.tableParams.reload();
            $('#modal-verify').modal('hide');
        });
    };
    //选择
    $scope.choiceBill = function (choose) {
        $scope.filter.choiceBill = choose;
        $scope.tableParams.reload();
    };
    //充值宝�?
    $scope.recharge = function (enterprise_id) {
        $scope.baofu_model = {
            'enterprise_id': enterprise_id,
            'operate': '充�?,
        }
        $('#modal-baofu').modal('show');
    }
    //充值提�?
    $scope.withdraw = function (enterprise_id) {
        $scope.baofu_model = {
            'enterprise_id': enterprise_id,
            'operate': '提现',
        }
        $('#modal-baofu').modal('show');
    }
    //提交宝付充值或者提�?
    $scope.baofuSubmit = function () {
        if ($scope.baofu_model.money && $scope.baofu_model.money <= 0) {
            swal("请输入大�?的金�?");
            return;
        }
        var target_url = API_URL + '/paying/bfapi/recharge';
        if ($scope.baofu_model.operate == "充�?) {
            target_url = target_url + '?enterpriseId=' + $scope.baofu_model['enterprise_id'] + '&money=' + $scope.baofu_model['money'];
        } else {
            target_url = target_url + '?token=' + $rootScope.identity['token'] + '&money=' + $scope.baofu_model['money'];
        }
        var newWindow = window.open("_blank");
        newWindow.location = target_url;
    }
});
hpxAdminApp.controller('enterpriseController', function ($scope, $rootScope, $interval, $timeout, $state, Upload, FILE_URL, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {
    var emptyEntity = { };
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.model2 = {
        'credential_photos': 'assets/img/hpx-14.jpg',
        //'credential_photos': 'assets/img/hpx-15.jpg',
    };
    if ($rootScope.identity.enterprise_id == -1 && $rootScope.identity.is_operator == 1) {
        swal('您已经被其他企业绑定为操作员,请重新登陆生�?')
    }
    $scope.filter = {};
    $scope.reloadModel = function () {
        customerService.getAllEnterprise().then(function (data) {
            $scope.model = data;
            if (!$scope.model.credential_photo_address) {
                $scope.model.credential_photo_address = 'assets/img/hpx-14.jpg';
            }
            if (!$scope.model.artificial_person_front_photo_address) {
                $scope.model.artificial_person_front_photo_address = 'assets/img/hpx-14.jpg';
            }
            if (!$scope.model.artificial_person_back_photo_address) {
                $scope.model.artificial_person_back_photo_address = 'assets/img/hpx-15.jpg';
            }
            angular.copy($scope.model, newEntity);
            // 获取操作员列�?
            if ($scope.model.is_verified && ($scope.model.is_verified == 1 || $scope.model.is_verified >= 3)) {
                $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
                    getData: function (params) {
                        return customerService.getEnterpriseMember().then(function (data) {
                            $scope.enterpriseMembers = data;
                        });
                    }
                });

            }
        });
    }
    $scope.reloadModel();
    //上传文件
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //设置证件照片为上传的文件
    $scope.setCredentialID = function (response) {
        $timeout(function () {
            $scope.model.credential_photo_id = response.data.data.id;
            $scope.model.credential_photo_address = response.data.data.file_path;
        })
    };
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.artificial_person_front_photo_id = response.data.data.id;
            $scope.model.artificial_person_front_photo_address = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.artificial_person_back_photo_id = response.data.data.id;
            $scope.model.artificial_person_back_photo_address = response.data.data.file_path;
        })
    };

    // 审核通过重新更改
    $scope.edit = function (needReload) {
        swal({
            title: "修改信息将导致重新审核！若银行账户已审核通过，在企业信息审核通过之后需重新进行账户审核与鉴权！是否确认修改?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            customerService.getAllEnterprise().then(function (data) {
                if (data.is_verified != 0) {
                    // 判断服务器是否被改为待更改状�?
                    customerService.updateEnterprise($scope.model).then(function (data) {
                        if (needReload)
                            $scope.reloadModel();
                    });
                }
            });
        });
    };
    // 保存企业信息
    $scope.save = function () {
        if (!$scope.model.credential_photo_id) {
            swal("请上传营业执照！");
            return;
        }
        if (!$scope.model.artificial_person_front_photo_id || !$scope.model.artificial_person_back_photo_id) {
            swal("请上传法人代表身份证�?);
            return;
        }
        if (_.isEqual($scope.model, newEntity)) {
            swal('请确认更改之后再次提交！');
            return;
        }
        if ($scope.model.id == null || $scope.model.id == 0) {
            customerService.insertEnterprise($scope.model).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    $scope.model = data;
                    // 注销重新登陆
                    swal("保存成功，请重新登陆生效�?);
                    //customerService.logout()
                    window.location.reload();
                });
            });
        } else {
            //$scope.edit(false)
            customerService.updateEnterprise($scope.model).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    swal("保存成功，请等待管理员审核！");
                    $scope.reloadModel();
                });
            });
        }
    };

    $scope.read = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-read').modal('show');
    };

    $scope.verifyStr = "获取验证�?;
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if ($scope.disableVerify)
            return;
        if (!$scope.model.operator_phone_number || $scope.model.operator_phone_number.length != 11) {
            swal('请输入正确的手机号码�?);
            return;
        }

        customerService.phoneVerify($scope.model.operator_phone_number).then(function () {
            swal('验证码已发�?);
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获�?;
                $scope.second--;

                if ($scope.second <= 0) {
                    $scope.verifyStr = "重新获取验证�?;
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };

    $scope.addOperater = function (data) {
        if (data != null) {
            $scope.model.id = 0;
            $scope.model.remove_phone_number = data.phone_number;
            $scope.model.operator_phone_number = $rootScope.identity.phone_number;
            $scope.is_remove = true;
        } else {
            $scope.is_remove = false;
        }
        $('#modal-add').modal('show');  // 显示增加操作员的弹出窗口
    };
    $scope.submitOperater = function () {
        if ($scope.is_remove) {
            return $scope.removeOperater($scope.model);
        }
        if ($scope.model.operator_phone_number_code.length == 6) {
            customerService.insertEnterpriseMember($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $('#modal-add').modal('hide');
            });
        } else {
            swal('请输入正确的验证码！');
        }
        $scope.second = 0;
    };

    $scope.removeOperater = function (data) {
        swal({
            title: "确定要删除该操作员吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            customerService.deleteEnterpriseMember(data).then(function (data) {
                $scope.tableParams.reload();
                $('#modal-add').modal('hide');
            });
        });
    };

});
hpxAdminApp.controller('evaluateController', function ($rootScope, $scope, $state, $timeout, $stateParams, $interval, FILE_URL, Upload, ngTableParams, orderService, billService, customerService, payingService, enterprisesService) {
    $scope.filter = {
        star:0,
    };
    $scope.evalutaModel = {
        description: null,
    };
    $scope.addevaluateModel = {
        additional_description:null,
    };
    $scope.model = {
        type_id: $stateParams.type_id,
        to_id: $stateParams.to_id,
        gettype:$stateParams.gettype,
        star: 0,
        bill_status_code: 810,
        order_status_id: 810,
        description: null,
        additional_description:null,
    };

    //发布方评�?
    $scope.clickimg1 = function () {
        var star = document.getElementById("star1");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 1;
    };
    $scope.clickimg2 = function () {
        var star = document.getElementById("star2");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 2;
    };
    $scope.clickimg3 = function () {
        var star = document.getElementById("star3");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 3;
    };
    $scope.clickimg4 = function () {
        var star = document.getElementById("star4");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 4;
    };
    $scope.clickimg5 = function () {
        var star = document.getElementById("star5");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 5;
    };
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $scope.model.star = $scope.filter.star;
        //$scope.model.description = $scope.evalutaModel.description;
        //console.log($scope.model.star);
        //console.log($scope.model.description);
        //$scope.model.star = 5;
        //$scope.filter.star = 0;
        //$scope.clickimg1 = function () {
        //    $scope.filter.star = 1;
        //    swal($scope.filter.star);
        //};
        //$scope.clickimg2 = function () {
        //    $scope.filter.star = 2;
        //};
        //$scope.clickimg3= function () {
        //    $scope.filter.star = 3;
        //};
        //$scope.clickimg4 = function () {
        //    $scope.filter.star = 4;
        //};
        //$scope.clickimg5 = function () {
        //    $scope.filter.star = 5;
        //};
        //$scope.filter.star = $scope.model.star;
       
        enterprisesService.insertAppraisal($scope.model).then(function (data) {
            $state.go('app.main.myBill');
        });
    };
    //$scope.enterprise = []
    //$scope.enterprise.push({
    //    'type_id': $scope.model.bill_type_id,
    //    'to_id': $scope.model.order_id,
    //    'star': $scope.model.star,
    //    'description': $scope.model.description,
    //});
    //追加评价
    $scope.showaddEvaluatesell = function () {
        $scope.addevaluatesell = {};
        $scope.model.additional_description = $scope.addevaluateModel.additional_description;
        $state.go('app.main.myBill');
    };
    init = function () {
        if ($scope.model.type_id == 101) {
            orderService.getOrder($scope.model.to_id).then(function (data) {
                $scope.orderModel = data;
                $scope.model.bill_status_code = data.bill_status_code;
                $scope.model.order_status_id = data.order_status_id;
                //console.log($scope.model.order_status_id);
                //console.log($scope.model.bill_status_code);

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        //swal("hello");
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                        //$scope.addevaluateModel = data;
                        console.log(data.drawer_appraisal);
                    });
                }
            });
        }else if ($scope.model.type_id==102) {
            billService.getBillProduct($scope.model.to_id).then(function (data) {
                $scope.billModel = data;
                $scope.model.bill_status_code = data.bill_status_code;
                //console.log($scope.model.bill_status_code);

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        //swal("hello");
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                        //$scope.addevaluateModel = data;
                    });
                }
            });
        };
       
    };
    init();

});
hpxAdminApp.controller('footerController', function ($rootScope, $scope, $state) {
     
});

hpxAdminApp.controller('forgetPasswordController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService) {
    $scope.model = {};
    $scope.verifyStr = "获取验证�?;
    $scope.disableVerify = false;
    $scope.update = function () {
        if ($scope.model.new_password != $scope.model.new_password2) {
            swal('两次密码输入不一致！');
            return;
        }

        //重置密码
        customerService.customerPasswordReset($scope.model.phone_number, $scope.model).then(function () {
            swal('新密码设置成功！')
            window.location.href = '/index.aspx';
        })
    }

    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            swal('请输入正确的手机号码�?);
            return;
        }

        customerService.phoneVerify($scope.model.phone_number).then(function () {
            swal('验证码已发�?);
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获�?;
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证�?;
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };
    //跳转到网站首�?
    $scope.tosignon = function () {
        $state.go("home");
    }
});

hpxAdminApp.controller('freeController', function ($rootScope, $scope, $state, customerService) {
});

hpxAdminApp.controller('headerController', function ($rootScope, $scope, $state, Restangular, customerService, $cookieStore) {
    //退出登录功能，退出后跳转到网站首�?
    $scope.logout = function () {
        swal({
            title: "确认要退出登录吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            customerService.customerLogout().then(function () {
                $cookieStore.put('customer', null);
                $rootScope.identity = null;
                Restangular.setDefaultHeaders({});
                window.location.href = '/index.aspx';
            });
        });
    };

    $scope.publishbill = function () {
        if ($rootScope.identity) {
            window.location.href = '/www/index.html#/app/main/publish';
        } else {
            swal("请先登录账号！\n登录后即可进行出票操作！");
        }
    }
    $scope.editQuoteaccount = function () {
        if ($rootScope.identity) {
            window.location.href = '/www/index.html#/app/main/editQuote';
        } else {
            swal("请先登录账号！\n登录后即可进行机构报价！");
        }
    }

});

hpxAdminApp.controller('homeController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //��¼�¼�
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //��¼���ܣ���¼�ɹ�����ת����������
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            $cookieStore.put('customer', data);

            // TODO
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };
    //��ȡ������Ϣ
    portalService.lastInformation(2).then(function (data) {
        $scope.news = data;
    });
    //��ȡ�жһ�������
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //��������
    portalService.lastInformation(3).then(function (data) {
        $scope.guides = data;
    });
    //��ת��ע�����
    $scope.tosignup = function () {
        $state.go("app.signup");
    }
    //��ȡ���׶�
    orderService.orderCount().then(function (data) {
        $scope.orderCount = data;
    });
    //��ȡ��ҳ��Ʊ������Ϣ
    billService.billProductElectronic().then(function (data) {
        $scope.billProductElectronic = data.bill_products;
    });
    //��ȡ��ҳֽƱ������Ϣ
    billService.billProductPaper().then(function (data) {
        $scope.billProductPaper = data.bill_products;
    });
    //��ȡ��ҳ����������Ϣ
    billService.billOfferPaper().then(function (data) {
        $scope.billOfferPaper = data.bill_offers;

        for (var i = 0; i < $scope.billOfferPaper.length; i++) {
            try {
                $scope.billOfferPaper[i].offer_detail = JSON.parse($scope.billOfferPaper[i].offer_detail);
            }
            catch (e) {
            }
        }
    });
    //toolService.interestRate().then(function (data) {
    //    $scope.interestRate = data;
    //});

    //toolService.priceTrend().then(function (data) {
    //    $scope.priceTrend = data;
    //}); 


    $scope.showCalculator = function () {
        $('#modal-calculator').modal('show');
    }

    $scope.submitCalculator = function () {
        toolService.calculator($scope.calculatorModel).then(function (data) {
            $scope.calculatorResult = data;
        })
    }

    $scope.showEnterprise = function () {
        $('#modal-enterprise').modal('show');
    }

    $scope.submitEnterprise = function () {
        customerService.enterpriseDetail($scope.enterpriseModel.keyword).then(function (data) {
            $scope.enterpriseResult = data[0];
        })
    }

    $scope.showBank = function () {
        $('#modal-bank').modal('show');
    }

    $scope.showCalendar = function () {
        $('#modal-calendar').modal('show');
    }

    $scope.submitCalendar = function () {

    }

    //��ȡ���е������˻���Ϣ������ʾ�Ƿ�ΪĬ�������˻�
    $scope.tableParams = new ngTableParams({ }, {
        getData: function (params) {
            if ($scope.filter.headBankId || $scope.filter.bankAddressId || $scope.filter.keyword) {
                return bankService.getBank($scope.filter.headBankId, $scope.filter.bankAddressId, $scope.filter.keyword).then(function (data) {
                    return data;
                });
            }
        }
    });
    //ˢ��
    $scope.submitBank = function () {
        $scope.tableParams.reload();
    }

    //��ȡ���е������˻�������Ϣ
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });

    //��ȡ���е�ʡ����ַ
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });

    //��ȡ��Ӧʡ���м���ַ
    $scope.ProvinceChange = function () {
        if ($scope.filter.bankprovince) {
            return addressService.getCity($scope.filter.bankprovince).then(function (data) {
                $scope.BankCityData = data;
                addressService.queryAll().then(function (Pdata) {       //��ȡ���еĵ�ַ��Ϣ���ҵ���Ӧ��id���Ѷ�Ӧ��addressname������������ʡ
                    for (var i = 0; i < Pdata.length; i++) {
                        if ($scope.model.bankprovince == Pdata[i].id) {
                            $scope.model.bank_province = Pdata[i].address_name;
                        };
                    }
                });
            });
        }
    }

    $scope.showCalendar = function () {
        $('#modal-calendar').modal('show');
    }
});

hpxAdminApp.controller('imgController', function ($rootScope, $scope, $state, $stateParams) {
    $scope.path = decodeURI($stateParams.path);
});

hpxAdminApp.controller('informationController', function ($rootScope, $scope, $state, $stateParams, $sce, portalService) {
    //��ȡָ��id�ķ�����Ϣ
    portalService.getInformation($stateParams.id).then(function (data) {
        $scope.model = data;
        $scope.detail = $sce.trustAsHtml(data.detail);
    });
});

hpxAdminApp.controller('informationListController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, portalService) {
    //��ȡ������Ϣ����
    portalService.getInformationType($stateParams.type).then(function (data) {
        $scope.typeName = data.information_type_name;
    });
    //��ȡ���з�����Ϣ
    portalService.queryInformation($stateParams.type).then(function (data) {
        $scope.informations = data;
    });
});

hpxAdminApp.controller('loadingController', function ($rootScope, $scope, $state) {
    $(document).scroll(function () {
        $(".loading-modal").css("height", document.body.scrollHeight);
        $(".loader").css("top", document.body.clientHeight * 0.35 + document.body.scrollTop);
    });
});

hpxAdminApp.controller('loginInfoController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService, $cookieStore, Restangular) {
    $scope.model = {};

   
});

hpxAdminApp.controller('loginsController', function () {
    
});

hpxAdminApp.controller('mainController', function ($rootScope, $scope, $state, $timeout, customerService, $cookieStore) {
    customerService.testLogin().then(function (data) {
        $rootScope.identity.can_publish = data.can_publish;
        $rootScope.identity.can_receive = data.can_receive;
        $rootScope.identity.can_bid_paper_bill = data.can_bid_paper_bill;
        $rootScope.identity.can_bid_electronic_bill = data.can_bid_electronic_bill;
        $rootScope.identity.can_sell_paper_bill = data.can_sell_paper_bill;
        $rootScope.identity.can_sell_electronic_bill = data.can_sell_electronic_bill;
        $rootScope.identity.can_see_bill_detail = data.can_see_bill_detail;
        $rootScope.identity.can_publish_offer = data.can_publish_offer;
        $rootScope.identity.can_see_offer_detail = data.can_see_offer_detail;
        $rootScope.identity.is_verified = data.is_verified;

        $cookieStore.put('customer', $rootScope.identity);
    })
});

hpxAdminApp.controller('menuController', function ($rootScope, $scope, $state, customerService) {
 
});

hpxAdminApp.controller('messageCenterController', function ($rootScope, $scope, $state, $interval, ngTableParams, $timeout, Upload, notisService) {
    $scope.filter = {
        choiceRead: 0,
        choiceMessageType: 1,
        MessageType:1.
    }
    //获取全部信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            //var newdate = new Date();
            //$scope.filter.time1 = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日�?
            //$scope.filter.time1 = $filter('date')(newdate, 'yyyy-MM-dd');

            return notisService.getNotification(params, $scope.filter.MessageType, $scope.filter.choiceRead, $scope.filter.time1, $scope.filter.time2).then(function (data) {
                $scope.first = $scope.getFirst(params);
                //$scope.model = data;
                return data;
            });
        }
    });

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //未读消息
    $scope.choiceNotRead = function () {
        $scope.filter.choiceRead = 0;

        $scope.tableParams.reload();
    };
    //已读消息
    $scope.choiceRead = function () {
        $scope.filter.choiceRead = 1;

        $scope.tableParams.reload();
    };
    //注册消息
    $scope.choiceEnrollMessage = function () {
        $scope.filter.choiceMessageType = 1;
        $scope.filter.MessageType = 1;

        $scope.tableParams.reload();
    }
    //订单消息
    $scope.choiceDrawerOrderMessage = function () {
        $scope.filter.choiceMessageType = 2;
        $scope.filter.MessageType = [2, 5];

        $scope.tableParams.reload();
    }
    //收票订单消息
    //$scope.choiceReceiverOrderMessage = function () {
    //    $scope.filter.choiceMessageType = 5;

    //    $scope.tableParams.reload();
    //}
    //票据消息
    $scope.choiceBillMessage = function () {
        $scope.filter.choiceMessageType = 3;
        $scope.filter.MessageType = [3,6];

        $scope.tableParams.reload();
    }
    //我的竞价票据消息
    //$scope.choiceBidMessage = function () {
    //    $scope.filter.choiceMessageType = 6;

    //    $scope.tableParams.reload();
    //}
    //其他消息
    $scope.choiceOtherMessage = function () {
        $scope.filter.choiceMessageType = 4;
        $scope.filter.MessageType = 4;

        $scope.tableParams.reload();
    }
    //获取对应的消息信息，弹出窗口
    $scope.read = function (item) {
        notisService.seeNotification(item.id).then(function (data) {
            $scope.model = data;
        });
        $('#modal-read').modal('show');
    };
    //删除某条消息
    $scope.remove = function (item) {
        swal({
            title: "确定要删除该消息?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            notisService.deleteNotification(item.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    }

    $scope.skip = function () {
        $('#modal-read').modal('hide');
        $timeout(function () {
            if ($scope.model.notification_type == 2) {
                $state.go('app.main.orderDrawerInfo', { 'id': $scope.model.notification_id });
            } else if ($scope.model.notification_type == 5) {
                $state.go('app.main.orderReceiverInfo', { 'id': $scope.model.notification_id });
            } else if ($scope.model.notification_type == 3) {
                $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 1 });
            } else if ($scope.model.notification_type == 4 && $scope.model.notification_id > 0) {
                $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 2 });
            } else if ($scope.model.notification_type == 6) {
                var loser = new RegExp("失败");
                if (loser.test($scope.model.notification_title)) {
                    $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 3 });
                } else {
                    $state.go('app.main.orderReceiverInfo', { 'id': $scope.model.notification_id });
                }
            }
        },300);
    }
});

hpxAdminApp.controller('modifyPasswordController', function ($rootScope, $scope, $state, billService, customerService, constantsService) {
    $scope.model = {
        password: null,
    };
    $scope.filter = {
        choicePassword: 1,
        choicePhoneNumber: 0,
    }
    $scope.update = function () {
        if (!$scope.model.password) {
            swal('请输入旧密码!');
            return;
        }
        if (!$scope.model.new_password) {
            swal('请输入新密码!');
            return;
        }

        if ($scope.model.new_password.length < 6 || $scope.model.re_new_password.length < 6) {
            swal('新密码长度不符合规定�?);
            return;
        }

        if ($scope.model.new_password != $scope.model.re_new_password) {
            swal('两次新密码输入不一致！');
            return;
        }

        //修改密码
        customerService.customerModifyPassword($scope.model).then(function () {
            swal('修改密码成功！请重新登陆�?)
            customerService.logout();
        })
    }

    customerService.getCustomer().then(function (data) {
        $scope.customerInfo = data;
    });
    $scope.changePhoneModel = {
        oldPhoneVerifyStr: '获取验证�?,
        newPhoneVerifyStr: '获取验证�?
    }
    $scope.getOldPhoneVerify = function () {
        customerService.getVerify($scope.customerInfo.phone_number, $scope.changePhoneModel, 'oldPhoneVerifyStr', 'disableOldPhoneVerify');
    }
    $scope.getNewPhoneVerify = function () {
        customerService.getVerify($scope.changePhoneModel.new_phone_number, $scope.changePhoneModel, 'newPhoneVerifyStr', 'disableNewPhoneVerify');
    }
    // 修改手机
    $scope.changePhone = function () {
        if (!$scope.changePhoneModel.phone_verify_code) {
            swal('请输入原手机验证�?');
            return;
        }
        if (!/^1(3|4|5|7|8)\d{9}$/.test($scope.changePhoneModel.new_phone_number)) {
            swal('请输入正确的新手机号�?');
            return;
        }
        if (!$scope.changePhoneModel.new_phone_verify_code) {
            swal('请输入新手机验证�?');
            return;
        }
        customerService.customerPhone($scope.changePhoneModel).then(function (data) {
            swal('修改手机号成功！');
        });
    }
    //注销
    $scope.tosignon = function () {
        customerService.logout()
    }

        //选择修改密码
    $scope.choicePassword = function () {
        $scope.filter.choicePassword = 1;
        $scope.filter.choicePhoneNumber = 0;
        if (document.getElementById("customerPassword").className == "billtypestyleprevious") {
            document.getElementById("customerPassword").className = "billtypestylecurrent";
            document.getElementById("password").style.color = "#fff";
            document.getElementById("customerPhone").className = "billtypestyleprevious";
            document.getElementById("phoneNumber").style.color = "#000";
        }

    };
    //选择手机绑定
    $scope.choicePhoneNumber = function () {
        $scope.filter.choicePhoneNumber = 1;
        $scope.filter.choicePassword = 0;
        if (document.getElementById("customerPhone").className == "billtypestyleprevious") {
            document.getElementById("customerPhone").className = "billtypestylecurrent";
            document.getElementById("phoneNumber").style.color = "#fff";
            document.getElementById("customerPassword").className = "billtypestyleprevious";
            document.getElementById("password").style.color = "#000";
        }

    };
});

hpxAdminApp.controller('myBiddingController', function ($rootScope, $scope, $state, $interval, ngTableParams, billService, orderService) {
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        status: null,
        iselectronic:0,
    };

    $scope.billsNumber = function () {
        billService.getBillsNumber($scope.filter.choiceBillType).then(function (data) {
            $scope.numberModel = data;
        })
    }
    $scope.billsNumber();
    //获取我的出价信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            if ($scope.filter.status >= 804 && $scope.filter.choiceBillType == 101) {
                return orderService.getOwnBiddingOrder(params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model = data;
                    //if ($scope.filter.choiceStatus == 880 || (($scope.filter.choiceStatus == 882 || $scope.filter.choiceStatus == 883) && $scope.filter.choiceBillType == 102)) {
                    if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].bill.status_code == 801 && data[i].bid_result ==0) {
                                data[i].bill.status_name = "已报�?;
                            }else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失效";
                            } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失败";
                            }
                            //if (data[i].bill.status_code == 801) {
                            //    data[i].bill.status_name = "已报�?;
                            //}
                            //if (data[i].bill.bill_type_id == 101 && (data[i].bill.status_code == 802 || data[i].bill.status_code == 803 || data[i].bill.status_code == 804)) {
                            //    data[i].bill.status_name = "待付�?;
                            //}
                            //if (data[i].bill.status_code == 809 && data[i].bill.bill_type_id == 102) {
                            //    data[i].bill.status_name = "达成交易协议";
                            //}
                            //if (data[i].bill.status_code == 810 && data[i].bill.bill_type_id == 102) {
                            //    data[i].bill.status_name = "交易完成";
                            //}
                        }
                    };
                    //if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                    //    for (var j = 0; j < data.length; j++) {
                    //        data[j].bill.remaining_day = data[j].bill.remaining_day + 1;
                    //    }
                    //};
                    if (($scope.filter.choiceBillType == 101 && ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881)) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill.bill_deadline_time)
                                data[j].bill.remaining_day = null;
                        };
                    }
                    return data;
                });
            } else {
                return billService.getOwnBillBidding(params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model = data;
                    if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].bill.status_code == 801 && data[i].bid_result == 0) {
                                data[i].bill.status_name = "已报�?;
                            } else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失效";
                            } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失败";
                            }
                        }
                    };
                    //if ($scope.filter.choiceStatus == 880 || (($scope.filter.choiceStatus == 882 || $scope.filter.choiceStatus == 883) && $scope.filter.choiceBillType == 102)) {
                    //    for (var i = 0; i < data.length; i++) {
                    //        if (data[i].bill.status_code == 801) {
                    //            data[i].bill.status_name = "已报�?;
                    //        }
                    //        if (data[i].bill.bill_type_id == 101 && (data[i].bill.status_code == 802 || data[i].bill.status_code == 803 || data[i].bill.status_code == 804)) {
                    //            data[i].bill.status_name = "待付�?;
                    //        }
                    //        if (data[i].bill_status_code == 809 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "达成交易协议";
                    //        }
                    //        if (data[i].bill_status_code == 810 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "交易完成";
                    //        }
                    //    }
                    //};
                    //if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                    //    for (var j = 0; j < data.length; j++) {
                    //        data[j].bill.remaining_day = data[j].bill.remaining_day + 1;
                    //    }
                    //};
                    //if ($scope.filter.choiceBillType == 102 && $scope.filter.choiceStatus == 882 && $scope.filter.status == 810) {
                    //    var data1 = [];
                    //    for (var l = 0; l < data.length; l++) {
                    //        if (data[l].bill.status_code == 809) {
                    //            data1.push(data[l]);
                    //        }
                    //    }
                    //    data = data1;
                    //};
                    //if ($scope.filter.choiceBillType == 102 && $scope.filter.choiceStatus == 883 && $scope.filter.status == 810) {
                    //    var data1 = [];
                    //    for (var l = 0; l < data.length; l++) {
                    //        if (data[l].bill.status_code == 810) {
                    //            data1.push(data[l]);
                    //        }
                    //    }
                    //    data = data1;
                    //};
                    if(($scope.filter.choiceBillType == 101 && ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881)) || $scope.filter.choiceBillType == 102){
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill.bill_deadline_time)
                                data[j].bill.remaining_day = null;
                        };
                    }
                    return data;
                });
            }
        }
    });

    //选择电票
    $scope.choiceEBillType = function () {
        //if (document.getElementById("electronicBill").className == "billtypestyleprevious") {
        //    document.getElementById("electronicBill").className = "billtypestylecurrent";
        //    document.getElementById("electronic").style.color = "#fff";
        //    document.getElementById("paperBill").className = "billtypestyleprevious";
        //    document.getElementById("paper").style.color = "#000";
        //}
        $scope.filter.choiceBillType = 101;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //选择纸票
    $scope.choicePBillType = function () {
        //if (document.getElementById("paperBill").className == "billtypestyleprevious") {
        //    document.getElementById("paperBill").className = "billtypestylecurrent";
        //    document.getElementById("paper").style.color = "#fff";
        //    document.getElementById("electronicBill").className = "billtypestyleprevious";
        //    document.getElementById("electronic").style.color = "#000";
        //}
        $scope.filter.choiceBillType = 102;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.iselectronic = 0;
        //if (document.getElementById("all").className == "billstatusstyleprevious") {
        //    document.getElementById("all").className = "billstatusstylecurrent";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    if ($scope.filter.choiceBillType == 101 && $scope.filter.iselectronic == 1) {
        //        document.getElementById("trade").className = "billstatusstyleprevious";
        //        document.getElementById("fail").className = "billstatusstyleprevious";
        //    }
        //}
        $scope.filter.choiceStatus = 880;
        $scope.filter.status = null;
        $scope.tableParams.reload();
    }
    //竞价
    $scope.choiceTradeStatusBidding = function () {
        $scope.filter.iselectronic = 0;
        //if (document.getElementById("bidding").className == "billstatusstyleprevious") {
        //    document.getElementById("bidding").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    if ($scope.filter.choiceBillType == 101 && $scope.filter.iselectronic == 1) {
        //        document.getElementById("trade").className = "billstatusstyleprevious";
        //        document.getElementById("fail").className = "billstatusstyleprevious";
        //    }
        //}
        $scope.filter.choiceStatus = 881;
        $scope.filter.status = 801;
        $scope.tableParams.reload();
    }
    //交易�?
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.iselectronic = 1;
        //if (document.getElementById("trade").className == "billstatusstyleprevious") {
        //    document.getElementById("trade").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    document.getElementById("fail").className = "billstatusstyleprevious";
        //}
        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 804;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = 809;
        }
        $scope.filter.choiceStatus = 882;
        $scope.tableParams.reload();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.iselectronic = 0;
        //if (document.getElementById("complete").className == "billstatusstyleprevious") {
        //    document.getElementById("complete").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //    if($scope.filter.choiceBillType == 101 && $scope.filter.iselectronic == 1){
        //        document.getElementById("trade").className = "billstatusstyleprevious";
        //        document.getElementById("fail").className = "billstatusstyleprevious";
        //    }
        //}
        $scope.filter.status = 810;
        $scope.filter.choiceStatus = 883;
        $scope.tableParams.reload();
    }
    //交易失败
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.iselectronic = 1;
        //if (document.getElementById("fail").className == "billstatusstyleprevious") {
        //    document.getElementById("fail").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //}
        //$scope.filter.choiceBillType = 101;
        $scope.filter.status = 816;
        $scope.filter.choiceStatus = 884;
        $scope.tableParams.reload();
    }

    $scope.delete = function (data) {
        billService.deleteBillBidding(data.id).then(function (result) {
            $scope.choiceTradeStatusBidding();
            $scope.billsNumber();
        })
    }


    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //自动刷新
    $scope.checkAutointerval = function () {
        var autointerval = document.getElementById("autointerval");
        if (autointerval.checked) {
            var timer = setInterval($scope.reflash(), 60 * 1000);
            //$interval($scope.reflash, 60 * 1000)
            //autointerval.checked = true;
        }else if (!autointerval.checked) {
            clearInterval(timer);
            //autointerval.checked = false;
        };
        //console.log(autointerval.checked);
    };


    $scope.show = function (data) {
        $scope.model = angular.copy(data);
    };

    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });

        $('#modal-bidding').modal('show');
    };

    $scope.finishBidding = function (item) {
        swal({
            title: "确认选择该收票人进行交易�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
                swal('确认交易方成功！');

                $scope.tableParams.reload();
                $('#modal-bidding').modal('hide');
            });
        });
    };
});

hpxAdminApp.controller('myBillController', function ($rootScope, $scope, $state, $interval, FILE_URL, ngTableParams, $timeout, Upload, billService, addressService, customerService, constantsService, bankService, fileService, orderService) {
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        choiceorder: 0,
        isTrade:0,
        status: null,
        isAlive: null,
        billStatusCode:null,
        //bill_status_code: [800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812],
        //is_checked:[-1,0,1],
    };
   
    //$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    //    getData: function (params) {
    //        return billService.getOwnBillProduct(params, 1).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});
    $scope.billsNumber = function () {
        billService.getBillsNumber($scope.filter.choiceBillType).then(function (data) {
            $scope.numberModel = data;
            //$scope.numberModel.all_ele_finished_failed_order_number = $scope.numberModel.all_ele_finished_order_number + $scope.numberModel.all_ele_failed_order_number;
        })
    }
    $scope.billsNumber();

    //获取我发布的票据信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            if ($scope.filter.status >= 809 && $scope.filter.choiceBillType == 101) {
                return orderService.getOwnOrder(params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model = data;
                    //if ($scope.filter.choiceStatus == 880 || (($scope.filter.choiceStatus == 884 || $scope.filter.choiceStatus == 883) && $scope.filter.choiceBillType == 102)) {
                    //    for (var i = 0; i < data.length; i++) {
                    //        if (data[i].bill_status_code == 809 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "达成交易协议";
                    //        }
                    //        if (data[i].bill_status_code == 810 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "交易完成";
                    //        }
                    //    }
                    //};
                    //if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) {
                    //    for (var j = 0; j < data.length; j++) {
                    //        data[j].remaining_day = data[j].remaining_day + 1;
                    //    }
                    //};
                    if ((($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) && $scope.filter.choiceBillType == 101) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill_deadline_time)
                                data[j].remaining_day = null;
                        };
                    }
                    return data;
                });
            } else {
                return billService.getOwnBillProduct(params, $scope.filter.choiceBillType, $scope.filter.isAlive, $scope.filter.billStatusCode).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model = data;
                    //if ($scope.filter.choiceStatus == 880 || (($scope.filter.choiceStatus == 884 || $scope.filter.choiceStatus == 883) && $scope.filter.choiceBillType == 102)) {
                    //    for (var i = 0; i < data.length; i++) {
                    //        if (data[i].bill_status_code == 809 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "达成交易协议";
                    //        }
                    //        if (data[i].bill_status_code == 810 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "交易完成";
                    //        }
                    //    }
                    //};
                    //if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) {
                    //    for (var j = 0; j < data.length; j++) {
                    //        data[j].remaining_day = data[j].remaining_day + 1;
                    //    }
                    //};
                    //if ($scope.filter.choiceBillType == 102 && $scope.filter.choiceStatus == 883 && $scope.filter.billStatusCode == 810) {
                    //    var data1 = [];
                    //    for (var l = 0; l < data.length; l++) {
                    //        if (data[l].bill_status_code == 809) {
                    //            data1.push(data[l]);
                    //        }
                    //    }
                    //    data = data1;
                    //};
                    //if ($scope.filter.choiceBillType == 102 && $scope.filter.choiceStatus == 884 && $scope.filter.billStatusCode == 810) {
                    //    var data1 = [];
                    //    for (var l = 0; l < data.length; l++) {
                    //        if (data[l].bill_status_code == 810) {
                    //            data1.push(data[l]);
                    //        }
                    //    }
                    //    data = data1;
                    //};
                    if ((($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) && $scope.filter.choiceBillType == 101) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill_deadline_time)
                                data[j].remaining_day = null;
                        };
                    }
                    return data;
                });
            }
        }
    });

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //选择电票
    $scope.choiceEBillType = function () {
        $scope.filter.choiceBillType = 101;

        //if (document.getElementById("electronicBill").className == "billtypestyleprevious") {
        //    document.getElementById("electronicBill").className = "billtypestylecurrent";
        //    document.getElementById("electronic").style.color = "#fff";
        //    document.getElementById("paperBill").className = "billtypestyleprevious";
        //    document.getElementById("paper").style.color = "#000";
        //}
        //$scope.filter.isAlive = null;
        //$scope.filter.status = null;
        //$scope.filter.billStatusCode = null;
        //$scope.filter.choiceorder = 0;
        //$scope.tableParams.reload();
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.choiceBillType = 102;

        //if (document.getElementById("paperBill").className == "billtypestyleprevious") {
        //    document.getElementById("paperBill").className = "billtypestylecurrent";
        //    document.getElementById("paper").style.color = "#fff";
        //    document.getElementById("electronicBill").className = "billtypestyleprevious";
        //    document.getElementById("electronic").style.color = "#000";
        //}
        //$scope.filter.isAlive = null;
        //$scope.filter.status = null;
        //$scope.filter.billStatusCode = null;
        //$scope.filter.choiceorder = 0;
        //$scope.tableParams.reload();
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.choiceStatus = 880;
        $scope.filter.isTrade = 0;
        //$scope.filter.is_checked = [-1, 0, 1];
        //$scope.filter.bill_status_code = [800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812];

        $scope.filter.isAlive = null;
        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.tableParams.reload();
    }
    //平台审核
    $scope.choiceTradeStatusCheck = function () {
        $scope.filter.choiceStatus = 881;
        //$scope.filter.is_checked = [-1, 0];
        //$scope.filter.bill_status_code = 800;
        $scope.filter.isAlive = 0;
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.tableParams.reload();
    }
    //发布�?
    $scope.choiceTradeStatusPublish = function () {
        $scope.filter.choiceStatus = 882;
        //$scope.filter.bill_status_code = 801;
        //$scope.filter.is_checked = 1;
        $scope.filter.isAlive = 1;
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.tableParams.reload();
    }
    //交易�?
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.choiceStatus = 883;
        $scope.filter.choiceorder = 1;
        $scope.filter.isTrade = 1;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 809;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = null;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.billStatusCode = 809;
            $scope.filter.isAlive = null;
            $scope.filter.status = null;
        };
        
        //$scope.filter.bill_status_code = [803, 804, 805, 806, 807, 808, 809];
        //$scope.filter.is_checked = 1;

        $scope.tableParams.reload();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.choiceStatus = 884;
        //$scope.filter.bill_status_code = [810, 811];
        //$scope.filter.is_checked = 1;
        $scope.filter.isTrade = 0;
        
        //document.getElementById("all").style.border = "1px solid #e8e8e8";
        //document.getElementById("check").style.border = "1px solid #e8e8e8";
        //document.getElementById("publish").style.border = "1px solid #e8e8e8";
        //document.getElementById("complete").style.border = "1px solid #f55a14";

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = null;
            $scope.filter.status = 810;
            $scope.filter.choiceorder = 1;
            $scope.tableParams.reload();
            //$scope.tableParams = new ngTableParams({}, {
            //    getData: function (params) {
            //        return orderService.getOwnOrder(params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
            //            $scope.first = $scope.getFirst(params);
            //            return data;
            //        });
            //    }
            //});
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = null;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = 810;
            $scope.tableParams.reload();
        }
    }
    //交易关闭
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.choiceStatus = 885;
        $scope.filter.isAlive = 1;
        $scope.filter.isTrade = 0;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.billStatusCode = null;
            $scope.filter.status = 816;
            $scope.filter.choiceorder = 0;
            $scope.tableParams.reload();
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = null;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = 816;
            $scope.tableParams.reload();
        }
    }
    //$(function () {
    //    $('#myTab a:first').tab('show');        //初始化显示哪个tab

    //    $('#myTab a').click(function (e) {
    //        e.preventDefault();         //阻止a链接的跳转行�? 
    //        $(this).tab('show');        //显示当前选中的链接及关联的content
    //    });
    //});

    //$scope.show = function (data) {
    //    $scope.model = angular.copy(data);
    //};
    //获取对应的票据的出价信息，弹出窗�?
    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });
        $('#modal-bidding').modal('show');
    };
    //选择交易方，隐藏弹窗
    $scope.finishBidding = function (item) {
        swal({
            title: "确认选择该收票人进行交易�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
                swal('确认交易方成功！');

                $scope.tableParams.reload();
                $('#modal-bidding').modal('hide');
            });
        });
    };
    //撤回某条发布
    $scope.remove = function (data) {
        if ($scope.model.bid_number > 0) {
            swal('该票据已经有公司出价，如需撤回，请联系管理员！');
            return;
        } else {
            swal({
                title: "确定要撤回该发布?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "�?,
                cancelButtonText: "�?,
                closeOnConfirm: true
            }, function () {
                billService.deleteBill(data.id).then(function (data) {
                    $scope.billsNumber();
                    $scope.tableParams.reload();
                });
            });
        }
    }
    //删除某条发布
    $scope.delete = function (data) {
        if ($scope.model.bid_number > 0) {
            swal('该票据已经有公司出价，如需撤回，请联系管理员！');
            return;
        } else {
            swal({
                title: "是否确认删除�?,
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "�?,
                cancelButtonText: "�?,
                closeOnConfirm: true
            }, function () {
                billService.deleteBill(data.id).then(function (data) {
                    $scope.billsNumber();
                    $scope.tableParams.reload();
                });
            });
        }
    }

    
    $scope.deleteOrder = function (data) {
        swal({
            title: "是否确认删除�?,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            orderService.deleteOrder(data.id).then(function (data) {
                $scope.billsNumber();
                $scope.tableParams.reload();
            });
        });
    }

    //获取所有的常量类型
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型信息
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类�?
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取电票瑕疵类型
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
    })
    //获取纸票瑕疵类型
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
    });
    //获取对应省的市级地址
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        }
        else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    //默认汇票到期�?
    $scope.billTypeChange = function () {
        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
    //文件上传
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //设置传递给后台的图片数据为上传的图片信�?
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
        })
    };

    //$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    //    getData: function (params) {
    //        return billService.getOwnBillProduct(params, 0).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});
    //编辑信息；获取对应省的市区数据；设置默认显示的图片信息；弹出窗口
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $scope.provinceChange();

        if (!$scope.model.bill_front_photo_path) {
            $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.bill_back_photo_path) {
            $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        }

        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.bill_type_id) {
            swal("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            swal("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            swal("请输入票面金�?);
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                swal("请上传汇票正�?);
                return;
            }
        }
        else {
            if (!$scope.model.acceptor_type_id) {
                swal("请选择承兑机构");
                return;
            }

            if (!$scope.model.acceptor_name) {
                swal("请输入承兑人名称");
                return;
            }

            if (!$scope.model.bill_deadline_time) {
                swal("请输入汇票到期日");
                return;
            }

            if (!$scope.model.contact_name) {
                swal("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                swal("请输入联系方�?);
                return;
            }
        }

        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {     //获取所有勾选的电票的瑕�?
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {     //获取所有勾选的纸票的瑕�?
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        //修改对应的我的发布，刷新列表，隐藏弹�?
        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    };
    //自动刷新
    $scope.checkAutointerval = function () {
        var autointerval = document.getElementById("autointerval");
        if (autointerval.checked) {
            var timer = setInterval($scope.reflash(), 60 * 1000);
            //$interval($scope.reflash, 60 * 1000)
            //autointerval.checked = true;
        }else if (!autointerval.checked) {
            clearInterval(timer);
            //autointerval.checked = false;
        };
        //console.log(autointerval.checked);
    };
});

hpxAdminApp.controller('myBillFailController', function ($rootScope, $scope, $state, FILE_URL, ngTableParams, $timeout, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
    })
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
    });
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        }
        else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    $scope.billTypeChange = function () {
        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
        })
    };

    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillProduct(params, 0).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $scope.provinceChange();

        if(!$scope.model.bill_front_photo_path) {
            $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.bill_back_photo_path) {
            $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        }

        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.bill_type_id) {
            swal("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            swal("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            swal("请输入票面金�?);
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                swal("请上传汇票正�?);
                return;
            }
        }
        else {
            if (!$scope.model.acceptor_type_id) {
                swal("请选择承兑机构");
                return;
            }

            if (!$scope.model.acceptor_name) {
                swal("请输入承兑人名称");
                return;
            }

            if (!$scope.model.bill_deadline_time) {
                swal("请输入汇票到期日");
                return;
            }

            if (!$scope.model.contact_name) {
                swal("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                swal("请输入联系方�?);
                return;
            }
        }

        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }

        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    }
});

hpxAdminApp.controller('orderDrawerController', function ($rootScope, $scope, $timeout, $state, FILE_URL, Upload, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取我的出票订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return orderService.getOwnOrderDrawer(params).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
            
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取出票订单对应id的详细信�?
    $scope.read = function (item) {
        orderService.getOrder(item.id).then(function (data) {
            $scope.model = data;
        });
    };
});

hpxAdminApp.controller('orderDrawerInfoController', function ($rootScope, $scope, $state, $timeout, $stateParams, $interval, FILE_URL, Upload, ngTableParams, orderService, customerService, payingService, billService) {
    $scope.filter = {
        buttonClicked:0,
    };
    $scope.model = {
        order_pay_type_id: 1202,
    };
    //获取出票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }
    init = function () {
        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;

            //if ($scope.model.bill_flaw_ids[0]==1500) {
            //    $scope.model.bill_flaw_names[0] = "无瑕�?;
            //}
            //$scope.model.remaining_day = $scope.model.remaining_day + 1;

            //if ($scope.model.bill_type_id == 101) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.bid_rate * $scope.model.remaining_day / 100 / 360).toFixed(3);
            //} else if ($scope.model.bill_type_id == 102) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.bid_rate * $scope.model.remaining_day / 1000 / 30).toFixed(3);
            //}
            //$scope.model.bid_deal_price = $scope.model.bill_sum_price - $scope.model.bid_rate_price;
            //$scope.model.order_total_price = $scope.model.bid_deal_price;


            if ($scope.model.order_status_id == 804) {
                $scope.model.order_status_name = "确认交易对手";
                //等待时间
                waitTime();
                //var newdate = new Date().getTime();
                //var waitdate = newdate - $scope.model.order_time;
                //if (waitdate > 60 * 1000) {
                //    var waitTime = new Date(waitdate);
                //    $scope.filter.waitTimeD = waitTime.getDate();
                //    if ($scope.filter.waitTimeD > 2) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24 ;
                //    } else if ($scope.filter.waitTimeD > 1) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
                //    } else {
                //        $scope.filter.waitTimeH = waitTime.getHours()-8;
                //    }
                //    $scope.filter.waitdateM = waitTime.getMinutes();
                //    $scope.filter.waitdateS = waitTime.getSeconds();
                //    $scope.filter.differential = 60 - $scope.filter.waitdateS;

                //    $interval(function () {
                //        if($scope.filter.waitdateS<59){
                //            $scope.filter.waitdateS++;
                //        } else if ($scope.filter.waitdateS >= 60) {
                //            $scope.filter.waitdateS = $scope.filter.waitdateS % 60;
                //        }
                //        if ($scope.filter.waitdateS == 59) {
                //            //$scope.filter.waitdateS = $scope.filter.waitdateS % 60;
                //            init();
                //            //window.location.reload();
                //        }
                //    }, 1000);
                //} else {
                //    $scope.filter.waitTimeH = 0;
                //    $scope.filter.waitdateM = 0;
                //    $scope.filter.waitdateS = 0;
                //}
            }

            if ($scope.model.bill_status_code < 807) {
                $scope.model.bill_status_name = "未背�?;
            } else if ($scope.model.bill_status_code >= 807) {
                $scope.model.bill_status_name = "已背�?;
            }

            if ($scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                //等待时间
                waitTime();
            }
            //获取评价
            //if ($scope.model.order_status_id >= 810) {
            //    if ($scope.model.bill_type_id == 101) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (result) {
            //            $scope.drawerAppraisalModel = result.drawer_appraisal;
            //            $scope.receiverAppraisalModel = result.receiver_appraisal;
            //        });
            //    } else if ($scope.model.bill_type_id == 102) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (result) {
            //            $scope.drawerAppraisalModel = result.drawer_appraisal;
            //            $scope.receiverAppraisalModel = result.receiver_appraisal;
            //        });
            //    }
            //}

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            });
        });
    }
    init();

    waitTime = function () {
        var newdate = new Date().getTime();
        if ($scope.model.order_status_id == 804) {
            var waitdate = newdate - $scope.model.order_time;
        } else {
            var waitdate = newdate - $scope.model.order_update_time;
        }
        if (waitdate > 1000) {
            var waitTime = new Date(waitdate);
            $scope.filter.waitTimeD = waitTime.getDate();
            if ($scope.filter.waitTimeD > 2) {
                $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24;
            } else if ($scope.filter.waitTimeD > 1) {
                $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
            } else {
                $scope.filter.waitTimeH = waitTime.getHours() - 8;
            }
            $scope.filter.waitdateM = waitTime.getMinutes();
            $scope.filter.waitdateS = waitTime.getSeconds();
        } else {
            $scope.filter.waitTimeH = 0;
            $scope.filter.waitdateM = 0;
            $scope.filter.waitdateS = 0;
        }
    }
    //interval = function () {
    //    if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
    //        $interval(function () {
    //            //if ($scope.filter.waitdateS < 59) {
    //            //    $scope.filter.waitdateS++;
    //            //} else if ($scope.filter.waitdateS >= 60) {
    //            //    $scope.filter.waitdateS = $scope.filter.waitdateS % 60;
    //            //}
    //            waitTime();
    //            if ($scope.filter.waitdateS == 59) {
    //                init();
    //            }
    //        }, 1000);
    //    }
    //}
    //interval();
    

    //支付手续�?
    $scope.payCommission = function () {
        swal({
            title: "确定要支付手续费�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            orderService.orderPayCommission($scope.model.id).then(function () {
                payingService.GetPlatformAccount().then(function (data) {
                    $scope.PlatformData = data;
                })
                if ($scope.PlatformData.platform_account_balance > $scope.model.receiver_commission) {
                    swal('手续费支付成功！');
                } else {
                    swal('账户余额不足！请充值！');
                }

                init();
                $('#modal-edit').modal('hide');
            });
        });
    };

    customerService.getAllEnterpriseAccount(501).then(function (data) {
        $scope.accounts = data;
    })
    //弹出背书窗口
    $scope.showEndorsement = function () {
        $scope.endorsements = [];

        $scope.model.drawer_account_id = null;
        $('#modal-endorsement').modal('show');

        $scope.filter.buttonClicked = 1;

        $timeout(function () {
            $('.jqzoom').imagezoom();
        });
    };
    //文件上传
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //增加背书
    $scope.model.endorsement_file = [];
    $scope.add = function (response) {
        $timeout(function () {
            $scope.endorsements.push({
                'endorsement_id': response.data.data.id,
                'endorsement_address': response.data.data.file_path,
                'endorsement_file_name': response.data.data.file_name
            });
            $scope.model.endorsement_file = $scope.endorsements;
            $timeout(function () {
                $('.jqzoom').imagezoom();
            });
            if ($scope.model.endorsement_file.length > 2) {
                swal("背书文件最多上传两�?);
                return;
            }
        });
    }
    //删除背书图片
    $scope.remove = function (index) {
        swal({
            title: "确定要删除该文件�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            $scope.endorsements.splice(index, 1);
        });
    };
    //上传出票方背�?
    $scope.endorsement = function () {
        //if (!$scope.model.drawer_account_id) {
        //    swal("请选择收款账号�?);
        //    return;
        //}
        if (!$scope.model.verify_code || $scope.model.verify_code.length != 6) {
            swal("请输入正确的短信验证码！");
            return;
        }
        swal({
            title: "是否确认已背�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            var model = {
                endorsement_id_list: [],
                endorsement_messages: [],
                //drawer_account_id: $scope.model.drawer_account_id,
                verify_code: $scope.model.verify_code
            };
            for (var i = 0; i < $scope.endorsements.length; i++) {
                model.endorsement_id_list.push($scope.endorsements[i].endorsement_id);
                model.endorsement_messages.push($scope.endorsements[i].endorsement_message);
            }
            //orderService.updateOrderAccountDrawer($scope.model.id, $scope.model.drawer_account_id).then(function (data) {
            orderService.orderEndorsement($scope.model.id, model).then(function () {
                swal('出票方背书成功！');
                window.location.reload();
                //init();
                $('#modal-endorsement').modal('hide');
                //$('#modal-edit').modal('hide');
            });
            //});
        });
    };
    //删除已上传的出票方背�?
    $scope.deleteEndorsement = function () {
        swal({
            title: "是否要删除已上传的出票方背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            orderService.deleteOrderEndorsement($scope.model.id).then(function () {
                swal('背书删除成功，请重新上传�?);

                init();
                $('#modal-edit').modal('hide');
            });
        });
    };
    //发布方评�?
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $state.go('app.main.evaluate', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: 1 });
    };

    //$scope.enterprise=[]
    //$scope.enterprise.push({
    //    'type_id': $scope.model.bill_type_id,
    //    'to_id':$scope.model.order_id,
    //    'star':$scope.model.star,
    //    'description':$scope.model.description,
    //});
  
    //追加评价
    $scope.showaddEvaluatesell = function () {
        $scope.addevaluatesell = {};
        $('#modal-addevaluatesell').modal('show');
    }
    //弹出更新物流信息窗口
    $scope.showLogistic = function () {
        $scope.logisticModel = {};
        $('#modal-logistic').modal('show');
    };
    //更新物流信息
    $scope.addLogistic = function () {
        orderService.orderLogistics($scope.model.id, $scope.logisticModel).then(function () {
            swal('更新物流信息成功�?);

            init();
            $('#modal-logistic').modal('hide');
        });
    };

    
    $scope.verifyStr = "获取验证�?;
    $scope.disableVerify = false;
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        $scope.filter.phone_number = $rootScope.identity.phone_number;
        customerService.phoneVerify($scope.filter.phone_number).then(function () {
            swal('验证码已发�?);
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获�?;
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证�?;
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };
    //选择收款账户
    $scope.accountChange = function () {
        customerService.getEnterpriseAccount($scope.model.drawer_account_id).then(function (data) {
            $scope.accountModel = data;
        })
    };
    //一分钟自动刷新
    $scope.countDown = function (scopeStr) {
        var flag = 0;
        $scope[scopeStr] = 3;
        $scope[scopeStr + '_flag'] = 1;
        $interval(function () {
            $scope[scopeStr] = $scope[scopeStr] != 3 ? $scope[scopeStr] + 1 : 0;
            if ($scope[scopeStr + '_flag'] <= 60) {
                $scope[scopeStr + '_flag']++;
                if ($scope[scopeStr + '_flag'] == 61) {
                    flag++;
                    if ($scope.filter.buttonClicked == 1) {
                        $scope[scopeStr + '_flag'] = 1;
                    } else if(flag==3){
                        init();
                        $scope[scopeStr + '_flag'] = 1;
                        flag = 0;
                    }
                }
            } else {
                $scope[scopeStr + '_flag'] = 1;
            }
            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                waitTime();
            }
        }, 1000);
    }
    $scope.countDown('countValue');

    //展开收缩
    $scope.billshowhide = function () {
        var accordion = document.getElementById("billaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
    }
    //确认成交
    $scope.submitbillnew = function () {
        billService.finishBillNew($scope.model.id).then(function (data) {
            swal("已成功确认成交！");
            window.location.reload();
        });
    }

});

hpxAdminApp.controller('orderReceiverController', function ($rootScope, $scope, $state, API_URL, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取我的收票订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return orderService.getOwnOrderReceiver(params).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取收票订单对应id的票据详�?
    $scope.read = function (item) {
        orderService.getOrder(item.id).then(function (data) {
            $scope.model = data;
        });
    };
});

hpxAdminApp.controller('orderReceiverInfoController', function ($rootScope, $scope, $timeout, $state, $stateParams, $interval, API_URL, ngTableParams, orderService, customerService, payingService, constantsService, enterprisesService) {
    $scope.filter = {
        buttonClicked:0,
    };
    $scope.model = {
        order_pay_type_id : 1202,
    }
    //获取收票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }
    init = function () {
        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;

            //if ($scope.model.bill_flaw_ids[0] == 1500) {
            //    $scope.model.bill_flaw_names[0] = "无瑕�?;
            //}

            //$scope.model.remaining_day = $scope.model.remaining_day + 1;

            //if ($scope.model.bill_status_code < 807) {
            //    $scope.model.order_status_name = "未背�?;
            //} else if ($scope.model.bill_status_code >= 807) {
            //    $scope.model.order_status_name = "已背�?;
            //}

            //if ($scope.model.bill_type_id == 101) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.order_rate * $scope.model.remaining_day / 100 / 360).toFixed(3);
            //} else if ($scope.model.bill_type_id == 102) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.order_rate * $scope.model.remaining_day / 1000 / 30).toFixed(3);
            //}
            //$scope.model.bid_deal_price = $scope.model.bill_sum_price - $scope.model.bid_rate_price;
            //$scope.model.order_total_price = $scope.model.bid_deal_price;

            //if ($scope.model.order_status_id > 810) {
            //    if ($scope.model.bill_type_id == 101) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
            //            $scope.drawerAppraisalModel = data.drawer_appraisal;
            //            $scope.receiverAppraisalModel = data.receiver_appraisal;
            //        });
            //    } else if ($scope.model.bill_type_id == 102) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
            //            $scope.drawerAppraisalModel = data.drawer_appraisal;
            //            $scope.receiverAppraisalModel = data.receiver_appraisal;
            //        });
            //    }
            //}

            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                //等待时间
                waitTime();
                //var newdate = new Date().getTime();
                //var waitdate = newdate - $scope.model.order_update_time;
                //if (waitdate > 60 * 1000) {
                //    var waitTime = new Date(waitdate);
                //    $scope.filter.waitTimeD = waitTime.getDate();
                //    if ($scope.filter.waitTimeD > 2) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24;
                //    } else if ($scope.filter.waitTimeD > 1) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
                //    } else {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8;
                //    }
                //    $scope.filter.waitdateM = waitTime.getMinutes();
                //} else {
                //    $scope.filter.waitTimeH = 0;
                //    $scope.filter.waitdateM = 0;
                //}
            }

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            });
        });
        //customerService.getEnterpriseAccount($scope.model.drawer_account_id).then(function (data) {
        //    $scope.drawerAccountModel = data;
        //});
    }
    init();

    waitTime = function () {
        var newdate = new Date().getTime();
        if ($scope.model.order_status_id == 804) {
            var waitdate = newdate - $scope.model.order_time;
        } else {
            var waitdate = newdate - $scope.model.order_update_time;
        }
        if (waitdate > 1000) {
            var waitTime = new Date(waitdate);
            $scope.filter.waitTimeD = waitTime.getDate();
            if ($scope.filter.waitTimeD > 2) {
                $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24;
            } else if ($scope.filter.waitTimeD > 1) {
                $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
            } else {
                $scope.filter.waitTimeH = waitTime.getHours() - 8;
            }
            $scope.filter.waitdateM = waitTime.getMinutes();
            $scope.filter.waitdateS = waitTime.getSeconds();
        } else {
            $scope.filter.waitTimeH = 0;
            $scope.filter.waitdateM = 0;
            $scope.filter.waitdateS = 0;
        }
    }

    //图片放大镜功�?
    if ($stateParams.id) {
        if ($scope.model.bill_front_photo_path) {
            $('.jqzoom').imagezoom();
        }
    }
    //获取背书账号
    customerService.getAllEnterpriseAccount(502).then(function (data) {
        $scope.accounts = data;
        $scope.addressModel = {};
        $scope.addressModel.receiver_account_id = data[0].id;
    })
    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })

    //获取企业对应的收货地址信息
    customerService.getAllCustomerAddress().then(function (data) {
        $scope.addresses = data;
    })
    //支付手续�?
    $scope.payCommission = function () {
        swal({
            title: "确定要支付手续费�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            orderService.orderPayCommission($scope.model.id).then(function () {
                payingService.GetPlatformAccount().then(function (data) {
                    $scope.PlatformData = data;
                })
                if ($scope.PlatformData.platform_account_balance > $scope.model.receiver_commission) {
                    swal('手续费支付成功！');
                } else {
                    swal('账户余额不足！请充值！');
                }

                init();
                $('#modal-edit').modal('hide');
            });
        });
    };
    //弹出付款窗口
    $scope.showPay = function () {
        customerService.getAllEnterpriseAccount(502).then(function (data) {
            $scope.accounts = data;
        });
        $scope.model.receiver_account_id = null;
        //$scope.model.order_pay_type_id = null;
        $scope.model.order_pay_type_id = 1203;
        $scope.model.verifyCode = null;
        $('#modal-address').modal('show');

        $scope.filter.buttonClicked = 1;
    };
    //支付票款
    $scope.pay = function () {
        if (!$scope.model.verifyCode || $scope.model.verifyCode.length != 6) {
            swal("请输入正确的短信验证码！");
        } else if (!$scope.model.receiver_account_id) {
            swal("请选择背书账号�?);
        } else {
            swal({
                title: "确定要支付票据款?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "�?,
                cancelButtonText: "�?,
                closeOnConfirm: true
            }, function () {
                var newWin = window.open('loading page');
                orderService.updateOrderAccountReceiver($scope.model.id, $scope.model.receiver_account_id).then(function (data) {
                    orderService.updateOrderReceiver($scope.model.id, $scope.model).then(function () {
                        newWin.location.href = API_URL + '/orders/orderPay/' + $scope.model.id.toString() + '?orderPayTypeId=' + $scope.model.order_pay_type_id.toString() + '&phone=' + $rootScope.identity.phone_number.toString() + '&verifyCode=' + $scope.model.verifyCode.toString() + '&token=' + $rootScope.identity.token;;
                        //window.open(API_URL + '/orders/orderPay/' + $scope.model.id.toString());
                        $('#modal-address').modal('hide');
                        // 确认支付成功提示
                        $('#modal-pay-confirm').modal('show');
                    });
                });
            });
        }
    };

    $scope.refresh = function () {
        window.location.reload();
        $('#modal-pay-confirm').modal('hide');
    };
    //确认签收
    $scope.showendorsements = function () {
        $('#modal-endorsements').modal('show');
        $timeout(function () {
            $('.jqzoom').imagezoom();
        });

        $scope.filter.buttonClicked = 1;
    }

    //发布方评�?
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $state.go('app.main.evaluate', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: 3 });
    };
    //$scope.enterprise = []
    //$scope.enterprise.push({
    //    'type_id': $scope.model.bill_type_id,
    //    'to_id': $scope.model.order_id,
    //    'star': $scope.model.star,
    //    'description': $scope.model.description,
    //});
    
   //签收背书
    $scope.confirm = function () {
        swal({
            title: "确认签收背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            if ($scope.model.order_pay_type == 1203) {
                var newWin = window.open('loading page');
                newWin.location.href = API_URL + '/orders/orderConfirm/' + $scope.model.id.toString() + '?token=' + $rootScope.identity.token;
                //init();
                window.location.reload();
                $('#modal-endorsements').modal('hide');
                swal('背书签收完成�?);
            } else {
                orderService.orderConfirm($scope.model.id, $rootScope.identity.token).then(function () {
                    swal('背书签收完成�?);
                    //init();
                    window.location.reload();
                    $('#modal-endorsements').modal('hide');
                });
            }
        });
    };
    //签收背书
    $scope.validate = function () {
        swal({
            title: "确认签收背书?",
            text: "如果未经核实进行操作，后果自负！！！",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            if ($scope.model.order_pay_type==1203) {
                var newWin = window.open('loading page');
                newWin.location.href = API_URL + '/orders/orderConfirm/' + $scope.model.id.toString() + '?token=' + $rootScope.identity.token;
                //init();
                window.location.reload();
                $('#modal-endorsements').modal('hide');
                swal('背书签收完成�?);
            } else {
                orderService.orderConfirm($scope.model.id, $rootScope.identity.token).then(function () {
                    swal('背书签收完成�?);
                    //init();
                    window.location.reload();
                    $('#modal-endorsements').modal('hide');
                });
            }
        });
    }

    $scope.verifyStr = "获取验证�?;
    $scope.disableVerify = false;
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        $scope.filter.phone_number = $rootScope.identity.phone_number;
        customerService.phoneVerify($scope.filter.phone_number).then(function () {
            swal('验证码已发�?);
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获�?;
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证�?;
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };

    $scope.accountChange = function () {
        customerService.getEnterpriseAccount($scope.model.receiver_account_id).then(function (data) {
            $scope.accountModel = data;
        })
    };



    //window.onload = function () {
    //    var newtime = Date();
    //    $scope.waitminute = newtime - $scope.model.order_time;

    //    $interval(function () {
    //        $scope.second--;

    //        if ($scope.second == 0) {
    //            init();
    //        }
    //    }, 1000, 60);
    //};

    //一分钟自动刷新
    $scope.countDown = function (scopeStr) {
        var flag = 0;
        $scope[scopeStr] = 3;
        $scope[scopeStr + '_flag'] = 1;
        $interval(function () {
            $scope[scopeStr] = $scope[scopeStr] != 3 ? $scope[scopeStr] + 1 : 0;
            if ($scope[scopeStr + '_flag'] <= 60) {
                $scope[scopeStr + '_flag']++;
                if ($scope[scopeStr + '_flag'] == 61) {
                    flag++;
                    if ($scope.filter.buttonClicked == 1) {
                        $scope[scopeStr + '_flag'] = 1;
                    } else if(flag==3){
                        init();
                        $scope[scopeStr + '_flag'] = 1;
                        flag = 0;
                    }
                }
            } else {
                $scope[scopeStr + '_flag'] = 1;
            }
            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                waitTime();
            }
        }, 1000);
    }
    $scope.countDown('countValue');

    //展开收缩
    $scope.billshowhide = function () {
        var accordion = document.getElementById("billaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
    }


});

hpxAdminApp.controller('orderWaitController', function ($rootScope, $scope, $stateParams, $state, ngTableParams, billService, constantsService, orderService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
    };
    //获取支付方式类型
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.payTypes = data;
    })

   //获取账户所有的待确认订�?
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return billService.getOrderWait(params).then(function (data) {
               // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取对应id的待确认交易的票据详情，弹出窗口
    $scope.edit = function (item) {
        $scope.model = item;

        $('#modal-edit').modal('show');
        $('.jqzoom').imagezoom();
    };

    //$scope.showFront = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    //}
    //$scope.showBack = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    //}
    //选择支付方式，确认交�?
    $scope.confirm = function () {
        if (!$scope.model.order_pay_type_id) {
            swal("请选择支付方式�?)
        }
        else {
            swal({
                title: "确认该交易吗?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "�?,
                cancelButtonText: "�?,
                closeOnConfirm: true
            }, function () {
                billService.confirmOrderWait($scope.model.id, { 'is_confirm': 1, 'order_pay_type_id': $scope.model.order_pay_type_id }).then(function (data) {
                    swal('确认交易成功�?);

                    $scope.tableParams.reload();
                    $('#modal-edit').modal('hide');
                    $('#modal-appraisal').modal('show');
                });
            });
        }
    };
    //提交评价
    $scope.submit = function () {
        swal({
            title: "确认提交该评价吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            orderService.orderAppraisal($scope.model.id, { 'appraisal_message': $scope.model.appraisal_message }).then(function (data) {
                swal('确认评价成功�?);

                $scope.tableParams.reload();
                $('#modal-appraisal').modal('hide');
            });
        });
    };
    //拒绝交易
    $scope.reject = function () {
        swal({
            title: "拒绝该交易吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            billService.confirmOrderWait($scope.model.id, { 'is_confirm': 0 }).then(function (data) {
                swal('拒绝交易成功�?);

                $scope.tableParams.reload();
                $('#modal-edit').modal('hide');
            });
        });
    };
});

hpxAdminApp.controller('paymentController', function ($rootScope, $scope, $timeout, $state, API_URL, Upload, billService, fileService) {
    $scope.model = {
        'bill_front_photo_address': 'assets/img/hpx-14.jpg',
        'bill_back_photo_address': 'assets/img/hpx-15.jpg',
    };
    $scope.filter = {};
    //文件的url
    $scope.getFileURL = function (id) {
        if (id != null) {
            return FILE_URL + '/file' + id;
        }
    }
    //文件上传
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //设置传递给后端的图片为当前上传的图�?
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_address = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_address = response.data.data.file_path;
        })
    };
    //上传图片
    $scope.save = function () {
        swal("图片上传成功�?);
        location.reload(false);
    };

});

hpxAdminApp.controller('portalSuggestionController', function ($scope, $rootScope, $state, ngTableParams, portalSuggestionService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        suggestionTypeId: "1",  //投诉
        handleStatusCode: "0"   //未查�?
    };

    

    //获取所有的投诉与建�?
    $scope.tableParams = new ngTableParams({'sorting': { 'id': 'asc' } }, {
        getData: function (params) {
            return portalSuggestionService.query(params, $scope.filter.suggestionTypeId, $scope.filter.handleStatusCode, $scope.filter.keyword).then(function (data) {
                if (data != null) {
                    $scope.first = $scope.getFirst(params);
                    return data;
                }
                //else $scope.tableParams.reload();
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    
    $scope.edit = function (data) {
        if (data == null) {     //弹出新增窗口
            $scope.model = newEntity;
        }
        else {      //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };
    //获取对应id的投诉建议内�?
    $scope.read = function (data) {
       // var id = data.id;
        $scope.model = angular.copy(data);
        $('#modal-read').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {      //新增投诉建议
            portalSuggestionService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //修改投诉建议
            portalSuggestionService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //处理投诉信息
    $scope.deal = function () {
        portalSuggestionService.update($scope.model, $scope.modell).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-read').modal('hide');
        });
        
    };




});

hpxAdminApp.controller('publicQueryController', function ($rootScope, $scope, $state, customerService, toolService) {
    $scope.model = {
        "billNumber": null,
    };

    //更改输入框检�?
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
            swal("请输入汇票票�?");
            return;
        }
        if (!/^[0-9]{16}$/.test($scope.model.billNumber) && !/^[0-9]{8}$/.test($scope.model.billNumber)) {
            swal("请输�?6位或�?位汇票票�?");
            return;
        }
        toolService.serviceByPublication($scope.model).then(function (data) {
            if (data.page_info.items_number)
                $scope.queryResult = data['service_by_publications'][0];
            else {
                $scope.queryResult = null;
                swal("该票号目前暂无挂失信�?");
            }
        });
    }
    //清理
    $scope.clear = function () {
        $scope.model.billNumber = null;
        $scope.queryResult = null;
        $scope.updateBillNumber();
    }
});

hpxAdminApp.controller('publishController', function ($rootScope, $scope, $timeout, $stateParams, $state, FILE_URL, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    $scope.model = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
        'endorsement_number': 1,
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        bill_type_id: 101,
        trade_type_code: 701,
    };
    $scope.filter = {
        tradetype: 0,
    }
    //获取全部汇票类型
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类�?
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取客户信息中的省市地址信息
    //if (!$stateParams.id) {
    //    customerService.getCustomer().then(function (data) {
    //        $scope.model.product_province_id = data.enterprise_province_id;
    //        addressService.queryCity($scope.model.product_province_id).then(function (data) {
    //            $scope.cityData = data;
    //        });
    //        $scope.model.product_location_id = data.enterprise_city_id;
    //    });
    //}

    //获取客户信息中的省市地址信息
    init = function () {
        customerService.getCustomer().then(function (AddData) {
            if (!AddData.trade_location_province_id) {
                $scope.cityData = [];
            } else if (AddData.trade_location_province_id == 1 || AddData.trade_location_province_id == 20 || AddData.trade_location_province_id == 860 || AddData.trade_location_province_id == 2462) {
                //$scope.model.product_province_id = AddData.trade_location_province_id;
                $scope.filter.tradeProvinceId = AddData.trade_location_province_id + 1;
                $scope.model.product_province_id = AddData.trade_location_province_id;
                return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                    $scope.cityData = data;
                    $scope.model.product_location_id = AddData.trade_location_id;
                });
            } else {
                $scope.model.product_province_id = AddData.trade_location_province_id;
                return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                    $scope.cityData = data;
                    $scope.model.product_location_id = AddData.trade_location_city_id;
                });
            }
            //if (data.trade_location_province_id && data.trade_location_city_id) {
            //    $scope.model.product_province_id = data.trade_location_province_id;
            //    //addressService.queryAll().then(function (data) {
            //    //    console.log(data);
            //    //});
            //    addressService.queryCity(data.trade_location_province_id).then(function (data) {
            //        $scope.cityData = data;
            //    });
            //    $scope.model.product_location_id = data.trade_location_city_id;
            //}
        });
    };
    init();

    //获取我的发布详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            $scope.model.drawer_account_id = $stateParams.accountId;

            if ($scope.model.trade_type_code == 701) {
                if ($scope.model.bill_type_id == 101) {
                    for (var i = 0; i < $scope.billFlawData.length; i++) {
                        $scope.billFlawData[i].checked = false;
                    }
                    for (var i = 0; i < $scope.model.bill_flaw_ids.length; i++) {
                        for (var j = 0; j < $scope.billFlawData.length; j++) {
                            if ($scope.model.bill_flaw_ids[i] == $scope.billFlawData[j].code) {
                                $scope.billFlawData[j].checked = true;
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < $scope.billFlawData2.length; i++) {
                        $scope.billFlawData2[i].checked = false;
                    }
                    for (var i = 0; i < $scope.model.bill_flaw_ids.length; i++) {
                        for (var j = 0; j < $scope.billFlawData2.length; j++) {
                            if ($scope.model.bill_flaw_ids[i] == $scope.billFlawData2[j].code) {
                                $scope.billFlawData2[j].checked = true;
                            }
                        }
                    }
                }
            }
            $timeout(function () {
                if (!$scope.model.bill_front_photo_path) {
                    $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
                }
                if (!$scope.model.bill_back_photo_path) {
                    $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
                }
                if ($stateParams.id && $scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                    $scope.filter.tradetype = 1;
                    document.getElementById("price").readOnly = "readonly";
                    document.getElementById("acceptortype").disabled = "true";
                    document.getElementById("producttime").readOnly = "readonly";
                    document.getElementById("producttime").disabled = "true";
                    document.getElementById("billrate").readOnly = "readonly";
                    document.getElementById("billdealprice").readOnly = "readonly";
                }
            });
            $timeout(function () {
                if ($scope.model.bill_front_photo_path && $scope.model.bill_front_photo_path != 'assets/img/hpx-14.jpg') {
                    $('.jqzoom_front').imagezoom();
                }
                if ($scope.model.bill_back_photo_path && $scope.model.bill_back_photo_path != 'assets/img/hpx-15.jpg') {
                    $('.jqzoom_back').imagezoom();
                }
            }, 500);
        });
    }

    //获取电票瑕疵类型
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
        for (var i = 0; i < $scope.billFlawData.length; i++) {
            if ($scope.billFlawData[i].code == 1500) {
                $scope.billFlawData[i].checked = true;
                break;
            }
        }
    })
    //获取纸票瑕疵类型
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
        for (var i = 0; i < $scope.billFlawData2.length; i++) {
            if ($scope.billFlawData2[i].code == 1500) {
                $scope.billFlawData2[i].checked = true;
                break;
            }
        }
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取全部省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取各省市下面的市区
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        } else if ($scope.model.product_province_id == 1 || $scope.model.product_province_id == 20 || $scope.model.product_province_id == 860 || $scope.model.product_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.product_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
        //else {
        //    return addressService.queryCity($scope.model.product_province_id).then(function (data) {
        //        $scope.cityData = data;
        //    });
        //}
    }
    //在不同交易类型下，循环获取汇票瑕疵的多选结�?
    $scope.tradeTypeChange = function (id) {
        $scope.model.trade_type_code = id;

        if ($scope.model.trade_type_code == 701) {
            if ($scope.model.bill_type_id == 101) {
                for (var i = 0; i < $scope.billFlawData.length; i++) {
                    if ($scope.billFlawData[i].code == 1500) {
                        $scope.billFlawData[i].checked = true;
                    }
                }
            }
            else {
                for (var i = 0; i < $scope.billFlawData2.length; i++) {
                    if ($scope.billFlawData2[i].code == 1500) {
                        $scope.billFlawData2[i].checked = true;
                    }
                }
            }
        }
    }
    //电票，当选中无瑕疵时，其他选项均为false；反之，选中其他选项时，无瑕疵选项为false
    $scope.billFlawChange = function (item) {
        if (item.code == 1500) {
            item.checked = true;
            for (var i = 1; i < $scope.billFlawData.length; i++) {
                $scope.billFlawData[i].checked = false;
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if (i == 0) {
                    $scope.billFlawData[i].checked = true;
                }
                else {
                    if ($scope.billFlawData[i].checked) {
                        $scope.billFlawData[0].checked = false;
                    }
                }
            }
        }
    }
    //纸票，当选中无瑕疵时，其他选项均为false；反之，选中其他选项时，无瑕疵选项为false
    $scope.billFlawChange2 = function (item) {
        if (item.code == 1500) {
            item.checked = true;
            for (var i = 1; i < $scope.billFlawData2.length; i++) {
                $scope.billFlawData2[i].checked = false;
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if (i == 0) {
                    $scope.billFlawData2[i].checked = true;
                }
                else {
                    if ($scope.billFlawData2[i].checked) {
                        $scope.billFlawData2[0].checked = false;
                    }
                }
            }
        }
    }
    //点击汇票到期日，默认选中的时�?
    $scope.billTypeChange = function (id) {
        $scope.model.bill_type_id = id;

        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
    //图片上传功能
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //汇票正面图片放大功能
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
            $('.jqzoom_front').imagezoom();
        })
    };
    //汇票背面图片放大功能
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
            $('.jqzoom_back').imagezoom();
        })
    };
    //汇票正面图片移除功能
    $scope.removeFront = function () {
        $scope.model.bill_front_photo_id = null;
        $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        $('.jqzoom_front').unbind("mouseenter");
        $('.jqzoom_front').css('cursor', '');
    }
    //汇票背面图片移除功能
    $scope.removeBack = function () {
        $scope.model.bill_back_photo_id = null;
        $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        $('.jqzoom_back').unbind("mouseenter");
        $('.jqzoom_back').css('cursor', '');
    }
    //上传图片后，点击图片跳转页面，放大图�?
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    //上传图片后，点击图片跳转页面，放大图�?
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }

    $scope.enclosure = [];
    $scope.model.bill_back_files = [];
    //增加附件
    $scope.add = function (response) {
        $timeout(function () {
            $scope.enclosure.push({
                'file_id': response.data.data.id,
                'file_path': response.data.data.file_path,
                'file_name': response.data.data.file_name
            });
            $scope.model.bill_back_files = $scope.enclosure;
        })

    }
    //删除附件
    $scope.remove = function (index) {
        swal({
            title: "确定要删除该文件�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            $scope.enclosure.splice(index, 1);
        });
    };

    //提示信息
    $scope.question = function () {
        swal('请在预约交易时间前进行交易，过时请重新发布�?);
    }

    $scope.save = function () {
        //校验，提示信�?
        if (!$scope.model.bill_type_id) {
            swal("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            swal("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            swal("请输入票面金�?);
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                swal("请上传汇票正�?);
                return;
            }
        } else {
            if($scope.model.trade_type_code == 702){
                if (!$scope.model.acceptor_type_id) {
                    swal("请选择承兑机构");
                    return;
                }

                if(!$scope.model.product_deadline_time){
                    swal("请选择失效时间");
                    return;
                }

                if ($stateParams.id && $scope.model.bill_type_id == 101) {
                    if (!$scope.model.bill_front_photo_id) {
                        swal("请上传汇票正�?);
                        return;
                    }
                }
            }
            
            //if (!$scope.model.acceptor_name) {
            //    swal("请输入付款行全称");
            //    return;
            //}

            //if (!$scope.model.bill_deadline_time) {
            //    swal("请输入汇票到期日");
            //    return;
            //}

            //if (!$scope.model.contact_name) {
            //    swal("请输入联系人");
            //    return;
            //}

            //if (!$scope.model.contact_phone) {
            //    swal("请输入联系方�?);
            //    return;
            //}
        }

        $scope.model.bill_flaw_ids = [];
        $scope.model.bill_type_id = parseInt($scope.model.bill_type_id);
        $scope.model.trade_type_code = parseInt($scope.model.trade_type_code);

        if ($scope.model.bill_type_id == 101) {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
            //if ($scope.model.bill_flaw_ids==null) {
            //    $scope.model.bill_flaw_ids.push(1599);
            //}
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
            //if ($scope.model.bill_flaw_ids==null) {
            //    $scope.model.bill_flaw_ids.push(1599);
            //}
        }
        swal({
            title: "确定要发布汇票吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            if (!$scope.model.id) {
                //发布汇票信息
                billService.insertBillProduct($scope.model).then(function (data) {
                    swal('发布成功！\n请等待后台审核（30分钟内完成）�?);
                    //\n发布后请�?8小时之内确认交易，平台系统默认将�?8小时之后关闭竞价，关闭之后可在“交易关闭”选项中查询或重新发布�?
                    $state.go("app.main.myBill");
                });
            } else {
                //修改汇票信息
                if ($scope.model.id && $stateParams.bidId && $scope.model.trade_type_code == 702) {
                    $scope.model.bill_product_id = $scope.model.id;
                    $scope.model.bill_product_bidding_id = parseInt($stateParams.bidId);
                    billService.newOrderBidding($scope.model).then(function (data) {
                        swal('发布成功！\n请等待后台审核（30分钟内完成）�?);
                        $state.go("app.main.myBill");
                    });
                } else {
                    billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
                        swal('修改成功！\n请等待后台审核（30分钟内完成）�?);
                        $state.go("app.main.myBill");
                    });
                }
            }
        });
    }
});

hpxAdminApp.controller('querybankController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //登录事件
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //登录功能，登录成功后跳转到个人中�?
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            $cookieStore.put('customer', data);

            // TODO
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };




    //获取所有的银行账户信息，并显示是否为默认银行账�?
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






    //$scope.submitCalendar = function () {

    //}

    //$scope.submitCalculator = function () {
    //    toolService.calculator($scope.calculatorModel).then(function (data) {
    //        $scope.calculatorResult = data;
    //    })
    //}

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
    ////跳转到注册界�?
    //$scope.tosignup = function () {
    //    $state.go("app.signup");
    //}
    ////获取交易�?
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

    ////获取所有的银行账户信息，并显示是否为默认银行账�?
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
        billStatusCode: '801,802,803,804,805,806,807,808,809,810,811,812,813',
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
        $scope.acceptorTypeData3 = [];
        $scope.acceptorTypeData4 = [];
        for (var i = 0; i < 3; i++) {
            $scope.acceptorTypeData3[i] = $scope.acceptorTypeData[i];
        };
        for (var j = 0; j < $scope.acceptorTypeData.length-3; j++) {
            $scope.acceptorTypeData4[j] = $scope.acceptorTypeData[j+3];
        }
    });
    //承兑机构全�?
    $scope.acceptorTypeChangeAll = function () {
        for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
            if($scope.filter.acceptorTypeAll) {
                $scope.acceptorTypeData[i].checked = false;

            }
        }
    };
    //选中某个选项时，‘全部’为不勾选状�?
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
        } else if ($scope.filter.ProvinceID == 1 || $scope.filter.ProvinceID == 20 || $scope.filter.ProvinceID == 860 || $scope.filter.ProvinceID == 2462) {
            $scope.filter.tradeProvinceId = $scope.filter.ProvinceID + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            return addressService.queryCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
        //else {
        //    return addressService.getCity($scope.filter.ProvinceID).then(function (data) {
        //        $scope.CityData = data;
        //    });
        //}
    }
    
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {

            var acceptorTypeID = [];
            if (!$scope.filter.acceptorTypeAll) {           //获取选中的承兑机�?
                for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
                    if ($scope.acceptorTypeData[i].checked) {
                        acceptorTypeID.push($scope.acceptorTypeData[i].code)
                    }
                }
            }
            $scope.filter.acceptorTypeID = acceptorTypeID.join(",");

            //if ($scope.filter.CityID==null) {
            //    $scope.filter.locationId = $scope.filter.ProvinceID;
            //} else {
            //    $scope.filter.locationId = $scope.filter.CityID;
            //}
            if ($scope.filter.ProvinceID != null && $scope.filter.CityID == null) {
                swal("请选择完整的省市或直辖市区地址�?)
            } else {
                $scope.filter.locationId = $scope.filter.CityID;
            }
            //$scope.filter.locationId = $scope.filter.CityID;

            //查看票据
            return billService.searchBillProduct(params, $scope.filter.billTypeID, $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                $scope.first = $scope.getFirst(params);
                //if (data.bill_status_code == 801) {
                //    data.bill_status_name="发布�?;
                //}else if(data.bill_status_code >= 802) {
                //    data.bill_status_name="交易�?;
                //}
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //如果id不等�?，获取对应id的票据详�?
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
        });
    }
    //提示信息
    $scope.Reminder = function () {
        swal('大票：指金额大于300万的汇票�?\n足月票：一般是指剩余天数半年期票多�?80天，一年期票多�?60天的汇票�?);
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
        swal({
            title: "确定要撤销报价�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            });
        });
    };
    //我要出价功能
    $scope.addBidding = function () {
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            swal('出价成功�?);
            //获取出价记录详情
            billService.getBillProductBidding($scope.model.id).then(function (data) {
                $scope.biddings = data;
                $('#modal-addBidding').modal('hide');
            });
        });
    };
});

hpxAdminApp.controller('queryenterpriseController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //登录事件
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //登录功能，登录成功后跳转到个人中�?
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            $cookieStore.put('customer', data);

            // TODO
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };


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

  


    //$scope.submitCalendar = function () {

    //}

    //$scope.submitCalculator = function () {
    //    toolService.calculator($scope.calculatorModel).then(function (data) {
    //        $scope.calculatorResult = data;
    //    })
    //}

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
    ////跳转到注册界�?
    //$scope.tosignup = function () {
    //    $state.go("app.signup");
    //}
    ////获取交易�?
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

    ////获取所有的银行账户信息，并显示是否为默认银行账�?
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
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.filter.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
        //else {
        //    return addressService.getCity($scope.filter.product_province_id).then(function (data) {
        //        $scope.cityData = data;
        //    });
        //}
    }

    $scope.tableParams = new ngTableParams({ 'sorting': { 'offer_time': 'desc' } }, {
        getData: function (params) {
            var newdate = new Date();
            $scope.filter.publishingTimeS = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日�?
            $scope.filter.publishingTimeB = $filter('date')(newdate, 'yyyy-MM-dd');
            //if (!$scope.filter.tradeLocationId) {
            //    $scope.filter.tradeLocationId = $scope.filter.product_province_id;
            //} else {
            //    $scope.filter.tradeLocationId = $scope.filter.tradeLocationId;
            //}
            //获取当前日期的报价信�?
            return billService.searchBillOffer(params, $scope.filter.func, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId, $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
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
        $scope.filter.tradeLocationId = 3516;
        document.getElementById("country").className = "";
        document.getElementById("shanghai").className = "highlight";
        document.getElementById("beijing").className = "";
        document.getElementById("guangzhou").className = "";
        document.getElementById("shenzhen").className = "";
        document.getElementById("hangzhou").className = "";
        $scope.tableParams.reload();
    }
    $scope.choiceBJ = function () {
        $scope.filter.tradeLocationId = 3514;
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

    $scope.offerChange = function () {
        if (document.getElementbyId("ownOffer").checked || $scope.filter.ownBillOffer) {
            return billService.getOwnBillOffer(params, $scope.filter.billStyleId, $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    try {
                        data[i].offer_detail = JSON.parse(data[i].offer_detail);
                    }
                    catch (e) {
                    }
                }
                return data;
            });
        }else{
            $scope.tableParams.reload();
        }
    }
});

hpxAdminApp.controller('quoteController', function ($rootScope, $scope, $timeout, $state, addressService, customerService, ngTableParams, billService, constantsService) {
    //判断是否可以报价
    if ($rootScope.identity.can_publish_offer != 1) {
        console.log($rootScope.identity.can_publish_offer)
        swal("您暂时还不能报价�?);
        window.history.back();
        return;
    }

    $scope.filter = { };
    //获取所有我的报价信�?
    $scope.tableParams = new ngTableParams({ 'sorting': { 'offer_time ': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillOffer(params, $scope.filter.billTypeId, $scope.filter.billStyleId, $scope.filter.maxPrice, $scope.filter.tradeLocationId, $scope.filter.keyword).then(function (data) {
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
    //删除报价
    $scope.remove = function (data) {
        swal({
            title: "确定要删除该报价�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            billService.deleteBillOffer(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    }
    
    $scope.edit = function (data) {
        if (data == null) {         //跳转至新建报�?
            $state.go('app.main.editQuote');
        }
        else {      //跳转到报价详细信�?
            $state.go('app.main.editQuote', { 'id': data.id });
        }
    };
});
hpxAdminApp.controller('readBillController', function ($rootScope, $scope, $state, $stateParams, $filter, $timeout, ngTableParams, addressService, billService, constantsService, orderService, customerService, toolService, enterprisesService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
        check: 0,
        isaccount: 0,
        billBided: 0,
        billSuccess: 0,
        isbidingtime: 0,
        isidentity: 0,
    };

    //根据id获取对应的票据详细信�?
    init = function () {
        if ($stateParams.id) {
            billService.getBillProduct($stateParams.id).then(function (data) {
                $scope.model = data;
                //$('.jqzoom').imagezoom();
                //$scope.filter.billSumPrice = $scope.model.bill_sum_price;
                //$scope.model.remaining_day = $scope.model.remaining_day + 1;
                
                if ($stateParams.check) {
                    $scope.filter.check = $stateParams.check;
                }
                if (!$scope.model.remaining_day) {
                    $scope.model.remaining_day = 0;
                }
                

                //根据条件判断，成立则获取出价记录
                if ($stateParams.id && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.model.publisher_id == $rootScope.identity.enterprise_id)) {
                    billService.getBillProductBidding($stateParams.id).then(function (data) {
                        //for (var i = 0; i < data.length; i++) {
                        //    data[i].bid_deal_price = $scope.filter.billSumPrice * (1 - (data[i].bid_rate / 100));
                        //}
                        $scope.biddings = data;
                    });
                }
                //倒计�?
                //var newdate = new Date().getTime();
                ////var allwaittime = 48 * 60 * 60 * 1000;
                ////var allwaittime = 60 * 60 * 1000;
                //var countdown = $scope.model.publishing_time + allwaittime - newdate;
                //if (countdown >= 60 * 1000) {
                //    var countdownTime = new Date(countdown);
                //    //var countdownTime.setTime(countdown);
                //    console.log(countdownTime);
                //    $scope.filter.countdownD = countdownTime.getDate();
                //    if ($scope.filter.countdownD > 2) {
                //        $scope.filter.countdownH = countdownTime.getHours() + ($scope.filter.countdownD - 2) * 24 + (24 - 8);
                //    } else if ($scope.filter.countdownD > 1) {
                //        $scope.filter.countdownH = countdownTime.getHours() + (24 - 8);
                //    } else {
                //        $scope.filter.countdownH = countdownTime.getHours();
                //    }
                //    $scope.filter.countdownM = countdownTime.getMinutes();
                //} else {
                //    $scope.filter.countdownH = 0;
                //    $scope.filter.countdownM = 0;
                //    billService.deleteBill($scope.model.id).then(function (data) {
                //        $scope.billsNumber();
                //        $state.go("app.free.queryBill");
                //    });
                //}

                //获取评价信息
                if ($scope.model.bill_status_code >= 811 && $scope.model.bill_type_id == 102) {
                    enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
                        $scope.drawerAppraisalModel = data.drawer_appraisal;
                        $scope.receiverAppraisalModel = data.receiver_appraisal;
                    });
                }
            });
            $timeout(function () {
                if ($rootScope.identity) {
                    $scope.filter.isidentity = 1;
                    $('.jqzoom').imagezoom();
                };
                if ($rootScope.identity) {
                    $scope.filter.isidentity = 1;
                    $('.backjqzoom').imagezoom();
                }
            },500);
        }
    }
    init();


    //$scope.showAddBidding = function (item) {
    //    $scope.biddingModel = {
    //        bill_product_id: $scope.model.id,
    //        bill_type_id: $scope.model.bill_type_id,
    //    };
    //    $('#modal-addBidding').modal('show');
    //};



    //撤销报价
    $scope.cancelBidding = function (item) {
        swal({
            title: "确定要撤销报价�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;

                    //var newdate = new Date();
                    //$scope.filter.newTime = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日�?
                    //for (var i = 0; i < $scope.biddings.length; i++) {
                    //    $scope.filter.bid_time = $filter('date')($scope.biddings[i].bid_time, 'yyyy-MM-dd');
                    //    if ($scope.filter.bid_time == $scope.filter.newTime) {
                    //        $scope.filter.isbidingtime = 1;
                    //    }
                    //}
                });
            });
            $state.go("app.main.myBidding");
        });
    };
    //新增报价信息
    $scope.addBidding = function () {
        if ($scope.model.trade_type_code == 702) {
            $scope.biddingModel.bid_rate = $scope.biddingModel.bill_rate;
        }
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            //swal('出价成功�?);
            $('#modal-addBidding').modal('hide');
            //$scope.model.billBided = 1;
            //if ($scope.model.id && identity && (identity.can_see_bill_detail == 1 || model.publisher_id == identity.enterprise_id)) {
            billService.getBillProductBidding($scope.model.id).then(function (data) {
                $scope.biddings = data;

                //var newdate = new Date();
                //$scope.filter.newTime = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日�?
                //for(var i=0;i<$scope.biddings.length;i++){
                //    $scope.filter.bid_time = $filter('date')($scope.biddings[i].bid_time, 'yyyy-MM-dd');
                //    if ($scope.filter.bid_time == $scope.filter.newTime) {
                //        $scope.filter.isbidingtime=1;
                //    }
                //}
            });
            //}
            setTimeout(function () {
                if ($scope.model.bill_type_id == 101) {
                    swal({ 'title': '报价成功！\n请等待出票方确认报价�? }, function () {
                        $state.go("app.main.myBidding");
                    })
                } else if ($scope.model.bill_type_id == 102) {
                    swal({ 'title': '报价成功�?\n温馨提醒：报价后请及时联系出票方�? }, function () {
                        $state.go("app.free.readBill", { id: $scope.model.id, check: 3 });
                        //window.location.reload();
                    });
                }
            }, 350);
        });
    };
    //贴息计算
    $scope.ratechange = function () {
        $scope.rateModel = {};
        if ($scope.biddingModel.bid_rate > 0 || $scope.biddingModel.bill_rate > 0) {
            var newDate = new Date();

            $scope.rateModel.start_time = $filter('date')(newDate, 'yyyy-MM-dd');
            $scope.rateModel.end_time = $filter('date')($scope.model.bill_deadline_time, 'yyyy-MM-dd');

            $scope.rateModel.denomination = $scope.model.bill_sum_price / 10000;
            $scope.rateModel.commission = 0;

            if ($scope.model.trade_type_code == 701) {
                if ($scope.model.bill_type_id == 102) {
                    $scope.rateModel.interest_month = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 3;
                } else if ($scope.model.bill_type_id == 101) {
                    $scope.rateModel.interest_year = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 0;
                }
                $scope.rateModel.every_plus = 0;

                toolService.calculator($scope.rateModel).then(function (data) {
                    //$scope.calculatorResult = data;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    //$scope.biddingModel.bid_deal_price = ($scope.model.bill_sum_price - $scope.biddingModel.bid_rate_price).toFixed(2);
                });
            } else if ($scope.model.trade_type_code == 702) {
                $scope.rateModel.every_plus = $scope.biddingModel.bill_rate;

                toolService.calculator($scope.rateModel,'ten').then(function (data) {
                    //$scope.calculatorResult = data;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    //$scope.biddingModel.bid_deal_price = ($scope.model.bill_sum_price - $scope.biddingModel.bid_rate_price).toFixed(2);
                });
                //$scope.biddingModel.bid_rate = $scope.biddingModel.bill_rate;
                //$scope.biddingModel.bid_rate_price = ($scope.rateModel.denomination * $scope.biddingModel.bid_rate) / 10;
                //$scope.biddingModel.bid_deal_price = ($scope.model.bill_sum_price - $scope.biddingModel.bid_rate_price).toFixed(2);
            }

        }
    };


    //弹出出价窗口
    $scope.showAddBidding = function (item) {
        $scope.biddingModel = {
            bill_product_id: $scope.model.id,
            bid_enterprise_name: $rootScope.identity.enterprise_name,

            //denomination:$scope.model.bill_sum_price,
            //start_time: $scope.model.product_deadline_time,
            //end_time: $scope.model.bill_deadline_time,
            ////adjust_day:
        };
        $('#modal-addBidding').modal('show');
    };
    //弹出选择成交窗口
    $scope.showFinishBidding = function (item) {
        $scope.accountModel = {
            account_person: $scope.model.drawer_name,
        }

        $scope.model.drawer_account_id = null;

        customerService.getAllEnterpriseAccount(501).then(function (data) {
            $scope.accounts = data;
        })

        $scope.payModel = {};
        $scope.payModel.payId = item.id;
        $scope.payModel.bid_enterprise_name = item.bid_enterprise_name;
        $scope.payModel.bid_deal_price = item.bid_deal_price;
        $scope.payModel.bill_rate = item.bid_rate;
        $scope.payModel.receiver_name = item.receiver_name;
        $scope.payModel.receiver_avg_star = item.receiver_avg_star;
        $scope.payModel.receiver_contact_name = item.receiver_contact_name;
        $scope.payModel.receiver_contact_phone = item.receiver_contact_phone;

        $('#modal-finishBidding').modal('show');
    }
    //选择交易�?         
    $scope.finishBidding = function (item) {
        swal({
            title: "确认选择该收票人进行交易�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        }, function () {
            //$scope.filter.billid = $scope.model.id;
            //$scope.filter.tradetypecode = $scope.model.trade_type_code;

            if ($scope.model.trade_type_code == 701 || ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 102)) {
                billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': $scope.payModel.payId }).then(function (data) {
                    //swal('确认交易方成功！');
                    $('#modal-finishBidding').modal('hide');
                    if ($scope.model.bill_type_id == 101) {
                        billService.getBillProduct($scope.model.id).then(function (data) {
                            $scope.filter.order_id = data.order_id;
                            orderService.updateOrderAccountDrawer($scope.filter.order_id, $scope.model.drawer_account_id).then(function () { });
                            $scope.model = data;
                            $('.jqzoom').imagezoom();

                            billService.getBillProductBidding($stateParams.id).then(function (data) {
                                $scope.biddings = data;
                            });
                        });
                        setTimeout(function () {
                            //swal({
                            //    title: "确认交易方成�?",
                            //    type: "warning",
                            //    showCancelButton: true,
                            //    confirmButtonText: "�?,
                            //    cancelButtonText: "�?,
                            //    closeOnConfirm: true
                            //}, function () {
                            swal("确认交易方成功！");
                            $state.go("app.main.orderDrawerInfo", { id: $scope.filter.order_id });
                            //});
                        }, 350);
                    } else {
                        window.location.reload();
                    }
                });
            }
            if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                //window.location.href = 'http://localhost:50532/www/index.html#/app/main/publish?id=' + $scope.model.id;
                //+ '&tradetype=' + $scope.model.trade_type_code
                $('#modal-finishBidding').modal('hide');
                setTimeout(function () {
                    //swal({
                    //    title: "确认交易方成�?",
                    //    type: "warning",
                    //    showCancelButton: true,
                    //    confirmButtonText: "�?,
                    //    cancelButtonText: "�?,
                    //    closeOnConfirm: true
                    swal("确认交易方成功！\n请先完善信息并提交审核，审核通过后直接进入交易状态！");
                    //}, function () {
                        $state.go('app.main.publish', { id: $scope.model.id, bidId: $scope.payModel.payId, accountId: $scope.model.drawer_account_id });
                    //});
                }, 350);
            }
        });
    };
    //选择收款账户
    $scope.accountChange = function () {
        //i = $scope.model.drawer_account_id.indexOf('_',0)+1;
        //s=$scope.model.drawer_account_id.substr(i, 100);
        customerService.getEnterpriseAccount($scope.model.drawer_account_id).then(function (data) {
            $scope.accountModel = data;
            $scope.filter.isaccount = 1;
        })
    }
    //展开收缩
    $scope.fileshowhide = function () {
        var accordion = document.getElementById("fileaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
            $timeout(function () {
                if ($rootScope.identity) {
                    $('.backjqzoom').imagezoom();
                }
            });
        } else {
            accordion.className = "accordionhide";
        }
    }
    //展开收缩
    $scope.billshowhide = function () {
        var accordion = document.getElementById("billaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
    }
    //确认成交
    $scope.submitbillnew = function () {
        swal({
            title: "是否线下已完成交�?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "�?,
            cancelButtonText: "�?,
            closeOnConfirm: true
        },function () {
            billService.finishBillNew($scope.model.id).then(function (data) {
                swal("已成功确认成交！");
                window.location.reload();
            });
        });
    }
    //评价
    $scope.showEvaluatesell = function () {
        $state.go('app.main.evaluate', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: $scope.filter.check });
    };

    //获取评价信息
    //appraisal = function () {
    //    enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
    //        $scope.drawerAppraisalModel = data.drawer_appraisal;
    //        $scope.receiverAppraisalModel = data.receiver_appraisal;
    //    });
    //};
    //appraisal();
});

hpxAdminApp.controller('readOfferController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService) {
    //����id��ȡ������ϸ��Ϣ
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
            try {
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
            catch (e) {
            }
        });
    }
});

hpxAdminApp.controller('readOrderController', function ($rootScope, $stateParams, $scope, $state, API_URL, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};

    if ($stateParams.id != 0) {
        orderService.getOrder($stateParams.id).then(function (data) {
            $scope.model = data;
        });
    };

});

hpxAdminApp.controller('rechargeController', function ($scope, $rootScope, $state, API_URL, ngTableParams, payingService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };
    //获取账户充值记�?
    $scope.tableParams = new ngTableParams({ 'sorting': { 'change_time': 'desc' } }, {
        getData: function (params) {
            return payingService.platformAccountBalance(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //获取账户余额
    payingService.GetPlatformAccount().then(function (data) {
        $scope.model= data;
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //弹出充值窗�?
    $scope.recharge = function () {
        $scope.model = newEntity;
        $('#modal-edit').modal('show');
    };
    //打开一个新页面，进行充值活�?
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);
        $('#modal-edit').modal('hide');
    };
});
hpxAdminApp.controller('signupController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService, $cookieStore, Restangular) {
    $scope.model = {};
    $scope.verifyStr = "获取验证�?;
    $scope.disableVerify = false;
    $scope.filter = {
        choicePhone:0,
    }
    //获取客户的类�?
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeCcode = data;
    })
    //获取交易方式的类�?
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCcode = data;
    })

    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            swal('请输入正确的手机号码�?);
            return;
        }

        customerService.phoneVerify($scope.model.phone_number).then(function () {
            swal('验证码已发�?);
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获�?;
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证�?;
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };

    $scope.PhoneChange = function () {
        if ($scope.model.phone_number && (/^1(3|4|5|7|8)\d{9}$/.test($scope.model.phone_number))) {
            //$scope.model.phone_number.length == 11 &&
            customerService.testPhoneNumber($scope.model.phone_number).then(function (data) {
                if (!data) {
                    $scope.filter.choicePhone = 1;
                }
                else {
                    $scope.filter.choicePhone = 2;
                }
            });
        }
        else if ($scope.model.phone_number && $scope.model.phone_number.length==11) {
            $scope.filter.choicePhone = 3;
        }
    }

    $scope.signup = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            swal('请输入手机号码！');
            return;
        }

        if (!$scope.model.password || $scope.model.password.length == 0) {
            swal('请输入密码！');
            return;
        }

        if (!$scope.model.password || $scope.model.password.length < 6) {
            swal('密码长度不符合规定！');
            return;
        }

        if ($scope.model.password != $scope.model.password2) {
            swal("两次密码输入不一致！");
            return;
        }

        if (!$scope.model.phone_verify_code || $scope.model.phone_verify_code.length == 0) {
            swal('请输入验证码�?);
            return;
        }
        //注册功能
        customerService.customerReg($scope.model).then(function (data) {
            swal("注册成功!");
            $scope.loginRequest = {
                username: $scope.model.phone_number,
                password: $scope.model.password,
                enterprise_id: -1
            }
            //新建账户信息
            customerService.customerLogin($scope.loginRequest).then(function (data) {
                $cookieStore.put('customer', data);

                $rootScope.identity = data;
                Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
                $state.go('app.main.accountInfo');      //跳转到个人中�?
            });
            //window.location.href = '/index.aspx';          //跳转到首�?
        });
    }
});
