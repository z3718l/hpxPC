ionicApp.controller('businessQueryController', function ($rootScope, $scope, $state, $ionicPopup, $ionicModal, API_URL, customerService) {
    //公商查询
    $scope.query = function (name) {
        if (!name || name.length < 4) {
            $ionicPopup.alert({
                title: '警告',
                template: '至少输入四个关键字！',
                okType: 'button-assertive',
            });
            return;
        }
        customerService.enterpriseDetail(name, 1).then(function (data) {
            $scope.enterpriseInfo = data;
            if (data == null) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '查询无结果！',
                    okType: 'button-assertive',
                });
            }
        });
    }
    //详细弹框
    $ionicModal.fromTemplateUrl('detail.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.detailModal = modal;
    });

    $scope.openDetailModal = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.enterpriseDetailInfo = data;
            $scope.detailModal.show();
        });
    }

    $scope.closeDetailModal = function () {
        $scope.detailModal.hide();
    }
    //查看详情
    /*$scope.read = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.model = data;
            $('#modal-read').modal('show');
        });
    };*/
});
