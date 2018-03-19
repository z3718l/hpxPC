hpxAdminApp.controller('orderReceiverController', function ($rootScope, $scope, $state, API_URL, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取我的收票订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return orderService.getOwnOrderReceiver(params).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取收票订单对应id的票据详情
    $scope.read = function (item) {
        orderService.getOrder(item.id).then(function (data) {
            $scope.model = data;
        });
    };
});
