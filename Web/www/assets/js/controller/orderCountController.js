hpxAdminApp.controller('orderCountController', function ($scope, $rootScope, $state, API_URL, NgTableParams, orderService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    init();
    function init() {
        orderService.getOrderCount().then(function (data) {
            $scope.model = data;
            var time = secondConvert($scope.model.average_trade_time);
            $scope.model.average_hour = time[0];
            $scope.model.average_minute = time[1];
            $scope.model.average_second = time[2];
        });
    }

    function secondConvert(str) {
        str = str.replace("小时", ",");
        str = str.replace("分钟", ",");
        str = str.replace("秒", "");
        return str.split(",");
    }

    function convertSecond(hour, minute, second) {
        return parseInt(hour * 3600) + parseInt(minute * 60) + parseInt(second);
    }

    $scope.save = function () {
        $scope.model.average_trade_time = convertSecond($scope.model.average_hour, $scope.model.average_minute, $scope.model.average_second);
        console.log($scope.model.average_trade_time);

        var model = {
            "total_trade_price": $scope.model.total_trade_price,
            "total_electronic_trade_price": $scope.model.total_electronic_trade_price,
            "today_trade_price": $scope.model.today_trade_price,
            "average_trade_time": $scope.model.average_trade_time
        };
        orderService.updateOrderCount(model).then(function () {
            init();
        })
    };

});