ionicApp.controller('myReleaseElecAllController', function ($rootScope, $scope, $state, $filter, $ionicPopup,billService, addressService, customerService, constantsService, bankService, fileService, orderService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        choiceorder: 0,
        isTrade: 0,
        status: null,
        isAlive: null,
        billStatusCode: null,
    };
    $scope.billsNumber = function () {
        billService.getBillsNumber($scope.filter.choiceBillType).then(function (data) {
            $scope.numberModel = data;
         })
    }
    $scope.billsNumber();
   


    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create('-publishing_time',10);
        $scope.listData = [];
        $scope.loadMore();
    };

    $scope.loadMore = function (first) {
            if ($scope.filter.status >= 809 && $scope.filter.choiceBillType == 101) {
                return orderService.getOwnOrder($scope.params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                   
                    if ((($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) && $scope.filter.choiceBillType == 101) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill_deadline_time)
                                data[j].remaining_day = null;
                        };
                    }
                    for (var j = 0; j < data.length; j++) {
                        data[j].publishing_time = $filter('date')(data[j].publishing_time, 'yyyy-MM-dd');
                        data[j].bill_deadline_time = $filter('date')(data[j].bill_deadline_time, 'yyyy-MM-dd');
                    };
                    $scope.hasMore = data.length == 10;
                    $scope.listData = first ? data : $scope.listData.concat(data);
                    $scope.$broadcast('scroll.infiniteScrollComplete')
                    $scope.params.next();
                });
                
            } else {
                return billService.getOwnBillProduct($scope.params, $scope.filter.choiceBillType, $scope.filter.isAlive, $scope.filter.billStatusCode).then(function (data) {
                  
                    if ((($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) && $scope.filter.choiceBillType == 101) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill_deadline_time)
                                data[j].remaining_day = null;
                        };
                    }
                    for (var j = 0; j < data.length; j++) {
                       data[j].publishing_time = $filter('date')(data[j].publishing_time, 'yyyy-MM-dd');
                       data[j].bill_deadline_time = $filter('date')(data[j].bill_deadline_time, 'yyyy-MM-dd');
                    };
                    $scope.hasMore = data.length == 10;
                    $scope.listData = first ? data : $scope.listData.concat(data);
                    $scope.$broadcast('scroll.infiniteScrollComplete')
                    $scope.params.next();
                });
                
            }
            
        
    };
   $scope.$on('$stateChangeSuccess', $scope.doRefresh);
   // $scope.doRefresh();
    //选择电票
    $scope.choiceEBillType = function () {
        $scope.filter.choiceBillType = 101;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();

    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.choiceBillType = 102;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.choiceStatus = 880;
        $scope.filter.isTrade = 0;
        $scope.filter.isAlive = null;
        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.doRefresh();
    }
    //平台审核
    $scope.choiceTradeStatusCheck = function () {
        $scope.filter.choiceStatus = 881;
        $scope.filter.isAlive = 0;
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.doRefresh();
    }
    //发布中
    $scope.choiceTradeStatusPublish = function () {
        $scope.filter.choiceStatus = 882;
        $scope.filter.isAlive = 1;
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.doRefresh();
    }
    //交易中
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.choiceStatus = 883;
        $scope.filter.choiceorder = 1;
        $scope.filter.isTrade = 1;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 809;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = null;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.billStatusCode = 809;
            $scope.filter.isAlive = null;
            $scope.filter.status = null;
        };
        $scope.doRefresh();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.choiceStatus = 884;
        $scope.filter.isTrade = 0;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = null;
            $scope.filter.status = 810;
            $scope.filter.choiceorder = 1;
            $scope.doRefresh();
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = null;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = 810;
            $scope.doRefresh();
        }
    }
    //交易关闭
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.choiceStatus = 885;
        $scope.filter.isAlive = 1;
        $scope.filter.isTrade = 0;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.billStatusCode = null;
            $scope.filter.status = 816;
            $scope.filter.choiceorder = 0;
            $scope.doRefresh();
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = null;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = 816;
            $scope.doRefresh();
        }
    }
    ////获取对应的票据的出价信息，弹出窗口
    //$scope.showBidding = function (item) {
    //    billService.getBillProductBidding(item.id).then(function (data) {
    //        $scope.biddings = data;
    //        $scope.model = item;
    //    });
    //    $('#modal-bidding').modal('show');
    //};
    ////选择交易方，隐藏弹窗
    //$scope.finishBidding = function (item) {
    //    swal({
    //        title: "确认选择该收票人进行交易吗?",
    //        type: "warning",
    //        showCancelButton: true,
    //        confirmButtonText: "是",
    //        cancelButtonText: "否",
    //        closeOnConfirm: true
    //    }, function () {
    //        billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
    //            swal('确认交易方成功！');

    //            $scope.tableParams.reload();
    //            $('#modal-bidding').modal('hide');
    //        });
    //    });
    //};
    ////撤回某条发布
    //$scope.remove = function (data) {
    //    if ($scope.model.bid_number > 0) {
    //        swal('该票据已经有公司出价，如需撤回，请联系管理员！');
    //        return;
    //    } else {
    //        swal({
    //            title: "确定要撤回该发布?",
    //            type: "warning",
    //            showCancelButton: true,
    //            confirmButtonText: "是",
    //            cancelButtonText: "否",
    //            closeOnConfirm: true
    //        }, function () {
    //            billService.deleteBill(data.id).then(function (data) {
    //                $scope.billsNumber();
    //                $scope.tableParams.reload();
    //            });
    //        });
    //    }
    //}
    ////删除某条发布
    //$scope.delete = function (data) {
    //    if ($scope.model.bid_number > 0) {
    //        swal('该票据已经有公司出价，如需撤回，请联系管理员！');
    //        return;
    //    } else {
    //        swal({
    //            title: "是否确认删除？",
    //            type: "warning",
    //            showCancelButton: true,
    //            confirmButtonText: "是",
    //            cancelButtonText: "否",
    //            closeOnConfirm: true
    //        }, function () {
    //            billService.deleteBill(data.id).then(function (data) {
    //                $scope.billsNumber();
    //                $scope.tableParams.reload();
    //            });
    //        });
    //    }
    //}


    //$scope.deleteOrder = function (data) {
    //    swal({
    //        title: "是否确认删除？",
    //        type: "warning",
    //        showCancelButton: true,
    //        confirmButtonText: "是",
    //        cancelButtonText: "否",
    //        closeOnConfirm: true
    //    }, function () {
    //        orderService.deleteOrder(data.id).then(function (data) {
    //            $scope.billsNumber();
    //            $scope.tableParams.reload();
    //        });
    //    });
    //}

    ////获取所有的常量类型
    //constantsService.queryAll().then(function (data) {
    //    $scope.contantData = data;
    //})
    ////获取承兑机构类型
    //constantsService.queryConstantsType(4).then(function (data) {
    //    $scope.acceptorTypeData = data;
    //})
    ////获取票据类型信息
    //constantsService.queryConstantsType(1).then(function (data) {
    //    $scope.billTypeData = data;
    //})
    ////获取票据属性类型
    //constantsService.queryConstantsType(2).then(function (data) {
    //    $scope.billStyleData = data;
    //})
    ////获取电票瑕疵类型
    //constantsService.queryConstantsType(19).then(function (data) {
    //    $scope.billFlawData = data;
    //})
    ////获取纸票瑕疵类型
    //constantsService.queryConstantsType(15).then(function (data) {
    //    $scope.billFlawData2 = data;
    //})
    ////获取交易方式类型
    //constantsService.queryConstantsType(7).then(function (data) {
    //    $scope.tradeTypeCode = data;
    //})
    ////获取所有的省级地址
    //addressService.queryAll().then(function (data) {
    //    $scope.provinceData = data;
    //});
    ////获取对应省的市级地址
    //$scope.provinceChange = function () {
    //    if (!$scope.model.product_province_id) {
    //        $scope.cityData = [];
    //    }
    //    else {
    //        return addressService.queryCity($scope.model.product_province_id).then(function (data) {
    //            $scope.cityData = data;
    //        });
    //    }
    //}
    ////默认汇票到期日
    //$scope.billTypeChange = function () {
    //    if ($scope.model.bill_type_id == 101) {
    //        $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
    //    }
    //    else {
    //        $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
    //    }
    //}
    ////文件上传
    //$scope.uploadFiles = function (files, errFiles, successFunc) {
    //    $scope.uploading = true;
    //    if (errFiles.length > 0) {
    //        swal('有文件不符合要求，无法上传！');
    //    }
    //    angular.forEach(files, function (file) {
    //        file.upload = Upload.upload({
    //            url: FILE_URL + '/file',
    //            method: 'POST',
    //            headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
    //            file: file,
    //            data: { 'FileTypeCode': 1002 }
    //        }).then(successFunc, function (response) {
    //            if (response.status > 0) {
    //                swal('上传失败!' + response.status + ': ' + response.data);
    //            }
    //        }, function (evt) {

    //        });
    //    });
    //};
    ////设置传递给后台的图片数据为上传的图片信息
    //$scope.setFrontID = function (response) {
    //    $timeout(function () {
    //        $scope.model.bill_front_photo_id = response.data.data.id;
    //        $scope.model.bill_front_photo_path = response.data.data.file_path;
    //    })
    //};
    //$scope.setBackID = function (response) {
    //    $timeout(function () {
    //        $scope.model.bill_back_photo_id = response.data.data.id;
    //        $scope.model.bill_back_photo_path = response.data.data.file_path;
    //    })
    //};

    ////$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    ////    getData: function (params) {
    ////        return billService.getOwnBillProduct(params, 0).then(function (data) {
    ////            $scope.first = $scope.getFirst(params);
    ////            return data;
    ////        });
    ////    }
    ////});
    ////编辑信息；获取对应省的市区数据；设置默认显示的图片信息；弹出窗口
    //$scope.edit = function (data) {
    //    $scope.model = angular.copy(data);
    //    $scope.provinceChange();

    //    if (!$scope.model.bill_front_photo_path) {
    //        $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
    //    }
    //    if (!$scope.model.bill_back_photo_path) {
    //        $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
    //    }

    //    $('#modal-edit').modal('show');
    //};

    //$scope.save = function () {
    //    if (!$scope.model.bill_type_id) {
    //        swal("请选择票据类型");
    //        return;
    //    }

    //    if (!$scope.model.trade_type_code) {
    //        swal("请选择交易方式");
    //        return;
    //    }

    //    if (!$scope.model.bill_sum_price) {
    //        swal("请输入票面金额");
    //        return;
    //    }

    //    if ($scope.model.trade_type_code == 701) {
    //        if (!$scope.model.bill_front_photo_id) {
    //            swal("请上传汇票正面");
    //            return;
    //        }
    //    }
    //    else {
    //        if (!$scope.model.acceptor_type_id) {
    //            swal("请选择承兑机构");
    //            return;
    //        }

    //        if (!$scope.model.acceptor_name) {
    //            swal("请输入承兑人名称");
    //            return;
    //        }

    //        if (!$scope.model.bill_deadline_time) {
    //            swal("请输入汇票到期日");
    //            return;
    //        }

    //        if (!$scope.model.contact_name) {
    //            swal("请输入联系人");
    //            return;
    //        }

    //        if (!$scope.model.contact_phone) {
    //            swal("请输入联系方式");
    //            return;
    //        }
    //    }

    //    $scope.model.bill_flaw_ids = [];
    //    if ($scope.model.bill_type_id == 101) {     //获取所有勾选的电票的瑕疵
    //        for (var i = 0; i < $scope.billFlawData.length; i++) {
    //            if ($scope.billFlawData[i].checked) {
    //                $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
    //            }
    //        }
    //    }
    //    else {
    //        for (var i = 0; i < $scope.billFlawData2.length; i++) {     //获取所有勾选的纸票的瑕疵
    //            if ($scope.billFlawData2[i].checked) {
    //                $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
    //            }
    //        }
    //    }
    //    //修改对应的我的发布，刷新列表，隐藏弹窗
    //    billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
    //        $scope.tableParams.reload();
    //        $scope.editForm.$setPristine();
    //        $('#modal-edit').modal('hide');
    //    });
    //};
    ////自动刷新
    //$scope.checkAutointerval = function () {
    //    var autointerval = document.getElementById("autointerval");
    //    if (autointerval.checked) {
    //        var timer = setInterval($scope.reflash(), 60 * 1000);
    //        //$interval($scope.reflash, 60 * 1000)
    //        //autointerval.checked = true;
    //    } else if (!autointerval.checked) {
    //        clearInterval(timer);
    //        //autointerval.checked = false;
    //    };
    //    //console.log(autointerval.checked);
    //};

})