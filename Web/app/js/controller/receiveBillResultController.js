﻿ionicApp.controller('receiveBillResultController', function ($scope, $rootScope, $state, billService, toolService) {
    $scope.filter = {
        //billTypeAll: true,
        billStyleAll: true,
        acceptorTypeAll: true,
        billCharacterAll: true,
        billStatusAll: true,
        //tradeTypeCode: '701,702',
        tradeTypeCode: '',
        //billTypeID: '101,102',
        billTypeID: '',
        billStatusCode: '801,802,803,804,805,806,807,808,809,810,811,812,813',
        //billCharacterCode: '1701,1702',
        billCharacterCode: '',
        //acceptorTypeID: '401,402,403,404,405,406,407'
        acceptorTypeID: ''
    };
    $scope.starTemp = {};
    $scope.doRefresh = function () {
        $scope.filter = $rootScope.receiveBill.filter;
        $scope.params = $scope.Params.Create('-publishing_time', 10);
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        $scope.filter.locationId = $scope.filter.CityID;

        //查看票据
        return billService.searchBillProduct($scope.params, $scope.filter.billTypeID, $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
            $scope.products = data;
     
            for (var i = 0; i < $scope.products.length; i++) {
                toolService.setStars($scope.products[i]);
            };
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? $scope.products : $scope.listData.concat($scope.products);
            $scope.$broadcast('scroll.infiniteScrollComplete')
            $scope.params.next();
        });
    };
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})