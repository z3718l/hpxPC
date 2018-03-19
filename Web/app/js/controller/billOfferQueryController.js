ionicApp.controller('billOfferQueryController', function ($scope, $rootScope, $state, $ionicPopup, billService) {
    //判断是否可以报价
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }

    $scope.filter = {};

    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create('-offer_time', 10);
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        billService.getOwnBillOffer($scope.params, $scope.filter.billTypeId, $scope.filter.billStyleId, $scope.filter.maxPrice, $scope.filter.tradeLocationId, $scope.filter.keyword).then(function (data) {
            $scope.hasMore = data.length == 10;
            for (item in data) {
                data[item].offer_detail = JSON.parse(data[item].offer_detail);
            }
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        $scope.params.next();
    }
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
    //删除报价
    $scope.remove = function (data) {
        var confirmPopup = $ionicPopup.confirm({
            title: '注意',
            template: '确定要删除该报价吗?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                billService.deleteBillOffer(data.id).then(function (data) {
                    $scope.doRefresh();
                });
            }
        });

       
    }

    $scope.edit = function (data) {
        //跳转到报价详细信息
        $state.go('app.newBillOffer', { 'id': data.id });
    }
});