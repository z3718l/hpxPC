ionicApp.controller('addAccountController', function ($scope, $rootScope, $state, $ionicPopup, bankService, addressService, customerService, payingService, $ionicModal) {

    $scope.model = {
        enterprise_person: $rootScope.identity.enterprise_name,
        enterpriseId: $rootScope.identity.enterprise_id,
        account_type_code: $rootScope.accountTypeCode,
    };
    //账户验证
    $scope.verifyStr = "账户验证";
    $scope.disableVerify = false;
    $scope.getVerifyh = function () {
        if (!$scope.model.account_person) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入银行名称！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.model.bank_number) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入开户行行号！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.model.account_number) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入账号！',
                okType: 'button-assertive',
            });
            return;
        }
        payingService.getAccount($scope.model.enterpriseId).then(function (data) {
            $scope.verifyStr = "正在验证";
            $scope.disableVerify = true;
            if (!data.acct_list || data.acct_list.length == 0) {
                payingService.openAccount($scope.model.enterpriseId, $scope.model).then(function (data) {
                    if (data && data != null) {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '审核通过，等待小额验证！',
                            okType: 'button-assertive',
                        });
                    }
                });
            } else if (data.acct_list.length == 1) {
                payingService.addMoreAccount($scope.model.enterpriseId, $scope.model).then(function (data) {
                    if (data && data != null) {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '审核通过，等待小额验证！',
                            okType: 'button-assertive',
                        });
                    }
                });
            }
        })

    }

    //完成绑定
    $scope.submitbinding = function () {
        if ($scope.model.id == null) {
            $scope.model.is_default = 0;
        } else {
            $scope.model.is_default = 1;
        }
        payingService.checkAccount($scope.model.enterpriseId, $scope.model.verify_string, $scope.model.is_default, $scope.model.account_type_code).then(function (data) {
            $scope.identifyModel = data;
            //console.log(data)
            $scope.identifyModel.enterprise_name = $rootScope.identity.enterprise_name;
            $scope.openTipModal()
        });
    }

    //成功提示弹框
    $ionicModal.fromTemplateUrl('successTip.html', {
        scope: $scope,
    }).then(function (modal) {
        $scope.tipModal = modal;
    });

    $scope.openTipModal = function () {
        if (img_path) {
            $scope.tipModal.show();
        }
    }

    $scope.closeTipModal = function () {
        $scope.tipModal.hide();
        $state.go('app.accountBind');
    }
})