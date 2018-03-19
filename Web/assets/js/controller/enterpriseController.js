hpxAdminApp.controller('enterpriseController', function ($scope, $rootScope, $timeout, $state, Upload, FILE_URL, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {
    var emptyEntity = { };
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.model2 = {
        'credential_photos': 'assets/img/hpx-14.jpg',
        //'credential_photos': 'assets/img/hpx-15.jpg',
    };
    $scope.filter = {};

    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        $scope.filterProvinceChange();
    });
    $scope.filterProvinceChange = function () {
        if ($scope.filter.ProvinceID == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    }

    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
        $scope.BankChange();
    });
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });
    $scope.ProvinceChange = function () {
        if ($scope.model.bankprovince == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.bankprovince).then(function (data) {
                $scope.BankCityData = data;
                $scope.BankChange();
                addressService.queryAll().then(function (Pdata) {
                    for (var i = 0; i < Pdata.length; i++) {
                        if ($scope.model.bankprovince == Pdata[i].id) {
                            $scope.model.bank_province = Pdata[i].address_name;
                        };
                    }
                });
            });
        }
    },
    $scope.BankChange = function () {
        return bankService.getBank($scope.filter.HeadBankID, $scope.model.bankcity).then(function (data) {
            $scope.branchData = data;
            addressService.queryCity($scope.model.bankprovince).then(function (Cdata) {
                for (var i = 0; i < Cdata.length; i++) {
                    if ($scope.model.bankcity == Cdata[i].id) {
                        $scope.model.bank_city = Cdata[i].address_name;
                    };
                }
            });
        });
    },

    addressService.queryAll().then(function (data) {
        $scope.PData = data;
        $scope.filterProvince();
    });
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

    constantsService.queryConstantsType(5).then(function (data) {
        $scope.accountTypeData = data;
    })
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCode = data;
    })
    //$scope.tableParams = new ngTableParams({ sorting: { 'enterprise_address_id': 'asc' } }, {
    //    getData: function (params) {
    //        return customerService.getAllEnterprise(params).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});

    customerService.getAllEnterprise().then(function (data) {
        $scope.model2 = data;
    });
    $scope.save = function () {
        if (!$scope.model2.enterprise_name) {
            alert("请输入企业名称！");
            return;
        }
        if (!$scope.model2.telephone) {
            alert("请输入固定电话！");
            return;
        }
        //if (!$scope.model.fax_number) {
        //    alert("请输入传真号码！");
        //    return;
        //}
        if (!$scope.model2.enterprise_address_id) {
            alert("请选择企业省市地址！");
            return;
        }
        if (!$scope.model2.enterprise_address) {
            alert("请输入企业详细地址！");
            return;
        }
        if (!$scope.model2.credential_number) {
            alert("请输入证件号码！");
            return;
        } 
        if (!$scope.model2.credential_description) {
            alert("请选择证件类型！");
            return;
        } 
        if (!$scope.model2.trade_level_code) {
            alert("请选择交易类型！");
            return;
        }
        if (!$scope.model2.credential_photos) {
            alert("请上传证件照片！");
            return;
        }
        //if ($scope.model.id == null) {
        customerService.insertEnterprise($scope.model2).then(function (data) {
            angular.copy(emptyEntity, newEntity);
            customerService.getAllEnterprise().then(function (data) {
                $scope.model2 = data;
            });
        });
        //}
        //else {
        //    customerService.updateEnterprise($scope.model).then(function (data) {
        //    });
        //}
        if (confirm("保存成功！是否申请管理员审核？？？")) {
            customerService.sendCustomerReview().then(function (data) { });
        };
    };

    $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getEenterpriseAccount(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                $scope.AccountData= data;
            });
        }
    });
    $scope.AddresstableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getAllCustomerAddress(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                $scope.AddressData= data;
            });
        }
    });
    //customerService.insertEenterpriseAccount($scope.model).then(function (data) {
    //    $scope.tableParams.reload();
    //    angular.copy(emptyEntity, newEntity);
    //    $scope.editForm.$setPristine();
    //});

    $scope.read = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-read').modal('show');
    };

    $scope.add = function (data) {
        if (data == null) {
            $scope.model = angular.copy(data);
            $('#modal-add').modal('show');  // 显示增加银行账号的弹出窗口
        }
    };
    $scope.submit = function () {
        if ($scope.model.id == null) {
            customerService.insertEenterpriseAccount($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.addForm.$setPristine();
                $('#modal-add').modal('hide');
            });
        }
    };

    $scope.remove = function (data) {
        if (confirm('确定要删除本银行账户吗？')) {
            customerService.deleteEenterpriseAccount(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };
    $scope.sure = function () {
        if ($scope.model.id == null) {
            customerService.addAddress($scope.model).then(function (data) {
                $scope.AddresstableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.AddresstableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    $scope.delete = function (data) {
        if (confirm('确定要删除本条地址信息吗？')) {
            customerService.removeAddress(data.id).then(function (data) {
                $scope.AddresstableParams.reload();
            });
        }
    };


});