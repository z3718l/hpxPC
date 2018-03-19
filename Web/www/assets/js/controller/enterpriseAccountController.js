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
                swal("您没有兴业银行卡，请绑定兴业银行卡！！！")
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
        //            swal("您没有兴业银行卡，请绑定兴业银行卡！！！")
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