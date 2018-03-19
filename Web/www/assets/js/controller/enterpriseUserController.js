hpxAdminApp.controller('enterpriseUserController', function ($scope, API_URL, NgTableParams, enterpriseService) {

    $scope.filter = {};

    //获取所有企业用户
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
        getData: function (params) {
            return enterpriseService.getAllEnterpriseUser(params, $scope.filter).then(function (data) {
                console.log(data)
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    // 显示详情
    $scope.show = function (model) {
        enterpriseService.getOneEnterpriseUserInfo(model).then(function (result) {
            console.log(result);
            $scope.model = result;
            $('#modal-show').modal('show');
            //window.location.href = "index.html#/app/setting/customerQuery"
        })
    };
});