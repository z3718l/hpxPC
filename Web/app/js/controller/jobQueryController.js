ionicApp.controller('jobQueryController', function ($rootScope, $scope, $state, $ionicPopup, toolService) {
    $scope.model = {
        billNumber: null,
    };

    //更改输入框检验
    /*
    $scope.updateBillNumber = function () {
        if (!$scope.model.billNumber) {
            $scope.model.billNumberValidate = null;
            return;
        }
        if (!/^[0-9]{16}$/.test($scope.model.billNumber) && !/^[0-9]{8}$/.test($scope.model.billNumber)) {
            $scope.model.billNumberValidate = false;
        } else {
            $scope.model.billNumberValidate = true;
        }
    }*/

    //查询
    $scope.query = function () {
        if (!$scope.model.billNumber) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入汇票票号！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!/^[0-9]{16}$/.test($scope.model.billNumber) && !/^[0-9]{8}$/.test($scope.model.billNumber)) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入16位或后8位汇票票号！',
                okType: 'button-assertive',
            });
            return;
        }
        toolService.serviceByPublication($scope.model).then(function (data) {
            if (data.page_info.items_number)
                $scope.queryResult = data['service_by_publications'][0];
            else {
                $scope.queryResult = null;
                $ionicPopup.alert({
                    title: '警告',
                    template: '该票号目前暂无挂失信息！',
                    okType: 'button-assertive',
                });
            }
        });
    }
    //清理
    $scope.clear = function () {
        $scope.model.billNumber = null;
        $scope.queryResult = null;
        //$scope.updateBillNumber();
    }
});
