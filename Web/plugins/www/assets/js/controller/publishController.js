hpxAdminApp.controller('publishController', function ($rootScope, $scope, $timeout, $stateParams, $state, FILE_URL, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    $scope.model = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
        'endorsement_number': 1,
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        bill_type_id: 101,
        trade_type_code: 701,
    };
    $scope.filter = {
        tradetype: 0,
    }
    //获取全部汇票类型
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类型
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取客户信息中的省市地址信息
    //if (!$stateParams.id) {
    //    customerService.getCustomer().then(function (data) {
    //        $scope.model.product_province_id = data.enterprise_province_id;
    //        addressService.queryCity($scope.model.product_province_id).then(function (data) {
    //            $scope.cityData = data;
    //        });
    //        $scope.model.product_location_id = data.enterprise_city_id;
    //    });
    //}

    //获取客户信息中的省市地址信息
    init = function () {
        customerService.getCustomer().then(function (AddData) {
            if (!AddData.trade_location_province_id) {
                $scope.cityData = [];
            } else if (AddData.trade_location_province_id == 1 || AddData.trade_location_province_id == 20 || AddData.trade_location_province_id == 860 || AddData.trade_location_province_id == 2462) {
                //$scope.model.product_province_id = AddData.trade_location_province_id;
                $scope.filter.tradeProvinceId = AddData.trade_location_province_id + 1;
                $scope.model.product_province_id = AddData.trade_location_province_id;
                return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                    $scope.cityData = data;
                    $scope.model.product_location_id = AddData.trade_location_id;
                });
            } else {
                $scope.model.product_province_id = AddData.trade_location_province_id;
                return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                    $scope.cityData = data;
                    $scope.model.product_location_id = AddData.trade_location_city_id;
                });
            }
            //if (data.trade_location_province_id && data.trade_location_city_id) {
            //    $scope.model.product_province_id = data.trade_location_province_id;
            //    //addressService.queryAll().then(function (data) {
            //    //    console.log(data);
            //    //});
            //    addressService.queryCity(data.trade_location_province_id).then(function (data) {
            //        $scope.cityData = data;
            //    });
            //    $scope.model.product_location_id = data.trade_location_city_id;
            //}
        });
    };
    init();

    //获取我的发布详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            $scope.model.drawer_account_id = $stateParams.accountId;

            if ($scope.model.trade_type_code == 701) {
                if ($scope.model.bill_type_id == 101) {
                    for (var i = 0; i < $scope.billFlawData.length; i++) {
                        $scope.billFlawData[i].checked = false;
                    }
                    for (var i = 0; i < $scope.model.bill_flaw_ids.length; i++) {
                        for (var j = 0; j < $scope.billFlawData.length; j++) {
                            if ($scope.model.bill_flaw_ids[i] == $scope.billFlawData[j].code) {
                                $scope.billFlawData[j].checked = true;
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < $scope.billFlawData2.length; i++) {
                        $scope.billFlawData2[i].checked = false;
                    }
                    for (var i = 0; i < $scope.model.bill_flaw_ids.length; i++) {
                        for (var j = 0; j < $scope.billFlawData2.length; j++) {
                            if ($scope.model.bill_flaw_ids[i] == $scope.billFlawData2[j].code) {
                                $scope.billFlawData2[j].checked = true;
                            }
                        }
                    }
                }
            }
            $timeout(function () {
                if (!$scope.model.bill_front_photo_path) {
                    $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
                }
                if (!$scope.model.bill_back_photo_path) {
                    $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
                }
                if ($stateParams.id && $scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                    $scope.filter.tradetype = 1;
                    document.getElementById("price").readOnly = "readonly";
                    document.getElementById("acceptortype").disabled = "true";
                    document.getElementById("producttime").readOnly = "readonly";
                    document.getElementById("producttime").disabled = "true";
                    document.getElementById("billrate").readOnly = "readonly";
                    document.getElementById("billdealprice").readOnly = "readonly";
                }
            });
            $timeout(function () {
                if ($scope.model.bill_front_photo_path && $scope.model.bill_front_photo_path != 'assets/img/hpx-14.jpg') {
                    $('.jqzoom_front').imagezoom();
                }
                if ($scope.model.bill_back_photo_path && $scope.model.bill_back_photo_path != 'assets/img/hpx-15.jpg') {
                    $('.jqzoom_back').imagezoom();
                }
            }, 500);
        });
    }

    //获取电票瑕疵类型
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
        for (var i = 0; i < $scope.billFlawData.length; i++) {
            if ($scope.billFlawData[i].code == 1500) {
                $scope.billFlawData[i].checked = true;
                break;
            }
        }
    })
    //获取纸票瑕疵类型
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
        for (var i = 0; i < $scope.billFlawData2.length; i++) {
            if ($scope.billFlawData2[i].code == 1500) {
                $scope.billFlawData2[i].checked = true;
                break;
            }
        }
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取全部省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取各省市下面的市区
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        } else if ($scope.model.product_province_id == 1 || $scope.model.product_province_id == 20 || $scope.model.product_province_id == 860 || $scope.model.product_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.product_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
        //else {
        //    return addressService.queryCity($scope.model.product_province_id).then(function (data) {
        //        $scope.cityData = data;
        //    });
        //}
    }
    //在不同交易类型下，循环获取汇票瑕疵的多选结果
    $scope.tradeTypeChange = function (id) {
        $scope.model.trade_type_code = id;

        if ($scope.model.trade_type_code == 701) {
            if ($scope.model.bill_type_id == 101) {
                for (var i = 0; i < $scope.billFlawData.length; i++) {
                    if ($scope.billFlawData[i].code == 1500) {
                        $scope.billFlawData[i].checked = true;
                    }
                }
            }
            else {
                for (var i = 0; i < $scope.billFlawData2.length; i++) {
                    if ($scope.billFlawData2[i].code == 1500) {
                        $scope.billFlawData2[i].checked = true;
                    }
                }
            }
        }
    }
    //电票，当选中无瑕疵时，其他选项均为false；反之，选中其他选项时，无瑕疵选项为false
    $scope.billFlawChange = function (item) {
        if (item.code == 1500) {
            item.checked = true;
            for (var i = 1; i < $scope.billFlawData.length; i++) {
                $scope.billFlawData[i].checked = false;
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if (i == 0) {
                    $scope.billFlawData[i].checked = true;
                }
                else {
                    if ($scope.billFlawData[i].checked) {
                        $scope.billFlawData[0].checked = false;
                    }
                }
            }
        }
    }
    //纸票，当选中无瑕疵时，其他选项均为false；反之，选中其他选项时，无瑕疵选项为false
    $scope.billFlawChange2 = function (item) {
        if (item.code == 1500) {
            item.checked = true;
            for (var i = 1; i < $scope.billFlawData2.length; i++) {
                $scope.billFlawData2[i].checked = false;
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if (i == 0) {
                    $scope.billFlawData2[i].checked = true;
                }
                else {
                    if ($scope.billFlawData2[i].checked) {
                        $scope.billFlawData2[0].checked = false;
                    }
                }
            }
        }
    }
    //点击汇票到期日，默认选中的时间
    $scope.billTypeChange = function (id) {
        $scope.model.bill_type_id = id;

        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
    //图片上传功能
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
    //汇票正面图片放大功能
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
            $('.jqzoom_front').imagezoom();
        })
    };
    //汇票背面图片放大功能
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
            $('.jqzoom_back').imagezoom();
        })
    };
    //汇票正面图片移除功能
    $scope.removeFront = function () {
        $scope.model.bill_front_photo_id = null;
        $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        $('.jqzoom_front').unbind("mouseenter");
        $('.jqzoom_front').css('cursor', '');
    }
    //汇票背面图片移除功能
    $scope.removeBack = function () {
        $scope.model.bill_back_photo_id = null;
        $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        $('.jqzoom_back').unbind("mouseenter");
        $('.jqzoom_back').css('cursor', '');
    }
    //上传图片后，点击图片跳转页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    //上传图片后，点击图片跳转页面，放大图片
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }

    $scope.enclosure = [];
    $scope.model.bill_back_files = [];
    //增加附件
    $scope.add = function (response) {
        $timeout(function () {
            $scope.enclosure.push({
                'file_id': response.data.data.id,
                'file_path': response.data.data.file_path,
                'file_name': response.data.data.file_name
            });
            $scope.model.bill_back_files = $scope.enclosure;
        })

    }
    //删除附件
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

    //提示信息
    $scope.question = function () {
        swal('请在预约交易时间前进行交易，过时请重新发布。');
    }

    $scope.save = function () {
        //校验，提示信息
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
        } else {
            if($scope.model.trade_type_code == 702){
                if (!$scope.model.acceptor_type_id) {
                    swal("请选择承兑机构");
                    return;
                }

                if(!$scope.model.product_deadline_time){
                    swal("请选择失效时间");
                    return;
                }

                if ($stateParams.id && $scope.model.bill_type_id == 101) {
                    if (!$scope.model.bill_front_photo_id) {
                        swal("请上传汇票正面");
                        return;
                    }
                }
            }
            
            //if (!$scope.model.acceptor_name) {
            //    swal("请输入付款行全称");
            //    return;
            //}

            //if (!$scope.model.bill_deadline_time) {
            //    swal("请输入汇票到期日");
            //    return;
            //}

            //if (!$scope.model.contact_name) {
            //    swal("请输入联系人");
            //    return;
            //}

            //if (!$scope.model.contact_phone) {
            //    swal("请输入联系方式");
            //    return;
            //}
        }

        $scope.model.bill_flaw_ids = [];
        $scope.model.bill_type_id = parseInt($scope.model.bill_type_id);
        $scope.model.trade_type_code = parseInt($scope.model.trade_type_code);

        if ($scope.model.bill_type_id == 101) {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
            //if ($scope.model.bill_flaw_ids==null) {
            //    $scope.model.bill_flaw_ids.push(1599);
            //}
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
            //if ($scope.model.bill_flaw_ids==null) {
            //    $scope.model.bill_flaw_ids.push(1599);
            //}
        }
        swal({
            title: "确定要发布汇票吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            if (!$scope.model.id) {
                //发布汇票信息
                billService.insertBillProduct($scope.model).then(function (data) {
                    swal('发布成功！\n请等待后台审核（30分钟内完成）。');
                    //\n发布后请在48小时之内确认交易，平台系统默认将在48小时之后关闭竞价，关闭之后可在“交易关闭”选项中查询或重新发布。
                    $state.go("app.main.myBill");
                });
            } else {
                //修改汇票信息
                if ($scope.model.id && $stateParams.bidId && $scope.model.trade_type_code == 702) {
                    $scope.model.bill_product_id = $scope.model.id;
                    $scope.model.bill_product_bidding_id = parseInt($stateParams.bidId);
                    billService.newOrderBidding($scope.model).then(function (data) {
                        swal('发布成功！\n请等待后台审核（30分钟内完成）。');
                        $state.go("app.main.myBill");
                    });
                } else {
                    billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
                        swal('修改成功！\n请等待后台审核（30分钟内完成）。');
                        $state.go("app.main.myBill");
                    });
                }
            }
        });
    }
});
