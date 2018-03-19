hpxAdminApp.controller('readBillController', function ($rootScope, $scope, $state, $stateParams, $filter, $timeout, ngTableParams, addressService, billService, constantsService, orderService, customerService, toolService, enterprisesService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
        check: 0,
        isaccount: 0,
        billBided: 0,
        billSuccess: 0,
        isbidingtime: 0,
        isidentity: 0,
    };

    //根据id获取对应的票据详细信息
    init = function () {
        if ($stateParams.id) {
            billService.getBillProduct($stateParams.id).then(function (data) {
                $scope.model = data;
                //$('.jqzoom').imagezoom();
                //$scope.filter.billSumPrice = $scope.model.bill_sum_price;
                //$scope.model.remaining_day = $scope.model.remaining_day + 1;
                
                if ($stateParams.check) {
                    $scope.filter.check = $stateParams.check;
                }
                if (!$scope.model.remaining_day) {
                    $scope.model.remaining_day = 0;
                }
                

                //根据条件判断，成立则获取出价记录
                if ($stateParams.id && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.model.publisher_id == $rootScope.identity.enterprise_id)) {
                    billService.getBillProductBidding($stateParams.id).then(function (data) {
                        //for (var i = 0; i < data.length; i++) {
                        //    data[i].bid_deal_price = $scope.filter.billSumPrice * (1 - (data[i].bid_rate / 100));
                        //}
                        $scope.biddings = data;
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
            },500);
        }
    }
    init();


    //$scope.showAddBidding = function (item) {
    //    $scope.biddingModel = {
    //        bill_product_id: $scope.model.id,
    //        bill_type_id: $scope.model.bill_type_id,
    //    };
    //    $('#modal-addBidding').modal('show');
    //};



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

                    //var newdate = new Date();
                    //$scope.filter.newTime = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日期
                    //for (var i = 0; i < $scope.biddings.length; i++) {
                    //    $scope.filter.bid_time = $filter('date')($scope.biddings[i].bid_time, 'yyyy-MM-dd');
                    //    if ($scope.filter.bid_time == $scope.filter.newTime) {
                    //        $scope.filter.isbidingtime = 1;
                    //    }
                    //}
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

                //var newdate = new Date();
                //$scope.filter.newTime = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日期
                //for(var i=0;i<$scope.biddings.length;i++){
                //    $scope.filter.bid_time = $filter('date')($scope.biddings[i].bid_time, 'yyyy-MM-dd');
                //    if ($scope.filter.bid_time == $scope.filter.newTime) {
                //        $scope.filter.isbidingtime=1;
                //    }
                //}
            });
            //}
            setTimeout(function () {
                if ($scope.model.bill_type_id == 101) {
                    swal({ 'title': '报价成功！\n请等待出票方确认报价。' }, function () {
                        $state.go("app.main.myBidding");
                    })
                } else if ($scope.model.bill_type_id == 102) {
                    swal({ 'title': '报价成功！ \n温馨提醒：报价后请及时联系出票方。' }, function () {
                        $state.go("app.free.readBill", { id: $scope.model.id, check: 3 });
                        //window.location.reload();
                    });
                }
            }, 350);
        });
    };
    //贴息计算
    $scope.ratechange = function () {
        $scope.rateModel = {};
        if ($scope.biddingModel.bid_rate > 0 || $scope.biddingModel.bill_rate > 0) {
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
                }
                $scope.rateModel.every_plus = 0;

                toolService.calculator($scope.rateModel).then(function (data) {
                    //$scope.calculatorResult = data;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    //$scope.biddingModel.bid_deal_price = ($scope.model.bill_sum_price - $scope.biddingModel.bid_rate_price).toFixed(2);
                });
            } else if ($scope.model.trade_type_code == 702) {
                $scope.rateModel.every_plus = $scope.biddingModel.bill_rate;

                toolService.calculator($scope.rateModel,'ten').then(function (data) {
                    //$scope.calculatorResult = data;
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                    //$scope.biddingModel.bid_deal_price = ($scope.model.bill_sum_price - $scope.biddingModel.bid_rate_price).toFixed(2);
                });
                //$scope.biddingModel.bid_rate = $scope.biddingModel.bill_rate;
                //$scope.biddingModel.bid_rate_price = ($scope.rateModel.denomination * $scope.biddingModel.bid_rate) / 10;
                //$scope.biddingModel.bid_deal_price = ($scope.model.bill_sum_price - $scope.biddingModel.bid_rate_price).toFixed(2);
            }

        }
    };


    //弹出出价窗口
    $scope.showAddBidding = function (item) {
        $scope.biddingModel = {
            bill_product_id: $scope.model.id,
            bid_enterprise_name: $rootScope.identity.enterprise_name,

            //denomination:$scope.model.bill_sum_price,
            //start_time: $scope.model.product_deadline_time,
            //end_time: $scope.model.bill_deadline_time,
            ////adjust_day:
        };
        $('#modal-addBidding').modal('show');
    };
    //弹出选择成交窗口
    $scope.showFinishBidding = function (item) {
        $scope.accountModel = {
            account_person: $scope.model.drawer_name,
        }

        $scope.model.drawer_account_id = null;

        customerService.getAllEnterpriseAccount(501).then(function (data) {
            $scope.accounts = data;
        })

        $scope.payModel = {};
        $scope.payModel.payId = item.id;
        $scope.payModel.bid_enterprise_name = item.bid_enterprise_name;
        $scope.payModel.bid_deal_price = item.bid_deal_price;
        $scope.payModel.bill_rate = item.bid_rate;
        $scope.payModel.receiver_name = item.receiver_name;
        $scope.payModel.receiver_avg_star = item.receiver_avg_star;
        $scope.payModel.receiver_contact_name = item.receiver_contact_name;
        $scope.payModel.receiver_contact_phone = item.receiver_contact_phone;

        $('#modal-finishBidding').modal('show');
    }
    //选择交易方          
    $scope.finishBidding = function (item) {
        swal({
            title: "确认选择该收票人进行交易吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            //$scope.filter.billid = $scope.model.id;
            //$scope.filter.tradetypecode = $scope.model.trade_type_code;

            if ($scope.model.trade_type_code == 701 || ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 102)) {
                billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': $scope.payModel.payId }).then(function (data) {
                    //swal('确认交易方成功！');
                    $('#modal-finishBidding').modal('hide');
                    if ($scope.model.bill_type_id == 101) {
                        billService.getBillProduct($scope.model.id).then(function (data) {
                            $scope.filter.order_id = data.order_id;
                            orderService.updateOrderAccountDrawer($scope.filter.order_id, $scope.model.drawer_account_id).then(function () { });
                            $scope.model = data;
                            $('.jqzoom').imagezoom();

                            billService.getBillProductBidding($stateParams.id).then(function (data) {
                                $scope.biddings = data;
                            });
                        });
                        setTimeout(function () {
                            //swal({
                            //    title: "确认交易方成功?",
                            //    type: "warning",
                            //    showCancelButton: true,
                            //    confirmButtonText: "是",
                            //    cancelButtonText: "否",
                            //    closeOnConfirm: true
                            //}, function () {
                            swal("确认交易方成功！");
                            $state.go("app.main.orderDrawerInfo", { id: $scope.filter.order_id });
                            //});
                        }, 350);
                    } else {
                        window.location.reload();
                    }
                });
            }
            if ($scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                //window.location.href = 'http://localhost:50532/www/index.html#/app/main/publish?id=' + $scope.model.id;
                //+ '&tradetype=' + $scope.model.trade_type_code
                $('#modal-finishBidding').modal('hide');
                setTimeout(function () {
                    //swal({
                    //    title: "确认交易方成功?",
                    //    type: "warning",
                    //    showCancelButton: true,
                    //    confirmButtonText: "是",
                    //    cancelButtonText: "否",
                    //    closeOnConfirm: true
                    swal("确认交易方成功！\n请先完善信息并提交审核，审核通过后直接进入交易状态！");
                    //}, function () {
                        $state.go('app.main.publish', { id: $scope.model.id, bidId: $scope.payModel.payId, accountId: $scope.model.drawer_account_id });
                    //});
                }, 350);
            }
        });
    };
    //选择收款账户
    $scope.accountChange = function () {
        //i = $scope.model.drawer_account_id.indexOf('_',0)+1;
        //s=$scope.model.drawer_account_id.substr(i, 100);
        customerService.getEnterpriseAccount($scope.model.drawer_account_id).then(function (data) {
            $scope.accountModel = data;
            $scope.filter.isaccount = 1;
        })
    }
    //展开收缩
    $scope.fileshowhide = function () {
        var accordion = document.getElementById("fileaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
            $timeout(function () {
                if ($rootScope.identity) {
                    $('.backjqzoom').imagezoom();
                }
            });
        } else {
            accordion.className = "accordionhide";
        }
    }
    //展开收缩
    $scope.billshowhide = function () {
        var accordion = document.getElementById("billaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
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
        },function () {
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

    //获取评价信息
    //appraisal = function () {
    //    enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
    //        $scope.drawerAppraisalModel = data.drawer_appraisal;
    //        $scope.receiverAppraisalModel = data.receiver_appraisal;
    //    });
    //};
    //appraisal();
});
