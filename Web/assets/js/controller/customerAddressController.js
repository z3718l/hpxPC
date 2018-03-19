hpxAdminApp.controller('customerAddressController', function ($scope, $rootScope, $state, ngTableParams, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };
    //获取客户对应的所有客户地址
    $scope.tableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getAllCustomerAddress(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新表格
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内容
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };
    //若id为空，则新增客户地址；否则为更新客户地址
    $scope.save = function () {
        if ($scope.model.id == null) {
            customerService.addAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除客户地址信息
    $scope.remove = function (data) {
        if (confirm('确定要删除本条地址信息吗？')) {
            customerService.removeAddress(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});