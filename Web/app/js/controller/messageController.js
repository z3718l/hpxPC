ionicApp.controller('messageController', function ($scope, $rootScope,$ionicPopup, $state, $filter, notisService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.filter = {
        type: '1,2,3,4,5,6',
        time1: '',
        time2: '',
        isRead: '',
    };
    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create('-send_time', 10);
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        notisService.getNotification($scope.params, $scope.filter.type, $scope.filter.time1, $scope.filter.time2, $scope.filter.isread).then(function (data) {
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        $scope.params.next();
    };
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})