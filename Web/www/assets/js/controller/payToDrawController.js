hpxAdminApp.controller('payToDrawController', function ($scope, $rootScope, NgTableParams, searchService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        'func': 'detail',
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
        $scope.filter.time2 = $("#end_time").val();
    });

    //获取所有打款
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return searchService.getAllPayToDrawer(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    // 刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };

    $scope.show = function (data) {
        $scope.model = angular.copy(data);      //弹出详细窗口
        $('#modal-info').modal('show');
    };
});