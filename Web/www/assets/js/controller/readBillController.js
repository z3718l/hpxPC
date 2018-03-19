hpxAdminApp.controller('readBillController', function ($rootScope, $scope, $state, $stateParams, $filter, $timeout, ngTableParams, addressService, billService, constantsService, orderService, customerService, toolService, enterprisesService, payingService, FILE_URL, Upload, bankService, fileService, enterpriseXingyeUserService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
        check: 0,
        isaccount: 0,
        billBided: 0,
        billSuccess: 0,
        isbidingtime: 0,
        isidentity: 0,
        fromKeyWord: "",
        submitRule: 0,
        prepRule: false,
        rote: 1
    };
    $scope.firstSign = {
        contract_num: 0,
    }
    $scope.model = {
        serve_price: 0
    }
    //$scope.model = {
    //    'bill_front_photo_path': '',
    //    'bill_back_photo_path': '',
    //    'endorsement_number': 1,
    //    'contact_name': $rootScope.identity.customer_name,
    //    'contact_phone': $rootScope.identity.phone_number,
    //    bill_type_id: 101,
    //    trade_type_code: 701,
    //};

    $scope.prepMatters = function () {
        //$('#modal-addBiddings').modal('show');
        $('#modal-addBiddings').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    $scope.closePrep = function () {
        //$('#modal-addBiddings').modal('hide');
        $scope('#modal-addBiddings').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }

    $scope.prepAddBid = function () {
        if (!$scope.biddingModel.bid_rate) {
            swal("请填写月利率！");
            $scope.filter.prepRule = false;
        } else if ($scope.biddingModel.bid_rate && $scope.filter.prepRule) {
            $scope.filter.prepRule = true;
        }
    }
    $scope.drawRead = function () {
        $scope.filter.prepRule = true;
    }
    $scope.showAddpBid = function () {
        //$('#modal-addBiddings').modal('show');
        $('#modal-addBiddings').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    $scope.prepRead = function () {
        $scope.filter.prepRule = true;
        $('#modal-addBiddings').modal('hide');
    }
    $scope.guanbi = function () {
        $('#modal-addBidding').modal('hide');
    }
    //根据id获取对应的票据详细信息
    init = function () {
        if ($stateParams.id) {
            billService.getBillProduct($stateParams.id).then(function (data) {
                $scope.model = data;
                $scope.billModel = data;
                if ($stateParams.check) {
                    $scope.filter.check = $stateParams.check;
                }
                if (!$scope.model.remaining_day) {
                    $scope.model.remaining_day = 0;
                }
                //根据条件判断，成立则获取出价记录
                if ($stateParams.id && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.model.publisher_id == $rootScope.identity.enterprise_id)) {
                    billService.getBillProductBidding($stateParams.id).then(function (data) {
                        $scope.biddings = data;
                        angular.forEach(data, function (ele, index) {
                            $scope.hpxBidding = ele;
                        })
                    });
                }
                //倒计时
                //var newdate = new Date().getTime();
                ////var allwaittime = 48 * 60 * 60 * 1000;
                ////var allwaittime = 60 * 60 * 1000;
                //var countdown = $scope.model.publishing_time + allwaittime - newdate;
                //if (countdown >= 60 * 1000) {
                //    var countdownTime = new Date(countdown);
                //    //var countdownTime.setTime(countdown);
                //    console.log(countdownTime);
                //    $scope.filter.countdownD = countdownTime.getDate();
                //    if ($scope.filter.countdownD > 2) {
                //        $scope.filter.countdownH = countdownTime.getHours() + ($scope.filter.countdownD - 2) * 24 + (24 - 8);
                //    } else if ($scope.filter.countdownD > 1) {
                //        $scope.filter.countdownH = countdownTime.getHours() + (24 - 8);
                //    } else {
                //        $scope.filter.countdownH = countdownTime.getHours();
                //    }
                //    $scope.filter.countdownM = countdownTime.getMinutes();
                //} else {
                //    $scope.filter.countdownH = 0;
                //    $scope.filter.countdownM = 0;
                //    billService.deleteBill($scope.model.id).then(function (data) {
                //        $scope.billsNumber();
                //        $state.go("app.free.queryBill");
                //    });
                //}

                //获取评价信息
                if ($scope.model.bill_status_code >= 811 && $scope.model.bill_type_id == 102) {
                    enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
                        $scope.drawerAppraisalModel = data.drawer_appraisal;
                        $scope.receiverAppraisalModel = data.receiver_appraisal;
                    });
                }
            });
            $timeout(function () {
                if ($rootScope.identity) {
                    $scope.filter.isidentity = 1;
                    $('.jqzoom').imagezoom();
                };
                if ($rootScope.identity) {
                    $scope.filter.isidentity = 1;
                    $('.backjqzoom').imagezoom();
                }
            }, 500);
        }
    }
    init();

    //撤销报价
    $scope.cancelBidding = function (item) {
        swal({
            title: "确定要撤销报价吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            });
            $state.go("app.main.myBidding");
        });
    };
    //新增报价信息
    $scope.addBidding = function () {
        if ($scope.model.trade_type_code == 702) {
            $scope.biddingModel.bid_rate = $scope.biddingModel.bill_rate;
        }
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            //swal('出价成功！');
            $('#modal-addBidding').modal('hide');
            //$scope.model.billBided = 1;
            //if ($scope.model.id && identity && (identity.can_see_bill_detail == 1 || model.publisher_id == identity.enterprise_id)) {
            billService.getBillProductBidding($scope.model.id).then(function (data) {
                $scope.biddings = data;
            });
            //}
            setTimeout(function () {
                if ($scope.model.bill_type_id == 101) {
                    swal({ 'title': '报价成功！\n请等待出票方确认报价。' }, function () {
                        $state.go("app.free.readBillBid", { id: $scope.model.id, check: 3 });
                    })
                } else if ($scope.model.bill_type_id == 102) {
                    swal({ 'title': '报价成功！ \n温馨提醒：报价后请及时联系出票方。' }, function () {
                        $state.go("app.free.readBillBid", { id: $scope.model.id, check: 3 });
                        //window.location.reload();
                    });
                }
            }, 350);
        });
    };
    // 计算手续费
    $scope.phxPay = {
        withdrawal_procedure: "",
        hpxZong: 0,
        amount: ""
    }
    $scope.bidPoundage = function () {
        if ($scope.model.bill_type_id == 101) {
            //if ($scope.phxPay.amount <= 100000.00) {
            //    $scope.phxPay.withdrawal_procedure = 10.00;
            //} else if ($scope.phxPay.amount > 100000.00 && $scope.phxPay.amount <= 500000.00) {
            //    $scope.phxPay.withdrawal_procedure = 15.00;
            //} else if ($scope.phxPay.amount > 500000.00 && $scope.phxPay.amount <= 1000000.00) {
            //    $scope.phxPay.withdrawal_procedure = 20.00;
            //} else if ($scope.phxPay.amount > 1000000.00) {
            //    $scope.phxPay.withdrawal_procedure = Number($scope.phxPay.amount * 0.00002).toFixed(2);
            //    if ($scope.phxPay.withdrawal_procedure >= 200) {
            //        $scope.phxPay.withdrawal_procedure = 200.00;
            //    }
            //}
            $scope.phxPay.withdrawal_procedure = 0;
        } else if ($scope.model.bill_type_id == 102) {
            $scope.phxPay.withdrawal_procedure = 0;
        }
    }
    //$scope.poundage = function () {
    //    swal('提现手续费扣费标准： \n 10W以下（包含10W）10元 \n 10W-50W（包含50W） 15元 \n 50W-100W（包含100W）20元 \n 100W以上 0.002% 200元封顶。');
    //}
    $scope.hpxBidL = true;
    $scope.isdisabled = true;

    //贴息计算
    $scope.ratechange = function () {
        $scope.hpxBidL = true;
        $scope.rateModel = {};
        if (!$scope.biddingModel.bid_every_plus || !$scope.biddingModel.bill_rate) {
            $scope.isdisabled = false;
        } 
        if ($scope.biddingModel.bid_rate == null || $scope.biddingModel.bid_rate == "" || $scope.biddingModel.bid_rate == undefined) {
            $scope.biddingModel.bid_deal_price = "";
            $scope.biddingModel.bid_rate_price = "";
            $scope.phxPay.hpxZong = 0;
            $scope.phxPay.withdrawal_procedure = "";
        }
        if ($scope.biddingModel.bid_rate > 0) {
            var newDate = new Date();

            $scope.rateModel.start_time = $filter('date')(newDate, 'yyyy-MM-dd');
            $scope.rateModel.end_time = $filter('date')($scope.model.bill_deadline_time, 'yyyy-MM-dd');

            $scope.rateModel.denomination = $scope.model.bill_sum_price / 10000;
            $scope.rateModel.commission = 0;

            if ($scope.model.trade_type_code == 701) {
                if ($scope.model.bill_type_id == 102) {
                    $scope.rateModel.interest_month = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 3;
                } else if ($scope.model.bill_type_id == 101) {
                    $scope.rateModel.interest_year = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 0;
                    $scope.rateModel.every_plus = $scope.biddingModel.bid_every_plus;
                }
                $scope.rateModel.every_plus = $scope.biddingModel.bid_every_plus ? $scope.biddingModel.bid_every_plus : 0;

                toolService.calculator($scope.rateModel).then(function (data) {
                    $scope.hpxBidL = false;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    $scope.phxPay.amount = $scope.biddingModel.bid_deal_price;
                    $scope.bidPoundage();
                    $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.biddingModel.bid_deal_price);
                    $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);
                });
            } else if ($scope.model.trade_type_code == 702) {
                $scope.rateModel.every_plus = $scope.biddingModel.bill_rate;

                toolService.calculator($scope.rateModel, 'ten').then(function (data) {
                    $scope.hpxBidL = false;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    $scope.phxPay.amount = $scope.biddingModel.bid_deal_price;
                    $scope.bidPoundage();
                    $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.biddingModel.bid_deal_price);
                    $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);

                });
            }

        }
    };


    //弹出出价窗口
    $scope.showAddBidding = function (item) {
        $scope.isdisabled = true;
        $scope.biddingModel = {
            bill_product_id: $scope.model.id,
            bid_enterprise_name: $rootScope.identity.enterprise_name,
        };
        //$('#modal-addBidding').modal('show');
        $('#modal-addBidding').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };

    //弹出选择成交窗口
    $scope.showFinishBidding = function (item) {
        $scope.payModel = item;
        $scope.accountModels = {};
        $scope.accountModel = {
            account_person: $scope.model.drawer_name,
        }
        $scope.model.drawer_account_id = null;
        var enterpriseId = $rootScope.identity.enterprise_id
        //payingService.getAccount(enterpriseId).then(function (data) {
        //    $scope.accounts = data.acct_list;
        //})
        $scope.payModel = {};
        $scope.payModel.payId = item.id;
        $scope.payModel.bid_enterprise_name = item.bid_enterprise_name;
        $scope.payModel.bid_enterprise_id = item.bid_enterprise_id;
        $scope.payModel.bid_deal_price = item.bid_deal_price;
        $scope.payModel.bill_rate = item.bid_rate;
        $scope.payModel.bid_every_plus = item.bid_every_plus
        $scope.payModel.receiver_name = item.receiver_name;
        $scope.payModel.receiver_avg_star = item.receiver_avg_star;
        $scope.payModel.receiver_contact_name = item.receiver_contact_name;
        $scope.payModel.receiver_contact_phone = item.receiver_contact_phone;
        $scope.phxPay.amount = $scope.payModel.bid_deal_price;
        $scope.bidPoundage();
        $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.payModel.bid_deal_price);
        $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);
        billService.insertEnterpriseId($stateParams.id, $scope.payModel.bid_enterprise_id).then(function (data) {
            // 根据票据id查询双方银行卡信息
            payingService.getAccountPX($stateParams.id).then(function (data) {
                $scope.accounts = data.drawerAccount;
                $scope.hpxAX = data;
                $scope.hpxContract = data.receiverAccount;
            })
        })
        if ($scope.model.trade_type_code == 701 && $scope.model.bill_type_id == 101 || $scope.model.bill_type_id == 102) {
            //$('#modal-finishBidding').modal('show');
            $('#modal-finishBidding').modal({
                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                keyboard: false,//键盘关闭对话框
                show: true//弹出对话框
            });
        }
        else   //$scope.model.bill_front_photo_path == null || $scope.model.bill_back_photo_path == null || $scope.model.bill_number == null || $scope.model.bill_deadline_time == null || $scope.model.bill_deal_price == null || $scope.model.bill_rate == null
            if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101 && $scope.model.is_checked == 1 && ($scope.model.bill_front_photo_path == null || $scope.model.bill_back_photo_path == null || $scope.model.bill_number == null || $scope.model.bill_deadline_time == null || $scope.model.bill_deal_price == null || $scope.model.bill_rate == null)) {
                swal({
                    title: "您的票据信息还不完善！",
                    text: "请完善票据信息。",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    closeOnConfirm: true
                }, function () {
                    // 修改票据信息
                    //$('#modal_baofu').modal('show');
                    $('#modal_baofu').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $scope.filter = {
                        tradetype: 0,
                    }
                    // 获取全部汇票类型
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
                                    //document.getElementById("acceptor_name").disabled = "true";
                                    document.getElementById("acceptortype").disabled = "true";
                                    //document.getElementById("producttime").readOnly = "readonly";
                                    //document.getElementById("producttime").disabled = "true";
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
                    //constantsService.queryConstantsType(15).then(function (data) {
                    //    $scope.billFlawData2 = data;
                    //    for (var i = 0; i < $scope.billFlawData2.length; i++) {
                    //        if ($scope.billFlawData2[i].code == 1500) {
                    //            $scope.billFlawData2[i].checked = true;
                    //            break;
                    //        }
                    //    }
                    //})
                    //获取交易方式类型
                    constantsService.queryConstantsType(7).then(function (data) {
                        $scope.tradeTypeCode = data;
                    })
                    //获取全部省级地址
                    //addressService.queryAll().then(function (data) {
                    //    $scope.provinceData = data;
                    //    $scope.provinceChange();
                    //});
                    //获取各省市下面的市区
                    //$scope.provinceChange = function () {
                    //    if (!$scope.model.product_province_id) {
                    //        $scope.cityData = [];
                    //    } else if ($scope.model.product_province_id == 1 || $scope.model.product_province_id == 20 || $scope.model.product_province_id == 860 || $scope.model.product_province_id == 2462) {
                    //        $scope.filter.tradeProvinceId = $scope.model.product_province_id + 1;
                    //        return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                    //            $scope.cityData = data;
                    //        });
                    //    } else {
                    //        return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                    //            $scope.cityData = data;
                    //        });
                    //    }
                    //}
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
                    //$scope.billFlawChange2 = function (item) {
                    //    if (item.code == 1500) {
                    //        item.checked = true;
                    //        for (var i = 1; i < $scope.billFlawData2.length; i++) {
                    //            $scope.billFlawData2[i].checked = false;
                    //        }
                    //    }
                    //    else {
                    //        for (var i = 0; i < $scope.billFlawData2.length; i++) {
                    //            if (i == 0) {
                    //                $scope.billFlawData2[i].checked = true;
                    //            }
                    //            else {
                    //                if ($scope.billFlawData2[i].checked) {
                    //                    $scope.billFlawData2[0].checked = false;
                    //                }
                    //            }
                    //        }
                    //    }
                    //}
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

                    // 选择成交完善票据信息时限制背书次数只能输入0-100的正整数
                    $scope.checkInt = function (n, max) {
                        var regex = /^\d+$/;
                        if (regex.test(n)) {
                            if (n < max && n > 0) {
                            } else {
                                swal("这不是小于" + max + "的正整数！请重新输入！");
                                $scope.model.endorsement_number = "";
                            }
                        }
                    }

                    //提示信息
                    $scope.question = function () {
                        swal('请在预约交易时间前进行交易，过时请重新发布。');
                    }

                    $scope.revise = function () {
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
                        if (!$scope.model.contact_name) {
                            swal("请输入联系人姓名");
                            return;
                        }
                        if (!$scope.model.contact_phone) {
                            swal("请输入联系方式");
                            return;
                        }

                        if ($scope.model.trade_type_code == 701) {
                            if (!$scope.model.bill_front_photo_id) {
                                swal("请上传汇票正面");
                                return;
                            }
                        } else {
                            if ($scope.model.trade_type_code == 702) {
                                if (!$scope.model.acceptor_type_id) {
                                    swal("请选择承兑机构");
                                    return;
                                }

                                if (!$scope.model.product_deadline_time) {
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

                            if (!$scope.model.acceptor_name) {
                                swal("请输入付款行全称");
                                return;
                            }
                            if (!$scope.model.bill_number) {
                                swal("请输入票据号");
                                return;
                            }
                            if (!$scope.model.endorsement_number) {
                                swal("请输入背书次数");
                                return;
                            }

                            if (!$scope.model.bill_deadline_time) {
                                swal("请输入汇票到期日");
                                return;
                            }
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
                        }
                        else {
                            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                                if ($scope.billFlawData2[i].checked) {
                                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                                }
                            }
                        }
                        swal({
                            title: "确定要完善汇票吗?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "是",
                            cancelButtonText: "否",
                            closeOnConfirm: true
                        }, function () {
                            //发布汇票信息
                            billService.updateBillHpx($scope.model.id, $scope.model).then(function (data) {
                                $('#modal_baofu').modal('hide');
                                //$('#modal-finishBidding').modal('show');
                                $('#modal-finishBidding').modal({
                                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                                    keyboard: false,//键盘关闭对话框
                                    show: true//弹出对话框
                                });
                            });

                        });
                    }
                })
            }
            else {
                //$('#modal-finishBidding').modal('show');
                $('#modal-finishBidding').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
            }
    }

    // 签合同时的日期和公司法人
    $scope.getDrawData = function () {
        var todayDate = new Date();
        $scope.filter.newYear = todayDate.getFullYear();
        $scope.filter.newMonth = todayDate.getMonth() + 1;
        $scope.filter.newToday = todayDate.getDate();
        enterpriseXingyeUserService.getLegalName($rootScope.identity.enterprise_id).then(function (data) {
            $scope.model.a_legalname = data.legalName;
        });
        enterpriseXingyeUserService.getLegalName($scope.payModel.bid_enterprise_id).then(function (data) {
            $scope.model.b_legalname = data.legalName;

        });
    }
    $scope.ruleschange = function () {
        if ($scope.AccountR == null) {
            swal('请先选择出票方提现账户！');
            return;
        }
        $scope.getDrawData();
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    //甲方签署合同
    $scope.rulechange = function () {
        if ($scope.AccountR == null) {
            swal('请先选择出票方提现账户！');
            $("#ownBillOffer").removeAttr("checked");
            return;
        }
        $scope.getDrawData();
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $("#ownBillOffer").click();

    };
    $scope.submitRule = function () {
        if (!$scope.filter.rule) {
            $scope.filter.rule = true;
        }

        payingService.econtractFirstSign($scope.model.drawer_id, $scope.filter.fromKeyWord, $scope.payModel.payId, $scope.accountModels.id).then(function (data) {
            $scope.firstSign = data
            $scope.contract = $scope.firstSign.contract_num;
            payingService.getVacctNo($scope.AccountR.v_acct_no, $scope.firstSign.contract_num, $stateParams.id).then(function (data) {

            });
        });
        $scope.filter.submitRule = 1;
        $('#modal-rule').modal('hide');
    }

    //选择交易方          
    $scope.finishBidding = function (item) {
        //if ($scope.filter.submitRule == 0) {
        //    swal('请先阅读并同意质押协议！');
        //    return;
        //}
        
        swal({
            title: "确认选择该收票人进行交易吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.isDisable = true;
            $scope.model.bill_product_id = $scope.billModel.id;
            $scope.model.bill_product_bidding_id = $scope.payModel.payId;
            $scope.model.is_NeedXY = 1;
            $scope.model.type = "bidding";
            $scope.model.contract_num = $scope.firstSign.contract_num;
            $scope.model.account_id = $scope.accountModels.id;
            if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                billService.generateOrders($scope.model).then(function (data) {
                })
            }

            if ($scope.model.trade_type_code == 701 || ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 102)) {
                billService.newOrderBidding({ 'bill_product_id': $scope.model.bill_product_id, 'bill_product_bidding_id': $scope.payModel.payId, 'is_NeedXY': 1, 'type': 'bidding', 'contract_num': $scope.firstSign.contract_num, 'account_id': $scope.accountModels.id }).then(function (data) {
                    //swal('确认交易方成功！');
                    $('#modal-finishBidding').modal('hide');
                    if ($scope.model.bill_type_id == 101) {
                        billService.getBillProduct($scope.model.id).then(function (data) {
                            $scope.filter.order_id = data.order_id;
                            orderService.updateOrderAccountDrawer($scope.filter.order_id, $scope.model.account_id).then(function () { });
                            $scope.model = data;
                            $('.jqzoom').imagezoom();

                            billService.getBillProductBidding($stateParams.id).then(function (data) {
                                $scope.biddings = data;
                            });
                        });
                        setTimeout(function () {
                            swal("确认交易方成功!");
                            $state.go("app.main.orderDrawerInfo", { id: $scope.filter.order_id });
                        }, 350);
                    } else {
                        window.location.reload();
                    }
                });
            } else if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                $('#modal-finishBidding').modal('hide');
                setTimeout(function () {
                    swal("确认交易方成功！\n审核通过后直接进入交易状态。");
                    $state.go('app.main.myBill');
                }, 350);
            }
        });
    };
    //选择收款账户
    $scope.accountChange = function () {
        payingService.getAccountR($scope.accountModels.id).then(function (data) {
            angular.forEach(data.acct_list, function (ele, i) {
                $scope.AccountR = ele;
                $("#ownBillOffer").removeAttr("checked");
                $("#transactions").attr("disabled", true);
            })
        })
    }
    //展开收缩
    $scope.fileshowhide = function () {
        //$(".tg2").toggleClass("trans");
        var accordion = document.getElementById("fileaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
            $scope.filter.rote = 2;
            $timeout(function () {
                if ($rootScope.identity) {
                    $('.backjqzoom').imagezoom();
                }
            });
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 1;
        }
    }
    //展开收缩
    $scope.billshowhide = function () {
        var accordion = document.getElementById("billaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
            $scope.filter.rote = 1;
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 2;
        }
    }
    //确认成交
    $scope.submitbillnew = function () {
        swal({
            title: "是否线下已完成交易?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            billService.finishBillNew($scope.model.id).then(function (data) {
                swal("已成功确认成交！");
                window.location.reload();
            });
        });
    }
    //评价
    $scope.showEvaluatesell = function () {
        $state.go('app.main.evaluate', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: $scope.filter.check });
    };
});
