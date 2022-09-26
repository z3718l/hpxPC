hpxAdminApp.controller('accountInfoController', function ($scope, $rootScope, $state, ngTableParams, Upload, FILE_URL, $timeout, customerService, orderService, billService, notisService, messageService, payingService) {
    $scope.filter = {
        isRead: 0,
        is_agentChecked: 3,
    };
    $scope.ReceveiverNumber = {
        all_ele_bid_running_order_number: 0,
        all_paper_bid_running_number: 0,
    };
    $scope.DrawerNumber = {
        all_ele_bid_running_order_number: 0,
        all_paper_bid_running_number: 0,
    }
    //获取进行中的出票订单数量
    $scope.messagek = function () {
        $state.go('app.main.messageCenter')
    }

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
    billService.getOwnBidding().then(function (data) {
        for (var i = 0, n = data.length; i < n; i++) {
            if (data[i].bid_result == 1) {
                $scope.filter.count++;
            }
        }
    });
    init = function () {
        //if ($rootScope.identity.is_verified == 0) {
        customerService.getCustomer().then(function (data) {
                $scope.Hcustomer = data;
            })
        //}
        billService.getBillsNumber(101).then(function (data) {
            $scope.eleNumber = data;
        })
        billService.getBillsNumber(102).then(function (data) {
            $scope.paperNumber = data;
        })

        if ($rootScope.identity.is_verified == 2 || $rootScope.identity.is_verified == 3) {
            payingService.getAgentTreasurer($rootScope.identity.enterprise_id).then(function (result) {
                $scope.agentModel = result;
                $timeout(function () {
                    if ($scope.agentModel.isChecked == 0) {
                        $scope.filter.is_agentChecked = 1;
                    } else if ($scope.agentModel.isChecked == -1) {
                        $scope.filter.is_agentChecked = 2;
                    } else if ($scope.agentModel.isChecked == 1) {
                        $scope.filter.is_agentChecked = 3;
                    } else {
                        $scope.filter.is_agentChecked = 0;
                    }
                }, 250);
            });
        }
    };
    init();
    //获取所有的银行账户信息，并显示是否为默认银行账户
    customerService.getAllEnterpriseAccount().then(function (data) {
        $scope.AccountData = data;
    });

    //获取未读消息
    phxM = function () {
       messageService.getMessage().then(function (data) {
           $scope.pagemessage = data.page_info.items_number;
       })
    }
    phxM();

    //生成数组
    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }


});

hpxAdminApp.controller('accountStatusController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    console.log($scope);
    console.log($rootScope);
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        if (!$scope.model.id_front_photo_address) {
            $scope.model.id_front_photo_address = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.id_back_photo_address) {
            $scope.model.id_back_photo_address = 'assets/img/hpx-15.jpg';
        }

        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id != 0 && ($scope.singleEnterprise.enterprise_id != null || $scope.enterpriseModel.is_verified != 0)) {
                    // 根据企业id查询经办人信息
                    payingService.getAgentTreasurer($scope.singleEnterprise.enterprise_id).then(function (agentData) {
                        console.log("查询经办人")
                        console.log(agentData)
                        $scope.agentModel = agentData;
                    });
                    // 根据企业信息查询银行卡信息
                    payingService.getAccount($scope.singleEnterprise.enterprise_id).then(function (accountData) {
                        if (accountData) {
                            $scope.AccountData = accountData.acct_list;
                        } else {
                            $scope.AccountData = ""
                        }
                    })
                }
            })
        }

    });

    // 鉴权
    $scope.authentication = function () {
        // 企业或者业务授权没有成功，无法进行鉴权
        if ($scope.enterpriseModel.is_verified == 2) {
            swal("企业正在审核，请联系客服人员！");
            return;
        }
        if ($scope.enterpriseModel.is_verified == -1) {
            swal("企业审核失败，请联系客服人员！");
            return;
        }
        if ($scope.agentModel.isChecked == 0) {
            swal("业务授权正在审核，请联系客服人员！");
            return;
        }
        if ($scope.agentModel.isChecked == -1) {
            swal("业务授权审核失败，请联系客服人员！");
            return;
        }
        $('#modal-authentication').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    $scope.smallValid = function () {
        $scope.valid.account_type_code = '501';
        payingService.checkAccount($scope.enterpriseModel.enterprise_id, $scope.valid.verify_string, $scope.valid.account_type_code).then(function (data) {
            swal({
                "title": "小额验证通过。",
                confirmButtonText: "OK",
            }, function () {
                window.location.reload();
            })
        });
    }

    // 显示个人信息
    $scope.infoModel = function () {
        $('#modal-info').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    // 机构详情
    $scope.enterDetail = function () {
        $('#modal-enterprise').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    // 业务授权详情
    $scope.authorizaDetail = function () {
        $('#modal-busAuthoriza').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
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
                       $scope.AddressData[i].is_default = "是";
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
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内容
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
            $scope.filterProvince();
            $scope.filterCity();
        }
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
            swal("不能删除默认地址信息！");
        } else {
            swal({
                title: "确定要删除本条地址信息吗?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: true
            }, function () {
                customerService.removeAddress(data.id).then(function (data) {
                    $scope.tableParams.reload();
                });
            });
        }
    };

});
hpxAdminApp.controller('agentCustomerController', function (exportService, $interval, $rootScope, $scope, $stateParams, $state, API_URL, NgTableParams, constantsService, addressService, customerService, agentService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'checkedType': 0,        //默认未审核
    };
    //获取票据类型信息
    //agentService.queryConstantsType(3).then(function (data) {
    //    $scope.customerTypeData = data;
    //})

    //获取未审核或已审核的客户资料信息
    $scope.tableParams = new NgTableParams({ 'sorting': { 'id': 'asc' } }, {
        getData: function (params) {
            return agentService.queryAllCustomersUnverified(params, $scope.filter.checkedType).then(function (data) {
                $scope.first = $scope.getFirst(params);
                data = data.data
                return data;
            });
        }
    });
    //跳转到新页面，放大图片
    //$scope.showFront = function () {
    //    window.open('index.html#/img?path=' + $scope.model.credential_front_photo_path);
    //}
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    var timer = $interval($scope.reflash, 60 * 1000);
    $scope.$on(
        "$destroy",
        function (event) {
            $interval.cancel(timer);
        }
    );

    $scope.check = function (item) {
        $scope.model = item;        //获取某条数据的详细信息
        //获取所有的省级地址
        //addressService.queryAll().then(function (data) {
        //    $scope.ProvinceData = data;
        //    $scope.provinceChange();
        //});
        //获取对应省的所有市级地址
        //$scope.provinceChange = function () {
        //    if (!$scope.model.enterprise_province_id) {
        //        return;
        //    }
        //    else {
        //        return addressService.queryCity($scope.model.enterprise_province_id).then(function (data) {
        //            $scope.CityData = data;
        //            $scope.cityChange();
        //        });
        //    }
        //}
        // 获取对应市的区
        //$scope.cityChange = function () {
        //    if (!$scope.model.enterprise_city_id) {
        //        return;
        //    }
        //    else {
        //        return addressService.queryDstrict($scope.model.enterprise_city_id).then(function (data) {
        //            $scope.AddressData = data;
        //        });
        //    }
        //}
        $('#modal-edit').modal('show');     //弹出审核窗口
        $('.jqzoom').imagezoom();       //图片放大功能
    };
    $scope.read = function (item) {
        $scope.model = item;        //获取某条数据的详细信息
        $('#modal-read').modal('show');     //弹出审核窗口
        $('.jqzoom').imagezoom();       //图片放大功能
    };

    // 审核通过
    $scope.pass = function () {
        if (confirm('确认通过吗？')) {
            if (!$scope.model.verify_description) {
                $scope.model.verify_description = "审核通过";
            }
            agentService.checkCustomerReview($scope.model.enterprise_id, {
                'is_checked': 1,
                'description': $scope.model.verify_description
            }).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //审核不通过
    $scope.reject = function () {
        if (!$scope.model.verify_description || $scope.model.verify_description.length == 0) {
            alert('请填写不通过原因！');
            return;
        }
        if (confirm('确认不通过吗？')) {
            agentService.checkCustomerReview($scope.model.enterprise_id, {
                'is_checked': -1,
                'description': $scope.model.verify_description
            }).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //客户失效
    $scope.delete = function (data) {
        if (confirm('确定要删除本客户吗？')) {
            agentService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

    //导出表格
    $scope.exportExcel = function () {
        var resource_url = API_URL + "/customers/customerReview?n=65535&orderBy=%2Bid&p=1";
        var sheet_name = "企业审核表";
        var label_names, label_types, label_keys;
        if ($scope.filter.checkedType == 1) {
            resource_url += "&isChecked=1";
            sheet_name += "_已审核";
        } else if ($scope.filter.checkedType == 0) {
            resource_url += "&isChecked=0";
            sheet_name += "_未审核";
        }
        label_names = ["企业名称", "统一社会信用码/营业执照注册号", "联系人", "联系号码"];
        label_types = ["String", "String", "String", "String"];
        label_keys = ["enterprise_name", "credential_number", "contact_person", "contact_phone"];

        var excelRequest = {
            "resource_url": resource_url,
            "resource_name": "enterprises",
            "sheet_name": sheet_name,
            "label_names": label_names,
            "label_types": label_types,
            "label_keys": label_keys
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export', token, excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }
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
        swal('此功能正在开发中，敬请期待...');
    };

    //大写的金额
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
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
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
    var hotkey = 17      /* hotkey即为热键的键值,是ASII码,这里99代表c键 */
    if (document.layers)
        document.captureEvents(Event.KEYDOWN)
    function gogo(e) {
        if (document.layers) {
            if (e.which == hotkey && travel) {
                alert("操作错误.或许是您按错了按键!");
            }
        }
        else if (document.all) {
            if (event.keyCode == hotkey && travel) { alert("操作错误.或许是您按错了按键!"); }
        }
    }

    document.onkeydown = gogo();
});

hpxAdminApp.controller('appraisalSearchController', function ($scope, API_URL, NgTableParams, searchService) {

    $scope.filter = {
        'func': 'enterprise'
    };

    //获取所有企业评价
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
        getData: function (params) {
            return searchService.getAllEnterpriseAppraisal(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    // 刷新
    $scope.refresh = function () {
        $scope.tableParams.reload();
    };

    //显示详情
    $scope.show = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-show').modal('show');
    };

});
hpxAdminApp.controller('appraisalTempletController',function ($scope, $rootScope, $state, API_URL, NgTableParams,appraisalTempletService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            var type = "";
            if(angular.isDefined($scope.filter)){
                type = $scope.filter.starType;
            }
            return appraisalTempletService.query(params,type ).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    $scope.edit = function (data) {
        if (data == null) {         //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {          //新建常量类型
            appraisalTempletService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改常量类型信息
            appraisalTempletService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除
    $scope.remove = function (data) {
        if (confirm('确定要删除此模板吗?')) {
            appraisalTempletService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});
hpxAdminApp.controller('approveAccountController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    console.log($scope);
    console.log($rootScope);
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        // 通过SingleEnterprise接口查询客户信息
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id != 0 && ($scope.singleEnterprise.enterprise_id != null || $scope.enterpriseModel.is_verified != 0)) {
                    // 根据企业id查询经办人信息
                    payingService.getAgentTreasurer($scope.singleEnterprise.enterprise_id).then(function (agentData) {
                        $scope.agentModel = agentData;
                        $scope.accountModel = {};
                    });
                    // 根据企业信息查询银行卡信息
                    payingService.getAccount($scope.singleEnterprise.enterprise_id).then(function (accountData) {
                        if (accountData) {
                            $scope.AccountData = accountData.acct_list;
                        } else {
                            $scope.AccountData = ""
                        }
                    })
                }
            })
        }
    });
    // 账户绑定
    $scope.filter = {
        isView: false
    }
    // 根据支行行号查询银行名称
    $scope.findNumber = function () {
        console.log($scope.accountModel.cnaps_code)
        if ($scope.accountModel.cnaps_code) {
            if ($scope.accountModel.cnaps_code.length == 12) {
                bankService.getBanks($scope.accountModel.cnaps_code).then(function (data) {
                    if (data.bank_branch_name) {
                        $scope.bankModel = data.bank_branch_name;
                    } else {
                        $scope.filter.isView = true;
                    }
                })
            }
        } else if (!$scope.accountModel.cnaps_code || $scope.accountModel.cnaps_code.length == 0) {
            $scope.filter.isView = false;
        }

    }
    $scope.saveAccount = function () {
        $scope.accountModel.account_type_code = "501";
        payingService.saveAccount($scope.accountModel).then(function (data) {
            swal({ 'title': '账户提交成功。\n 请等待鉴权！' }, function () {
                //window.location.reload();
                $state.go("app.main.accountStatus");
            })
        })
    }
});
hpxAdminApp.controller('approveAgentController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    console.log($scope);
    console.log($rootScope);
    $scope.filter = {
        isModified: 1,
        enterprise_proxy_agree: false,
        enterprise_check: 1,
        agent_check: 1,
        choiceenterprise: 1,
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        // 通过SingleEnterprise接口查询客户信息
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id != 0 && ($scope.singleEnterprise.enterprise_id != null || $scope.enterpriseModel.is_verified != 0)) {
                    // 根据企业id查询经办人信息
                    payingService.getAgentTreasurer($scope.singleEnterprise.enterprise_id).then(function (agentData) {
                        //$scope.agentModel = agentData;
                        if (agentData) {
                            $scope.agentModel = agentData;
                            //if ($scope.agentModel.enterprise_proxy_agree == "Y") {
                            //    $scope.filter.enterprise_proxy_agree = true;
                            //}
                            //if ($scope.agentModel.authorization_cert_agree == "Y") {
                            //    $scope.filter.authorization_cert_agree = true;
                            //}
                            //$scope.accountModel = {};          // 如果有经办人信息，给账户一个初始值
                        } else {
                            $scope.agentModel = {}
                        }
                        if (!$scope.agentModel.agent_treasurer_cert_photo_front_address) {
                            $scope.agentModel.agent_treasurer_cert_photo_front_address = 'assets/img/hpx-15.png';
                        }
                        if (!$scope.agentModel.agent_treasurer_cert_photo_back_address) {
                            $scope.agentModel.agent_treasurer_cert_photo_back_address = 'assets/img/hpx-16.png';
                        }
                    });
                }
            })
        }
    });
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

    // 业务授权
    // 获取当前时间
    var todayDate = new Date();
    $scope.newYear = todayDate.getFullYear();
    $scope.newMonth = (todayDate.getMonth() + 1) < 10 ? '0' + (todayDate.getMonth() + 1) : (todayDate.getMonth() + 1);
    $scope.newToday = todayDate.getDate() < 10 ? '0' + todayDate.getDate() : todayDate.getDate();
    // 签订企业授权书弹窗
    $scope.EnAuthorizationModel = function () {
        $('#modal-EnAuthorization').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    // 签订企业授权书
    $scope.EnAuthorizationAgent = function () {
        $scope.filter.enterprise_proxy_agree = true;
        $scope.agentModel.enterprise_proxy_agree = "Y";
    }
    $scope.EnAuthorizationClose = function () {
        $scope.filter.enterprise_proxy_agree = false;
    }
    // 签订业务授权书弹窗
    $scope.BusAuthorizationModel = function () {
        $('#modal-BusAuthorization').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    $scope.BusAuthorizationAgent = function () {
        $scope.filter.authorization_cert_agree = true;
        $scope.agentModel.authorization_cert_agree = "Y";
    }
    $scope.BusAuthorizationClose = function () {
        $scope.filter.authorization_cert_agree = false;
    }
    // 上传经办人身份证
    $scope.setAgentFrontID = function (response) {
        $timeout(function () {
            $scope.agentModel.agent_treasurer_cert_photo_front_id = response.data.data.id;
            $scope.agentModel.agent_treasurer_cert_photo_front_address = response.data.data.file_path;

        })
    };
    $scope.setAgentBackID = function (response) {
        $timeout(function () {
            $scope.agentModel.agent_treasurer_cert_photo_back_id = response.data.data.id;
            $scope.agentModel.agent_treasurer_cert_photo_back_address = response.data.data.file_path;
        })
    };
    // 提交保存经办人
    $scope.saveAgent = function () {
        if (!$scope.agentModel.agent_treasurer_name) {
            swal("请填写经办人姓名！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal("请填写经办人手机号！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal("请填写经办人身份证号码！");
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal("身份证信息有误。请核实信息！！！")
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_photo_front_id || !$scope.agentModel.agent_treasurer_cert_photo_back_id) {
            swal("请上传身份证！");
            return;
        }
        if (!$scope.agentModel.isChecked) {
            console.log($scope.agentModel)
            payingService.postAgentTreasurer2($scope.singleEnterprise.enterprise_id, $scope.agentModel).then(function (data) {
                swal({ 'title': '经办人保存成功，等待管理员审核。\n 请进行账户绑定！' }, function () {
                    $state.go("app.main.approveAccount");
                    //window.location.reload();
                })
            });
        }
        else {
            payingService.updateAgentTreasurer($scope.singleEnterprise.enterprise_id, $scope.agentModel).then(function (data) {
                swal({ 'title': '经办人修改成功，等待管理员审核。\n 请进行账户绑定！' }, function () {
                    $state.go("app.main.accountStatus");
                })
                //swal("保存成功，请等待管理员审核！");
                //$state.go("app.main.enterpriseAccountInfo")
            });
        }
    }
});
hpxAdminApp.controller('approveCustomerController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    console.log($scope);
    //console.group($scope)
    console.log($rootScope);
    //var todayDate = new Date();
    $scope.filter = {
        isModified: 1,
        enterprise_proxy_agree: false,
        enterprise_check: 1,
        agent_check: 1,
        choiceenterprise: 1,
    };
    // 默认图片
    $scope.model = {
        //'id_front_photo_address': 'assets/img/hpx-14.jpg',
        //'id_back_photo_address': 'assets/img/hpx-15.jpg',
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.customerProvince();
        if ($scope.model.trade_location_province_id != 1 || $scope.model.trade_location_province_id != 20 || $scope.model.trade_location_province_id != 860 || $scope.model.trade_location_province_id != 2462) {
            $scope.customerCityChange();
        }
        if (!$scope.model.id_front_photo_address) {
            $scope.model.id_front_photo_address = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.id_back_photo_address) {
            $scope.model.id_back_photo_address = 'assets/img/hpx-15.jpg';
        }
    });

    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.customerProvince = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            $scope.filter.isModified == 0;
            //document.getElementById("tradCity").style.display = "none";
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            $scope.filter.isModified == 1;
            //document.getElementById("tradCity").style.display = "block";
            $scope.AddressData = null;
            return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取对应市的区
    $scope.customerCityChange = function () {
        if ($scope.model.trade_location_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.trade_location_city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
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
            swal('请输入联系人！');
            document.querySelector("body").css({ "overflow": "visible" });
            return;
        }
        if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test($scope.model.id_number) || !$scope.model.id_number) {
            swal('请输入正确的身份证号码！');
            return;
        }
        else {
            customerService.updateCustomer($scope.model).then(function () {
                swal({ 'title': '联系人信息保存成功，请完善企业信息！！！' }, function () {
                    $state.go("app.main.approveEnterprise");
                })
            })
        }
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
    // 准备资料
    $scope.ycimg = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "rotes";
        } else {
            trans.className = "rote";
        }
    }

});
hpxAdminApp.controller('approveEnterpriseController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    console.log($scope);
    //console.group($scope)
    console.log($rootScope);
    //var todayDate = new Date();
    $scope.filter = {
        isModified: 1,
        enterprise_proxy_agree: false,
        enterprise_check: 1,
        agent_check: 1,
        choiceenterprise: 1,
    };
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.customerProvince();
        if ($scope.model.trade_location_province_id != 1 || $scope.model.trade_location_province_id != 20 || $scope.model.trade_location_province_id != 860 || $scope.model.trade_location_province_id != 2462) {
            $scope.customerCityChange();
        }
        // 机构认证
        $scope.enterpriseModel = {}
        if ($scope.model.is_verified != 0) {
            $scope.setCredentialID = function (response) {
                $timeout(function () {
                    $scope.enterpriseModel.credential_photo_id = response.data.data.id;
                    $scope.enterpriseModel.credential_photo_address = response.data.data.file_path;
                })
            };
            $scope.legalFrontID = function (response) {
                $timeout(function () {
                    $scope.enterpriseModel.artificial_person_front_photo_id = response.data.data.id;
                    $scope.enterpriseModel.artificial_person_front_photo_address = response.data.data.file_path;
                })
            };
            $scope.legalBackID = function (response) {
                $timeout(function () {
                    $scope.enterpriseModel.artificial_person_back_photo_id = response.data.data.id;
                    $scope.enterpriseModel.artificial_person_back_photo_address = response.data.data.file_path;
                })
            };
        }
        // 通过SingleEnterprise接口查询客户信息
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id == "" || $scope.singleEnterprise.enterprise_id == 0) {
                    $scope.enterpriseModel = {};
                } else {
                    if ($scope.enterpriseModel.location_province_id != 1 || $scope.enterpriseModel.location_province_id != 20 || $scope.enterpriseModel.location_province_id != 860 || $scope.enterpriseModel.location_province_id != 2462) {
                        if (($scope.model.id != 0 && $scope.singleEnterprise.enterprise_id == 0 && model.is_verified != 0) || ($scope.enterpriseModel.is_alive == -1 && $scope.filter.enterprise_check == -1)) {
                            $scope.cityChange();
                        }
                    }
                }
                //获取对应省的市
                $scope.provinceChange = function () {
                    if ($scope.enterpriseModel.location_province_id == null) {
                        return;
                    } else if ($scope.enterpriseModel.location_province_id == 1 || $scope.enterpriseModel.location_province_id == 20 || $scope.enterpriseModel.location_province_id == 860 || $scope.enterpriseModel.location_province_id == 2462) {
                        $scope.filter.tradeProvinceId = $scope.enterpriseModel.location_province_id + 1;
                        $scope.filter.isModified == 0;
                        $scope.CityData = null;
                        return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                            $scope.AddressData = data;
                        });
                    } else {
                        $scope.filter.isModified == 1;
                        $scope.AddressData = null;
                        return addressService.queryCity($scope.enterpriseModel.location_province_id).then(function (data) {
                            $scope.CityData = data;
                        });
                    }
                };
                //获取对应市的区
                $scope.cityChange = function () {
                    if ($scope.enterpriseModel.location_city_id == null) {
                        return;
                    }
                    else {
                        return addressService.queryDstrict($scope.enterpriseModel.location_city_id).then(function (data) {
                            $scope.AddressData = data;
                        });
                    }
                }
            })
        }
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.customerProvince = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            $scope.filter.isModified == 0;
            //document.getElementById("tradCity").style.display = "none";
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            $scope.filter.isModified == 1;
            //document.getElementById("tradCity").style.display = "block";
            $scope.AddressData = null;
            return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取对应市的区
    $scope.customerCityChange = function () {
        if ($scope.model.trade_location_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.trade_location_city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
    }
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
    // 保存企业信息
    $scope.enterpriseSave = function () {
        if (!$scope.enterpriseModel.credential_photo_id) {
            swal("请上传营业执照！");
            return;
        }
        if (!$scope.enterpriseModel.artificial_person_front_photo_id || !$scope.enterpriseModel.artificial_person_back_photo_id) {
            swal("请上传法人代表身份证！");
            return;
        }
        if (_.isEqual($scope.enterpriseModel, newEntity)) {
            swal('请确认更改之后再次提交！');
            return;
        }
        $scope.enterpriseModel.enterprise_address_id = $scope.enterpriseModel.location_id;
        if ($scope.enterpriseModel.enterprise_id == null || $scope.enterpriseModel.enterprise_id == 0) {
            customerService.insertEnterprise($scope.enterpriseModel).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    $scope.enterpriseModel = data;
                    swal({ 'title': '保存成功，请继续完成经办人绑定！' }, function () {
                        $state.go("app.main.approveAgent");
                    });
                });
            });
        } else {
            customerService.postEnterprise($scope.enterpriseModel.enterprise_id, $scope.enterpriseModel).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    swal({ 'title': '修改成功，请等待管理员审核！' }, function () {
                        $state.go("app.main.accountStatus");
                    });
                });
            });
        }
    };
});
hpxAdminApp.controller('autonymAuthenticationController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    console.log($scope);
    console.log($rootScope);
    $scope.filter = {
        isModified: 1,
        enterprise_proxy_agree: false,
        enterprise_check: 1,
        agent_check: 1,
        choiceenterprise: 1,
    };
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    // 默认图片
    $scope.model = {

    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.customerProvince();
        if ($scope.model.trade_location_province_id != 1 || $scope.model.trade_location_province_id != 20 || $scope.model.trade_location_province_id != 860 || $scope.model.trade_location_province_id != 2462) {
            $scope.customerCityChange();
        }
        if (!$scope.model.id_front_photo_address) {
            $scope.model.id_front_photo_address = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.id_back_photo_address) {
            $scope.model.id_back_photo_address = 'assets/img/hpx-15.jpg';
        }
        // 通过SingleEnterprise接口查询客户信息
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id == "" || $scope.singleEnterprise.enterprise_id == 0) {
                    $scope.enterpriseModel = {};
                } else {
                    if ($scope.enterpriseModel.location_province_id != 1 || $scope.enterpriseModel.location_province_id != 20 || $scope.enterpriseModel.location_province_id != 860 || $scope.enterpriseModel.location_province_id != 2462) {
                        if (($scope.model.id != 0 && $scope.singleEnterprise.enterprise_id == 0 && model.is_verified != 0) || ($scope.enterpriseModel.is_alive == -1 && $scope.filter.enterprise_check == -1)) {
                            $scope.cityChange();
                        }
                    }
                }
                if (!$scope.enterpriseModel.credential_photo_address) {
                    $scope.enterpriseModel.credential_photo_address = 'assets/img/hpx-14.png';
                }
                if (!$scope.enterpriseModel.artificial_person_front_photo_address) {
                    $scope.enterpriseModel.artificial_person_front_photo_address = 'assets/img/hpx-15.png';
                }
                if (!$scope.enterpriseModel.artificial_person_back_photo_address) {
                    $scope.enterpriseModel.artificial_person_back_photo_address = 'assets/img/hpx-16.png';
                }
                //获取对应省的市
                $scope.provinceChange = function () {
                    if ($scope.enterpriseModel.location_province_id == null) {
                        return;
                    } else if ($scope.enterpriseModel.location_province_id == 1 || $scope.enterpriseModel.location_province_id == 20 || $scope.enterpriseModel.location_province_id == 860 || $scope.enterpriseModel.location_province_id == 2462) {
                        $scope.filter.tradeProvinceId = $scope.enterpriseModel.location_province_id + 1;
                        $scope.filter.isModified == 0;
                        $scope.CityData = null;
                        return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                            $scope.AddressData = data;
                        });
                    } else {
                        $scope.filter.isModified == 1;
                        $scope.AddressData = null;
                        return addressService.queryCity($scope.enterpriseModel.location_province_id).then(function (data) {
                            $scope.CityData = data;
                        });
                    }
                };
                //获取对应市的区
                $scope.cityChange = function () {
                    if ($scope.enterpriseModel.location_city_id == null) {
                        return;
                    }
                    else {
                        return addressService.queryDstrict($scope.enterpriseModel.location_city_id).then(function (data) {
                            $scope.AddressData = data;
                        });
                    }
                }
                if ($scope.singleEnterprise.enterprise_id != 0 && ($scope.singleEnterprise.enterprise_id != null || $scope.enterpriseModel.is_verified != 0)) {
                    // 根据企业id查询经办人信息
                    payingService.getAgentTreasurer($scope.singleEnterprise.enterprise_id).then(function (agentData) {
                        if (agentData) {
                            $scope.agentModel = agentData;
                            if ($scope.agentModel.enterprise_proxy_agree == "Y") {
                                $scope.filter.enterprise_proxy_agree = true;
                            }
                            if ($scope.agentModel.authorization_cert_agree == "Y") {
                                $scope.filter.authorization_cert_agree = true;
                            }
                            $scope.accountModel = {};          // 如果有经办人信息，给账户一个初始值
                        } else {
                            $scope.agentModel = {}
                        }
                        console.log($scope.agentModel)
                        if (!$scope.agentModel.agent_treasurer_cert_photo_front_address) {
                            $scope.agentModel.agent_treasurer_cert_photo_front_address = 'assets/img/hpx-15.png';
                        }
                        if (!$scope.agentModel.agent_treasurer_cert_photo_back_address) {
                            $scope.agentModel.agent_treasurer_cert_photo_back_address = 'assets/img/hpx-16.png';
                        }
                    });
                    // 根据企业信息查询银行卡信息
                    payingService.getAccount($scope.singleEnterprise.enterprise_id).then(function (accountData) {
                        if (accountData) {
                            $scope.AccountData = accountData.acct_list;
                        } else {
                            $scope.AccountData = ""
                        }
                    })
                }
            })
        }
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.customerProvince = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            $scope.filter.isModified == 0;
            //document.getElementById("tradCity").style.display = "none";
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            $scope.filter.isModified == 1;
            //document.getElementById("tradCity").style.display = "block";
            $scope.AddressData = null;
            return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取对应市的区
    $scope.customerCityChange = function () {
        if ($scope.model.trade_location_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.trade_location_city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
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
            swal('请输入联系人！');
            document.querySelector("body").css({ "overflow": "visible" });
            return;
        }
        if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test($scope.model.id_number) || !$scope.model.id_number) {
            swal('请输入正确的身份证号码！');
            return;
        }
        else {
            customerService.updateCustomer($scope.model).then(function () {
                swal({ 'title': '联系人信息保存成功，请完善企业信息！！！' }, function () {
                    //$state.go("app.main.enterpriseInfo");
                    // 出现企业完善的信息
                    window.location.reload();
                    //$scope.filter.currentPage = 2;

                })
            })
        }
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
    // 准备资料
    $scope.ycimg = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "rotes";
        } else {
            trans.className = "rote";
        }
    }

    // 机构认证
    $scope.enterpriseModel = {}
    if ($scope.model.is_verified != 0) {
        $scope.setCredentialID = function (response) {
            $timeout(function () {
                $scope.enterpriseModel.credential_photo_id = response.data.data.id;
                $scope.enterpriseModel.credential_photo_address = response.data.data.file_path;
            })
        };
        $scope.legalFrontID = function (response) {
            $timeout(function () {
                $scope.enterpriseModel.artificial_person_front_photo_id = response.data.data.id;
                $scope.enterpriseModel.artificial_person_front_photo_address = response.data.data.file_path;
            })
        };
        $scope.legalBackID = function (response) {
            $timeout(function () {
                $scope.enterpriseModel.artificial_person_back_photo_id = response.data.data.id;
                $scope.enterpriseModel.artificial_person_back_photo_address = response.data.data.file_path;
            })
        };
    }
    // 保存企业信息
    $scope.enterpriseSave = function () {
        if (!$scope.enterpriseModel.credential_photo_id) {
            swal("请上传营业执照！");
            return;
        }
        if (!$scope.enterpriseModel.artificial_person_front_photo_id || !$scope.enterpriseModel.artificial_person_back_photo_id) {
            swal("请上传法人代表身份证！");
            return;
        }
        if (_.isEqual($scope.enterpriseModel, newEntity)) {
            swal('请确认更改之后再次提交！');
            return;
        }
        $scope.enterpriseModel.enterprise_address_id = $scope.enterpriseModel.location_id;
        console.log($scope.enterpriseModel.location_id)
        console.log($scope.enterpriseModel.enterprise_address_id)
        if ($scope.enterpriseModel.enterprise_id == null || $scope.enterpriseModel.enterprise_id == 0) {
            console.log($scope.enterpriseModel)
            //$scope.enterpriseModel = {
            //    enterprise_name: $scope.enterpriseModel.enterprise_name,
            //    enterprise_address_id: $scope.enterpriseModel.trade_location_id,
            //    enterprise_address: $scope.enterpriseModel.contact_address,
            //    credential_number: $scope.enterpriseModel.credential_number,
            //}
            //$scope.enterpriseModel.enterprise_address = $scope.enterpriseModel.enterprise_address;
            customerService.insertEnterprise($scope.enterpriseModel).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    $scope.enterpriseModel = data;
                    swal({ 'title': '保存成功，请继续完成经办人绑定！' }, function () {
                        window.location.reload();
                    });
                });
            });
        } else {
            customerService.postEnterprise($scope.enterpriseModel.enterprise_id, $scope.enterpriseModel).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    swal({ 'title': '保存成功，请等待管理员审核！' }, function () {
                        window.location.reload();
                    });
                });
            });
        }
    };

    // 企业审核失败
    //$scope.enterpriseCheck = function () {
    //    $scope.filter.enterprise_check = -1;
    //}
    // 经办人审核失败
    //$scope.agentCheck = function () {
    //    $scope.filter.agent_check = -1;
    //}
    // 业务授权
    // 获取当前时间
    var todayDate = new Date();
    $scope.newYear = todayDate.getFullYear();
    $scope.newMonth = (todayDate.getMonth() + 1) < 10 ? '0' + (todayDate.getMonth() + 1) : (todayDate.getMonth() + 1);
    $scope.newToday = todayDate.getDate() < 10 ? '0' + todayDate.getDate() : todayDate.getDate();
    // 签订企业授权书弹窗
    $scope.EnAuthorizationModel = function () {
        $('#modal-EnAuthorization').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    // 签订企业授权书
    $scope.EnAuthorizationAgent = function () {
        $scope.filter.enterprise_proxy_agree = true;
        $scope.agentModel.enterprise_proxy_agree = "Y";
    }
    $scope.EnAuthorizationClose = function () {
        $scope.filter.enterprise_proxy_agree = false;
    }
    // 签订业务授权书弹窗
    $scope.BusAuthorizationModel = function () {
        $('#modal-BusAuthorization').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    $scope.BusAuthorizationAgent = function () {
        $scope.filter.authorization_cert_agree = true;
        $scope.agentModel.authorization_cert_agree = "Y";
    }
    $scope.BusAuthorizationClose = function () {
        $scope.filter.authorization_cert_agree = false;
    }
    // 上传经办人身份证
    $scope.setAgentFrontID = function (response) {
        $timeout(function () {
            $scope.agentModel.agent_treasurer_cert_photo_front_id = response.data.data.id;
            $scope.agentModel.agent_treasurer_cert_photo_front_address = response.data.data.file_path;

        })
    };
    $scope.setAgentBackID = function (response) {
        $timeout(function () {
            $scope.agentModel.agent_treasurer_cert_photo_back_id = response.data.data.id;
            $scope.agentModel.agent_treasurer_cert_photo_back_address = response.data.data.file_path;
        })
    };
    // 提交保存经办人
    $scope.saveAgent = function () {
        if (!$scope.agentModel.agent_treasurer_name) {
            swal("请填写经办人姓名！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal("请填写经办人手机号！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal("请填写经办人身份证号码！");
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal("身份证信息有误。请核实信息！！！")
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_photo_front_id || !$scope.agentModel.agent_treasurer_cert_photo_back_id) {
            swal("请上传身份证！");
            return;
        }
        if (!$scope.agentModel.isChecked) {
            console.log($scope.agentModel)
            payingService.postAgentTreasurer2($scope.singleEnterprise.enterprise_id, $scope.agentModel).then(function (data) {
                swal({ 'title': '经办人保存成功，等待管理员审核。\n 请进行账户绑定！' }, function () {
                    //$state.go("app.main.enterpriseAccountInfo")
                    window.location.reload();
                })
            });
        }
        //else {
        //    payingService.updateAgentTreasurer($scope.singleEnterprise.enterprise_id, $scope.agentModel).then(function (data) {
        //        swal("保存成功，请等待管理员审核！");
        //        //$state.go("app.main.enterpriseAccountInfo")
        //    });
        //}
    }

    // 账户绑定
    $scope.filter = {
        isView: false
    }
    // 根据支行行号查询银行名称
    $scope.findNumber = function () {
        console.log($scope.accountModel.cnaps_code)
        if ($scope.accountModel.cnaps_code) {
            if ($scope.accountModel.cnaps_code.length == 12) {
                bankService.getBanks($scope.accountModel.cnaps_code).then(function (data) {
                    if (data.bank_branch_name) {
                        $scope.bankModel = data.bank_branch_name;
                    } else {
                        $scope.filter.isView = true;
                    }
                })
            }
        } else if (!$scope.accountModel.cnaps_code || $scope.accountModel.cnaps_code.length == 0) {
            $scope.filter.isView = false;
        }

    }
    $scope.saveAccount = function () {
        $scope.accountModel.account_type_code = "501";
        console.log($scope.accountModel)
        payingService.saveAccount($scope.accountModel).then(function (data) {
            console.log(data)
            swal({ 'title': '账户提交成功。\n 请等待鉴权！' }, function () {
                //window.location.reload();
                $state.go("app.main.accountStatus");
            })
        })
    }
    // 显示个人信息
    //$scope.infoModel = function () {
    //    $('#modal-info').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    // 机构详情
    //$scope.enterDetail = function () {
    //    $('#modal-enterprise').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    // 业务授权详情
    //$scope.authorizaDetail = function () {
    //    $('#modal-busAuthoriza').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    // 鉴权
    //$scope.authentication = function () {
    //    // 企业或者业务授权没有成功，无法进行鉴权
    //    if ($scope.enterpriseModel.is_verified == 2) {
    //        swal("企业正在审核，请联系客服人员！");
    //        return;
    //    }
    //    if ($scope.enterpriseModel.is_verified == -1) {
    //        swal("企业审核失败，请联系客服人员！");
    //        return;
    //    }
    //    if ($scope.agentModel.isChecked == 0) {
    //        swal("业务授权正在审核，请联系客服人员！");
    //        return;
    //    }
    //    if ($scope.agentModel.isChecked == -1) {
    //        swal("业务授权审核失败，请联系客服人员！");
    //        return;
    //    }
    //    $('#modal-authentication').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    //$scope.smallValid = function () {

    //    payingService.checkAccount($scope.model.enterpriseId, $scope.model.verify_string, $scope.model.is_default, $scope.model.account_type_code).then(function (data) {
    //        swal({
    //            "title": "小额验证通过。",
    //            confirmButtonText: "OK",
    //        }, function () {
    //            window.location.reload();
    //        })
    //    });
    //}
});
hpxAdminApp.controller('bankController', function ($scope, $rootScope, $state, API_URL, NgTableParams, bankService, addressService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有的总行数据
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });
    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.AddressData = data;
        $scope.filterProvinceChange();
    });
    //获取对应省的市级地址
    $scope.filterProvinceChange = function () {
        if ($scope.filter.ProvinceID == null) {
            return;
        }
        else {
            return addressService.getCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    },

    //根据总行银行id，所在省市，关键字查找分行数据
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return bankService.query(params, $scope.filter.HeadBankID, $scope.filter.CityID, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //弹出新建银行信息窗口
    $scope.add = function (data) {
        $scope.model = newEntity;
        $('#modal-add').modal('show');
    };
    //弹出修改银行信息窗口
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {
            //新建银行信息
            bankService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.addForm.$setPristine();
                $('#modal-add').modal('hide');
            });
        }
        else {
            //修改银行信息
            bankService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除某条银行信息，刷新列表
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.bank_name + ' 吗？')) {
            bankService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
    //获取所有的总行数据
    bankService.queryAll().then(function (data) {
        $scope.BankData = data;
    });
    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });
    //获取对应省的市级地址
    $scope.ProvinceChange = function () {
        if ($scope.model.bankprovince == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.bankprovince).then(function (data) {
                $scope.BankCityData = data;
            });
        }
    }

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
    $scope.kong = function () {
        window.location.reload();
    }
    $scope.byNameClick = function (Name) {
        $scope.byName = Name;
    }
    $scope.tableParams = new ngTableParams({ 'sorting': { 'bank_number': 'desc' } }, {
        getData: function (params) {
            if ($scope.filter.findPrecise) {
                return bankService.findSpecificBank($scope.filter.find_id, params).then(function (data) {
                    if (data) {
                        $scope.first = $scope.getFirst(params);
                        $scope.branchData = [data];
                        return [data];
                    } else {
                        swal('查询结果为空，建议使用模糊查询！');
                        return [];
                    }
                });
            } else {
                return bankService.getBank($scope.model.head_bank_id, $scope.model.address_id, $scope.model.keyword, params).then(function (data) {
                    $scope.first = $scope.getFirst(params);
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
    });
    //获取对应省的市
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
    //获取所有的银行账户总行信息
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });

    //根据总行，所在市，关键字找到对应的分行数据
    $scope.queryVague = function () {
        $scope.filter.findPrecise = false;
        if (($scope.model.head_bank_id && $scope.model.province_id && $scope.model.address_id) || $scope.model.keyword) {
            $scope.tableParams.reload();
        } else {
            swal("请省份(直辖市)、市级、银行名称填写完整后查询！");
        }
    }

});

hpxAdminApp.controller('baofooAccountController', function ($interval,$rootScope, $scope, $state, API_URL, NgTableParams, billService, constantsService, payService, customerService) {

    $scope.filter={
        keyword:'',
        phone:''
    }
    //获取所有宝付账户
    $scope.tableParams = new NgTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return payService.getAllEnterpriseBaofoo(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }


    //获取某条详细信息，弹出审核窗口
    $scope.check = function (item) {
        $scope.model = angular.copy(item);
        $('#modal-check').modal('show');
    };

    $scope.save = function () {
        payService.updateEnterpriseBaofoo($scope.model).then(function (result) {
            $('#modal-check').modal('hide');
            $scope.tableParams.reload();
        })
    }
});

hpxAdminApp.controller('BaofooBalanceController', function ($http, $scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    $scope.filter = {
        'func': 'detail',
        'deadlineTime1': '',
        'deadlineTime2': '',
        time1: '',
        time2: '',
        orderStatus: 816,
        orderPayType: 1203,
        type:3,
        status:1
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.deadlineTime1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.deadlineTime2 = $("#end_time").val();
    });

    $("#time1").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#time1").datetimepicker("setEndDate", $("#time2").val());
    }).on('changeDate', function (e) {
        $scope.filter.time1 = $("#time1").val();
    });

    $("#time2").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#time2").datetimepicker("setStartDate", $("#time1").val());
    }).on('changeDate', function (e) {
        $scope.filter.time2 = $("#time2").val();
    });

    //获取所有正在进行中的订单
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
        getData: function (params) {
            return orderService.getAllAliveOrders(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    $scope.check = function (data) {
        console.log(data);
        $scope.model = data;      //弹出详细窗口
        showBaofooBalanceInfo(data.drawer_id);
        $('#modal-check').modal('show');
    };

    $scope.reflash2 = function () {
        showBaofooBalanceInfo($scope.model.drawer_id);
    };

    //显示宝付详情
    function showBaofooBalanceInfo(id) {
        console.log("企业ID：" + id);
        $scope.tableParams2 = new NgTableParams({sorting: {'id': 'asc'}}, {
            getData: function (params) {
                return payService.getBaofooBalanceWithId(id, params, $scope.filter).then(function (result) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model.baofoo = {
                        member_id: result.member_id,
                        account_balance: result.account_balance
                    };
                    return result.baofoo_records;
                });
            }
        });
    }

    $scope.show = function (data) {
        var newWin = window.open('loading page');
        newWin.location.href = API_URL+'/paying/bfapi/unfreeze?orderId='+data.id+'&token='+$rootScope.identity.token;
    };

});
hpxAdminApp.controller('BaofooInfoController', function (payService,$cookieStore,$http, $scope, $rootScope, $state, API_URL, $location) {
    var order_id = $location.search().order_id;
    var result = payService.getBaofooView(order_id);
    console.log(result);
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
    $scope.todayStr = s;    //当前日期字符串
    angular.copy($scope.model, $scope.initModel);

    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }
    //初始化数据,设置最大查询允许月份
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
            "星期二": 2,
            "星期三": 3,
            "星期四": 4,
            "星期五": 5,
            "星期六": 6,
            "星期日": 7,
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
            //判断不超过最大月份
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
            if (month == 1 || month == 7 || month == 10) {
                $('.calendar').css('height','620px')
            } else {
                $('.calendar').css('height','535px')
            }
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

hpxAdminApp.controller('bottombarController', function ($scope, $rootScope, $state) {
});

hpxAdminApp.controller('businessQueryController', function ($rootScope, $scope, $state, customerService, privilegeService, ngTableParams, payingService, toolService, API_URL) {
    $scope.filter = {
        choiceReCharge: 1,
    };
    $scope.query = function (name) {
        if (!name || name.length < 4) {
            swal("至少输入四个关键字！");
            return;
        }
        privilegeService.customerPrivilege({
            'privilege_id': 1
        }).then(function (data) {
            if (data.right == 0) {
                if (data.isuser == 0) {
                    //$('#modal-edit').modal('show'); // 前往登录
                    $('#modal-edit').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $('.h_login').show().siblings().hide();
                    return;
                } else {
                    if (data.enterprise_id <= 0) {
                        //$('#modal-edit').modal('show'); // 前往认证
                        $('#modal-edit').modal({
                            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                            keyboard: false,//键盘关闭对话框
                            show: true//弹出对话框
                        });
                        $('.h_renzheng').siblings().hide();
                        return;
                    } else {
                        //$('#modal-edit').modal('show'); // 前往充值
                        $('#modal-edit').modal({
                            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                            keyboard: false,//键盘关闭对话框
                            show: true//弹出对话框
                        });
                        $('.prompt').siblings().hide();
                        $scope.hpxCharge = function () {
                            $scope.model = newEntity;
                            //$('#modal-edit').modal('show');
                            $('#modal-edit').modal({
                                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                                keyboard: false,//键盘关闭对话框
                                show: true//弹出对话框
                            });
                            $('.h_zhifu').show().siblings().hide();
                        }

                    }
                }
            }
            else {
                customerService.enterpriseDetail(name, 1).then(function (data) {
                    $scope.enterpriseInfo = data;
                    if (data == null) {
                        swal("暂无企业信息！");
                    }
                });
            }
        })
    }

    // 现金购买
    $scope.money = function () {
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_buy').show().siblings().hide();
        // 查询套餐
        privilegeService.privilegePackage({
            'privilege_id': 1
        }).then(function (data) {
            $scope.package = data
        })
        return;
    }

    $scope.refresh = function () {
        $('.h_bty section').eq(0).find('input[name = "sex"]').attr('checked', 'true')
    }

    // 点击购买
    $scope.buy = function () {
        //获取账户余额
        payingService.GetPlatformAccount().then(function (data) {
            $scope.model = data;
            var price = $scope.price || 30;
            var hitems = $scope.items || 1;
            if ($scope.model.platform_account_balance >= $scope.price) {
                privilegeService.privilegePackOrder({
                    'enterprise_id': $rootScope.identity.enterprise_id,
                    'customer_id': $rootScope.identity.customer_id,
                    'package_id': $scope.items
                }).then(function (data) {
                    //$('#modal-edit').modal('show');
                    $('#modal-edit').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $('.h_chenggong').show().siblings().hide();
                })
            } else {
                //$('#modal-edit').modal('show');
                $('#modal-edit').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
                $('.noMoney').show().siblings().hide();
            }
        });
    }
    // 弹窗中的点击事件
    $scope.hpxLgoin = function () {
        $state.go('app.loginInfo');
        //window.location.href = "index.html#/app/loginInfo";
        window.location.reload();
    }
    $scope.phxRenzheng = function () {
        $state.go('app.main.customerInfo')
        //window.location.href = "index.html#/app/main/customerInfo";
        window.location.reload();
    }
    $scope.invitation = function () {
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.frient').show().siblings().hide();
    }
    $scope.recharge = function () {
        $scope.model = newEntity;
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_zhifu').show().siblings().hide();
    }

    $scope.queding = function () {
        window.location.reload();
    }
    // 选择套餐
    $('.h_bty').delegate('.h_o', 'click', function (data) {
        items = $("input:radio[name='sex']:checked").next().val();
        price = $("input:radio[name='sex']:checked").next().attr("price");
        $scope.items = items
        $scope.price = price
        $('.hp_money span').text(price)
    })
    // 支付宝充值
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    // 获取账户充值记录
    $scope.tableParams = new ngTableParams({ 'sorting': { 'change_time': 'desc' } }, {
        getData: function (params) {
            return payingService.platformAccountBalance(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    $scope.XYRecharge = function () {
        window.open('http://www.cibfintech.com/');
    }
    //打开一个新页面，进行充值活动
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);
        $('#modal-edit').modal('hide');
    };
    $scope.choiceReCharge = function (number) {
        $scope.filter.choiceReCharge = number;
    };
    $scope.hpxCharge = function () {
        $scope.model = newEntity;
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_zhifu').show().siblings().hide();
    }
    //查看详情
    $scope.read = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.model = data;
            //$('#modal-read').modal('show');
            $('#modal-read').modal({
                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                keyboard: false,//键盘关闭对话框
                show: true//弹出对话框
            });
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
        //登录功能，登录成功后跳转到个人中心
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            localStorageService.set('customer', data);
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
});

hpxAdminApp.controller('calendarController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
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
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };

    $scope.submitCalendar = function () {

    }
});

hpxAdminApp.controller('checkAccountController', function ($interval,$rootScope, $scope, $state, API_URL, NgTableParams, billService, constantsService, addressService, customerService) {
    $scope.filter = {
        'checkedType': 0,   //默认未审核
    };
    //获取未审核或已审核的银行账户信息数据
    $scope.tableParams = new NgTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return customerService.query(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //点击跳转到新页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //定时两分钟刷新
    var timer = $interval($scope.reflash, 60*1000);
    //页面销毁时 取消 不然会一直刷新
    $scope.$on(
        "$destroy",
        function( event ) {
            $interval.cancel( timer );
        }
    );
    //获取某条详细信息，弹出审核窗口
    $scope.check = function (item) {
        $scope.model = item;
        $('#modal-check').modal('show');
    };
    //银行账户认证
    //$scope.approve = function (item) {
    //    customerService.ReviewEnterPriseAccount(item.id, { 'verify_string': 'infogate' }).then(function (data) {
    //        $scope.tableParams.reload();
    //    });
    //};
    //审核通过
    $scope.pass = function () {
        if (confirm('确认通过吗？')) {
            if (!$scope.model.check_description) {
                $scope.model.check_description = "审核通过";
            }
            customerService.checkAccount($scope.model.id,{ 'is_verified': 1, 'description': $scope.model.check_description }).then(function (data) {
                $scope.tableParams.reload();
                $scope.checkForm.$setPristine();
                $('#modal-check').modal('hide');
            });
        }
    };
    //审核不通过
    $scope.reject = function () {
        if (!$scope.model.check_description || $scope.model.check_description.length == 0) {
            alert('请填写不通过原因！');
            return;
        }

        if (confirm('确认不通过吗？')) {
            customerService.checkAccount($scope.model.id,{ 'is_verified': -1, 'description': $scope.model.check_description }).then(function (data) {
                $scope.tableParams.reload();
                $scope.checkForm.$setPristine();
                $('#modal-check').modal('hide');
            });
        }
    };

});

hpxAdminApp.controller('checkBillController', function (exportService,$rootScope, $interval, $scope, $stateParams, $state, API_URL, NgTableParams, billService, constantsService, addressService,EXPORT_URL) {
    console.log($scope)
    console.log($rootScope)
    $scope.filter = {
        checkedType: '0'     //默认未审核
    };
    //获取所有的常量类型数据
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型信息
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型信息
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取汇票属性信息
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取电票汇票瑕疵信息
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
        var model = $stateParams.data;
        if(model != null){
            check(model.bill);
            $stateParams.model = null;
        }
    })
    //获取纸票汇票瑕疵信息
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    //获取交易方式类型信息
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取对应省的所有市级地址
    $scope.provinceChange = function () {
        if (!$scope.model.product_location_province_id) {
            $scope.cityData = [];
        } else if ($scope.model.product_location_province_id == 1 || $scope.model.product_location_province_id == 20 || $scope.model.product_location_province_id == 860 || $scope.model.product_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.product_location_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.product_location_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }

        //if (!$scope.model.product_location_province_id) {
        //    $scope.cityData = [];
        //}
        //else {
        //    return addressService.queryCity($scope.model.product_location_province_id).then(function (data) {
        //        $scope.cityData = data;
        //    });
        //}
    }

    //获取所有未审核或者已审核的票据资料信息
    $scope.tableParams = new NgTableParams({'sorting': {'publishing_time': 'desc'}}, {
        getData: function (params) {

            var checkedType = [];
            if (document.getElementById("unchecked").checked)
                checkedType.push(document.getElementById("unchecked").value);
            else if (document.getElementById("checked").checked)
                checkedType.push(document.getElementById("checked").value);
            $scope.filter.checkedType = checkedType;

            return billService.getAllBillUnchecked(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //跳转到新页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }


    var timer = $interval($scope.reflash, 60 * 1000);
    $scope.$on(
        "$destroy",
        function (event) {
            $interval.cancel(timer);
        }
    );

    $scope.isSelectBillFlaw =function(id,ids){
        return ids.indexOf(id)>=0;
    }

    var check = $scope.check = function (item) {
        $scope.model = item;         //获取某条客户资料详细信息
        $scope.provinceChange();        //获取对应省的市级地址

        //弹出审核窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();       //图片放大功能
    };


    $scope.handWriting = function (model, type, imgUrl) {
        $('#modal-check').modal('hide');
   /*     var url = $state.href('handwriting');
        window.open(url + '?type=' + type + '&billid=' + model.id, '_blank');
*/

        var data = {
            model:model,
            type:type
        }
        $state.go('handwriting',{data:data});
    }

    $scope.resd = function (item) {
        $scope.model = item;         //获取某条客户资料详细信息
        $scope.provinceChange();        //获取对应省的市级地址
        //获取电票或纸票的票据瑕疵
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
        //弹出详细窗口

        $('#modal-read').modal('show');
        $('.jqzoom').imagezoom();       //图片放大功能
    };

    $scope.pass = function () {
        if (!$scope.model.bill_type_id) {
            alert("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            alert("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            alert("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                alert("请上传汇票正面");
                return;
            }
        } else {
            if (!$scope.model.acceptor_type_id) {
                alert("请选择承兑方类型");
                return;
            }

           /* if (!$scope.model.acceptor_name) {
                alert("请输入承兑方名称");
                return;
            }
*/
           /* if (!$scope.model.bill_deadline_time) {
                alert("请输入汇票到期日");
                return;
            }*/

            if (!$scope.model.contact_name) {
                alert("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                alert("请输入联系方式");
                return;
            }
        }

        if (confirm('确认通过吗？')) {
            $scope.model.is_real = 1;
            save();
        }
    };
    $scope.reject = function () {
        if (!$scope.model.check_description || $scope.model.check_description.length == 0) {
            alert('请填写不通过原因！');
            return;
        }

        if (confirm('确认不通过吗？')) {
            $scope.model.is_real = 0;
            save();
        }
    };

    save = function () {
        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {     //电票瑕疵信息
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {     //纸票瑕疵信息
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        $scope.model.bill_id = $scope.model.id;
        //审核票据，并推送审核结果给后台
        billService.checkBill($scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.checkForm.$setPristine();
            $('#modal-check').modal('hide');
        });
    };
    //导出表格
    $scope.exportExcel = function () {
        var resource_url = EXPORT_URL+"/bills/billCheck?n=65535&orderBy=-publishing_time&p=1";
        var sheet_name = "票据审核表";

        //根据条件生成url
        /*switch ($scope.filter.billTypeId){
            case '101':
                sheet_name += "_电票";
                resource_url += "&billTypeId=101";
                break;
            case '102':
                sheet_name += "_纸票";
                resource_url += "&billTypeId=102";
                break;
        }
        switch ($scope.filter.tradeTypeCode){
            case '701':
                sheet_name += "_现票卖断";
                resource_url += "&tradeTypeCode=701";
                break;
            case '702':
                sheet_name += "_预约出票";
                resource_url += "&tradeTypeCode=702";
                break;
        }
        switch ($scope.filter.checkedType){
            case '0':
                sheet_name += "_未审核";
                resource_url += "&checkedType=0";
                break;
            case '1':
                sheet_name += "_已审核";
                resource_url += "&checkedType=1";
                break;
        }*/

        var excelRequest =   {
            "resource_url":resource_url,
            "resource_name":"bills",
            "sheet_name":sheet_name,
            "label_names":["汇票类型","交易方式","票面金额","汇票到期日","联系人","联系电话","发布时间","审核状态"],
            "label_types":["String","String","Decimal","Date","String","String","Time","String"],
            "label_keys":["bill_type_name","trade_type_name","bill_sum_price","bill_deadline_time","contact_name","contact_phone","publishing_time","checked_name"]
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export',token,excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }

});

hpxAdminApp.controller('checkCustomerController', function (exportService, $interval, $rootScope, $scope, $stateParams, $state, API_URL, NgTableParams, constantsService, addressService, customerService, payService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'checkedType': 0,        //默认未审核
    };
    //获取票据类型信息
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeData = data;
    })

    //获取未审核或已审核的客户资料信息
    $scope.tableParams = new NgTableParams({'sorting': {'id': 'asc'}}, {
        getData: function (params) {
            return customerService.queryAllCustomersUnverified(params, $scope.filter.checkedType).then(function (data) {
                $scope.first = $scope.getFirst(params);
                console.log(data)
                return data;
            });
        }
    });
    //跳转到新页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.credential_front_photo_path);
    }
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    var timer = $interval($scope.reflash, 60 * 1000);
    $scope.$on(
        "$destroy",
        function (event) {
            $interval.cancel(timer);
        }
    );

    $scope.check = function (item) {
        $scope.model = item;        //获取某条数据的详细信息
        //获取所有的省级地址
        addressService.queryAll().then(function (data) {
            $scope.ProvinceData = data;
            $scope.provinceChange();
        });
        //获取对应省的所有市级地址
        $scope.provinceChange = function () {
            if (!$scope.model.enterprise_province_id) {
                return;
            }
            else {
                return addressService.queryCity($scope.model.enterprise_province_id).then(function (data) {
                    $scope.CityData = data;
                    $scope.cityChange();
                });
            }
        }
        //获取对应市的区
        $scope.cityChange = function () {
            if (!$scope.model.enterprise_city_id) {
                return;
            }
            else {
                return addressService.queryDstrict($scope.model.enterprise_city_id).then(function (data) {
                    $scope.AddressData = data;
                });
            }
        }
        $('#modal-edit').modal('show');     //弹出审核窗口
        $('.jqzoom').imagezoom();       //图片放大功能
    };
    $scope.read = function (item) {
        $scope.model = item;        //获取某条数据的详细信息
        $('#modal-read').modal('show');     //弹出审核窗口
        $('.jqzoom').imagezoom();       //图片放大功能
    };

    //审核通过
    $scope.pass = function () {
        if (confirm('确认通过吗？')) {
            if (!$scope.model.verify_description) {
                $scope.model.verify_description = "审核通过";
            }
            customerService.checkCustomerReview($scope.model.id, {
                'review_result_type_id': 1,
                'unified_social_credit_code': $scope.model.unified_social_credit_code,
                'licence_register_no': $scope.model.licence_register_no,
                'organization_code_number': $scope.model.organization_code_number,
                'licence_addr': $scope.model.licence_addr,
                'legal_name': $scope.model.legal_name,
                'licence_name': $scope.model.licence_name,
                'tax_cert_name':$scope.model.tax_cert_name,
                'legal_cert_no': $scope.model.legal_cert_no,
                'description': $scope.model.verify_description,
                'licence_type': $scope.model.licence_type,
                'founded_date': $scope.model.founded_date
            }).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');

                payService.econtractRegister($scope.model.id, $scope.model).then(function (result) {
                    //倚天鉴系统用户注册
                });
            });
        }
    };
    //审核不通过
    $scope.reject = function () {
        if (!$scope.model.verify_description || $scope.model.verify_description.length == 0) {
            alert('请填写不通过原因！');
            return;
        }
        if (confirm('确认不通过吗？')) {
            customerService.checkCustomerReview($scope.model.id, {
                'review_result_type_id': -1,
                'unified_social_credit_code': $scope.model.unified_social_credit_code,
                'licence_register_no': $scope.model.licence_register_no,
                'organization_code_number': $scope.model.organization_code_number,
                'licence_addr': $scope.model.licence_addr,
                'legal_name': $scope.model.legal_name,
                'licence_name': $scope.model.licence_name,
                'tax_cert_name': $scope.model.tax_cert_name,
                'legal_cert_no': $scope.model.legal_cert_no,
                'description': $scope.model.verify_description,
                'licence_type': $scope.model.licence_type,
                'founded_date': $scope.model.founded_date
            }).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //客户失效
    $scope.delete = function (data) {
        if (confirm('确定要删除本客户吗？')) {
            customerService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

    //导出表格
    $scope.exportExcel = function () {
        var resource_url = API_URL + "/customers/customerReview?n=65535&orderBy=%2Bid&p=1";
        var sheet_name = "企业审核表";
        var label_names, label_types, label_keys;
        if ($scope.filter.checkedType == 1) {
            resource_url += "&isChecked=1";
            sheet_name += "_已审核";
        } else if ($scope.filter.checkedType == 0) {
            resource_url += "&isChecked=0";
            sheet_name += "_未审核";
        }
        label_names=["企业名称","统一社会信用码/营业执照注册号","联系人","联系号码"];
        label_types=["String","String","String","String"];
        label_keys=["enterprise_name","credential_number","contact_person","contact_phone"];

        var excelRequest = {
            "resource_url": resource_url,
            "resource_name": "enterprises",
            "sheet_name": sheet_name,
            "label_names": label_names,
            "label_types": label_types,
            "label_keys": label_keys
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export', token, excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }
    // 企业详细信息
    //var oLi = $('.hpx_one')
    //var oDitel = $('.h_detail')
    //$(oLi).each(function (i, ele) {
    //    $(ele).click(function () {
    //        $(this).addClass('h_active').siblings().removeClass('h_active')
    //        var ind = $(this).index()
    //        $(oDitel).eq(ind).addClass('h_block').siblings().removeClass('h_block')
    //    })
    //})
    //if ($('.h_five').find('input[type=text]').attr('value') == "" || $('.h_three').find('input[type=text]').attr('value') == "") {
    //    //$('.h_btn').attr('disabled')
    //    $('.hp_btn').css('display', 'none')
    //    console.log('有一个为空')
    //} else if ($('.h_five').find('input[type=text]').attr('value').length > 0 || $('.h_three').find('input[type=text]').attr('value').length > 0) {
    //    console.log('有一个不为空')
    //}
    //$scope.agent = function () {
    //    window.location.href = "index.html#/app/customer/checkAgentTreasurer"
    //}
});

hpxAdminApp.controller('commissionController', function ($rootScope, $scope, $stateParams, $state, API_URL, NgTableParams, commissionService) {
    $scope.filter = {};
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    //初始化列表
    $scope.tableParams = new NgTableParams({ sorting: { 'enterprise_id': 'asc' } }, {
        getData: function (params) {
            return commissionService.query(params,$scope.filter.enterpriseName).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    $scope.refresh = function () {
        $scope.tableParams.reload();
    };

    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        commissionService.update($scope.model).then(function () {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    };
});

hpxAdminApp.controller('constantsController', function ($scope, $rootScope, $state, API_URL, NgTableParams, constantsService, constantsTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };

    //constantsService.queryAll().then(function (data) {
    //    $scope.constantsData = data.constants;
    //    $scope.filterTypeChange();
    //});
    //$scope.filterTypeChange = function () {
    //    if ($scope.filter.constant_type_id == null) {
    //        $scope.filterConstants = [];
    //    }
    //    else {
    //        constantsService.queryByConstantTypeID($scope.filter.constant_type_id).then(function (data) {
    //            $scope.filterConstants = data;
    //        });
    //    }
    //};

    //获取所有的常量类型的对应常量（即是获取所有的常量）
    constantsTypeService.queryByConstantTypeID($scope.filter.constantTypeId).then(function (data) {
        $scope.constantsTypes = data;
    });
    //constantsTypeService.queryAll().then(function (data) {
    //    $scope.constantsTypes = data.constant_types;
    //});

    //获取对应的常量类型的所有常量信息
    $scope.tableParams = new NgTableParams({ sorting: { 'code': 'asc' } }, {
        getData: function (params) {
            return constantsService.query(params, $scope.filter.constantTypeId, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    $scope.edit = function (data) {
        if (data == null) {         //弹出新建常量窗口
            $scope.model = newEntity;
            $scope.model.constant_type_id = $scope.filter.constantTypeId;
        }
        else {          //弹出修改常量窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {          //新建对应常量类型的常量
            constantsService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改对应常量类型的常量
            constantsService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除对应常量类型的常量
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.constant_name + ' 吗？')) {
            constantsService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});
hpxAdminApp.controller('constantsTypeController', function ($scope, $rootScope, $state, NgTableParams, constantsTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    //constantsTypeService.queryAll().then(function (data) {
    //    $scope.constantsTypes = data.constant_types;
    //});

    //获取所有的常量类型
    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            return constantsTypeService.query(params, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    $scope.edit = function (data) {
        if (data == null) {         //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {          //新建常量类型
            constantsTypeService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改常量类型信息
            constantsTypeService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除某条常量类型信息
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.constant_type_name + ' 吗？ ')) {
            constantsTypeService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
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
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内容
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
            title: "确定要删除本条地址信息吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.removeAddress(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    };
});
hpxAdminApp.controller('customerController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {
    console.log($scope)
    $scope.filter = {
        isModified : 1,
    };
    //默认客户类型为企业客户
    $scope.model = {
        customer_type_code: 301,
        //'job_photo_address': 'assets/img/hpx-14.jpg',
        //'id_front_photo_address': 'assets/img/hpx-14.jpg',
        //'id_back_photo_address': 'assets/img/hpx-15.jpg',
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
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
    //获取对应省的市
    $scope.provinceChange = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            $scope.filter.isModified == 0;
            //document.getElementById("tradCity").style.display = "none";
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            $scope.filter.isModified == 1;
            //document.getElementById("tradCity").style.display = "block";
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
    //提示信息按钮
    $scope.Reminder = function () {
        //$('#modal-license').modal('show');
        $('#modal-license').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
            swal('请输入联系人！');
            document.querySelector("body").css({ "overflow": "visible" });
            return;
        }
        else {
            customerService.updateCustomer($scope.model).then(function () {
                swal({ 'title': '联系人信息保存成功，请完善企业信息！！！' }, function () {
                    $state.go("app.main.enterpriseInfo");
                })
            })
        }
    };

    $scope.modified = function () {
        $scope.model.is_verified = 0;
        var tempList = $scope.model.telephone_number.split('-');
        $scope.model.telephone_code = tempList[0];
        $scope.model.telephone_number_number = tempList[1];
        $scope.filter.isModified = 1;
        //if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
        //    document.getElementById("tradCity").style.display = "none";
        //}
        //setTimeout(function () {
        //    if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
        //        document.getElementById("tradCity").style.display = "none";
        //    }
        //}, 50);
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
    // 准备资料
    $scope.ycimg = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "rotes";
        } else {
            trans.className = "rote";
        }
    }
});
hpxAdminApp.controller('customerLevelController', function ($scope, $rootScope, $state, NgTableParams, customerLevelService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有的客户级别信息
    customerLevelService.queryAll().then(function (data) {
        $scope.customerLevel = data.customer_levels;
    });
    //获取客户级别的所有数据
    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            //customerLevelService.queryAll().then(function (data) {
            //    $scope.customerLevel = data.customer_levels;
            //});
            return customerLevelService.query(params, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    $scope.edit = function (data) {
        if (data == null) {         //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {          //新建客户级别信息
            customerLevelService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改客户级别信息
            customerLevelService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除某条客户级别信息
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.customer_level_name + ' 吗？')) {
            customerLevelService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});

hpxAdminApp.controller('customerQueryController', function ($scope, API_URL, NgTableParams, enterpriseService) {
    console.log($scope)
    $scope.filter = {};
    //获取所有企业用户
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return enterpriseService.getAllEnterpriseUser(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    //$scope.reflash = function () {
    //    $scope.tableParams.reload();
    //};
    var h_fun = function (model) {
        enterpriseService.getOneEnterpriseUserInfo(model).then(function (result) {
            console.log(result);
            $scope.model = result;
        })
    };
});
hpxAdminApp.controller('detailCtr', ['$scope', '$rootScope', function ($scope, $rootScope, $window) {

	            $rootScope.saveDetail = function () {
	                KindEditor.sync('#textareDetail');
	                alert(document.getElementById('textareDetail').value);
	                $rootScope.detail = document.getElementById('textareDetail').value;
	                window.history.go(-1);

	                //window.location.href = "/www/views/portalInformationInfo.html";
	            }
	        }]);
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
        if (!$scope.model.denomination || !/^[0-9]+([.]{1}[0-9]{0,6}){0,1}$/.test($scope.model.denomination)) {
            swal('请输入票面金额。');
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

    // 贴现计算器限制金额100亿
    $scope.onlyNumbers = function (denomination,max) {
        var denominationNum = Number(denomination);
        var maxNum = Number(max);
        if (denominationNum > maxNum) {
            swal("您输入的票面金额有误，请重新输入！");
            $scope.model.denomination = "";
        }
    }
});

hpxAdminApp.controller('editQuoteController', function ($rootScope, $scope, $timeout, $state, $stateParams, addressService, customerService, ngTableParams, billService, $cookieStore, constantsService) {
    //判断是否可进行报价，不行就直接返回
    if ($rootScope.identity.can_publish_offer != 1) {
        swal("您暂时还不能报价！");
        window.history.back();
        return;
    }
    if ($rootScope.identity.is_verified == -1 || $rootScope.identity.is_verified == 0 || $rootScope.identity.is_verified == 2) {
        swal("您是个人客户，不能进行机构报价！");
        window.history.back();
        return;
    }

    $scope.filter = {};

    //设置默认的内容
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

    //如果id不为0，获取指定报价信息
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
        if ($scope.model.bill_style_id == 203 || $scope.model.bill_style_id == 205) {
            if (!$scope.model.trade_location_id) {
                swal("请选择交易地点。");
                return;
            }
        }

        $scope.model.offer_detail = JSON.stringify($scope.model.offer_detail);
        if ($scope.model.id == null) {
            //新增报价
            billService.insertBillOffer($scope.model).then(function (data) {
                swal('新增报价成功！');
                $state.go('app.main.quote');
            });
        }
        //else if ($rootScope.identity.enterprise_id == 0) {
        //    $('#link5').attr("disabled", true)

        //} else if ($rootScope.identity.enterprise_id == 0) {
        //    $('#link5').attr("disabled", true)
        //}
        else {
            //修改报价
            billService.updateBillOffer($scope.model).then(function (data) {
                swal('修改报价成功！');
                $state.go('app.main.quote');
            });
        }
    };

    $scope.colse = function () {
        $state.go('app.main.quote');
    }
});
hpxAdminApp.controller('electronicAccountController', function ($scope, $rootScope, $state, ngTableParams, API_URL,XingYe_URL, payingService, customerService, bankService, addressService, constantsService) {
    console.log($scope)
    console.log($rootScope)
    $scope.filter = {
        is_vis: false             //新增按钮的显示隐藏
    };
    if ($rootScope.identity.enterprise_id == -1 && $rootScope.identity.is_operator == 1) {
        swal('您已经被其他企业绑定为操作员,请重新登陆生效!')
    }
    customerService.getAllEnterprise().then(function (data) {
        $scope.model = data;
    })
    //hpxCou = function () {
    if ($rootScope.identity.is_verified >= 3) {
        customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
            $scope.findEnterprise = data;
            var phxAid = $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id;
            payingService.getAgentTreasurer(phxAid).then(function (data) {
                $scope.agentModel = data;
            })
        })
        $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
            getData: function (params) {
                return customerService.getEnterpriseMember().then(function (data) {
                    $scope.enterpriseMembers = data;
                });
            }
        });
        //获取所有的银行账户信息，并显示是否为默认银行账户
        customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
            $scope.findEnterprise = data;
            if ($rootScope.identity.is_verified >= 1 || $scope.findEnterprise.is_alive >= 1) {
                var enterprise_id = $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id;
                payingService.getAccount(enterprise_id).then(function (data) {
                    $scope.identifyModel = data;
                    if (!data) {
                        $scope.filter.is_vis = true;
                    } else {
                        $scope.AccountData = data.acct_list;
                        if ($scope.AccountData.length >= 2) {
                            $scope.filter.is_vis = false;
                        } else {
                            $scope.filter.is_vis = true;
                        }
                    }
                });
            }
        })
    }
    //}
    //hpxCou();
    //刷新
    $scope.reflash = function () {
        window.location.reload();
    }
    $scope.verifyStr = "获取验证码";
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if ($scope.disableVerify)
            return;
        if (!$scope.operatorModel.operator_phone_number || $scope.operatorModel.operator_phone_number.length != 11) {
            swal('请输入正确的手机号码！');
            return;
        }
        customerService.phoneVerify($scope.operatorModel.operator_phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second <= 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };
    // 绑定操作员
    $scope.addOperater = function (data) {
        $scope.operatorModel = {}
        if (data != null) {
            $scope.operatorModel.id = 0;
            $scope.operatorModel.remove_phone_number = data.phone_number;
            $scope.operatorModel.operator_phone_number = $rootScope.identity.phone_number;
            $scope.is_remove = true;
        } else {
            $scope.is_remove = false;
        }
        //$('#modal-add').modal('show');  // 显示增加操作员的弹出窗口
        $('#modal-add').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    // 提交
    $scope.submitOperater = function () {
        if ($scope.is_remove) {
            return $scope.removeOperater($scope.operatorModel);
        }
        if ($scope.operatorModel.operator_phone_number_code.length == 6) {
            customerService.insertEnterpriseMember($scope.operatorModel).then(function (data) {
                $scope.tableParams.reload();
                //angular.copy(emptyEntity, newEntity);
                $('#modal-add').modal('hide');
            });
        } else {
            swal('请输入正确的验证码！');
        }
        $scope.second = 0;
    };
    // 删除操作员
    $scope.removeOperater = function (data) {
        //console.log(data)
        swal({
            title: "确定要删除该操作员吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.deleteEnterpriseMember(data).then(function (data) {
                $scope.tableParams.reload();
                $('#modal-add').modal('hide');
            });
        });
    };

    // 账户绑定
    //读取对应银行账户的详细信息
    $scope.read = function (data) {
        $scope.accountModel = angular.copy(data);
        //$('#modal-read').modal('show');
        $('#modal-read').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //新增银行账户
    $scope.add = function (type) {
        if (type != null) {
            $('#modal-addAccount').modal({
                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                keyboard: false,//键盘关闭对话框
                show: true//弹出对话框
            });
        }
        $scope.accountModel = {};
    };
    // 根据支行行号查询银行名称
    $scope.findNumber = function () {
        bankService.getBanks($scope.accountModel.cnaps_code).then(function (data) {
            $scope.accountModel.bank_branch_name = data.bank_branch_name
        })
    }
    //删除银行账户
    $scope.remove = function (data) {
        swal({
            title: "确定要删除本银行账户吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.deleteEnterpriseAccount(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    };
    //弹出验证窗口
    $scope.verify = function (data) {
        $scope.hpxAccount = data;
        //$('#modal-verify').modal('show');
        $('#modal-verify').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //调用后台功能进行自动验证
    //$scope.isDisabled = false;
    //$scope.verifySubmit = function () {
    //    $scope.isDisabled = true;
    //    $scope.models = {
    //        'enterprise_person': $scope.findEnterprise.enterprise_name || $rootScope.identity.enterprise_name,
    //        'enterpriseId': $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id,
    //    };
    //    $scope.modeles = {
    //        account_type_code: 501,
    //        is_default: 0,
    //    }
    //    payingService.checkAccount($scope.models.enterpriseId, $scope.model.verify_string, $scope.modeles.is_default, $scope.modeles.account_type_code).then(function (data) {
    //        swal({
    //            'title': '小额验证成功！',
    //            confirmButtonText: "OK",
    //        }, function () {
    //            window.location.reload();
    //        });
    //    });
    //};
    //账户验证
    //$scope.verifyStr = "账户验证";
    //$scope.disableVerify = false;
    $scope.getVerifyh = function () {
        var hpAid = $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id;
        if (!$scope.accountModel.bank_branch_name) {
            swal("请输入正确的开户行行号");
            return;
        }
        if (!$scope.accountModel.cnaps_code) {
            swal("请输入开户行行号!");
            return;
        }
        if (!$scope.accountModel.account_number) {
            swal("请输入账号!");
            return;
        }
        //$scope.verifyStr = "等待小额汇款";
        //$scope.disableVerify = true;
        if ($scope.AccountData == null || $scope.AccountData.length == 0) {
            payingService.openAccount(hpAid, $scope.accountModel).then(function (data) {
                if (data && data != null) {
                    //swal("机构认证审核通过，请等待小额验证！");
                    swal({
                        'title': '机构认证审核通过，请等待小额验证！',
                        confirmButtonText: "OK",
                    }, function () {
                        window.location.reload();
                    });
                }
            });
        } else if ($scope.AccountData.length == 1) {
            if ($scope.AccountData[0].bank_number.startsWith("309") || $scope.accountModel.cnaps_code.startsWith("309")) {
                payingService.addMoreAccount(hpAid, $scope.accountModel).then(function (data) {
                    if (data && data != null) {
                        //swal("机构认证审核通过，请等待小额验证！");
                        swal({
                            'title': '机构认证审核通过，请等待小额验证！',
                            confirmButtonText: "OK",
                        }, function () {
                            window.location.reload();
                        });
                    }
                });
            } else {
                swal("您没有--银行卡，请绑定--银行卡！！！")
            }
        }
    }
    // 小额鉴权
    $scope.isDisabled = false;
    $scope.verifySubmit = function () {
        $scope.isDisabled = true;
        $scope.accountModel.account_type_code = '501';
        $scope.is_default = '0';
        payingService.checkAccount($scope.findEnterprise.enterprise_id, $scope.accountModel.verify_string, $scope.accountModel.is_default, $scope.accountModel.account_type_code).then(function (data) {
            swal({
                'title': '小额验证成功！',
                confirmButtonText: "OK",
            }, function () {
                window.location.reload();
            });
        });
    };

    $scope.identifySubmit = function () {
        window.open(XingYe_URL + $rootScope.identity.corp_id);
    }


});
hpxAdminApp.controller('endorsementController', function ($rootScope, $scope, $timeout, $state, FILE_URL,port, Upload, billService, fileService) {
    //默认显示的图片
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
                data: { 'FileTypeCode': 1002, 'port': port }
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
    //保存上传的图片，并提示上传成功
    $scope.save = function () {
        swal("图片上传成功！");
        location.reload(false);
    };
});

hpxAdminApp.controller('enterpriseAccountController', function ($scope, $rootScope, $state, ngTableParams, API_URL,XingYe_URL, payingService, customerService, bankService, addressService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    $scope.filter = {
        choiceBill: 1,
        econtract: null,
        is_vis: false
    };
    //获取账户类型
    constantsService.queryConstantsType(5).then(function (data) {
        $scope.accountTypeData = data;
    });

    // 根据用户查询企业
    hpxCou = function () {
        if ($rootScope.identity.is_verified == 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.findEnterprise = data;
                $rootScope.identity.is_operator = 0;
                var phxAid = $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id;
                payingService.getAgentTreasurer(phxAid).then(function (data) {
                    $scope.agentModel = data;
                })
            })
        }
    }
    hpxCou();

    //获取所有的银行账户信息，并显示是否为默认银行账户
    $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
        getData: function (params) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.findEnterprise = data;
                if ($rootScope.identity.is_verified >= 1 || $scope.findEnterprise.is_alive >= 1) {
                    var enterprise_id = $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id;
                    return payingService.getAccount(enterprise_id).then(function (data) {
                        if (!data) {
                            $scope.filter.is_vis = true;
                        } else {
                            $scope.first = $scope.getFirst(params);
                            $scope.AccountData = data.acct_list;
                            if ($scope.AccountData.length >= 2) {
                                $scope.filter.is_vis = false;
                            } else {
                                $scope.filter.is_vis = true;
                            }
                        }
                    });
                }
            })
        }
    });
    //获取宝付数据
    //$scope.queryBaofu = function () {
    //    payingService.bfapi.queryBalance(1, 2).then(function (data) {
    //        if (data.member_id)
    //            $scope.baofuData = [data];
    //    })
    //};
    //$scope.queryBaofu();
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //设置为默认账户
    //$scope.default = function (item) {
    //    customerService.updateEnterpriseDefault(item).then(function (data) {
    //        $scope.tableParams.reload();
    //    });
    //}
    //读取对应银行账户的详细信息
    $scope.read = function (data) {
        $scope.model = angular.copy(data);
        //$('#modal-read').modal('show');
        $('#modal-read').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //获取对应银行账户的信息，用于修改银行账户信息
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        if ($scope.model.bank_name) {
            $scope.model.keyword = $scope.model.bank_name;
            $scope.BankChange();
        }
        $scope.model.keyword = null;
        //$('#modal-add').modal('show');
        $('#modal-add').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };

    $scope.submit = function () {
        if (!$scope.model.bank_name) {
            swal("没有注册企业账户，请先注册企业账户再注册银行账户！");
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
    //$scope.BankNumberChange = function () {
    //    bankService.getSpecificBank($scope.model.bank_id).then(function (data) {
    //        $scope.model.bank_number = data.bank_number;
    //    });
    //}
    //删除银行账户
    $scope.remove = function (data) {
        swal({
            title: "确定要删除本银行账户吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.deleteEnterpriseAccount(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    };
    //弹出验证窗口
    $scope.verify = function (data) {
        $scope.hpxAccount = data;
        //$('#modal-verify').modal('show');
        $('#modal-verify').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //调用后台功能进行自动验证
    $scope.isDisabled = false;
    $scope.verifySubmit = function () {
        //if (parseInt($scope.model.verify_string) != 0) {
        //    swal('请输入不超过1元的金额!');
        //    return;
        //}
        $scope.isDisabled = true;
        $scope.models = {
            'enterprise_person': $scope.findEnterprise.enterprise_name || $rootScope.identity.enterprise_name,
            'enterpriseId': $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id,
        };
        $scope.modeles = {
            account_type_code: 501,
            is_default:0,
        }
        payingService.checkAccount($scope.models.enterpriseId, $scope.model.verify_string, $scope.modeles.is_default, $scope.modeles.account_type_code).then(function (data) {
            swal({
                'title': '小额验证成功！',
                confirmButtonText: "OK",
            }, function () {
                window.location.reload();
            });
        });
    };
    //选择
    //$scope.choiceBill = function (choose) {
    //    $scope.filter.choiceBill = choose;
    //    $scope.tableParams.reload();
    //};
    //充值宝付
    //$scope.recharge = function (enterprise_id) {
    //    $scope.baofu_model = {
    //        'enterprise_id': enterprise_id,
    //        'operate': '充值',
    //    }
    //    $('#modal-baofu').modal('show');
    //}
    //充值提现
    //$scope.withdraw = function (enterprise_id) {
    //    $scope.baofu_model = {
    //        'enterprise_id': enterprise_id,
    //        'operate': '提现',
    //    }
    //    $('#modal-baofu').modal('show');
    //}
    //提交宝付充值或者提现
    //$scope.baofuSubmit = function () {
    //    if ($scope.baofu_model.money && $scope.baofu_model.money <= 0) {
    //        swal("请输入大于0的金额!");
    //        return;
    //    }
    //    var target_url = API_URL + '/paying/bfapi/recharge';
    //    if ($scope.baofu_model.operate == "充值") {
    //        target_url = target_url + '?enterpriseId=' + $scope.baofu_model['enterprise_id'] + '&money=' + $scope.baofu_model['money'];
    //    } else {
    //        target_url = target_url + '?token=' + $rootScope.identity['token'] + '&money=' + $scope.baofu_model['money'];
    //    }
    //    var newWindow = window.open("_blank");
    //    newWindow.location = target_url;
    //}

    //新增银行账户
    $scope.add = function (type) {

        //if ($rootScope.identity.is_verified == 2 || $rootScope.identity.is_verified == 0) {
        //    swal("机构认证待审核，请等待或联系客服！")
        //} else if ($scope.hAgent.isChecked == 0 || $scope.agentModel.isChecked == 0) {
        //    swal("经办人认证待审核，请等待或联系客服！")
        //}
        //else {
            if (type != null) {
                $scope.model = newEntity;
                $scope.model = {
                    'account_type_code': type,
                };
                $scope.models = {
                    'enterprise_person': $scope.findEnterprise.enterprise_name || $rootScope.identity.enterprise_name,
                    'enterpriseId': $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id,
                };
                //$('#modal-add').modal('show');  // 显示增加银行账号的弹出窗口
                $('#modal-add').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
            }

            payingService.getAgentTreasurer($scope.models.enterpriseId).then(function (result) {
                $scope.agentModel = result;
            });
    };
    // 根据支行行号查询银行名称
    $scope.findNumber = function () {
        bankService.getBanks($scope.model.cnaps_code).then(function (data) {
            $scope.model.bank_branch_name = data.bank_branch_name
        })
    }

    //账户验证
    $scope.verifyStr = "账户验证";
    $scope.disableVerify = false;
    $scope.getVerifyh = function () {
        var hpAid = $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id;
        if (!$scope.model.bank_branch_name) {
            swal("请输入正确的开户行行号");
            return;
        }
        if (!$scope.model.cnaps_code) {
            swal("请输入开户行行号!");
            return;
        }
        if (!$scope.model.account_number) {
            swal("请输入账号!");
            return;
        }

        $scope.verifyStr = "等待小额汇款";
        $scope.disableVerify = true;
        if ($scope.AccountData == null || $scope.AccountData.length == 0) {
            payingService.openAccount(hpAid, $scope.model).then(function (data) {
                if (data && data != null) {
                    swal("机构认证审核通过，请等待小额验证！");
                }
            });
        } else if ($scope.AccountData.length == 1) {
            if ($scope.AccountData[0].bank_number.startsWith("309") || $scope.model.cnaps_code.startsWith("309")) {
                payingService.addMoreAccount(hpAid, $scope.model).then(function (data) {
                    if (data && data != null) {
                        swal("机构认证审核通过，请等待小额验证！");
                    }
                });
            } else {
                swal("您没有--银行卡，请绑定--银行卡！！！")
            }
        }

        //if ($rootScope.identity.is_verified == 2 || $scope.findEnterprise.enterprise_id == 0 || $scope.findEnterprise.is_alive == 2) {
        //    swal("机构认证待审核，请等待或联系客服！")
        //}
        //else if ($rootScope.identity.is_verified == -1 || $scope.findEnterprise.is_alive == -1) {
        //    swal("机构认证信息有误，请等待或联系客服！")
        //}
        //else if ($scope.agentModel.isChecked == 0) {
        //    swal("业务授权待审核，请等待或联系客服！")
        //}
        //else if ($scope.agentModel.isChecked == -1) {
        //    swal("业务授权信息有误，请等待或联系客服！")
        //}
        //else {
        //    if ($scope.AccountData == null || $scope.AccountData.length == 0) {
        //        payingService.openAccount(hpAid,$scope.model).then(function (data) {
        //            if (data && data != null) {
        //                swal("机构认证审核通过，请等待小额验证！");
        //            }
        //        });
        //    } else if ($scope.AccountData.length == 1){
        //        if ($scope.AccountData[0].bank_number.startsWith("309") || $scope.model.cnaps_code.startsWith("309")) {
        //            payingService.addMoreAccount(hpAid, $scope.model).then(function (data) {
        //                if (data && data != null) {
        //                    swal("机构认证审核通过，请等待小额验证！");
        //                }
        //            });
        //        } else{
        //            swal("您没有--银行卡，请绑定--银行卡！！！")
        //        }
        //    }
        //}
    }

    //完成绑定
    $scope.submitbinding = function () {
        $scope.isDisabled = true;
        if (!$scope.model.is_default) {
            $scope.model.is_default = 0;
        } else {
            $scope.model.is_default = 1;
        }
        payingService.checkAccount($scope.models.enterpriseId, $scope.model.verify_string, $scope.model.is_default, $scope.model.account_type_code).then(function (data) {
            swal({
                "title": "小额验证通过。",
                confirmButtonText: "OK",
            }, function () {
                window.location.reload();
            })
        });
        $('#modal-dialog').modal('hide');
    }
    //var xingyeP = '246d06008c4f4e14afd4d204bb507e5e';
    $scope.identifySubmit = function () {
        //var enterpriseId = $rootScope.identity.enterprise_id || $scope.findEnterprise.enterprise_id;
        window.open(XingYe_URL + $rootScope.identity.corp_id);
    }
});
hpxAdminApp.controller('enterpriseBalanceController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'time1':'',
        'time2':''
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click",function(ev){
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.time1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.time2= $("#end_time").val();
    });

    //获取所有正在进行中的订单
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return payService.getEnterpriseBalance(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }


    $scope.show = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-show').modal('show');
        showEnterpriseBalanceInfo($scope.model.id);
    };

    //显示企业充值详情
    function showEnterpriseBalanceInfo(id) {
        $scope.tableParams2 = new NgTableParams({ sorting: { 'id': 'asc' } }, {
            getData: function (params) {
                return payService.getEnterpriseBalanceWithId(id,params, $scope.filter).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    return data;
                });
            }
        });
    }
    // 刷新
    $scope.reflash2 = function () {
        showEnterpriseBalanceInfo($scope.model.id);
    }

    $scope.add = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-add').modal('show');
    };
    $scope.addBalance = function () {
        payService.updateEnterpriseBalanceWithId($scope.model.id,$scope.model).then(function (result) {
                alert("充值成功");
                $('#modal-add').modal('hide');
        })
    }
});
hpxAdminApp.controller('enterpriseController', function ($scope, $rootScope, $interval, $timeout, $state, Upload, FILE_URL, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService, $stateParams) {
    var bindzh = $stateParams.bindzh;
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    $scope.model = {};
    $scope.model2 = {
        'credential_photos': 'assets/img/hpx-14.png',
    };
    $scope.agentModel = {
        'authorization_xingyeshujin_photo_address': 'assets/img/hpx-sq1.jpg',
        'authorization_xingyebank_photo_address': 'assets/img/hpx-sq2.jpg',
    }
    if ($rootScope.identity.enterprise_id == -1 && $rootScope.identity.is_operator == 1) {
        swal('您已经被其他企业绑定为操作员,请重新登陆生效!')
    }
    $scope.filter = {
        is_accountHandle: 0,
        choiceenterprise: 1,
        is_agentChecked: 2,
        ProTemplate: 0,
    };
    $scope.agree = function () {
        $('#modal-Amenty').modal('hide');
        $scope.filter.Rule = true;
    }
    $scope.reloadModel = function () {
        customerService.getAllEnterprise().then(function (data) {
            $scope.model = data;
            if ($scope.filter.choiceenterprise == 1) {
                if (!$scope.model.credential_photo_address) {
                    $scope.model.credential_photo_address = 'assets/img/hpx-14.png';
                }
                if (!$scope.model.artificial_person_front_photo_address) {
                    $scope.model.artificial_person_front_photo_address = 'assets/img/hpx-15.png';
                }
                if (!$scope.model.artificial_person_back_photo_address) {
                    $scope.model.artificial_person_back_photo_address = 'assets/img/hpx-16.png';
                }
                angular.copy($scope.model, newEntity);
                // 获取操作员列表
                if ($scope.model.is_verified && ($scope.model.is_verified == 1 || $scope.model.is_verified >= 3)) {
                    $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
                        getData: function (params) {
                            return customerService.getEnterpriseMember().then(function (data) {
                                $scope.enterpriseMembers = data;
                            });
                        }
                    });
                }
            }
            if ($scope.model.is_verified > 0 || $scope.findEnterprise.is_alive > 0) {
                //var hpxid = $scope.findEnterprise.enterprise_id || $scope.model.id;
                if ($scope.findEnterprise) {
                    var hpxid = $scope.findEnterprise.enterprise_id;
                } else {
                    var hpxid = $scope.model.id;
                }
                payingService.getAgentTreasurer(hpxid).then(function (result) {
                    if (result == null || result == undefined) {
                        $scope.agentModel = {
                            'authorization_xingyeshujin_photo_address': 'assets/img/hpx-sq1.jpg',
                            'authorization_xingyebank_photo_address': 'assets/img/hpx-sq2.jpg',
                        }
                    } else {
                        $scope.agentModel = result;
                    }
                });
                $timeout(function () {
                    if ($scope.agentModel) {
                        if ($scope.agentModel.isChecked == 0) {
                            $scope.filter.is_agentChecked = 1;
                        } else if ($scope.agentModel.isChecked == -1) {
                            $scope.filter.is_agentChecked = 0;
                        } else if ($scope.agentModel.isChecked == 1) {
                            $scope.agentModel.isChecked = 1;
                        } else {
                            $scope.filter.is_agentChecked = 0;
                        }
                    }
                }, 350);

                if (!$scope.agentModel.authorization_xingyeshujin_photo_address) {
                    $scope.agentModel.authorization_xingyeshujin_photo_address = 'assets/img/hpx-sq1.jpg';
                }
                if (!$scope.agentModel.authorization_xingyebank_photo_address) {
                    $scope.agentModel.authorization_xingyebank_photo_address = 'assets/img/hpx-sq2.jpg';
                }
            }
        });
    }
    $scope.reloadModel();

    $scope.ycimg = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "rotes";
        } else {
            trans.className = "rote";
        }
    }
    $scope.agentImg = function () {
        var accordion = document.getElementById("fileaccordions");
        var trans = document.getElementById("tranes")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "rotes";
        } else {
            trans.className = "rote";
        }
    }
    $scope.Agmenty = function () {
        //$('#modal-Amenty').modal('show');
        $('#modal-Amenty').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
        //$('#modal-content').modal('show');
    }
    //上传文件
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('您文件大于10M，无法上传！');
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
            $scope.findEnterprise.credential_photo = response.data.data.file_path;
            $scope.findEnterprise.credential_photo_id = response.data.data.id;
        })
    };
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.artificial_person_front_photo_id = response.data.data.id;
            $scope.model.artificial_person_front_photo_address = response.data.data.file_path;
            $scope.findEnterprise.artificial_person_front_photo_id = response.data.data.id;
            $scope.findEnterprise.artificial_person_front_photo = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.artificial_person_back_photo_id = response.data.data.id;
            $scope.model.artificial_person_back_photo_address = response.data.data.file_path;
            $scope.findEnterprise.artificial_person_back_photo_id = response.data.data.id;
            $scope.findEnterprise.artificial_person_back_photo = response.data.data.file_path;
        })
    };
    $scope.setxingyeshujinID = function (response) {
        $timeout(function () {
            $scope.agentModel.authorization_xingyeshujin_photo_id = response.data.data.id;
            $scope.agentModel.authorization_xingyeshujin_photo_address = response.data.data.file_path;

        })
    };
    $scope.setxingyebankID = function (response) {
        $timeout(function () {
            $scope.agentModel.authorization_xingyebank_photo_id = response.data.data.id;
            $scope.agentModel.authorization_xingyebank_photo_address = response.data.data.file_path;
        })
    };

    // 根据用户查询企业
    hpxCou = function () {
        if ($rootScope.identity.is_verified >= 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.findEnterprise = data;
                $rootScope.findEnterprise = data;
                if ($rootScope.identity.is_verified > 0 || $scope.findEnterprise.enterprise_id > 0 || $scope.findEnterprise.is_alive == -1 || $scope.model.id>0) {
                    if ($scope.findEnterprise) {
                        var hpxid = $scope.findEnterprise.enterprise_id;
                    } else {
                        var hpxid = $scope.model.id;
                    }
                    payingService.getAgentTreasurer(hpxid).then(function (result) {
                        if (result == null||result == undefined) {
                            $scope.agentModel = {};
                        } else {
                            $scope.agentModel = result;
                        }
                    });
                }
            })
        }
    }
    hpxCou();


    // 审核通过重新更改
    $scope.edit = function (needReload) {
        swal("机构认证审核通过，如需修改，请联系客服人员！！！")
    };
    // 保存企业信息
    $scope.save = function () {
        if (!$scope.model.credential_photo_id) {
            swal("请上传营业执照！");
            return;
        }
        if (!$scope.model.artificial_person_front_photo_id || !$scope.model.artificial_person_back_photo_id) {
            swal("请上传法人代表身份证！");
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
                    swal({ 'title': '保存成功，请继续完成经办人绑定！' }, function () {
                        window.location.reload();
                    });
                });
            });
        } else {
            customerService.postEnterprise($scope.model.id,$scope.model).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    swal("保存成功，请等待管理员审核！");
                    $scope.reloadModel();
                });
            });
        }
    };
    // 审核失败修改企业信息
    $scope.eaitCouster = function () {
        if ($scope.findEnterprise) {
            var hpxid = $scope.findEnterprise.enterprise_id;
        } else {
            var hpxid = $scope.model.id;
        }
        if (_.isEqual($scope.findEnterprise, newEntity)) {
            swal('请确认更改之后再次提交！');
            return;
        }
        if ($scope.findEnterprise.is_alive == -1 || $scope.findEnterprise.is_alive == 0) {
            customerService.postEnterprise($scope.findEnterprise.enterprise_id, $scope.findEnterprise).then(function (data) {
                // 注销重新登陆
                swal({ 'title': '保存成功，请等待审核！' }, function () {
                    window.location.reload();
                });
            });
        } else {
            customerService.getAllEnterprise().then(function (data) {
                customerService.postEnterprise(hpxid, $scope.findEnterprise).then(function (data) {
                    swal("保存成功，请等待管理员审核！"), function () {
                        window.location.reload();
                    };
                });
            });
        }
    }
    $scope.read = function (data) {
        $scope.findEnterprise = angular.copy(data);
        //$('#modal-read').modal('show');
        $('#modal-read').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };

    $scope.verifyStr = "获取验证码";
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if ($scope.disableVerify)
            return;
        if (!$scope.model.operator_phone_number || $scope.model.operator_phone_number.length != 11) {
            swal('请输入正确的手机号码！');
            return;
        }

        customerService.phoneVerify($scope.model.operator_phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second <= 0) {
                    $scope.verifyStr = "重新获取验证码";
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
        //$('#modal-add').modal('show');  // 显示增加操作员的弹出窗口
        $('#modal-add').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.deleteEnterpriseMember(data).then(function (data) {
                $scope.tableParams.reload();
                $('#modal-add').modal('hide');
            });
        });
    };

    $scope.enclosure = [];
    $scope.model.bill_protocol_files = [];
    //增加文件
    $scope.add = function (response) {
        $timeout(function () {
            $scope.enclosure.push({
                'file_id': response.data.data.id,
                'file_path': response.data.data.file_path,
                'file_name': response.data.data.file_name
            });
            $scope.model.bill_protocol_files = $scope.enclosure;
        })

    }
    //删除文件
    $scope.remove = function (index) {
        swal({
            title: "确定要删除该文件吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.enclosure.splice(index, 1);
        });
    };
    //打开协议模板
    $scope.editAgent = function () {
        swal('经办人审核通过，如需修改，请联系客服人员！！！')
    }

    $scope.choiceenterprise = function (number) {
        $scope.filter.choiceenterprise = number;
        $scope.reloadModel();
    };

    $scope.saveAgent = function () {
        if ($scope.findEnterprise) {
            var hpxid = $scope.findEnterprise.enterprise_id;
        } else {
            var hpxid = $scope.model.id;
        }
        if (!$scope.agentModel.agent_treasurer_name) {
            swal("请填写经办人姓名！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal("请填写经办人手机号！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal("请填写经办人身份证号码！");
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal("身份证信息有误。请核实信息！！！")
            return;
        }
        if (!$scope.agentModel.authorization_xingyeshujin_photo_id || !$scope.agentModel.authorization_xingyebank_photo_id) {
            swal("请上传授权书！");
            return;
        }
        if (!$scope.agentModel.isChecked) {
            payingService.postAgentTreasurer(hpxid, $scope.agentModel).then(function (data) {
                swal({ 'title': '经办人保存成功，等待管理员审核。\n 请进行账户绑定！' }, function () {
                    $state.go("app.main.enterpriseAccountInfo")
                })
            });
        }
        else {
            payingService.updateAgentTreasurer(hpxid, $scope.agentModel).then(function (data) {
                if ($scope.filter.ProTemplate == 1) {
                    $('#modal-ProTemplate').modal('hide');
                }
                swal("保存成功，请等待管理员审核！");
                $state.go("app.main.enterpriseAccountInfo")
            });
        }
    }
});
hpxAdminApp.controller('enterpriseUserController', function ($scope, API_URL, NgTableParams, enterpriseService) {

    $scope.filter = {};

    //获取所有企业用户
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
        getData: function (params) {
            return enterpriseService.getAllEnterpriseUser(params, $scope.filter).then(function (data) {
                console.log(data)
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    // 显示详情
    $scope.show = function (model) {
        enterpriseService.getOneEnterpriseUserInfo(model).then(function (result) {
            console.log(result);
            $scope.model = result;
            $('#modal-show').modal('show');
            //window.location.href = "index.html#/app/setting/customerQuery"
        })
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

    //发布方评价
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
        $scope.model.star = $scope.filter.star;

        enterprisesService.insertAppraisal($scope.model).then(function (data) {
            $state.go('app.main.myBill');
        });
    };
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

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                    });
                }
            });
        }else if ($scope.model.type_id==102) {
            billService.getBillProduct($scope.model.to_id).then(function (data) {
                $scope.billModel = data;
                $scope.model.bill_status_code = data.bill_status_code;

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                    });
                }
            });
        };

    };
    init();

});
hpxAdminApp.controller('evaluatesController', function ($rootScope, $scope, $state, $timeout, $stateParams, $interval, FILE_URL, Upload, ngTableParams, orderService, billService, customerService, payingService, enterprisesService) {
    $scope.filter = {
        star: 0,
    };
    $scope.evalutaModel = {
        description: null,
    };
    $scope.addevaluateModel = {
        additional_description: null,
    };
    $scope.model = {
        type_id: $stateParams.type_id,
        to_id: $stateParams.to_id,
        gettype: $stateParams.gettype,
        star: 0,
        bill_status_code: 810,
        order_status_id: 810,
        description: null,
        additional_description: null,
    };

    //发布方评价
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
        $scope.model.star = $scope.filter.star;

        enterprisesService.insertAppraisal($scope.model).then(function (data) {
            $state.go('app.main.myBill');
        });
    };
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

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                    });
                }
            });
        } else if ($scope.model.type_id == 102) {
            billService.getBillProduct($scope.model.to_id).then(function (data) {
                $scope.billModel = data;
                $scope.model.bill_status_code = data.bill_status_code;

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
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
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.filter = {
        isCheck: 1,
        filter_v:2
    }
    //if (/^1\d{10}$/.test($scope.model.phone_number)) {
    //    alert("正则通过");
    //    $scope.filter.filter_v = 2;
    //}
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            swal('请输入正确的手机号码！');
            return;
        }
        customerService.phoneVerify($scope.model.phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;
            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;
                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };
    $scope.hupdate = function () {
        $scope.filter.isCheck = 2;
        customerService.customerPasswordResets($scope.model.phone_number, $scope.model).then(function () {
            swal('验证码输入成功！');
        })
    };
    $scope.update = function () {
        $scope.filter.isCheck = 3;
        if ($scope.model.new_password == null || $scope.model.new_password2 == null) {
            swal('密码不能为空！');
            return;
        }
        else if ($scope.model.new_password != $scope.model.new_password2) {
            swal('两次密码输入不一致！');
            return;
        }
        //重置密码
        customerService.customerPasswordReset($scope.model.phone_number, $scope.model).then(function (data) {
            swal('新密码设置成功！');
        });
    };
    //跳转到网站首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});


hpxAdminApp.controller('freeController', function ($rootScope, $scope, $state, customerService) {
});

hpxAdminApp.controller('freezeEnterpriseController', function ($scope, $rootScope, $state, API_URL, NgTableParams, enterpriseService,exportService) {

    //默认未冻结 isAlive = 1
    $scope.filter = {
        isAlive : 1
    };

    $scope.option = {
        id : 0
    };


    //获取企业信息列表
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return enterpriseService.getAllAliveEnterprise(params,$scope.filter.keyword,$scope.filter.isAlive).then(function (data) {
                console.log($scope.filter.keyword);
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    //查看企业详细信息
    $scope.read = function (item) {
        $scope.model = angular.copy(item);
        $('#modal-read').modal('show');
    };

    //弹出冻结企业框
    $scope.freeze = function (item) {
        $scope.model = angular.copy(item);
        $scope.option.id = 0;
        $scope.model.description = '违规操作';
        $('#modal-freeze').modal('show');
    };

    //冻结企业
    $scope.confirmFreeze = function () {
        enterpriseService.freezeEnterprise($scope.model).then(function (data) {
            $scope.tableParams.reload();
            $('#modal-freeze').modal('hide');
        });
    };
    $scope.changeOption =function () {
        if($scope.option.id == 0){
            model.desciption = '违规操作';
        }
    }
    //解冻企业
    $scope.unfreeze = function (item) {
        if (confirm('确认解冻企业 ' +item.enterprise_name +' 吗？')) {
            enterpriseService.unfreezeEnterprise(item).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

    //导出表格
    $scope.exportExcel = function () {
        var resource_url = API_URL+"/customers/enterprise?n=65535&orderBy=%2Bid&p=1";
        var sheet_name = "冻结企业管理表";
        var label_names,label_types,label_keys;
        if($scope.filter.isAlive == 1){
            resource_url += "&isAlive=1";
            sheet_name += "_未冻结";
            label_names=["企业名称","统一社会信用码/营业执照注册号","联系人","联系号码"];
            label_types=["String","String","String","String"];
            label_keys=["enterprise_name","credential_number","contact_person","contact_phone"];
        }else if($scope.filter.isAlive == -2){
            resource_url += "&isAlive=-2";
            sheet_name += "_已冻结";
            label_names=["企业名称","统一社会信用码/营业执照注册号","冻结时间","冻结原因"];
            label_types=["String","String","Time","String"];
            label_keys=["enterprise_name","credential_number","freeze_time","freeze_description"];
        }

        var excelRequest =   {
            "resource_url":resource_url,
            "resource_name":"enterprises",
            "sheet_name":sheet_name,
            "label_names":label_names,
            "label_types":label_types,
            "label_keys":label_keys
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export',token,excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }
});
hpxAdminApp.controller('handWritingController', function ($location, $rootScope, $scope, $state, $stateParams, $http, billService, FILE_URL) {
    //1.修改鼠标移出canvas页面,移回到canvas无反应  2016.10.28
    //2.移除无用函数  2016.10.28
    //3.通过input暴露图片地址 2016.10.28
    var bill_id = $location.search().billid;
    var type = $location.search().type;

    var curRotate = 0;

    var canvasWidth = 800;			//定义canvas宽高
    var canvasHeight = 800;

    var isMouseDown = false;			//检测按下鼠标动作
    var lastLoc = {x: 0, y: 0};		//上一次的坐标

    var canvas = document.getElementById("canvas");		//获取canvas对象
    var context = canvas.getContext("2d");			//取得图形上下文
    var mosicIndex = 0;                 //当前灰度索引
    var mosicLevel = 30;                //灰度的层级
    var oldStartX = oldStartY = -1;
    canvas.width = canvasWidth;			//定义canvas宽高
    canvas.height = canvasHeight;

    $scope.size = 15;


    var pencil = $scope.pencil = {
        thickness: 30,
        color: 'rgba(0,0,0,0)'
    };


    function initProgress() {
        $scope.progressInfo = "保存中...";

        $scope.progressStyle = {
            "width": "2%"
        };
    }

    var image = new Image();
    image.crossOrigin = '*';

    initImage();
    function initImage() {
        if ($stateParams.data == null) return;
        var model = $stateParams.data.model;
        var type = $stateParams.data.type;
        console.log($stateParams);

        $scope.imgUrl = type == 0 ? model.bill_front_photo_path : model.bill_back_photo_path;
        //image = document.getElementById("originImg");
        image.src = $scope.imgUrl + "?" + new Date().getTime();
        //image.crossOrigin = "Anonymous";

        image.onload = function () {
            context.drawImage(image, 0, 0, canvasWidth, canvasHeight);		//绘制图像
        }
    }

    //当鼠标在外部并且松开的时候
    $("body").mouseup(function () {
        isMouseDown = false;
    });

    //鼠标左键按下事件
    canvas.onmousedown = function (e) {
        e.preventDefault();
        isMouseDown = true;

        lastLoc = windowToCanvas(e.clientX, e.clientY);
    };
    //鼠标左键松开事件
    canvas.onmouseup = function (e) {
        e.preventDefault();
        isMouseDown = false;
    };
    //鼠标移动事件
    canvas.onmousemove = function (e) {
        e.preventDefault();
        if (isMouseDown) {
            var size = $scope.size;
            var curLoc = windowToCanvas(e.clientX, e.clientY);
            //var pixelData = context.getImageData(curLoc.x, curLoc.y, Math.abs(lastLoc.x-curLoc.x),Math.abs(lastLoc.y-curLoc.y));    // 获得区域数据
            var r = g = b = 0;
            var s = "";
            var startX = startY = 0;

            startX = parseInt(curLoc.x / size) * size;
            startY = parseInt(curLoc.y / size) * size;
            if (oldStartX != startX || oldStartY != startY)
            {
                r = g = b = mosicIndex * mosicLevel + 80;
                mosicIndex = (mosicIndex + 1) % 6;
                s = 'rgb(' + r + ',' + g + ',' + b + ')';
                context.fillStyle = s;
                context.fillRect(startX, startY, size, size);
                oldStartX = startX;
                oldStartY = startY;
            }

            //for (i = 0; i < pixelData.height; i+=size) {
            //    for (j = 0; j < pixelData.width; j+=size) {
            //        var x = i * 4 * pixelData.width + j * 4;
            //        r = pixelData.data[x];
            //        g = pixelData.data[x + 1];
            //        b = pixelData.data[x + 2];
            //        context.fillStyle = s;
            //        context.fillRect(startX+j, startY+i, size, size);
            //    }
            //}
            //r = parseInt(r / (size * size));
            //g = parseInt(g / (size * size));
            //b = parseInt(b / (size * size));
            //context.beginPath();
            //context.moveto(curLoc.x, curLoc.y);
            //context.lineTo(curLoc.x, curLoc.y);			//从起始位置创建到当前位置的一条线
            //context.strokeStyle = pencil.color;			//设置笔触的颜色
            //context.stroke();
            ////context.fillStyle = pencil.color;
            // 此处增加获取平均颜色
            //context.fillStyle = s;
            //context.fillRect(curLoc.x, curLoc.y, size, size);

            // 马赛克效果


            //var curLoc = windowToCanvas(e.clientX, e.clientY);

            //绘制涂抹 老的代码
            //context.beginPath();
            //context.moveTo(lastLoc.x, lastLoc.y);		//移动到起始位置
            //context.lineTo(curLoc.x, curLoc.y);			//从起始位置创建到当前位置的一条线

            //context.strokeStyle = pencil.color;			//设置笔触的颜色
            //context.lineWidth = pencil.thickness;			//只设置这一项，出现类似毛边的情况
            //context.lineCap = "round";		//绘制圆形结束线帽
            //context.lineJoin = "round";		//当两条线交汇的时候创建边角的类型
            //context.stroke();
            //context.fillRect(curLoc.x,curLoc.y,5,5);

            lastLoc = curLoc;
        }
    };
    function windowToCanvas(x, y) {				//计算canvas上面的坐标
        var point = canvas.getBoundingClientRect();			//元素边框距离页面的距离

        x = Math.round(x - point.left);
        y = Math.round(y - point.top);
        return {x: x, y: y};
    }

    $scope.saveImage = function(){
        $scope.save(0);
    };
    $scope.replaceImage = function(){
        $scope.save(1);
    };
    $scope.save = function (type) {
        initProgress();

        $("#progressModal").modal('show');

        // 获取Base64编码后的图像数据，格式是字符串
        // 后面的部分可以通过Base64解码器解码之后直接写入文件。
        var data_url = canvas.toDataURL("image/png");
        var blob = dataURLtoBlob(data_url);
        var fileName;
        if(type == 0){
            fileName = getEndorsementFileName($scope.imgUrl);
        }else{
            fileName = $scope.imgUrl;
        }
        var fd = new FormData();
        fd.append("file", blob, fileName);
        var xhr;
        if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE 6 and older
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.addEventListener('load', onLoadHandler, false);
        xhr.upload.addEventListener('progress', $scope.onProgressHandler, false);
        xhr.open('POST', FILE_URL + '/fileWithName', true);
        xhr.send(fd);

    };

    var onLoadHandler = function (event) {
        if (this.status == 200 || this.status == 304) {
            //var result = JSON.parse(this.responseText);
            //alert("保存成功");
        }
    };

    $scope.onProgressHandler = function (event) {
        if (event.lengthComputable) {
            var percentComplete = parseInt(event.loaded / event.total * 100) + "%";
            $scope.progressStyle.width = percentComplete;
            if (event.loaded == event.total) {
                console.log("保存成功");
                $scope.progressInfo = "保存成功";
                //保存成功后续处理
                afterSave();
            }
            $scope.$apply();
        }
    };

    function afterSave() {
        $("#progressModal").modal('hide');
        var data = {
            bill: $stateParams.data.model
        };
        $state.go('app.constants.checkBill', {data: data});
    }

    $scope.resetCanvas = function () {
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    }

    //获取背书对应的文件名称
    function getEndorsementFileName(imgUrl) {
        var url = imgUrl.split("/");
        var preNames = url[url.length - 1].split(".");
        return preNames[0] + "-1." + preNames[1];
    }

    //顺时针旋转
    $scope.clockwise = function() {
        console.log(curRotate);
        curRotate = curRotate + 1;
        refreshImg();
    };

    //逆时针旋转
    $scope.eastern = function() {
        console.log(curRotate);
        curRotate = curRotate - 1;
        refreshImg();
    };

    function refreshImg() {
        context.save();
        var rotation = curRotate * Math.PI / 2;
        context.clearRect(0,0,canvasWidth,canvasHeight)
        context.translate(canvasWidth/2,canvasHeight/2);
        context.rotate(rotation);
        context.translate(-canvasWidth/2,-canvasHeight/2);
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        context.restore();//恢复状态
    }
});
hpxAdminApp.controller('headerController', function ($rootScope, $scope, $state, Restangular, customerService, $cookieStore) {
    //退出登录功能，退出后跳转到网站首页
    $scope.logout = function () {
        swal({
            title: "确认要退出登录吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
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
            window.location.href = '/www/index.html#/app/loginInfo';
        }
    }
    $scope.editQuoteaccount = function () {
        if ($rootScope.identity) {
            window.location.href = '/www/index.html#/app/main/editQuote';
        } else {
            window.location.href = '/www/index.html#/app/loginInfo';
        }
    }

});

// JavaScript source code
hpxAdminApp.controller('holidayInfoController', function ($scope, $rootScope, $state, NgTableParams, roleService,holidayService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};


    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click",function(ev){
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function(e) {
        $scope.model.start_time = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function(e) {
        $scope.model.end_time = $("#end_time").val();
    });


    //获取假日信息
    $scope.tableParams = new NgTableParams({ sorting: { 'start_time': 'desc' } }, {
        getData: function (params) {
            return holidayService.query(params,$scope.filter.year).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.refresh = function () {
        $scope.tableParams.reload();
    }

    $scope.edit = function (data) {
        if (data == null) {         //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        //$scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.id) {         //新建一条假日数据
            holidayService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改一条假日数据信息
            holidayService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    //删除某条假日数据信息
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.description + '吗')) {
            holidayService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
})
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
    $scope.showCalculator = function () {
        //$('#modal-calculator').modal('show');
        $('#modal-calculator').modal({
            backdrop: "static",//����հ״����رնԻ���  ���ֱ����false �򱳾�û�л�ɫ͸��
            keyboard: false,//���̹رնԻ���
            show: true//�����Ի���
        });
    }

    $scope.submitCalculator = function () {
        toolService.calculator($scope.calculatorModel).then(function (data) {
            $scope.calculatorResult = data;
        })
    }

    $scope.showEnterprise = function () {
        //$('#modal-enterprise').modal('show');
        $('#modal-enterprise').modal({
            backdrop: "static",//����հ״����رնԻ���  ���ֱ����false �򱳾�û�л�ɫ͸��
            keyboard: false,//���̹رնԻ���
            show: true//�����Ի���
        });
    }

    $scope.submitEnterprise = function () {
        customerService.enterpriseDetail($scope.enterpriseModel.keyword).then(function (data) {
            $scope.enterpriseResult = data[0];
        })
    }

    $scope.showBank = function () {
        //$('#modal-bank').modal('show');
        $('#modal-bank').modal({
            backdrop: "static",//����հ״����رնԻ���  ���ֱ����false �򱳾�û�л�ɫ͸��
            keyboard: false,//���̹رնԻ���
            show: true//�����Ի���
        });
    }

    $scope.showCalendar = function () {
        //$('#modal-calendar').modal('show');
        $('#modal-calendar').modal({
            backdrop: "static",//����հ״����رնԻ���  ���ֱ����false �򱳾�û�л�ɫ͸��
            keyboard: false,//���̹رնԻ���
            show: true//�����Ի���
        });
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
        //$('#modal-calendar').modal('show');
        $('#modal-calendar').modal({
            backdrop: "static",//����հ״����رնԻ���  ���ֱ����false �򱳾�û�л�ɫ͸��
            keyboard: false,//���̹رնԻ���
            show: true//�����Ի���
        });
    }
});

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
hpxAdminApp.controller('hpxTestController', function ($rootScope, $scope, $timeout, $stateParams, $state, FILE_URL, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {

    $scope.model = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
    };

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

// JavaScript source code
hpxAdminApp.controller('loginController', function ($scope, $rootScope, $state, Restangular, userService, $cookieStore,localStorageService) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
    $rootScope.setting.layout.pageBgWhite = true;
    //登录
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 0 && keycode != 1 && keycode != 13 && keycode != undefined) {
            return;
        }
        var user = userService.login($scope.loginRequest).then(function (data) {
            var identity = {
                role_name:data.role_name,
                token:data.token,
                username:data.username
            };
            localStorageService.set("systemMenus", data.menus);
            $cookieStore.put('identity', identity);
            $rootScope.identity = identity;
            $rootScope.systemMenus = data.menus;

            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.constants.checkBill');       //跳转到票据审核界面
        });
    };
});

hpxAdminApp.controller('loginInfoController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService, $cookieStore, Restangular,$http) {
    $scope.model = {};
    $scope.loginInfo = function () {
        customerService.customerLoginEnterprise($scope.model).then(function (result) {
            data = result.enterprises;
            if (data.length == 1 && data[0].enterprise_id != -1) {
                $scope.model.enterprise_id = data[0].enterprise_id;
                customerService.customerLogin($scope.model).then(function (data) {
                    $cookieStore.put('customer', data);
                    $rootScope.identity = data;
                    Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + $rootScope.identity.token });
                    $state.go("app.main.accountInfo");
                })
            } else if (data.length == 1 && data[0].enterprise_id == -1) {
                $scope.model.enterprise_id = data[0].enterprise_id;
                customerService.customerLogin($scope.model).then(function (data) {
                    $state.go("app.main.accountInfo");
                })
            } else if (data.length >= 2) {
                //$('#modal-addBidding').modal('show');
                $('#modal-addBidding').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
            }
        })
    }
});

hpxAdminApp.controller('loginsController', function () {

});

hpxAdminApp.controller('mainController', function ($rootScope, $scope, $state, $timeout, customerService, $cookieStore, payingService) {
    customerService.testLogin().then(function (data) {
        //console.log("testLogin");
        //console.log(data);
        if(data){
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
            $rootScope.identity.corp_id = data.corp_id;
        }

        $cookieStore.put('customer', $rootScope.identity);
    })
    if ($rootScope.identity.enterprise_id > 0) {
        payingService.getAgentTreasurer($rootScope.identity.enterprise_id).then(function (data) {
            $rootScope.agentModel = data;
        });
    }
});

hpxAdminApp.controller('menuController', function ($rootScope, $scope, $state, customerService, payingService) {
    customerService.getCustomer().then(function (data) {
        $scope.customerModel = data;
        if (data.id != 0) {
            customerService.SingleEnterprise(data.id).then(function (enterpriseData) {
                $scope.menuEnterprise = enterpriseData;
                if (enterpriseData.enterprise_id != 0 || enterpriseData.enterprise_id != "") {
                    payingService.getAgentTreasurer(enterpriseData.enterprise_id).then(function (agentModel) {
                        $scope.menuAgent = agentModel;
                    })
                }
            })
        }
    });
    $scope.checkCustomer = function () {      //点击企业审核
        if ($scope.customerModel.is_verified == 0) {
            swal({
                title: "您的联系人信息未完善",
                confirmButtonText:"OK"
            }, function () {
                $state.go("app.main.customerInfo");
            })
        } else {
            $state.go("app.main.enterpriseInfo");
        }
    }
    $scope.checkEnterprise = function () {    //点击账户绑定
        if ($scope.customerModel.is_verified == 0) {
            swal({
                title: "您的联系人信息未完善",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.customerInfo");
            })
        } else if ($scope.menuEnterprise.enterprise_id == 0 || $scope.menuEnterprise.enterprise_id == "") {
            swal({
                title: "您还未进行企业审核",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else if ($scope.menuEnterprise.is_verified == -1) {
            swal({
                title: "您的企业审核未通过",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else if ($scope.agentModel.isChecked == null || $scope.agentModel.isChecked == "") {
            swal({
                title: "您还未进行业务授权",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else if ($scope.agentModel.isChecked == -1) {
            swal({
                title: "您的业务授权失败",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else {
            $state.go("app.main.enterpriseAccountInfo");
        }
    }
    // 点击--电子账户
    $scope.eleAccount = function () {
        if ($scope.menuEnterprise <= 3) {
            swal({
                title: "您的实名注册未完成",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.accountStatus");
            })
        } else {
            $state.go("app.main.electronicAccount");
        }
    }
});

hpxAdminApp.controller('messageCenterController', function ($rootScope, $scope, $state, $interval, ngTableParams, $timeout, Upload, notisService, billService, messageService) {
    $scope.filter = {
        choiceRead: 0,
        choiceMessageType: 1,
        MessageType: 1,
        isRead:0
    }
    //获取全部信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {

            return notisService.getNotification(params, $scope.filter.MessageType, $scope.filter.choiceRead, $scope.filter.time1, $scope.filter.time2).then(function (data) {
                $scope.first = $scope.getFirst(params);
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
    $scope.choiceReceiverOrderMessage = function () {
        $scope.filter.choiceMessageType = 5;

        $scope.tableParams.reload();
    }
    //票据消息
    $scope.choiceBillMessage = function () {
        $scope.filter.choiceMessageType = 3;
        $scope.filter.MessageType = [3,6];

        $scope.tableParams.reload();
    }
    //我的竞价票据消息

    $scope.choiceBidMessage = function () {
        $scope.filter.choiceMessageType = 6;

        $scope.tableParams.reload();
    }
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
        //$('#modal-read').modal('show');
        $('#modal-read').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //删除某条消息
    $scope.remove = function (item) {
        swal({
            title: "确定要删除该消息?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            notisService.deleteNotification(item.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    }
    $scope.skip = function (data) {
        $('#modal-read').modal('hide');
        $timeout(function () {
            if ($scope.model.notification_type == 2) {
                $state.go('app.main.orderDrawerInfo', { 'id': $scope.model.notification_id });
            } else if ($scope.model.notification_type == 5) {
                $state.go('app.main.orderReceiverInfo', { 'id': $scope.model.notification_id });
            } else if ($scope.model.notification_type == 3) {
                $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 1 });
            } else if ($scope.model.notification_type == 4 && $scope.model.notification_id > 0) {
                billService.getBillProduct($scope.model.notification_id).then(function (data) {
                    if (data.order_id && data.order_id != 0) {
                        swal("该票据已经生成订单，您无权查看！");
                    } else {
                        $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 2 });
                    }
                });
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
        filter_v: 1
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
            swal('新密码长度不符合规定！');
            return;
        }

        if ($scope.model.new_password != $scope.model.re_new_password) {
            swal('两次新密码输入不一致！');
            return;
        }

        //修改密码
        customerService.customerModifyPassword($scope.model).then(function () {

            swal({
            title: "修改密码成功,请回到首页重新登录?",
            type: "warning",
            //showCancelButton: true,
            confirmButtonText: "OK",
            //cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.customerLogout().then(function () {
                customerService.logout();
                window.location.href = '/index.aspx';

            });
            });
        })
    }

    customerService.getCustomer().then(function (data) {
        $scope.customerInfo = data;
    });
    $scope.changePhoneModel = {
        oldPhoneVerifyStr: '获取验证码',
        newPhoneVerifyStr: '获取验证码'
    }
    $scope.getOldPhoneVerify = function () {
        $scope.filter.filter_v = 1;
        customerService.getVerify($scope.customerInfo.phone_number, $scope.changePhoneModel, 'oldPhoneVerifyStr', 'disableOldPhoneVerify');
    }
    $scope.getNewPhoneVerify = function () {
        customerService.getVerify($scope.changePhoneModel.new_phone_number, $scope.changePhoneModel, 'newPhoneVerifyStr', 'disableNewPhoneVerify');
    }
    // 修改手机
    $scope.changePhone = function () {
        if (!$scope.changePhoneModel.phone_verify_code) {
            swal('请输入原手机验证码!');
            return;
        }
        if (!/^1(3|4|5|7|8)\d{9}$/.test($scope.changePhoneModel.new_phone_number)) {
            swal('请输入正确的新手机号码!');
            return;
        }
        if (!$scope.changePhoneModel.new_phone_verify_code) {
            swal('请输入新手机验证码!');
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
            document.getElementById("password").style.color = "#ff5a14";
            document.getElementById("customerPhone").className = "billtypestyleprevious";
            document.getElementById("phoneNumber").style.color = "#333";
        }

    };
    //选择手机绑定
    $scope.choicePhoneNumber = function () {
        $scope.filter.choicePhoneNumber = 1;
        $scope.filter.choicePassword = 0;
        if (document.getElementById("customerPhone").className == "billtypestyleprevious") {
            document.getElementById("customerPhone").className = "billtypestylecurrent";
            document.getElementById("phoneNumber").style.color = "#ff5a14";
            document.getElementById("customerPassword").className = "billtypestyleprevious";
            document.getElementById("password").style.color = "#333";
        }

    };
});

hpxAdminApp.controller('myBiddingController', function ($rootScope, $scope, $state, $interval, ngTableParams, billService, orderService) {
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        status: null,
        iselectronic: 0,
        //isCheck: 1,
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
                                data[i].bill.status_name = "已报价";
                            }else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失效";
                            } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失败";
                            }
                        }
                    };
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
                                data[i].bill.status_name = "已报价";
                            } else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失效";
                            } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失败";
                            }
                        }
                    };
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
        $scope.filter.choiceBillType = 101;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.choiceBillType = 102;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.iselectronic = 0;
        $scope.filter.choiceStatus = 880;
        $scope.filter.status = null;
        $scope.tableParams.reload();
    }
    //竞价
    $scope.choiceTradeStatusBidding = function () {
        $scope.filter.iselectronic = 0;
        $scope.filter.choiceStatus = 881;
        $scope.filter.status = 801;
        $scope.tableParams.reload();
    }
    //交易中
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.iselectronic = 1;
        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 804;
            //$scope.filter.status = 805;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = 809;
        }
        $scope.filter.choiceStatus = 882;
        $scope.tableParams.reload();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.iselectronic = 1;
        $scope.filter.status = 810;
        $scope.filter.choiceStatus = 883;
        $scope.tableParams.reload();
    }
    //交易失败
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.iselectronic = 1;
        $scope.filter.status = 816;
        $scope.filter.choiceStatus = 884;
        $scope.tableParams.reload();
    }
    $scope.delete = function (data) {
        swal({
            title: "是否确认删除？",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        },function(){
            billService.deleteBillBidding(data.id).then(function (result) {
                $scope.choiceTradeStatusBidding();
                $scope.billsNumber();
            })
        })

    }
    $scope.deleteOrder = function (data) {
        swal({
            title: "是否确认删除？",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            orderService.deleteOrder(data.id).then(function (data) {
                $scope.billsNumber();
                $scope.tableParams.reload();
                swal("当前您无权进行此操作")

            });
        });
    }


    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //自动刷新
    $scope.checkAutointerval = function () {
        var autointerval = document.getElementById("autointerval");
        if (autointerval.checked) {
            var timer = setInterval($scope.reflash(), 60 * 1000);
        }else if (!autointerval.checked) {
            clearInterval(timer);
        };
    };


    $scope.show = function (data) {
        $scope.model = angular.copy(data);
    };

    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });

        //$('#modal-bidding').modal('show');
        $('#modal-bidding').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };

    $scope.finishBidding = function (item) {
        swal({
            title: "确认选择该收票人进行交易吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
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

hpxAdminApp.controller('myBillController', function ($rootScope, $scope, $state, $interval, FILE_URL, ngTableParams, $timeout, Upload, billService, addressService, customerService, constantsService, bankService, fileService, orderService, toolService ) {
    $scope.filter = {
        choiceBillType: 101,  // 电票
        choiceStatus: 880,
        choiceorder: 0,
        isTrade:0,
        status: null,
        isAlive: null,
        billStatusCode:null,
    };

    $scope.billsNumber = function () {
        billService.getBillsNumber($scope.filter.choiceBillType).then(function (data) {
            $scope.numberModel = data;

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
                    if ((($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) && $scope.filter.choiceBillType == 101) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill_deadline_time)
                                data[j].remaining_day = null;
                        };
                    }
                    if ($scope.filter.choiceStatus == 880) {
                        for (var l = 0; l < data.length; l++) {
                            if (data[l].bill_status_code == 816 && data[l].is_freeze == 1) {
                                data[l].check_result = "审核失败";
                            }
                        };
                    }
                    if ($scope.filter.choiceStatus == 881) {
                        var filterData = [];
                        for (var k = 0; k < data.length; k++) {
                            if (data[k].bill_status_code == 800 || data[k].bill_status_code == 816)
                                filterData.push(data[k]);
                        };
                        data = filterData;
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

    //跳转到发布页面
    $scope.goPublish = function (item) {
        var loser = new RegExp("冻结");
        if (loser.test(item.check_result_description)) {
            swal("企业被冻结，该票据已被中止，无法修改！");
        } else {
            toolService.getSystemTime().then(function (newDate) {
                if (newDate < item.bill_deadline_time) {
                    $state.go('app.main.publish', { 'id': item.id });
                } else {
                    $state.go('app.main.publish', { 'id': item.id });
                }
            });
        }
    };

    //跳转到票据详情页面
    $scope.goReadbill = function (item) {
        var loser = new RegExp("冻结");
        if (loser.test(item.check_result_description) || ($scope.filter.choiceStatus==880 && item.bill_status_code == 816 && item.is_freeze == 1)) {
            swal("企业被冻结，该票据已被中止，无法修改！");
        } else {
            $state.go('app.free.readBill', { 'id': item.id, 'check': 1 });
        }
    };

    //选择电票
    $scope.choiceEBillType = function () {
        $scope.filter.choiceBillType = 101;
        $scope.filter.choiceStatus = 880;
        $scope.billsNumber();
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.tableParams.reload();
    };

    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.choiceBillType = 102;
        $scope.filter.choiceStatus = 880;
        $scope.billsNumber();
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.tableParams.reload();

    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        if ($scope.filter.choiceBillType = 101) {
            $scope.filter.choiceStatus = 880;
            $scope.billsNumber();
            $scope.filter.isTrade = 0;

            $scope.filter.billStatusCode = null;
            $scope.filter.status = null;
            $scope.filter.choiceorder = 0;
            $scope.tableParams.reload();
        } else if ($scope.filter.choiceBillType = 102) {
            $scope.filter.choiceStatus = 880;
            $scope.billsNumber();
            $scope.filter.isTrade = 0;

            $scope.filter.billStatusCode = null;
            $scope.filter.status = null;
            $scope.filter.choiceorder = 0;
            $scope.tableParams.reload();

        }

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
    //发布中
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
    //交易中
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

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = null;
            $scope.filter.status = 810;
            $scope.filter.choiceorder = 1;
            $scope.tableParams.reload();
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
    //获取对应的票据的出价信息，弹出窗口
    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });
        //$('#modal-bidding').modal('show');
        $('#modal-bidding').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //选择交易方，隐藏弹窗
    $scope.finishBidding = function (item) {
        swal({
            title: "确认选择该收票人进行交易吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
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
                confirmButtonText: "是",
                cancelButtonText: "否",
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
                title: "是否确认删除？",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "是",
                cancelButtonText: "否",
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
            title: "是否确认删除？",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
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
    //获取票据属性类型
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
    //默认汇票到期日
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
    //设置传递给后台的图片数据为上传的图片信息
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

        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
            swal("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                swal("请上传汇票正面");
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
                swal("请输入联系方式");
                return;
            }
        }

        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {     //获取所有勾选的电票的瑕疵
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {     //获取所有勾选的纸票的瑕疵
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        //修改对应的我的发布，刷新列表，隐藏弹窗
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
        }else if (!autointerval.checked) {
            clearInterval(timer);
        };
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

        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
            swal("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                swal("请上传汇票正面");
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
                swal("请输入联系方式");
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

hpxAdminApp.controller('orderController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        status: 808,
    };

    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })

    //获取已签收808的需要打款的订单
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return orderService.query(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        if($scope.filter.isPaid == 0){
            $scope.filter.status=808;
            $scope.filter.orderPayTypeId=null;
            $scope.filter.func=null;
        }else{
            $scope.filter.status=null;
            $scope.filter.orderPayTypeId='1202';
            $scope.filter.func='paid';
        }
        $scope.tableParams.reload();
    }

    $scope.check = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();
    };

    $scope.save = function () {
    //调用宝付代付接口
    payService.payDrawer($scope.model.id, $scope.model.pay_to_drawer_info).then(function (data) {
            $scope.tableParams.reload();
            $scope.checkForm.$setPristine();
            $('#modal-check').modal('hide');
        });
    };

});
hpxAdminApp.controller('orderCountController', function ($scope, $rootScope, $state, API_URL, NgTableParams, orderService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    init();
    function init() {
        orderService.getOrderCount().then(function (data) {
            $scope.model = data;
            var time = secondConvert($scope.model.average_trade_time);
            $scope.model.average_hour = time[0];
            $scope.model.average_minute = time[1];
            $scope.model.average_second = time[2];
        });
    }

    function secondConvert(str) {
        str = str.replace("小时", ",");
        str = str.replace("分钟", ",");
        str = str.replace("秒", "");
        return str.split(",");
    }

    function convertSecond(hour, minute, second) {
        return parseInt(hour * 3600) + parseInt(minute * 60) + parseInt(second);
    }

    $scope.save = function () {
        $scope.model.average_trade_time = convertSecond($scope.model.average_hour, $scope.model.average_minute, $scope.model.average_second);
        console.log($scope.model.average_trade_time);

        var model = {
            "total_trade_price": $scope.model.total_trade_price,
            "total_electronic_trade_price": $scope.model.total_electronic_trade_price,
            "today_trade_price": $scope.model.today_trade_price,
            "average_trade_time": $scope.model.average_trade_time
        };
        orderService.updateOrderCount(model).then(function () {
            init();
        })
    };

});
hpxAdminApp.controller('orderDrawerInfoController', function ($rootScope, $scope, $state, $timeout, $stateParams, $interval, FILE_URL,XingYe_URL, Upload, ngTableParams, orderService, customerService, payingService, billService, toolService) {
    $scope.filter = {
        buttonClicked: 0,
        rote:1
    };
    $scope.model = {
        order_pay_type_id: 1202,
    };
    $scope.tog = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "hrotes";
        } else {
            trans.className = "rote";
        }
    }

    var difference;
    //获取出票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }

    init = function () {
        toolService.getSystemTime().then(function (date) {
            var newSystemDate = new Date().getTime();
            difference = newSystemDate - date;

        });
        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;
            orderService.getOrderTime($scope.model.id).then(function (data) {
                $scope.hpxDatekx = data.duration;
                $scope.hpxDateky = data.status;
                $scope.hpxDateTime = data.time;
                var timejson = data.time;
                $scope.hpxDates = [];
                angular.forEach(timejson, function (data) {
                    $scope.hpxDates[data.id] = data.TIME;
                });
            })

            //根据票据查询双方银行卡
            //payingService.getAccountPY($scope.model.bill_id).then(function (data) {
            //    $scope.hpxGetAcc = data;
            //    $scope.hfindAccX = data.drawerAccount;
            //    $scope.hfindAccY = data.receiverAccount;
            //})

            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 805) {
                $scope.model.order_status_name = "确认交易对手";
                //等待时间
                waitTime();
            }

            if ($scope.model.bill_status_code < 807) {
                $scope.model.bill_status_name = "未背书";
            } else if ($scope.model.bill_status_code >= 807) {
                $scope.model.bill_status_name = "已背书";
            }

            if ($scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                //等待时间
                waitTime();
            }

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            },300);
        });
    }
    init();


    waitTime = function () {
        var newdate = new Date().getTime();
        if (difference >= 0) {
            if ($scope.model.order_status_id == 804) {
                var waitdate = newdate - $scope.model.order_time - difference;
            } else {
                var waitdate = newdate - $scope.model.order_update_time - difference;
            }
        } else {
            if ($scope.model.order_status_id == 804) {
                var waitdate = newdate - $scope.model.order_time + difference;
            } else {
                var waitdate = newdate - $scope.model.order_update_time + difference;
            }
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

    //支付手续费
    $scope.payCommission = function () {
        swal({
            title: "确定要支付手续费吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
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
            if ($scope.model.endorsement_file.length > 1) {
                swal("背书文件最多上传一张");
                return;
            }
        });
    }
    //删除背书图片
    $scope.remove = function (index) {
        swal({
            title: "确定要删除该文件吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.endorsements.splice(index, 1);
        });
    };
    //上传出票方背书
    $scope.endorsement = function () {
        swal({
            title: "是否确认已背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            //var model = {
            //    endorsement_id_list: [],
            //    endorsement_messages: [],
            //    //drawer_account_id: $scope.model.drawer_account_id,
            //    verify_code: $scope.model.verify_code
            //};
            //for (var i = 0; i < $scope.endorsements.length; i++) {
            //    model.endorsement_id_list.push($scope.endorsements[i].endorsement_id);
            //    model.endorsement_messages.push($scope.endorsements[i].endorsement_message);
            //}
            //orderService.updateOrderAccountDrawer($scope.model.id, $scope.model.drawer_account_id).then(function (data) {
            orderService.orderEndorsement($scope.model.id).then(function () {
                //$(".clokykm").fadeIn();
                //$(".swal").fadeIn();
                swal({
                    title: "出票方背书成功！",
                    confirmButtonText: "OK",
                }, function () {
                    window.location.reload();
                })
            });
            //});
        });
    };
    //删除已上传的出票方背书
    //$scope.renow = function () {
    //    $('#modal-endorsement').fadeOut();
    //    $(".clokykm").fadeOut();
    //    window.location.reload();
    //}
    $scope.deleteEndorsement = function () {
        swal({
            title: "是否要删除已上传的出票方背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            orderService.deleteOrderEndorsement($scope.model.id).then(function () {
                swal('背书删除成功，请重新上传！');
                init();
                $('#modal-edit').modal('hide');
            });
        });
    };
    //发布方评价
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $state.go('app.main.evaluate', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: 1 });
    };


    //追加评价
    $scope.showaddEvaluatesell = function () {
        $scope.addevaluatesell = {};
        //$('#modal-addevaluatesell').modal('show');
        $('#modal-addevaluatesell').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    //弹出更新物流信息窗口
    $scope.showLogistic = function () {
        $scope.logisticModel = {};
        //$('#modal-logistic').modal('show');
        $('#modal-logistic').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //更新物流信息
    $scope.addLogistic = function () {
        orderService.orderLogistics($scope.model.id, $scope.logisticModel).then(function () {
            swal('更新物流信息成功！');

            init();
            $('#modal-logistic').modal('hide');
        });
    };


    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        $scope.filter.phone_number = $rootScope.identity.phone_number;
        customerService.phoneVerify($scope.filter.phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
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
            $scope.filter.rote = 1;
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 1;
        }
    }
    //确认成交
    $scope.submitbillnew = function () {
        billService.finishBillNew($scope.model.id).then(function (data) {
            swal("已成功确认成交！");
            window.location.reload();
        });
    }

    //var xingyeP = '193d3bd5e393432eb9724567ed810caf';
    $scope.identifySubmit = function () {
        //http://ufm-test.cibfintech.com/bizmgr/system/login/246d06008c4f4e14afd4d204bb507e5e/
        window.open(XingYe_URL + $rootScope.identity.corp_id);
    }

});

hpxAdminApp.controller('orderReceiverInfoController', function ($rootScope, $scope, $timeout, $state, $stateParams, $interval, API_URL,XingYe_URL, ngTableParams, orderService, customerService, payingService, constantsService, enterprisesService, toolService, billService, enterpriseXingyeUserService) {
    $scope.filter = {
        buttonClicked: 0,
        toKeyWord: "倚天鉴",
        submitRule: 0,
        rote: 1
    };
    $scope.model = {
        order_pay_type_id : 1202,
    }
    $scope.tog = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "hrotes";
        } else {
            trans.className = "rote";
        }
    }
    var difference;
    //获取收票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }
     //设置每隔一段时间进行刷新
    var i = 0;

    init = function () {

        toolService.getSystemTime().then(function (date) {
            var newSystemDate = new Date().getTime();
            difference = newSystemDate - date;
        });

        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;
            $scope.model.order_total_prices = eval(subFeefun($scope.model.order_total_price) + $scope.model.order_total_price);
            orderService.getOrderTime($scope.model.id).then(function (data) {
                $scope.hpxDatekx = data.duration;
                $scope.hpxDateky = data.status;
                var timejson = data.time;
                $scope.hpxDates = [];
                angular.forEach(timejson, function (data) {
                    $scope.hpxDates[data.id] = data.TIME;
                });
            })



            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                //等待时间
                waitTime();
            }

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            },300);
        });
    }
    init();

    subFeefun = function (order_total_fee) {
        return (order_total_fee == null || order_total_fee == '') ? 0 : (order_total_fee <= 100000 ? 10 : (order_total_fee <= 500000 ? 15 : (order_total_fee <= 1000000 ? 20 : (order_total_fee <= 10000000 ? order_total_fee * 0.00002 : 200))));

    }

    waitTime = function () {
        var newdate = new Date().getTime();
        if (difference >= 0) {
            if ($scope.model.order_status_id == 804) {
                var waitdate = newdate - $scope.model.order_time - difference;
            } else {
                var waitdate = newdate - $scope.model.order_update_time - difference;
            }
        } else {
            if ($scope.model.order_status_id == 804) {
                var waitdate = newdate - $scope.model.order_time + difference;
            } else {
                var waitdate = newdate - $scope.model.order_update_time + difference;
            }
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

    //图片放大镜功能
    if ($stateParams.id) {
        if ($scope.model.bill_front_photo_path) {
            $('.jqzoom').imagezoom();
        }
    }

    //获取企业对应的收货地址信息
    customerService.getAllCustomerAddress().then(function (data) {
        $scope.addresses = data;
    })
    //支付手续费
    $scope.payCommission = function () {
        swal({
            title: "确定要支付手续费吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
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
    $scope.idDisable = false;
    //弹出付款窗口
    $scope.showPay = function () {
        $scope.idDisable = true;
        var enterpriseId = $rootScope.identity.enterprise_id
        payingService.getAccount(enterpriseId).then(function (data) {
            $scope.accounts = data.acct_list;
        });

        $scope.model.order_pay_type_id = 1203;
        $scope.model.verifyCode = null;
        //$('#modal-address').modal('show');
        $('#modal-address').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });

        $scope.filter.buttonClicked = 1;
        $scope.verifyStr = "获取验证码";
        $scope.disableVerify = false;
        // 获取双方银行卡信息
        payingService.getAccountPY($scope.model.bill_id).then(function (data) {
            $scope.hpxGetAcc = data;
            $scope.hfindAccX = data.drawerAccount;
            $scope.hfindAccY = data.receiverAccount;
            $scope.hfindAccs = data.receiverAccountName;
        });
    };
    //乙方签署合同
    $scope.finCorpora = function () {
        enterpriseXingyeUserService.getLegalName($rootScope.identity.enterprise_id).then(function (data) {
            $scope.model.a_legalname = data.legalName;
        });
        enterpriseXingyeUserService.getLegalName($scope.model.drawer_id).then(function (data) {
            $scope.model.b_legalname = data.legalName;

        });

        $scope.phxPay = {
            withdrawal_procedure: "",
            hpxZong: 0
        }
        if ($scope.model.bill_type_id == 101) {
            if ($scope.model.order_total_price <= 100000.00) {
                $scope.phxPay.withdrawal_procedure = 10.00;
            } else if ($scope.model.order_total_price > 100000.00 && $scope.model.order_total_price <= 500000.00) {
                $scope.phxPay.withdrawal_procedure = 15.00;
            } else if ($scope.model.order_total_price > 500000.00 && $scope.model.order_total_price <= 1000000.00) {
                $scope.phxPay.withdrawal_procedure = 20.00;
            } else if ($scope.model.order_total_price > 1000000.00) {
                $scope.phxPay.withdrawal_procedure = Number($scope.model.order_total_price * 0.00002).toFixed(2);
                if ($scope.phxPay.withdrawal_procedure >= 200) {
                    $scope.phxPay.withdrawal_procedure = 200.00;
                }
            }
        } else if ($scope.model.bill_type_id == 102) {
            $scope.phxPay.withdrawal_procedure = 0;
        }
        $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.model.order_total_price);
        $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);

        var todayDate = new Date();
        $scope.filter.newYear = todayDate.getFullYear();
        $scope.filter.newMonth = todayDate.getMonth() + 1;
        $scope.filter.newToday = todayDate.getDate();
    };
    $scope.load = function () {
        $("#ownBillOffer").attr("checked", false);
    };
    $scope.rulekChange = function () {
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $scope.finCorpora();
    };
    $scope.ruleChange = function () {
        $scope.finCorpora();
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $("#ownBillOffer").click();
    };

   $scope.submitRule = function () {
        if (!$scope.filter.payRule) {
            $scope.filter.payRule = true;
        }
        payingService.econtractNextSign($scope.model.receiver_id, $scope.model.id).then(function (data) {
            $scope.secondSing = data;
        });
        $scope.filter.submitRule = 1;
        $('#modal-rule').modal('hide');
    }

    //支付票款
    $scope.pay = function () {
        //if (!$scope.model.verifyCode || $scope.model.verifyCode.length != 6) {
        //    swal("请输入正确的短信验证码！");
        //}
        //else {
        payingService.getVacctNos($scope.hfindAccY.saler_buyer_v_acct_no, $scope.secondSing.contractNum, $scope.model.bill_id).then(function (data) {
            $scope.xuNiS = data;
        })
        $scope.model.receiver_account_id = $scope.hfindAccY.id;
        if ($scope.filter.submitRule == 0) {
            swal('请先阅读并同意质押协议！');
            return;
        }
        swal({
            title: "确定要支付票据款?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.isDisable = true;
            payingService.queryAccount($rootScope.identity.token).then(function (data) {
                $scope.queryAccountS = data
                    orderService.updateOrderAccountReceiver($scope.model.id, $scope.hfindAccY.id).then(function (data) {
                        orderService.updateOrderReceiver($scope.model.id, $scope.model).then(function (data) {
                            // , $rootScope.identity.phone_number, $scope.model.verifyCode
                            payingService.orderPay($scope.model.order_number, $scope.xuNiS.saller_vacct_no, $scope.xuNiS.buyer_vacct_no, $scope.filter.id).then(function (data) {
                                $scope.payData = data;
                                if ($scope.payData.order_status == 805) {
                                    //$('#modal-xingyePay').modal('show');
                                    $('#modal-xingyePay').modal({
                                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                                        keyboard: false,//键盘关闭对话框
                                        show: true//弹出对话框
                                    });
                                    $scope.xingyePayA = function () {
                                        var html = $scope.payData.biz_order.recharge_url;
                                        //http://139.224.112.243:8000/v1
                                        var url = API_URL+'/xingyeRecharge?recharge_url=' + html;
                                        window.open(url)
                                    }
                                    var timeTask = setInterval(function () {
                                        orderService.getOrder($scope.filter.id).then(function (data) {
                                            $scope.model = data;
                                            if (data.order_status_id == 806) {
                                                window.location.reload();
                                                clearInterval(timeTask);
                                            }
                                        })
                                    }, 10000);
                                } else if ($scope.payData.order_status == 806) {
                                    //$(".clokykm").fadeIn();
                                    //$(".swal").fadeIn();
                                    swal({
                                        title: "收票方付款成功！",
                                        confirmButtonText: "OK",
                                    }, function () {
                                        window.location.reload();
                                    })
                                }
                            });
                            $('#modal-address').modal('hide');
                        });
                    });
                //}
            });
        });
        //}
    };
     //前往充值
    $scope.payRecharge = function () {
        var newWin = window.open('loading page');
        newWin.location.href = XingYe_URL + $scope.model.receiver_id.toString();
    }

    $scope.refresh = function () {
        window.location.reload();
        $('#modal-pay-confirm').modal('hide');
    };
    //确认签收
    $scope.showendorsements = function () {
        //$('#modal-Hvalidate').modal('show');
        $('#modal-Hvalidate').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $timeout(function () {
            $('.jqzoom').imagezoom();
        });

        $scope.filter.buttonClicked = 1;
    }

    //发布方评价
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $state.go('app.main.evaluates', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: 3 });
    };

    //$scope.renows = function () {
    //    $('#modal-endorsement').fadeOut();
    //    $(".clokykm").fadeOut();
    //    window.location.reload();
    //}
    //$scope.renowk = function () {
    //    $('#modal-endorsement').fadeOut();
    //    $(".clokykms").fadeOut();
    //    window.location.reload();
    //}


    //$scope.hpxxy = function () {
    //    var newWin = window.open('loading page');
    //    newWin.location.href = XingYe_URL + $scope.model.receiver_id.toString();
    //}

    //签收背书
    $scope.validate = function () {
        swal({
            title: "确认签收背书?",
            text: "如果未经核实进行操作，后果自负！！！",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.idDisable = true;
            payingService.confirmXYPay($scope.model.id).then(function (data) {
                //$(".clokykms").fadeIn();
                //$(".swals").fadeIn();
                swal({
                    title: "收票方签收成功！",
                    confirmButtonText: "OK",
                }, function () {
                    window.location.reload();
                })
            });

    //$scope.verifyStr = "获取验证码";
    //$scope.disableVerify = false;
        });
    }

    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        $scope.filter.phone_number = $rootScope.identity.phone_number;
        customerService.phoneVerify($scope.filter.phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
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
            $scope.filter.rote = 1;
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 2;
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

   //获取账户所有的待确认订单
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

        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.jqzoom').imagezoom();
    };

    //$scope.showFront = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    //}
    //$scope.showBack = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    //}
    //选择支付方式，确认交易
    $scope.confirm = function () {
        if (!$scope.model.order_pay_type_id) {
            swal("请选择支付方式！")
        }
        else {
            swal({
                title: "确认该交易吗?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: true
            }, function () {
                billService.confirmOrderWait($scope.model.id, { 'is_confirm': 1, 'order_pay_type_id': $scope.model.order_pay_type_id }).then(function (data) {
                    swal('确认交易成功！');

                    $scope.tableParams.reload();
                    $('#modal-edit').modal('hide');
                    //$('#modal-appraisal').modal('show');
                    $('#modal-appraisal').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
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
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            orderService.orderAppraisal($scope.model.id, { 'appraisal_message': $scope.model.appraisal_message }).then(function (data) {
                swal('确认评价成功！');

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
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            billService.confirmOrderWait($scope.model.id, { 'is_confirm': 0 }).then(function (data) {
                swal('拒绝交易成功！');

                $scope.tableParams.reload();
                $('#modal-edit').modal('hide');
            });
        });
    };
});

hpxAdminApp.controller('pageLoaderController', function ($scope, $rootScope, $state) {
    App.initPageLoad();
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
    //设置传递给后端的图片为当前上传的图片
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
        swal("图片上传成功！");
        location.reload(false);
    };

});

hpxAdminApp.controller('payToDrawController', function ($scope, $rootScope, NgTableParams, searchService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'func': 'detail',
        'time1':'',
        'time2':''
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click",function(ev){
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.time1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.time2 = $("#end_time").val();
    });

    //获取所有打款
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return searchService.getAllPayToDrawer(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    $scope.show = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-info').modal('show');
    };
});
hpxAdminApp.controller('platformBillController', function ($scope, API_URL, NgTableParams, enterpriseService, searchService) {

    $scope.filter = {
        isMadeBill: 0
    };

    //获取所有企业用户
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
        getData: function (params) {
            return enterpriseService.getAllEnterpriseUser(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    //显示详情
    $scope.show = function (model) {
        //获取所有企业用户
        $scope.tableParams2 = new NgTableParams({
            sorting: {'id': 'asc'}
        }, {
            getData: function (params) {
                return searchService.getPlatformAccountBalance(model, $scope.filter, params).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.balances = data;
                    return data;
                });
            }
        });

        $('#modal-show').modal('show');

    };

    // 刷新
    $scope.reflash2 = function () {
        $scope.tableParams2.reload();
    };

    // 开发票
    $scope.invoicing = function () {
        var result = [];
        angular.forEach($scope.balances , function(item) {
            if($scope.checkboxes.items[item.id] == true){
                result.push(item.id);
            }
        });

        searchService.updatePlatformAccountBalance(result).then(function (data) {
            $scope.reflash2();
            alert("成功开票")
        })
    };


    $scope.checkboxes = {
        checked: false,
        items: {}
    };

    // watch for check all checkbox
    $scope.$watch(function() {
        return $scope.checkboxes.checked;
    }, function(value) {
        angular.forEach($scope.balances , function(item) {
            $scope.checkboxes.items[item.id] = value;
        });
    });

    // watch for data checkboxes
    $scope.$watch(function() {
        return $scope.checkboxes.items;
    }, function(values) {
        var checked = 0, unchecked = 0,
            total = $scope.balances .length;
        angular.forEach($scope.balances , function(item) {
            checked   +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular
            .element($element[0].getElementsByClassName("select-all"))
            .prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);
});
hpxAdminApp.controller('portalInfoController', function ($scope, $rootScope, $state, NgTableParams, portalInformationService) {
    var information_type_id = 1

    //获取主页内容信息
    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            return portalInformationService.query(params, null, information_type_id, null, null).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //编辑主页内容某一栏目信息
    $scope.edit = function (item) {
        portalInformationService.get(item.id).then(function (data) {
            $scope.model = data;
        });
        $('#modal-edit').modal('show');
    };
    //更新主页内容某一栏目信息
    $scope.save = function () {
        portalInformationService.update($scope.model).then(function (data) {
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    };
});
hpxAdminApp.controller('portalInformationController', function ($scope, $rootScope, $state, $window, API_URL, NgTableParams, portalInformationService, portalInformationTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    portalInformationTypeService.queryByInformationTypeID($scope.filter.information_type_id).then(function (data) {
        $scope.informationTypes = data;
    });

    //portalInformationService.queryByPublishingTime($scope.filter.publishing_time).then(function (data) {
    //    $scope.information = data;
    //});

    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {

            return portalInformationService.query(params, $scope.filter.keyword, $scope.filter.informationTypeId, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    $scope.reflash = function () {
        $scope.filter.publishingTimeS = document.getElementById("publishingTimeS").value;
        $scope.filter.publishingTimeB = document.getElementById("publishingTimeB").value;
        $scope.tableParams.reload();
    }

    //$scope.add = function () {
    //    window.location.href = "/www/index.html#/app/portalInformation/test";
    //}
    $scope.edit = function (item) {
        if (item == null) {
            $scope.model = newEntity;
        }
        else {
            portalInformationService.get(item.id).then(function (data) {
                $scope.model = data;
            });
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {
            portalInformationService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            portalInformationService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }

    };

    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + '【' + data.information_type_name + '】' + data.title + ' 吗？ ')) {
            portalInformationService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

});
hpxAdminApp.controller('portalInformationTypeController', function ($scope, $rootScope, $state, NgTableParams, portalInformationTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {
            return portalInformationTypeService.query(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //$scope.tableParams = new NgTableParams({}, {
    //    getData: function () {
    //        return portalInformationTypeService.queryByInformationTypeId().then(function (data) {
    //            $scope.first = $scope.getFirst();
    //            return data;
    //        });
    //    }
    //});

    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
        $('#modal-edit').draggable();
    };


    $scope.save = function () {
        if ($scope.model.id == null) {
            portalInformationTypeService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            portalInformationTypeService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.information_type_name + ' 吗？ ')) {
            portalInformationTypeService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});
hpxAdminApp.controller('portalSuggestionController', function ($scope, $rootScope, $state, ngTableParams, portalSuggestionService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        suggestionTypeId: "1",  //投诉
        handleStatusCode: "0"   //未查看
    };

    //获取所有的投诉与建议
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
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //获取对应id的投诉建议内容
    $scope.read = function (data) {
       // var id = data.id;
        $scope.model = angular.copy(data);
        //$('#modal-read').modal('show');
        $('#modal-read').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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

// JavaScript source code
hpxAdminApp.controller('portalSuggestionInfoController', function ($scope, $rootScope, $state, NgTableParams, portalSuggestionInfoService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        suggestionTypeId: "1",      //默认投诉
        handleStatusCode: "0"       //默认未查看
    };

    //portalSuggestionInfoService.queryAll().then(function (data) {
    //    $scope.portal_suggestions = data.portal_suggestions;
    //});

    //获取投诉或建议信息
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return portalSuggestionInfoService.query(params, $scope.filter.suggestionTypeId, $scope.filter.handleStatusCode, $scope.filter.keyword).then(function (data) {
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
        if (data == null) {         //弹出新增窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {      //新增投诉建议信息
            portalSuggestionInfoService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //更新投诉建议信息
            portalSuggestionInfoService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除投诉建议信息
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.suggestion_title + ' 吗？')) {
            portalSuggestionInfoService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };



});
// JavaScript source code
hpxAdminApp.controller('portalSuggestionTypeController', function ($scope, $rootScope, $state, NgTableParams, portalSuggestionTypeService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};


    $scope.tableParams = new NgTableParams({ sorting: { 'username': 'asc' } }, {
        getData: function (params) {
            portalSuggestionTypeService.queryAll().then(function (data) {
                $scope.portal_suggestion_types = data.portal_suggestion_types;
            });
            //if ($scope.filter.keyword != null) {

            //  return portalSuggestionTypeService.queryKey($scope.filter.keyword).then(function (data) {
            //      $scope.first = $scope.getFirst(params);
            //      return data;
            //  });

            //}
        }
    });




    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //$scope.edit = function (data) {
    //    if (data == null) {
    //        $scope.model = newEntity;
    //    }
    //    else {
    //        $scope.model = angular.copy(data);
    //    }
    //    //$scope.roleChange();
    //    $('#modal-edit').modal('show');
    //};

    //$scope.save = function () {
    //    if (!$scope.model.id) {
    //        portalSuggestionTypeService.add($scope.model).then(function (data) {
    //            $scope.tableParams.reload();
    //            angular.copy(emptyEntity, newEntity);
    //            $scope.editForm.$setPristine();
    //            $('#modal-edit').modal('hide');
    //        });
    //    }
    //    else {
    //        portalSuggestionTypeService.update($scope.model).then(function (data) {
    //            $scope.tableParams.reload();
    //            $scope.editForm.$setPristine();
    //            $('#modal-edit').modal('hide');
    //        });
    //    }
    //};

    ////$scope.resetPassword = function () {
    ////    if (confirm('确定要重置密码吗？')) {
    ////        portalSuggestionTypeService.resetPassword($scope.model.id).then(function (data) {
    ////            alert("已被重置为初始密码");
    ////        });
    ////    }
    ////};
    //$scope.remove = function (data) {
    //    if (confirm('确定要删除' + data.username + '吗')) {
    //        portalSuggestionTypeService.remove(data.id).then(function (data) {
    //            $scope.tableParams.reload();
    //        });
    //    }
    //};
})
hpxAdminApp.controller('publicationController', function ($http,Upload,EXPORT_URL ,$rootScope, $scope, $state, NgTableParams, publicationService) {

    $scope.filter = {
        time1: '',
        time2: ''
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.time1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.time2 = $("#end_time").val();
    });

    //获取未审核或已审核的银行账户信息数据
    $scope.tableParams = new NgTableParams({'sorting': {'id': 'asc'}}, {
        getData: function (params) {
            return publicationService.getAllServiceByPublication(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //显示
    $scope.show = function (item) {
        $scope.model = angular.copy(item);
        $("#modal-show").modal('show');
    }
    //删除
    $scope.delete = function (item) {
        if (confirm("确定删除改条公催数据？")) {
            publicationService.deleteServiceByPublication(item.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    }

    //上传excel
    $scope.showUploadModal = function () {
        $("#modal-upload").modal('show');
    }

    $scope.uploadFile = function () {
        $http({
            url: EXPORT_URL + "/tools/excelImport?func=serviceByPublication",
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $rootScope.identity.token ,
                'Content-Type': undefined
            },
            transformRequest: function() {
                var formData = new FormData();
                formData.append('file', $('#publicationFile')[0].files[0]);
                return formData;
            }
        }).success(function (result) {
            if(result.meta.code == 200){
                alert("上传成功!");
            }else{
                alert("上传失败,错误信息:"+result.data);
            }
        });
    }
    $scope.uploadFiles = function (files, errFiles) {
        angular.forEach(files, function (file) {
            $scope.nowFile = file;
            file.upload = Upload.upload({
                url:  EXPORT_URL + "/tools/excelImport?func=serviceByPublication",
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file
            }).then(function (response) {

            }, function (response) {
                if (response.status > 0) {
                }
            }, function (evt) {

            });
        });
    };


});

hpxAdminApp.controller('publicQueryController', function ($rootScope, $scope, $state, customerService, toolService, privilegeService, API_URL, ngTableParams, payingService) {
    $scope.model = {
        "billNumber": null,
    };
    $scope.filter = {
        'checkedType': 1,        //默认1个月
        'choiceReCharge': 1,
        'items': 3
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
        privilegeService.customerPrivilege({
            'privilege_id': 2
        }).then(function (data) {
            if (data.right == 0) {
                if (data.isuser == 0) {
                    //$('#modal-edit').modal('show'); // 前往登录
                    $('#modal-edit').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $('.h_login').show().siblings().hide();
                } else {
                    if (data.enterprise_id <= 0) {
                        //$('#modal-edit').modal('show'); // 前往认证
                        $('#modal-edit').modal({
                            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                            keyboard: false,//键盘关闭对话框
                            show: true//弹出对话框
                        });
                        $('.h_renzheng').siblings().hide();
                    } else {
                        //$('#modal-edit').modal('show'); // 前往充值
                        $('#modal-edit').modal({
                            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                            keyboard: false,//键盘关闭对话框
                            show: true//弹出对话框
                        });
                        $('.prompt').siblings().hide();
                        var emptyEntity = {};
                        var newEntity = angular.copy(emptyEntity, newEntity);

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
                            $scope.model = data;
                        });
                        $scope.XYRecharge = function () {
                            window.open('http://www.cibfintech.com/');
                        }
                        //打开一个新页面，进行充值活动
                        $scope.submit = function () {
                            window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);
                            $('#modal-edit').modal('hide');
                        };

                        $scope.choiceReCharge = function (number) {
                            $scope.filter.choiceReCharge = number;
                        };

                        $scope.hpxCharge = function () {
                            $scope.model = newEntity;
                            //$('#modal-edit').modal('show');
                            $('#modal-edit').modal({
                                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                                keyboard: false,//键盘关闭对话框
                                show: true//弹出对话框
                            });
                            $('.h_zhifu').show().siblings().hide();
                        }

                    }
                }
            } else {
                toolService.serviceByPublication($scope.model).then(function (data) {
                    if (data.page_info.items_number)
                        $scope.queryResult = data['service_by_publications'][0];
                    else {
                        $scope.queryResult = null;
                        swal("该票号目前暂无挂失信息.");
                    }
                });
            }
        });

    }
    // 现金购买
    $scope.money = function () {
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_buy').show().siblings().hide();
        // 查询套餐
        privilegeService.privilegePackage({
            'privilege_id': 2
        }).then(function (data) {
            $scope.package = data

        })
    }

    $scope.refresh = function () {
        $('.h_bty section').eq(0).find('input[name = "sex"]').attr('checked', 'true')
    }
    // 点击购买
    $scope.buy = function () {
        //获取账户余额
        payingService.GetPlatformAccount().then(function (data) {
            $scope.model = data;
            var price = $scope.price || 50;
            var hitems = $scope.items || 3;
            if ($scope.model.platform_account_balance >= price) {
                privilegeService.privilegePackOrder({
                    'enterprise_id': $rootScope.identity.enterprise_id,
                    'customer_id': $rootScope.identity.customer_id,
                    'package_id': hitems
                }).then(function (data) {
                    //$('#modal-edit').modal('show');
                    $('#modal-edit').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $('.h_chenggong').show().siblings().hide();
                })
            } else {
                //$('#modal-edit').modal('show');
                $('#modal-edit').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
                $('.noMoney').show().siblings().hide();
            }
        });
    }

    // 弹窗中的点击事件
    $scope.hpxLgoin = function () {
        window.location.href = "index.html#/app/loginInfo";
        window.location.reload();
    }
    $scope.phxRenzheng = function () {
        window.location.href = "index.html#/app/main/customerInfo";
        window.location.reload();
    }
    $scope.invitation = function () {
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.frient').show().siblings().hide();
    }
    $scope.recharge = function () {
        $scope.model = newEntity;
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_zhifu').show().siblings().hide();
    }

    $scope.queding = function () {
        window.location.reload();
    }

    //清理
    $scope.clear = function () {
        $scope.model.billNumber = null;
        $scope.queryResult = null;
        $scope.updateBillNumber();
    }



    $('.h_bty').delegate('.h_o', 'click', function (data) {
        items = $("input:radio[name='sex']:checked").next().val();
        price = $("input:radio[name='sex']:checked").next().attr("price");
        $scope.items = items;
        $scope.price = price;
        $('.hp_money span').text(price)
    })

    // 支付宝充值
    //var emptyEntity = {};
    //var newEntity = angular.copy(emptyEntity, newEntity);

    //$scope.filter = {
    //    choiceReCharge: 1,
    //};
    //获取账户充值记录
    //$scope.tableParams = new ngTableParams({ 'sorting': { 'change_time': 'desc' } }, {
    //    getData: function (params) {
    //        return payingService.platformAccountBalance(params).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});

    //获取账户余额
    //payingService.GetPlatformAccount().then(function (data) {
    //    $scope.model = data;
    //});

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //$scope.XYRecharge = function () {
    //    window.open('http://www.cibfintech.com/');
    //}
    ////打开一个新页面，进行充值活动
    //$scope.submit = function () {
    //    window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);
    //    $('#modal-edit').modal('hide');
    //};

    //$scope.choiceReCharge = function (number) {
    //    $scope.filter.choiceReCharge = number;
    //};

    //// 判断金额
    //$scope.buy = function () {
    //    console.log(hmon)
    //    if ($scope.model.platform_account_balance >= hmon) {
    //        $('#modal-edit').modal('show');
    //        $('.h_chenggong').show().siblings().hide();
    //    } else {
    //        $('#modal-edit').modal('show');
    //        $('.noMoney').show().siblings().hide();
    //    }

    //}
    //$scope.hpxCharge = function () {
    //    $scope.model = newEntity;
    //    $('#modal-edit').modal('show');
    //    $('.h_zhifu').show().siblings().hide();
    //}
});

hpxAdminApp.controller('publishController', function ($rootScope, $scope, $timeout, $stateParams, $state, FILE_URL, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    $scope.model = {
        'bill_front_photo_path': 'assets/img/hpx-001.png',
        'bill_back_photo_path': 'assets/img/hpx-002.png',
        'endorsement_number': 1,
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        //bill_type_id: 101,
        trade_type_code: 701,
    };
    if ($rootScope.identity.is_verified == -1 || $rootScope.identity.is_verified == 0 || $rootScope.identity.is_verified == 2) {
        swal("您是个人客户，只能发布纸票！");
        $scope.model.bill_type_id = 102;
    } else {
        $scope.model.bill_type_id = 101;
    }
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
    //获取票据属性类型
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })

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
                return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                    $scope.cityData = data;
                    $scope.model.product_location_id = AddData.trade_location_city_id;
                });
            }
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
                    $scope.model.bill_front_photo_path = 'assets/img/hpx-001.png';
                }
                if (!$scope.model.bill_back_photo_path) {
                    $scope.model.bill_back_photo_path = 'assets/img/hpx-002.png';
                }
                if ($stateParams.id && $scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                    $scope.filter.tradetype = 1;
                    //document.getElementById("price").readOnly = "readonly";
                    //document.getElementById("acceptortype").disabled = "true";
                    //document.getElementById("producttime").readOnly = "readonly";
                    //document.getElementById("producttime").disabled = "true";
                    document.getElementById("billrate").readOnly = "readonly";
                    document.getElementById("billdealprice").disabled = "true";
                    if ($scope.model.bill_status_code == 800) {
                        $("#billrate").removeAttr("disabled");
                        $("#billdealprice").removeAttr("disabled");
                        $("#price").removeAttr("disabled");
                        $("#acceptortype").removeAttr("disabled");
                    }
                }
            });
            $timeout(function () {
                if ($scope.model.bill_front_photo_path && $scope.model.bill_front_photo_path != 'assets/img/hpx-001.png') {
                    $('.jqzoom_front').imagezoom();
                }
                if ($scope.model.bill_back_photo_path && $scope.model.bill_back_photo_path != 'assets/img/hpx-002.png') {
                    $('.jqzoom_back').imagezoom();
                }
            }, 500);
        });
    }

    hpxxid = function () {
        if ($stateParams.id) {
            billService.getBillProductBidding($stateParams.id).then(function (data) {
                angular.forEach(data, function (ele, index) {
                    $scope.hGengjiao = ele;
                })
            });
        }
    }
    hpxxid();

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
    }
    //在不同交易类型下，循环获取汇票瑕疵的多选结果
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
    //点击汇票到期日，默认选中的时间
    $scope.billTypeChange = function (id) {

        $scope.model.bill_type_id = id;

        if ($scope.model.bill_type_id == 101) {
            //$scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
            $("#Billnumber").css("display","block");
            $("#Billnumbers").css("display","none");
        } if ($scope.model.bill_type_id == 102) {
            $("#Billnumber").css("display", "none");
            $("#Billnumbers").css("display", "block");
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
        $scope.model.bill_front_photo_path = 'assets/img/hpx-001.png';
        $('.jqzoom_front').unbind("mouseenter");
        $('.jqzoom_front').css('cursor', '');
    }
    //汇票背面图片移除功能
    $scope.removeBack = function () {
        $scope.model.bill_back_photo_id = null;
        $scope.model.bill_back_photo_path = 'assets/img/hpx-002.png';
        $('.jqzoom_back').unbind("mouseenter");
        $('.jqzoom_back').css('cursor', '');
    }
    //上传图片后，点击图片跳转页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    //上传图片后，点击图片跳转页面，放大图片
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
            title: "确定要删除该文件吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.enclosure.splice(index, 1);
        });
    };
    //提示信息
    $scope.question = function () {
        swal('请在预约交易时间前进行交易，过时请重新发布。');
    }
    // 限制背书次数只能输入0-100的正整数
    $scope.checkInt = function (n, max) {
        var regex = /^\d+$/;
        if (regex.test(n)) {
            if (n < max && n > 0) {
            } else {
                swal("这不是小于" + max + "的正整数！请重新输入！");
                $scope.model.endorsement_number = "";
            }
        }
    }
    // 限制票面金额最大10000000000
    $scope.onlyNumber = function (price, rental) {
        var priceNum = Number(price);
        var rentalNum = Number(rental);
        if (priceNum > rentalNum) {
            swal("您输入的票面金额有误，请重新输入！");
            $scope.model.bill_sum_price = rental;
        }
    }
    $scope.rateNum = function (rate,rate_total) {
        if (rate > rate_total) {
            swal("您输入的期望金额有误，请重新输入！");
            $scope.model.bill_rate = rate_total;
        }
    }
    $scope.isDisable = false;
    $scope.save = function () {
        // 点击提交之后，禁止再次提交
        $scope.isDisable = true;
        if (!$scope.model.bill_type_id) {
            swal("请选择票据类型");
            $scope.isDisable = false;
            return;
        }

        if (!$scope.model.trade_type_code) {
            swal("请选择交易方式");
            $scope.isDisable = false;
            return;
        }

        if (!$scope.model.bill_sum_price) {
            swal("请输入票面金额");
            $scope.isDisable = false;
            return;
        }

        if ($scope.model.bill_number) {
            if ($scope.model.bill_type_id == 101 && $scope.model.bill_number.length != 30) {
                swal("请输入正确的30位电票票据号");
                $scope.isDisable = false;
                return;
            }
            if ($scope.model.bill_type_id == 102 && $scope.model.bill_number.length != 16) {
                swal("请输入正确的16位纸票票据号");
                $scope.isDisable = false;
                return;
            }
        }

        if (!$scope.model.contact_name) {
            swal("请输入联系人姓名");
            $scope.isDisable = false;
            return;
        }
        if (!$scope.model.contact_phone) {
            swal("请输入联系方式");
            $scope.isDisable = false;
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                swal("请上传汇票正面");
                $scope.isDisable = false;
                return;
            }
        } else {
            if ($scope.model.trade_type_code == 702) {
                if (!$scope.model.acceptor_type_id) {
                    swal("请选择承兑机构");
                    $scope.isDisable = false;
                    return;
                }

                if (!$scope.model.product_deadline_time) {
                    swal("请选择失效时间");
                    $scope.isDisable = false;
                    return;
                }

                if ($stateParams.id && $scope.model.bill_type_id == 101) {
                    if (!$scope.model.bill_front_photo_id) {
                        swal("请上传汇票正面");
                        $scope.isDisable = false;
                        return;
                    }
                }
            }
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
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        swal({
            title: "确定要发布汇票吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.isDisable = true;
            if (!$scope.model.id) {
                //发布汇票信息
                billService.insertBillProduct($scope.model).then(function (data) {
                    //swal('发布成功！\n请等待后台审核（30分钟内完成）。')
                    //$state.go("app.main.myBill");
                    swal({
                        title: "发布成功！\n请等待后台审核（30分钟内完成）。",
                        confirmButtonText: "是",
                    }, function () {
                        window.location.reload();
                    });
                });
            } else {
                //修改汇票信息
                if ($scope.model.id && $stateParams.bidId && $scope.model.trade_type_code == 702) {
                    $scope.model.bill_product_id = $scope.model.id;
                    $scope.model.bill_product_bidding_id = parseInt($stateParams.bidId);
                    $scope.model.is_NeedXY = 1;
                    $scope.model.type = "bidding";
                    billService.newOrderBidding($scope.model).then(function (data) {
                        swal('发布成功！\n请等待后台审核（30分钟内完成）。')
                        $state.go("app.main.myBill");
                    });
                } else {
                    billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
                        swal('修改成功！\n请等待后台审核（30分钟内完成）。');
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
        billStatusCode: '801',
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
        //$scope.filterProvinceChange();
    });
    //获取对应的省下所有的市级地址
    $scope.filterProvinceChange = function () {
        $scope.filter.locationId = null;
        if ($scope.filter.ProvinceID == null) {
            return;
        } else if ($scope.filter.ProvinceID == 1 || $scope.filter.ProvinceID == 20 || $scope.filter.ProvinceID == 860 || $scope.filter.ProvinceID == 2462) {
            $scope.filter.tradeProvinceId = $scope.filter.ProvinceID + 1;
            $scope.filter.locationId = $scope.filter.ProvinceID;
            $scope.tableParams.reload();
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            $scope.filter.locationId = $scope.filter.ProvinceID;
            $scope.tableParams.reload();
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

    $scope.filterCityChange = function () {
        $scope.filter.locationId = $scope.filter.CityID;
        $scope.tableParams.reload();
    }

    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
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

            if ($scope.filter.CityID==null) {
                $scope.filter.locationId = $scope.filter.ProvinceID;
            } else {
                $scope.filter.locationId = $scope.filter.CityID;
            }
            //if ($scope.filter.ProvinceID != null && $scope.filter.CityID == null) {
            //    swal("请选择完整的省市或直辖市区地址！")
            //} else {
            //    $scope.filter.locationId = $scope.filter.CityID;
            //}
            //$scope.filter.locationId = $scope.filter.CityID;

            //查看票据
            return billService.searchBillProduct(params, $scope.filter.billTypeID, $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                $scope.first = $scope.getFirst(params);
                //if (data.bill_status_code == 801) {
                //    data.bill_status_name="发布中";
                //}else if(data.bill_status_code >= 802) {
                //    data.bill_status_name="交易中";
                //}
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
        swal('足月票：一般是指剩余天数半年期票多于180天，一年期票多于360天的汇票。');
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
            //$('#modal-bidding').modal('show');
            $('#modal-bidding').modal({
                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                keyboard: false,//键盘关闭对话框
                show: true//弹出对话框
            });
        });
    };
    //弹出出价记录窗口
    $scope.showAddBidding = function (item) {
        $scope.biddingModel = {
            bill_product_id: $scope.model.id
        };
        //$('#modal-addBidding').modal('show');
        $('#modal-addBidding').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //撤销报价功能
    $scope.cancelBidding = function (item) {
        swal({
            title: "确定要撤销报价吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
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
            swal('出价成功！');
            //获取出价记录详情
            billService.getBillProductBidding($scope.model.id).then(function (data) {
                $scope.biddings = data;
                $('#modal-addBidding').modal('hide');
            });
        });
    };
    //$(".shang").click(function () {
    //    $(".shang").css("background-position", "0 -14px")
    //    $(".xia").css("background-position", "0 -14px")
    //    $(".shangs").css("background-position", "0  1px")
    //    $(".xias").css("background-position", "0  -14px")
    //});
    //$(".xia").click(function () {
    //    $(".xia").css("background-position", "0 1px")
    //    $(".shang").css("background-position", "0 1px")
    //    $(".shangs").css("background-position", "0  1px")
    //    $(".xias").css("background-position", "0  -14px")
    //});
    //$(".shangs").click(function () {
    //    $(".shangs").css("background-position", "0 -14px")
    //    $(".xias").css("background-position", "0 -14px")
    //    $(".shang").css("background-position", "0 1px")
    //    $(".xia").css("background-position", "0 -14px")
    //});
    //$(".xias").click(function () {
    //    $(".xias").css("background-position", "0 1px")
    //    $(".shangs").css("background-position", "0 1px")
    //    $(".xia").css("background-position", "0 -14px")
    //    $(".shang").css("background-position", "0 1px")
    //});
    //$scope.sortByType = function (type) {
    //    $scope.sort = type;
    //    $scope.desc = !$scope.desc;
    //}
    //$scope.sortBy = function (type) {
    //    $scope.sort = type;
    //    $scope.desc = !$scope.desc;
    //}

$scope.jingjia = function (item) {
    billService.getBillProduct(item.id).then(function(data){
        $scope.hpxBillA=data;
        if ($rootScope.identity && data.drawer_id == $rootScope.identity.enterprise_id) {
            //window.location.href="/www/index.html#/app/free/readBill"+'?id='+ item.id +'&check='+ 1;
            $state.go('app.free.readBill', { 'id': item.id, 'check': 1 });
        } else {
            //window.location.href="/www/index.html#/app/free/readBillSup"+'?id='+ item.id +'&check='+ 2;
            $state.go('app.free.readBillSup', { 'id': item.id, 'check': 2 });
        }
    })
    }
$scope.findDetail = function (item) {
    console.log(item)
    //billService.getBillProduct(item.id).then(function (data) {
    //    $scope.hpxBillA = data;
    //    if ($rootScope.identity && data.drawer_id == $rootScope.identity.enterprise_id) {
    //        $state.go('app.main.orderDrawerInfo', { 'id': item.id });
    //    } else {
    //        $state.go('app.main.orderReceiverInfo', { 'id': item.id });
    //    }
    //})
}
});
hpxAdminApp.controller('queryenterpriseController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
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
            $scope.filter.tradeLocationId = $scope.filter.product_province_id;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.filter.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    $scope.locationChange = function () {
        $scope.filter.tradeLocationId = $scope.filter.tradeLocationId;
    }
    $scope.tableParams = new ngTableParams({ 'sorting': { 'offer_time': 'desc' } }, {
        getData: function (params) {
            var newdate = new Date();
            $scope.filter.publishingTimeS = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日期
            $scope.filter.publishingTimeB = $filter('date')(newdate, 'yyyy-MM-dd');
            if ($scope.filter.tradeLocationId==null) {
                $scope.filter.tradeLocationId = $scope.filter.product_province_id;
            } else {
                $scope.filter.tradeLocationId = $scope.filter.tradeLocationId;
            }
            //获取当前日期的报价信息
            return billService.searchBillOffer(params, $scope.filter.func, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId, $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.first = $scope.getFirst(params);
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
        $scope.filter.tradeLocationId = 860;
        document.getElementById("country").className = "";
        document.getElementById("shanghai").className = "highlight";
        document.getElementById("beijing").className = "";
        document.getElementById("guangzhou").className = "";
        document.getElementById("shenzhen").className = "";
        document.getElementById("hangzhou").className = "";
        $scope.tableParams.reload();
    }
    $scope.choiceBJ = function () {
        $scope.filter.tradeLocationId = 1;
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

    // 排序
    //$scope.sortByType = function (type) {
    //    $scope.sort = type;
    //    $scope.desc = !$scope.desc;
    //}
    //$(".shang2").click(function () {
    //    $(".shang1").css("background-position", "0 -14px")
    //    $(".xia1").css("background-position", "0 -14px")
    //});
    //$(".xia1").click(function () {
    //    $(".xia1").css("background-position", "0 1px")
    //    $(".shang1").css("background-position", "0 1px")
    //});
});

hpxAdminApp.controller('queryOrderController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, searchService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'func': 'detail',
        'deadlineTime1':'',
        'deadlineTime2':''
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click",function(ev){
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.deadlineTime1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.deadlineTime2 = $("#end_time").val();
    });

    //获取所有正在进行中的订单
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return orderService.getAllAliveOrders(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    $scope.check = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();
    };

    $scope.showAppraisal = function (item) {
        searchService.getEnterpriseAppraisal(item,{func:'order'}).then(function (result) {
            $scope.model = result;
            $('#modal-appraisal').modal('show');
        });
    };

    $scope.save = function (data) {
        $scope.model = angular.copy(data);       //弹出终止窗口
        $('#modal-read').modal('show');
    };

    $scope.stopOrder = function () {
        //终止订单
        if (confirm('确认终止此订单吗？')) {
            console.log("asdasdasd");
            orderService.stopOrder($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $('#modal-read').modal('hide');
            });
        }
    };

});
hpxAdminApp.controller('quoteController', function ($rootScope, $scope, $timeout, $state, addressService, customerService, ngTableParams, billService, constantsService) {
    //判断是否可以报价
    if ($rootScope.identity.can_publish_offer != 1) {
        swal("您暂时还不能报价！");
        window.history.back();
        return;
    }
    if ($rootScope.identity.is_verified == -1 || $rootScope.identity.is_verified == 0 || $rootScope.identity.is_verified == 2) {
        swal("您是个人客户，不能进行机构报价！");
        $('#link4').attr("disabled",true)
    }
    $scope.filter = { };
    //获取所有我的报价信息
    $scope.tableParams = new ngTableParams({ 'sorting': {'offer_time':'desc'} }, {
        getData: function (params) {
            return billService.getAllOwnBillOffer(params, $scope.filter.billTypeId, $scope.filter.billStyleId, $scope.filter.maxPrice, $scope.filter.tradeLocationId, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);

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
            title: "确定要删除该报价吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            billService.deleteBillOffer(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    }

    $scope.edit = function (data) {
        if (data == null) {         //跳转至新建报价
            $state.go('app.main.editQuote');
        }
        else {      //跳转到报价详细信息
            $state.go('app.main.editQuote', { 'id': data.id });
        }
    };
});
hpxAdminApp.controller('readBillController', function ($rootScope, $scope, $state, $stateParams, $filter, $timeout, ngTableParams, addressService, billService, constantsService, orderService, customerService, toolService, enterprisesService, payingService, FILE_URL, Upload, bankService, fileService, enterpriseXingyeUserService) {
    console.log($rootScope)
    console.log($scope)
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
        check: 0,
        isaccount: 0,
        billBided: 0,
        billSuccess: 0,
        isbidingtime: 0,
        isidentity: 0,
        fromKeyWord: "",
        submitRule: 0,
        prepRule: false,
        rote: 1
    };
    $scope.firstSign = {
        contract_num: 0,
    }
    $scope.model = {
        serve_price: 0
    }
    //$scope.model = {
    //    'bill_front_photo_path': '',
    //    'bill_back_photo_path': '',
    //    'endorsement_number': 1,
    //    'contact_name': $rootScope.identity.customer_name,
    //    'contact_phone': $rootScope.identity.phone_number,
    //    bill_type_id: 101,
    //    trade_type_code: 701,
    //};

    $scope.prepMatters = function () {
        //$('#modal-addBiddings').modal('show');
        $('#modal-addBiddings').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    $scope.closePrep = function () {
        //$('#modal-addBiddings').modal('hide');
        $scope('#modal-addBiddings').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }

    $scope.prepAddBid = function () {
        if (!$scope.biddingModel.bid_rate) {
            swal("请填写月利率！");
            $scope.filter.prepRule = false;
        } else if ($scope.biddingModel.bid_rate && $scope.filter.prepRule) {
            $scope.filter.prepRule = true;
        }
    }
    $scope.drawRead = function () {
        $scope.filter.prepRule = true;
    }
    $scope.showAddpBid = function () {
        //$('#modal-addBiddings').modal('show');
        $('#modal-addBiddings').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    $scope.prepRead = function () {
        $scope.filter.prepRule = true;
        $('#modal-addBiddings').modal('hide');
    }
    $scope.guanbi = function () {
        $('#modal-addBidding').modal('hide');
    }
    //根据id获取对应的票据详细信息
    init = function () {
        if ($stateParams.id) {
            billService.getBillProduct($stateParams.id).then(function (data) {
                $scope.model = data;
                if ($stateParams.check) {
                    $scope.filter.check = $stateParams.check;
                }
                if (!$scope.model.remaining_day) {
                    $scope.model.remaining_day = 0;
                }
                //根据条件判断，成立则获取出价记录
                if ($stateParams.id && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.model.publisher_id == $rootScope.identity.enterprise_id)) {
                    billService.getBillProductBidding($stateParams.id).then(function (data) {
                        $scope.biddings = data;
                        angular.forEach(data, function (ele, index) {
                            $scope.hpxBidding = ele;
                        })
                    });
                }
                //倒计时
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
            }, 500);
        }
    }
    init();

    //撤销报价
    $scope.cancelBidding = function (item) {
        swal({
            title: "确定要撤销报价吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
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
            //swal('出价成功！');
            $('#modal-addBidding').modal('hide');
            //$scope.model.billBided = 1;
            //if ($scope.model.id && identity && (identity.can_see_bill_detail == 1 || model.publisher_id == identity.enterprise_id)) {
            billService.getBillProductBidding($scope.model.id).then(function (data) {
                $scope.biddings = data;
            });
            //}
            setTimeout(function () {
                if ($scope.model.bill_type_id == 101) {
                    swal({ 'title': '报价成功！\n请等待出票方确认报价。' }, function () {
                        $state.go("app.free.readBillBid", { id: $scope.model.id, check: 3 });
                    })
                } else if ($scope.model.bill_type_id == 102) {
                    swal({ 'title': '报价成功！ \n温馨提醒：报价后请及时联系出票方。' }, function () {
                        $state.go("app.free.readBillBid", { id: $scope.model.id, check: 3 });
                        //window.location.reload();
                    });
                }
            }, 350);
        });
    };
    // 计算手续费
    $scope.phxPay = {
        withdrawal_procedure: "",
        hpxZong: 0,
        amount: ""
    }
    $scope.bidPoundage = function () {
        if ($scope.model.bill_type_id == 101) {
            if ($scope.phxPay.amount <= 100000.00) {
                $scope.phxPay.withdrawal_procedure = 10.00;
            } else if ($scope.phxPay.amount > 100000.00 && $scope.phxPay.amount <= 500000.00) {
                $scope.phxPay.withdrawal_procedure = 15.00;
            } else if ($scope.phxPay.amount > 500000.00 && $scope.phxPay.amount <= 1000000.00) {
                $scope.phxPay.withdrawal_procedure = 20.00;
            } else if ($scope.phxPay.amount > 1000000.00) {
                $scope.phxPay.withdrawal_procedure = Number($scope.phxPay.amount * 0.00002).toFixed(2);
                if ($scope.phxPay.withdrawal_procedure >= 200) {
                    $scope.phxPay.withdrawal_procedure = 200.00;
                }
            }
        } else if ($scope.model.bill_type_id == 102) {
            $scope.phxPay.withdrawal_procedure = 0;
        }
    }
    $scope.poundage = function () {
        swal('提现手续费扣费标准： \n 10W以下（包含10W）10元 \n 10W-50W（包含50W） 15元 \n 50W-100W（包含100W）20元 \n 100W以上 0.002% 200元封顶。');
    }
    $scope.hpxBidL = true;
    $scope.isdisabled = true;
    //if (!$scope.biddingModel.bid_rate && !$scope.biddingModel.bid_every_plus) {
    //    $scope.isdisabled = true;
    //} else {

    //}
    //贴息计算
    $scope.ratechange = function () {
        //alert("1")
        $scope.hpxBidL = true;
        $scope.rateModel = {};
        if (!$scope.biddingModel.bid_every_plus || !$scope.biddingModel.bill_rate) {
            $scope.isdisabled = false;
        }
        if ($scope.biddingModel.bid_rate == null || $scope.biddingModel.bid_rate == "" || $scope.biddingModel.bid_rate == undefined) {
            $scope.biddingModel.bid_deal_price = "";
            $scope.biddingModel.bid_rate_price = "";
            $scope.phxPay.hpxZong = 0;
            $scope.phxPay.withdrawal_procedure = "";
        }
        if ($scope.biddingModel.bid_rate > 0) {
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
                    $scope.rateModel.every_plus = $scope.biddingModel.bid_every_plus;
                }
                $scope.rateModel.every_plus = $scope.biddingModel.bid_every_plus ? $scope.biddingModel.bid_every_plus : 0;

                toolService.calculator($scope.rateModel).then(function (data) {
                    $scope.hpxBidL = false;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    $scope.phxPay.amount = $scope.biddingModel.bid_deal_price;
                    $scope.bidPoundage();
                    $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.biddingModel.bid_deal_price);
                    $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);
                });
            } else if ($scope.model.trade_type_code == 702) {
                $scope.rateModel.every_plus = $scope.biddingModel.bill_rate;

                toolService.calculator($scope.rateModel, 'ten').then(function (data) {
                    $scope.hpxBidL = false;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    $scope.phxPay.amount = $scope.biddingModel.bid_deal_price;
                    $scope.bidPoundage();
                    $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.biddingModel.bid_deal_price);
                    $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);

                });
            }

        }
    };


    //弹出出价窗口
    $scope.showAddBidding = function (item) {
        $scope.isdisabled = true;
        $scope.biddingModel = {
            bill_product_id: $scope.model.id,
            bid_enterprise_name: $rootScope.identity.enterprise_name,
        };
        //$('#modal-addBidding').modal('show');
        $('#modal-addBidding').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };

    //弹出选择成交窗口
    $scope.showFinishBidding = function (item) {
        $scope.payModel = item;
        $scope.accountModel = {
            account_person: $scope.model.drawer_name,
        }
        $scope.model.drawer_account_id = null;
        var enterpriseId = $rootScope.identity.enterprise_id
        payingService.getAccount(enterpriseId).then(function (data) {

            $scope.accounts = data.acct_list;
        })
        $scope.payModel = {};
        $scope.payModel.payId = item.id;
        $scope.payModel.bid_enterprise_name = item.bid_enterprise_name;
        $scope.payModel.bid_enterprise_id = item.bid_enterprise_id;
        $scope.payModel.bid_deal_price = item.bid_deal_price;
        $scope.payModel.bill_rate = item.bid_rate;
        $scope.payModel.bid_every_plus = item.bid_every_plus
        $scope.payModel.receiver_name = item.receiver_name;
        $scope.payModel.receiver_avg_star = item.receiver_avg_star;
        $scope.payModel.receiver_contact_name = item.receiver_contact_name;
        $scope.payModel.receiver_contact_phone = item.receiver_contact_phone;
        $scope.phxPay.amount = $scope.payModel.bid_deal_price;
        $scope.bidPoundage();
        $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.payModel.bid_deal_price);
        $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);
        billService.insertEnterpriseId($stateParams.id, $scope.payModel.bid_enterprise_id).then(function (data) {
            // 根据票据id查询双方银行卡信息
            payingService.getAccountPX($stateParams.id).then(function (data) {
                $scope.hpxAX = data;
                $scope.hpxContract = data.receiverAccount;
            })
        })
        if ($scope.model.trade_type_code == 701 && $scope.model.bill_type_id == 101 || $scope.model.bill_type_id == 102) {
            //$('#modal-finishBidding').modal('show');
            $('#modal-finishBidding').modal({
                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                keyboard: false,//键盘关闭对话框
                show: true//弹出对话框
            });
        }
        else   //$scope.model.bill_front_photo_path == null || $scope.model.bill_back_photo_path == null || $scope.model.bill_number == null || $scope.model.bill_deadline_time == null || $scope.model.bill_deal_price == null || $scope.model.bill_rate == null
            if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101 && $scope.model.is_checked == 1 && ($scope.model.bill_front_photo_path == null || $scope.model.bill_back_photo_path == null || $scope.model.bill_number == null || $scope.model.bill_deadline_time == null || $scope.model.bill_deal_price == null || $scope.model.bill_rate == null)) {
                swal({
                    title: "您的票据信息还不完善！",
                    text: "请完善票据信息。",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    closeOnConfirm: true
                }, function () {
                    // 修改票据信息
                    //$('#modal_baofu').modal('show');
                    $('#modal_baofu').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $scope.filter = {
                        tradetype: 0,
                    }
                    // 获取全部汇票类型
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
                    //获取票据属性类型
                    constantsService.queryConstantsType(2).then(function (data) {
                        $scope.billStyleData = data;
                    })
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
                                    //document.getElementById("acceptor_name").disabled = "true";
                                    document.getElementById("acceptortype").disabled = "true";
                                    //document.getElementById("producttime").readOnly = "readonly";
                                    //document.getElementById("producttime").disabled = "true";
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
                    //constantsService.queryConstantsType(15).then(function (data) {
                    //    $scope.billFlawData2 = data;
                    //    for (var i = 0; i < $scope.billFlawData2.length; i++) {
                    //        if ($scope.billFlawData2[i].code == 1500) {
                    //            $scope.billFlawData2[i].checked = true;
                    //            break;
                    //        }
                    //    }
                    //})
                    //获取交易方式类型
                    constantsService.queryConstantsType(7).then(function (data) {
                        $scope.tradeTypeCode = data;
                    })
                    //获取全部省级地址
                    //addressService.queryAll().then(function (data) {
                    //    $scope.provinceData = data;
                    //    $scope.provinceChange();
                    //});
                    //获取各省市下面的市区
                    //$scope.provinceChange = function () {
                    //    if (!$scope.model.product_province_id) {
                    //        $scope.cityData = [];
                    //    } else if ($scope.model.product_province_id == 1 || $scope.model.product_province_id == 20 || $scope.model.product_province_id == 860 || $scope.model.product_province_id == 2462) {
                    //        $scope.filter.tradeProvinceId = $scope.model.product_province_id + 1;
                    //        return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                    //            $scope.cityData = data;
                    //        });
                    //    } else {
                    //        return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                    //            $scope.cityData = data;
                    //        });
                    //    }
                    //}
                    //在不同交易类型下，循环获取汇票瑕疵的多选结果
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
                    //$scope.billFlawChange2 = function (item) {
                    //    if (item.code == 1500) {
                    //        item.checked = true;
                    //        for (var i = 1; i < $scope.billFlawData2.length; i++) {
                    //            $scope.billFlawData2[i].checked = false;
                    //        }
                    //    }
                    //    else {
                    //        for (var i = 0; i < $scope.billFlawData2.length; i++) {
                    //            if (i == 0) {
                    //                $scope.billFlawData2[i].checked = true;
                    //            }
                    //            else {
                    //                if ($scope.billFlawData2[i].checked) {
                    //                    $scope.billFlawData2[0].checked = false;
                    //                }
                    //            }
                    //        }
                    //    }
                    //}
                    //点击汇票到期日，默认选中的时间
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
                    //上传图片后，点击图片跳转页面，放大图片
                    $scope.showFront = function () {
                        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
                    }
                    //上传图片后，点击图片跳转页面，放大图片
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
                            title: "确定要删除该文件吗?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "是",
                            cancelButtonText: "否",
                            closeOnConfirm: true
                        }, function () {
                            $scope.enclosure.splice(index, 1);
                        });
                    };

                    // 选择成交完善票据信息时限制背书次数只能输入0-100的正整数
                    $scope.checkInt = function (n, max) {
                        var regex = /^\d+$/;
                        if (regex.test(n)) {
                            if (n < max && n > 0) {
                            } else {
                                swal("这不是小于" + max + "的正整数！请重新输入！");
                                $scope.model.endorsement_number = "";
                            }
                        }
                    }

                    //提示信息
                    $scope.question = function () {
                        swal('请在预约交易时间前进行交易，过时请重新发布。');
                    }

                    $scope.revise = function () {
                        //校验，提示信息
                        if (!$scope.model.bill_type_id) {
                            swal("请选择票据类型");
                            return;
                        }

                        if (!$scope.model.trade_type_code) {
                            swal("请选择交易方式");
                            return;
                        }

                        if (!$scope.model.bill_sum_price) {
                            swal("请输入票面金额");
                            return;
                        }
                        if (!$scope.model.contact_name) {
                            swal("请输入联系人姓名");
                            return;
                        }
                        if (!$scope.model.contact_phone) {
                            swal("请输入联系方式");
                            return;
                        }

                        if ($scope.model.trade_type_code == 701) {
                            if (!$scope.model.bill_front_photo_id) {
                                swal("请上传汇票正面");
                                return;
                            }
                        } else {
                            if ($scope.model.trade_type_code == 702) {
                                if (!$scope.model.acceptor_type_id) {
                                    swal("请选择承兑机构");
                                    return;
                                }

                                if (!$scope.model.product_deadline_time) {
                                    swal("请选择失效时间");
                                    return;
                                }

                                if ($stateParams.id && $scope.model.bill_type_id == 101) {
                                    if (!$scope.model.bill_front_photo_id) {
                                        swal("请上传汇票正面");
                                        return;
                                    }
                                }
                            }

                            if (!$scope.model.acceptor_name) {
                                swal("请输入付款行全称");
                                return;
                            }
                            if (!$scope.model.bill_number) {
                                swal("请输入票据号");
                                return;
                            }
                            if (!$scope.model.endorsement_number) {
                                swal("请输入背书次数");
                                return;
                            }

                            if (!$scope.model.bill_deadline_time) {
                                swal("请输入汇票到期日");
                                return;
                            }
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
                        }
                        else {
                            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                                if ($scope.billFlawData2[i].checked) {
                                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                                }
                            }
                        }
                        swal({
                            title: "确定要完善汇票吗?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "是",
                            cancelButtonText: "否",
                            closeOnConfirm: true
                        }, function () {
                            //发布汇票信息
                            billService.updateBillHpx($scope.model.id, $scope.model).then(function (data) {
                                $('#modal_baofu').modal('hide');
                                //$('#modal-finishBidding').modal('show');
                                $('#modal-finishBidding').modal({
                                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                                    keyboard: false,//键盘关闭对话框
                                    show: true//弹出对话框
                                });
                            });

                        });
                    }
                })
            }
            else {
                //$('#modal-finishBidding').modal('show');
                $('#modal-finishBidding').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
            }
    }

    // 签合同时的日期和公司法人
    $scope.getDrawData = function () {
        var todayDate = new Date();
        $scope.filter.newYear = todayDate.getFullYear();
        $scope.filter.newMonth = todayDate.getMonth() + 1;
        $scope.filter.newToday = todayDate.getDate();
        enterpriseXingyeUserService.getLegalName($rootScope.identity.enterprise_id).then(function (data) {
            $scope.model.a_legalname = data.legalName;
        });
        enterpriseXingyeUserService.getLegalName($scope.payModel.bid_enterprise_id).then(function (data) {
            $scope.model.b_legalname = data.legalName;

        });
    }
    $scope.ruleschange = function () {
        if ($scope.AccountR == null) {
            swal('请先选择出票方提现账户！');
            return;
        }
        $scope.getDrawData();
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    //甲方签署合同
    $scope.rulechange = function () {
        if ($scope.AccountR == null) {
            swal('请先选择出票方提现账户！');
            $("#ownBillOffer").removeAttr("checked");
            return;
        }
        $scope.getDrawData();
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $("#ownBillOffer").click();

    };
    $scope.submitRule = function () {
        if (!$scope.filter.rule) {
            $scope.filter.rule = true;
        }

        payingService.econtractFirstSign($scope.model.drawer_id, $scope.filter.fromKeyWord, $scope.payModel.payId, $scope.model.account_id).then(function (data) {
            $scope.firstSign = data
            $scope.contract = $scope.firstSign.contract_num;
            payingService.getVacctNo($scope.AccountR.v_acct_no, $scope.firstSign.contract_num, $stateParams.id).then(function (data) {

            });
        });
        $scope.filter.submitRule = 1;
        $('#modal-rule').modal('hide');
    }

    //选择交易方
    $scope.finishBidding = function (item) {
        //if ($scope.filter.submitRule == 0) {
        //    swal('请先阅读并同意质押协议！');
        //    return;
        //}

        swal({
            title: "确认选择该收票人进行交易吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.isDisable = true;
            $scope.model.bill_product_id = $scope.model.id;
            $scope.model.bill_product_bidding_id = $scope.payModel.payId;
            $scope.model.is_NeedXY = 1;
            $scope.model.type = "bidding";
            $scope.model.contract_num = $scope.firstSign.contract_num;
            $scope.model.account_id = $scope.model.account_id;
            if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                billService.generateOrders($scope.model).then(function (data) {
                })
            }

            if ($scope.model.trade_type_code == 701 || ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 102)) {
                billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': $scope.payModel.payId, 'is_NeedXY': 1, 'type': 'bidding', 'contract_num': $scope.firstSign.contract_num, 'account_id': $scope.model.account_id }).then(function (data) {
                    //swal('确认交易方成功！');
                    $('#modal-finishBidding').modal('hide');
                    if ($scope.model.bill_type_id == 101) {
                        billService.getBillProduct($scope.model.id).then(function (data) {
                            $scope.filter.order_id = data.order_id;
                            orderService.updateOrderAccountDrawer($scope.filter.order_id, $scope.model.account_id).then(function () { });
                            $scope.model = data;
                            $('.jqzoom').imagezoom();

                            billService.getBillProductBidding($stateParams.id).then(function (data) {
                                $scope.biddings = data;
                            });
                        });
                        setTimeout(function () {
                            swal("确认交易方成功!");
                            $state.go("app.main.orderDrawerInfo", { id: $scope.filter.order_id });
                        }, 350);
                    } else {
                        window.location.reload();
                    }
                });
            } else if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                $('#modal-finishBidding').modal('hide');
                setTimeout(function () {
                    swal("确认交易方成功！\n审核通过后直接进入交易状态。");
                    $state.go('app.main.myBill');
                }, 350);
            }
        });
    };
    //选择收款账户
    $scope.accountChange = function () {
        payingService.getAccountR($scope.model.account_id).then(function (data) {
            angular.forEach(data.acct_list, function (ele, i) {
                $scope.AccountR = ele;
                $("#ownBillOffer").removeAttr("checked");
                $("#transactions").attr("disabled", true);
            })
        })
    }
    //展开收缩
    $scope.fileshowhide = function () {
        //$(".tg2").toggleClass("trans");
        var accordion = document.getElementById("fileaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
            $scope.filter.rote = 2;
            $timeout(function () {
                if ($rootScope.identity) {
                    $('.backjqzoom').imagezoom();
                }
            });
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 1;
        }
    }
    //展开收缩
    $scope.billshowhide = function () {
        var accordion = document.getElementById("billaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
            $scope.filter.rote = 1;
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 2;
        }
    }
    //确认成交
    $scope.submitbillnew = function () {
        swal({
            title: "是否线下已完成交易?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
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

hpxAdminApp.controller('rechargeController', function ($scope, $rootScope, $state, API_URL,XingYe_URL, ngTableParams, payingService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        choiceReCharge: 1,
    };
    //获取账户充值记录
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
    //弹出充值窗口
    $scope.recharge = function () {
        $scope.model = newEntity;
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //$scope.XYRecharge = function () {
    //    var newWin = window.open('loading page');
    //    newWin.location.href = XingYe_URL + $rootScope.identity.enterprise_id;
    //}
    //打开一个新页面，进行充值活动
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);
        $('#modal-edit').modal('hide');
    };

    $scope.choiceReCharge = function (number) {
        $scope.filter.choiceReCharge = number;
    };


});
// JavaScript source code
hpxAdminApp.controller('resourceInfoController', function ($scope, $rootScope, $state, NgTableParams, resourceService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有可管理的资源信息
    $scope.tableParams = new NgTableParams({ sorting: { 'resource_name': 'asc' } }, {
        getData: function (params) {
            return resourceService.query(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    $scope.edit = function (data) {
        if (data == null) {         //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        //$scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.id) {         //新建某一资源
            resourceService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //修改某一资源
            resourceService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //重置密码
    $scope.resetPassword = function () {
        if (confirm('确定要重置密码吗？')) {
            resourceService.resetPassword($scope.model.id).then(function (data) {
                alert("已被重置为初始密码");
            });
        }
    };
    //删除某一资源
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.username + '吗')) {
            resourceService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
})
// JavaScript source code
hpxAdminApp.controller('roleInfoController', function ($scope, $rootScope, $state, NgTableParams, roleService, userService, resourceService, cacheService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有用户信息
    userService.queryAll().then(function (data) {
        $scope.users = data;
    });
    //获取所有角色信息
    $scope.tableParams = new NgTableParams({ sorting: { 'role_name': 'asc' } }, {
        getData: function (params) {
            return roleService.query(params,$scope.filter.role_name).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取对应角色的权限详情
    $scope.power = function (item) {
        $scope.model = angular.copy(item);
        // 先获取所有的resources
        resourceService.queryAll().then(function (data) {
            $scope.allResources = data.resources
        });
        return roleService.getRoleResource(item.id).then(function (data) {
            $scope.RoleResourceData = data;
            for (var i = 0, n = $scope.RoleResourceData.length; i < n; i++) {
                if ($scope.RoleResourceData[i].can_get == 1) {
                    $scope.RoleResourceData[i].can_get_checked = true;
                }
                if ($scope.RoleResourceData[i].can_post == 1) {
                    $scope.RoleResourceData[i].can_post_checked = true;
                }
                if ($scope.RoleResourceData[i].can_put == 1) {
                    $scope.RoleResourceData[i].can_put_checked = true;
                }
                if ($scope.RoleResourceData[i].can_delete == 1) {
                    $scope.RoleResourceData[i].can_delete_checked = true;
                }
            }
            $('#modal-Resources').modal('show');
        });
    },

    $scope.Determine = function (item) {
        if (item.can_get_checked) {
            item.can_get = 1;
        } else {
            item.can_get = 0;
        }
        if (item.can_post_checked) {
            item.can_post = 1;
        } else {
            item.can_post = 0;
        }
        if (item.can_put_checked) {
            item.can_put = 1;
        } else {
            item.can_put = 0;
        }
        if (item.can_delete_checked) {
            item.can_delete = 1;
        } else {
            item.can_delete = 0;
        }
        return roleService.updateRoleResource(item).then(function (data) {
            alert("成功修改角色资源权限。");
            //$scope.tableParams.reload();
            //$('#modal-Resources').modal('hide');
        })
    }

    // 添加指定角色的权限
    $scope.addPower = function (item) {
        item['role_id'] = $scope.model['id']
        return roleService.addRoleResource(item).then(function (data) {
            $scope.power(item);

            //$scope.tableParams.reload();
            //$('#modal-Resources').modal('hide');
        })
    }

    // 删除指定角色的指定权限
    $scope.removePower = function (item) {
        return roleService.removeRoleResource(item).then(function (data) {
            $scope.RoleResourceData.pop(item);
            alert("成功删除角色资源权限。");
            //$scope.tableParams.reload();
            //$('#modal-Resources').modal('hide');
        })
    }

    //弹出拷贝角色权限窗口
    $scope.copy = function () {
        roleService.queryAll().then(function (data) {
            $scope.roleData = data;
        });
        $('#modal-copy').modal('show');
    }
    //拷贝某一角色的权限
    $scope.submit = function () {
        roleService.copyRole($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            angular.copy(emptyEntity, newEntity);
            $scope.copyForm.$setPristine();
            $('#modal-copy').modal('hide');
        });
    },

    $scope.edit = function (data) {
        if (data == null) {     //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        //$scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.id) {         //新建角色
            roleService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改角色信息
            roleService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //重置密码
    $scope.resetPassword = function () {
        if (confirm('确定要重置密码吗？')) {
            roleService.resetPassword($scope.model.id).then(function (data) {
                alert("已被重置为初始密码");
            });
        }
    };
    //删除某一角色
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.role_name + '吗')) {
            roleService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
})
hpxAdminApp.controller('selectBackgroundInformationController', function (exportService, $interval, $rootScope, $scope, $stateParams, $state, API_URL, NgTableParams, constantsService, addressService, customerService, payService) {
    console.log($scope)
    console.log($rootScope)

    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'checkedType': 0,        //默认未审核
        //billStyleAll: true,
        //acceptorTypeAll: true,
        //billCharacterAll: true,
        //billStatusAll: true,
        tradeTypeCode: '',
        billTypeID: '',
        billTys:'',
        //billStatusCode: '801',
        //billCharacterCode: ''
    };


    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    var timer = $interval($scope.reflash, 60 * 1000);
    $scope.$on(
        "$destroy",
        function (event) {
            $interval.cancel(timer);
        }
    );

    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        //$scope.filterProvinceChange();
    });
    //获取对应的省下所有的市级地址
    $scope.filterProvinceChange = function () {
        $scope.filter.locationId = null;
        if ($scope.filter.ProvinceID == null) {
            return;
        } else if ($scope.filter.ProvinceID == 1 || $scope.filter.ProvinceID == 20 || $scope.filter.ProvinceID == 860 || $scope.filter.ProvinceID == 2462) {
            $scope.filter.tradeProvinceId = $scope.filter.ProvinceID + 1;
            $scope.filter.locationId = $scope.filter.ProvinceID;
            //$scope.tableParams.reload();

            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            $scope.filter.locationId = $scope.filter.ProvinceID;
            //$scope.tableParams.reload();
            return addressService.queryCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    }

    $scope.filterCityChange = function () {
        $scope.filter.locationId = $scope.filter.CityID;
        //$scope.tableParams.reload();
    }

    // 查询
    $scope.hpxFind = function () {
        messageService.findMessage({

        }).then(function (data) {
            console.log(data)
        })
    }

    // 发送
    $scope.hpxSend = function () {
        messageService.sendMessage({
            'notification_title': $scope.model,
            'notification_type': $scope,
            'send_time': $scope,
            'news_type': $scope,
            'activity_period': $scope,
            'activity_name': $scope,
            'things': $scope,
            'ids': $scope
        }).then(function (data) {
            console.log(data)
        })
    }



    //导出表格
    $scope.exportExcel = function () {
        var resource_url = API_URL + "/customers/customerReview?n=65535&orderBy=%2Bid&p=1";
        var sheet_name = "企业审核表";
        var label_names, label_types, label_keys;
        if ($scope.filter.checkedType == 1) {
            resource_url += "&isChecked=1";
            sheet_name += "_已审核";
        } else if ($scope.filter.checkedType == 0) {
            resource_url += "&isChecked=0";
            sheet_name += "_未审核";
        }
        label_names = ["企业名称", "统一社会信用码/营业执照注册号", "联系人", "联系号码"];
        label_types = ["String", "String", "String", "String"];
        label_keys = ["enterprise_name", "credential_number", "contact_person", "contact_phone"];

        var excelRequest = {
            "resource_url": resource_url,
            "resource_name": "enterprises",
            "sheet_name": sheet_name,
            "label_names": label_names,
            "label_types": label_types,
            "label_keys": label_keys
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export', token, excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }

});

hpxAdminApp.controller('shareBillController', function ($rootScope, $scope, $state, $stateParams, $filter, $timeout, billService) {

    //根据id获取对应的票据详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;

            if (!$scope.model.remaining_day) {
                $scope.model.remaining_day = 0;
            }

        });
        //$timeout(function () {
        //    if ($rootScope.identity) {
        //        $scope.filter.isidentity = 1;
        //        $('.jqzoom').imagezoom();
        //    };
        //    if ($rootScope.identity) {
        //        $scope.filter.isidentity = 1;
        //        $('.backjqzoom').imagezoom();
        //    }
        //}, 500);
    }

    !function (t) { "use strict"; !function () { t(document).on("click", ".js_details", function (e) { e.preventDefault(), t(".alert-details").fadeIn(300) }), t(document).on("click", ".alert-details", function (e) { e.preventDefault(), t(this).fadeOut("300") }) }() }(jQuery);

});
hpxAdminApp.controller('shareController', function ($rootScope, $scope, $state, $stateParams) {

});
hpxAdminApp.controller('shareOfferController', function ($rootScope, $scope, $state, $stateParams, billService) {
    //根据id获取报价详细信息
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
    !function (t) { "use strict"; !function () { t(document).on("click", ".js_details", function (e) { e.preventDefault(), t(".alert-details").fadeIn(300) }), t(document).on("click", ".alert-details", function (e) { e.preventDefault(), t(this).fadeOut("300") }) }() }(jQuery);
});
hpxAdminApp.controller('sidebarController', function ($scope, $rootScope, $state, $location,userService) {
    $scope.$emit('refreshMenu');

    $scope.menuClick = function (id) {
        var target = $('#' + id);
        var otherMenu = '.sidebar .nav > li.has-sub > .sub-menu';
        if ($('.page-sidebar-minified').length === 0) {
            $(otherMenu).not(target).slideUp(250, function () {
                $(this).closest('li').removeClass('expand');
            });
            $(target).slideToggle(250, function () {
                var targetLi = $(this).closest('li');
                if ($(targetLi).hasClass('expand')) {
                    $(targetLi).removeClass('expand');
                } else {
                    $(targetLi).addClass('expand');
                }
            });
        }
    }

    $state.includes = function(name){
        var parentMenu = $("#"+name);

        if(parentMenu.attr("is-parent")) {
            var url = $location.url();
            if(parentMenu.hasClass('active')){
                parentMenu.removeClass('active');
            }
            parentMenu.find('ul>li>a').each(function(){
                var sref = $(this).attr("href");
                var curUrl = sref.replace("#","");
                if(curUrl === url){
                    $("#"+name).addClass('active');
                    $(this).parent().addClass('active');
                    return false;
                }
            });
        }
    }

    $scope.subMenuClick = function (id) {
        if ($('.page-sidebar-minified').length === 0) {
            var target = $('#' + id);
            $(target).slideToggle(250);
        }
    }

    App.initSidebar();
});

hpxAdminApp.controller('signupController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService, $cookieStore, Restangular) {
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.filter = {
        choicePhone:0,
    }
    //获取客户的类型
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeCcode = data;
    })
    //获取交易方式的类型
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCcode = data;
    })

    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number ||!/^1\d{10}$/.test($scope.model.phone_number)) {
            swal('请输入正确的手机号码！');
            return;
        }

        customerService.phoneVerify($scope.model.phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };

    $scope.PhoneChange = function () {
        if ($scope.model.phone_number) {
            // $scope.model.phone_number.length == 11 &&
            customerService.testPhoneNumber($scope.model.phone_number).then(function (data) {
                if (!data) {
                    $scope.filter.choicePhone = 1;
                }
                else {
                    $scope.filter.choicePhone = 2;
                }
            });
        }
        else if ($scope.model.phone_number && /^1\d{10}$/.test($scope.model.phone_number)) {
            $scope.filter.choicePhone = 3;
        }
    }

    $scope.signup = function () {
        if (!$scope.model.phone_number || !/^1\d{10}$/.test($scope.model.phone_number)) {
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
            swal('请输入验证码！');
            return;
        }
        //注册功能
        customerService.customerReg($scope.model).then(function (data) {
            swal("注册成功!请完善联系人信息。");
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
                //$state.go('app.main.customerInfo');      //注册成功之后的页面提示
                swal({
                    title: "注册成功",
                    text:"是否进入新注册流程进行实名认证",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    closeOnConfirm: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        $state.go('app.main.autonymAuthentication');
                    } else {
                        $state.go('app.main.customerInfo');
                    }
                });
            });
        });
    }
});

hpxAdminApp.controller('stopOrderController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        func: 'stopped',
        isStop:'1',
        'deadlineTime1':'',
        'deadlineTime2':''
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click",function(ev){
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.deadlineTime1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.deadlineTime2 = $("#end_time").val();
    });

    //获取所有正在进行中的订单
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return orderService.getAllAliveOrders(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        if($scope.filter.isStop == 0){
            $scope.filter.func = 'stop';
        }else{
            $scope.filter.func = 'stopped';
        }

        $scope.tableParams.reload();
    }

    $scope.check = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();
    };

    $scope.save = function (data) {
        $scope.model = angular.copy(data);       //弹出终止窗口
        $scope.model.description = null;
        $('#modal-read').modal('show');
    };

    $scope.stopOrder = function () {
        //终止订单
        if (confirm('确认终止此订单吗？')) {
            console.log("asdasdasd");
            orderService.stopOrder($scope.model).then(function (data) {
                console.log(data)
                $scope.tableParams.reload();
                $('#modal-read').modal('hide');
                if (data.order_status_id >= 806 && data.order_status_id < 810 ) {
                    console.log("终止订单时的订单id=" + data.id)
                    payService.applyRefund(data.id).then(function (data) {
                        console.log(data)
                    })
                }
                //payService.applyRefund().then(function () {
                //    console.log(data)
                //})
            });
        }
    };

});
// JavaScript source code
hpxAdminApp.controller('userInfoController', function ($scope, $rootScope, $state, NgTableParams, userService, roleService) {

    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    $scope.filter = {};
    //获取所有角色信息
    roleService.queryAll().then(function (data) {
        $scope.roles = data;
    });
    //$scope.roleChange = function () {
    //    if ($scope.model.id == null)
    //        $scope.roles = [];
    //};
    $scope.$on('refreshMenu', function (event) {
        userService.queryUserMenu().then(function (data) {
            $rootScope.menus = data;
        });
    });
    //获取所有用户信息
    $scope.tableParams = new NgTableParams({ sorting: { 'username': 'asc' } }, {
        getData: function (params) {
            return userService.query(params, $scope.filter.username, $scope.filter.role_name, $scope.filter.isValid, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    $scope.edit = function (data) {
        if (data == null) {     //弹出新建窗口
            $scope.model = newEntity;
        }
        else {      //弹出修改窗口
            $scope.model = angular.copy(data);
        }
       // $scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id==null) {        //新建用户
            userService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //修改用户信息
            userService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //重置密码
    $scope.resetPassword = function () {
        if (confirm('确定要重置密码吗？')) {
            userService.resetPassword($scope.model.id).then(function (data) {
                alert("已被重置为初始密码");
            });
        }
    };
    //删除某用户信息
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.username + '吗')) {
            userService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

});
hpxAdminApp.controller('weixinPortalController', function ($scope, $rootScope, $state, $stateParams, $window, API_URL, NgTableParams, portalInformationService, portalInformationTypeService) {
    //portalInformationTypeService.get($stateParams.type).then(function (data) {
    //    $scope.typeName = data.information_type_name;
    //})

    var emptyEntity = {
        //information_type_id: $stateParams.type
    };
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {

            return portalInformationService.query(params, $scope.filter.keyword, 5).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //portalInformationTypeService.queryByInformationTypeID($scope.filter.information_type_id).then(function (data) {
    //    $scope.informationTypes = data;
    //});
    //init = function () {
    //    portalInformationService.getPortals(5).then(function (data) {
    //        return data;
    //    });
    //}
    //init();

    //$scope.tableParams = new NgTableParams({}, {
    //    getData: function (params) {

    //        return portalInformationService.getPortals(params, $scope.filter.informationTypeId).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});


    function IsURL(str_url) {
        var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
        + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
        + '|' // 允许IP和DOMAIN（域名）
        + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
        + '[a-z]{2,6})' // first level domain- .com or .museum
        + '(:[0-9]{1,4})?' // 端口- :80
        + '((/?)|' // a slash isn't required if there is no file name
        + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        var re = new RegExp(strRegex);
        //re.test()
        if (re.test(str_url)) {
            return (true);
        } else {
            return (false);
        }
    }


    $scope.edit = function (item) {
        portalInformationService.get(item.id).then(function (data) {
            $scope.model = data;
        });
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!IsURL(model.detail)) {
            alert("您输入的链接不合法。请重新输入。");
        }else{
            portalInformationService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    //$scope.remove = function () {
    //    if (confirm('确认放弃吗？')) {
    //        init();
    //    }
    //}

});