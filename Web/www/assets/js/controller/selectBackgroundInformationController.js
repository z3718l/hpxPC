hpxAdminApp.controller('selectBackgroundInformationController', function (exportService, $interval, $rootScope, $scope, $stateParams, $state, API_URL, NgTableParams, constantsService, addressService, customerService, payService) {
    console.log($scope)
    console.log($rootScope)

    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'checkedType': 0,        //默认未审核
        //billStyleAll: true,
        //acceptorTypeAll: true,
        //billCharacterAll: true,
        //billStatusAll: true,
        tradeTypeCode: '',
        billTypeID: '',
        billTys:'',
        //billStatusCode: '801',
        //billCharacterCode: ''
    };

    
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

    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        //$scope.filterProvinceChange();
    });
    //获取对应的省下所有的市级地址
    $scope.filterProvinceChange = function () {
        $scope.filter.locationId = null;
        if ($scope.filter.ProvinceID == null) {
            return;
        } else if ($scope.filter.ProvinceID == 1 || $scope.filter.ProvinceID == 20 || $scope.filter.ProvinceID == 860 || $scope.filter.ProvinceID == 2462) {
            $scope.filter.tradeProvinceId = $scope.filter.ProvinceID + 1;
            $scope.filter.locationId = $scope.filter.ProvinceID;
            //$scope.tableParams.reload();
            
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            $scope.filter.locationId = $scope.filter.ProvinceID;
            //$scope.tableParams.reload();
            return addressService.queryCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    }

    $scope.filterCityChange = function () {
        $scope.filter.locationId = $scope.filter.CityID;
        //$scope.tableParams.reload();
    }

    // 查询
    $scope.hpxFind = function () {
        messageService.findMessage({
            
        }).then(function (data) {
            console.log(data)
        })
    }

    // 发送
    $scope.hpxSend = function () {
        messageService.sendMessage({
            'notification_title': $scope.model,
            'notification_type': $scope,
            'send_time': $scope,
            'news_type': $scope,
            'activity_period': $scope,
            'activity_name': $scope,
            'things': $scope,
            'ids': $scope
        }).then(function (data) {
            console.log(data)
        })
    }
    
    

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
