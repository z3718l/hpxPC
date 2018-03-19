ionicApp.controller('authorizateController', function ($scope, $rootScope, $state, $ionicPopup, $ionicModal, customerService, payingService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.exampleModel = {
        src1: "images/danweishouquan.jpg",
        src2: "images/qiyeshouquan.jpg",
    };
    $scope.agentModel = {
        authorization_xingyeshujin_photo_address: '',
        authorization_xingyebank_photo_address: '',
    };
    $scope.takePhoto = function (index) {
        switch (index) {
            case 0:
                $scope.$takePhoto(function (data) {
                    $scope.agentModel.authorization_xingyeshujin_photo_address = data;
                    $scope.$uploadPhoto($scope.agentModel.authorization_xingyeshujin_photo_address, function (data) {
                        data = JSON.parse(data);
                        $scope.agentModel.authorization_xingyeshujin_photo_id = data.data.id;
                        $scope.agentModel.authorization_xingyeshujin_photo_address = data.data.file_path;
                    });
                });
                break;
            case 1:
                $scope.$takePhoto(function (data) {
                    $scope.agentModel.authorization_xingyebank_photo_address = data;
                    $scope.$uploadPhoto($scope.agentModel.authorization_xingyebank_photo_address, function (data) {
                        data = JSON.parse(data);
                        $scope.agentModel.authorization_xingyebank_photo_id = data.data.id;
                        $scope.agentModel.authorization_xingyebank_photo_address = data.data.file_path;
                    });
                });
                break;

        }
    };
    $scope.filter = {
        tip: false,
        update: false
    };
    $scope.reloadModel = function () {
        customerService.getAllEnterprise().then(function (data) {
            $scope.model = data;
            payingService.getAgentTreasurer($scope.model.id).then(function (result) {
                $scope.agentModel = result;
            });
        });
    }
    $scope.reloadModel();

    $scope.saveAgent = function () {
        if (!$scope.agentModel.agent_treasurer_name) {
            $ionicPopup.alert({
                title: '警告',
                template: '请填写经办人姓名！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            $ionicPopup.alert({
                title: '警告',
                template: '请填写经办人手机号！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            $ionicPopup.alert({
                title: '警告',
                template: '请填写经办人身份证号码！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.agentModel.authorization_xingyeshujin_photo_id || !$scope.agentModel.authorization_xingyebank_photo_id) {
            $ionicPopup.alert({
                title: '警告',
                template: '请上传授权书！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.agentModel.isChecked) {
            payingService.postAgentTreasurer($scope.model.id, $scope.agentModel).then(function (data) {
                $scope.reloadModel();
                //$ionicPopup.alert({
                //    title: '警告',
                //    template: '保存成功，请等待管理员审核！',
                //    okType: 'button-assertive',
                //});
                //$state.go('app.user');
                $scope.filter.tip = true
            });
        } else {
            payingService.updateAgentTreasurer($scope.model.id, $scope.agentModel).then(function (data) {
                $scope.reloadModel();
                //$ionicPopup.alert({
                //    title: '警告',
                //    template: '保存成功，请等待管理员审核！！',
                //    okType: 'button-assertive',
                //});
                //$state.go('app.user');
                $scope.filter.tip = true
            });
        }
    }

    $scope.updateAgent = function () {
        if ($scope.filter.update == false) {
            $scope.filter.update = true;
        }
        else {
            $scope.saveAgent();
        }
    }

    //图片放大弹框
    $ionicModal.fromTemplateUrl('imgMagnify.html', {
        scope: $scope,
    }).then(function (modal) {
        $scope.imgMagnifyModal = modal;
    });

    $scope.openImgMagnifyModal = function (img_path) {
        if (img_path) {
            $scope.imgMagnifyModal.show();
            $scope.img_path = img_path;
        }
    }

    $scope.closeImgMagnifyModal = function () {
        $scope.imgMagnifyModal.hide();
    }
});