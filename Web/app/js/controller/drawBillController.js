﻿ionicApp.controller('drawBillController', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicModal, $ionicPopup, $timeout, billService, addressService, customerService, constantsService, bankService, fileService) {

    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return;
        //判断是否允许出票
    } else if ($rootScope.identity.is_verified != 4 && $rootScope.identity.is_verified != 1) {
        $ionicPopup.alert({
            title: '警告',
            template: '未绑定出票账户，无法发布汇票！',
            okType: 'button-assertive',
        });
        //$timeout(function () {
        //    $state.go("app.user");
        //}, 1000);
        $state.go("app.user");

        return;
    }

    $scope.model = {
        endorsement_number: 0,
        contact_name: $rootScope.identity == null ? "" : $rootScope.identity.customer_name,
        contact_phone: $rootScope.identity == null ? "" : $rootScope.identity.phone_number,
        bill_type_id: 101,
        trade_type_code: 701,
        bill_deadline_time: new Date().setYear(new Date().getFullYear() + 1),
        bill_deadline_date: new Date(new Date().setYear(new Date().getFullYear() + 1)),
    };
    $scope.filter = {
        tradetype: 0,
    }
    //获取客户信息中的省市地址信息
    init = function () {
        customerService.getCustomer().then(function (data) {
            if (data.trade_location_province_id && data.trade_location_city_id) {
                $scope.model.product_province_id = data.trade_location_province_id;

                addressService.queryCity(data.trade_location_province_id).then(function (data) {
                    $scope.cityData = data;
                });
                $scope.model.product_location_id = data.trade_location_city_id;
            }
        });
    };
    init();

    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })

    //获取我的发布详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            $scope.model.drawer_account_id = $stateParams.accountId;
            $scope.model.bill_deadline_date = new Date($scope.model.bill_deadline_time);
            $timeout(function () {
                if ($stateParams.id && $scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                    $scope.filter.tradetype = 1;
                    //document.getElementById("price").readOnly = "readonly";
                    //document.getElementById("acceptortype").disabled = "true";
                    //document.getElementById("producttime").readOnly = "readonly";
                    //document.getElementById("producttime").disabled = "true";
                }
            });
            //$('.jqzoom').imagezoom();
        });
    }

    $scope.$watch('model.bill_deadline_date', function (newValue, oldValue) {
        if (newValue === oldValue) { return; } // AKA first run
        //if ($scope.model.start_time instanceof Date) {
        /*
        var dateValue = new Date();
        dateValue.setHours(newValue.getHours() + 8);
        dateValue.setDate(dateValue.getDate() - 1);
        */
        $scope.model.bill_deadline_time = new Date($scope.model.bill_deadline_date).getTime();
        //if (newValue == null) $scope.model.start_time = null;
        //else $scope.model.start_time = newValue.toISOString().slice(0, 10);//toLocaleDateString().replace('/', '-').replace('/', '-');
        //$scope.onTimeSet($scope.model.start_time, 'start_time');
        //}
    });
    $scope.choiceEBillType = function () {
        $scope.model.bill_type_id = 101;
        $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        $scope.model.bill_deadline_date = new Date($scope.model.bill_deadline_time);
    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.model.bill_type_id = 102;
        $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        $scope.model.bill_deadline_date = new Date($scope.model.bill_deadline_time);
    };

    $scope.choiceYTradeType = function () {
        $scope.model.trade_type_code = 701;
    };
    $scope.choiceNTradeType = function () {
        $scope.model.trade_type_code = 702;
    };
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
    }
    $scope.takePhoto = function (index) {

        switch (index) {
            case 0:

                $scope.$takePhoto(function (data) {
                    $scope.model.bill_front_photo_path = data;
                    $scope.$uploadPhoto($scope.model.bill_front_photo_path, function (data) {
                        data = JSON.parse(data);
                        $scope.model.bill_front_photo_id = data.data.id;
                        $scope.model.bill_front_photo_path = data.data.file_path;
                    });
                });
                break;
            case 1:
                $scope.$takePhoto(function (data) {
                    $scope.model.bill_back_photo_path = data;
                    $scope.$uploadPhoto($scope.model.bill_back_photo_path, function (data) {
                        data = JSON.parse(data);
                        $scope.model.bill_back_photo_id = data.data.id;
                        $scope.model.bill_back_photo_path = data.data.file_path;
                    });
                });
                break;
        }
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
        $scope.model.bill_front_photo_path = '';
    }
    //汇票背面图片移除功能
    $scope.removeBack = function () {
        $scope.model.bill_back_photo_id = null;
        $scope.model.bill_back_photo_path = '';
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

    //  confirm 对话框
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '注意',
            template: '确定要发布汇票吗?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                if (!$scope.model.id) {

                    //发布汇票信息
                    billService.insertBillProduct($scope.model).then(function (data) {
                        $ionicPopup.alert({
                            title: '注意',
                            template: '发布成功，请等待后台审核（30分钟内完成）。',
                            okType: 'button-assertive',
                        });
                        //\n发布后请在48小时之内确认交易，平台系统默认将在48小时之后关闭竞价，关闭之后可在“交易关闭”选项中查询或重新发布。
                        $state.go("app.myReleaseElecAll");
                    });
                } else {
                    //修改汇票信息
                    if ($scope.model.id && $stateParams.bidId && $scope.model.trade_type_code == 702) {
                        $scope.model.bill_product_id = $scope.model.id;
                        $scope.model.bill_product_bidding_id = parseInt($stateParams.bidId);
                        billService.newOrderBidding($scope.model).then(function (data) {
                            $ionicPopup.alert({
                                title: '注意',
                                template: '发布成功，请等待后台审核（30分钟内完成）。',
                                okType: 'button-assertive',
                            });
                            $state.go("app.myReleaseElecAll");
                        });
                    } else {
                        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
                            $ionicPopup.alert({
                                title: '注意',
                                template: '发布成功，请等待后台审核（30分钟内完成）。',
                                okType: 'button-assertive',
                            });
                            $state.go("app.myReleaseElecAll");
                        });
                    }
                }
            } else {
                return
            }
        });
    };

    $scope.save = function () {
        //校验，提示信息
        if (!$scope.model.bill_type_id) {
            $ionicPopup.alert({
                title: '警告',
                template: '请选择票据类型',
                okType: 'button-assertive',
            });
            return;
        }


        if (!$scope.model.trade_type_code) {

            $ionicPopup.alert({
                title: '警告',
                template: '请选择交易方式！',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.bill_sum_price) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入票面金额！',
                okType: 'button-assertive',
            });
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '请上传汇票正面！',
                    okType: 'button-assertive',
                });
                return
            }

        }
        $scope.model.bill_flaw_ids = [];
        $scope.model.bill_type_id = parseInt($scope.model.bill_type_id);
        $scope.model.trade_type_code = parseInt($scope.model.trade_type_code);

        $scope.showConfirm();

    }

    //图片放大弹框
    $ionicModal.fromTemplateUrl('imgMagnify.html', {
        scope: $scope,
    }).then(function (modal) {
        $scope.imgMagnifyModal = modal;
    });

    $scope.openImgMagnifyModal = function (img_path) {
        if (img_path) {
            $scope.imgMagnifyModal.show();
            $scope.img_path = img_path;
        }
    }

    $scope.closeImgMagnifyModal = function () {
        $scope.imgMagnifyModal.hide();
    }
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
})