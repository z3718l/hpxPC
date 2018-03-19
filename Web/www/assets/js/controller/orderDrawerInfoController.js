hpxAdminApp.controller('orderDrawerInfoController', function ($rootScope, $scope, $state, $timeout, $stateParams, $interval, FILE_URL,XingYe_URL, Upload, ngTableParams, orderService, customerService, payingService, billService, toolService) {
    $scope.filter = {
        buttonClicked: 0,
        rote:1
    };
    $scope.model = {
        order_pay_type_id: 1202,
    };
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
    //获取出票订单详情
    if ($stateParams.id) {
        $scope.filter.id = $stateParams.id;
    }
    
    init = function () {
        toolService.getSystemTime().then(function (date) {
            var newSystemDate = new Date().getTime();
            difference = newSystemDate - date;

        });
        orderService.getOrder($scope.filter.id).then(function (data) {
            $scope.model = data;
            orderService.getOrderTime($scope.model.id).then(function (data) {
                $scope.hpxDatekx = data.duration;
                $scope.hpxDateky = data.status;
                $scope.hpxDateTime = data.time;
                var timejson = data.time;
                $scope.hpxDates = [];
                angular.forEach(timejson, function (data) {
                    $scope.hpxDates[data.id] = data.TIME;              
                });
            })

            //根据票据查询双方银行卡
            //payingService.getAccountPY($scope.model.bill_id).then(function (data) {
            //    $scope.hpxGetAcc = data;
            //    $scope.hfindAccX = data.drawerAccount;
            //    $scope.hfindAccY = data.receiverAccount;
            //})

            if ($scope.model.order_status_id == 804 || $scope.model.order_status_id == 805) {
                $scope.model.order_status_name = "确认交易对手";
                //等待时间
                waitTime();
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

            $timeout(function () {
                if ($scope.model.bill_front_photo_path) {
                    $('.jqzoom').imagezoom();
                }
            },300);
        });
    }
    init();
   

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
            if ($scope.model.endorsement_file.length > 1) {
                swal("背书文件最多上传一张");
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
        swal({
            title: "是否确认已背书?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            //var model = {
            //    endorsement_id_list: [],
            //    endorsement_messages: [],
            //    //drawer_account_id: $scope.model.drawer_account_id,
            //    verify_code: $scope.model.verify_code
            //};
            //for (var i = 0; i < $scope.endorsements.length; i++) {
            //    model.endorsement_id_list.push($scope.endorsements[i].endorsement_id);
            //    model.endorsement_messages.push($scope.endorsements[i].endorsement_message);
            //}
            //orderService.updateOrderAccountDrawer($scope.model.id, $scope.model.drawer_account_id).then(function (data) {
            orderService.orderEndorsement($scope.model.id).then(function () {
                //$(".clokykm").fadeIn();
                //$(".swal").fadeIn();
                swal({
                    title: "出票方背书成功！",
                    confirmButtonText: "OK",
                }, function () {
                    window.location.reload();
                })
            });
            //});
        });
    };
    //删除已上传的出票方背书
    //$scope.renow = function () {
    //    $('#modal-endorsement').fadeOut();
    //    $(".clokykm").fadeOut();
    //    window.location.reload();
    //}
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

  
    //追加评价
    $scope.showaddEvaluatesell = function () {
        $scope.addevaluatesell = {};
        //$('#modal-addevaluatesell').modal('show');
        $('#modal-addevaluatesell').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    }
    //弹出更新物流信息窗口
    $scope.showLogistic = function () {
        $scope.logisticModel = {};
        //$('#modal-logistic').modal('show');
        $('#modal-logistic').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
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
            $scope.filter.rote = 1;
        } else {
            accordion.className = "accordionhide";
            $scope.filter.rote = 1;
        }
    }
    //确认成交
    $scope.submitbillnew = function () {
        billService.finishBillNew($scope.model.id).then(function (data) {
            swal("已成功确认成交！");
            window.location.reload();
        });
    }

    //var xingyeP = '193d3bd5e393432eb9724567ed810caf';
    $scope.identifySubmit = function () {
        //http://ufm-test.cibfintech.com/bizmgr/system/login/246d06008c4f4e14afd4d204bb507e5e/
        window.open(XingYe_URL + $rootScope.identity.corp_id);
    }

});
