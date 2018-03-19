hpxAdminApp.controller('orderDrawerController', function ($rootScope, $scope, $timeout, $state, FILE_URL, Upload, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取我的出票订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return orderService.getOwnOrderDrawer(params).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
            
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取出票订单对应id的详细信息
    $scope.read = function (item) {
        orderService.getOrder(item.id).then(function (data) {
            $scope.model = data;
        });
    };
});
