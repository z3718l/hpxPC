hpxAdminApp.controller('loginInfoController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService, $cookieStore, Restangular,$http) {
    $scope.model = {};
    $scope.loginInfo = function () {
        customerService.customerLoginEnterprise($scope.model).then(function (result) {
            data = result.enterprises;
            if (data.length == 1 && data[0].enterprise_id != -1) {
                $scope.model.enterprise_id = data[0].enterprise_id;
                customerService.customerLogin($scope.model).then(function (data) {
                    $cookieStore.put('customer', data);
                    $rootScope.identity = data;
                    Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + $rootScope.identity.token });
                    $state.go("app.main.accountInfo");
                })
            } else if (data.length == 1 && data[0].enterprise_id == -1) {
                $scope.model.enterprise_id = data[0].enterprise_id;
                customerService.customerLogin($scope.model).then(function (data) {
                    $state.go("app.main.accountInfo");
                })
            } else if (data.length >= 2) {
                //$('#modal-addBidding').modal('show');
                $('#modal-addBidding').modal({
                    backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
                    keyboard: false,//键盘关闭对话框
                    show: true//弹出对话框
                });
            }
        })
    }
});
