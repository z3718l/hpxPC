// JavaScript source code
hpxAdminApp.controller('roleInfoController', function ($scope, $rootScope, $state, NgTableParams, roleService, userService, resourceService, cacheService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    
    $scope.filter = {};
    //获取所有用户信息
    userService.queryAll().then(function (data) {
        $scope.users = data;
    });
    //获取所有角色信息
    $scope.tableParams = new NgTableParams({ sorting: { 'role_name': 'asc' } }, {
        getData: function (params) {
            return roleService.query(params,$scope.filter.role_name).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取对应角色的权限详情
    $scope.power = function (item) {
        $scope.model = angular.copy(item);
        // 先获取所有的resources
        resourceService.queryAll().then(function (data) {
            $scope.allResources = data.resources
        });
        return roleService.getRoleResource(item.id).then(function (data) {
            $scope.RoleResourceData = data;
            for (var i = 0, n = $scope.RoleResourceData.length; i < n; i++) {
                if ($scope.RoleResourceData[i].can_get == 1) {
                    $scope.RoleResourceData[i].can_get_checked = true;
                }
                if ($scope.RoleResourceData[i].can_post == 1) {
                    $scope.RoleResourceData[i].can_post_checked = true;
                }
                if ($scope.RoleResourceData[i].can_put == 1) {
                    $scope.RoleResourceData[i].can_put_checked = true;
                }
                if ($scope.RoleResourceData[i].can_delete == 1) {
                    $scope.RoleResourceData[i].can_delete_checked = true;
                }
            }
            $('#modal-Resources').modal('show');
        });
    },
    
    $scope.Determine = function (item) {
        if (item.can_get_checked) {  
            item.can_get = 1;
        } else {
            item.can_get = 0;
        }
        if (item.can_post_checked) {
            item.can_post = 1;
        } else {
            item.can_post = 0;
        }
        if (item.can_put_checked) {
            item.can_put = 1;
        } else {
            item.can_put = 0;
        }
        if (item.can_delete_checked) {
            item.can_delete = 1;
        } else {
            item.can_delete = 0;
        }
        return roleService.updateRoleResource(item).then(function (data) {
            alert("成功修改角色资源权限。");
            //$scope.tableParams.reload();
            //$('#modal-Resources').modal('hide');
        })
    }

    // 添加指定角色的权限
    $scope.addPower = function (item) {
        item['role_id'] = $scope.model['id']
        return roleService.addRoleResource(item).then(function (data) {
            $scope.power(item);

            //$scope.tableParams.reload();
            //$('#modal-Resources').modal('hide');
        })
    }
    
    // 删除指定角色的指定权限
    $scope.removePower = function (item) {
        return roleService.removeRoleResource(item).then(function (data) {
            $scope.RoleResourceData.pop(item);
            alert("成功删除角色资源权限。");
            //$scope.tableParams.reload();
            //$('#modal-Resources').modal('hide');
        })
    }

    //弹出拷贝角色权限窗口
    $scope.copy = function () {
        roleService.queryAll().then(function (data) {
            $scope.roleData = data;
        });
        $('#modal-copy').modal('show');
    }
    //拷贝某一角色的权限
    $scope.submit = function () {
        roleService.copyRole($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            angular.copy(emptyEntity, newEntity);
            $scope.copyForm.$setPristine();
            $('#modal-copy').modal('hide');
        });
    },

    $scope.edit = function (data) {
        if (data == null) {     //弹出新建窗口
            $scope.model = newEntity;
        }
        else {          //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        //$scope.roleChange();
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.id) {         //新建角色
            roleService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {          //修改角色信息
            roleService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //重置密码
    $scope.resetPassword = function () {
        if (confirm('确定要重置密码吗？')) {
            roleService.resetPassword($scope.model.id).then(function (data) {
                alert("已被重置为初始密码");
            });
        }
    };
    //删除某一角色
    $scope.remove = function (data) {
        if (confirm('确定要删除' + data.role_name + '吗')) {
            roleService.remove(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
})