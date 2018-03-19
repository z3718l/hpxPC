hpxAdminApp.controller('appraisalSearchController', function ($scope, API_URL, NgTableParams, searchService) {

    $scope.filter = {
        'func': 'enterprise'
    };

    //获取所有企业评价
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
        getData: function (params) {
            return searchService.getAllEnterpriseAppraisal(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    // 刷新
    $scope.refresh = function () {
        $scope.tableParams.reload();
    };

    //显示详情
    $scope.show = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-show').modal('show');
    };

});