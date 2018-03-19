hpxAdminApp.controller('customerQueryController', function ($scope, API_URL, NgTableParams, enterpriseService) {
    console.log($scope)
    $scope.filter = {};
    //获取所有企业用户
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return enterpriseService.getAllEnterpriseUser(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    //$scope.reflash = function () {
    //    $scope.tableParams.reload();
    //};
    var h_fun = function (model) {
        enterpriseService.getOneEnterpriseUserInfo(model).then(function (result) {
            console.log(result);
            $scope.model = result;
        })
    };
});