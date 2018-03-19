hpxAdminApp.controller('stopOrderController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        func: 'stopped',
        isStop:'1',
        'deadlineTime1':'',
        'deadlineTime2':''
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click",function(ev){
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.deadlineTime1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language:  'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function(e) {
        $scope.filter.deadlineTime2 = $("#end_time").val();
    });

    //获取所有正在进行中的订单
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return orderService.getAllAliveOrders(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        if($scope.filter.isStop == 0){
            $scope.filter.func = 'stop';
        }else{
            $scope.filter.func = 'stopped';
        }

        $scope.tableParams.reload();
    }

    $scope.check = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();
    };

    $scope.save = function (data) {
        $scope.model = angular.copy(data);       //弹出终止窗口
        $scope.model.description = null;
        $('#modal-read').modal('show');
    };

    $scope.stopOrder = function () {
        //终止订单
        if (confirm('确认终止此订单吗？')) {
            console.log("asdasdasd");
            orderService.stopOrder($scope.model).then(function (data) {
                console.log(data)
                $scope.tableParams.reload();
                $('#modal-read').modal('hide');
                if (data.order_status_id >= 806 && data.order_status_id < 810 ) {
                    console.log("终止订单时的订单id=" + data.id)
                    payService.applyRefund(data.id).then(function (data) {
                        console.log(data)
                    })
                }
                //payService.applyRefund().then(function () {
                //    console.log(data)
                //})
            });
        }
    };

});