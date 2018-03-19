hpxAdminApp.controller('headerController', function ($rootScope, $scope, $state, Restangular, customerService, localStorageService) {
    //退出登录功能，退出后跳转到网站首页
    $scope.logout = function () {
        if (confirm('确认要退出登录吗？')) {
            customerService.customerLogout().then(function () {
                localStorageService.set('customer', null);
                $rootScope.identity = null;
                Restangular.setDefaultHeaders({});
                $state.go('home');
            });
        }
    };

});
