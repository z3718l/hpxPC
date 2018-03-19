hpxAdminApp.controller('orderReceiverInfoController', function ($rootScope, $scope, $timeout, $state, $stateParams, $interval, API_URL,XingYe_URL, ngTableParams, orderService, customerService, payingService, constantsService, enterprisesService, toolService, billService, enterpriseXingyeUserService) {
    $scope.filter = {
        buttonClicked: 0,
        toKeyWord: "倚天鉴",
        submitRule: 0,
        rote: 1
    };
    $scope.model = {
        order_pay_type_id : 1202,
    }
    $scope.tog = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "hrotes";
        } else {
            trans.className = "rote";
        }
    }
    var difference;
    //获取收票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }
     //设置每隔一段时间进行刷新
    var i = 0;
    
    init = function () {
        
        toolService.getSystemTime().then(function (date) {
            var newSystemDate = new Date().getTime();
            difference = newSystemDate - date;
        });

        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;
            $scope.model.order_total_prices = eval(subFeefun($scope.model.order_total_price) + $scope.model.order_total_price);
            orderService.getOrderTime($scope.model.id).then(function (data) {
                $scope.hpxDatekx = data.duration;
                $scope.hpxDateky = data.status;
                var timejson = data.time;
                $scope.hpxDates = [];
                angular.forEach(timejson, function (data) {
                    $scope.hpxDates[data.id] = data.TIME;
                });
            })
            


            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                //等待时间
                waitTime();
            }

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            },300);
        });
    }
    init();

    subFeefun = function (order_total_fee) {
        //return (order_total_fee == null || order_total_fee == '') ? 0 : (order_total_fee <= 100000 ? 10 : (order_total_fee <= 500000 ? 15 : (order_total_fee <= 1000000 ? 20 : (order_total_fee <= 10000000 ? order_total_fee * 0.00002 : 200))));
        return (order_total_fee == null || order_total_fee == '') ? 0 : 0;

    }

    waitTime = function () {
        var newdate = new Date().getTime();
        if (difference >= 0) {
            if ($scope.model.order_status_id == 804) {
                var waitdate = newdate - $scope.model.order_time - difference;
            } else {
                var waitdate = newdate - $scope.model.order_update_time - difference;
            }
        } else {
            if ($scope.model.order_status_id == 804) {
                var waitdate = newdate - $scope.model.order_time + difference;
            } else {
                var waitdate = newdate - $scope.model.order_update_time + difference;
            }
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
    $scope.idDisable = false;
    //弹出付款窗口
    $scope.showPay = function () {
        $scope.idDisable = true;
        var enterpriseId = $rootScope.identity.enterprise_id
        payingService.getAccount(enterpriseId).then(function (data) {
            $scope.accounts = data.acct_list;
        });
        
        $scope.model.order_pay_type_id = 1203;
        $scope.model.verifyCode = null;
        //$('#modal-address').modal('show');
        $('#modal-address').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });

        $scope.filter.buttonClicked = 1;
        $scope.verifyStr = "获取验证码";
        $scope.disableVerify = false;
        // 获取双方银行卡信息
        payingService.getAccountPY($scope.model.bill_id).then(function (data) {
            $scope.hpxGetAcc = data;
            $scope.hfindAccX = data.drawerAccount;
            $scope.hfindAccY = data.receiverAccount;
            $scope.hfindAccs = data.receiverAccountName;
        });
    };
    //乙方签署合同
    $scope.finCorpora = function () {
        enterpriseXingyeUserService.getLegalName($rootScope.identity.enterprise_id).then(function (data) {
            $scope.model.a_legalname = data.legalName;
        });
        enterpriseXingyeUserService.getLegalName($scope.model.drawer_id).then(function (data) {
            $scope.model.b_legalname = data.legalName;

        });

        $scope.phxPay = {
            withdrawal_procedure: "",
            hpxZong: 0
        }
        if ($scope.model.bill_type_id == 101) {
            //if ($scope.model.order_total_price <= 100000.00) {
            //    $scope.phxPay.withdrawal_procedure = 10.00;
            //} else if ($scope.model.order_total_price > 100000.00 && $scope.model.order_total_price <= 500000.00) {
            //    $scope.phxPay.withdrawal_procedure = 15.00;
            //} else if ($scope.model.order_total_price > 500000.00 && $scope.model.order_total_price <= 1000000.00) {
            //    $scope.phxPay.withdrawal_procedure = 20.00;
            //} else if ($scope.model.order_total_price > 1000000.00) {
            //    $scope.phxPay.withdrawal_procedure = Number($scope.model.order_total_price * 0.00002).toFixed(2);
            //    if ($scope.phxPay.withdrawal_procedure >= 200) {
            //        $scope.phxPay.withdrawal_procedure = 200.00;
            //    }
            //}
            $scope.phxPay.withdrawal_procedure = 0;
        } else if ($scope.model.bill_type_id == 102) {
            $scope.phxPay.withdrawal_procedure = 0;
        }
        $scope.hpxZ = Number($scope.phxPay.withdrawal_procedure) + Number($scope.model.order_total_price);
        $scope.phxPay.hpxZong = Number($scope.hpxZ).toFixed(2);

        var todayDate = new Date();
        $scope.filter.newYear = todayDate.getFullYear();
        $scope.filter.newMonth = todayDate.getMonth() + 1;
        $scope.filter.newToday = todayDate.getDate();
    };
    $scope.load = function () {
        $("#ownBillOffer").attr("checked", false);
    };
    $scope.rulekChange = function () {
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $scope.finCorpora();
    };
    $scope.ruleChange = function () {
        $scope.finCorpora();
        //$('#modal-rule').modal('show');
        $('#modal-rule').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $("#ownBillOffer").click();
    };

   $scope.submitRule = function () {
        if (!$scope.filter.payRule) {
            $scope.filter.payRule = true;
        }
        payingService.econtractNextSign($scope.model.receiver_id, $scope.model.id).then(function (data) {
            $scope.secondSing = data;
        });
        $scope.filter.submitRule = 1;
        $('#modal-rule').modal('hide');
    }

    //支付票款
    $scope.pay = function () {    
        //if (!$scope.model.verifyCode || $scope.model.verifyCode.length != 6) {
        //    swal("请输入正确的短信验证码！");
        //} 
        //else {
        payingService.getVacctNos($scope.hfindAccY.saler_buyer_v_acct_no, $scope.secondSing.contractNum, $scope.model.bill_id).then(function (data) {
            $scope.xuNiS = data;
        })
        $scope.model.receiver_account_id = $scope.hfindAccY.id;
        if ($scope.filter.submitRule == 0) {
            swal('请先阅读并同意质押协议！');
            return;
        }
        swal({
            title: "确定要支付票据款?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.isDisable = true;
            payingService.queryAccount($rootScope.identity.token).then(function (data) {        
                $scope.queryAccountS = data
                    orderService.updateOrderAccountReceiver($scope.model.id, $scope.hfindAccY.id).then(function (data) {
                        orderService.updateOrderReceiver($scope.model.id, $scope.model).then(function (data) {
                            // , $rootScope.identity.phone_number, $scope.model.verifyCode
                            payingService.orderPay($scope.model.order_number, $scope.xuNiS.saller_vacct_no, $scope.xuNiS.buyer_vacct_no, $scope.filter.id).then(function (data) {
                                $scope.payData = data;
                                if ($scope.payData.order_status == 805) {
                                    //$('#modal-xingyePay').modal('show');
                                    $('#modal-xingyePay').modal({
                                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                                        keyboard: false,//键盘关闭对话框
                                        show: true//弹出对话框
                                    });
                                    $scope.xingyePayA = function () {                                      
                                        var html = $scope.payData.biz_order.recharge_url;
                                        //http://139.224.112.243:8000/v1
                                        var url = API_URL+'/xingyeRecharge?recharge_url=' + html;
                                        window.open(url)
                                    }
                                    var timeTask = setInterval(function () {
                                        orderService.getOrder($scope.filter.id).then(function (data) {
                                            $scope.model = data;
                                            if (data.order_status_id == 806) {
                                                window.location.reload();
                                                clearInterval(timeTask);
                                            }
                                        })
                                    }, 10000);
                                } else if ($scope.payData.order_status == 806) {                                      
                                    //$(".clokykm").fadeIn();
                                    //$(".swal").fadeIn();  
                                    swal({
                                        title: "收票方付款成功！",
                                        confirmButtonText: "OK",
                                    }, function () {
                                        window.location.reload();
                                    })
                                }   
                            });
                            $('#modal-address').modal('hide');
                        });
                    });
                //}
            });
        });
        //}
    };
     //前往充值
    $scope.payRecharge = function () {
        var newWin = window.open('loading page');
        newWin.location.href = XingYe_URL + $scope.model.receiver_id.toString();
    }

    $scope.refresh = function () {
        window.location.reload();
        $('#modal-pay-confirm').modal('hide');
    };
    //确认签收
    $scope.showendorsements = function () {     
        //$('#modal-Hvalidate').modal('show');
        $('#modal-Hvalidate').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $timeout(function () {
            $('.jqzoom').imagezoom();
        });

        $scope.filter.buttonClicked = 1;
    }

    //发布方评价
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $state.go('app.main.evaluates', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: 3 });
    };

    //$scope.renows = function () {
    //    $('#modal-endorsement').fadeOut();
    //    $(".clokykm").fadeOut();
    //    window.location.reload();
    //}
    //$scope.renowk = function () {
    //    $('#modal-endorsement').fadeOut();
    //    $(".clokykms").fadeOut();
    //    window.location.reload();
    //}
    

    //$scope.hpxxy = function () {
    //    var newWin = window.open('loading page');
    //    newWin.location.href = XingYe_URL + $scope.model.receiver_id.toString();
    //}

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
            $scope.idDisable = true;
            payingService.confirmXYPay($scope.model.id).then(function (data) {
                //$(".clokykms").fadeIn();
                //$(".swals").fadeIn();
                swal({
                    title: "收票方签收成功！",
                    confirmButtonText: "OK",
                }, function () {
                    window.location.reload();
                })
            });
     
    //$scope.verifyStr = "获取验证码";
    //$scope.disableVerify = false;
        });
    }

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
            $scope.filter.rote = 1;
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 2;
        }
    }


});
