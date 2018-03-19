ionicApp.controller('rechargerecordController', function ($scope, $rootScope, $state, payingService) {
    
    $scope.filter = {};

    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create();
        $scope.listData = [];
        $scope.loadMore();
    };

    $scope.loadMore = function (first) {
        payingService.platformAccountBalance($scope.params).then(function (data) {
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });

        $scope.params.next();
    };

    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})