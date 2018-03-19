hpxAdminApp.controller('bankController', function ($scope, $rootScope, $state, API_URL, NgTableParams, bankService, addressService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有的总行数据
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });
    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.AddressData = data;
        $scope.filterProvinceChange();
    });
    //获取对应省的市级地址
    $scope.filterProvinceChange = function () {
        if ($scope.filter.ProvinceID == null) {
            return;
        }
        else {
            return addressService.getCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    },

    //根据总行银行id，所在省市，关键字查找分行数据
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return bankService.query(params, $scope.filter.HeadBankID, $scope.filter.CityID, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //弹出新建银行信息窗口
    $scope.add = function (data) {
        $scope.model = newEntity;
        $('#modal-add').modal('show');
    };
    //弹出修改银行信息窗口
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {
            //新建银行信息
            bankService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.addForm.$setPristine();
                $('#modal-add').modal('hide');
            });
        }
        else {
            //修改银行信息
            bankService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除某条银行信息，刷新列表
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.bank_name + ' 吗？')) {
            bankService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
    //获取所有的总行数据
    bankService.queryAll().then(function (data) {
        $scope.BankData = data;
    });
    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });
    //获取对应省的市级地址
    $scope.ProvinceChange = function () {
        if ($scope.model.bankprovince == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.bankprovince).then(function (data) {
                $scope.BankCityData = data;
            });
        }
    }

});