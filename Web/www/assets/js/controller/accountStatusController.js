hpxAdminApp.controller('accountStatusController', function ($scope, $rootScope, $state, $cookieStore, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    console.log($scope);
    $scope.filter = {
        stateGo:false
    }
    $scope.isLoging = true;
    //获取自己的注册资料
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        if ($scope.model.is_verified < 2 && $scope.model.is_verified != -1) {
            $scope.isLoging = false;
        }
        if (!$scope.model.id_front_photo_address) {
            $scope.model.id_front_photo_address = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.id_back_photo_address) {
            $scope.model.id_back_photo_address = 'assets/img/hpx-15.jpg';
        }
        
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id != 0 && ($scope.singleEnterprise.enterprise_id != null || $scope.enterpriseModel.is_verified != 0)) {
                    // 根据企业id查询经办人信息
                    payingService.getAgentTreasurer($scope.singleEnterprise.enterprise_id).then(function (agentData) {
                        if (agentData) {
                            $scope.agentModel = agentData;
                            if ($scope.agentModel.isChecked == 0 || $scope.agentModel.isChecked == 1 || $scope.agentModel.isChecked == -1) {
                                $scope.isViewEdit = true;
                            }
                            if($scope.agentModel.isChecked == 1){
                                $scope.filter.stateGo = true;
                            }
                        }
                    });
                    // 根据企业信息查询银行卡信息
                    payingService.getAccount($scope.singleEnterprise.enterprise_id).then(function (accountData) {
                        $scope.isLoging = false;
                        if (accountData) {
                            $scope.AccountData = accountData.acct_list;
                        } else {
                            $scope.AccountData = ""
                        }
                    })
                }
            })
        }

    });
    // 企业信息验证
    $scope.checkEnterprise = function () {
        if ($scope.model.is_verified == 0) {
            swal({
                "title": "请完善联系人信息！",
                confirmButtonText: "OK",
            }, function () {
                $state.go("app.main.approveCustomer");
            })
        } else {
            $state.go("app.main.approveEnterprise");
        }
    }
    // 经办人信息验证
    $scope.checkAgent = function () {
        if ($scope.model.is_verified == 0) {
            swal({
                "title": "请完善联系人信息！",
                confirmButtonText: "OK",
            }, function () {
                $state.go("app.main.approveCustomer");
            })
        } else if ($scope.model.is_verified < 2) {
            swal({
                "title": "请进行机构认证！",
                confirmButtonText: "OK",
            }, function () {
                $state.go("app.main.approveEnterprise");
            })
        } else {
            $state.go("app.main.approveAgent");
        }
    }
    // 账户绑定
    $scope.checkBind = function () {
        if ($scope.model.is_verified == 0) {
            swal({
                "title": "请完善联系人信息！",
                confirmButtonText: "OK",
            }, function () {
                $state.go("app.main.approveCustomer");
            })
        } else if ($scope.model.is_verified < 2) {
            swal({
                "title": "请进行机构认证！",
                confirmButtonText: "OK",
            }, function () {
                $state.go("app.main.approveEnterprise");
            })
        } else if (!$scope.agentModel) {
            swal({
                "title": "请进行业务授权！",
                confirmButtonText: "OK",
            }, function () {
                $state.go("app.main.approveAgent");
            })
        } else {
            $state.go("app.main.approveAccount");
        }
    }
    // 鉴权
    $scope.authentication = function () {
        // 企业或者业务授权没有成功，无法进行鉴权
        if ($scope.enterpriseModel.is_verified == 2) {
            swal("企业正在审核，请联系客服人员！");
            return;
        }
        if ($scope.enterpriseModel.is_verified == -1) {
            swal("企业审核失败，请联系客服人员！");
            return;
        }
        if ($scope.agentModel.isChecked == 0) {
            swal("业务授权正在审核，请联系客服人员！");
            return;
        }
        if ($scope.agentModel.isChecked == -1) {
            swal("业务授权审核失败，请联系客服人员！");
            return;
        }
        $('#modal-authentication').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    $scope.smallValid = function () {
        $scope.valid.account_type_code = '501';
        payingService.checkAccount($scope.enterpriseModel.enterprise_id, $scope.valid.verify_string, $scope.valid.account_type_code).then(function (data) {
            swal({
                "title": "小额验证通过。\n 退出重新登录进行电票交易",
                confirmButtonText: "OK",
            }, function () {
                //window.location.reload();
                $rootScope.identity = null;
                $cookieStore.put('customer', null);
                window.location.href = '/index.aspx';
            })
        });
    }
    
    // 显示个人信息
    $scope.infoModel = function () {
        // 判断是否已经进行业务授权
        if ($scope.filter.stateGo) {
            $('#modal-info').modal({
                backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                keyboard: false,//键盘关闭对话框
                show: true//弹出对话框
            })
        } else {
            $state.go('app.main.approveCustomer');
        }
        
    }
    // 机构详情
    $scope.enterDetail = function () {
        $('#modal-enterprise').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    // 业务授权详情
    $scope.authorizaDetail = function () {
        $('#modal-busAuthoriza').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
});