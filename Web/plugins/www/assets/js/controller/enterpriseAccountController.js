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
    //获取所有的银行账户信息，并显示是否为默认银行账户
    $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getAllEnterpriseAccount().then(function (data) {
                $scope.first = $scope.getFirst(params);
                $scope.AccountData = data;
                for (var i = 0; i < $scope.AccountData.length; i++) {
                    if ($scope.AccountData[i].is_default == 1) {
                        $scope.AccountData[i].is_default = "是";
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
    //设置为默认账户
    $scope.default = function (item) {
        customerService.updateEnterpriseDefault(item).then(function (data) {
            $scope.tableParams.reload();
        });
    }
    //读取对应银行账户的详细信息
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
            $('#modal-add').modal('show');  // 显示增加银行账号的弹出窗口
        }
    };

    $scope.submit = function () {
        if (!$scope.model.account_person) {
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
    //根据总行，所在市，关键字找到对应的分行数据
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
            swal('验证成功！');
            $scope.tableParams.reload();
            $('#modal-verify').modal('hide');
        });
    };
    //选择
    $scope.choiceBill = function (choose) {
        $scope.filter.choiceBill = choose;
        $scope.tableParams.reload();
    };
    //充值宝付
    $scope.recharge = function (enterprise_id) {
        $scope.baofu_model = {
            'enterprise_id': enterprise_id,
            'operate': '充值',
        }
        $('#modal-baofu').modal('show');
    }
    //充值提现
    $scope.withdraw = function (enterprise_id) {
        $scope.baofu_model = {
            'enterprise_id': enterprise_id,
            'operate': '提现',
        }
        $('#modal-baofu').modal('show');
    }
    //提交宝付充值或者提现
    $scope.baofuSubmit = function () {
        if ($scope.baofu_model.money && $scope.baofu_model.money <= 0) {
            swal("请输入大于0的金额!");
            return;
        }
        var target_url = API_URL + '/paying/bfapi/recharge';
        if ($scope.baofu_model.operate == "充值") {
            target_url = target_url + '?enterpriseId=' + $scope.baofu_model['enterprise_id'] + '&money=' + $scope.baofu_model['money'];
        } else {
            target_url = target_url + '?token=' + $rootScope.identity['token'] + '&money=' + $scope.baofu_model['money'];
        }
        var newWindow = window.open("_blank");
        newWindow.location = target_url;
    }
});