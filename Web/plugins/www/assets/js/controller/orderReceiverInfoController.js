hpxAdminApp.controller('orderReceiverInfoController', function ($rootScope, $scope, $timeout, $state, $stateParams, $interval, API_URL, ngTableParams, orderService, customerService, payingService, constantsService, enterprisesService) {
    $scope.filter = {
        buttonClicked:0,
    };
    $scope.model = {
        order_pay_type_id : 1202,
    }
    //获取收票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }
    init = function () {
        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;

            //if ($scope.model.bill_flaw_ids[0] == 1500) {
            //    $scope.model.bill_flaw_names[0] = "无瑕疵";
            //}

            //$scope.model.remaining_day = $scope.model.remaining_day + 1;

            //if ($scope.model.bill_status_code < 807) {
            //    $scope.model.order_status_name = "未背书";
            //} else if ($scope.model.bill_status_code >= 807) {
            //    $scope.model.order_status_name = "已背书";
            //}

            //if ($scope.model.bill_type_id == 101) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.order_rate * $scope.model.remaining_day / 100 / 360).toFixed(3);
            //} else if ($scope.model.bill_type_id == 102) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.order_rate * $scope.model.remaining_day / 1000 / 30).toFixed(3);
            //}
            //$scope.model.bid_deal_price = $scope.model.bill_sum_price - $scope.model.bid_rate_price;
            //$scope.model.order_total_price = $scope.model.bid_deal_price;

            //if ($scope.model.order_status_id > 810) {
            //    if ($scope.model.bill_type_id == 101) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
            //            $scope.drawerAppraisalModel = data.drawer_appraisal;
            //            $scope.receiverAppraisalModel = data.receiver_appraisal;
            //        });
            //    } else if ($scope.model.bill_type_id == 102) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (data) {
            //            $scope.drawerAppraisalModel = data.drawer_appraisal;
            //            $scope.receiverAppraisalModel = data.receiver_appraisal;
            //        });
            //    }
            //}

            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                //等待时间
                waitTime();
                //var newdate = new Date().getTime();
                //var waitdate = newdate - $scope.model.order_update_time;
                //if (waitdate > 60 * 1000) {
                //    var waitTime = new Date(waitdate);
                //    $scope.filter.waitTimeD = waitTime.getDate();
                //    if ($scope.filter.waitTimeD > 2) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24;
                //    } else if ($scope.filter.waitTimeD > 1) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
                //    } else {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8;
                //    }
                //    $scope.filter.waitdateM = waitTime.getMinutes();
                //} else {
                //    $scope.filter.waitTimeH = 0;
                //    $scope.filter.waitdateM = 0;
                //}
            }

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            });
        });
        //customerService.getEnterpriseAccount($scope.model.drawer_account_id).then(function (data) {
        //    $scope.drawerAccountModel = data;
        //});
    }
    init();

    waitTime = function () {
        var newdate = new Date().getTime();
        if ($scope.model.order_status_id == 804) {
            var waitdate = newdate - $scope.model.order_time;
        } else {
            var waitdate = newdate - $scope.model.order_update_time;
        }
        if (waitdate > 1000) {
            var waitTime = new Date(waitdate);
            $scope.filter.waitTimeD = waitTime.getDate();
            if ($scope.filter.waitTimeD > 2) {
                $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24;
            } else if ($scope.filter.waitTimeD > 1) {
                $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
            } else {
                $scope.filter.waitTimeH = waitTime.getHours() - 8;
            }
            $scope.filter.waitdateM = waitTime.getMinutes();
            $scope.filter.waitdateS = waitTime.getSeconds();
        } else {
            $scope.filter.waitTimeH = 0;
            $scope.filter.waitdateM = 0;
            $scope.filter.waitdateS = 0;
        }
    }

    //图片放大镜功能
    if ($stateParams.id) {
        if ($scope.model.bill_front_photo_path) {
            $('.jqzoom').imagezoom();
        }
    }
    //获取背书账号
    customerService.getAllEnterpriseAccount(502).then(function (data) {
        $scope.accounts = data;
        $scope.addressModel = {};
        $scope.addressModel.receiver_account_id = data[0].id;
    })
    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })

    //获取企业对应的收货地址信息
    customerService.getAllCustomerAddress().then(function (data) {
        $scope.addresses = data;
    })
    //支付手续费
    $scope.payCommission = function () {
        swal({
            title: "确定要支付手续费吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            orderService.orderPayCommission($scope.model.id).then(function () {
                payingService.GetPlatformAccount().then(function (data) {
                    $scope.PlatformData = data;
                })
                if ($scope.PlatformData.platform_account_balance > $scope.model.receiver_commission) {
                    swal('手续费支付成功！');
                } else {
                    swal('账户余额不足！请充值！');
                }

                init();
                $('#modal-edit').modal('hide');
            });
        });
    };
    //弹出付款窗口
    $scope.showPay = function () {
        customerService.getAllEnterpriseAccount(502).then(function (data) {
            $scope.accounts = data;
        });
        $scope.model.receiver_account_id = null;
        //$scope.model.order_pay_type_id = null;
        $scope.model.order_pay_type_id = 1203;
        $scope.model.verifyCode = null;
        $('#modal-address').modal('show');

        $scope.filter.buttonClicked = 1;
    };
    //支付票款
    $scope.pay = function () {
        if (!$scope.model.verifyCode || $scope.model.verifyCode.length != 6) {
            swal("请输入正确的短信验证码！");
        } else if (!$scope.model.receiver_account_id) {
            swal("请选择背书账号！");
        } else {
            swal({
                title: "确定要支付票据款?",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "是",
                cancelButtonText: "否",
                closeOnConfirm: true
            }, function () {
                var newWin = window.open('loading page');
                orderService.updateOrderAccountReceiver($scope.model.id, $scope.model.receiver_account_id).then(function (data) {
                    orderService.updateOrderReceiver($scope.model.id, $scope.model).then(function () {
                        newWin.location.href = API_URL + '/orders/orderPay/' + $scope.model.id.toString() + '?orderPayTypeId=' + $scope.model.order_pay_type_id.toString() + '&phone=' + $rootScope.identity.phone_number.toString() + '&verifyCode=' + $scope.model.verifyCode.toString() + '&token=' + $rootScope.identity.token;;
                        //window.open(API_URL + '/orders/orderPay/' + $scope.model.id.toString());
                        $('#modal-address').modal('hide');
                        // 确认支付成功提示
                        $('#modal-pay-confirm').modal('show');
                    });
                });
            });
        }
    };

    $scope.refresh = function () {
        window.location.reload();
        $('#modal-pay-confirm').modal('hide');
    };
    //确认签收
    $scope.showendorsements = function () {
        $('#modal-endorsements').modal('show');
        $timeout(function () {
            $('.jqzoom').imagezoom();
        });

        $scope.filter.buttonClicked = 1;
    }

    //发布方评价
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $state.go('app.main.evaluate', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: 3 });
    };
    //$scope.enterprise = []
    //$scope.enterprise.push({
    //    'type_id': $scope.model.bill_type_id,
    //    'to_id': $scope.model.order_id,
    //    'star': $scope.model.star,
    //    'description': $scope.model.description,
    //});
    
   //签收背书
    $scope.confirm = function () {
        swal({
            title: "确认签收背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            if ($scope.model.order_pay_type == 1203) {
                var newWin = window.open('loading page');
                newWin.location.href = API_URL + '/orders/orderConfirm/' + $scope.model.id.toString() + '?token=' + $rootScope.identity.token;
                //init();
                window.location.reload();
                $('#modal-endorsements').modal('hide');
                swal('背书签收完成！');
            } else {
                orderService.orderConfirm($scope.model.id, $rootScope.identity.token).then(function () {
                    swal('背书签收完成！');
                    //init();
                    window.location.reload();
                    $('#modal-endorsements').modal('hide');
                });
            }
        });
    };
    //签收背书
    $scope.validate = function () {
        swal({
            title: "确认签收背书?",
            text: "如果未经核实进行操作，后果自负！！！",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            if ($scope.model.order_pay_type==1203) {
                var newWin = window.open('loading page');
                newWin.location.href = API_URL + '/orders/orderConfirm/' + $scope.model.id.toString() + '?token=' + $rootScope.identity.token;
                //init();
                window.location.reload();
                $('#modal-endorsements').modal('hide');
                swal('背书签收完成！');
            } else {
                orderService.orderConfirm($scope.model.id, $rootScope.identity.token).then(function () {
                    swal('背书签收完成！');
                    //init();
                    window.location.reload();
                    $('#modal-endorsements').modal('hide');
                });
            }
        });
    }

    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        $scope.filter.phone_number = $rootScope.identity.phone_number;
        customerService.phoneVerify($scope.filter.phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };

    $scope.accountChange = function () {
        customerService.getEnterpriseAccount($scope.model.receiver_account_id).then(function (data) {
            $scope.accountModel = data;
        })
    };



    //window.onload = function () {
    //    var newtime = Date();
    //    $scope.waitminute = newtime - $scope.model.order_time;

    //    $interval(function () {
    //        $scope.second--;

    //        if ($scope.second == 0) {
    //            init();
    //        }
    //    }, 1000, 60);
    //};

    //一分钟自动刷新
    $scope.countDown = function (scopeStr) {
        var flag = 0;
        $scope[scopeStr] = 3;
        $scope[scopeStr + '_flag'] = 1;
        $interval(function () {
            $scope[scopeStr] = $scope[scopeStr] != 3 ? $scope[scopeStr] + 1 : 0;
            if ($scope[scopeStr + '_flag'] <= 60) {
                $scope[scopeStr + '_flag']++;
                if ($scope[scopeStr + '_flag'] == 61) {
                    flag++;
                    if ($scope.filter.buttonClicked == 1) {
                        $scope[scopeStr + '_flag'] = 1;
                    } else if(flag==3){
                        init();
                        $scope[scopeStr + '_flag'] = 1;
                        flag = 0;
                    }
                }
            } else {
                $scope[scopeStr + '_flag'] = 1;
            }
            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                waitTime();
            }
        }, 1000);
    }
    $scope.countDown('countValue');

    //展开收缩
    $scope.billshowhide = function () {
        var accordion = document.getElementById("billaccordion");
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
    }


});
