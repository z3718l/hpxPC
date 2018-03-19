ionicApp.controller('myReleaseDetailController', function ($scope, $rootScope, $state, API_URL, $stateParams, $filter, billService, toolService, enterprisesService, orderService, constantsService, $ionicModal, $ionicPopup, customerService, $interval) {
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
        check: 0
    };
    
    $scope.billId = $stateParams.myReleaseBillId;
    $scope.orderId = $stateParams.myReleaseOrderId;
    $scope.filter.check = $stateParams.check;
    $scope.filter.rule = false;
    $scope.billModel = {};
    $scope.biddings = {};
    $scope.model = {};
    $scope.open = true;
    $scope.open2 = true;
    $scope.endorsements = [];
    $scope.evaluateModel = {
        type_id: null,
        to_id: null,
        star: 0,
        bill_status_code: null,
        order_status_id: null,
        description: null,
        additional_description: null,
    };

    //$scope.test = $rootScope.identity;
    //console.log($scope.billId);
    $scope.changeOpen = function () {
        $scope.open = !$scope.open;
    }
    $scope.changeOpen2 = function () {
        $scope.open2 = !$scope.open2;
    }
    //获取票据详情
    init = function () {
        billService.getBillDetail($scope.billId).then(function (data) {
            $scope.billModel = data;
            $scope.biddingModel = {
                bill_product_id: $scope.billModel.id,
                bid_enterprise_name: $rootScope.identity.enterprise_name,
                bid_deal_price: 0,
            };
            //网络异步问题处理
            if ($scope.billId && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.billModel.publisher_id == $rootScope.identity.enterprise_id)) {
                billService.getBillProductBidding($scope.billId).then(function (data) {
                    $scope.biddings = data;
                });
            }



        });
        //获取出票订单详情
        if ($scope.orderId) {
            orderService.getOrder($scope.orderId). then(function (data){
                $scope.orderModel = data;
            });
        }
    };
    init();

     
    

    //计时程序
    //waitTime = function () {
    //    var newdate = new Date().getTime();
    //    if ($scope.orderModel.order_status_id == 804) {
    //        var waitdate = newdate - $scope.orderModel.order_time;
    //    } else {
    //        var waitdate = newdate - $scope.orderModel.order_update_time;
    //    }
    //    if (waitdate > 1000) {
    //        var waitTime = new Date(waitdate);
    //        $scope.filter.waitTimeD = waitTime.getDate();
    //        if ($scope.filter.waitTimeD > 2) {
    //            $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24;
    //        } else if ($scope.filter.waitTimeD > 1) {
    //            $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
    //        } else {
    //            $scope.filter.waitTimeH = waitTime.getHours() - 8;
    //        }
    //        $scope.filter.waitdateM = waitTime.getMinutes();
    //        $scope.filter.waitdateS = waitTime.getSeconds();
    //    } else {
    //        $scope.filter.waitTimeH = 0;
    //        $scope.filter.waitdateM = 0;
    //        $scope.filter.waitdateS = 0;
    //    }
    //}

    //弹框
    $ionicModal.fromTemplateUrl('endorsePopup.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.endorseModal = modal;
    });

    //图片放大弹框
    $ionicModal.fromTemplateUrl('imgMagnify.html', {
        scope: $scope,
        //animation: 'slide-in-up'
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

    $scope.openEndorseModal = function () {
        $scope.endorseModal.show();
    };

    $scope.closeEndorseModal = function () {
        $scope.endorseModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.endorseModal.remove();
    });

    //验证码获取模块
    $scope.verifyStr = "获取验证码";

    //弹出支付窗口
    $ionicModal.fromTemplateUrl('payPopup.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.payModal = modal;
    });

    $scope.openPayModal = function () {
        $scope.payModal.show();
    };

    $scope.closePayModal = function () {
        $scope.payModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.payModal.remove();
    });

    //选择成交页面
    $ionicModal.fromTemplateUrl('choicePayAccount.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.accountModal = modal;
    });

    $scope.openAccountModal = function (item) {
        $scope.accountModal.show();
        $scope.showFinishBidding(item);
    };

    $scope.closeAccountModal = function () {
        $scope.accountModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.accountModal.remove();
    });

    //评价界面
    $ionicModal.fromTemplateUrl('evaluate.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.evaluateModal = modal;
    });
    $scope.openEvaluateModal = function (item) {
        $scope.evaluateModal.show();
        if ($scope.billModel.bill_type_id == 101) {
            $scope.evaluateModel.bill_status_code = $scope.orderModel.bill_status_code;
            $scope.evaluateModel.order_status_id = $scope.orderModel.order_status_id;
            $scope.evaluateModel.type_id = $scope.orderModel.bill_type_id;
            $scope.evaluateModel.to_id = $scope.orderModel.id;
            if ($scope.orderModel.bill_status_code > 810) {
                enterprisesService.getorderAppraisal($scope.evaluateModel.type_id, $scope.evaluateModel.to_id).then(function (data) {
                        //swal("hello");
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                        //$scope.addevaluateModel = data;
                        //console.log(data.drawer_appraisal);
                    });
                }
        } else if ($scope.billModel.bill_type_id == 102) {
            $scope.evaluateModel.bill_status_code = $scope.billModel.bill_status_code;
            $scope.evaluateModel.type_id = $scope.billModel.bill_type_id;
            $scope.evaluateModel.to_id = $scope.billModel.id;
            if ($scope.evaluateModel.bill_status_code > 810) {
                enterprisesService.getorderAppraisal($scope.evaluateModel.type_id, $scope.evaluateModel.to_id).then(function (data) {
                        //swal("hello");
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                        //$scope.addevaluateModel = data;
                    });
                }
            
        };
    };

    $scope.closeEvaluateModal = function () {
        $scope.evaluateModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.evaluateModal.remove();
    });



    //弹出竞价窗口
    $ionicModal.fromTemplateUrl('bidPopup.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.bidModal = modal;
    });

    $scope.openBidModal = function () {
        $scope.bidModal.show();
        $scope.biddingModel = {
            bill_product_id: $scope.billModel.id,
            bid_enterprise_name: $rootScope.identity.enterprise_name,
        };
    };

    $scope.closeBidModal = function () {
        $scope.bidModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.bidModal.remove();
    });
   

    ////弹出竞价窗口
    //$scope.showAddBidding = function (item) {
        
    //    //$('#modal-addBidding').modal('show');
    //};
    
    //确认成交
    $scope.submitbillnew = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '是否线下已完成交易?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                billService.finishBillNew($scope.billModel.id).then(function (data) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: ' 已成功确认成交！'
                    });
                    $state.go("app.myReleaseElecAll")
                });
            }
        });
    }

    //贴息计算
    $scope.ratechange = function () {
        $scope.rateModel = {};
        if ($scope.biddingModel.bid_rate > 0 || $scope.biddingModel.bill_rate > 0) {
            var newDate = new Date();

            $scope.rateModel.start_time = $filter('date')(newDate, 'yyyy-MM-dd');
            $scope.rateModel.end_time = $filter('date')($scope.billModel.bill_deadline_time, 'yyyy-MM-dd');

            $scope.rateModel.denomination = $scope.billModel.bill_sum_price / 10000;
            $scope.rateModel.commission = 0;

            if ($scope.billModel.trade_type_code == 701) {
                if ($scope.billModel.bill_type_id == 102) {
                    $scope.rateModel.interest_month = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 3;
                } else if ($scope.billModel.bill_type_id == 101) {
                    $scope.rateModel.interest_year = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 0;
                }
                $scope.rateModel.every_plus = 0;

                toolService.calculator($scope.rateModel).then(function (data) {
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                });
            } else if ($scope.billModel.trade_type_code == 702) {
                $scope.rateModel.every_plus = $scope.biddingModel.bill_rate;

                toolService.calculator($scope.rateModel, 'ten').then(function (data) {
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                });
            }

        }
    };

    //新增报价信息
    $scope.addBidding = function () {
        if ($scope.billModel.trade_type_code == 702) {
            $scope.biddingModel.bid_rate = $scope.biddingModel.bill_rate;
        }
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            billService.getBillProductBidding($scope.billModel.id).then(function (data) {
                $scope.biddings = data;

            });
            setTimeout(function () {
                if ($scope.billModel.bill_type_id == 101) {
                    $ionicPopup.alert({
                        title: '提示',
                        template:' 报价成功！\n请等待出票方确认报价。'
                    });
                    $state.go("app.myBidding");
                } else if ($scope.billModel.bill_type_id == 102) {
                    $ionicPopup.alert({
                        title: '提示',
                        template:' 报价成功！ \n温馨提醒：报价后请及时联系出票方。'
                    });
                    $state.go("app.myBidding");
                }
            }, 350);
        });
    };

    //弹出选择成交窗口
    $scope.showFinishBidding = function (item) {
        $scope.accountModel = {
            account_person: $scope.billModel.drawer_name,
        }

        $scope.billModel.drawer_account_id = null;

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

       
    }

    $scope.finishBidding = function () {
        if ($scope.filter.rule == false) {
            return;
        }
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '确认选择该收票人进行交易吗?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                if ($scope.billModel.trade_type_code == 701 || ($scope.billModel.trade_type_code == 702 && $scope.billModel.bill_type_id == 102)) {
                    billService.newOrderBidding({ 'bill_product_id': $scope.billModel.id, 'bill_product_bidding_id': $scope.payModel.payId }).then(function (data) {
                        if ($scope.billModel.bill_type_id == 101) {
                            billService.getBillProduct($scope.billModel.id).then(function (data) {
                                $scope.filter.order_id = data.order_id;
                                orderService.updateOrderAccountDrawer($scope.filter.order_id, $scope.billModel.drawer_account_id).then(function () { });
                                $scope.billModel = data;

                                billService.getBillProductBidding($stateParams.myReleaseBillId).then(function (data) {
                                    $scope.biddings = data;
                                });
                            });
                            setTimeout(function () {
                                $ionicPopup.alert({
                                    title: '提示',
                                    template: '确认交易方成功！'
                                });
                                $state.go("app.myReleaseElecAll");
                                //});
                            }, 350);
                        } else {
                            $state.go("app.myReleaseElecAll");
                        }
                    });
                }
                if ($scope.billModel.trade_type_code == 702 && $scope.billModel.bill_type_id == 101) {
                    setTimeout(function () {
                        $ionicPopup.alert({
                            title: '提示',
                            template: '确认交易方成功！\n请先完善信息并提交审核，审核通过后直接进入交易状态！'
                        });
                        $state.go('app.drawBill', { id: $scope.billModel.id, bidId: $scope.payModel.payId, accountId: $scope.billModel.drawer_account_id });
                    }, 350);
                }
            }
        });
    }

    $scope.accountChangeBill = function () {
        //i = $scope.model.drawer_account_id.indexOf('_',0)+1;
        //s=$scope.model.drawer_account_id.substr(i, 100);
        customerService.getEnterpriseAccount($scope.billModel.drawer_account_id).then(function (data) {
            $scope.accountModel = data;
            $scope.filter.isaccount = 1;
        })
    }

    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })
    $scope.accountChange = function () {
        customerService.getEnterpriseAccount($scope.orderModel.receiver_account_id).then(function (data) {
            $scope.accountModel = data;
        })
    };
    //获取背书账号
    customerService.getAllEnterpriseAccount(502).then(function (data) {
        $scope.accounts = data;
        $scope.addressModel = {};
        $scope.addressModel.receiver_account_id = data[0].id;
    })

    $scope.pay = function () {
        if (!$scope.model.verify_code || $scope.model.verify_code.length != 6) {
            $ionicPopup.alert({
                title: '提示',
                template: '请输入正确的短信验证码！'
            });
        } else if (!$scope.orderModel.receiver_account_id) {
            $ionicPopup.alert({
                title: '提示',
                template: '请选择背书账号！'
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: '提示',
                template: '确定要支付票据款?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    var newWin = window.open('loading page');
                    orderService.updateOrderAccountReceiver($scope.orderModel.id, $scope.orderModel.receiver_account_id).then(function (data) {
                        orderService.updateOrderReceiver($scope.orderModel.id, $scope.orderModel).then(function () {
                            newWin.location.href = API_URL + '/orders/orderPay/' + $scope.orderModel.id.toString() + '?orderPayTypeId=' + '18768107194' + '&phone=' + '18768107194'+ '&verifyCode=' + $scope.model.verify_code.toString() + '&token=' + $rootScope.identity.token;
                            //window.open(API_URL + '/orders/orderPay/' + $scope.model.id.toString());$rootScope.identity.phone_number.toString()$rootScope.identity.phone_number.toString() 
                           $state.go("app.myBidding")
                        });
                    });
                
                }
            });
        }
    };

 
    //删除背书图片
    $scope.remove = function (index) {
        var confirmPopup = $ionicPopup.confirm({
            title: '警告',
            template: '确定要删除该文件吗?',
        });
        confirmPopup.then(function (res) {
            if(res){
                $scope.endorsements.splice(index, 1);
            };
        });
    };

    //上传出票方背书
    $scope.endorsement = function () {
        if (!$scope.model.verify_code || $scope.model.verify_code.length != 6) {
            //swal("请输入正确的短信验证码！");
            $ionicPopup.alert({
                title: '警告',
                template: '请输入正确的短信验证码！',
                okType: 'button-assertive',
            });
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '是否确认已背书?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                var model = {
                    endorsement_id_list: [],
                    endorsement_messages: [],
                    verify_code: $scope.model.verify_code
                };
                for (var i = 0; i < $scope.endorsements.length; i++) {
                    model.endorsement_id_list.push($scope.endorsements[i].endorsement_id);
                    model.endorsement_messages.push($scope.endorsements[i].endorsement_address);
                }
                orderService.orderEndorsement($scope.orderModel.id, model).then(function () {
                    //swal('出票方背书成功！');
                    $ionicPopup.alert({
                        title: '提示',
                        template: '出票方背书成功！',
                        okType: 'button-assertive',
                    });
                });
                //$scope.modal.hide();
                //window.location.reload();
                $state.go("app.myReleaseElecAll");
                //此处还要跳转
            }
        });
    };
    //增加背书
    $scope.model.endorsement_file = [];
    $scope.add = function (response) {
        //$timeout(function () {

            $scope.endorsements.push({
                endorsement_id: $scope.model.bill_front_photo_id,
                endorsement_address: $scope.model.bill_front_photo_path,
                //'endorsement_file_name': response.data.data.file_name
            });
            /*
            $scope.model.endorsement_file = $scope.endorsements;
            $timeout(function () {
                $('.jqzoom').imagezoom();
            });
            if ($scope.model.endorsement_file.length > 2) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '背书文件最多上传两张！',
                    okType: 'button-assertive',
                });
                return;
            }
            */
        //});
    }

    $scope.takePhoto = function (index) {
         $scope.$takePhoto(function (data) {
            $scope.model.bill_front_photo_path = data;
            $scope.$uploadPhoto($scope.model.bill_front_photo_path, function (data) {
                data = JSON.parse(data);
                $scope.model.bill_front_photo_id = data.data.id;
                $scope.model.bill_front_photo_path = data.data.file_path;
                $scope.add();
            });
         });
    };

    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    var second = 60;
    //发送验证码
    $scope.getVerify = function () {
        $scope.filter.phone_number = $rootScope.identity.phone_number;
        customerService.phoneVerify($scope.filter.phone_number).then(function () {
            $ionicPopup.alert({
                title: '提示',
                template: '验证码已发送！',
                okType: 'button-assertive',
            });
            $scope.second = 60;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 60);
        })
    };
   
    //确认签收
    $scope.showendorsements = function () {
        /*
        $('#modal-endorsements').modal('show');
        $timeout(function () {
            $('.jqzoom').imagezoom();
        });
        */
    }
    //签收背书
    $scope.validate = function () {
        //alert($rootScope.identity.token);
        var confirmPopup = $ionicPopup.confirm({
            title: '确认签收背书?',
            template: '如果未经核实进行操作，后果自负！！！'
        });
        confirmPopup.then(function (res) {
            if (res) {
                if ($scope.orderModel.order_pay_type == 1203) {
                    var newWin = window.open('loading page');
                    newWin.location.href = API_URL + '/orders/orderConfirm/' + $scope.orderModel.id.toString() + '?token=' + $rootScope.identity.token;
                    //init();
                    //window.location.reload();
                    //$('#modal-endorsements').modal('hide');
                    $ionicPopup.alert({
                        title: '提示',
                        template: '背书签收完成！',
                        okType: 'button-assertive',
                    });
                    $state.go("app.myReleaseElecAll");
                } else {
                    orderService.orderConfirm($scope.orderModel.id, $rootScope.identity.token).then(function () {
                        $ionicPopup.alert({
                            title: '提示',
                            template: '背书签收完成！',
                            okType: 'button-assertive',
                        });
                        $state.go("app.myBidding");
                        //init();
                        //window.location.reload();
                        //$('#modal-endorsements').modal('hide');
                    });
                }
            }
        });
    }
    $scope.chioceStar11 = function () {
        $scope.evaluateModel.star = 1;
    };

    $scope.chioceStar12 = function () {
        $scope.evaluateModel.star = 2;
    };

    $scope.chioceStar13 = function () {
        $scope.evaluateModel.star = 3;
    };

    $scope.chioceStar14 = function () {
        $scope.evaluateModel.star = 4;
    };

    $scope.chioceStar15 = function () {
        $scope.evaluateModel.star = 5;
    };

    $scope.showEvaluatesell = function () {
        enterprisesService.insertAppraisal($scope.evaluateModel).then(function (data) {
            if ($scope.filter.check == 1) {
                $state.go('app.myReleaseElecAll');
            } else if ($scope.filter.check == 2) {
                $state.go('app.myBidding');
            } else {
                $state.go('app.user');
            }
           
        });
    };
    //关注
    $scope.follow = function (follow) {
        $scope.followModel = {
            collection_bill_id: $scope.model.bill_id,
            is_collection_bill: follow
        }
        customerService.followBill($scope.followModel).then(function () {
            //$scope.model.is_collection_enterprise = follow;
        })
    }
})