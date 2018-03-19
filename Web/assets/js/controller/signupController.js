hpxAdminApp.controller('signupController', function ($rootScope, $scope, $state, $interval, billService, customerService,constantsService) {  
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    //获取客户的类型
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeCcode = data;
    })
    //获取交易方式的类型
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCcode = data;
    })

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

    $scope.signup = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            alert('请输入手机号码！');
            return;
        }

        if (!$scope.model.password || $scope.model.password.length == 0) {
            alert('请输入密码！');
            return;
        }

        if ($scope.model.password != $scope.model.password2) {
            alert("两次密码输入不一致！");
            return;
        }

        if (!$scope.model.phone_verify_code || $scope.model.phone_verify_code.length == 0) {
            alert('请输入验证码！');
            return;
        }
        //注册功能
        customerService.customerReg($scope.model).then(function (data) {
            alert("注册成功!");
            $scope.loginRequest = {
                username: $scope.model.phone_number,
                password: $scope.model.password
            }
            //新建账户信息
            customerService.customerLogin($scope.loginRequest).then(function (data) {
                localStorageService.set('customer', data);

                $rootScope.identity = data;
                Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
                $state.go('app.main.accountInfo');      //跳转到个人中心
            });
            $state.go("home");          //跳转到首页
        });
    }
    //注册成功跳转到首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});
