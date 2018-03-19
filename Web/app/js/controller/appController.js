ionicApp.controller('appController', function ($scope, $rootScope, $state, localStorageService, FILE_URL, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, $cordovaFileTransfer) {
    $scope.$on('$stateChangeSuccess', function () {
        //TouchSlide({
        //    slideCell: "#tabBox1",
        //    endFun: function (e) {
        //        var t = document.getElementById("tabBox1-bd");
        //        t.parentNode.style.height = t.children[e].children[0].offsetHeight + 50 + "px",
        //        e > 0 && (t.parentNode.style.transition = "200ms")
        //    }
        //});
    });
    $scope.Params = {
        Create: function (orderBy, count) {
            var params = {};
            if (orderBy) {
                params._orderBy = orderBy;
            }

            if (count) {
                params._count = count;
            } else {
                params._count = 10;
            }

            params._page = 1;

            params.page = function () {
                return params._page;
            };

            params.orderBy = function () {
                return params._orderBy;
            };

            params.count = function () {
                return params._count;
            };

            params.total = function (total) {
                params._total = total;
            };

            params.next = function () {
                params._page++;
            };

            return params;
        }
    };

    $scope.$takePhoto = function (success) {
        var hide = $ionicActionSheet.show({
            buttons: [
              { text: '<i class="icon ion-ios-camera"></i>拍照' },
              { text: '<i class="icon ion-ios-albums"></i>从相册中选择' }
            ],
            titleText: '获取图片',
            cancelText: '取消',
            cancel: function () {
                // add cancel code..
            },
            buttonClicked: function (index) {
                if (index == 0) {
                    // 拍照
                    var options = {
                        quality: 100,                                       //保存图像的质量，范围0-100
                        destinationType: Camera.DestinationType.FILE_URI,  //返回值格式:DATA_URL=0,返回作为base64编码字符串；FILE_URL=1，返回图像的URL；NATIVE_RUL=2，返回图像本机URL
                        sourceType: Camera.PictureSourceType.CAMERA,       //设置图片来源：PHOTOLIBRARY=0，相机拍照=1，
                        allowEdit: false,                                   //选择图片前是否允许编辑
                        encodingType: Camera.EncodingType.JPEG,            //JPEN = 0，PNG = 1
                        //targetWidth: 100,                                  //缩放图像的宽度（像素）
                        //targetHeight: 100,                                 //缩放图像的高度（像素）
                        popoverOptions: CameraPopoverOptions,              //ios,iPad弹出位置
                        saveToPhotoAlbum: true,                            //是否保存到相册
                        correctOrientation: true                           //设置摄像机拍摄的图像是否为正确的方向
                    };
                    $cordovaCamera.getPicture(options).then(function (imageURI) {
                        success(imageURI);
                        hide();
                    }, function (err) {
                        alert(err);
                    });
                } else if (index == 1) {
                    var options = {
                        maximumImagesCount: 1, //最大选择图片数量
                        width: 0,             //筛选宽度：如果宽度为0，返回所有尺寸的图片
                        height: 0,            //筛选高度：如果高度为0，返回所有尺寸的图片
                        quality: 100          //图像质量的大小，默认为100
                    };
                    $cordovaImagePicker.getPictures(options).then(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            success(results[i])
                            hide();
                            return;
                        }
                    }, function (error) {
                        alert(err);
                    });
                }
            }
        });
    };

    $scope.$uploadPhoto = function (src, success) {
        var uri = FILE_URL + '/file';
        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileNam = src.substr(src.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.headers = { 'Authorization': 'Bearer ' + $rootScope.identity.token };
        options.params = { 'FileTypeCode': 1002 };

        var ft = new FileTransfer();
        ft.upload(src, uri, function (result) {
            success(result.response);
        }, function (err) {
            alert(err.exception);
        }, options);
    };

    $scope.amountInWords = function (n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "";
        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    }
})