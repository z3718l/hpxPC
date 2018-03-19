hpxAdminApp.controller('customerController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {

    $scope.filter = {
    };
    //默认客户类型为企业客户
    $scope.model = {
        customer_type_code: 301
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.provinceChange();
        $scope.cityChange();
        if (!$scope.model.credential_front_photo_path) {
            $scope.model.credential_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.credential_back_photo_path) {
            $scope.model.credential_back_photo_path = 'assets/img/hpx-15.jpg';
        }
    });
    //获取客户类型
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeData = data;
    })
    //获取交易类型
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCode = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.provinceChange = function () {
        if ($scope.model.enterprise_province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.enterprise_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    //获取对应市的区
    $scope.cityChange = function () {
        if ($scope.model.enterprise_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.enterprise_city_id).then(function (data) {
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
        if (!$scope.model.enterprise_name) {
            alert('请输入企业名称！');
            return;
        }

        if (!$scope.model.customer_name) {
            alert('请输入联系人！');
            return;
        }

        if (!$scope.model.credential_front_photo_id) {
            alert('请上传营业执照！');
            return;
        }

        if (confirm("更新客户资料后需经过管理员审核才能开通交易，是否确认提交？")) {
            $scope.model.credential_description = '营业执照';
            customerService.updateCustomer($scope.model).then(function (data) {
                alert('提交成功，请等待管理员审核！');
                window.location.reload();
            });
        }
    };
    //审核通过的信息，点击修改，更改为未审核状态，重新进行客户信息的编辑
    $scope.submit = function () {
        if (confirm("已审核客户修改信息将导致重新审核！是否确认修改？")) {
            $scope.model.credential_description = '营业执照';
            customerService.updateCustomer($scope.model).then(function (data) {
                window.location.reload();
            });
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
            alert('有文件不符合要求，无法上传！');
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
                    alert('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //设置证件照片为上传的文件
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.credential_front_photo_id = response.data.data.id;
            $scope.model.credential_front_photo_path = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.credential_back_photo_id = response.data.data.id;
            $scope.model.credential_back_photo_path = response.data.data.file_path;
        })
    };
});