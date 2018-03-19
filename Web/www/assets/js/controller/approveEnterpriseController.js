hpxAdminApp.controller('approveEnterpriseController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
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
        if (!$scope.enterpriseModel.credential_photo_address) {
            $scope.enterpriseModel.credential_photo_address = 'assets/img/hpx-14.png';
        }
        if (!$scope.enterpriseModel.artificial_person_front_photo_address) {
            $scope.enterpriseModel.artificial_person_front_photo_address = 'assets/img/hpx-15.png';
        }
        if (!$scope.enterpriseModel.artificial_person_back_photo_address) {
            $scope.enterpriseModel.artificial_person_back_photo_address = 'assets/img/hpx-16.png';
        }
        // 通过SingleEnterprise接口查询客户信息
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;

                if ($scope.singleEnterprise.enterprise_id == "" || $scope.singleEnterprise.enterprise_id == 0) {
                    $scope.enterpriseModel = {};
                } else {
                    $scope.provinceChange();
                    if ($scope.enterpriseModel.location_province_id != 1 || $scope.enterpriseModel.location_province_id != 20 || $scope.enterpriseModel.location_province_id != 860 || $scope.enterpriseModel.location_province_id != 2462) {
                        $scope.CityChange();
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
    $scope.provinceChange = function () {
        if ($scope.enterpriseModel.location_province_id == null) {
            return;
        } else if ($scope.enterpriseModel.location_province_id == 1 || $scope.enterpriseModel.location_province_id == 20 || $scope.enterpriseModel.location_province_id == 860 || $scope.enterpriseModel.location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.enterpriseModel.location_province_id + 1;
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
            return addressService.queryCity($scope.enterpriseModel.location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取对应市的区
    $scope.CityChange = function () {
        if ($scope.enterpriseModel.location_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.enterpriseModel.location_city_id).then(function (data) {
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
        if (!$scope.enterpriseModel.enterprise_name) {
            swal("请输入企业名称！");
            return;
        }
        if (!$scope.enterpriseModel.credential_number) {
            swal("请输入营业执照号！");
            return;
        }
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