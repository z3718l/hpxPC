// JavaScript source code
hpxAdminApp.controller('portalSuggestionInfoController', function ($scope, $rootScope, $state, NgTableParams, portalSuggestionInfoService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        suggestionTypeId: "1",      //默认投诉
        handleStatusCode: "0"       //默认未查看
    };

    //portalSuggestionInfoService.queryAll().then(function (data) {
    //    $scope.portal_suggestions = data.portal_suggestions;
    //});

    //获取投诉或建议信息
    $scope.tableParams = new NgTableParams({ sorting: { 'id': 'asc' } }, {
        getData: function (params) {
            return portalSuggestionInfoService.query(params, $scope.filter.suggestionTypeId, $scope.filter.handleStatusCode, $scope.filter.keyword).then(function (data) {
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
        if (data == null) {         //弹出新增窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {      //新增投诉建议信息
            portalSuggestionInfoService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //更新投诉建议信息
            portalSuggestionInfoService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除投诉建议信息
    $scope.remove = function (data) {
        if (confirm('确定要删除 ' + data.suggestion_title + ' 吗？')) {
            portalSuggestionInfoService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };



});