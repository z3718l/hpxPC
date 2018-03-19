hpxAdminApp.controller('rechargeController', function ($scope, $rootScope, $state, API_URL,XingYe_URL, ngTableParams, payingService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        choiceReCharge: 1,
    };
    //获取账户充值记录
    $scope.tableParams = new ngTableParams({ 'sorting': { 'change_time': 'desc' } }, {
        getData: function (params) {
            return payingService.platformAccountBalance(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //获取账户余额
    payingService.GetPlatformAccount().then(function (data) {
        $scope.model= data;
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //弹出充值窗口
    $scope.recharge = function () {
        $scope.model = newEntity;
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //$scope.XYRecharge = function () {
    //    var newWin = window.open('loading page');
    //    newWin.location.href = XingYe_URL + $rootScope.identity.enterprise_id;
    //}
    //打开一个新页面，进行充值活动
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);
        $('#modal-edit').modal('hide');
    };

    $scope.choiceReCharge = function (number) {
        $scope.filter.choiceReCharge = number;
    };


});