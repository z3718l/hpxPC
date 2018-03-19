﻿ionicApp.controller('forgetPasswordController', function ($rootScope, $scope, $state, $interval, $ionicPopup, customerService) {
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.filter = {
        choicePhone: 0,
    }
    //var second = 60;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入正确的手机号码!',
                okType: 'button-assertive',
            });
            return;
        }
        //alert("test");
        customerService.phoneVerify($scope.model.phone_number).then(function () {
            $ionicPopup.alert({
                title: '通知',
                template: '验证码已发送!',
                okType: 'button-assertive',
            });
            $scope.second = 60;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 60);
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
        else if ($scope.model.phone_number && $scope.model.phone_number.length == 11) {
            $scope.filter.choicePhone = 3;
        }
    }

    $scope.submit = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入手机号码!',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.new_password || $scope.model.new_password.length == 0) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入密码!',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.new_password || $scope.model.new_password.length < 6) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入密码!',
                okType: 'button-assertive',
            });
            return;
        }

        if ($scope.model.new_password != $scope.model.new_password2) {
            $ionicPopup.alert({
                title: '警告',
                template: '两次密码输入不一致！',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.phone_verify_code || $scope.model.phone_verify_code.length == 0) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入验证码！',
                okType: 'button-assertive',
            });
            return;
        }
        $scope.model.submitRequest = {
            phone_verify_code: $scope.model.phone_verify_code,
            new_password: $scope.model.new_password,
        }
        //修改密码
        customerService.customerPasswordReset($scope.model.phone_number, $scope.model.submitRequest).then(function (data) {
            $ionicPopup.alert({
                title: '通知',
                template: '密码重置成功！',
                okType: 'button-assertive',
            });
            $rootScope.loginRequestEnter.password = $scope.model.submitRequest.new_password;
            $state.go('app.signin');            //跳转到登录界面
            /*$scope.loginRequest = {
                username: $scope.model.phone_number,
                password: $scope.model.password,
                enterprise_id: -1
            }
            //新建账户信息
            customerService.customerLogin($scope.loginRequest).then(function (data) {
                //$cookieStore.put('customer', data);
                localStorageService.set('customer', data);
                //alert(data.token);
                $rootScope.identity = data;
                Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
                $state.go('app.signin');      //跳转到登录界面
            });*/
        });
    }
});