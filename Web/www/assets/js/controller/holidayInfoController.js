// JavaScript source code
hpxAdminApp.controller('holidayInfoController', function ($scope, $rootScope, $state, NgTableParams, roleService,holidayService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};


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
        $scope.model.start_time = $("#start_time").val();
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
        $scope.model.end_time = $("#end_time").val();
    });


    //获取假日信息
    $scope.tableParams = new NgTableParams({ sorting: { 'start_time': 'desc' } }, {
        getData: function (params) {
            return holidayService.query(params,$scope.filter.year).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.refresh = function () {
        $scope.tableParams.reload();
    }
    
    $scope.edit = function (data) {
        if (data == null) {         //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        //$scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.id) {         //新建一条假日数据
            holidayService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改一条假日数据信息
            holidayService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    //删除某条假日数据信息
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.description + '吗')) {
            holidayService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
})