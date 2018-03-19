hpxAdminApp.controller('signupController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService, $cookieStore, Restangular) {
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.filter = {
        choicePhone:0,
    }
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

    $scope.PhoneChange = function () {
        if ($scope.model.phone_number && (/^1(3|4|5|7|8)\d{9}$/.test($scope.model.phone_number))) {
            //$scope.model.phone_number.length == 11 &&
            customerService.testPhoneNumber($scope.model.phone_number).then(function (data) {
                if (!data) {
                    $scope.filter.choicePhone = 1;
                }
                else {
                    $scope.filter.choicePhone = 2;
                }
            });
        }
        else if ($scope.model.phone_number && $scope.model.phone_number.length==11) {
            $scope.filter.choicePhone = 3;
        }
    }

    $scope.signup = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            swal('请输入手机号码！');
            return;
        }

        if (!$scope.model.password || $scope.model.password.length == 0) {
            swal('请输入密码！');
            return;
        }

        if (!$scope.model.password || $scope.model.password.length < 6) {
            swal('密码长度不符合规定！');
            return;
        }

        if ($scope.model.password != $scope.model.password2) {
            swal("两次密码输入不一致！");
            return;
        }

        if (!$scope.model.phone_verify_code || $scope.model.phone_verify_code.length == 0) {
            swal('请输入验证码！');
            return;
        }
        //注册功能
        customerService.customerReg($scope.model).then(function (data) {
            swal("注册成功!");
            $scope.loginRequest = {
                username: $scope.model.phone_number,
                password: $scope.model.password,
                enterprise_id: -1
            }
            //新建账户信息
            customerService.customerLogin($scope.loginRequest).then(function (data) {
                $cookieStore.put('customer', data);

                $rootScope.identity = data;
                Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
                $state.go('app.main.accountInfo');      //跳转到个人中心
            });
            //window.location.href = '/index.aspx';          //跳转到首页
        });
    }
});
