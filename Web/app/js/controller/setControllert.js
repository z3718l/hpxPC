ionicApp.controller('setController', function ($scope, $rootScope, $state, $ionicPopup, localStorageService) {
    $scope.loginOut = function () {
        if ($rootScope.identity) {
            $rootScope.loginRequestEnter = null;
            $rootScope.enterprises = null;
            $rootScope.identity = null;
            localStorageService.set('customer', null);
            $ionicPopup.alert({
                title: '提示',
                template: '登出成功!',
                okType: 'button-assertive',
            });
        }
    }
})