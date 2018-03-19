hpxAdminApp.controller('BaofooInfoController', function (payService,$cookieStore,$http, $scope, $rootScope, $state, API_URL, $location) {
    var order_id = $location.search().order_id;
    var result = payService.getBaofooView(order_id);
    console.log(result);
});