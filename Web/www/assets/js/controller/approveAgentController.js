hpxAdminApp.controller('approveAgentController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
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
        if (!$scope.agentModel.agent_treasurer_name) {
            swal({
                'title': '请填写经办人姓名！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal({
                'title': '请填写经办人手机号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.model.id_number) {
            swal({
                'title': '请完善联系人身份证号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal({
                'title': '身份证信息有误，请核实信息！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal({
                'title': '请填写经办人身份证号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
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
        if (!$scope.agentModel.agent_treasurer_name) {
            swal({
                'title': '请填写经办人姓名！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal({
                'title': '请填写经办人手机号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal({
                'title': '请填写经办人身份证号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal({
                'title': '身份证信息有误，请核实信息！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
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