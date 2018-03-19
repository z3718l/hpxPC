hpxAdminApp.controller('agentCustomerController', function (exportService, $interval, $rootScope, $scope, $stateParams, $state, API_URL, NgTableParams, constantsService, addressService, customerService, agentService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'checkedType': 0,        //默认未审核
    };
    //获取票据类型信息
    //agentService.queryConstantsType(3).then(function (data) {
    //    $scope.customerTypeData = data;
    //})

    //获取未审核或已审核的客户资料信息
    $scope.tableParams = new NgTableParams({ 'sorting': { 'id': 'asc' } }, {
        getData: function (params) {
            return agentService.queryAllCustomersUnverified(params, $scope.filter.checkedType).then(function (data) {
                $scope.first = $scope.getFirst(params);
                data = data.data
                return data;
            });
        }
    });
    //跳转到新页面，放大图片
    //$scope.showFront = function () {
    //    window.open('index.html#/img?path=' + $scope.model.credential_front_photo_path);
    //}
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    var timer = $interval($scope.reflash, 60 * 1000);
    $scope.$on(
        "$destroy",
        function (event) {
            $interval.cancel(timer);
        }
    );

    $scope.check = function (item) {
        $scope.model = item;        //获取某条数据的详细信息
        //获取所有的省级地址
        //addressService.queryAll().then(function (data) {
        //    $scope.ProvinceData = data;
        //    $scope.provinceChange();
        //});
        //获取对应省的所有市级地址
        //$scope.provinceChange = function () {
        //    if (!$scope.model.enterprise_province_id) {
        //        return;
        //    }
        //    else {
        //        return addressService.queryCity($scope.model.enterprise_province_id).then(function (data) {
        //            $scope.CityData = data;
        //            $scope.cityChange();
        //        });
        //    }
        //}
        // 获取对应市的区
        //$scope.cityChange = function () {
        //    if (!$scope.model.enterprise_city_id) {
        //        return;
        //    }
        //    else {
        //        return addressService.queryDstrict($scope.model.enterprise_city_id).then(function (data) {
        //            $scope.AddressData = data;
        //        });
        //    }
        //}
        $('#modal-edit').modal('show');     //弹出审核窗口
        $('.jqzoom').imagezoom();       //图片放大功能
    };
    $scope.read = function (item) {
        $scope.model = item;        //获取某条数据的详细信息
        $('#modal-read').modal('show');     //弹出审核窗口
        $('.jqzoom').imagezoom();       //图片放大功能
    };

    // 审核通过
    $scope.pass = function () {
        if (confirm('确认通过吗？')) {
            if (!$scope.model.verify_description) {
                $scope.model.verify_description = "审核通过";
            }
            agentService.checkCustomerReview($scope.model.enterprise_id, {
                'is_checked': 1,
                'description': $scope.model.verify_description
            }).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //审核不通过
    $scope.reject = function () {
        if (!$scope.model.verify_description || $scope.model.verify_description.length == 0) {
            alert('请填写不通过原因！');
            return;
        }
        if (confirm('确认不通过吗？')) {
            agentService.checkCustomerReview($scope.model.enterprise_id, {
                'is_checked': -1,
                'description': $scope.model.verify_description
            }).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //客户失效
    $scope.delete = function (data) {
        if (confirm('确定要删除本客户吗？')) {
            agentService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

    //导出表格
    $scope.exportExcel = function () {
        var resource_url = API_URL + "/customers/customerReview?n=65535&orderBy=%2Bid&p=1";
        var sheet_name = "企业审核表";
        var label_names, label_types, label_keys;
        if ($scope.filter.checkedType == 1) {
            resource_url += "&isChecked=1";
            sheet_name += "_已审核";
        } else if ($scope.filter.checkedType == 0) {
            resource_url += "&isChecked=0";
            sheet_name += "_未审核";
        }
        label_names = ["企业名称", "统一社会信用码/营业执照注册号", "联系人", "联系号码"];
        label_types = ["String", "String", "String", "String"];
        label_keys = ["enterprise_name", "credential_number", "contact_person", "contact_phone"];

        var excelRequest = {
            "resource_url": resource_url,
            "resource_name": "enterprises",
            "sheet_name": sheet_name,
            "label_names": label_names,
            "label_types": label_types,
            "label_keys": label_keys
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export', token, excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }
});
