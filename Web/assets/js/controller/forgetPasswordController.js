hpxAdminApp.controller('forgetPasswordController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService) {
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.update = function () {
        //重置密码
        customerService.customerPasswordReset($scope.model.phone_number, $scope.model).then(function () {
            alert('重置密码成功！')
        })
    }

    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            alert('请输入正确的手机号码！');
            return;
        }

        customerService.phoneVerify($scope.model.phone_number).then(function () {
            alert('验证码已发送');
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
    //跳转到网站首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});
