hpxAdminApp.controller('freezeEnterpriseController', function ($scope, $rootScope, $state, API_URL, NgTableParams, enterpriseService,exportService) {

    //默认未冻结 isAlive = 1
    $scope.filter = {
        isAlive : 1
    };

    $scope.option = {
        id : 0
    };


    //获取企业信息列表
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return enterpriseService.getAllAliveEnterprise(params,$scope.filter.keyword,$scope.filter.isAlive).then(function (data) {
                console.log($scope.filter.keyword);
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    
    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    //查看企业详细信息
    $scope.read = function (item) {
        $scope.model = angular.copy(item);        
        $('#modal-read').modal('show');     
    };
    
    //弹出冻结企业框
    $scope.freeze = function (item) {
        $scope.model = angular.copy(item);
        $scope.option.id = 0;
        $scope.model.description = '违规操作';
        $('#modal-freeze').modal('show');
    };
    
    //冻结企业
    $scope.confirmFreeze = function () {
        enterpriseService.freezeEnterprise($scope.model).then(function (data) {
            $scope.tableParams.reload();
            $('#modal-freeze').modal('hide');
        });
    };
    $scope.changeOption =function () {
        if($scope.option.id == 0){
            model.desciption = '违规操作';
        }
    }
    //解冻企业
    $scope.unfreeze = function (item) {
        if (confirm('确认解冻企业 ' +item.enterprise_name +' 吗？')) {
            enterpriseService.unfreezeEnterprise(item).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

    //导出表格
    $scope.exportExcel = function () {
        var resource_url = API_URL+"/customers/enterprise?n=65535&orderBy=%2Bid&p=1";
        var sheet_name = "冻结企业管理表";
        var label_names,label_types,label_keys;
        if($scope.filter.isAlive == 1){
            resource_url += "&isAlive=1";
            sheet_name += "_未冻结";
            label_names=["企业名称","统一社会信用码/营业执照注册号","联系人","联系号码"];
            label_types=["String","String","String","String"];
            label_keys=["enterprise_name","credential_number","contact_person","contact_phone"];
        }else if($scope.filter.isAlive == -2){
            resource_url += "&isAlive=-2";
            sheet_name += "_已冻结";
            label_names=["企业名称","统一社会信用码/营业执照注册号","冻结时间","冻结原因"];
            label_types=["String","String","Time","String"];
            label_keys=["enterprise_name","credential_number","freeze_time","freeze_description"];
        }

        var excelRequest =   {
            "resource_url":resource_url,
            "resource_name":"enterprises",
            "sheet_name":sheet_name,
            "label_names":label_names,
            "label_types":label_types,
            "label_keys":label_keys
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export',token,excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }
});