hpxAdminApp.controller('myBillFailController', function ($rootScope, $scope, $state, FILE_URL, ngTableParams, $timeout, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
    })
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
    });
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        }
        else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    $scope.billTypeChange = function () {
        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
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
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
        })
    };

    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillProduct(params, 0).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $scope.provinceChange();

        if(!$scope.model.bill_front_photo_path) {
            $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.bill_back_photo_path) {
            $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        }

        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };

    $scope.save = function () {
        if (!$scope.model.bill_type_id) {
            swal("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            swal("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            swal("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                swal("请上传汇票正面");
                return;
            }
        }
        else {
            if (!$scope.model.acceptor_type_id) {
                swal("请选择承兑机构");
                return;
            }

            if (!$scope.model.acceptor_name) {
                swal("请输入承兑人名称");
                return;
            }

            if (!$scope.model.bill_deadline_time) {
                swal("请输入汇票到期日");
                return;
            }

            if (!$scope.model.contact_name) {
                swal("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                swal("请输入联系方式");
                return;
            }
        }

        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }

        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    }
});
