hpxAdminApp.controller('customerController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {

    $scope.filter = {
        isModified : 0,
    };
    //默认客户类型为企业客户
    $scope.model = {
        customer_type_code: 301
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
            swal('请输入联系人！');
            return;
        }

        swal({
            title: "是否确认提交?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            if ($scope.model.telephone_code && $scope.model.telephone_number_number)
                $scope.model.telephone_number = $scope.model.telephone_code + '-' + $scope.model.telephone_number_number;
            customerService.updateCustomer($scope.model).then(function (data) {
                swal({ 'title': '提交成功，请继续完善企业信息！' }, function () {
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