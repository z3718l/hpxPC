hpxAdminApp.controller('bankQueryController', function ($rootScope, $scope, $state, ngTableParams, addressService, bankService, customerService) {
    $scope.model = {
        "head_bank_id": null,
        "address_id": null,
        "keyword": null,
    }
    $scope.filter = {
        "findPrecise": false,
    }
    $scope.kong = function () {
        window.location.reload();
    }
    $scope.byNameClick = function (Name) {
        $scope.byName = Name;
    }
    $scope.tableParams = new ngTableParams({ 'sorting': { 'bank_number': 'desc' } }, {
        getData: function (params) {
            if ($scope.filter.findPrecise) {
                return bankService.findSpecificBank($scope.filter.find_id, params).then(function (data) {
                    if (data) {
                        $scope.first = $scope.getFirst(params);
                        $scope.branchData = [data];
                        return [data];
                    } else {
                        swal('查询结果为空，建议使用模糊查询！');
                        return [];
                    }
                });
            } else {
                return bankService.getBank($scope.model.head_bank_id, $scope.model.address_id, $scope.model.keyword, params).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.branchData = data;
                    return data;
                });
            }
        }
    });
    //精确查询
    $scope.queryPrecise = function (id) {
        if (!id)
            return;
        if (id.length != 12) {
            swal("请输入正确的行号，行号长度为12位！");
            return;
        }
        $scope.filter.find_id = id;
        $scope.filter.findPrecise = true;
        $scope.tableParams.reload();
    }


    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.provinceChange = function () {
        if ($scope.model.province_id == null) {
            return;
        }
        else {
            return addressService.getCity($scope.model.province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    //获取所有的银行账户总行信息
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });

    //根据总行，所在市，关键字找到对应的分行数据
    $scope.queryVague = function () {
        $scope.filter.findPrecise = false;
        if (($scope.model.head_bank_id && $scope.model.province_id && $scope.model.address_id) || $scope.model.keyword) {
            $scope.tableParams.reload();
        } else {
            swal("请省份(直辖市)、市级、银行名称填写完整后查询！");
        }
    }

});
