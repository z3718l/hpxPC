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