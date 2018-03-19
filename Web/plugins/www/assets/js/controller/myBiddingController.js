hpxAdminApp.controller('myBiddingController', function ($rootScope, $scope, $state, $interval, ngTableParams, billService, orderService) {
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        status: null,
        iselectronic:0,
    };

    $scope.billsNumber = function () {
        billService.getBillsNumber($scope.filter.choiceBillType).then(function (data) {
            $scope.numberModel = data;
        })
    }
    $scope.billsNumber();
    //获取我的出价信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            if ($scope.filter.status >= 804 && $scope.filter.choiceBillType == 101) {
                return orderService.getOwnBiddingOrder(params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model = data;
                    //if ($scope.filter.choiceStatus == 880 || (($scope.filter.choiceStatus == 882 || $scope.filter.choiceStatus == 883) && $scope.filter.choiceBillType == 102)) {
                    if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].bill.status_code == 801 && data[i].bid_result ==0) {
                                data[i].bill.status_name = "已报价";
                            }else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失效";
                            } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失败";
                            }
                            //if (data[i].bill.status_code == 801) {
                            //    data[i].bill.status_name = "已报价";
                            //}
                            //if (data[i].bill.bill_type_id == 101 && (data[i].bill.status_code == 802 || data[i].bill.status_code == 803 || data[i].bill.status_code == 804)) {
                            //    data[i].bill.status_name = "待付款";
                            //}
                            //if (data[i].bill.status_code == 809 && data[i].bill.bill_type_id == 102) {
                            //    data[i].bill.status_name = "达成交易协议";
                            //}
                            //if (data[i].bill.status_code == 810 && data[i].bill.bill_type_id == 102) {
                            //    data[i].bill.status_name = "交易完成";
                            //}
                        }
                    };
                    //if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                    //    for (var j = 0; j < data.length; j++) {
                    //        data[j].bill.remaining_day = data[j].bill.remaining_day + 1;
                    //    }
                    //};
                    if (($scope.filter.choiceBillType == 101 && ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881)) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill.bill_deadline_time)
                                data[j].bill.remaining_day = null;
                        };
                    }
                    return data;
                });
            } else {
                return billService.getOwnBillBidding(params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model = data;
                    if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].bill.status_code == 801 && data[i].bid_result == 0) {
                                data[i].bill.status_name = "已报价";
                            } else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失效";
                            } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                                data[i].bill.status_name = "竞价失败";
                            }
                        }
                    };
                    //if ($scope.filter.choiceStatus == 880 || (($scope.filter.choiceStatus == 882 || $scope.filter.choiceStatus == 883) && $scope.filter.choiceBillType == 102)) {
                    //    for (var i = 0; i < data.length; i++) {
                    //        if (data[i].bill.status_code == 801) {
                    //            data[i].bill.status_name = "已报价";
                    //        }
                    //        if (data[i].bill.bill_type_id == 101 && (data[i].bill.status_code == 802 || data[i].bill.status_code == 803 || data[i].bill.status_code == 804)) {
                    //            data[i].bill.status_name = "待付款";
                    //        }
                    //        if (data[i].bill_status_code == 809 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "达成交易协议";
                    //        }
                    //        if (data[i].bill_status_code == 810 && data[i].bill_type_id == 102) {
                    //            data[i].bill_status_name = "交易完成";
                    //        }
                    //    }
                    //};
                    //if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                    //    for (var j = 0; j < data.length; j++) {
                    //        data[j].bill.remaining_day = data[j].bill.remaining_day + 1;
                    //    }
                    //};
                    //if ($scope.filter.choiceBillType == 102 && $scope.filter.choiceStatus == 882 && $scope.filter.status == 810) {
                    //    var data1 = [];
                    //    for (var l = 0; l < data.length; l++) {
                    //        if (data[l].bill.status_code == 809) {
                    //            data1.push(data[l]);
                    //        }
                    //    }
                    //    data = data1;
                    //};
                    //if ($scope.filter.choiceBillType == 102 && $scope.filter.choiceStatus == 883 && $scope.filter.status == 810) {
                    //    var data1 = [];
                    //    for (var l = 0; l < data.length; l++) {
                    //        if (data[l].bill.status_code == 810) {
                    //            data1.push(data[l]);
                    //        }
                    //    }
                    //    data = data1;
                    //};
                    if(($scope.filter.choiceBillType == 101 && ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881)) || $scope.filter.choiceBillType == 102){
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill.bill_deadline_time)
                                data[j].bill.remaining_day = null;
                        };
                    }
                    return data;
                });
            }
        }
    });

    //选择电票
    $scope.choiceEBillType = function () {
        //if (document.getElementById("electronicBill").className == "billtypestyleprevious") {
        //    document.getElementById("electronicBill").className = "billtypestylecurrent";
        //    document.getElementById("electronic").style.color = "#fff";
        //    document.getElementById("paperBill").className = "billtypestyleprevious";
        //    document.getElementById("paper").style.color = "#000";
        //}
        $scope.filter.choiceBillType = 101;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //选择纸票
    $scope.choicePBillType = function () {
        //if (document.getElementById("paperBill").className == "billtypestyleprevious") {
        //    document.getElementById("paperBill").className = "billtypestylecurrent";
        //    document.getElementById("paper").style.color = "#fff";
        //    document.getElementById("electronicBill").className = "billtypestyleprevious";
        //    document.getElementById("electronic").style.color = "#000";
        //}
        $scope.filter.choiceBillType = 102;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.iselectronic = 0;
        //if (document.getElementById("all").className == "billstatusstyleprevious") {
        //    document.getElementById("all").className = "billstatusstylecurrent";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    if ($scope.filter.choiceBillType == 101 && $scope.filter.iselectronic == 1) {
        //        document.getElementById("trade").className = "billstatusstyleprevious";
        //        document.getElementById("fail").className = "billstatusstyleprevious";
        //    }
        //}
        $scope.filter.choiceStatus = 880;
        $scope.filter.status = null;
        $scope.tableParams.reload();
    }
    //竞价
    $scope.choiceTradeStatusBidding = function () {
        $scope.filter.iselectronic = 0;
        //if (document.getElementById("bidding").className == "billstatusstyleprevious") {
        //    document.getElementById("bidding").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    if ($scope.filter.choiceBillType == 101 && $scope.filter.iselectronic == 1) {
        //        document.getElementById("trade").className = "billstatusstyleprevious";
        //        document.getElementById("fail").className = "billstatusstyleprevious";
        //    }
        //}
        $scope.filter.choiceStatus = 881;
        $scope.filter.status = 801;
        $scope.tableParams.reload();
    }
    //交易中
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.iselectronic = 1;
        //if (document.getElementById("trade").className == "billstatusstyleprevious") {
        //    document.getElementById("trade").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    document.getElementById("fail").className = "billstatusstyleprevious";
        //}
        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 804;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = 809;
        }
        $scope.filter.choiceStatus = 882;
        $scope.tableParams.reload();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.iselectronic = 0;
        //if (document.getElementById("complete").className == "billstatusstyleprevious") {
        //    document.getElementById("complete").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //    if($scope.filter.choiceBillType == 101 && $scope.filter.iselectronic == 1){
        //        document.getElementById("trade").className = "billstatusstyleprevious";
        //        document.getElementById("fail").className = "billstatusstyleprevious";
        //    }
        //}
        $scope.filter.status = 810;
        $scope.filter.choiceStatus = 883;
        $scope.tableParams.reload();
    }
    //交易失败
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.iselectronic = 1;
        //if (document.getElementById("fail").className == "billstatusstyleprevious") {
        //    document.getElementById("fail").className = "billstatusstylecurrent";
        //    document.getElementById("all").className = "billstatusstyleprevious";
        //    document.getElementById("complete").className = "billstatusstyleprevious";
        //    document.getElementById("bidding").className = "billstatusstyleprevious";
        //}
        //$scope.filter.choiceBillType = 101;
        $scope.filter.status = 816;
        $scope.filter.choiceStatus = 884;
        $scope.tableParams.reload();
    }

    $scope.delete = function (data) {
        billService.deleteBillBidding(data.id).then(function (result) {
            $scope.choiceTradeStatusBidding();
            $scope.billsNumber();
        })
    }


    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //自动刷新
    $scope.checkAutointerval = function () {
        var autointerval = document.getElementById("autointerval");
        if (autointerval.checked) {
            var timer = setInterval($scope.reflash(), 60 * 1000);
            //$interval($scope.reflash, 60 * 1000)
            //autointerval.checked = true;
        }else if (!autointerval.checked) {
            clearInterval(timer);
            //autointerval.checked = false;
        };
        //console.log(autointerval.checked);
    };


    $scope.show = function (data) {
        $scope.model = angular.copy(data);
    };

    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });

        $('#modal-bidding').modal('show');
    };

    $scope.finishBidding = function (item) {
        swal({
            title: "确认选择该收票人进行交易吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
                swal('确认交易方成功！');

                $scope.tableParams.reload();
                $('#modal-bidding').modal('hide');
            });
        });
    };
});
