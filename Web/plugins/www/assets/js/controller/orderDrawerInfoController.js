hpxAdminApp.controller('orderDrawerInfoController', function ($rootScope, $scope, $state, $timeout, $stateParams, $interval, FILE_URL, Upload, ngTableParams, orderService, customerService, payingService, billService) {
    $scope.filter = {
        buttonClicked:0,
    };
    $scope.model = {
        order_pay_type_id: 1202,
    };
    //获取出票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }
    init = function () {
        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;

            //if ($scope.model.bill_flaw_ids[0]==1500) {
            //    $scope.model.bill_flaw_names[0] = "无瑕疵";
            //}
            //$scope.model.remaining_day = $scope.model.remaining_day + 1;

            //if ($scope.model.bill_type_id == 101) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.bid_rate * $scope.model.remaining_day / 100 / 360).toFixed(3);
            //} else if ($scope.model.bill_type_id == 102) {
            //    $scope.model.bid_rate_price = ($scope.model.bill_sum_price * $scope.model.bid_rate * $scope.model.remaining_day / 1000 / 30).toFixed(3);
            //}
            //$scope.model.bid_deal_price = $scope.model.bill_sum_price - $scope.model.bid_rate_price;
            //$scope.model.order_total_price = $scope.model.bid_deal_price;


            if ($scope.model.order_status_id == 804) {
                $scope.model.order_status_name = "确认交易对手";
                //等待时间
                waitTime();
                //var newdate = new Date().getTime();
                //var waitdate = newdate - $scope.model.order_time;
                //if (waitdate > 60 * 1000) {
                //    var waitTime = new Date(waitdate);
                //    $scope.filter.waitTimeD = waitTime.getDate();
                //    if ($scope.filter.waitTimeD > 2) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24 ;
                //    } else if ($scope.filter.waitTimeD > 1) {
                //        $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
                //    } else {
                //        $scope.filter.waitTimeH = waitTime.getHours()-8;
                //    }
                //    $scope.filter.waitdateM = waitTime.getMinutes();
                //    $scope.filter.waitdateS = waitTime.getSeconds();
                //    $scope.filter.differential = 60 - $scope.filter.waitdateS;

                //    $interval(function () {
                //        if($scope.filter.waitdateS<59){
                //            $scope.filter.waitdateS++;
                //        } else if ($scope.filter.waitdateS >= 60) {
                //            $scope.filter.waitdateS = $scope.filter.waitdateS % 60;
                //        }
                //        if ($scope.filter.waitdateS == 59) {
                //            //$scope.filter.waitdateS = $scope.filter.waitdateS % 60;
                //            init();
                //            //window.location.reload();
                //        }
                //    }, 1000);
                //} else {
                //    $scope.filter.waitTimeH = 0;
                //    $scope.filter.waitdateM = 0;
                //    $scope.filter.waitdateS = 0;
                //}
            }

            if ($scope.model.bill_status_code < 807) {
                $scope.model.bill_status_name = "未背书";
            } else if ($scope.model.bill_status_code >= 807) {
                $scope.model.bill_status_name = "已背书";
            }

            if ($scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
                //等待时间
                waitTime();
            }
            //获取评价
            //if ($scope.model.order_status_id >= 810) {
            //    if ($scope.model.bill_type_id == 101) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (result) {
            //            $scope.drawerAppraisalModel = result.drawer_appraisal;
            //            $scope.receiverAppraisalModel = result.receiver_appraisal;
            //        });
            //    } else if ($scope.model.bill_type_id == 102) {
            //        enterprisesService.getorderAppraisal($scope.model.bill_type_id, $scope.model.id).then(function (result) {
            //            $scope.drawerAppraisalModel = result.drawer_appraisal;
            //            $scope.receiverAppraisalModel = result.receiver_appraisal;
            //        });
            //    }
            //}

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            });
        });
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
    //interval = function () {
    //    if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 806 || $scope.model.order_status_id == 807 || $scope.model.order_status_id == 808) {
    //        $interval(function () {
    //            //if ($scope.filter.waitdateS < 59) {
    //            //    $scope.filter.waitdateS++;
    //            //} else if ($scope.filter.waitdateS >= 60) {
    //            //    $scope.filter.waitdateS = $scope.filter.waitdateS % 60;
    //            //}
    //            waitTime();
    //            if ($scope.filter.waitdateS == 59) {
    //                init();
    //            }
    //        }, 1000);
    //    }
    //}
    //interval();
    

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

    customerService.getAllEnterpriseAccount(501).then(function (data) {
        $scope.accounts = data;
    })
    //弹出背书窗口
    $scope.showEndorsement = function () {
        $scope.endorsements = [];

        $scope.model.drawer_account_id = null;
        $('#modal-endorsement').modal('show');

        $scope.filter.buttonClicked = 1;

        $timeout(function () {
            $('.jqzoom').imagezoom();
        });
    };
    //文件上传
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
    //增加背书
    $scope.model.endorsement_file = [];
    $scope.add = function (response) {
        $timeout(function () {
            $scope.endorsements.push({
                'endorsement_id': response.data.data.id,
                'endorsement_address': response.data.data.file_path,
                'endorsement_file_name': response.data.data.file_name
            });
            $scope.model.endorsement_file = $scope.endorsements;
            $timeout(function () {
                $('.jqzoom').imagezoom();
            });
            if ($scope.model.endorsement_file.length > 2) {
                swal("背书文件最多上传两张");
                return;
            }
        });
    }
    //删除背书图片
    $scope.remove = function (index) {
        swal({
            title: "确定要删除该文件吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            $scope.endorsements.splice(index, 1);
        });
    };
    //上传出票方背书
    $scope.endorsement = function () {
        //if (!$scope.model.drawer_account_id) {
        //    swal("请选择收款账号！");
        //    return;
        //}
        if (!$scope.model.verify_code || $scope.model.verify_code.length != 6) {
            swal("请输入正确的短信验证码！");
            return;
        }
        swal({
            title: "是否确认已背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            var model = {
                endorsement_id_list: [],
                endorsement_messages: [],
                //drawer_account_id: $scope.model.drawer_account_id,
                verify_code: $scope.model.verify_code
            };
            for (var i = 0; i < $scope.endorsements.length; i++) {
                model.endorsement_id_list.push($scope.endorsements[i].endorsement_id);
                model.endorsement_messages.push($scope.endorsements[i].endorsement_message);
            }
            //orderService.updateOrderAccountDrawer($scope.model.id, $scope.model.drawer_account_id).then(function (data) {
            orderService.orderEndorsement($scope.model.id, model).then(function () {
                swal('出票方背书成功！');
                window.location.reload();
                //init();
                $('#modal-endorsement').modal('hide');
                //$('#modal-edit').modal('hide');
            });
            //});
        });
    };
    //删除已上传的出票方背书
    $scope.deleteEndorsement = function () {
        swal({
            title: "是否要删除已上传的出票方背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            orderService.deleteOrderEndorsement($scope.model.id).then(function () {
                swal('背书删除成功，请重新上传！');

                init();
                $('#modal-edit').modal('hide');
            });
        });
    };
    //发布方评价
    $scope.showEvaluatesell = function () {
        //$scope.evalutesell = {};
        $state.go('app.main.evaluate', { type_id: $scope.model.bill_type_id, to_id: $scope.model.id, gettype: 1 });
    };

    //$scope.enterprise=[]
    //$scope.enterprise.push({
    //    'type_id': $scope.model.bill_type_id,
    //    'to_id':$scope.model.order_id,
    //    'star':$scope.model.star,
    //    'description':$scope.model.description,
    //});
  
    //追加评价
    $scope.showaddEvaluatesell = function () {
        $scope.addevaluatesell = {};
        $('#modal-addevaluatesell').modal('show');
    }
    //弹出更新物流信息窗口
    $scope.showLogistic = function () {
        $scope.logisticModel = {};
        $('#modal-logistic').modal('show');
    };
    //更新物流信息
    $scope.addLogistic = function () {
        orderService.orderLogistics($scope.model.id, $scope.logisticModel).then(function () {
            swal('更新物流信息成功！');

            init();
            $('#modal-logistic').modal('hide');
        });
    };

    
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
    //选择收款账户
    $scope.accountChange = function () {
        customerService.getEnterpriseAccount($scope.model.drawer_account_id).then(function (data) {
            $scope.accountModel = data;
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
        } else {
            accordion.className = "accordionhide";
        }
    }
    //确认成交
    $scope.submitbillnew = function () {
        billService.finishBillNew($scope.model.id).then(function (data) {
            swal("已成功确认成交！");
            window.location.reload();
        });
    }

});
