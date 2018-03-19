hpxAdminApp.controller('baofooAccountController', function ($interval,$rootScope, $scope, $state, API_URL, NgTableParams, billService, constantsService, payService, customerService) {

    $scope.filter={
        keyword:'',
        phone:''
    }
    //获取所有宝付账户
    $scope.tableParams = new NgTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return payService.getAllEnterpriseBaofoo(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    }); 

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }


    //获取某条详细信息，弹出审核窗口
    $scope.check = function (item) {
        $scope.model = angular.copy(item);
        $('#modal-check').modal('show');
    };

    $scope.save = function () {
        payService.updateEnterpriseBaofoo($scope.model).then(function (result) {
            $('#modal-check').modal('hide');
            $scope.tableParams.reload();
        })
    }
});
