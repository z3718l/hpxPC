hpxAdminApp.controller('queryenterpriseController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //登录事件
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //登录功能，登录成功后跳转到个人中心
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            $cookieStore.put('customer', data);
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };


    $scope.submitEnterprise = function () {
        if ($scope.enterpriseModel.keyword.length < 4) {
            swal("至少输入四个关键字！");
            return;
        } else {
            customerService.enterpriseDetail($scope.enterpriseModel.keyword).then(function (data) {  
                $scope.enterpriseResult = data[0];
            })
        }
    }
});
