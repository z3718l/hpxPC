hpxAdminApp.controller('menuController', function ($rootScope, $scope, $state, customerService, payingService) {
    customerService.getCustomer().then(function (data) {
        $scope.customerModel = data;
        if (data.id != 0) {
            customerService.SingleEnterprise(data.id).then(function (enterpriseData) {
                $scope.menuEnterprise = enterpriseData;
                if (enterpriseData.enterprise_id != 0 || enterpriseData.enterprise_id != "") {
                    payingService.getAgentTreasurer(enterpriseData.enterprise_id).then(function (agentModel) {
                        $scope.menuAgent = agentModel;
                    })
                }
            })
        }
    });
    $scope.checkCustomer = function () {      //点击企业审核
        if ($scope.customerModel.is_verified == 0) {
            swal({
                title: "您的联系人信息未完善",
                confirmButtonText:"OK"
            }, function () {
                $state.go("app.main.customerInfo");
            })
        } else {
            $state.go("app.main.enterpriseInfo");
        }
    }
    $scope.checkEnterprise = function () {    //点击账户绑定
        if ($scope.customerModel.is_verified == 0) {
            swal({
                title: "您的联系人信息未完善",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.customerInfo");
            })
        } else if ($scope.menuEnterprise.enterprise_id == 0 || $scope.menuEnterprise.enterprise_id == "") {
            swal({
                title: "您还未进行企业审核",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else if ($scope.menuEnterprise.is_verified == -1) {
            swal({
                title: "您的企业审核未通过",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else if ($scope.agentModel.isChecked == null || $scope.agentModel.isChecked == "") {
            swal({
                title: "您还未进行业务授权",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else if ($scope.agentModel.isChecked == -1) {
            swal({
                title: "您的业务授权失败",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.enterpriseInfo");
            })
        } else {
            $state.go("app.main.enterpriseAccountInfo");
        }
    }
    // 点击操作员
    $scope.checkOperater = function () {
        if ($scope.menuEnterprise.is_alive < 3) {
            swal({
                title: "您的实名注册未完成",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.accountStatus");
            })
        } else {
            $state.go("app.main.operater");
        }
    }
    // 点击--电子账户
    $scope.eleAccount = function () {
        if ($scope.menuEnterprise.is_alive <= 3) {
            swal({
                title: "您的实名注册未完成",
                confirmButtonText: "OK"
            }, function () {
                $state.go("app.main.accountStatus");
            })
        } else {
            $state.go("app.main.electronicAccount");
        }
    }
});
