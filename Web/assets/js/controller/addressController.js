hpxAdminApp.controller('addressController', function ($scope, $rootScope, $state, ngTableParams, addressService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有省级地址名称
    addressService.queryAll().then(function (data) {
        $scope.PData = data;
        $scope.filterProvince();
    });
    //根据省级地址id，获取本省市区地址名称
    $scope.filterProvince = function () {
        if ($scope.model.province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.province_id).then(function (data) {
                $scope.CData = data;
            });
        }
        $scope.filterCity();
    },
    //根据市级地址id，获取本市区的地址名称
    $scope.filterCity = function () {
        if ($scope.model.city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.city_id).then(function (data) {
                $scope.DstrictData = data;
            });
        }
    },
    //获取客户对应的所有客户地址
   $scope.tableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
       getData: function (params) {
           return customerService.getAllCustomerAddress(params).then(function (data) {
               $scope.first = $scope.getFirst(params);
               $scope.AddressData = data;
               for (var i = 0; i < $scope.AddressData.length; i++) {
                   if ($scope.AddressData[i].is_default == 1) {
                       $scope.AddressData[i].is_default = "是";
                   } else {
                       $scope.AddressData[i].is_default = null;
                   }
               }
           });
       }
   });
    //刷新表格
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //设置默认地址
    $scope.default = function (item) {
        customerService.updateAddressDefault(item).then(function (data) {
            $scope.tableParams.reload();
        });
    }
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内容
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
            $scope.filterProvince();
            $scope.filterCity();
        }
        $('#modal-edit').modal('show');
    };
    //若id为空，则新增客户地址；否则为更新客户地址
    $scope.save = function () {
        if ($scope.model.id == null) {
            //新增客户地址
            customerService.addAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            //更新客户地址
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除客户地址信息，默认地址不能删除
    $scope.delete = function (data) {
        if (data.is_default == 1) {
            alert("不能删除默认地址信息！");
        } else {
            if (confirm('确定要删除本条地址信息吗？')) {
                customerService.removeAddress(data.id).then(function (data) {
                    $scope.tableParams.reload();
                });
            }
        }
    };

});