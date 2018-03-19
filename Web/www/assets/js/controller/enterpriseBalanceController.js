hpxAdminApp.controller('enterpriseBalanceController', function ($scope, $rootScope, $state, API_URL, NgTableParams, payService, orderService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'time1':'',
        'time2':''
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
        $scope.filter.time1 = $("#start_time").val();
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
        $scope.filter.time2= $("#end_time").val();
    });

    //获取所有正在进行中的订单
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return payService.getEnterpriseBalance(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }


    $scope.show = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-show').modal('show');
        showEnterpriseBalanceInfo($scope.model.id);
    };

    //显示企业充值详情
    function showEnterpriseBalanceInfo(id) {
        $scope.tableParams2 = new NgTableParams({ sorting: { 'id': 'asc' } }, {
            getData: function (params) {
                return payService.getEnterpriseBalanceWithId(id,params, $scope.filter).then(function (data) {
                    $scope.first = $scope.getFirst(params);
                    return data;
                });
            }
        });
    }
    // 刷新
    $scope.reflash2 = function () {
        showEnterpriseBalanceInfo($scope.model.id);
    }

    $scope.add = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-add').modal('show');
    };
    $scope.addBalance = function () {
        payService.updateEnterpriseBalanceWithId($scope.model.id,$scope.model).then(function (result) {
                alert("充值成功");
                $('#modal-add').modal('hide');
        })
    }
});