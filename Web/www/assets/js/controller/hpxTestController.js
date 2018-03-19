hpxAdminApp.controller('hpxTestController', function ($rootScope, $scope, $timeout, $stateParams, $state, FILE_URL, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {

    $scope.model = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
    };

    //图片上传功能
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            swal('有文件不符合要求，无法上传！');
        }
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: FILE_URL + '/file',
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file,
                data: { 'FileTypeCode': 1002 }
            }).then(successFunc, function (response) {
                if (response.status > 0) {
                    swal('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //汇票正面图片放大功能
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
            $('.jqzoom_front').imagezoom();
        })
    };
    //汇票背面图片放大功能
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
            $('.jqzoom_back').imagezoom();
        })
    };
    //汇票正面图片移除功能
    $scope.removeFront = function () {
        $scope.model.bill_front_photo_id = null;
        $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        $('.jqzoom_front').unbind("mouseenter");
        $('.jqzoom_front').css('cursor', '');
    }
    //汇票背面图片移除功能
    $scope.removeBack = function () {
        $scope.model.bill_back_photo_id = null;
        $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        $('.jqzoom_back').unbind("mouseenter");
        $('.jqzoom_back').css('cursor', '');
    }

});
