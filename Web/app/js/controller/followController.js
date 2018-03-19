ionicApp.controller('followController', function ($scope, $rootScope, $state, $ionicPopup, customerService, toolService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
        $scope.doRefresh();
    }
    $scope.filter = {};
    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create();
        $scope.listData = [];
        $scope.billListData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        if ($scope.tab == 1) {
            customerService.getAllFollowEnterprises($scope.params).then(function (data) {
                $scope.hasMore = data.length == 10;
                $scope.listData = first ? data : $scope.listData.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        else {
            customerService.getAllFollowBills($scope.params).then(function (data) {
                for (let i = 0; i < data.length; i++) {
                    //alert(data[i].drawer_id)
                    toolService.getStars(data[i].drawer_id).then(function (data2) {
                        data[i].star = data2;
                    })
                }
                $scope.hasMore = data.length == 10;
                $scope.billListData = first ? data : $scope.billListData.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        $scope.params.next();
    };
    $scope.followBill = function (collection_bill_id, follow) {
        $scope.followBillModel = {
            collection_bill_id: collection_bill_id,
            is_collection_bill: follow
        };
        customerService.followBill($scope.followBillModel)
        $scope.doRefresh();
    }
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})