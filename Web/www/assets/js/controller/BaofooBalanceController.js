hpxAdminApp.controller('BaofooBalanceController', function ($http, $scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    $scope.filter = {
        'func': 'detail',
        'deadlineTime1': '',
        'deadlineTime2': '',
        time1: '',
        time2: '',
        orderStatus: 816,
        orderPayType: 1203,
        type:3,
        status:1
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.deadlineTime1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.deadlineTime2 = $("#end_time").val();
    });

    $("#time1").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#time1").datetimepicker("setEndDate", $("#time2").val());
    }).on('changeDate', function (e) {
        $scope.filter.time1 = $("#time1").val();
    });

    $("#time2").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#time2").datetimepicker("setStartDate", $("#time1").val());
    }).on('changeDate', function (e) {
        $scope.filter.time2 = $("#time2").val();
    });

    //获取所有正在进行中的订单
    $scope.tableParams = new NgTableParams({sorting: {'id': 'asc'}}, {
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
        console.log(data);
        $scope.model = data;      //弹出详细窗口
        showBaofooBalanceInfo(data.drawer_id);
        $('#modal-check').modal('show');
    };

    $scope.reflash2 = function () {
        showBaofooBalanceInfo($scope.model.drawer_id);
    };

    //显示宝付详情
    function showBaofooBalanceInfo(id) {
        console.log("企业ID：" + id);
        $scope.tableParams2 = new NgTableParams({sorting: {'id': 'asc'}}, {
            getData: function (params) {
                return payService.getBaofooBalanceWithId(id, params, $scope.filter).then(function (result) {
                    $scope.first = $scope.getFirst(params);
                    $scope.model.baofoo = {
                        member_id: result.member_id,
                        account_balance: result.account_balance
                    };
                    return result.baofoo_records;
                });
            }
        });
    }

    $scope.show = function (data) {
        var newWin = window.open('loading page');
        newWin.location.href = API_URL+'/paying/bfapi/unfreeze?orderId='+data.id+'&token='+$rootScope.identity.token;
    };

});