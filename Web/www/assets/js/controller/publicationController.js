hpxAdminApp.controller('publicationController', function ($http,Upload,EXPORT_URL ,$rootScope, $scope, $state, NgTableParams, publicationService) {

    $scope.filter = {
        time1: '',
        time2: ''
    };

    $("#start_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#start_time").datetimepicker("setEndDate", $("#end_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.time1 = $("#start_time").val();
    });

    $("#end_time").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        minView: "month",
        maxView: "decade",
        todayBtn: true,
        pickerPosition: "bottom-left",
        language: 'zh-CN'
    }).on("click", function (ev) {
        $("#end_time").datetimepicker("setStartDate", $("#start_time").val());
    }).on('changeDate', function (e) {
        $scope.filter.time2 = $("#end_time").val();
    });

    //获取未审核或已审核的银行账户信息数据
    $scope.tableParams = new NgTableParams({'sorting': {'id': 'asc'}}, {
        getData: function (params) {
            return publicationService.getAllServiceByPublication(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //显示
    $scope.show = function (item) {
        $scope.model = angular.copy(item);
        $("#modal-show").modal('show');
    }
    //删除
    $scope.delete = function (item) {
        if (confirm("确定删除改条公催数据？")) {
            publicationService.deleteServiceByPublication(item.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    }

    //上传excel
    $scope.showUploadModal = function () {
        $("#modal-upload").modal('show');
    }

    $scope.uploadFile = function () {
        $http({
            url: EXPORT_URL + "/tools/excelImport?func=serviceByPublication",
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + $rootScope.identity.token ,
                'Content-Type': undefined
            },
            transformRequest: function() {
                var formData = new FormData();
                formData.append('file', $('#publicationFile')[0].files[0]);
                return formData;
            }
        }).success(function (result) {
            if(result.meta.code == 200){
                alert("上传成功!");
            }else{
                alert("上传失败,错误信息:"+result.data);
            }
        });
    }
    $scope.uploadFiles = function (files, errFiles) {
        angular.forEach(files, function (file) {
            $scope.nowFile = file;
            file.upload = Upload.upload({
                url:  EXPORT_URL + "/tools/excelImport?func=serviceByPublication",
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
                file: file
            }).then(function (response) {

            }, function (response) {
                if (response.status > 0) {
                }
            }, function (evt) {

            });
        });
    };


});
