hpxAdminApp.controller('paymentController', function ($rootScope, $scope, $timeout, $state, API_URL, Upload, billService, fileService) {
    $scope.model = {
        'bill_front_photo_address': 'assets/img/hpx-14.jpg',
        'bill_back_photo_address': 'assets/img/hpx-15.jpg',
    };
    $scope.filter = {};
    //文件的url
    $scope.getFileURL = function (id) {
        if (id != null) {
            return FILE_URL + '/file' + id;
        }
    }
    //文件上传
    $scope.uploadFiles = function (files, errFiles, successFunc) {
        $scope.uploading = true;
        if (errFiles.length > 0) {
            alert('有文件不符合要求，无法上传！');
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
                    alert('上传失败!' + response.status + ': ' + response.data);
                }
            }, function (evt) {

            });
        });
    };
    //设置传递给后端的图片为当前上传的图片
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_address = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_address = response.data.data.file_path;
        })
    };
    //上传图片
    $scope.save = function () {
        alert("图片上传成功！");
        location.reload(false);
    };

});
