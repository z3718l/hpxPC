hpxAdminApp.controller('portalSuggestionController', function ($scope, $rootScope, $state, ngTableParams, portalSuggestionService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        suggestionTypeId: "1",  //投诉
        handleStatusCode: "0"   //未查看
    };

    //获取所有的投诉与建议
    $scope.tableParams = new ngTableParams({'sorting': { 'id': 'asc' } }, {
        getData: function (params) {
            return portalSuggestionService.query(params, $scope.filter.suggestionTypeId, $scope.filter.handleStatusCode, $scope.filter.keyword).then(function (data) {
                if (data != null) {
                    $scope.first = $scope.getFirst(params);
                    return data;
                }
                //else $scope.tableParams.reload();
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    
    $scope.edit = function (data) {
        if (data == null) {     //弹出新增窗口
            $scope.model = newEntity;
        }
        else {      //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        //$('#modal-edit').modal('show');
        $('#modal-edit').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };
    //获取对应id的投诉建议内容
    $scope.read = function (data) {
       // var id = data.id;
        $scope.model = angular.copy(data);
        //$('#modal-read').modal('show');
        $('#modal-read').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        });
    };

    $scope.save = function () {
        if ($scope.model.id == null) {      //新增投诉建议
            portalSuggestionService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //修改投诉建议
            portalSuggestionService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //处理投诉信息
    $scope.deal = function () {
        portalSuggestionService.update($scope.model, $scope.modell).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-read').modal('hide');
        });
        
    };




});
