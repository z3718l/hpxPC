hpxAdminApp.controller('operaterController', function ($scope, $rootScope, $state, ngTableParams, API_URL, XingYe_URL, payingService, customerService, bankService, addressService, constantsService) {
    if ($rootScope.identity.enterprise_id == -1 && $rootScope.identity.is_operator == 1) {
        swal('您已经被其他企业绑定为操作员,请重新登陆生效!')
    }
    //customerService.getAllEnterprise().then(function (data) {
    //    $scope.model = data;
    //})
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
    }
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



});