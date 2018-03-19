hpxAdminApp.controller('myBiddingController', function ($rootScope, $scope, $state, $interval, ngTableParams, billService, orderService) {
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        status: null,
        iselectronic: 0,
        //isCheck: 1,
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
                        }
                    };
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
        $scope.filter.choiceBillType = 101;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.choiceBillType = 102;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
        //$scope.tableParams.reload();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.iselectronic = 0;
        $scope.filter.choiceStatus = 880;
        $scope.filter.status = null;
        $scope.tableParams.reload();
    }
    //竞价
    $scope.choiceTradeStatusBidding = function () {
        $scope.filter.iselectronic = 0;
        $scope.filter.choiceStatus = 881;
        $scope.filter.status = 801;
        $scope.tableParams.reload();
    }
    //交易中
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.iselectronic = 1;
        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 804;
            //$scope.filter.status = 805;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = 809;
        }
        $scope.filter.choiceStatus = 882;
        $scope.tableParams.reload();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.iselectronic = 1;
        $scope.filter.status = 810;       
        $scope.filter.choiceStatus = 883;
        $scope.tableParams.reload();
    }
    //交易失败
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.iselectronic = 1;
        $scope.filter.status = 816;
        $scope.filter.choiceStatus = 884;
        $scope.tableParams.reload();
    }
    $scope.delete = function (data) {
        swal({
            title: "是否确认删除？",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        },function(){
            billService.deleteBillBidding(data.id).then(function (result) {
                $scope.choiceTradeStatusBidding();
                $scope.billsNumber();
            })
        })
        
    }
    $scope.deleteOrder = function (data) {
        swal({
            title: "是否确认删除？",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            orderService.deleteOrder(data.id).then(function (data) {
                $scope.billsNumber();
                $scope.tableParams.reload();
                swal("当前您无权进行此操作")
              
            });
        });
    }


    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //自动刷新
    $scope.checkAutointerval = function () {
        var autointerval = document.getElementById("autointerval");
        if (autointerval.checked) {
            var timer = setInterval($scope.reflash(), 60 * 1000);
        }else if (!autointerval.checked) {
            clearInterval(timer);
        };
    };


    $scope.show = function (data) {
        $scope.model = angular.copy(data);
    };

    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });

        //$('#modal-bidding').modal('show');
        $('#modal-bidding').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
