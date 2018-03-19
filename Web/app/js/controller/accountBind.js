ionicApp.controller('accountBindController', function ($scope, $rootScope, $state, $ionicPopup, customerService, constantsService, payingService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    //获取所有的银行账户信息，并显示是否为默认银行账户
    payingService.getAccount($rootScope.identity.enterprise_id).then(function (data) {
        if (data.acct_list) {
            $scope.AccountData = data.acct_list;
            for (var i = 0; i < $scope.AccountData.length; i++) {
                if ($scope.AccountData[i].is_default == 1) {
                    $scope.AccountData[i].is_default = "是";
                } else {
                    $scope.AccountData[i].is_default = null;
                }
            }
        }
    });
    $rootScope.accountTypeCode = 501
    //卖方买方class改变
    $scope.changeType = function (accountTypeCode) {
        $rootScope.accountTypeCode = accountTypeCode;
        //获取所有的银行账户信息，并显示是否为默认银行账户
        //getAllEnterpriseAccount()
        payingService.getAccount($rootScope.identity.enterprise_id).then(function (data) {
            if (data.acct_list) {
                $scope.AccountData = data.acct_list;
                for (var i = 0; i < $scope.AccountData.length; i++) {
                    if ($scope.AccountData[i].is_default == 1) {
                        $scope.AccountData[i].is_default = "是";
                    } else {
                        $scope.AccountData[i].is_default = null;
                    }
                }
            }
        });
    }
    //获取账户类型
    constantsService.queryConstantsType(5).then(function (data) {
        $scope.accountTypeData = data;
    })

})