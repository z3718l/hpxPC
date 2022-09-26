hpxAdminApp.controller('electronicAccountController', function ($scope, $rootScope, $state, ngTableParams, API_URL,XingYe_URL, payingService, customerService, bankService, addressService, constantsService) {
    $scope.filter = {
        is_vis: false             //新增按钮的显示隐藏
    };
    //if ($rootScope.identity.enterprise_id == -1 && $rootScope.identity.is_operator == 1) {
    //    swal('您已经被其他企业绑定为操作员,请重新登陆生效!')
    //}
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
        //$scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
        //    getData: function (params) {
        //        return customerService.getEnterpriseMember().then(function (data) {
        //            $scope.enterpriseMembers = data;
        //        });
        //    }
        //});
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
    //$scope.addOperater = function (data) {
    //    $scope.operatorModel = {}
    //    if (data != null) {
    //        $scope.operatorModel.id = 0;
    //        $scope.operatorModel.remove_phone_number = data.phone_number;
    //        $scope.operatorModel.operator_phone_number = $rootScope.identity.phone_number;
    //        $scope.is_remove = true;
    //    } else {
    //        $scope.is_remove = false;
    //    }
    //    //$('#modal-add').modal('show');  // 显示增加操作员的弹出窗口
    //    $('#modal-add').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    });
    //};
    // 提交
    //$scope.submitOperater = function () {
    //    if ($scope.is_remove) {
    //        return $scope.removeOperater($scope.operatorModel);
    //    }
    //    if ($scope.operatorModel.operator_phone_number_code.length == 6) {
    //        customerService.insertEnterpriseMember($scope.operatorModel).then(function (data) {
    //            $scope.tableParams.reload();
    //            //angular.copy(emptyEntity, newEntity);
    //            $('#modal-add').modal('hide');
    //        });
    //    } else {
    //        swal('请输入正确的验证码！');
    //    }
    //    $scope.second = 0;
    //};
    // 删除操作员
    //$scope.removeOperater = function (data) {
    //    //console.log(data)
    //    swal({
    //        title: "确定要删除该操作员吗?",
    //        type: "warning",
    //        showCancelButton: true,
    //        confirmButtonText: "是",
    //        cancelButtonText: "否",
    //        closeOnConfirm: true
    //    }, function () {
    //        customerService.deleteEnterpriseMember(data).then(function (data) {
    //            $scope.tableParams.reload();
    //            $('#modal-add').modal('hide');
    //        });
    //    });
    //};

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