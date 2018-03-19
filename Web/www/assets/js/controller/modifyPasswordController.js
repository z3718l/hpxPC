hpxAdminApp.controller('modifyPasswordController', function ($rootScope, $scope, $state, billService, customerService, constantsService) {
    $scope.model = {
        password: null,
    };
    $scope.filter = {
        choicePassword: 1,
        choicePhoneNumber: 0,
        filter_v: 1
    }
    $scope.update = function () {
        if (!$scope.model.password) {
            swal('请输入旧密码!');
            return;
        }
        if (!$scope.model.new_password) {
            swal('请输入新密码!');
            return;
        }

        if ($scope.model.new_password.length < 6 || $scope.model.re_new_password.length < 6) {
            swal('新密码长度不符合规定！');
            return;
        }

        if ($scope.model.new_password != $scope.model.re_new_password) {
            swal('两次新密码输入不一致！');
            return;
        }

        //修改密码
        customerService.customerModifyPassword($scope.model).then(function () {    
           
            swal({
            title: "修改密码成功,请回到首页重新登录?",
            type: "warning",
            //showCancelButton: true,
            confirmButtonText: "OK",
            //cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.customerLogout().then(function () {
                customerService.logout();
                window.location.href = '/index.aspx';
                
            });
            });
        })
    }

    customerService.getCustomer().then(function (data) {
        $scope.customerInfo = data;
    });
    $scope.changePhoneModel = {
        oldPhoneVerifyStr: '获取验证码',
        newPhoneVerifyStr: '获取验证码'
    }
    $scope.getOldPhoneVerify = function () {
        $scope.filter.filter_v = 1;
        customerService.getVerify($scope.customerInfo.phone_number, $scope.changePhoneModel, 'oldPhoneVerifyStr', 'disableOldPhoneVerify');
    }
    $scope.getNewPhoneVerify = function () {
        customerService.getVerify($scope.changePhoneModel.new_phone_number, $scope.changePhoneModel, 'newPhoneVerifyStr', 'disableNewPhoneVerify');
    }
    // 修改手机
    $scope.changePhone = function () {
        if (!$scope.changePhoneModel.phone_verify_code) {
            swal('请输入原手机验证码!');
            return;
        }
        if (!/^1(3|4|5|7|8)\d{9}$/.test($scope.changePhoneModel.new_phone_number)) {
            swal('请输入正确的新手机号码!');
            return;
        }
        if (!$scope.changePhoneModel.new_phone_verify_code) {
            swal('请输入新手机验证码!');
            return;
        }
        customerService.customerPhone($scope.changePhoneModel).then(function (data) {
            swal('修改手机号成功！');
        });
    }
    //注销
    $scope.tosignon = function () {
        customerService.logout()
    }

        //选择修改密码
    $scope.choicePassword = function () {
        $scope.filter.choicePassword = 1;
        $scope.filter.choicePhoneNumber = 0;
        if (document.getElementById("customerPassword").className == "billtypestyleprevious") {
            document.getElementById("customerPassword").className = "billtypestylecurrent";
            document.getElementById("password").style.color = "#ff5a14";
            document.getElementById("customerPhone").className = "billtypestyleprevious";
            document.getElementById("phoneNumber").style.color = "#333";
        }

    };
    //选择手机绑定
    $scope.choicePhoneNumber = function () {
        $scope.filter.choicePhoneNumber = 1;
        $scope.filter.choicePassword = 0;
        if (document.getElementById("customerPhone").className == "billtypestyleprevious") {
            document.getElementById("customerPhone").className = "billtypestylecurrent";
            document.getElementById("phoneNumber").style.color = "#ff5a14";
            document.getElementById("customerPassword").className = "billtypestyleprevious";
            document.getElementById("password").style.color = "#333";
        }

    };
});
