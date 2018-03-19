hpxAdminApp.controller('forgetPasswordController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService) {
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.filter = {
        isCheck: 1,
        filter_v:2
    }
    //if (/^1\d{10}$/.test($scope.model.phone_number)) {
    //    alert("正则通过");
    //    $scope.filter.filter_v = 2;
    //}
    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            swal('请输入正确的手机号码！');
            return;
        }
        customerService.phoneVerify($scope.model.phone_number).then(function () {
            swal('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;
            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;
                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };
    $scope.hupdate = function () {
        $scope.filter.isCheck = 2;
        customerService.customerPasswordResets($scope.model.phone_number, $scope.model).then(function () {
            swal('验证码输入成功！');
        })
    };
    $scope.update = function () {
        $scope.filter.isCheck = 3;
        if ($scope.model.new_password == null || $scope.model.new_password2 == null) {
            swal('密码不能为空！');
            return;
        }
        else if ($scope.model.new_password != $scope.model.new_password2) {
            swal('两次密码输入不一致！');
            return;
        }
        //重置密码
        customerService.customerPasswordReset($scope.model.phone_number, $scope.model).then(function (data) {
            swal('新密码设置成功！');
        });
    };
    //跳转到网站首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});
