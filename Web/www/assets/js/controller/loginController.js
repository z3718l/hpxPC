// JavaScript source code
hpxAdminApp.controller('loginController', function ($scope, $rootScope, $state, Restangular, userService, $cookieStore,localStorageService) {
    $rootScope.setting.layout.pageWithoutHeader = true;
    $rootScope.setting.layout.paceTop = true;
    $rootScope.setting.layout.pageBgWhite = true;
    //登录
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 0 && keycode != 1 && keycode != 13 && keycode != undefined) {
            return;
        }
        var user = userService.login($scope.loginRequest).then(function (data) {
            var identity = {
                role_name:data.role_name,
                token:data.token,
                username:data.username
            };
            localStorageService.set("systemMenus", data.menus);
            $cookieStore.put('identity', identity);
            $rootScope.identity = identity;
            $rootScope.systemMenus = data.menus;

            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.constants.checkBill');       //跳转到票据审核界面
        });
    };
});
