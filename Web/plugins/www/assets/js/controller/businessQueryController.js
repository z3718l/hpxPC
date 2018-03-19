hpxAdminApp.controller('businessQueryController', function ($rootScope, $scope, $state, customerService) {

    //公商查询
    $scope.query = function (name) {
        if (!name || name.length < 4) {
            swal("至少输入四个关键字！");
            return;
        }
        customerService.enterpriseDetail(name, 1).then(function (data) {
            $scope.enterpriseInfo = data;
            //if (data == null) {
            //    swal("查询无结果！");
            //}
        });
    }
    //查看详情
    $scope.read = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.model = data;
            $('#modal-read').modal('show');
        });
    };

});
