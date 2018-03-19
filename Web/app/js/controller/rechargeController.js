ionicApp.controller('rechargeController', function ($scope, $rootScope, $ionicPopup,$state, $http, API_URL) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.model = {};
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);

       // $state.go("app.rechargePay");
        //alert($rootScope.rechargePayForm);
    };
})