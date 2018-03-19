ionicApp.controller('homeController', function ($scope, $rootScope, $state, $filter, billService, toolService, $ionicHistory) {
    $ionicHistory.clearHistory();

    //票源信息和报价信息的条件搜索model初始化
    $rootScope.billSearchModel = null;
    $rootScope.billOfferSearchModel = null;

    $scope.bills = [];
    $scope.products = [];
    billService.getHomeBillOffer('home', 202, 1).then(function (data) {
        $scope.bills[0] = data[0]
        $scope.bills[0].offer_detail = JSON.parse($scope.bills[0].offer_detail)
        toolService.getStars($scope.bills[0].enterprise_id).then(function (data) {
            $scope.bills[0].star = data;
        });
    });
    billService.getHomeBillOffer('home', 203, 1).then(function (data) {
        $scope.bills[1] = data[0]
        $scope.bills[1].offer_detail = JSON.parse($scope.bills[1].offer_detail)
        toolService.getStars($scope.bills[1].enterprise_id).then(function (data) {
            $scope.bills[1].star = data
        });
    });
    billService.getHomeBillOffer('home', 204, 1).then(function (data) {
        $scope.bills[2] = data[0]
        $scope.bills[2].offer_detail = JSON.parse($scope.bills[2].offer_detail)
        toolService.getStars($scope.bills[2].enterprise_id).then(function (data) {
            $scope.bills[2].star = data
        });
    });
    billService.getHomeBillOffer('home', 205, 1).then(function (data) {
        $scope.bills[3] = data[0]
        $scope.bills[3].offer_detail = JSON.parse($scope.bills[3].offer_detail)
        toolService.getStars($scope.bills[3].enterprise_id).then(function (data) {
            $scope.bills[3].star = data
        });
    });

    billService.getHomeBillProduct('home', 101).then(function (data) {

        if (data.length == 0) {

        } else if (data.length == 1) {
            $scope.products[0] = data[0];
            $scope.products[0].bill_deadline_time = $filter('date')($scope.products[0].bill_deadline_time, 'yyyy-MM-dd');
            toolService.getStars($scope.products[0].publisher_id).then(function (data) {
                $scope.products[0].star = data
            });
        } else {
            $scope.products[0] = data[0];
            $scope.products[1] = data[1];
            $scope.products[0].bill_deadline_time = $filter('date')($scope.products[0].bill_deadline_time, 'yyyy-MM-dd');
            $scope.products[1].bill_deadline_time = $filter('date')($scope.products[1].bill_deadline_time, 'yyyy-MM-dd');

            toolService.getStars($scope.products[0].publisher_id).then(function (data) {
                $scope.products[0].star = data
            });

            toolService.getStars($scope.products[1].publisher_id).then(function (data) {
                $scope.products[1].star = data
            });
        }
        
       
    });

    billService.getHomeBillProduct('home', 102).then(function (data) {
        if (data.length == 0) {

        } else if (data.length == 1) {
            $scope.products[2] = data[0];
            $scope.products[2].bill_deadline_time = $filter('date')($scope.products[2].bill_deadline_time, 'yyyy-MM-dd');
            toolService.getStars($scope.products[2].publisher_id).then(function (data) {
                $scope.products[2].star = data
            });
        } else {
            $scope.products[2] = data[0];
            $scope.products[3] = data[1];
            $scope.products[2].bill_deadline_time = $filter('date')($scope.products[2].bill_deadline_time, 'yyyy-MM-dd');
            $scope.products[3].bill_deadline_time = $filter('date')($scope.products[3].bill_deadline_time, 'yyyy-MM-dd');
            toolService.getStars($scope.products[2].publisher_id).then(function (data) {
                $scope.products[2].star = data
            });

            toolService.getStars($scope.products[3].publisher_id).then(function (data) {
                $scope.products[3].star = data
            });
        }
       

    });

    //获取点击billOfferId
    $scope.changeBillOfferId = function (billOfferId) {
        $rootScope.billOfferbillOfferId = billOfferId;
    };
    $scope.calculator = function () {
        $state.go('app.calculator');
    };

    $scope.calendar = function () {
        $state.go('app.calendar');
    };

    $scope.querybank = function () {
        $state.go('app.querybank');
    };

    $scope.queryenterprise = function () {
        $state.go('app.queryenterprise');
    };
})