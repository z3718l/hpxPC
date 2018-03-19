hpxAdminApp.controller('myBillController', function ($rootScope, $scope, $state, FILE_URL, ngTableParams, $timeout, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    $scope.filter = {};
   
    //$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    //    getData: function (params) {
    //        return billService.getOwnBillProduct(params, 1).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});
    //获取我的票据的出价信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillProduct(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //$scope.show = function (data) {
    //    $scope.model = angular.copy(data);
    //};
    //获取对应的票据的出价信息，弹出窗口
    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });
        $('#modal-bidding').modal('show');
    };
    //选择交易方，隐藏弹窗
    $scope.finishBidding = function (item) {
        if (confirm('确认选择该收票人进行交易吗？')) {
            billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
                alert('确认交易方成功！');

                $scope.tableParams.reload();
                $('#modal-bidding').modal('hide');
            });
        }
    };
    //删除某条发布
    $scope.remove = function (data) {
        if (confirm('确定要删除该发布吗？')) {
            billService.deleteBill(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    }
    //获取所有的常量类型
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型信息
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类型
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取电票瑕疵类型
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
    })
    //获取纸票瑕疵类型
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
    });
    //获取对应省的市级地址
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
    //默认汇票到期日
    $scope.billTypeChange = function () {
        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
    //文件上传
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
    //设置传递给后台的图片数据为上传的图片信息
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

    //$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    //    getData: function (params) {
    //        return billService.getOwnBillProduct(params, 0).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});
    //编辑信息；获取对应省的市区数据；设置默认显示的图片信息；弹出窗口
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $scope.provinceChange();

        if (!$scope.model.bill_front_photo_path) {
            $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.bill_back_photo_path) {
            $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        }

        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.bill_type_id) {
            alert("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            alert("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            alert("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                alert("请上传汇票正面");
                return;
            }
        }
        else {
            if (!$scope.model.acceptor_type_id) {
                alert("请选择承兑机构");
                return;
            }

            if (!$scope.model.acceptor_name) {
                alert("请输入承兑人名称");
                return;
            }

            if (!$scope.model.bill_deadline_time) {
                alert("请输入汇票到期日");
                return;
            }

            if (!$scope.model.contact_name) {
                alert("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                alert("请输入联系方式");
                return;
            }
        }
        
        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {     //获取所有勾选的电票的瑕疵
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {     //获取所有勾选的纸票的瑕疵
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        //修改对应的我的发布，刷新列表，隐藏弹窗
        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    }
});
