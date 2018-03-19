hpxAdminApp.controller('platformBillController', function ($scope, API_URL, NgTableParams, enterpriseService, searchService) {

    $scope.filter = {
        isMadeBill: 0
    };

    //获取所有企业用户
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
        getData: function (params) {
            return enterpriseService.getAllEnterpriseUser(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    //显示详情
    $scope.show = function (model) {
        //获取所有企业用户
        $scope.tableParams2 = new NgTableParams({
            sorting: {'id': 'asc'}
        }, {
            getData: function (params) {
                return searchService.getPlatformAccountBalance(model, $scope.filter, params).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    $scope.balances = data;
                    return data;
                });
            }
        });

        $('#modal-show').modal('show');

    };

    // 刷新
    $scope.reflash2 = function () {
        $scope.tableParams2.reload();
    };

    // 开发票
    $scope.invoicing = function () {
        var result = [];
        angular.forEach($scope.balances , function(item) {
            if($scope.checkboxes.items[item.id] == true){
                result.push(item.id);
            }
        });

        searchService.updatePlatformAccountBalance(result).then(function (data) {
            $scope.reflash2();
            alert("成功开票")
        })
    };


    $scope.checkboxes = {
        checked: false,
        items: {}
    };

    // watch for check all checkbox
    $scope.$watch(function() {
        return $scope.checkboxes.checked;
    }, function(value) {
        angular.forEach($scope.balances , function(item) {
            $scope.checkboxes.items[item.id] = value;
        });
    });

    // watch for data checkboxes
    $scope.$watch(function() {
        return $scope.checkboxes.items;
    }, function(values) {
        var checked = 0, unchecked = 0,
            total = $scope.balances .length;
        angular.forEach($scope.balances , function(item) {
            checked   +=  ($scope.checkboxes.items[item.id]) || 0;
            unchecked += (!$scope.checkboxes.items[item.id]) || 0;
        });
        if ((unchecked == 0) || (checked == 0)) {
            $scope.checkboxes.checked = (checked == total);
        }
        // grayed checkbox
        angular
            .element($element[0].getElementsByClassName("select-all"))
            .prop("indeterminate", (checked != 0 && unchecked != 0));
    }, true);
});