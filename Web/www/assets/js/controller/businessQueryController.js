hpxAdminApp.controller('businessQueryController', function ($rootScope, $scope, $state, customerService, privilegeService, ngTableParams, payingService, toolService, API_URL) {
    $scope.filter = {
        choiceReCharge: 1,
    };
    $scope.query = function (name) {
        if (!name || name.length < 4) {
            swal("至少输入四个关键字！");
            return;
        }
        privilegeService.customerPrivilege({
            'privilege_id': 1
        }).then(function (data) {
            if (data.right == 0) {
                if (data.isuser == 0) {
                    //$('#modal-edit').modal('show'); // 前往登录
                    $('#modal-edit').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $('.h_login').show().siblings().hide();
                    return;
                } else {
                    if (data.enterprise_id <= 0) {
                        //$('#modal-edit').modal('show'); // 前往认证
                        $('#modal-edit').modal({
                            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                            keyboard: false,//键盘关闭对话框
                            show: true//弹出对话框
                        });
                        $('.h_renzheng').siblings().hide();
                        return;
                    } else {
                        //$('#modal-edit').modal('show'); // 前往充值
                        $('#modal-edit').modal({
                            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                            keyboard: false,//键盘关闭对话框
                            show: true//弹出对话框
                        });
                        $('.prompt').siblings().hide();
                        $scope.hpxCharge = function () {
                            $scope.model = newEntity;
                            //$('#modal-edit').modal('show');
                            $('#modal-edit').modal({
                                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                                keyboard: false,//键盘关闭对话框
                                show: true//弹出对话框
                            });
                            $('.h_zhifu').show().siblings().hide();
                        }

                    }
                }
            }
            else {
                customerService.enterpriseDetail(name, 1).then(function (data) {
                    $scope.enterpriseInfo = data;
                    if (data == null) {
                        swal("暂无企业信息！");
                    }
                });
            }
        })
    }

    // 现金购买
    $scope.money = function () {
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_buy').show().siblings().hide();
        // 查询套餐
        privilegeService.privilegePackage({
            'privilege_id': 1
        }).then(function (data) {
            $scope.package = data
        })
        return;
    }

    $scope.refresh = function () {
        $('.h_bty section').eq(0).find('input[name = "sex"]').attr('checked', 'true')
    }

    // 点击购买
    $scope.buy = function () {
        //获取账户余额
        payingService.GetPlatformAccount().then(function (data) {
            $scope.model = data;
            var price = $scope.price || 30;
            var hitems = $scope.items || 1;
            if ($scope.model.platform_account_balance >= $scope.price) {
                privilegeService.privilegePackOrder({
                    'enterprise_id': $rootScope.identity.enterprise_id,
                    'customer_id': $rootScope.identity.customer_id,
                    'package_id': $scope.items
                }).then(function (data) {
                    //$('#modal-edit').modal('show');
                    $('#modal-edit').modal({
                        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                        keyboard: false,//键盘关闭对话框
                        show: true//弹出对话框
                    });
                    $('.h_chenggong').show().siblings().hide();
                })
            } else {
                //$('#modal-edit').modal('show');
                $('#modal-edit').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
                $('.noMoney').show().siblings().hide();
            }
        });
    }
    // 弹窗中的点击事件
    $scope.hpxLgoin = function () {
        $state.go('app.loginInfo');
        //window.location.href = "index.html#/app/loginInfo";
        window.location.reload();
    }
    $scope.phxRenzheng = function () {
        $state.go('app.main.customerInfo')
        //window.location.href = "index.html#/app/main/customerInfo";
        window.location.reload();
    }
    $scope.invitation = function () {
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.frient').show().siblings().hide();
    }
    $scope.recharge = function () {
        $scope.model = newEntity;
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_zhifu').show().siblings().hide();
    }

    $scope.queding = function () {
        window.location.reload();
    }
    // 选择套餐
    $('.h_bty').delegate('.h_o', 'click', function (data) {
        items = $("input:radio[name='sex']:checked").next().val();
        price = $("input:radio[name='sex']:checked").next().attr("price");
        $scope.items = items
        $scope.price = price
        $('.hp_money span').text(price)
    })
    // 支付宝充值
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    // 获取账户充值记录
    $scope.tableParams = new ngTableParams({ 'sorting': { 'change_time': 'desc' } }, {
        getData: function (params) {
            return payingService.platformAccountBalance(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    $scope.XYRecharge = function () {
        window.open('http://www.cibfintech.com/');
    }
    //打开一个新页面，进行充值活动
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);
        $('#modal-edit').modal('hide');
    };
    $scope.choiceReCharge = function (number) {
        $scope.filter.choiceReCharge = number;
    };
    $scope.hpxCharge = function () {
        $scope.model = newEntity;
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
        $('.h_zhifu').show().siblings().hide();
    }
    //查看详情
    $scope.read = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.model = data;
            //$('#modal-read').modal('show');
            $('#modal-read').modal({
                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                keyboard: false,//键盘关闭对话框
                show: true//弹出对话框
            });
        });
    };
});
