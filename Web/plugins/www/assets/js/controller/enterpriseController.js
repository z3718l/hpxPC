hpxAdminApp.controller('enterpriseController', function ($scope, $rootScope, $interval, $timeout, $state, Upload, FILE_URL, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {
    var emptyEntity = { };
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.model2 = {
        'credential_photos': 'assets/img/hpx-14.jpg',
        //'credential_photos': 'assets/img/hpx-15.jpg',
    };
    if ($rootScope.identity.enterprise_id == -1 && $rootScope.identity.is_operator == 1) {
        swal('您已经被其他企业绑定为操作员,请重新登陆生效!')
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
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.getAllEnterprise().then(function (data) {
                if (data.is_verified != 0) {
                    // 判断服务器是否被改为待更改状态
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
                    // 注销重新登陆
                    swal("保存成功，请重新登陆生效！");
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