ionicApp.controller('accreditController', function ($scope, $rootScope, $state, $ionicPopup, $ionicModal,  customerService, localStorageService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    customerService.getAllEnterprise().then(function (data) {
        $scope.model = {
            enterprise_name: data.enterprise_name,
            //credential_number: data.credential_number,
            credential_photo_id: data.credential_photo_id,
            credential_photo_address: data.credential_photo_address,
            artificial_person_front_photo_id: data.artificial_person_front_photo_id,
            artificial_person_front_photo_address: data.artificial_person_front_photo_address,
            artificial_person_back_photo_id: data.artificial_person_back_photo_id,
            artificial_person_back_photo_address: data.artificial_person_back_photo_address,
            id: data.id
        };
    });
    /*
    if (!$scope.model.credential_photo_address) {
        $scope.model.credential_photo_address = 'assets/img/hpx-14.jpg';
    }
    if (!$scope.model.artificial_person_front_photo_address) {
        $scope.model.artificial_person_front_photo_address = 'assets/img/hpx-14.jpg';
    }
    if (!$scope.model.artificial_person_back_photo_address) {
        $scope.model.artificial_person_back_photo_address = 'assets/img/hpx-15.jpg';
    }
    */
    $scope.filter = {
        tip: false,
        update: false
    };
    $scope.takePhoto = function (index) {
        switch (index) {
            case 0:
                $scope.$takePhoto(function (data) {
                    $scope.model.credential_photo_address = data;
                    $scope.$uploadPhoto($scope.model.credential_photo_address, function (data) {
                        data = JSON.parse(data);
                        $scope.model.credential_photo_id = data.data.id;
                        $scope.model.credential_photo_address = data.data.file_path;
                    });
                });
                break;
            case 1:
                $scope.$takePhoto(function (data) {
                    $scope.model.artificial_person_front_photo_address = data;
                    $scope.$uploadPhoto($scope.model.artificial_person_front_photo_address, function (data) {
                        data = JSON.parse(data);
                        $scope.model.artificial_person_front_photo_id = data.data.id;
                        $scope.model.artificial_person_front_photo_address = data.data.file_path;
                    });
                });
                break;
            case 2:
                $scope.$takePhoto(function (data) {
                    $scope.model.artificial_person_back_photo_address = data;
                    $scope.$uploadPhoto($scope.model.artificial_person_back_photo_address, function (data) {
                        data = JSON.parse(data);
                        $scope.model.artificial_person_back_photo_id = data.data.id;
                        $scope.model.artificial_person_back_photo_address = data.data.file_path;
                    });
                });
                break;

        }
    };

    $scope.loginOut = function () {
        $rootScope.loginRequestEnter = null;
        $rootScope.enterprises = null;
        $rootScope.identity = null;
        localStorageService.set('customer', null);
        $ionicPopup.alert({
            title: '提示',
            template: '请重新登录!',
            okType: 'button-assertive',
        });
    }

    $scope.save = function () {
        if ($scope.model.enterprise_name == '') {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入机构全称！',
                okType: 'button-assertive',
            });
            return;
        }
        //if ($scope.model.credential_number == '') {
        //    $ionicPopup.alert({
        //        title: '警告',
        //        template: '请输入营业执照注册号！',
        //        okType: 'button-assertive',
        //    });
        //    return;
        //}
        if (!$scope.model.artificial_person_front_photo_id) {
            $ionicPopup.alert({
                title: '警告',
                template: '请上传营业执照！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.model.artificial_person_front_photo_id || !$scope.model.artificial_person_back_photo_id) {
            $ionicPopup.alert({
                title: '警告',
                template: '请上传法人代表身份证！',
                okType: 'button-assertive',
            });
            return;
        }

        if ($scope.model.id == null || $scope.model.id == 0) {
            customerService.insertEnterprise($scope.model).then(function (data) {
                //alert("insertsuccess");
                // 注销重新登陆

                //$ionicPopup.alert({
                //    title: '警告',
                //    template: '保存成功，请重新登陆生效！',
                //    okType: 'button-assertive',
                //});
                //$scope.loginOut();
                //$state.go('app.signin');
                $scope.filter.tip = true

            });
        } else {
            customerService.updateEnterprise($scope.model).then(function (data) {
                //$ionicPopup.alert({
                //    title: '警告',
                //    template: '保存成功，请等待管理员审核！',
                //    okType: 'button-assertive',
                //});
                //$state.go('app.user');
                $scope.filter.tip = true
            });
        }
    };
    $scope.update = function () {
        if ($scope.filter.update == false) {
            $scope.filter.update = true;
        }
        else {
            $scope.save();
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
})