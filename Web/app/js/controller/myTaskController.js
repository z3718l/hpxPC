ionicApp.controller('myTaskController', function ($scope, $rootScope, $state, customerService) {
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
        $scope.params = $scope.Params.Create();
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        customerService.getMyTasks($scope.params).then(function (data) {
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        $scope.params.next();
    };
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})