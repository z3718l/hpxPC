// JavaScript source code
hpxAdminApp.controller('userInfoController', function ($scope, $rootScope, $state, NgTableParams, userService, roleService) {

    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity); 
    $scope.filter = {};
    //获取所有角色信息
    roleService.queryAll().then(function (data) {
        $scope.roles = data;
    });
    //$scope.roleChange = function () {
    //    if ($scope.model.id == null)
    //        $scope.roles = [];
    //};
    $scope.$on('refreshMenu', function (event) {
        userService.queryUserMenu().then(function (data) {
            $rootScope.menus = data;
        });
    });
    //获取所有用户信息
    $scope.tableParams = new NgTableParams({ sorting: { 'username': 'asc' } }, {
        getData: function (params) {
            return userService.query(params, $scope.filter.username, $scope.filter.role_name, $scope.filter.isValid, $scope.filter.keyword).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    $scope.edit = function (data) {
        if (data == null) {     //弹出新建窗口
            $scope.model = newEntity;
        }
        else {      //弹出修改窗口
            $scope.model = angular.copy(data);
        }
       // $scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id==null) {        //新建用户
            userService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //修改用户信息
            userService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //重置密码
    $scope.resetPassword = function () {
        if (confirm('确定要重置密码吗？')) {
            userService.resetPassword($scope.model.id).then(function (data) {
                alert("已被重置为初始密码");
            });
        }
    };
    //删除某用户信息
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.username + '吗')) {
            userService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
  
});