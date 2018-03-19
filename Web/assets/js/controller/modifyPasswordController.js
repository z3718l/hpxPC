hpxAdminApp.controller('modifyPasswordController', function ($rootScope, $scope, $state, billService, customerService, constantsService) {
    $scope.model = {};
    $scope.update = function () {
        //修改密码
        customerService.customerModifyPassword($scope.model).then(function () {
            alert('修改密码成功！')
        })
    }
    //获取验证码
    $scope.getVerify = function () {
        customerService.phoneVerify($scope.model.phone_number).then(function () {
            alert('验证码已发送');
        });
    };
    //跳转到网站首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});
