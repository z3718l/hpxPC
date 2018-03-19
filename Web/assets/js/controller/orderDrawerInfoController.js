hpxAdminApp.controller('orderDrawerInfoController', function ($rootScope, $scope, $state, $timeout, $stateParams, FILE_URL, Upload, ngTableParams, orderService, customerService, payingService) {
    //获取出票订单详情
    init = function () {
        orderService.getOrder($stateParams.id).then(function (data) {
            $scope.model = data;
            $timeout(function () {
                $('.jqzoom').imagezoom();
            });
        });
    }
    init();
    //支付手续费
    $scope.payCommission = function () {
        if (confirm('确定要支付手续费吗？')) {
            orderService.orderPayCommission($scope.model.id).then(function () {
                payingService.GetPlatformAccount().then(function (data) {
                    $scope.PlatformData = data;
                })
                if ($scope.PlatformData.platform_account_balance > $scope.model.receiver_commission) {
                    alert('手续费支付成功！');
                } else {
                    alert('账户余额不足！请充值！');
                }

                init();
                $('#modal-edit').modal('hide');
            });
        }
    };

    customerService.getAllEnterpriseAccount(501).then(function (data) {
        $scope.accounts = data;
    })
    //弹出背书窗口
    $scope.showEndorsement = function () {
        $scope.endorsements = [];
        $('#modal-endorsement').modal('show');
    };
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
    //增加背书
    $scope.add = function (response) {
        $timeout(function () {
            $scope.endorsements.push({
                'endorsement_id': response.data.data.id,
                'endorsement_address': response.data.data.file_path,
                'endorsement_file_name': response.data.data.file_name
            });
        })
    }
    //删除背书图片
    $scope.remove = function (index) {
        if (confirm('确定要删除该文件吗？')) {
            $scope.endorsements.splice(index, 1);
        }
    };
    //上传出票方背书
    $scope.endorsement = function () {
        if (!$scope.model.drawer_account_id) {
            alert("请选择收款账号");
            return;
        }

        if (confirm('是否确认上传出票方背书？')) {
            var model = {
                endorsement_id_list: [],
                endorsement_messages: [],
                drawer_account_id: $scope.model.drawer_account_id
            };
            for (var i = 0; i < $scope.endorsements.length; i++) {
                model.endorsement_id_list.push($scope.endorsements[i].endorsement_id);
                model.endorsement_messages.push($scope.endorsements[i].endorsement_message);
            }

            orderService.orderEndorsement($scope.model.id, model).then(function () {
                alert('出票方背书成功！');

                init();
                $('#modal-endorsement').modal('hide');
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除已上传的出票方背书
    $scope.deleteEndorsement = function () {
        if (confirm('是否要删除已上传的出票方背书？')) {
            orderService.deleteOrderEndorsement($scope.model.id).then(function () {
                alert('背书删除成功，请重新上传！');

                init();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //弹出更新物流信息窗口
    $scope.showLogistic = function () {
        $scope.logisticModel = {};
        $('#modal-logistic').modal('show');
    };
    //更新物流信息
    $scope.addLogistic = function () {
        orderService.orderLogistics($scope.model.id, $scope.logisticModel).then(function () {
            alert('更新物流信息成功！');

            init();
            $('#modal-logistic').modal('hide');
        });
    };
});
