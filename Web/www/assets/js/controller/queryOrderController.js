hpxAdminApp.controller('queryOrderController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, searchService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'func': 'detail',
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
        $scope.tableParams.reload();
    }

    $scope.check = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();
    };

    $scope.showAppraisal = function (item) {
        searchService.getEnterpriseAppraisal(item,{func:'order'}).then(function (result) {
            $scope.model = result;
            $('#modal-appraisal').modal('show');
        });
    };

    $scope.save = function (data) {
        $scope.model = angular.copy(data);       //弹出终止窗口
        $('#modal-read').modal('show');
    };

    $scope.stopOrder = function () {
        //终止订单
        if (confirm('确认终止此订单吗？')) {
            console.log("asdasdasd");
            orderService.stopOrder($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $('#modal-read').modal('hide');
            });
        }
    };

});