hpxAdminApp.controller('messageCenterController', function ($rootScope, $scope, $state, $interval, ngTableParams, $timeout, Upload, notisService, billService, messageService) {
    $scope.filter = {
        choiceRead: 0,
        choiceMessageType: 1,
        MessageType: 1,
        isRead:0 
    }
    //获取全部信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {

            return notisService.getNotification(params, $scope.filter.MessageType, $scope.filter.choiceRead, $scope.filter.time1, $scope.filter.time2).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //未读消息
    $scope.choiceNotRead = function () {
        $scope.filter.choiceRead = 0;

        $scope.tableParams.reload();
    };
    //已读消息
    $scope.choiceRead = function () {
        $scope.filter.choiceRead = 1;

        $scope.tableParams.reload();
    };
    //注册消息
    $scope.choiceEnrollMessage = function () {
        $scope.filter.choiceMessageType = 1;
        $scope.filter.MessageType = 1;

        $scope.tableParams.reload();
    }
    //订单消息
    $scope.choiceDrawerOrderMessage = function () {
        $scope.filter.choiceMessageType = 2;
        $scope.filter.MessageType = [2, 5];

        $scope.tableParams.reload();
    }
    //收票订单消息
    $scope.choiceReceiverOrderMessage = function () {
        $scope.filter.choiceMessageType = 5;

        $scope.tableParams.reload();
    }
    //票据消息
    $scope.choiceBillMessage = function () {
        $scope.filter.choiceMessageType = 3;
        $scope.filter.MessageType = [3,6];

        $scope.tableParams.reload();
    }
    //我的竞价票据消息

    $scope.choiceBidMessage = function () {
        $scope.filter.choiceMessageType = 6;

        $scope.tableParams.reload();
    }
    //其他消息
    $scope.choiceOtherMessage = function () {
        $scope.filter.choiceMessageType = 4;
        $scope.filter.MessageType = 4;

        $scope.tableParams.reload();
    }
    //获取对应的消息信息，弹出窗口
    $scope.read = function (item) {
        notisService.seeNotification(item.id).then(function (data) {
            $scope.model = data;
        });
        //$('#modal-read').modal('show');
        $('#modal-read').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //删除某条消息
    $scope.remove = function (item) {
        swal({
            title: "确定要删除该消息?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            notisService.deleteNotification(item.id).then(function (data) {
                $scope.tableParams.reload();
            });
        });
    }
    $scope.skip = function (data) {
        $('#modal-read').modal('hide');
        $timeout(function () {
            if ($scope.model.notification_type == 2) {
                $state.go('app.main.orderDrawerInfo', { 'id': $scope.model.notification_id });
            } else if ($scope.model.notification_type == 5) {
                $state.go('app.main.orderReceiverInfo', { 'id': $scope.model.notification_id });
            } else if ($scope.model.notification_type == 3) {
                $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 1 });
            } else if ($scope.model.notification_type == 4 && $scope.model.notification_id > 0) {
                billService.getBillProduct($scope.model.notification_id).then(function (data) {
                    if (data.order_id && data.order_id != 0) {
                        swal("该票据已经生成订单，您无权查看！");
                    } else {
                        $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 2 });
                    }
                });
            } else if ($scope.model.notification_type == 6) {
                var loser = new RegExp("失败");
                if (loser.test($scope.model.notification_title)) {
                    $state.go('app.free.readBill', { 'id': $scope.model.notification_id, 'check': 3 });
                } else {
                    $state.go('app.main.orderReceiverInfo', { 'id': $scope.model.notification_id });
                }
            }
        },300);
    }
});

