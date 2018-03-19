hpxAdminApp.controller('rechargeController', function ($scope, $rootScope, $state, API_URL, ngTableParams, payingService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };
    //获取账户充值记录
    $scope.tableParams = new ngTableParams({ 'sorting': { 'change_time': 'desc' } }, {
        getData: function (params) {
            return payingService.platformAccountBalance(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //获取账户余额
    payingService.GetPlatformAccount().then(function (data) {
        $scope.model= data;
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //弹出充值窗口
    $scope.recharge = function () {
        $scope.model = newEntity;
        $('#modal-edit').modal('show');
    };
    //打开一个新页面，进行充值活动
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&customerId=' + $rootScope.identity.customer_id);
        $('#modal-edit').modal('hide');
    };
});