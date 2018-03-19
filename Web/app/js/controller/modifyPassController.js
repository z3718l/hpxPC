ionicApp.controller('modifyPassController', function ($rootScope, $scope, $state, $ionicPopup, customerService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.model = {};

    $scope.submit = function () {

        if (!$scope.model.old_password || $scope.model.old_password.length == 0) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入旧密码!',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.old_password || $scope.model.old_password.length < 6) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入旧密码!',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.model.new_password || $scope.model.new_password.length == 0) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入新密码!',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.new_password || $scope.model.new_password.length < 6) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入新密码!',
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

        $scope.model.submitRequest = {
            password: $scope.model.old_password,
            new_password: $scope.model.new_password,
        }
        //修改密码
        customerService.customerModifyPassword($scope.model.submitRequest).then(function (data) {
            $ionicPopup.alert({
                title: '通知',
                template: '密码修改成功！',
                okType: 'button-assertive',
            });
            $rootScope.loginRequestEnter.password = $scope.model.submitRequest.new_password;
            $state.go('app.billQuery');      //跳转到个人中心
        });
    }
});