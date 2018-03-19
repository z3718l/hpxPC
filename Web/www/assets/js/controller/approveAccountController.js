hpxAdminApp.controller('approveAccountController', function ($scope, $rootScope, $state, Upload,$cookieStore, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        // 通过SingleEnterprise接口查询客户信息
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id != 0 && ($scope.singleEnterprise.enterprise_id != null || $scope.enterpriseModel.is_verified != 0)) {
                    // 根据企业id查询经办人信息
                    payingService.getAgentTreasurer($scope.singleEnterprise.enterprise_id).then(function (agentData) {
                        $scope.agentModel = agentData;
                        $scope.accountModel = {};
                    });
                    // 根据企业信息查询银行卡信息
                    payingService.getAccount($scope.singleEnterprise.enterprise_id).then(function (accountData) {
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
    // 账户绑定
    $scope.filter = {
        isView: false
    }
    // 根据支行行号查询银行名称
    $scope.findNumber = function () {
        if ($scope.accountModel.cnaps_code) {
            if ($scope.accountModel.cnaps_code.length == 12) {
                bankService.getBanks($scope.accountModel.cnaps_code).then(function (data) {
                    if (data.bank_branch_name) {
                        $scope.bankModel = data.bank_branch_name;
                    } else {
                        $scope.filter.isView = true;
                        $scope.bankModel = "";
                    }
                })
            } else {
                //alert("1")
                $scope.bankModel = "";
            }
        } else if (!$scope.accountModel.cnaps_code || $scope.accountModel.cnaps_code.length == 0) {
            $scope.filter.isView = false;
            $scope.bankModel = "";
        }

    }
    $scope.saveAccount = function () {
        $scope.accountModel.account_type_code = "501";
        payingService.saveAccount($scope.accountModel).then(function (data) {
            swal({ 'title': '账户提交成功，请等待鉴权！\n 退出重新登录进行电票发布。' }, function () {
                //window.location.reload();
                //$state.go("app.main.accountStatus");
                // 等待鉴权的时候，强制退出
                $rootScope.identity = null;
                $cookieStore.put('customer', null);
                window.location.href = '/index.aspx';
            })
        })
    }
});