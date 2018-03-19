ionicApp.controller('accountBindController', function ($scope, $rootScope, $state, $ionicPopup, customerService, constantsService, payingService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    //获取所有的银行账户信息，并显示是否为默认银行账户
    payingService.getAccount($rootScope.identity.enterprise_id).then(function (data) {
        if (data.acct_list) {
            $scope.AccountData = data.acct_list;
            for (var i = 0; i < $scope.AccountData.length; i++) {
                if ($scope.AccountData[i].is_default == 1) {
                    $scope.AccountData[i].is_default = "是";
                } else {
                    $scope.AccountData[i].is_default = null;
                }
            }
        }
    });
    $rootScope.accountTypeCode = 501
    //卖方买方class改变
    $scope.changeType = function (accountTypeCode) {
        $rootScope.accountTypeCode = accountTypeCode;
        //获取所有的银行账户信息，并显示是否为默认银行账户
        //getAllEnterpriseAccount()
        payingService.getAccount($rootScope.identity.enterprise_id).then(function (data) {
            if (data.acct_list) {
                $scope.AccountData = data.acct_list;
                for (var i = 0; i < $scope.AccountData.length; i++) {
                    if ($scope.AccountData[i].is_default == 1) {
                        $scope.AccountData[i].is_default = "是";
                    } else {
                        $scope.AccountData[i].is_default = null;
                    }
                }
            }
        });
    }
    //获取账户类型
    constantsService.queryConstantsType(5).then(function (data) {
        $scope.accountTypeData = data;
    })

})
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
ionicApp.controller('addAccountController', function ($scope, $rootScope, $state, $ionicPopup, bankService, addressService, customerService, payingService, $ionicModal) {

    $scope.model = {
        enterprise_person: $rootScope.identity.enterprise_name,
        enterpriseId: $rootScope.identity.enterprise_id,
        account_type_code: $rootScope.accountTypeCode,
    };
    //账户验证
    $scope.verifyStr = "账户验证";
    $scope.disableVerify = false;
    $scope.getVerifyh = function () {
        if (!$scope.model.account_person) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入银行名称！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.model.bank_number) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入开户行行号！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!$scope.model.account_number) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入账号！',
                okType: 'button-assertive',
            });
            return;
        }
        payingService.getAccount($scope.model.enterpriseId).then(function (data) {
            $scope.verifyStr = "正在验证";
            $scope.disableVerify = true;
            if (!data.acct_list || data.acct_list.length == 0) {
                payingService.openAccount($scope.model.enterpriseId, $scope.model).then(function (data) {
                    if (data && data != null) {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '审核通过，等待小额验证！',
                            okType: 'button-assertive',
                        });
                    }
                });
            } else if (data.acct_list.length == 1) {
                payingService.addMoreAccount($scope.model.enterpriseId, $scope.model).then(function (data) {
                    if (data && data != null) {
                        $ionicPopup.alert({
                            title: '警告',
                            template: '审核通过，等待小额验证！',
                            okType: 'button-assertive',
                        });
                    }
                });
            }
        })

    }

    //完成绑定
    $scope.submitbinding = function () {
        if ($scope.model.id == null) {
            $scope.model.is_default = 0;
        } else {
            $scope.model.is_default = 1;
        }
        payingService.checkAccount($scope.model.enterpriseId, $scope.model.verify_string, $scope.model.is_default, $scope.model.account_type_code).then(function (data) {
            $scope.identifyModel = data;
            //console.log(data)
            $scope.identifyModel.enterprise_name = $rootScope.identity.enterprise_name;
            $scope.openTipModal()
        });
    }

    //成功提示弹框
    $ionicModal.fromTemplateUrl('successTip.html', {
        scope: $scope,
    }).then(function (modal) {
        $scope.tipModal = modal;
    });

    $scope.openTipModal = function () {
        if (img_path) {
            $scope.tipModal.show();
        }
    }

    $scope.closeTipModal = function () {
        $scope.tipModal.hide();
        $state.go('app.accountBind');
    }
})
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

ionicApp.controller('bankQueryController', function ($rootScope, $scope, $state, $ionicPopup, bankService, addressService) {
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
    }
    $scope.model = {
        head_bank_id: null,
        city_id: null,
        province_id: null,
        keyword: null,
    }
    //精确查询
    $scope.queryPrecise = function () {
        if ($scope.model.precise_id.length != 12) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入正确的行号，行号长度为12位！',
                okType: 'button-assertive',
            });
            return;
        }
        bankService.findSpecificBank($scope.model.precise_id).then(function (data) {
            if (data) {
                $scope.branchPreciseData = data;
            }
            else {
                $ionicPopup.alert({
                    title: '警告',
                    template: '查询结果为空，建议使用模糊查询！',
                    okType: 'button-assertive',
                });
            }
        });
    }
    //根据总行，所在市，关键字找到对应的分行数据
    $scope.queryVague = function () {
        if ($scope.model.head_bank_id && $scope.model.province_id && $scope.model.city_id) {
            $scope.params = $scope.Params.Create();
            $scope.branchVagueData = [];
            $scope.loadMore();
        }
        else {
            $ionicPopup.alert({
                title: '警告',
                template: '请省份(直辖市)、市级、银行名称填写完整后查询！',
                okType: 'button-assertive',
            });
        }
    }
    $scope.loadMore = function (first) {
        bankService.query($scope.params, $scope.model.head_bank_id, $scope.model.city_id, $scope.model.keyword).then(function (data) {
            $scope.hasMore = data.length == 10;
            $scope.branchVagueData = first ? data : $scope.branchVagueData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        $scope.params.next();
    }
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.provinceChange = function () {
        if ($scope.model.province_id == null) {
            return;
        }
        else {
            return addressService.getCity($scope.model.province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    //获取对应市的区
    /*
    $scope.cityChange = function () {
        $scope.branchVagueData = [];
        
        if ($scope.model.city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
        
    }*/

    //获取所有的银行账户总行信息
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });
});
ionicApp.controller('billDetailController', function ($rootScope, $scope, $state, billService) {
    $scope.model = {};
    alert($rootScope.billQuerybillProductId);
    billService.getBillProduct($rootScope.billQuerybillProductId).then(function (data) {
        $scope.model = data;
    });
});

ionicApp.controller('billOfferController', function ($scope, $rootScope, $state, $filter, billService, toolService, addressService) {
    //date类型转换
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    $scope.dateFilter = { date_index: 0 };
    $scope.dates = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];
    $scope.dateTimes = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];
    $scope.date = new Date();
    for (var i = 0; i < 5; i++) {
        $scope.dates[i].date = $scope.date.pattern("yyyy-MM-dd EE");
        $scope.dateTimes[i].date = $scope.date.pattern("yyyy-MM-dd");
        $scope.date.setDate(($scope.date.getDate() - 1));
    }

    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
        $scope.doRefresh();
    }

    //手势滑动
    $scope.onSwipeLeft = function () {
        //alert($scope.tab)
        if ($scope.tab != 4) {
            $scope.setTab($scope.tab + 1);
        }
    }

    $scope.onSwipeRight = function () {
        //alert($scope.tab)
        if ($scope.tab != 1) {
            $scope.setTab($scope.tab - 1);
        }
    }
    $scope.onSwipeDown = function () {

        if ($scope.hasMore) {
            $socpe.loadMore();
        }
    }
    //定位
    $scope.geoLocation = function () {
        $scope.locationModel = {
            city_name: "未知"
        };
        if (navigator.geolocation) {
            $scope.isGeoLocation = true;
            navigator.geolocation.getCurrentPosition(
                function (position) {

                    //杭州: 30，120 上海: 121.48,31.22
                    addressService.geoLocation(position.coords.latitude, position.coords.longitude).then(function (data) {
                        if (data) {
                            //普通城市
                            if (data.locationIdList) {
                                $scope.locationModel.province_name = data.locationIdList[0].provinceName;
                                $scope.locationModel.province_id = data.locationIdList[0].provinceId;
                                $scope.locationModel.city_id = data.locationIdList[0].citytId;
                                $scope.locationModel.city_name = data.locationIdList[0].cityName;
                            }
                                //直辖市
                            else if (data.districtId) {
                                $scope.locationModel.province_name = data.cityName;
                                $scope.locationModel.province_id = data.cityId
                                $scope.locationModel.city_id = data.districtId;
                                $scope.locationModel.city_name = data.districtName;
                            }
                                //特别行政区
                            else {
                                $scope.locationModel.province_name = data.cityName;
                                $scope.locationModel.province_id = data.cityId;
                            }
                        }
                        else {
                            //$ionicPopup.alert({
                            //    title: '通知',
                            //    template: '该城市不在定位范围内！',
                            //    okType: 'button-assertive',
                            //});
                        }
                    });
                },
                function (err) {
                    console.log(err.message);
                }
            );
        }
        else {
            $scope.isGeoLocation = false;
            console.log("不支持地理定位");
            //alert("不支持地理定位");
        }
    }
    $scope.geoLocation();
    $scope.changeBillOfferId = function (billOfferId) {
        $rootScope.billOfferbillOfferId = billOfferId;
    };
    $scope.filter = {
        //func: 'home',
        billStyleId: ['202', '203', '204', '205'],
        //n:10
        search: 'search',
        publishingTimeS: '',
        publishingTimeB: '',
        enterpriseName: '',
        tradeLocationId: '',
        sort:0,
        rate01: true,
        rate02: false,
        rate03: false,
        rate04: false,
        rate05: false,
        rate06: false,
    };
    $scope.doRefresh = function () {
        if ($scope.filter.rate01) {
            $scope.params = $scope.Params.Create('-offer_rate01', 10);
        }
        else {
            $scope.params = $scope.Params.Create('+offer_rate01', 10);
        }
        $scope.listData202 = [];
        $scope.listData203 = [];
        $scope.listData204 = [];
        $scope.listData205 = [];
        $scope.filter.publishingTimeS = '';
        $scope.filter.publishingTimeB = '';
        $scope.loadMore();
    };
    /*
    searchBillOffer: function (params, search, publishingTimeS, publishingTimeB, billStyleId, enterpriseName, tradeLocationId)
    */
    $scope.show = [true, true, true];
    $scope.loadMore = function (first) {
        if ($rootScope.billOfferSearchModel && $rootScope.billOfferSearchModel.submit == true) {
            if ($rootScope.billOfferSearchModel.date instanceof Date) {
                $scope.show[0] = false;
                $rootScope.billOfferSearchModel.date.setDate($rootScope.billOfferSearchModel.date.getDate() + 1);
                $rootScope.billOfferSearchModel.date = $rootScope.billOfferSearchModel.date.toISOString().slice(0, 10);
            }
            if ($rootScope.billOfferSearchModel.city_id) {
                $scope.show[1] = false;
            }
            else if ($rootScope.billOfferSearchModel.province_id) {
                $scope.show[2] = false;
            }
        }
        if ($scope.tab == 1) {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[0], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[0], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).pattern("yyyy-MM-dd");
                }
                $scope.listData202 = first ? data : $scope.listData202.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                for (var i = 0; i < ($scope.listData202).length; i++) {
                    //toolService.getStars($scope.listData202[i].enterprise_id).then(function (data) {
                    //    $scope.listData202[i].star = data;
                    //});
                    toolService.setStars2($scope.listData202[i]);
                };
                //for (let i = 0; i < ($scope.listData202).length; i++) {
                //    toolService.getStars($scope.listData202[i].enterprise_id).then(function (data) {
                //        $scope.listData202[i].star = data;
                //    });
                //};
            });
        }
        else if ($scope.tab == 2) {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[1], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[1], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).toISOString().slice(0, 10);
                }
                $scope.listData203 = first ? data : $scope.listData203.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //for (let i = 0; i < ($scope.listData203).length; i++) {
                //    toolService.getStars($scope.listData203[i].enterprise_id).then(function (data) {
                //        $scope.listData203[i].star = data;
                //    });
                //};
                for (var i = 0; i < ($scope.listData203).length; i++) {
                    //toolService.getStars($scope.listData203[i].enterprise_id).then(function (data) {
                    //    $scope.c.star = data;
                    //});
                    toolService.setStars2($scope.listData203[i]);
                };
            });
        }
        else if ($scope.tab == 3) {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[2], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[2], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).toISOString().slice(0, 10);
                }
                $scope.listData204 = first ? data : $scope.listData204.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //for (let i = 0; i < ($scope.listData204).length; i++) {
                //    toolService.getStars($scope.listData204[i].enterprise_id).then(function (data) {
                //        $scope.listData204[i].star = data;
                //    });
                //};
                for (var i = 0; i < ($scope.listData204).length; i++) {
                    //toolService.getStars($scope.listData204[i].enterprise_id).then(function (data) {
                    //    $scope.listData204[i].star = data;
                    //});
                    toolService.setStars2($scope.listData204[i]);
                };
            });
        }
        else {
            //billService.getHomeBillOffer($scope.filter.func, $scope.filter.billStyleId[3], $scope.filter.n).then(function (data) {
            billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[3], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].offer_detail = JSON.parse(data[item].offer_detail);
                    //data[item].offer_time = new Date(data[item].offer_time).toISOString().slice(0, 10);
                }
                $scope.listData205 = first ? data : $scope.listData205.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                //for (let i = 0; i < ($scope.listData205).length; i++) {
                //    toolService.getStars($scope.listData205[i].enterprise_id).then(function (data) {
                //        $scope.listData205[i].star = data;
                //    });
                //};
                for (var i = 0; i < ($scope.listData205).length; i++) {
                    //toolService.getStars($scope.listData205[i].enterprise_id).then(function (data) {
                    //    $scope.listData205[i].star = data;
                    //});
                    toolService.setStars2($scope.listData205[i]);
                };
            });
        }
        $scope.params.next();
        //$scope.filter.n += 10;
    };

    $scope.rateClick = function (func) {
        $scope.filter.sort = func;
        switch (func) {
            case 0:
                $scope.filter.rate01 = !$scope.filter.rate01;
                break;
            case 1:
                $scope.filter.rate02 = !$scope.filter.rate02;
                break;
            case 2:
                $scope.filter.rate03 = !$scope.filter.rate03;
                break;
            case 3:
                $scope.filter.rate04 = !$scope.filter.rate04;
                break;
            case 4:
                $scope.filter.rate05 = !$scope.filter.rate05;
                break;
            case 5:
                $scope.filter.rate06 = !$scope.filter.rate06;
                break;
        }
        $scope.doRefresh();
    }
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
});
ionicApp.controller('billOfferDetailController', function ($scope, $rootScope, $state, $ionicPopup, billService, enterprisesService, toolService, customerService) {
    $scope.appraisalModel = {};
    billService.getBillOffer($rootScope.billOfferbillOfferId).then(function (data) {
        $scope.model = data;
        toolService.getStars($scope.model.enterprise_id).then(function (data) {
            $scope.star = data;
        });
        $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
    });
    $scope.getorderAppraisal = function () {
        //enterprisesService.getorderAppraisal('101', $scope.model.id).then(function (data) {
        //    $scope.appraisalModel = data;
        //});
    }
    $scope.changeBillStyleId = function (bill_style_id) {
        if (bill_style_id == $scope.model.bill_style_id)
            return;
        $scope.params = $scope.Params.Create('-offer_time', 1);
        $scope.filter = {
            search: '',
            publishingTimeS: '',
            publishingTimeB: '',
            tradeLocationId: '',
        };
        //billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[0], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
           
        billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, bill_style_id, $scope.model.enterprise_name, $scope.filter.tradeLocationId).then(function (data) {
            if (!data[0]) {
                $ionicPopup.alert({
                    title: "通知",
                    template: "没有该类报价信息！",
                    okType: "button-assertive",
                });
            }
            else {
                $scope.model = data[0];
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
        })
    }
    $scope.follow = function (follow) {
        $scope.followModel = {
            collection_enterprise_id: $scope.model.enterprise_id,
            is_collection_enterprise: follow
        }
        customerService.followEnterprise($scope.followModel).then(function () {
            $scope.model.is_collection_enterprise = follow;
        })
    }

    $scope.share = function () {
        $(".g-alert-shares").fadeIn(300);
    };

    $scope.shareClose = function () {
        $(".g-alert-shares").fadeOut(300);
    };

    $scope.shareToWechatFriend = function () {
        Wechat.share({
            text: "分享内容",
            scene: Wechat.Scene.TIMELINE
        }, function () {
            alert("Success");
        }, function (reason) {
            alert("Failed: " + reason);
        });
    };

    $scope.shareToWechat = function () {
        Wechat.share({
            text: "分享内容",
            scene: Wechat.Scene.SESSION
        }, function () {
            alert("Success");
        }, function (reason) {
            alert("Failed: " + reason);
        });
    };

    $scope.shareToWeibo = function () {
        var args = {};
        args.url = 'https://www.huipiaoxian.com';
        args.title = '分享标题';
        args.description = '分享内容';
        args.image = 'https://cordova.apache.org/static/img/pluggy.png';
        WeiboSDK.shareToWeibo(function () {
            alert('share success');
        }, function (failReason) {
            alert(failReason);
        }, args);
    };

    $scope.shareToQQ = function () {
        var args = {};
        args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        args.scene = QQSDK.Scene.QQ;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
        args.text = '分享内容';
        QQSDK.shareText(function () {
            alert('shareText success');
        }, function (failReason) {
            alert(failReason);
        }, args);
    };

    $scope.shareToQQZone = function () {
        var args = {};
        args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        args.scene = QQSDK.Scene.QQZone;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
        args.text = '分享内容';
        QQSDK.shareText(function () {
            alert('shareText success');
        }, function (failReason) {
            alert(failReason);
        }, args);
    };
})
ionicApp.controller('billOfferQueryController', function ($scope, $rootScope, $state, $ionicPopup, billService) {
    //判断是否可以报价
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }

    $scope.filter = {};

    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create('-offer_time', 10);
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        billService.getOwnBillOffer($scope.params, $scope.filter.billTypeId, $scope.filter.billStyleId, $scope.filter.maxPrice, $scope.filter.tradeLocationId, $scope.filter.keyword).then(function (data) {
            $scope.hasMore = data.length == 10;
            for (item in data) {
                data[item].offer_detail = JSON.parse(data[item].offer_detail);
            }
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        $scope.params.next();
    }
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
    //删除报价
    $scope.remove = function (data) {
        var confirmPopup = $ionicPopup.confirm({
            title: '注意',
            template: '确定要删除该报价吗?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                billService.deleteBillOffer(data.id).then(function (data) {
                    $scope.doRefresh();
                });
            }
        });

       
    }

    $scope.edit = function (data) {
        //跳转到报价详细信息
        $state.go('app.newBillOffer', { 'id': data.id });
    }
});
ionicApp.controller('billOfferSearchCityController', function ($scope, $rootScope, $http, $state, $ionicPopup, addressService, $cordovaGeolocation, $ionicScrollDelegate) {
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;

    }

    $rootScope.billOfferSearchModel = {
        submit:false,
    };
    $scope.geoLocation = function(){
        if (navigator.geolocation) {
            $scope.isGeoLocation = true;
            navigator.geolocation.getCurrentPosition(
                function (position) {

                    //杭州: 30，120 上海: 121.48,31.22
                    addressService.geoLocation(30,120).then(function (data) {
                        if (data) {
                            //普通城市
                            if (data.locationIdList) {
                                $rootScope.billOfferSearchModel.province_name = data.locationIdList[0].provinceName;
                                $rootScope.billOfferSearchModel.province_id = data.locationIdList[0].provinceId;
                                $rootScope.billOfferSearchModel.city_id = data.locationIdList[0].cityId;
                                $rootScope.billOfferSearchModel.city_name = data.locationIdList[0].cityName;
                                addressService.queryCity($rootScope.billOfferSearchModel.province_id).then(function (data) {
                                    $scope.CityData = data;
                                });
                            }
                            //直辖市
                            else if (data.districtId) {
                                $rootScope.billOfferSearchModel.province_name = data.cityName;
                                $rootScope.billOfferSearchModel.province_id = data.cityId
                                $rootScope.billOfferSearchModel.city_id = data.districtId;
                                $rootScope.billOfferSearchModel.city_name = data.districtName;
                                addressService.queryCity($rootScope.billOfferSearchModel.province_id + 1).then(function (data) {
                                    $scope.CityData = data;
                                });
                            }
                            //特别行政区
                            else {
                                $rootScope.billOfferSearchModel.province_name = data.cityName;
                                $rootScope.billOfferSearchModel.province_id = data.cityId;
                            }
                        }
                        else {
                            $ionicPopup.alert({
                                title: '通知',
                                template: '该城市不在定位范围内！',
                                okType: 'button-assertive',
                            });
                        }
                    });
                },
                function (err) {
                    console.log(err.message);
                }
            );
        }
        else {
            $scope.isGeoLocation = false;
            console.log("不支持地理定位");
            //alert("不支持地理定位");
        }
    }
    $scope.geoLocation();

    //热门城市
    $scope.hotCity = function (location_id, location_name) {
        $scope.isGeoLocation = false;
        if (!location_id) {
            $rootScope.billOfferSearchModel.province_id = null;
            $rootScope.billOfferSearchModel.province_name = '';
            $rootScope.billOfferSearchModel.city_id = null;
            $rootScope.billOfferSearchModel.city_name = '';
        }
        else {
            if (location_id == 1 || location_id == 20 || location_id == 860 || location_id == 2462) {
                $rootScope.billOfferSearchModel.province_id = location_id;
                $rootScope.billOfferSearchModel.province_name = location_name;
                $rootScope.billOfferSearchModel.city_id = null;
                $rootScope.billOfferSearchModel.city_name = '';
                $scope.setProvince(location_id, location_name);
            }
            else {
                if (location_id == 1007) {
                    $rootScope.billOfferSearchModel.province_id = 1006;
                    $rootScope.billOfferSearchModel.province_name = '浙江省';
                }
                else if (location_id == 2132 || location_id == 2158) {
                    $rootScope.billOfferSearchModel.province_id = 2131;
                    $rootScope.billOfferSearchModel.province_name = '广东省';
                }
                $scope.setProvince($rootScope.billOfferSearchModel.province_id, $rootScope.billOfferSearchModel.province_name);
                $rootScope.billOfferSearchModel.city_id = location_id;
                $rootScope.billOfferSearchModel.city_name = location_name;
            }
        }
    }
    //获取所有省区地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应的省区的市级地址
    $scope.setProvince = function (province_id, province_name) {
        $scope.isGeoLocation = false;
        $rootScope.billOfferSearchModel.province_id = province_id;
        $rootScope.billOfferSearchModel.province_name = province_name;
        $rootScope.billOfferSearchModel.city_id = null;
        $rootScope.billOfferSearchModel.city_name = '';
        if (province_id == null) {
            return;
        } else if (province_id == 1 || province_id == 20 || province_id == 860 || province_id == 2462) {
            province_id = province_id + 1;
            return addressService.queryCity(province_id).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            return addressService.queryCity(province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    $scope.setCity = function (city_id, city_name) {
        $scope.isGeoLocation = false;
        $rootScope.billOfferSearchModel.city_name = city_name;
        $rootScope.billOfferSearchModel.city_id = city_id;
    }
    $scope.submit = function () {
        if ($rootScope.billOfferSearchModel.province_id == 1 || $rootScope.billOfferSearchModel.province_id == 20 || $rootScope.billOfferSearchModel.province_id == 860 || $rootScope.billOfferSearchModel.province_id == 2462) {
            if (!$rootScope.billOfferSearchModel.city_id) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '直辖市必须选择区后才能提交！',
                    okType: 'button-assertive',
                });
                return;
            }
        }
        if ($rootScope.billOfferSearchModel.province_id && !$rootScope.billOfferSearchModel.city_id) {
            $ionicPopup.alert({
                title: '警告',
                template: '省必须选择市后才能提交！',
                okType: 'button-assertive',
            });
            return;
        }
        $rootScope.billOfferSearchModel.submit = true;
        $state.go('app.billOffer');
    }
    //滑动轮回到顶部
    $scope.scrollCityToTop = function () {
        $ionicScrollDelegate.$getByHandle('city').scrollTop();
    };
})

ionicApp.controller('billQueryController', function ($scope, $rootScope, $state, $filter, billService, addressService, $cordovaGeolocation, $ionicGesture) {
    //$scope.$on('$stateChangeSuccess', function () {
    //    TouchSlide({
    //        slideCell: "#tabBox1",
    //        endFun: function (e) {
    //            var t = document.getElementById("tabBox1-bd");
    //            t.parentNode.style.height = t.children[e].children[0].offsetHeight + 50 + "px",
    //            e > 0 && (t.parentNode.style.transition = "200ms")
    //        }
    //    });
    //});
    //date类型转换
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    $scope.dateFilter = { date_index: 0 };
    $scope.dates = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];
    $scope.dateTimes = [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }];
    $scope.date = new Date();
    for (var i = 0; i < 5; i++) {
        $scope.dates[i].date = $scope.date.pattern("yyyy-MM-dd EE");
        $scope.dateTimes[i].date = $scope.date.pattern("yyyy-MM-dd");
        $scope.date.setDate(($scope.date.getDate() - 1));
    }

    //定位
    $scope.geoLocation = function () {
        $scope.locationModel = {
            city_name: "未知"
        };
        if (navigator.geolocation) {
            $scope.isGeoLocation = true;
            navigator.geolocation.getCurrentPosition(
                function (position) {

                    //杭州: 30，120 上海: 121.48,31.22
                    addressService.geoLocation(position.coords.latitude, position.coords.longitude).then(function (data) {
                        if (data) {
                            //普通城市
                            if (data.locationIdList) {
                                $scope.locationModel.province_name = data.locationIdList[0].provinceName;
                                $scope.locationModel.province_id = data.locationIdList[0].provinceId;
                                $scope.locationModel.city_id = data.locationIdList[0].citytId;
                                $scope.locationModel.city_name = data.locationIdList[0].cityName;
                            }
                                //直辖市
                            else if (data.districtId) {
                                $scope.locationModel.province_name = data.cityName;
                                $scope.locationModel.province_id = data.cityId
                                $scope.locationModel.city_id = data.districtId;
                                $scope.locationModel.city_name = data.districtName;
                            }
                                //特别行政区
                            else {
                                $scope.locationModel.province_name = data.cityName;
                                $scope.locationModel.province_id = data.cityId;
                            }
                        }
                        else {
                            //$ionicPopup.alert({
                            //    title: '通知',
                            //    template: '该城市不在定位范围内！',
                            //    okType: 'button-assertive',
                            //});
                        }
                    });
                },
                function (err) {
                    console.log(err.message);
                }
            );
        }
        else {
            $scope.isGeoLocation = false;
            console.log("不支持地理定位");
            //alert("不支持地理定位");
        }
    }
    $scope.geoLocation();
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
    }
    //手势滑动
    $scope.onSwipeLeft = function () {
        if ($scope.tab != 2) {
            $scope.setTab($scope.tab + 1);
        }
    }

    $scope.onSwipeRight = function () {
        if ($scope.tab != 1) {
            $scope.setTab($scope.tab - 1);
        }
    }
    $rootScope.billQuerybillProductId = null;
    $scope.changeBillProductId = function (billProductId) {
        $rootScope.billQuerybillProductId = billProductId;
        //$state.go('app.billDetail');
    };

    $scope.filter = {
        acceptorTypeID: '',
        billStatusAll: true,
        tradeTypeCode: '',
        billTypeID: ['101', '102'],
        billStatusCode: '801',
        billCharacterCode: '',
        billStyleID: '',
        sort : 0,
        priceArrow: true,
        deadlineTimeArrow: false
    };
    $scope.doRefresh = function () {
        switch ($scope.filter.sort) {
            case 0:
                if ($scope.filter.priceArrow) {
                    $scope.params = $scope.Params.Create('-bill_sum_price', 10);
                }
                else {
                    $scope.params = $scope.Params.Create('+bill_sum_price', 10);
                }
                break;
            case 1:
                if ($scope.deadlineTimeArrow) {
                    $scope.params = $scope.Params.Create('-deadline_time', 10);
                }
                else {
                    $scope.params = $scope.Params.Create('+deadline_time', 10);
                }
                break;
        }
        $scope.listData101 = [];
        $scope.listData102 = [];
        $scope.loadMore();
    };
    $scope.show = true;
    $scope.loadMore = function (first) {
        if ($rootScope.billSearchModel && $rootScope.billSearchModel.submit == true) {
            if ($rootScope.billSearchModel.date instanceof Date) {
                $scope.show = false;
                $rootScope.billSearchModel.date.setDate($rootScope.billSearchModel.date.getDate() + 1);
                $rootScope.billSearchModel.date = $rootScope.billSearchModel.date.toISOString().slice(0, 10);
            }
            if ($rootScope.billSearchModel.city_id) {
                $scope.filter.locationId = $rootScope.billSearchModel.city_id;
            }
            else if ($rootScope.billSearchModel.province_id) {
                $scope.filter.locationId = $rootScope.billSearchModel.province_id;
            }
        }
        if ($scope.filter.sort == 0) {
            billService.searchBillProduct($scope.params, $scope.filter.billTypeID[0], $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].publishing_time = new Date(data[item].publishing_time).pattern("yyyy-MM-dd");
                }
                $scope.listData101 = first ? data : $scope.listData101.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        else {
            billService.searchBillProduct($scope.params, $scope.filter.billTypeID[1], $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                $scope.hasMore = data.length == 10;
                for (item in data) {
                    data[item].publishing_time = new Date(data[item].publishing_time).toISOString().slice(0, 10);
                }
                $scope.listData102 = first ? data : $scope.listData102.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        $scope.params.next();
    };

    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
    //$scope.sort = 0;
    //$scope.priceArrow = true;
    $scope.changeArrow = function (func) {
        switch (func) {
            case 'price':
                $scope.filter.sort = 0;
                $scope.filter.priceArrow = !$scope.filter.priceArrow;
                break;
            case 'deadline_time':
                $scope.filter.sort = 1;
                $scope.filter.deadlineTimeArrow = !$scope.filter.deadlineTimeArrow;
                break;
        }
        $scope.doRefresh();
    }
});
ionicApp.controller('billSearchCityController', function ($scope, $rootScope, $state, $ionicPopup, addressService, $cordovaGeolocation, $ionicScrollDelegate) {
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;

    }

    $rootScope.billSearchModel = {
        submit:false,
    };
    $scope.geoLocation = function () {
        if (navigator.geolocation) {
            $scope.isGeoLocation = true;
            navigator.geolocation.getCurrentPosition(
                function (position) {

                    //杭州: 30，120 上海: 121.48,31.22
                    addressService.geoLocation(position.coords.latitude, position.coords.longitude).then(function (data) {
                        if (data) {
                            //普通城市
                            if (data.locationIdList) {
                                $rootScope.billSearchModel.province_name = data.locationIdList[0].provinceName;
                                $rootScope.billSearchModel.province_id = data.locationIdList[0].provinceId;
                                $rootScope.billSearchModel.city_id = data.locationIdList[0].cityId;
                                $rootScope.billSearchModel.city_name = data.locationIdList[0].cityName;
                                addressService.queryCity($rootScope.billSearchModel.province_id).then(function (data) {
                                    $scope.CityData = data;
                                });
                            }
                            //直辖市
                            else if (data.districtId) {
                                $rootScope.billSearchModel.province_name = data.cityName;
                                $rootScope.billSearchModel.province_id = data.cityId
                                $rootScope.billSearchModel.city_id = data.districtId;
                                $rootScope.billSearchModel.city_name = data.districtName;
                                addressService.queryCity($rootScope.billSearchModel.province_id + 1).then(function (data) {
                                    $scope.CityData = data;
                                });
                            }
                            //特别行政区
                            else {
                                $rootScope.billSearchModel.province_name = data.cityName;
                                $rootScope.billSearchModel.province_id = data.cityId;
                            }
                        }
                        else {
                            $ionicPopup.alert({
                                title: '通知',
                                template: '该城市不在定位范围内！',
                                okType: 'button-assertive',
                            });
                        }
                    });
                },
                function (err) {
                    console.log(err.message);
                }
            );
        }
        else {
            $scope.isGeoLocation = false;
            console.log("不支持地理定位");
            //alert("不支持地理定位");
        }
    }
    $scope.geoLocation();
    //获取对应的省下所有的市级地址
    $scope.setProvince = function (province_id, province_name) {
        $scope.isGeoLocation = false;
        $rootScope.billSearchModel.province_name = province_name;
        $rootScope.billSearchModel.province_id = province_id;
        $rootScope.billSearchModel.city_id = null;
        $rootScope.billSearchModel.city_name = '';
        if (province_id == null) {
            return;
        }
        else if (province_id == 1 || province_id == 20 || province_id == 860 || province_id == 2462) {
            province_id = province_id + 1;
            return addressService.queryCity(province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
        else {
            return addressService.queryCity(province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    $scope.setCity = function (city_id, city_name) {
        $scope.isGeoLocation = false;
        $rootScope.billSearchModel.city_name = city_name;
        $rootScope.billSearchModel.city_id = city_id;
    }
    //热门城市
    $scope.hotCity = function (location_id, location_name) {
        $scope.isGeoLocation = false;
        if (!location_id) {
            $rootScope.billSearchModel.province_id = null;
            $rootScope.billSearchModel.province_name = '';
            $rootScope.billSearchModel.city_id = null;
            $rootScope.billSearchModel.city_name = '';
        }
        else {
            if (location_id == 1 || location_id == 20 || location_id == 860 || location_id == 2462) {
                $rootScope.billSearchModel.province_id = location_id;
                $rootScope.billSearchModel.province_name = location_name;
                $rootScope.billSearchModel.city_id = null;
                $rootScope.billSearchModel.city_name = '';
                $scope.setProvince(location_id, location_name);
            }
            else {
                if (location_id == 1007) {
                    $rootScope.billSearchModel.province_id = 1006;
                    $rootScope.billSearchModel.province_name = '浙江省';
                }
                else if (location_id == 2132 || location_id == 2158) {
                    $rootScope.billSearchModel.province_id = 2131;
                    $rootScope.billSearchModel.province_name = '广东省';
                }
                $scope.setProvince($rootScope.billSearchModel.province_id, $rootScope.billSearchModel.province_name);
                $rootScope.billSearchModel.city_id = location_id;
                $rootScope.billSearchModel.city_name = location_name;
            }
        }
    }
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    $scope.submit = function () {
        if ($rootScope.billSearchModel.province_id == 1 || $rootScope.billSearchModel.province_id == 20 || $rootScope.billSearchModel.province_id == 860 || $rootScope.billSearchModel.province_id == 2462) {
            if (!$rootScope.billSearchModel.city_id) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '直辖市必须选择区后才能提交！',
                    okType: 'button-assertive',
                });
                return;
            }
        }
        $rootScope.billSearchModel.submit = true;
        $state.go('app.billQuery');
    }

    //滑动轮回到顶部
    $scope.scrollCityToTop = function () {
        $ionicScrollDelegate.$getByHandle('city').scrollTop();
    };
})
ionicApp.controller('businessQueryController', function ($rootScope, $scope, $state, $ionicPopup, $ionicModal, API_URL, customerService) {
    //公商查询
    $scope.query = function (name) {
        if (!name || name.length < 4) {
            $ionicPopup.alert({
                title: '警告',
                template: '至少输入四个关键字！',
                okType: 'button-assertive',
            });
            return;
        }
        customerService.enterpriseDetail(name, 1).then(function (data) {
            $scope.enterpriseInfo = data;
            if (data == null) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '查询无结果！',
                    okType: 'button-assertive',
                });
            }
        });
    }
    //详细弹框
    $ionicModal.fromTemplateUrl('detail.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.detailModal = modal;
    });

    $scope.openDetailModal = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.enterpriseDetailInfo = data;
            $scope.detailModal.show();
        });
    }

    $scope.closeDetailModal = function () {
        $scope.detailModal.hide();
    }
    //查看详情
    /*$scope.read = function (data) {
        customerService.enterpriseDetail(data['name'], 0).then(function (data) {
            $scope.model = data;
            $('#modal-read').modal('show');
        });
    };*/
});

ionicApp.controller('calculatorController', function ($rootScope, $scope, $state, $ionicPopup, toolService, $ionicModal) {
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
        $scope.changeMode(index - 1);
    }
    //计算时用的数字的栈
    $scope.num = [];
    //接受输入用的运算符栈
    $scope.opt = [];
    //计算器计算结果
    $scope.result = '';
    //表示是否要重新开始显示,为true表示不重新显示，false表示要清空当前输出重新显示数字
    $scope.flag = true;
    //表示当前是否可以再输入运算符，如果可以为true，否则为false
    $scope.isOpt = true;
    //显示计算器样式
    var date = new Date();
    //alert(date);
    //date.setHours(date.getHours() + 8);
    //alert(date);
    //date.setDate(date.getDate() - 1);
    //alert(date);
    var tormorrow = new Date();
    //alert(tormorrow);
    tormorrow.setDate(date.getDate() + 1);
    //alert(tormorrow);
    $scope.model = {
        /*
        start_date: date,
        start_time: date.toISOString().slice(0, 10),/*toLocaleDateString().replace('/','-').replace('/','-')
        end_date: tormorrow,
        end_time: tormorrow.toISOString().slice(0, 10),/*toLocaleDateString().replace('/', '-').replace('/', '-'),*/
        interest_type: "year",
        bill_type: "elec",
        adjust_day: 0,
        days: "",
    };


    //alert($scope.model.start_date);
    //alert($scope.model.start_time);
    //alert($scope.model.end_date);
    //alert($scope.model.end_time);
    $scope.initModel = {};
    angular.copy($scope.model, $scope.initModel);
    /*
    $scope.model.start_date = date,
    $scope.model.start_time = date.toISOString().slice(0, 10);/*toLocaleDateString().replace('/','-').replace('/','-')
    $scope.model.end_date = tormorrow;
    $scope.model.end_time = tormorrow.toISOString().slice(0, 10);/*toLocaleDateString().replace('/', '-').replace('/', '-'),*/
    $scope.chooseMany = 0;
    $scope.interestTypes = [{ type: 'year', name: '年利率' }, { type: 'month', name: '月利率' }];
    $scope.billTypes = [{ type: 'elec', name: '电票' }, { type: 'paper', name: '纸票' }];
    $scope.changeType = function (type) {
        if ($scope.chooseMany == 0) {
            switch (type) {
                case "year":
                    $scope.model.interest_type = 'year'; $scope.model.bill_type = 'elec'; $scope.model.adjust_day = 0;
                    break;
                case "month":
                    $scope.model.interest_type = 'month'; $scope.model.bill_type = 'paper'; $scope.model.adjust_day = 0;
                    break;
                case "elec":
                    $scope.model.bill_type = 'elec'; $scope.model.adjust_day = 0; $scope.model.interest_type = 'year';
                    break;
                case "paper":
                    $scope.model.bill_type = 'paper'; $scope.model.adjust_day = 3; $scope.model.interest_type = 'month';
                    break;
            }
        }
        else {
            switch (type) {
                case "elec":
                    $scope.model.bill_type = 'elec'; $scope.model.interest_type = 'year'; $scope.model.adjust_day = 0;
                    break;
                case "paper":
                    $scope.model.bill_type = 'paper'; $scope.model.interest_type = 'month'; $scope.model.adjust_day = 3;
                    break;
                case "year":
                    $scope.model.interest_type = 'year'; $scope.model.bill_type = 'elec';
                    break;
                case "month":
                    $scope.model.interest_type = 'month'; $scope.model.bill_type = 'paper';
                    break;
            }
        }
    }

    $scope.$watch('model.start_date', function (newValue, oldValue) {
        /*
            toISOString().slice(0, 10)会减一天;
            实际上start-time比start-date少一天
        */
        if (newValue != null) newValue.setDate(newValue.getDate() + 1);
        if (newValue === oldValue) { return; } // AKA first run
        //if ($scope.model.start_time instanceof Date) {
        /*
        var dateValue = new Date();
        dateValue.setHours(newValue.getHours() + 8);
        dateValue.setDate(dateValue.getDate() - 1);
        */
        if (newValue == null) $scope.model.start_time = null;
        else {
            /*
            $scope.model.start_time = newValue/*.toISOString().slice(0, 10);//toLocaleDateString().replace('/', '-').replace('/', '-');
            alert($scope.model.start_time);*/
            $scope.model.start_time = newValue.toISOString().slice(0, 10);//toLocaleDateString().replace('/', '-').replace('/', '-');
            //alert($scope.model.start_time);
        }
        $scope.onTimeSet($scope.model.start_time, 'start_time');
        //}
    });
    $scope.$watch('model.end_date', function (newValue, oldValue) {
        if (newValue != null) newValue.setDate(newValue.getDate() + 1);
        if (newValue === oldValue) { return; } // AKA first run
        if (newValue == null) $scope.model.end_time = null;
        else $scope.model.end_time = newValue.toISOString().slice(0, 10);;//toLocaleDateString().replace('/', '-').replace('/', '-');
        $scope.onTimeSet($scope.model.end_time, 'end_time');
    });
    $scope.$watch('model.many_start_date', function (newValue, oldValue) {
        if (newValue != null) newValue.setDate(newValue.getDate() + 1);
        if (newValue === oldValue) { return; } // AKA first run
        if (newValue == null) $scope.model.many_start_time = null;
        else {
            /*
            $scope.model.many_start_time = newValue/*.toISOString().slice(0, 10); //toLocaleDateString().replace('/', '-').replace('/', '-');
            alert($scope.model.many_start_time);
            */
            $scope.model.many_start_time = newValue.toISOString().slice(0, 10);
            //alert($scope.model.many_start_time);
        }
        $scope.onTimeSet($scope.model.many_start_time, 'many_start_time');
    });
    $scope.$watch('model.many_end_date', function (newValue, oldValue) {
        if (newValue != null) newValue.setDate(newValue.getDate() + 1);
        if (newValue === oldValue) { return; } // AKA first run
        if (newValue == null) $scope.model.many_end_time = null;
        else $scope.model.many_end_time = newValue.toISOString().slice(0, 10); //toLocaleDateString().replace('/', '-').replace('/', '-');
        $scope.onTimeSet($scope.model.many_end_time, 'many_end_time');
    });

    //选择时间，请求是否假期
    $scope.onTimeSet = function (newDate, key) {
        if (newDate == null) {
            $scope.model[key + '_tip'] = '';
            return;
        }
        toolService.isCalendarSpecial(newDate).then(function (data) {
            $scope.model[key + '_tip'] = data.holiday_name;
        });
    }
    /*
    //手机端<input type=date 对ng-change无响应,导致即时判断是否为节假日暂时无法实现。。
    $scope.changeTime = function (time, key) {
        alert("changeTime");
        alert(time);
        var date = new Date(time);
        alert(date);
        date = date.toISOString();
        alert(date);
        date = date.toISOString().slice(0, 10);
        alert(date);
        switch (key) {
            case "start_time":
                $scope.model.start_time = date;
                break;
            case "end_time":
                $scope.model.end_time = date;
                break;
            case "many_start_time":
                $scope.model.many_start_time = date;
                break;
            case "many_end_time":
                $scope.model.many_end_time = date;
                break;
        }
    }
    */
    $scope.calcuInterest = function (func) {
        var query = {};
        angular.copy($scope.model, query);
        if (!$scope.model.denomination) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入票面金额！',
                okType: 'button-assertive',
            });
            return;
        }
        //通过利率计算
        if (!func) {
            if (!$scope.model.interest) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '请输入利率！',
                    okType: 'button-assertive',
                });
                return;
            }

            if (!$scope.model.start_time || !$scope.model.end_time) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '请输入开始和结束时间！',
                    okType: 'button-assertive',
                });
                return;
            }
            if (parseInt($scope.model.start_time.replace(/-/g, "")) >= parseInt($scope.model.end_time.replace(/-/g, ""))) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '贴现时间必须小于到期时间！',
                    okType: 'button-assertive',
                });
                return;
            }
            if ($scope.model.interest) {
                query['interest_year'] = null;
                query['interest_month'] = null;
                query['interest_' + $scope.model.interest_type] = query.interest;
            }
        } else {
            //十万计算
            if (!$scope.model.every_plus) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '请输入贴息！',
                    okType: 'button-assertive',
                });
                return;
            }
            query.start_time = null;
            query.end_time = null;
            if ($scope.model.many_start_time && $scope.model.many_end_time) {
                if (parseInt($scope.model.many_start_time.replace(/-/g, "")) >= parseInt($scope.model.many_end_time.replace(/-/g, ""))) {

                    $ionicPopup.alert({
                        title: '警告',
                        template: '贴现时间必须小于到期时间！',
                        okType: 'button-assertive',
                    });
                    return;
                }
                query.start_time = $scope.model.many_start_time;
                query.end_time = $scope.model.many_end_time;
            }
            else {
                toolService.calculator(query, func).then(function (data) {
                    $scope.interestResult = {
                        discount_interest: data.discount_interest,
                        discount_amount: data.discount_amount
                    }

                });
                return;
            }
        }

        toolService.calculator(query, func).then(function (data) {
            $scope.interestResult = data;
        });
    }

    //重置表单
    $scope.clear = function () {
        angular.copy($scope.initModel, $scope.model);
        $scope.interestResult = "";
    }

    $scope.changeMode = function (mode) {
        $scope.chooseMany = mode;
        $scope.clear();
    }

    //再计算
    $scope.calculatorAgain = function (func) {
        if (!func) {
            $scope.model.interest = Number($scope.interestResult['interest_' + $scope.model.interest_type]);
            $scope.model.start_date = $scope.model.many_start_date;
            $scope.model.start_time = $scope.model.many_start_time;
            $scope.model.end_date = $scope.model.many_end_date;
            $scope.model.end_time = $scope.model.many_end_time;
            /*
            $scope.model = {
                denomination: $scope.model.denomination,
                interest_type: $scope.model.interest_type,
                bill_type: $scope.model.bill_type,
                every_plus: $scope.model.every_plus,
                commission: $scope.model.commission,
            };
            */
            $scope.tab = 1;
            $scope.chooseMany = 0;
        }
        else {
            $scope.model.every_plus = Number($scope.interestResult.every_plus_amount),
            $scope.model.many_start_date = $scope.model.start_date;
            $scope.model.many_start_time = $scope.model.start_time;
            $scope.model.many_end_date = $scope.model.end_date;
            $scope.model.many_end_time = $scope.model.end_time;
            /*
            $scope.model = {
                denomination: $scope.model.denomination,
                interest_type: $scope.model.interest_type,
                bill_type: $scope.model.bill_type,
            };
            */
            $scope.tab = 2;
            $scope.chooseMany = 1;
        }
        $scope.calcuInterest(func);
    }

    //计算器弹框
    $ionicModal.fromTemplateUrl('calc.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.calcModal = modal;
    });

    $scope.openCalcModal = function (number) {
        if (number) {
            $scope.calcModal.show();
            $scope.number = number;
            $scope.result = $scope.number;
            $scope.num.push($scope.number);
        }
    }

    $scope.closeCalcModal = function () {
        $scope.calcModal.hide();
    }
    $scope.data = {
        "1": ["AC", "+/-", "%", "÷"],
        "2": ["7", "8", "9", "×"],
        "3": ["4", "5", "6", "－"],
        "4": ["1", "2", "3", "＋"],
        "5": ["返回","0", ".", "="]
    };
  
    $scope.showClass = function (index, a) {
        if (a == 0) {
            return "zero";
        }
        return index == 3 || a == "=" ? "end-no" : "normal";
    };
    $scope.init=function(){
        $scope.num = [];
        
        $scope.opt=[];
        $scope.flag = true;
        $scope.isOpt = true;
        $scope.point = false;

    };
    $scope.showResult = function (a) {
        var reg = /\d/ig, regDot = /\./ig, regAbs = /\//ig;
        //如果点击的是个数字
        if (reg.test(a)) {
            //消除冻结
            if ($scope.isOpt == false) {
                $scope.isOpt = true;
            }
            if ($scope.result != 0 && $scope.flag && $scope.result != "error") {
                $scope.result += a;
            }
            else if ($scope.point == true && $scope.flag && $scope.result != 'error') {
                $scope.result += a;
                $scope.point = false;
            }
            else {
                $scope.result = a;
                $scope.flag = true;
            }
        }
            //如果点击的是AC
        else if (a == "AC") {
            $scope.result = '';
            $scope.result += 0;
            $scope.init();
        }
        else if (a == ".") {
            if ($scope.result != "" && $scope.flag && !regDot.test($scope.result)) {
                $scope.result += a;
                $scope.point = true;
            }
            else if($scope.result != '' && !$scope.flag) {
                $scope.result = '';
                $scope.result += 0;
                $scope.result += a;
                $scope.point = true;
                $scope.flag = true;
            }
        }
        else if (regAbs.test(a)) {
            if ($scope.result > 0) {
                $scope.result = "-" + $scope.result;
            }
            else {
                $scope.result = Math.abs($scope.result);
            }
        }
        else if (a == "%") {
            $scope.result = $scope.format(Number($scope.result) / 100);

        } else if (a == "返回") {
            $scope.closeCalcModal();
        }
            //如果点击的是个运算符且当前显示结果不为空和error
        else if ($scope.checkOperator(a) && $scope.result != "" && $scope.result != "error" && $scope.isOpt) {
            $scope.flag = false;
            $scope.num.push($scope.result);
            $scope.operation(a);
            //点击一次运算符之后需要将再次点击运算符的情况忽略掉
            $scope.isOpt = false;
        }
        else if (a == "=" && $scope.result != "" && $scope.result != "error") {
            $scope.flag = false;
            $scope.num.push($scope.result);
            while ($scope.opt.length != 0) {
                var operator = $scope.opt.pop();
                var right = $scope.num.pop();
                var left = $scope.num.pop();
                $scope.calculate(left, operator, right);
            }
        }
    };
    $scope.format = function (num) {
        //var regNum = /.{10,}/ig;
        //if (regNum.test(num)) {
        //    if (/\./.test(num)) {
        //        return num.toExponential(3);
        //    }
        //    else {
        //        return num.toExponential();
        //    }
        //}
        //else {
        //    return num;
        //}
        return num;
    }
    //比较当前输入的运算符和运算符栈栈顶运算符的优先级
    //如果栈顶运算符优先级小，则将当前运算符进栈，并且不计算，
    //否则栈顶运算符出栈，且数字栈连续出栈两个元素，进行计算
    //然后将当前运算符进栈。
    $scope.operation = function (current) {
        //如果运算符栈为空，直接将当前运算符入栈
        if (!$scope.opt.length) {
            $scope.opt.push(current);
            return;
        }
        var operator, right, left;
        var lastOpt = $scope.opt[$scope.opt.length - 1];
        //如果当前运算符优先级大于last运算符，仅进栈
        if ($scope.isPri(current, lastOpt)) {
            $scope.opt.push(current);
        }
        else {
            operator = $scope.opt.pop();
            right = $scope.num.pop();
            left = $scope.num.pop();
            $scope.calculate(left, operator, right);
            $scope.operation(current);
        }
    };
    //负责计算结果函数
    $scope.calculate = function (left, operator, right) {
        switch (operator) {
            case "＋":
                $scope.result = $scope.format(Number(left) + Number(right));
                $scope.num.push($scope.result);
                break;
            case "－":
                $scope.result = $scope.format(Number(left) - Number(right));
                $scope.num.push($scope.result);
                break;
            case "×":
                $scope.result = $scope.format(Number(left) * Number(right));
                $scope.num.push($scope.result);
                break;
            case "÷":
                if (right == 0) {
                    $scope.result = "error";
                    $scope.init();
                }
                else {
                    $scope.result = $scope.format(Number(left) / Number(right));
                    $scope.num.push($scope.result);
                }
                break;
            default: break;
        }
    };
    //判断当前运算符是否优先级高于last，如果是返回true
    //否则返回false
    $scope.isPri = function (current, last) {
        if (current == last) {
            return false;
        }
        else {
            if (current == "×" || current == "÷") {
                if (last == "×" || last == "÷") {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    };
    //判断当前符号是否是可运算符号
    $scope.checkOperator = function (opt) {
        if (opt == "＋" || opt == "－" || opt == "×" || opt == "÷") {
            return true;
        }
        return false;
    }
    $scope.denominationChange = function () {
        if ($scope.model.denomination > 999999.999999) {
            $scope.model.denomination = 999999.999999;
        }
        else if ($scope.model.denomination < 0)
            $scope.model.denomination = 0;
    }
});
ionicApp.controller('calendarController', function ($rootScope, $scope, $state, toolService) {
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;

    }
    $scope.tab1 = 1;
    $scope.setTab1 = function (index) {
        $scope.tab1 = index;

    }
    var date = new Date();
    $scope.model = {
        billTypeId: 101,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        number: 6,
    }
    $scope.initModel = {};
    s = $scope.model.year;
    if ($scope.model.month < 10)
        s = s + '-0' + $scope.model.month;
    else
        s = s + '-' + $scope.model.month;
    if ($scope.model.day < 10)
        s = s + '-0' + $scope.model.day;
    else
        s = s + '-' + $scope.model.day;
    //$scope.todayStr = $scope.model.year + '-' + $scope.model.month + '-' + $scope.model.day;
    $scope.todayStr = s;    //当前日期字符串
    angular.copy($scope.model, $scope.initModel);

    $scope.getNumber = function (num) { var x = new Array(); for (var i = 0; i < num; i++) { x.push(i + 1); } return x; }
    //初始化数据,设置最大查询允许月份
    $scope.maxMonth = 2;
    function init_data() {
        $scope.allYears = new Array(20);
        $scope.allYears[0] = (date.getMonth() + 1) > 10 ? date.getFullYear() + 1 : date.getFullYear();
        for (var i = 1; i < $scope.allYears.length; i++)
            $scope.allYears[i] = $scope.allYears[i - 1] - 1;
        $scope.allMonths = $scope.getNumber((date.getMonth() + 1) > (12 - $scope.maxMonth) ? $scope.model.year > date.getFullYear() ? (date.getMonth() + 1 + $scope.maxMonth) % 12 : 12 : date.getMonth() + 1 + $scope.maxMonth);
        $scope.weekMap_en = {
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6,
            "Sunday": 7,
        };
        $scope.weekMap = {
            "星期一": 1,
            "星期二": 2,
            "星期三": 3,
            "星期四": 4,
            "星期五": 5,
            "星期六": 6,
            "星期日": 7,
        };
    }
    init_data();

    //reset
    $scope.reset = function () {
        $scope.model.day = $scope.initModel.day;
        $scope.setYear($scope.initModel.year);
        $scope.setMonth($scope.initModel.month);
        $scope.queryCalendar();
    }
    $scope.setYear = function (year) {
        if (date.getFullYear() <= year) {
            $scope.allMonths = $scope.getNumber((date.getMonth() + 1) > (12 - $scope.maxMonth) ? year > date.getFullYear() ? (date.getMonth() + 1 + $scope.maxMonth) % 12 : 12 : date.getMonth() + 1 + $scope.maxMonth);
        } else {
            $scope.allMonths = $scope.getNumber(12);
        }
        //判断不超过最大月份
        if ($scope.allMonths[$scope.allMonths.length - 1] < $scope.model.month) {
            $scope.model.month = $scope.allMonths[$scope.allMonths.length - 1];
        }
        $scope.model.year = year;
        $scope.queryCalendar();
    }
    $scope.setMonth = function (month) {
        if ($scope.allMonths[$scope.allMonths.length - 1] < month) {
            return;
        }
        $scope.model.month = month;
        $scope.queryCalendar();
    }

    //查询Calendar
    $scope.queryCalendar = function () {
        toolService.searchCalendar($scope.model.year, $scope.model.month, $scope.model.billTypeId, $scope.model.number).then(function (data) {
            $scope.calendarResult = new Array(5);
            var firstDayIndex = $scope.weekMap[data[0].week_name] - 1;
            var calendarPrev = new Array();
            for (var i = 0; i < firstDayIndex; i++)
                calendarPrev.push({ "week_name": null, "bill_calendar_days": null })
            for (var i = 0; i < 6; i++) {
                if (i == 0)
                    $scope.calendarResult[i] = calendarPrev.concat(data.slice(0, 7 - firstDayIndex))
                else
                    $scope.calendarResult[i] = data.slice(i * 7 - firstDayIndex, i * 7 + 7 - firstDayIndex);
                if ($scope.calendarResult[i].length != 7) {
                    for (var j = 0; j < 7 - $scope.calendarResult[i].length; j++)
                        $scope.calendarResult[i].push({ "week_name": null, "bill_calendar_days": null });
                }
            }
        });
    }
    $scope.queryCalendar();

    $scope.refresh = function (id) {
        $scope.model.billTypeId = id;
        if (id = 102)
            $scope.model.number = 6;
        $scope.queryCalendar();
    }

    $scope.refreshCycle = function (cycle) {
        $scope.model.number = cycle;
        $scope.queryCalendar();
    }
});

ionicApp.controller('drawBillController', function ($scope, $rootScope, $state, $stateParams, $timeout, $ionicModal, $ionicPopup, $timeout, billService, addressService, customerService, constantsService, bankService, fileService) {

    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return;
        //判断是否允许出票
    } else if ($rootScope.identity.is_verified != 4 && $rootScope.identity.is_verified != 1) {
        $ionicPopup.alert({
            title: '警告',
            template: '未绑定出票账户，无法发布汇票！',
            okType: 'button-assertive',
        });
        //$timeout(function () {
        //    $state.go("app.user");
        //}, 1000);
        $state.go("app.user");

        return;
    }

    $scope.model = {
        endorsement_number: 0,
        contact_name: $rootScope.identity == null ? "" : $rootScope.identity.customer_name,
        contact_phone: $rootScope.identity == null ? "" : $rootScope.identity.phone_number,
        bill_type_id: 101,
        trade_type_code: 701,
        bill_deadline_time: new Date().setYear(new Date().getFullYear() + 1),
        bill_deadline_date: new Date(new Date().setYear(new Date().getFullYear() + 1)),
    };
    $scope.filter = {
        tradetype: 0,
    }
    //获取客户信息中的省市地址信息
    init = function () {
        customerService.getCustomer().then(function (data) {
            if (data.trade_location_province_id && data.trade_location_city_id) {
                $scope.model.product_province_id = data.trade_location_province_id;

                addressService.queryCity(data.trade_location_province_id).then(function (data) {
                    $scope.cityData = data;
                });
                $scope.model.product_location_id = data.trade_location_city_id;
            }
        });
    };
    init();

    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })

    //获取我的发布详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            $scope.model.drawer_account_id = $stateParams.accountId;
            $scope.model.bill_deadline_date = new Date($scope.model.bill_deadline_time);
            $timeout(function () {
                if ($stateParams.id && $scope.model.trade_type_code == 702 && $scope.model.bill_type_id == 101) {
                    $scope.filter.tradetype = 1;
                    //document.getElementById("price").readOnly = "readonly";
                    //document.getElementById("acceptortype").disabled = "true";
                    //document.getElementById("producttime").readOnly = "readonly";
                    //document.getElementById("producttime").disabled = "true";
                }
            });
            //$('.jqzoom').imagezoom();
        });
    }

    $scope.$watch('model.bill_deadline_date', function (newValue, oldValue) {
        if (newValue === oldValue) { return; } // AKA first run
        //if ($scope.model.start_time instanceof Date) {
        /*
        var dateValue = new Date();
        dateValue.setHours(newValue.getHours() + 8);
        dateValue.setDate(dateValue.getDate() - 1);
        */
        $scope.model.bill_deadline_time = new Date($scope.model.bill_deadline_date).getTime();
        //if (newValue == null) $scope.model.start_time = null;
        //else $scope.model.start_time = newValue.toISOString().slice(0, 10);//toLocaleDateString().replace('/', '-').replace('/', '-');
        //$scope.onTimeSet($scope.model.start_time, 'start_time');
        //}
    });
    $scope.choiceEBillType = function () {
        $scope.model.bill_type_id = 101;
        $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        $scope.model.bill_deadline_date = new Date($scope.model.bill_deadline_time);
    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.model.bill_type_id = 102;
        $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        $scope.model.bill_deadline_date = new Date($scope.model.bill_deadline_time);
    };

    $scope.choiceYTradeType = function () {
        $scope.model.trade_type_code = 701;
    };
    $scope.choiceNTradeType = function () {
        $scope.model.trade_type_code = 702;
    };
    //获取全部省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取各省市下面的市区
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        } else if ($scope.model.product_province_id == 1 || $scope.model.product_province_id == 20 || $scope.model.product_province_id == 860 || $scope.model.product_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.product_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    $scope.takePhoto = function (index) {

        switch (index) {
            case 0:

                $scope.$takePhoto(function (data) {
                    $scope.model.bill_front_photo_path = data;
                    $scope.$uploadPhoto($scope.model.bill_front_photo_path, function (data) {
                        data = JSON.parse(data);
                        $scope.model.bill_front_photo_id = data.data.id;
                        $scope.model.bill_front_photo_path = data.data.file_path;
                    });
                });
                break;
            case 1:
                $scope.$takePhoto(function (data) {
                    $scope.model.bill_back_photo_path = data;
                    $scope.$uploadPhoto($scope.model.bill_back_photo_path, function (data) {
                        data = JSON.parse(data);
                        $scope.model.bill_back_photo_id = data.data.id;
                        $scope.model.bill_back_photo_path = data.data.file_path;
                    });
                });
                break;
        }
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
        $scope.model.bill_front_photo_path = '';
    }
    //汇票背面图片移除功能
    $scope.removeBack = function () {
        $scope.model.bill_back_photo_id = null;
        $scope.model.bill_back_photo_path = '';
    }
    //上传图片后，点击图片跳转页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    //上传图片后，点击图片跳转页面，放大图片
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }

    $scope.enclosure = [];
    $scope.model.bill_back_files = [];

    //  confirm 对话框
    $scope.showConfirm = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '注意',
            template: '确定要发布汇票吗?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                if (!$scope.model.id) {

                    //发布汇票信息
                    billService.insertBillProduct($scope.model).then(function (data) {
                        $ionicPopup.alert({
                            title: '注意',
                            template: '发布成功，请等待后台审核（30分钟内完成）。',
                            okType: 'button-assertive',
                        });
                        //\n发布后请在48小时之内确认交易，平台系统默认将在48小时之后关闭竞价，关闭之后可在“交易关闭”选项中查询或重新发布。
                        $state.go("app.myReleaseElecAll");
                    });
                } else {
                    //修改汇票信息
                    if ($scope.model.id && $stateParams.bidId && $scope.model.trade_type_code == 702) {
                        $scope.model.bill_product_id = $scope.model.id;
                        $scope.model.bill_product_bidding_id = parseInt($stateParams.bidId);
                        billService.newOrderBidding($scope.model).then(function (data) {
                            $ionicPopup.alert({
                                title: '注意',
                                template: '发布成功，请等待后台审核（30分钟内完成）。',
                                okType: 'button-assertive',
                            });
                            $state.go("app.myReleaseElecAll");
                        });
                    } else {
                        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
                            $ionicPopup.alert({
                                title: '注意',
                                template: '发布成功，请等待后台审核（30分钟内完成）。',
                                okType: 'button-assertive',
                            });
                            $state.go("app.myReleaseElecAll");
                        });
                    }
                }
            } else {
                return
            }
        });
    };

    $scope.save = function () {
        //校验，提示信息
        if (!$scope.model.bill_type_id) {
            $ionicPopup.alert({
                title: '警告',
                template: '请选择票据类型',
                okType: 'button-assertive',
            });
            return;
        }


        if (!$scope.model.trade_type_code) {

            $ionicPopup.alert({
                title: '警告',
                template: '请选择交易方式！',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.bill_sum_price) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入票面金额！',
                okType: 'button-assertive',
            });
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '请上传汇票正面！',
                    okType: 'button-assertive',
                });
                return
            }

        }
        $scope.model.bill_flaw_ids = [];
        $scope.model.bill_type_id = parseInt($scope.model.bill_type_id);
        $scope.model.trade_type_code = parseInt($scope.model.trade_type_code);

        $scope.showConfirm();

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
    //获取全部省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取各省市下面的市区
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        } else if ($scope.model.product_province_id == 1 || $scope.model.product_province_id == 20 || $scope.model.product_province_id == 860 || $scope.model.product_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.product_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
        //else {
        //    return addressService.queryCity($scope.model.product_province_id).then(function (data) {
        //        $scope.cityData = data;
        //    });
        //}
    }
})
ionicApp.controller('evaluateCityController', function ($scope, $rootScope, $state) {
    $scope.model = {};
    $scope.model.star1 = 0;

    $scope.chioceStar11 = function () {
        $scope.model.star1 = 1;
    };

    $scope.chioceStar12 = function () {
        $scope.model.star1 = 2;
    };

    $scope.chioceStar13 = function () {
        $scope.model.star1 = 3;
    };

    $scope.chioceStar14 = function () {
        $scope.model.star1 = 4;
    };

    $scope.chioceStar15 = function () {
        $scope.model.star1 = 5;
    };

    $scope.model.star2 = 0;

    $scope.chioceStar21 = function () {
        $scope.model.star2 = 1;
    };

    $scope.chioceStar22 = function () {
        $scope.model.star2 = 2;
    };

    $scope.chioceStar23 = function () {
        $scope.model.star2 = 3;
    };

    $scope.chioceStar24 = function () {
        $scope.model.star2 = 4;
    };

    $scope.chioceStar25 = function () {
        $scope.model.star2 = 5;
    };
})
ionicApp.controller('followController', function ($scope, $rootScope, $state, $ionicPopup, customerService, toolService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.tab = 1;
    $scope.setTab = function (index) {
        $scope.tab = index;
        $scope.doRefresh();
    }
    $scope.filter = {};
    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create();
        $scope.listData = [];
        $scope.billListData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        if ($scope.tab == 1) {
            customerService.getAllFollowEnterprises($scope.params).then(function (data) {
                $scope.hasMore = data.length == 10;
                $scope.listData = first ? data : $scope.listData.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        else {
            customerService.getAllFollowBills($scope.params).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    //alert(data[i].drawer_id)
                    toolService.getStars(data[i].drawer_id).then(function (data2) {
                        data[i].star = data2;
                    })
                }
                $scope.hasMore = data.length == 10;
                $scope.billListData = first ? data : $scope.billListData.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }
        $scope.params.next();
    };
    $scope.followBill = function (collection_bill_id, follow) {
        $scope.followBillModel = {
            collection_bill_id: collection_bill_id,
            is_collection_bill: follow
        };
        customerService.followBill($scope.followBillModel)
        $scope.doRefresh();
    }
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})
ionicApp.controller('forgetPasswordController', function ($rootScope, $scope, $state, $interval, $ionicPopup, customerService) {
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
ionicApp.controller('homeController', function ($scope, $rootScope, $state, $filter, billService, toolService, $ionicHistory) {
    $ionicHistory.clearHistory();

    //票源信息和报价信息的条件搜索model初始化
    $rootScope.billSearchModel = null;
    $rootScope.billOfferSearchModel = null;

    $scope.bills = [];
    $scope.products = [];
    billService.getHomeBillOffer('home', 202, 1).then(function (data) {
        $scope.bills[0] = data[0]
        $scope.bills[0].offer_detail = JSON.parse($scope.bills[0].offer_detail)
        toolService.getStars($scope.bills[0].enterprise_id).then(function (data) {
            $scope.bills[0].star = data;
        });
    });
    billService.getHomeBillOffer('home', 203, 1).then(function (data) {
        $scope.bills[1] = data[0]
        $scope.bills[1].offer_detail = JSON.parse($scope.bills[1].offer_detail)
        toolService.getStars($scope.bills[1].enterprise_id).then(function (data) {
            $scope.bills[1].star = data
        });
    });
    billService.getHomeBillOffer('home', 204, 1).then(function (data) {
        $scope.bills[2] = data[0]
        $scope.bills[2].offer_detail = JSON.parse($scope.bills[2].offer_detail)
        toolService.getStars($scope.bills[2].enterprise_id).then(function (data) {
            $scope.bills[2].star = data
        });
    });
    billService.getHomeBillOffer('home', 205, 1).then(function (data) {
        $scope.bills[3] = data[0]
        $scope.bills[3].offer_detail = JSON.parse($scope.bills[3].offer_detail)
        toolService.getStars($scope.bills[3].enterprise_id).then(function (data) {
            $scope.bills[3].star = data
        });
    });

    billService.getHomeBillProduct('home', 101).then(function (data) {

        if (data.length == 0) {

        } else if (data.length == 1) {
            $scope.products[0] = data[0];
            $scope.products[0].bill_deadline_time = $filter('date')($scope.products[0].bill_deadline_time, 'yyyy-MM-dd');
            toolService.getStars($scope.products[0].publisher_id).then(function (data) {
                $scope.products[0].star = data
            });
        } else {
            $scope.products[0] = data[0];
            $scope.products[1] = data[1];
            $scope.products[0].bill_deadline_time = $filter('date')($scope.products[0].bill_deadline_time, 'yyyy-MM-dd');
            $scope.products[1].bill_deadline_time = $filter('date')($scope.products[1].bill_deadline_time, 'yyyy-MM-dd');

            toolService.getStars($scope.products[0].publisher_id).then(function (data) {
                $scope.products[0].star = data
            });

            toolService.getStars($scope.products[1].publisher_id).then(function (data) {
                $scope.products[1].star = data
            });
        }
        
       
    });

    billService.getHomeBillProduct('home', 102).then(function (data) {
        if (data.length == 0) {

        } else if (data.length == 1) {
            $scope.products[2] = data[0];
            $scope.products[2].bill_deadline_time = $filter('date')($scope.products[2].bill_deadline_time, 'yyyy-MM-dd');
            toolService.getStars($scope.products[2].publisher_id).then(function (data) {
                $scope.products[2].star = data
            });
        } else {
            $scope.products[2] = data[0];
            $scope.products[3] = data[1];
            $scope.products[2].bill_deadline_time = $filter('date')($scope.products[2].bill_deadline_time, 'yyyy-MM-dd');
            $scope.products[3].bill_deadline_time = $filter('date')($scope.products[3].bill_deadline_time, 'yyyy-MM-dd');
            toolService.getStars($scope.products[2].publisher_id).then(function (data) {
                $scope.products[2].star = data
            });

            toolService.getStars($scope.products[3].publisher_id).then(function (data) {
                $scope.products[3].star = data
            });
        }
       

    });

    //获取点击billOfferId
    $scope.changeBillOfferId = function (billOfferId) {
        $rootScope.billOfferbillOfferId = billOfferId;
    };
    $scope.calculator = function () {
        $state.go('app.calculator');
    };

    $scope.calendar = function () {
        $state.go('app.calendar');
    };

    $scope.querybank = function () {
        $state.go('app.querybank');
    };

    $scope.queryenterprise = function () {
        $state.go('app.queryenterprise');
    };
})
ionicApp.controller('imgBigController', function ($scope, $rootScope, $state, $stateParams, $ionicHistory) {

    $scope.img_path = $stateParams.imgPath;
    $scope.rotate90 = false;
    $scope.back = function () {
        $ionicHistory.goBack();
    }
})
ionicApp.controller('jobQueryController', function ($rootScope, $scope, $state, $ionicPopup, toolService) {
    $scope.model = {
        billNumber: null,
    };

    //更改输入框检验
    /*
    $scope.updateBillNumber = function () {
        if (!$scope.model.billNumber) {
            $scope.model.billNumberValidate = null;
            return;
        }
        if (!/^[0-9]{16}$/.test($scope.model.billNumber) && !/^[0-9]{8}$/.test($scope.model.billNumber)) {
            $scope.model.billNumberValidate = false;
        } else {
            $scope.model.billNumberValidate = true;
        }
    }*/

    //查询
    $scope.query = function () {
        if (!$scope.model.billNumber) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入汇票票号！',
                okType: 'button-assertive',
            });
            return;
        }
        if (!/^[0-9]{16}$/.test($scope.model.billNumber) && !/^[0-9]{8}$/.test($scope.model.billNumber)) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入16位或后8位汇票票号！',
                okType: 'button-assertive',
            });
            return;
        }
        toolService.serviceByPublication($scope.model).then(function (data) {
            if (data.page_info.items_number)
                $scope.queryResult = data['service_by_publications'][0];
            else {
                $scope.queryResult = null;
                $ionicPopup.alert({
                    title: '警告',
                    template: '该票号目前暂无挂失信息！',
                    okType: 'button-assertive',
                });
            }
        });
    }
    //清理
    $scope.clear = function () {
        $scope.model.billNumber = null;
        $scope.queryResult = null;
        //$scope.updateBillNumber();
    }
});

ionicApp.controller('messageController', function ($scope, $rootScope,$ionicPopup, $state, $filter, notisService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.filter = {
        type: '1,2,3,4,5,6',
        time1: '',
        time2: '',
        isRead: '',
    };
    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create('-send_time', 10);
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        notisService.getNotification($scope.params, $scope.filter.type, $scope.filter.time1, $scope.filter.time2, $scope.filter.isread).then(function (data) {
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        $scope.params.next();
    };
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})
ionicApp.controller('messageDetailController', function ($scope, $rootScope, $ionicPopup, $state, $filter, $stateParams, notisService) {
    $scope.filter = {};
    $scope.model = {};
    $scope.notificationId = $stateParams.notificationId;
    notisService.seeNotification($scope.notificationId).then(function (data) {
        $scope.model = data;
    });


    $scope.deleteNotification = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '注意',
            template: '确定要删除该通知吗?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                notisService.deleteNotification($scope.notificationId).then(function () {
                    $state.go('app.message');
                })
            }
        });
    }
})
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
ionicApp.controller('modifyPhoneController', function ($scope, $rootScope, $state, $interval, $ionicPopup, customerService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }

    /*
        <input type="text" ng-model="changePhoneModel.old_phone_verify_code" placeholder="请输入验证码" class="i4">
        <input type="text" ng-model="changePhoneModel.new_phone_verify_code" placeholder="请输入验证码" class="i4">
    */
    $scope.changePhoneModel = {
        oldPhoneVerifyStr: '获取验证码',
        newPhoneVerifyStr: '获取验证码',
        /*oldPhoneVerifyStrSecond: 60,
        newPhoneVerifyStrSecond: 60,*/
    }
    customerService.getCustomer().then(function (data) {
        $scope.changePhoneModel.old_phone_number = data.phone_number;
    });
    
    $scope.disableVerify1 = false;
    $scope.disableVerify2 = false;
    
    $scope.filter = {
        choicePhone: 0,
    }
    $scope.PhoneChange = function () {
        if ($scope.changePhoneModel.new_phone_number && (/^1(3|4|5|7|8)\d{9}$/.test($scope.changePhoneModel.new_phone_number))) {
             
            //$scope.model.phone_number.length == 11 &&
            customerService.testPhoneNumber($scope.changePhoneModel.new_phone_number).then(function (data) {
                if (!data) {
                    $scope.filter.choicePhone = 1;
                }
                else {
                    $scope.filter.choicePhone = 2;
                }
            });
        }
        else if ($scope.changePhoneModel.new_phone_number && $scope.changePhoneModel.new_phone_number.length == 11) {
            $scope.filter.choicePhone = 3;
        }
    }
    $scope.getOldPhoneVerify = function () {
        customerService.phoneVerify($scope.changePhoneModel.old_phone_number).then(function () {
            $ionicPopup.alert({
                title: '通知',
                template: '验证码已发送!',
                okType: 'button-assertive',
            });
            $scope.changePhoneModel.oldPhoneVerifyStrSecond = 60;
            $scope.disableVerify1 = true;

            $interval(function () {
                $scope.changePhoneModel.oldPhoneVerifyStr = $scope.changePhoneModel.oldPhoneVerifyStrSecond + "秒后可重新获取";
                $scope.changePhoneModel.oldPhoneVerifyStrSecond--;

                if ($scope.changePhoneModel.oldPhoneVerifyStrSecond == 0) {
                    $scope.changePhoneModel.oldPhoneVerifyStr = "重新获取验证码";
                    $scope.disableVerify1 = false;
                }
            }, 1000, 60);
        })

    };
    $scope.getNewPhoneVerify = function () {
        if (!$scope.changePhoneModel.new_phone_number || $scope.changePhoneModel.new_phone_number.length != 11) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入正确的手机号码!',
                okType: 'button-assertive',
            });
            return;
        }
        //alert("test");
        customerService.phoneVerify($scope.changePhoneModel.new_phone_number).then(function () {
            $ionicPopup.alert({
                title: '通知',
                template: '验证码已发送!',
                okType: 'button-assertive',
            });
            $scope.changePhoneModel.newPhoneVerifyStrSecond = 60;
            $scope.disableVerify2 = true;

            $interval(function () {
                $scope.changePhoneModel.newPhoneVerifyStr = $scope.changePhoneModel.newPhoneVerifyStrSecond + "秒后可重新获取";
                $scope.changePhoneModel.newPhoneVerifyStrSecond--;

                if ($scope.changePhoneModel.newPhoneVerifyStrSecond == 0) {
                    $scope.changePhoneModel.newPhoneVerifyStr = "重新获取验证码";
                    $scope.disableVerify2 = false;
                }
            }, 1000, 60);
        })
    };
    $scope.submit = function () {
        customerService.customerPhone($scope.changePhoneModel).then(function (meta) {
            $ionicPopup.alert({
                title: '通知',
                template: '成功更换手机号，请重新登录!',
                okType: 'button-assertive',
            });
            $state.go('app.signin');
        });
    }
})
ionicApp.controller('myBiddingController', function ($scope, $rootScope, $state, $filter,$ionicPopup, billService, addressService, customerService, constantsService, bankService, fileService, orderService) {
    if($rootScope.identity == null){
        $ionicPopup.alert({
                    title: '警告',
                    template: '账户未登录！',
                    okType: 'button-assertive',
                });
        $state.go("app.signin");
        return
    }
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        status: null,
        iselectronic: 0,
    };
    $scope.billsNumber = function () {
        billService.getBillsNumber($scope.filter.choiceBillType).then(function (data) {
            $scope.numberModel = data;
        })
    }
    $scope.billsNumber();

    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create('-publishing_time', 10);
        $scope.listData = [];
        $scope.loadMore();
    };

    //获取我发布的票据信息
    $scope.loadMore = function (first) {
        if ($scope.filter.status >= 804 && $scope.filter.choiceBillType == 101) {
            return orderService.getOwnBiddingOrder($scope.params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                 if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].bill.status_code == 801 && data[i].bid_result == 0) {
                            data[i].bill.status_name = "已报价";
                        } else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                            data[i].bill.status_name = "竞价失效";
                        } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                            data[i].bill.status_name = "竞价失败";
                        }
                    }
                };
                if (($scope.filter.choiceBillType == 101 && ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881)) || $scope.filter.choiceBillType == 102) {
                    for (var j = 0; j < data.length; j++) {
                        if (!data[j].bill.bill_deadline_time)
                            data[j].bill.remaining_day = null;
                    };
                }
                $scope.hasMore = data.length == 10;
                $scope.listData = first ? data : $scope.listData.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete')
                $scope.params.next();
            });
        } else {
            return billService.getOwnBillBidding($scope.params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                if ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].bill.status_code == 801 && data[i].bid_result == 0) {
                            data[i].bill.status_name = "已报价";
                        } else if (data[i].bill.status_code == 801 && data[i].bid_result == 2) {
                            data[i].bill.status_name = "竞价失效";
                        } else if (data[i].bill.status_code > 801 && data[i].bid_result == 2) {
                            data[i].bill.status_name = "竞价失败";
                        }
                    }
                };
                if (($scope.filter.choiceBillType == 101 && ($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881)) || $scope.filter.choiceBillType == 102) {
                    for (var j = 0; j < data.length; j++) {
                        if (!data[j].bill.bill_deadline_time)
                            data[j].bill.remaining_day = null;
                    };
                }
                $scope.hasMore = data.length == 10;
                $scope.listData = first ? data : $scope.listData.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete')
                $scope.params.next();
            });
            
        }
        
    };

    $scope.$on('$stateChangeSuccess', $scope.doRefresh);

    //选择电票
    $scope.choiceEBillType = function () {
        $scope.filter.choiceBillType = 101;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.choiceBillType = 102;
        $scope.filter.status = null;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.iselectronic = 0;
        $scope.filter.choiceStatus = 880;
        $scope.filter.status = null;
        $scope.doRefresh();
    }
    //竞价
    $scope.choiceTradeStatusBidding = function () {
        $scope.filter.iselectronic = 0;
        $scope.filter.choiceStatus = 881;
        $scope.filter.status = 801;
        $scope.doRefresh();
    }
    //交易中
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.iselectronic = 1;
        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 804;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = 809;
        }
        $scope.filter.choiceStatus = 882;
        $scope.doRefresh();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.iselectronic = 0;
        $scope.filter.status = 810;
        $scope.filter.choiceStatus = 883;
        $scope.doRefresh();
    }
    //交易失败
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.iselectronic = 1;
        $scope.filter.status = 816;
        $scope.filter.choiceStatus = 884;
        $scope.doRefresh();
    }

    $scope.delete = function (data) {
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '是否确定删除？'
        });
        confirmPopup.then(function (res) {
            if (res) {
                billService.deleteBillBidding(data.id).then(function (result) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: ' 成功删除。'
                    });
                    $scope.choiceTradeStatusBidding();
                    $scope.billsNumber();
                })
            }
        });
       
    }
})
ionicApp.controller('myReleaseDetailController', function ($scope, $rootScope, $state, API_URL, $stateParams, $filter, billService, toolService, enterprisesService, orderService, constantsService, $ionicModal, $ionicPopup, customerService, $interval) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.filter = {
        check: 0
    };
    
    $scope.billId = $stateParams.myReleaseBillId;
    $scope.orderId = $stateParams.myReleaseOrderId;
    $scope.filter.check = $stateParams.check;
    $scope.filter.rule = false;
    $scope.billModel = {};
    $scope.biddings = {};
    $scope.model = {};
    $scope.open = true;
    $scope.open2 = true;
    $scope.endorsements = [];
    $scope.evaluateModel = {
        type_id: null,
        to_id: null,
        star: 0,
        bill_status_code: null,
        order_status_id: null,
        description: null,
        additional_description: null,
    };

    //$scope.test = $rootScope.identity;
    //console.log($scope.billId);
    $scope.changeOpen = function () {
        $scope.open = !$scope.open;
    }
    $scope.changeOpen2 = function () {
        $scope.open2 = !$scope.open2;
    }
    //获取票据详情
    init = function () {
        billService.getBillDetail($scope.billId).then(function (data) {
            $scope.billModel = data;
            $scope.biddingModel = {
                bill_product_id: $scope.billModel.id,
                bid_enterprise_name: $rootScope.identity.enterprise_name,
                bid_deal_price: 0,
            };
            //网络异步问题处理
            if ($scope.billId && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.billModel.publisher_id == $rootScope.identity.enterprise_id)) {
                billService.getBillProductBidding($scope.billId).then(function (data) {
                    $scope.biddings = data;
                });
            }



        });
        //获取出票订单详情
        if ($scope.orderId) {
            orderService.getOrder($scope.orderId). then(function (data){
                $scope.orderModel = data;
            });
        }
    };
    init();

     
    

    //计时程序
    //waitTime = function () {
    //    var newdate = new Date().getTime();
    //    if ($scope.orderModel.order_status_id == 804) {
    //        var waitdate = newdate - $scope.orderModel.order_time;
    //    } else {
    //        var waitdate = newdate - $scope.orderModel.order_update_time;
    //    }
    //    if (waitdate > 1000) {
    //        var waitTime = new Date(waitdate);
    //        $scope.filter.waitTimeD = waitTime.getDate();
    //        if ($scope.filter.waitTimeD > 2) {
    //            $scope.filter.waitTimeH = waitTime.getHours() - 8 + ($scope.filter.waitTimeD - 1) * 24;
    //        } else if ($scope.filter.waitTimeD > 1) {
    //            $scope.filter.waitTimeH = waitTime.getHours() - 8 + 24;
    //        } else {
    //            $scope.filter.waitTimeH = waitTime.getHours() - 8;
    //        }
    //        $scope.filter.waitdateM = waitTime.getMinutes();
    //        $scope.filter.waitdateS = waitTime.getSeconds();
    //    } else {
    //        $scope.filter.waitTimeH = 0;
    //        $scope.filter.waitdateM = 0;
    //        $scope.filter.waitdateS = 0;
    //    }
    //}

    //弹框
    $ionicModal.fromTemplateUrl('endorsePopup.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.endorseModal = modal;
    });

    //图片放大弹框
    $ionicModal.fromTemplateUrl('imgMagnify.html', {
        scope: $scope,
        //animation: 'slide-in-up'
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

    $scope.openEndorseModal = function () {
        $scope.endorseModal.show();
    };

    $scope.closeEndorseModal = function () {
        $scope.endorseModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.endorseModal.remove();
    });

    //验证码获取模块
    $scope.verifyStr = "获取验证码";

    //弹出支付窗口
    $ionicModal.fromTemplateUrl('payPopup.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.payModal = modal;
    });

    $scope.openPayModal = function () {
        $scope.payModal.show();
    };

    $scope.closePayModal = function () {
        $scope.payModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.payModal.remove();
    });

    //选择成交页面
    $ionicModal.fromTemplateUrl('choicePayAccount.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.accountModal = modal;
    });

    $scope.openAccountModal = function (item) {
        $scope.accountModal.show();
        $scope.showFinishBidding(item);
    };

    $scope.closeAccountModal = function () {
        $scope.accountModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.accountModal.remove();
    });

    //评价界面
    $ionicModal.fromTemplateUrl('evaluate.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.evaluateModal = modal;
    });
    $scope.openEvaluateModal = function (item) {
        $scope.evaluateModal.show();
        if ($scope.billModel.bill_type_id == 101) {
            $scope.evaluateModel.bill_status_code = $scope.orderModel.bill_status_code;
            $scope.evaluateModel.order_status_id = $scope.orderModel.order_status_id;
            $scope.evaluateModel.type_id = $scope.orderModel.bill_type_id;
            $scope.evaluateModel.to_id = $scope.orderModel.id;
            if ($scope.orderModel.bill_status_code > 810) {
                enterprisesService.getorderAppraisal($scope.evaluateModel.type_id, $scope.evaluateModel.to_id).then(function (data) {
                        //swal("hello");
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                        //$scope.addevaluateModel = data;
                        //console.log(data.drawer_appraisal);
                    });
                }
        } else if ($scope.billModel.bill_type_id == 102) {
            $scope.evaluateModel.bill_status_code = $scope.billModel.bill_status_code;
            $scope.evaluateModel.type_id = $scope.billModel.bill_type_id;
            $scope.evaluateModel.to_id = $scope.billModel.id;
            if ($scope.evaluateModel.bill_status_code > 810) {
                enterprisesService.getorderAppraisal($scope.evaluateModel.type_id, $scope.evaluateModel.to_id).then(function (data) {
                        //swal("hello");
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                        //$scope.addevaluateModel = data;
                    });
                }
            
        };
    };

    $scope.closeEvaluateModal = function () {
        $scope.evaluateModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.evaluateModal.remove();
    });



    //弹出竞价窗口
    $ionicModal.fromTemplateUrl('bidPopup.html', {
        scope: $scope,
        //animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.bidModal = modal;
    });

    $scope.openBidModal = function () {
        $scope.bidModal.show();
        $scope.biddingModel = {
            bill_product_id: $scope.billModel.id,
            bid_enterprise_name: $rootScope.identity.enterprise_name,
        };
    };

    $scope.closeBidModal = function () {
        $scope.bidModal.hide();
    };

    $scope.$on('$destroy', function () {
        $scope.bidModal.remove();
    });
   

    ////弹出竞价窗口
    //$scope.showAddBidding = function (item) {
        
    //    //$('#modal-addBidding').modal('show');
    //};
    
    //确认成交
    $scope.submitbillnew = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '是否线下已完成交易?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                billService.finishBillNew($scope.billModel.id).then(function (data) {
                    $ionicPopup.alert({
                        title: '提示',
                        template: ' 已成功确认成交！'
                    });
                    $state.go("app.myReleaseElecAll")
                });
            }
        });
    }

    //贴息计算
    $scope.ratechange = function () {
        $scope.rateModel = {};
        if ($scope.biddingModel.bid_rate > 0 || $scope.biddingModel.bill_rate > 0) {
            var newDate = new Date();

            $scope.rateModel.start_time = $filter('date')(newDate, 'yyyy-MM-dd');
            $scope.rateModel.end_time = $filter('date')($scope.billModel.bill_deadline_time, 'yyyy-MM-dd');

            $scope.rateModel.denomination = $scope.billModel.bill_sum_price / 10000;
            $scope.rateModel.commission = 0;

            if ($scope.billModel.trade_type_code == 701) {
                if ($scope.billModel.bill_type_id == 102) {
                    $scope.rateModel.interest_month = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 3;
                } else if ($scope.billModel.bill_type_id == 101) {
                    $scope.rateModel.interest_year = $scope.biddingModel.bid_rate;
                    $scope.rateModel.adjust_day = 0;
                }
                $scope.rateModel.every_plus = 0;

                toolService.calculator($scope.rateModel).then(function (data) {
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                });
            } else if ($scope.billModel.trade_type_code == 702) {
                $scope.rateModel.every_plus = $scope.biddingModel.bill_rate;

                toolService.calculator($scope.rateModel, 'ten').then(function (data) {
                    $scope.biddingModel.bid_rate_price = data.discount_interest;
                    $scope.biddingModel.bid_deal_price = data.discount_amount;
                });
            }

        }
    };

    //新增报价信息
    $scope.addBidding = function () {
        if ($scope.billModel.trade_type_code == 702) {
            $scope.biddingModel.bid_rate = $scope.biddingModel.bill_rate;
        }
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            billService.getBillProductBidding($scope.billModel.id).then(function (data) {
                $scope.biddings = data;

            });
            setTimeout(function () {
                if ($scope.billModel.bill_type_id == 101) {
                    $ionicPopup.alert({
                        title: '提示',
                        template:' 报价成功！\n请等待出票方确认报价。'
                    });
                    $state.go("app.myBidding");
                } else if ($scope.billModel.bill_type_id == 102) {
                    $ionicPopup.alert({
                        title: '提示',
                        template:' 报价成功！ \n温馨提醒：报价后请及时联系出票方。'
                    });
                    $state.go("app.myBidding");
                }
            }, 350);
        });
    };

    //弹出选择成交窗口
    $scope.showFinishBidding = function (item) {
        $scope.accountModel = {
            account_person: $scope.billModel.drawer_name,
        }

        $scope.billModel.drawer_account_id = null;

        customerService.getAllEnterpriseAccount(501).then(function (data) {
            $scope.accounts = data;
        })

        $scope.payModel = {};
        $scope.payModel.payId = item.id;
        $scope.payModel.bid_enterprise_name = item.bid_enterprise_name;
        $scope.payModel.bid_deal_price = item.bid_deal_price;
        $scope.payModel.bill_rate = item.bid_rate;
        $scope.payModel.receiver_name = item.receiver_name;
        $scope.payModel.receiver_avg_star = item.receiver_avg_star;
        $scope.payModel.receiver_contact_name = item.receiver_contact_name;
        $scope.payModel.receiver_contact_phone = item.receiver_contact_phone;

       
    }

    $scope.finishBidding = function () {
        if ($scope.filter.rule == false) {
            return;
        }
        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '确认选择该收票人进行交易吗?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                if ($scope.billModel.trade_type_code == 701 || ($scope.billModel.trade_type_code == 702 && $scope.billModel.bill_type_id == 102)) {
                    billService.newOrderBidding({ 'bill_product_id': $scope.billModel.id, 'bill_product_bidding_id': $scope.payModel.payId }).then(function (data) {
                        if ($scope.billModel.bill_type_id == 101) {
                            billService.getBillProduct($scope.billModel.id).then(function (data) {
                                $scope.filter.order_id = data.order_id;
                                orderService.updateOrderAccountDrawer($scope.filter.order_id, $scope.billModel.drawer_account_id).then(function () { });
                                $scope.billModel = data;

                                billService.getBillProductBidding($stateParams.myReleaseBillId).then(function (data) {
                                    $scope.biddings = data;
                                });
                            });
                            setTimeout(function () {
                                $ionicPopup.alert({
                                    title: '提示',
                                    template: '确认交易方成功！'
                                });
                                $state.go("app.myReleaseElecAll");
                                //});
                            }, 350);
                        } else {
                            $state.go("app.myReleaseElecAll");
                        }
                    });
                }
                if ($scope.billModel.trade_type_code == 702 && $scope.billModel.bill_type_id == 101) {
                    setTimeout(function () {
                        $ionicPopup.alert({
                            title: '提示',
                            template: '确认交易方成功！\n请先完善信息并提交审核，审核通过后直接进入交易状态！'
                        });
                        $state.go('app.drawBill', { id: $scope.billModel.id, bidId: $scope.payModel.payId, accountId: $scope.billModel.drawer_account_id });
                    }, 350);
                }
            }
        });
    }

    $scope.accountChangeBill = function () {
        //i = $scope.model.drawer_account_id.indexOf('_',0)+1;
        //s=$scope.model.drawer_account_id.substr(i, 100);
        customerService.getEnterpriseAccount($scope.billModel.drawer_account_id).then(function (data) {
            $scope.accountModel = data;
            $scope.filter.isaccount = 1;
        })
    }

    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })
    $scope.accountChange = function () {
        customerService.getEnterpriseAccount($scope.orderModel.receiver_account_id).then(function (data) {
            $scope.accountModel = data;
        })
    };
    //获取背书账号
    customerService.getAllEnterpriseAccount(502).then(function (data) {
        $scope.accounts = data;
        $scope.addressModel = {};
        $scope.addressModel.receiver_account_id = data[0].id;
    })

    $scope.pay = function () {
        if (!$scope.model.verify_code || $scope.model.verify_code.length != 6) {
            $ionicPopup.alert({
                title: '提示',
                template: '请输入正确的短信验证码！'
            });
        } else if (!$scope.orderModel.receiver_account_id) {
            $ionicPopup.alert({
                title: '提示',
                template: '请选择背书账号！'
            });
        } else {
            var confirmPopup = $ionicPopup.confirm({
                title: '提示',
                template: '确定要支付票据款?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    var newWin = window.open('loading page');
                    orderService.updateOrderAccountReceiver($scope.orderModel.id, $scope.orderModel.receiver_account_id).then(function (data) {
                        orderService.updateOrderReceiver($scope.orderModel.id, $scope.orderModel).then(function () {
                            newWin.location.href = API_URL + '/orders/orderPay/' + $scope.orderModel.id.toString() + '?orderPayTypeId=' + '18768107194' + '&phone=' + '18768107194'+ '&verifyCode=' + $scope.model.verify_code.toString() + '&token=' + $rootScope.identity.token;
                            //window.open(API_URL + '/orders/orderPay/' + $scope.model.id.toString());$rootScope.identity.phone_number.toString()$rootScope.identity.phone_number.toString() 
                           $state.go("app.myBidding")
                        });
                    });
                
                }
            });
        }
    };

 
    //删除背书图片
    $scope.remove = function (index) {
        var confirmPopup = $ionicPopup.confirm({
            title: '警告',
            template: '确定要删除该文件吗?',
        });
        confirmPopup.then(function (res) {
            if(res){
                $scope.endorsements.splice(index, 1);
            };
        });
    };

    //上传出票方背书
    $scope.endorsement = function () {
        if (!$scope.model.verify_code || $scope.model.verify_code.length != 6) {
            //swal("请输入正确的短信验证码！");
            $ionicPopup.alert({
                title: '警告',
                template: '请输入正确的短信验证码！',
                okType: 'button-assertive',
            });
            return;
        }

        var confirmPopup = $ionicPopup.confirm({
            title: '提示',
            template: '是否确认已背书?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                var model = {
                    endorsement_id_list: [],
                    endorsement_messages: [],
                    verify_code: $scope.model.verify_code
                };
                for (var i = 0; i < $scope.endorsements.length; i++) {
                    model.endorsement_id_list.push($scope.endorsements[i].endorsement_id);
                    model.endorsement_messages.push($scope.endorsements[i].endorsement_address);
                }
                orderService.orderEndorsement($scope.orderModel.id, model).then(function () {
                    //swal('出票方背书成功！');
                    $ionicPopup.alert({
                        title: '提示',
                        template: '出票方背书成功！',
                        okType: 'button-assertive',
                    });
                });
                //$scope.modal.hide();
                //window.location.reload();
                $state.go("app.myReleaseElecAll");
                //此处还要跳转
            }
        });
    };
    //增加背书
    $scope.model.endorsement_file = [];
    $scope.add = function (response) {
        //$timeout(function () {

            $scope.endorsements.push({
                endorsement_id: $scope.model.bill_front_photo_id,
                endorsement_address: $scope.model.bill_front_photo_path,
                //'endorsement_file_name': response.data.data.file_name
            });
            /*
            $scope.model.endorsement_file = $scope.endorsements;
            $timeout(function () {
                $('.jqzoom').imagezoom();
            });
            if ($scope.model.endorsement_file.length > 2) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '背书文件最多上传两张！',
                    okType: 'button-assertive',
                });
                return;
            }
            */
        //});
    }

    $scope.takePhoto = function (index) {
         $scope.$takePhoto(function (data) {
            $scope.model.bill_front_photo_path = data;
            $scope.$uploadPhoto($scope.model.bill_front_photo_path, function (data) {
                data = JSON.parse(data);
                $scope.model.bill_front_photo_id = data.data.id;
                $scope.model.bill_front_photo_path = data.data.file_path;
                $scope.add();
            });
         });
    };

    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    var second = 60;
    //发送验证码
    $scope.getVerify = function () {
        $scope.filter.phone_number = $rootScope.identity.phone_number;
        customerService.phoneVerify($scope.filter.phone_number).then(function () {
            $ionicPopup.alert({
                title: '提示',
                template: '验证码已发送！',
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
   
    //确认签收
    $scope.showendorsements = function () {
        /*
        $('#modal-endorsements').modal('show');
        $timeout(function () {
            $('.jqzoom').imagezoom();
        });
        */
    }
    //签收背书
    $scope.validate = function () {
        //alert($rootScope.identity.token);
        var confirmPopup = $ionicPopup.confirm({
            title: '确认签收背书?',
            template: '如果未经核实进行操作，后果自负！！！'
        });
        confirmPopup.then(function (res) {
            if (res) {
                if ($scope.orderModel.order_pay_type == 1203) {
                    var newWin = window.open('loading page');
                    newWin.location.href = API_URL + '/orders/orderConfirm/' + $scope.orderModel.id.toString() + '?token=' + $rootScope.identity.token;
                    //init();
                    //window.location.reload();
                    //$('#modal-endorsements').modal('hide');
                    $ionicPopup.alert({
                        title: '提示',
                        template: '背书签收完成！',
                        okType: 'button-assertive',
                    });
                    $state.go("app.myReleaseElecAll");
                } else {
                    orderService.orderConfirm($scope.orderModel.id, $rootScope.identity.token).then(function () {
                        $ionicPopup.alert({
                            title: '提示',
                            template: '背书签收完成！',
                            okType: 'button-assertive',
                        });
                        $state.go("app.myBidding");
                        //init();
                        //window.location.reload();
                        //$('#modal-endorsements').modal('hide');
                    });
                }
            }
        });
    }
    $scope.chioceStar11 = function () {
        $scope.evaluateModel.star = 1;
    };

    $scope.chioceStar12 = function () {
        $scope.evaluateModel.star = 2;
    };

    $scope.chioceStar13 = function () {
        $scope.evaluateModel.star = 3;
    };

    $scope.chioceStar14 = function () {
        $scope.evaluateModel.star = 4;
    };

    $scope.chioceStar15 = function () {
        $scope.evaluateModel.star = 5;
    };

    $scope.showEvaluatesell = function () {
        enterprisesService.insertAppraisal($scope.evaluateModel).then(function (data) {
            if ($scope.filter.check == 1) {
                $state.go('app.myReleaseElecAll');
            } else if ($scope.filter.check == 2) {
                $state.go('app.myBidding');
            } else {
                $state.go('app.user');
            }
           
        });
    };
    //关注
    $scope.follow = function (follow) {
        $scope.followModel = {
            collection_bill_id: $scope.model.bill_id,
            is_collection_bill: follow
        }
        customerService.followBill($scope.followModel).then(function () {
            //$scope.model.is_collection_enterprise = follow;
        })
    }
})
ionicApp.controller('myReleaseElecAllController', function ($rootScope, $scope, $state, $filter, $ionicPopup,billService, addressService, customerService, constantsService, bankService, fileService, orderService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.filter = {
        choiceBillType: 101,
        choiceStatus: 880,
        choiceorder: 0,
        isTrade: 0,
        status: null,
        isAlive: null,
        billStatusCode: null,
    };
    $scope.billsNumber = function () {
        billService.getBillsNumber($scope.filter.choiceBillType).then(function (data) {
            $scope.numberModel = data;
         })
    }
    $scope.billsNumber();
   


    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create('-publishing_time',10);
        $scope.listData = [];
        $scope.loadMore();
    };

    $scope.loadMore = function (first) {
            if ($scope.filter.status >= 809 && $scope.filter.choiceBillType == 101) {
                return orderService.getOwnOrder($scope.params, $scope.filter.choiceBillType, $scope.filter.status).then(function (data) {
                   
                    if ((($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) && $scope.filter.choiceBillType == 101) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill_deadline_time)
                                data[j].remaining_day = null;
                        };
                    }
                    for (var j = 0; j < data.length; j++) {
                        data[j].publishing_time = $filter('date')(data[j].publishing_time, 'yyyy-MM-dd');
                        data[j].bill_deadline_time = $filter('date')(data[j].bill_deadline_time, 'yyyy-MM-dd');
                    };
                    $scope.hasMore = data.length == 10;
                    $scope.listData = first ? data : $scope.listData.concat(data);
                    $scope.$broadcast('scroll.infiniteScrollComplete')
                    $scope.params.next();
                });
                
            } else {
                return billService.getOwnBillProduct($scope.params, $scope.filter.choiceBillType, $scope.filter.isAlive, $scope.filter.billStatusCode).then(function (data) {
                  
                    if ((($scope.filter.choiceStatus == 880 || $scope.filter.choiceStatus == 881 || $scope.filter.choiceStatus == 882) && $scope.filter.choiceBillType == 101) || $scope.filter.choiceBillType == 102) {
                        for (var j = 0; j < data.length; j++) {
                            if (!data[j].bill_deadline_time)
                                data[j].remaining_day = null;
                        };
                    }
                    for (var j = 0; j < data.length; j++) {
                       data[j].publishing_time = $filter('date')(data[j].publishing_time, 'yyyy-MM-dd');
                       data[j].bill_deadline_time = $filter('date')(data[j].bill_deadline_time, 'yyyy-MM-dd');
                    };
                    $scope.hasMore = data.length == 10;
                    $scope.listData = first ? data : $scope.listData.concat(data);
                    $scope.$broadcast('scroll.infiniteScrollComplete')
                    $scope.params.next();
                });
                
            }
            
        
    };
   $scope.$on('$stateChangeSuccess', $scope.doRefresh);
   // $scope.doRefresh();
    //选择电票
    $scope.choiceEBillType = function () {
        $scope.filter.choiceBillType = 101;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();

    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.choiceBillType = 102;
        $scope.billsNumber();
        $scope.choiceTradeStatusAll();
    };
    //全部
    $scope.choiceTradeStatusAll = function () {
        $scope.filter.choiceStatus = 880;
        $scope.filter.isTrade = 0;
        $scope.filter.isAlive = null;
        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.doRefresh();
    }
    //平台审核
    $scope.choiceTradeStatusCheck = function () {
        $scope.filter.choiceStatus = 881;
        $scope.filter.isAlive = 0;
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.doRefresh();
    }
    //发布中
    $scope.choiceTradeStatusPublish = function () {
        $scope.filter.choiceStatus = 882;
        $scope.filter.isAlive = 1;
        $scope.filter.isTrade = 0;

        $scope.filter.billStatusCode = null;
        $scope.filter.status = null;
        $scope.filter.choiceorder = 0;
        $scope.doRefresh();
    }
    //交易中
    $scope.choiceTradeStatusTrade = function () {
        $scope.filter.choiceStatus = 883;
        $scope.filter.choiceorder = 1;
        $scope.filter.isTrade = 1;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.status = 809;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = null;
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.billStatusCode = 809;
            $scope.filter.isAlive = null;
            $scope.filter.status = null;
        };
        $scope.doRefresh();
    }
    //交易完成
    $scope.choiceTradeStatusComplete = function () {
        $scope.filter.choiceStatus = 884;
        $scope.filter.isTrade = 0;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = null;
            $scope.filter.status = 810;
            $scope.filter.choiceorder = 1;
            $scope.doRefresh();
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = null;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = 810;
            $scope.doRefresh();
        }
    }
    //交易关闭
    $scope.choiceTradeStatusFail = function () {
        $scope.filter.choiceStatus = 885;
        $scope.filter.isAlive = 1;
        $scope.filter.isTrade = 0;

        if ($scope.filter.choiceBillType == 101) {
            $scope.filter.billStatusCode = null;
            $scope.filter.status = 816;
            $scope.filter.choiceorder = 0;
            $scope.doRefresh();
        } else if ($scope.filter.choiceBillType == 102) {
            $scope.filter.status = null;
            $scope.filter.isAlive = null;
            $scope.filter.billStatusCode = 816;
            $scope.doRefresh();
        }
    }
    ////获取对应的票据的出价信息，弹出窗口
    //$scope.showBidding = function (item) {
    //    billService.getBillProductBidding(item.id).then(function (data) {
    //        $scope.biddings = data;
    //        $scope.model = item;
    //    });
    //    $('#modal-bidding').modal('show');
    //};
    ////选择交易方，隐藏弹窗
    //$scope.finishBidding = function (item) {
    //    swal({
    //        title: "确认选择该收票人进行交易吗?",
    //        type: "warning",
    //        showCancelButton: true,
    //        confirmButtonText: "是",
    //        cancelButtonText: "否",
    //        closeOnConfirm: true
    //    }, function () {
    //        billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
    //            swal('确认交易方成功！');

    //            $scope.tableParams.reload();
    //            $('#modal-bidding').modal('hide');
    //        });
    //    });
    //};
    ////撤回某条发布
    //$scope.remove = function (data) {
    //    if ($scope.model.bid_number > 0) {
    //        swal('该票据已经有公司出价，如需撤回，请联系管理员！');
    //        return;
    //    } else {
    //        swal({
    //            title: "确定要撤回该发布?",
    //            type: "warning",
    //            showCancelButton: true,
    //            confirmButtonText: "是",
    //            cancelButtonText: "否",
    //            closeOnConfirm: true
    //        }, function () {
    //            billService.deleteBill(data.id).then(function (data) {
    //                $scope.billsNumber();
    //                $scope.tableParams.reload();
    //            });
    //        });
    //    }
    //}
    ////删除某条发布
    //$scope.delete = function (data) {
    //    if ($scope.model.bid_number > 0) {
    //        swal('该票据已经有公司出价，如需撤回，请联系管理员！');
    //        return;
    //    } else {
    //        swal({
    //            title: "是否确认删除？",
    //            type: "warning",
    //            showCancelButton: true,
    //            confirmButtonText: "是",
    //            cancelButtonText: "否",
    //            closeOnConfirm: true
    //        }, function () {
    //            billService.deleteBill(data.id).then(function (data) {
    //                $scope.billsNumber();
    //                $scope.tableParams.reload();
    //            });
    //        });
    //    }
    //}


    //$scope.deleteOrder = function (data) {
    //    swal({
    //        title: "是否确认删除？",
    //        type: "warning",
    //        showCancelButton: true,
    //        confirmButtonText: "是",
    //        cancelButtonText: "否",
    //        closeOnConfirm: true
    //    }, function () {
    //        orderService.deleteOrder(data.id).then(function (data) {
    //            $scope.billsNumber();
    //            $scope.tableParams.reload();
    //        });
    //    });
    //}

    ////获取所有的常量类型
    //constantsService.queryAll().then(function (data) {
    //    $scope.contantData = data;
    //})
    ////获取承兑机构类型
    //constantsService.queryConstantsType(4).then(function (data) {
    //    $scope.acceptorTypeData = data;
    //})
    ////获取票据类型信息
    //constantsService.queryConstantsType(1).then(function (data) {
    //    $scope.billTypeData = data;
    //})
    ////获取票据属性类型
    //constantsService.queryConstantsType(2).then(function (data) {
    //    $scope.billStyleData = data;
    //})
    ////获取电票瑕疵类型
    //constantsService.queryConstantsType(19).then(function (data) {
    //    $scope.billFlawData = data;
    //})
    ////获取纸票瑕疵类型
    //constantsService.queryConstantsType(15).then(function (data) {
    //    $scope.billFlawData2 = data;
    //})
    ////获取交易方式类型
    //constantsService.queryConstantsType(7).then(function (data) {
    //    $scope.tradeTypeCode = data;
    //})
    ////获取所有的省级地址
    //addressService.queryAll().then(function (data) {
    //    $scope.provinceData = data;
    //});
    ////获取对应省的市级地址
    //$scope.provinceChange = function () {
    //    if (!$scope.model.product_province_id) {
    //        $scope.cityData = [];
    //    }
    //    else {
    //        return addressService.queryCity($scope.model.product_province_id).then(function (data) {
    //            $scope.cityData = data;
    //        });
    //    }
    //}
    ////默认汇票到期日
    //$scope.billTypeChange = function () {
    //    if ($scope.model.bill_type_id == 101) {
    //        $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
    //    }
    //    else {
    //        $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
    //    }
    //}
    ////文件上传
    //$scope.uploadFiles = function (files, errFiles, successFunc) {
    //    $scope.uploading = true;
    //    if (errFiles.length > 0) {
    //        swal('有文件不符合要求，无法上传！');
    //    }
    //    angular.forEach(files, function (file) {
    //        file.upload = Upload.upload({
    //            url: FILE_URL + '/file',
    //            method: 'POST',
    //            headers: { 'Authorization': 'Bearer ' + $rootScope.identity.token },
    //            file: file,
    //            data: { 'FileTypeCode': 1002 }
    //        }).then(successFunc, function (response) {
    //            if (response.status > 0) {
    //                swal('上传失败!' + response.status + ': ' + response.data);
    //            }
    //        }, function (evt) {

    //        });
    //    });
    //};
    ////设置传递给后台的图片数据为上传的图片信息
    //$scope.setFrontID = function (response) {
    //    $timeout(function () {
    //        $scope.model.bill_front_photo_id = response.data.data.id;
    //        $scope.model.bill_front_photo_path = response.data.data.file_path;
    //    })
    //};
    //$scope.setBackID = function (response) {
    //    $timeout(function () {
    //        $scope.model.bill_back_photo_id = response.data.data.id;
    //        $scope.model.bill_back_photo_path = response.data.data.file_path;
    //    })
    //};

    ////$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    ////    getData: function (params) {
    ////        return billService.getOwnBillProduct(params, 0).then(function (data) {
    ////            $scope.first = $scope.getFirst(params);
    ////            return data;
    ////        });
    ////    }
    ////});
    ////编辑信息；获取对应省的市区数据；设置默认显示的图片信息；弹出窗口
    //$scope.edit = function (data) {
    //    $scope.model = angular.copy(data);
    //    $scope.provinceChange();

    //    if (!$scope.model.bill_front_photo_path) {
    //        $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
    //    }
    //    if (!$scope.model.bill_back_photo_path) {
    //        $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
    //    }

    //    $('#modal-edit').modal('show');
    //};

    //$scope.save = function () {
    //    if (!$scope.model.bill_type_id) {
    //        swal("请选择票据类型");
    //        return;
    //    }

    //    if (!$scope.model.trade_type_code) {
    //        swal("请选择交易方式");
    //        return;
    //    }

    //    if (!$scope.model.bill_sum_price) {
    //        swal("请输入票面金额");
    //        return;
    //    }

    //    if ($scope.model.trade_type_code == 701) {
    //        if (!$scope.model.bill_front_photo_id) {
    //            swal("请上传汇票正面");
    //            return;
    //        }
    //    }
    //    else {
    //        if (!$scope.model.acceptor_type_id) {
    //            swal("请选择承兑机构");
    //            return;
    //        }

    //        if (!$scope.model.acceptor_name) {
    //            swal("请输入承兑人名称");
    //            return;
    //        }

    //        if (!$scope.model.bill_deadline_time) {
    //            swal("请输入汇票到期日");
    //            return;
    //        }

    //        if (!$scope.model.contact_name) {
    //            swal("请输入联系人");
    //            return;
    //        }

    //        if (!$scope.model.contact_phone) {
    //            swal("请输入联系方式");
    //            return;
    //        }
    //    }

    //    $scope.model.bill_flaw_ids = [];
    //    if ($scope.model.bill_type_id == 101) {     //获取所有勾选的电票的瑕疵
    //        for (var i = 0; i < $scope.billFlawData.length; i++) {
    //            if ($scope.billFlawData[i].checked) {
    //                $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
    //            }
    //        }
    //    }
    //    else {
    //        for (var i = 0; i < $scope.billFlawData2.length; i++) {     //获取所有勾选的纸票的瑕疵
    //            if ($scope.billFlawData2[i].checked) {
    //                $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
    //            }
    //        }
    //    }
    //    //修改对应的我的发布，刷新列表，隐藏弹窗
    //    billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
    //        $scope.tableParams.reload();
    //        $scope.editForm.$setPristine();
    //        $('#modal-edit').modal('hide');
    //    });
    //};
    ////自动刷新
    //$scope.checkAutointerval = function () {
    //    var autointerval = document.getElementById("autointerval");
    //    if (autointerval.checked) {
    //        var timer = setInterval($scope.reflash(), 60 * 1000);
    //        //$interval($scope.reflash, 60 * 1000)
    //        //autointerval.checked = true;
    //    } else if (!autointerval.checked) {
    //        clearInterval(timer);
    //        //autointerval.checked = false;
    //    };
    //    //console.log(autointerval.checked);
    //};

})
ionicApp.controller('myTaskController', function ($scope, $rootScope, $state, customerService) {
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
    }
    $scope.filter = {};
    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create();
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        customerService.getMyTasks($scope.params).then(function (data) {
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
        $scope.params.next();
    };
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})
ionicApp.controller('newBillOfferController', function ($scope, $rootScope, $state, $stateParams,$ionicPopup,$timeout, addressService, customerService,billService, constantsService) {
    $scope.filter = {
        //is360: true,
        //is180: true,
        //billPrice:'1',
        isType1:true,
        isType2:false,
        isType3:false
    };
    if ($rootScope.identity == null) {
        $ionicPopup.alert({
            title: '警告',
            template: '账户未登录！',
            okType: 'button-assertive',
        });
        $state.go("app.signin");
        return
        //企业未通过审核
    } else if ($rootScope.identity.is_verified < 3 && $rootScope.identity.is_verified != 1) {
        $ionicPopup.alert({
            title: '警告',
            template: '您未进行企业认证，暂时不能进行机构报价！',
            okType: 'button-assertive',
        });
        //$timeout(function () {
        //    $state.go("app.user");
        //}, 1000);
        $state.go("app.user");
        return
    }


    //设置默认的内容
    var emptyEntity = {
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        'offer_detail': {},
        'bill_style_id': 202,
        'deadline_type_code': 1701,
        'trade_type_id': 1801,
        'trade_background_code': 1601,
        'max_price_type': 0,
    };

    $scope.model = {
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        'offer_detail': {},
        'bill_style_id': 202,
        'deadline_type_code': 1701,
        'trade_type_id': 1801,
        'trade_background_code': 1601,
        'max_price_type': 0,
    };

    

    $scope.choice202BillStye = function () {
        $scope.model.bill_style_id = 202;
    }

    $scope.choice203BillStye = function () {
        $scope.model.bill_style_id = 203;
        $scope.filter.isType1 = true;
        $scope.filter.isType2 = false;
        $scope.filter.isType3 = false;
    }

    $scope.choice204BillStye = function () {
        $scope.model.bill_style_id = 204;
        $scope.filter.isType1 = true;
        $scope.filter.isType2 = false;
        $scope.filter.isType3 = false;
    }

    $scope.choice205BillStye = function () {
        $scope.model.bill_style_id = 205;
    }

    $scope.choice1701DeadlineType = function () {
        $scope.model.deadline_type_code = 1701;
    }

    $scope.choice1702DeadlineType = function () {
        $scope.model.deadline_type_code = 1702;
    }

    $scope.choice1703DeadlineType = function () {
        $scope.model.deadline_type_code = 1703;
    }

    $scope.choice1801TradeType = function () {
        $scope.model.trade_type_id = 1801;
    }
    $scope.choice1802TradeType = function () {
        $scope.model.trade_type_id = 1802;
    }
    $scope.choice1803TradeType = function () {
        $scope.model.trade_type_id = 1803;
    }
    $scope.choice1804TradeType = function () {
        $scope.model.trade_type_id = 1804;
    }

    $scope.choice1601TradeBackground = function () {
        $scope.model.trade_background_code = 1601;
    }
    $scope.choice1602TradeBackground = function () {
        $scope.model.trade_background_code = 1602;
    }
    $scope.choice1603TradeBackground = function () {
        $scope.model.trade_background_code = 1603;
    }

    $scope.choice0MaxPriceType = function () {
        $scope.model.max_price_type = 0;
    }
    $scope.choice1MaxPriceType = function () {
        $scope.model.max_price_type = 1;
    }


    //$scope.choiceTIs360 = function () {
    //    $scope.filter.is360 = true;
    //}
    //$scope.choiceFIs360 = function () {
    //    $scope.filter.is360 = false;
    //}

    //$scope.choiceTIs180 = function () {
    //    $scope.filter.is180 = true;
    //}
    //$scope.choiceFIs180 = function () {
    //    $scope.filter.is180 = false;
    //}

    //$scope.choice1BillPrice = function () {
    //    $scope.filter.billPrice = 1;
    //}

    //$scope.choice2BillPrice = function () {
    //    $scope.filter.billPrice = 2;
    //}

    //$scope.choice3BillPrice = function () {
    //    $scope.filter.billPrice = 3;
    //}


    //获取客户信息中的省市地址信息
    init = function () {
        customerService.getCustomer().then(function (AddData) {
            if (AddData.trade_location_province_id && AddData.trade_location_city_id) {
                $scope.model.trade_province_id = AddData.trade_location_province_id;
                if ($scope.model.trade_province_id == 1 || $scope.model.trade_province_id == 20 || $scope.model.trade_province_id == 860 || $scope.model.trade_province_id == 2462) {
                    $scope.filter.tradeProvinceId = $scope.model.trade_province_id + 1;
                    return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                        $scope.CityData = data;
                        $scope.model.trade_location_id = AddData.trade_location_id;
                    });
                } else {
                    return addressService.queryCity($scope.model.trade_province_id).then(function (data) {
                        $scope.CityData = data;
                        $scope.model.trade_location_id = AddData.trade_location_city_id;
                    });
                }
            }
        });
    };

    //如果id不为0，获取指定报价信息
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
            $scope.provinceChange();
            if ($scope.model.max_price > 0) {
                $scope.model.max_price_type = 1;
            }

            try {
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
            catch (e) {
            }
        });
    }
    else {
        $scope.model = emptyEntity;
        init();
    }


    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取所有市级地址
    $scope.provinceChange = function () {
        if ($scope.model.trade_province_id == null) {
            return;
        } else if ($scope.model.trade_province_id == 1 || $scope.model.trade_province_id == 20 || $scope.model.trade_province_id == 860 || $scope.model.trade_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.CityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.trade_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
   
    $scope.save = function () {
        if ($scope.model.bill_style_id == 203 || $scope.model.bill_style_id == 205) {
            if (!$scope.model.trade_location_id) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '请选择交易地点！',
                    okType: 'button-assertive',
                });
                return;
            }
        }
        $scope.model.offer_detail = JSON.stringify($scope.model.offer_detail);
        $scope.model.offer_detail = $scope.model.offer_detail.split(',');
        for (var i = 0; i < $scope.model.offer_detail.length; i++) {
            $scope.model.offer_detail_value = $scope.model.offer_detail[i].split(':');
            $scope.model.offer_detail_value[1] = '"'+ parseFloat($scope.model.offer_detail_value[1]).toPrecision(4) + '"';
            $scope.model.offer_detail[i] = $scope.model.offer_detail_value.join(':');
        }
        $scope.model.offer_detail = $scope.model.offer_detail.join(',');

        if ($scope.model.id == null) {
            //新增报价
            billService.insertBillOffer($scope.model).then(function (data) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '新增报价成功！',
                    okType: 'button-assertive',
                });

                $state.go('app.billOfferQuery');
            });
        }
        else {
            //修改报价
            billService.updateBillOffer($scope.model).then(function (data) {
                $ionicPopup.alert({
                    title: '警告',
                    template: '修改报价成功！',
                    okType: 'button-assertive',
                });
                $state.go('app.billOfferQuery');
            });
        }
    };

    $scope.close = function () {
        $state.go('app.billOfferQuery');
    }
})
ionicApp.controller('photoTestController', function ($scope, $rootScope, customerService, $state) {
    // 模拟登陆
    customerService.customerLoginEnterprise({ 'username': 'jinyifan', 'password': '123654789' }).then(function (data) {
        customerService.customerLogin({ 'username': 'jinyifan', 'password': '123654789', 'enterprise_id': data.enterprises[0].enterprise_id }).then(function (data) {
            $rootScope.identity = data;
        });
    });

    $scope.takePhoto = function () {
        $scope.$takePhoto(function (data) {
            $scope.photoSrc = data;
        });
    }

    $scope.upload = function (src) {
        $scope.$uploadPhoto(src, function (data) {
            //alert(data);
        });
    }
})
ionicApp.controller('publishController', function ($rootScope, $scope, $timeout, $stateParams, $state, FILE_URL, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    
});

ionicApp.controller('querybankController', function ($rootScope, $scope, $state, $interval, billService, $ionicPopup, customerService, constantsService, Restangular, localStorageService) {

})
ionicApp.controller('queryBillController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        acceptorTypeID: '',
        billStatusAll: true,
        tradeTypeCode: '',
        billTypeID: '',
        billStatusCode: '801,802,803,804,805,806,807,808,809,810,811,812,813',
        billCharacterCode: '',
        billStyleID:'',
    };

    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {

            var acceptorTypeID = [];
            if (!$scope.filter.acceptorTypeAll) {           //获取选中的承兑机构
                for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
                    if ($scope.acceptorTypeData[i].checked) {
                        acceptorTypeID.push($scope.acceptorTypeData[i].code)
                    }
                }
            }
            $scope.filter.acceptorTypeID = acceptorTypeID.join(",");

            
            $scope.filter.locationId = $scope.filter.CityID;

            //查看票据
            return billService.searchBillProduct(params, $scope.filter.billTypeID, $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                $scope.first = $scope.getFirst(params);
                //if (data.bill_status_code == 801) {
                //    data.bill_status_name="发布中";
                //}else if(data.bill_status_code >= 802) {
                //    data.bill_status_name="交易中";
                //}
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

  
});

ionicApp.controller('queryenterpriseController', function ($rootScope, $scope, $state, $interval, billService, $ionicPopup, customerService, constantsService, Restangular, localStorageService) {

})
ionicApp.controller('receiveBillController', function ($rootScope, $scope, $state, addressService, billService, $ionicPopup) {
    $rootScope.receiveBill = {};
    $rootScope.receiveBill.filter = {
        //billTypeAll: true,
        billStyleAll: true,
        acceptorTypeAll: true,
        billCharacterAll: true,
        billStatusAll: true,
        //tradeTypeCode: '701,702',
        tradeTypeCode: '',
        //billTypeID: '101,102',
        billTypeID: '',
        billStatusCode: '801,802',
        //billCharacterCode: '1701,1702',
        billCharacterCode: '',
        //acceptorTypeID: '401,402,403,404,405,406,407'
        acceptorTypeID: ''
    };
    $scope.filter = {
        //billTypeAll: true,
        billStyleAll: true,
        acceptorTypeAll: true,
        billCharacterAll: true,
        billStatusAll: true,
        //tradeTypeCode: '701,702',
        tradeTypeCode: '',
        //billTypeID: '101,102',
        billTypeID: '',
        billStatusCode: '801,802',
        //billCharacterCode: '1701,1702',
        billCharacterCode: '',
        //acceptorTypeID: '401,402,403,404,405,406,407'
        acceptorTypeID:''
    };


    //全选票据类型
    $scope.choiceAllBillType = function () {
        $scope.filter.billTypeID = '';
        $scope.filter.billStyleAll = true;
    };

    //选择电票
    $scope.choiceEBillType = function () {
        $scope.filter.billTypeID = '101';
        $scope.filter.billStyleAll = false;
    };
    //选择纸票
    $scope.choicePBillType = function () {
        $scope.filter.billTypeID = '102';
        $scope.filter.billStyleAll = false;
    };

    //交易方式（全选）
    $scope.choiceAlltradeType = function () {
        $scope.filter.tradeTypeCode = '';
    };

    //选择现票买断
    $scope.choiceNtradeType = function () {
        $scope.filter.tradeTypeCode = '701';
    };

    //选择预约出票
    $scope.choiceRAlltradeType = function () {
        $scope.filter.tradeTypeCode = '702';
    };

    //汇票状态（全选）
    $scope.choiceAllBillStatus = function () {
        $scope.filter.billStatusCode = '801,802,803,804,805,806,807,808,809,810,811,812,813';
        $scope.filter.billStatusAll = true;
    };

    ////未交易
    //$scope.choiceNAllBillStatus = function () {
    //    $scope.filter.billStatusCode = '801,802';
    //    $scope.filter.billStatusAll = false;
    //};

    ////已交易
    //$scope.choiceYAllBillStatus = function () {
    //    $scope.filter.billStatusCode = '803,804,805,806,807,808,809,810,811,812,813';
    //    $scope.filter.billStatusAll = false;
    //};

    //承兑机构（全选）
    $scope.choiceAllAcceptorType = function () {
        $scope.filter.acceptorTypeID = '';
        $scope.filter.acceptorTypeAll = true;
    };

    //国股
    $scope.choice401AcceptorType = function () {
        $scope.filter.acceptorTypeAll = false;
        $scope.filter.acceptorTypeID = '401'
    }
    
    //城商 
    $scope.choice402AcceptorType = function () {
        $scope.filter.acceptorTypeAll = false;
        $scope.filter.acceptorTypeID = '402'
    }
    
    //三农
    $scope.choice403AcceptorType = function () {
        $scope.filter.acceptorTypeAll = false;
        $scope.filter.acceptorTypeID = '403'
    }

    //村镇 
    $scope.choice404AcceptorType = function () {
        $scope.filter.acceptorTypeAll = false;
        $scope.filter.acceptorTypeID = '404'
    }
    
    //外资 
    $scope.choice405AcceptorType = function () {
        $scope.filter.acceptorTypeAll = false;
        $scope.filter.acceptorTypeID = '405'
    }
    
    //财务公司 
    $scope.choice406AcceptorType = function () {
        $scope.filter.acceptorTypeAll = false;
        $scope.filter.acceptorTypeID = '406'
    }

    //商票
    $scope.choice407AcceptorType = function () {
        $scope.filter.acceptorTypeAll = false;
        $scope.filter.acceptorTypeID = '407'
    }

    //汇票特点（全选）
    $scope.choiceAllBillCharacter = function () {
        $scope.filter.billCharacterAll = true;
        $scope.filter.billCharacterCode = ''
    }
    //足月
    $scope.choiceYBillCharacter = function () {
        $scope.filter.billCharacterAll = false;
        $scope.filter.billCharacterCode = '1701'
    }

    //不足月
    $scope.choiceNBillCharacter = function () {
        $scope.filter.billCharacterAll = false;
        $scope.filter.billCharacterCode = '1702'
    }
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        $scope.filterProvinceChange();
    });
    //获取对应的省下所有的市级地址
    $scope.filterProvinceChange = function () {
        if ($scope.filter.ProvinceID == null) {
            return;
        } else if ($scope.filter.ProvinceID == 1 || $scope.filter.ProvinceID == 20 || $scope.filter.ProvinceID == 860 || $scope.filter.ProvinceID == 2462) {
            $scope.filter.tradeProvinceId = $scope.filter.ProvinceID + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.CityData = data;
            });
        }else {
            return addressService.queryCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    $scope.getResult = function () {
        if($scope.filter.CityID==undefined){
            $scope.filter.CityID = $scope.filter.ProvinceID;
        }
        $rootScope.receiveBill.filter = $scope.filter;
        $state.go('app.receiveBillResult');

    }
   
    $scope.showHelp = function () {
        $ionicPopup.alert({
            title: '帮助',
            template: ' 足月票：一般是指剩余天数半年期票多于180天，一年期票多于360天的汇票！'
        });
    }

})
ionicApp.controller('receiveBillResultController', function ($scope, $rootScope, $state, billService, toolService) {
    $scope.filter = {
        //billTypeAll: true,
        billStyleAll: true,
        acceptorTypeAll: true,
        billCharacterAll: true,
        billStatusAll: true,
        //tradeTypeCode: '701,702',
        tradeTypeCode: '',
        //billTypeID: '101,102',
        billTypeID: '',
        billStatusCode: '801,802,803,804,805,806,807,808,809,810,811,812,813',
        //billCharacterCode: '1701,1702',
        billCharacterCode: '',
        //acceptorTypeID: '401,402,403,404,405,406,407'
        acceptorTypeID: ''
    };
    $scope.starTemp = {};
    $scope.doRefresh = function () {
        $scope.filter = $rootScope.receiveBill.filter;
        $scope.params = $scope.Params.Create('-publishing_time', 10);
        $scope.listData = [];
        $scope.loadMore();
    };
    $scope.loadMore = function (first) {
        $scope.filter.locationId = $scope.filter.CityID;

        //查看票据
        return billService.searchBillProduct($scope.params, $scope.filter.billTypeID, $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.locationId, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
            $scope.products = data;
     
            for (var i = 0; i < $scope.products.length; i++) {
                toolService.setStars($scope.products[i]);
            };
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? $scope.products : $scope.listData.concat($scope.products);
            $scope.$broadcast('scroll.infiniteScrollComplete')
            $scope.params.next();
        });
    };
    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})
ionicApp.controller('rechargeController', function ($scope, $rootScope, $ionicPopup,$state, $http, API_URL) {
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
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&enterpriseId=' + $rootScope.identity.enterprise_id);

       // $state.go("app.rechargePay");
        //alert($rootScope.rechargePayForm);
    };
})
ionicApp.controller('rechargePayController', function ($scope, $rootScope, $state) {
})
ionicApp.controller('rechargerecordController', function ($scope, $rootScope, $state, payingService) {
    
    $scope.filter = {};

    $scope.doRefresh = function () {
        $scope.params = $scope.Params.Create();
        $scope.listData = [];
        $scope.loadMore();
    };

    $scope.loadMore = function (first) {
        payingService.platformAccountBalance($scope.params).then(function (data) {
            $scope.hasMore = data.length == 10;
            $scope.listData = first ? data : $scope.listData.concat(data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });

        $scope.params.next();
    };

    $scope.$on('$stateChangeSuccess', $scope.doRefresh);
})
ionicApp.controller('securityController', function ($scope, $rootScope, $state) {
})
ionicApp.controller('setController', function ($scope, $rootScope, $state, $ionicPopup, localStorageService) {
    $scope.loginOut = function () {
        if ($rootScope.identity) {
            $rootScope.loginRequestEnter = null;
            $rootScope.enterprises = null;
            $rootScope.identity = null;
            localStorageService.set('customer', null);
            $ionicPopup.alert({
                title: '提示',
                template: '登出成功!',
                okType: 'button-assertive',
            });
        }
    }
})
ionicApp.controller('signinController', function ($rootScope, $scope, $state, $interval, billService, $ionicPopup, customerService, constantsService, Restangular, localStorageService) {
    $scope.model = {};
    $scope.loginRequestEnterprise = {};
    $scope.loginRequest = {};
    $scope.loginRequestEnterprise.username = "";
    $scope.loginRequestEnterprise.password = "";
    $scope.loginRequest.username = "";
    $scope.loginRequest.password = "";
    $rootScope.loginRequestEnter = {};
    $scope.enterprises = [];
    //新建账户信息
    $scope.loginEnterprise = function () {
        $scope.loginRequestEnterprise = {
            username: $scope.model.phone_number,
            password: $scope.model.password,
        }
        $rootScope.loginRequestEnter = {
            username: $scope.model.phone_number,
            password: $scope.model.password,
        }
        customerService.customerLoginEnterprise($scope.loginRequestEnterprise).then(function (data) {
            if (data.enterprises[0].enterprise_id != -1) {
                if (data.enterprises.length == 1) {
                    $scope.loginRequest = {
                        username:$scope.model.phone_number,
                        password: $scope.model.password,
                        enterprise_id:data.enterprises[0].enterprise_id,
                    }
                    customerService.customerLogin($scope.loginRequest).then(function (data) {
                        localStorageService.set('customer', data);
                        $rootScope.identity = data;
                        Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
                        $state.go('app.user');      //跳转到个人中心
                    });
                } else {
                    $rootScope.enterprises = data.enterprises;
                    $state.go('app.signinEnterprise');
                }
            } else {
                $scope.loginRequest = {
                    username: $scope.loginRequestEnterprise.username,
                    password: $scope.loginRequestEnterprise.password,
                    enterprise_id: -1
                };
                customerService.customerLogin($scope.loginRequest).then(function (data) {
                    localStorageService.set('customer', data);
                    //alert(data.token);
                    $rootScope.identity = data;
                    Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
                    $state.go('app.user');      //跳转到个人中心
                });
            }
        });
    };
    $scope.login = function (enterprise_id) {
        $scope.loginRequest = {
            username: $scope.loginRequestEnterprise.phone_number,
            password: $scope.loginRequestEnterprise.password,
            enterprise_id: enterprise_id
        }
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            localStorageService.set('customer', data);
            //alert(data.token);
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            //alert(data.token)
            $state.go('app.user');      //跳转到个人中心
        });
    };
})
ionicApp.controller('signinEnterpriseController', function ($rootScope, $scope, $state, $interval, billService, $ionicPopup, customerService, constantsService, Restangular, localStorageService) {
    //新建账户信息
    $scope.loginRequest = {};
    $scope.loginRequest.username = "";
    $scope.loginRequest.password = "";
    $scope.enterprises1 = [];
    $scope.enterprises1 = $rootScope.enterprises;
    $scope.loginRequest = $rootScope.loginRequestEnter;

    $scope.loginEnter = function (n) {
        $scope.loginRequest.enterprise_id = n;
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            localStorageService.set('customer', data);
            //alert(data.token);
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.user');      //跳转到个人中心
        });
    };

})
ionicApp.controller('signupController', function ($rootScope, $scope, $state, $interval, billService, $ionicPopup, customerService, constantsService, Restangular, localStorageService) {
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.filter = {
        choicePhone: 0,
    }
    //var second = 90;
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
                $scope.verifyStr = $scope.second + "秒后重新获取";
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

    $scope.signup = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入手机号码!',
                okType: 'button-assertive',
            });
            return;
        }

        if (!$scope.model.password || $scope.model.password.length == 0) {
             $ionicPopup.alert({
                title: '警告',
                template: '请输入密码!',
                okType: 'button-assertive',
                });
                return;
        }

        if (!$scope.model.password || $scope.model.password.length < 6) {
             $ionicPopup.alert({
                 title: '警告',
                 template: '请输入密码!',
                 okType: 'button-assertive',
             });
            return;
        }

        if ($scope.model.password != $scope.model.password2) {
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
        //注册功能
        customerService.customerReg($scope.model).then(function (data) {
            $ionicPopup.alert({
                title: '通知',
                template: '注册成功!',
                okType: 'button-assertive',
                });
            $scope.loginRequest = {
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
                $state.go('app.user');      //跳转到个人中心
            });
        });
    }

    //$scope.tLogin = function () {
    //    $scope.loginRequest = {
    //            username: 17826859540,
    //            password: '111111',
    //            enterprise_id: -1
    //        }
    // customerService.customerLogin($scope.loginRequest).then(function (data) {
    //            //$cookieStore.put('customer', data);
    //            localStorageService.put('customer', data);
    //            alert(data.token);
    //            $rootScope.identity = data;
    //            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
    //            $state.go('app.home');      //跳转到个人中心
    //        });
    //}
});
ionicApp.controller('smearBillController', function ($rootScope, $scope, $state) {
    var curRotate = 0;

    var canvasWidth = $(window).get(0).innerWidth;			//定义canvas宽高
    var canvasHeight = $(window).get(0).innerHeight - 200;

    var isMouseDown = false;			//检测按下鼠标动作
    var lastLoc = { x: 0, y: 0 };		//上一次的坐标

    var canvas = document.getElementById("canvas");		//获取canvas对象
    var context = canvas.getContext("2d");			//取得图形上下文
    var mosicIndex = 0;                 //当前灰度索引
    var mosicLevel = 30;                //灰度的层级
    var oldStartX = oldStartY = -1;

    canvas.width = canvasWidth;			//定义canvas宽高
    canvas.height = canvasHeight;

    $scope.size = 10;


    var pencil = $scope.pencil = {
        thickness: 30,
        color: 'rgba(0,0,0,0)'
    };


    //function initProgress() {
    //    $scope.progressInfo = "保存中...";

    //    $scope.progressStyle = {
    //        "width": "2%"
    //    };
    //}

    var image = new Image();
    image.crossOrigin = '*';


    $scope.initImage = function() {
        $scope.$takePhoto(function (data) {
            $scope.photoSrc = data;
        });
        $scope.imgUrl = $scope.photoSrc;
        image.src = $scope.imgUrl + "?" + new Date().getTime();

        image.onload = function () {
            context.drawImage(image, 0, 0, canvasWidth, canvasHeight);		//绘制图像
        }
    }
    ////当鼠标在外部并且松开的时候
    //$("body").addEventListener('touchend', function (e) {
    //    isMouseDown = false;
    //}, false);

    // 手指按下
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        isMouseDown = true;

        lastLoc = windowToCanvas(e.touches[0].pageX, e.touches[0].pageY);
    }, false);

    // 手指离开
    canvas.addEventListener('touchend', function (e) {
        e.preventDefault();
        isMouseDown = false;
    }, false);

    // 手指移动
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (isMouseDown) {
            var size = $scope.size;
            var curLoc = windowToCanvas(e.touches[0].pageX, e.touches[0].pageY);
            //var pixelData = context.getImageData(curLoc.x, curLoc.y, Math.abs(lastLoc.x-curLoc.x),Math.abs(lastLoc.y-curLoc.y));    // 获得区域数据
            var r = g = b = 0;
            var s = "";
            var startX = startY = 0;

            startX = parseInt(curLoc.x / size) * size;
            startY = parseInt(curLoc.y / size) * size;
            if (oldStartX != startX || oldStartY != startY) {
                r = g = b = mosicIndex * mosicLevel + 80;
                mosicIndex = (mosicIndex + 1) % 6;
                s = 'rgb(' + r + ',' + g + ',' + b + ')';
                context.fillStyle = s;
                context.fillRect(startX, startY, size, size);
                oldStartX = startX;
                oldStartY = startY;
            }

            lastLoc = curLoc;
        }
    }, false);

    //鼠标移动事件
    canvas.onmousemove = function (e) {

    };

    function windowToCanvas(x, y) {				//计算canvas上面的坐标
        var point = canvas.getBoundingClientRect();			//元素边框距离页面的距离
        x = Math.round(x - point.left);
        y = Math.round(y - point.top);
        return { x: x, y: y };
    }

    //$scope.saveImage = function () {
    //    $scope.save(0);
    //};
    //$scope.replaceImage = function () {
    //    $scope.save(1);
    //};
    $scope.save = function () {
        // 获取Base64编码后的图像数据，格式是字符串
        // 后面的部分可以通过Base64解码器解码之后直接写入文件。
        var data_url = canvas.toDataURL("image/png");
        //var blob = dataURLtoBlob(data_url);
        var fileName = getEndorsementFileName($scope.imgUrl);
        //var fd = new FormData();
        //fd.append("file", blob, fileName);
        //var xhr = new XMLHttpRequest();
        //xhr.addEventListener('load', onLoadHandler, false);
        ////xhr.upload.addEventListener('progress', $scope.onProgressHandler, false);
        //xhr.open('POST', FILE_URL + '/fileWithName', true);
        //xhr.send(fd);


        var uri = FILE_URL + '/fileWithName';
        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileName = getEndorsementFileName($scope.imgUrl);
        options.mimeType = "image/jpeg";
        //options.headers = { 'Authorization': 'Bearer ' + $rootScope.identity.token };
        //options.params = { 'FileTypeCode': 1002 };

        var ft = new FileTransfer();
        ft.upload(data_url, uri, function (result) {
            alert("上传成功！");
        }, function (err) {
            alert(err.exception);
        }, options);
    };

    var onLoadHandler = function (event) {
        if (this.status == 200 || this.status == 304) {
            //var result = JSON.parse(this.responseText);
            //alert("保存成功");
        }
    };

    //$scope.onProgressHandler = function (event) {
    //    if (event.lengthComputable) {
    //        var percentComplete = parseInt(event.loaded / event.total * 100) + "%";
    //        $scope.progressStyle.width = percentComplete;
    //        if (event.loaded == event.total) {
    //            console.log("保存成功");
    //            $scope.progressInfo = "保存成功";
    //            //保存成功后续处理
    //            afterSave();
    //        }
    //        $scope.$apply();
    //    }
    //};

    //function afterSave() {
    //    $("#progressModal").modal('hide');
    //    var data = {
    //        bill: $stateParams.data.model
    //    };
    //    $state.go('app.constants.checkBill', { data: data });
    //}

    //$scope.resetCanvas = function () {
    //    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    //}

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    ////获取文件名称
    function getEndorsementFileName(imgUrl) {
        var url = imgUrl.split("/");
        var preNames = url[url.length - 1].split(".");
        return preNames[0] + "-1." + preNames[1];
    }

    ////顺时针旋转
    //$scope.clockwise = function () {
    //    console.log(curRotate);
    //    curRotate = curRotate + 1;
    //    refreshImg();
    //};

    ////逆时针旋转
    //$scope.eastern = function () {
    //    console.log(curRotate);
    //    curRotate = curRotate - 1;
    //    refreshImg();
    //};

    //function refreshImg() {
    //    context.save();
    //    var rotation = curRotate * Math.PI / 2;
    //    context.clearRect(0, 0, canvasWidth, canvasHeight)
    //    context.translate(canvasWidth / 2, canvasHeight / 2);
    //    context.rotate(rotation);
    //    context.translate(-canvasWidth / 2, -canvasHeight / 2);
    //    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    //    context.restore();//恢复状态
    //}
});

ionicApp.controller('testController', function ($scope, $rootScope, $state, FILE_URL) {
    var curRotate = 0;

    var canvasWidth = $(window).get(0).innerWidth;			//定义canvas宽高
    var canvasHeight = $(window).get(0).innerHeight - 200;

    var isMouseDown = false;			//检测按下鼠标动作
    var lastLoc = { x: 0, y: 0 };		//上一次的坐标

    var canvas = document.getElementById("canvas");		//获取canvas对象
    var context = canvas.getContext("2d");			//取得图形上下文
    var mosicIndex = 0;                 //当前灰度索引
    var mosicLevel = 30;                //灰度的层级
    var oldStartX = oldStartY = -1;

    canvas.width = canvasWidth;			//定义canvas宽高
    canvas.height = canvasHeight;

    $scope.size = 10;


    var pencil = $scope.pencil = {
        thickness: 30,
        color: 'rgba(0,0,0,0)'
    };


    //function initProgress() {
    //    $scope.progressInfo = "保存中...";

    //    $scope.progressStyle = {
    //        "width": "2%"
    //    };
    //}

    var image = new Image();
    image.crossOrigin = '*';

    $scope.takePhoto = function () {
        $scope.$takePhoto(function (data) {
            $scope.photoSrc = data;
        });
    }

    function initImage() {
        $scope.imgUrl = "http://hpx-file.oss-cn-hangzhou.aliyuncs.com/hpxpic/ct7hdsTEZ6HgKfLAQTjXXTleVhdcRth3pEWi1kiYXsQ17zu.jpg";
        image.src = $scope.imgUrl + "?" + new Date().getTime();

        image.onload = function () {
            context.drawImage(image, 0, 0, canvasWidth, canvasHeight);		//绘制图像
        }
    }

    initImage();


    ////当鼠标在外部并且松开的时候
    //$("body").addEventListener('touchend', function (e) {
    //    isMouseDown = false;
    //}, false);

    // 手指按下
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        isMouseDown = true;

        lastLoc = windowToCanvas(e.touches[0].pageX, e.touches[0].pageY);
    }, false);

    // 手指离开
    canvas.addEventListener('touchend', function (e) {
        e.preventDefault();
        isMouseDown = false;
    }, false);

    // 手指移动
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        if (isMouseDown) {
            var size = $scope.size;
            var curLoc = windowToCanvas(e.touches[0].pageX, e.touches[0].pageY);
            //var pixelData = context.getImageData(curLoc.x, curLoc.y, Math.abs(lastLoc.x-curLoc.x),Math.abs(lastLoc.y-curLoc.y));    // 获得区域数据
            var r = g = b = 0;
            var s = "";
            var startX = startY = 0;

            startX = parseInt(curLoc.x / size) * size;
            startY = parseInt(curLoc.y / size) * size;
            if (oldStartX != startX || oldStartY != startY) {
                r = g = b = mosicIndex * mosicLevel + 80;
                mosicIndex = (mosicIndex + 1) % 6;
                s = 'rgb(' + r + ',' + g + ',' + b + ')';
                context.fillStyle = s;
                context.fillRect(startX, startY, size, size);
                oldStartX = startX;
                oldStartY = startY;
            }

            lastLoc = curLoc;
        }
    }, false);

    //鼠标移动事件
    canvas.onmousemove = function (e) {

    };

    function windowToCanvas(x, y) {				//计算canvas上面的坐标
        var point = canvas.getBoundingClientRect();			//元素边框距离页面的距离
        x = Math.round(x - point.left);
        y = Math.round(y - point.top);
        return { x: x, y: y };
    }

    //$scope.saveImage = function () {
    //    $scope.save(0);
    //};
    //$scope.replaceImage = function () {
    //    $scope.save(1);
    //};
    $scope.save = function () {
        // 获取Base64编码后的图像数据，格式是字符串
        // 后面的部分可以通过Base64解码器解码之后直接写入文件。
        var data_url = canvas.toDataURL("image/png");
        //var blob = dataURLtoBlob(data_url);
        var fileName = getEndorsementFileName($scope.imgUrl);
        //var fd = new FormData();
        //fd.append("file", blob, fileName);
        //var xhr = new XMLHttpRequest();
        //xhr.addEventListener('load', onLoadHandler, false);
        ////xhr.upload.addEventListener('progress', $scope.onProgressHandler, false);
        //xhr.open('POST', FILE_URL + '/fileWithName', true);
        //xhr.send(fd);


        var uri = FILE_URL + '/fileWithName';
        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileName = getEndorsementFileName($scope.imgUrl);
        options.mimeType = "image/jpeg";
        //options.headers = { 'Authorization': 'Bearer ' + $rootScope.identity.token };
        //options.params = { 'FileTypeCode': 1002 };

        var ft = new FileTransfer();
        ft.upload(data_url, uri, function (result) {
            alert("上传成功！");
        }, function (err) {
            alert(err.exception);
        }, options);
    };

    var onLoadHandler = function (event) {
        if (this.status == 200 || this.status == 304) {
            //var result = JSON.parse(this.responseText);
            //alert("保存成功");
        }
    };

    //$scope.onProgressHandler = function (event) {
    //    if (event.lengthComputable) {
    //        var percentComplete = parseInt(event.loaded / event.total * 100) + "%";
    //        $scope.progressStyle.width = percentComplete;
    //        if (event.loaded == event.total) {
    //            console.log("保存成功");
    //            $scope.progressInfo = "保存成功";
    //            //保存成功后续处理
    //            afterSave();
    //        }
    //        $scope.$apply();
    //    }
    //};

    //function afterSave() {
    //    $("#progressModal").modal('hide');
    //    var data = {
    //        bill: $stateParams.data.model
    //    };
    //    $state.go('app.constants.checkBill', { data: data });
    //}

    //$scope.resetCanvas = function () {
    //    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    //}

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    ////获取文件名称
    function getEndorsementFileName(imgUrl) {
        var url = imgUrl.split("/");
        var preNames = url[url.length - 1].split(".");
        return preNames[0] + "-1." + preNames[1];
    }

    ////顺时针旋转
    //$scope.clockwise = function () {
    //    console.log(curRotate);
    //    curRotate = curRotate + 1;
    //    refreshImg();
    //};

    ////逆时针旋转
    //$scope.eastern = function () {
    //    console.log(curRotate);
    //    curRotate = curRotate - 1;
    //    refreshImg();
    //};

    //function refreshImg() {
    //    context.save();
    //    var rotation = curRotate * Math.PI / 2;
    //    context.clearRect(0, 0, canvasWidth, canvasHeight)
    //    context.translate(canvasWidth / 2, canvasHeight / 2);
    //    context.rotate(rotation);
    //    context.translate(-canvasWidth / 2, -canvasHeight / 2);
    //    context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
    //    context.restore();//恢复状态
    //}
})
ionicApp.controller('tourController', function ($scope, $rootScope, $state, localStorageService) {
    var tour = localStorageService.get('tour');

    if (tour) {
        $state.go('app.home');
    }
    else {
        localStorageService.set('tour', 'finished');
    }
})
ionicApp.controller('transactionDetailController', function ($scope, $rootScope, $state) {
})
ionicApp.controller('userController', function ($scope, $rootScope, $state, customerService, appHomeService, $ionicModal, $ionicPopup) {
    $scope.isSignIn = false;
    $scope.customerInfo = {
        /*id:1,
        enterprise_name:1,
        platform_balance:1,
        phone_number:1,
        customer_name:1,
        mission_number:1,
        publish_active_number:1,
        bid_active_number:1,
        notification_number:1,*/
    }
    $scope.alertOnlineService = false;
    /*customerService.getCustomer().then(function (data) {
        if (data != null) {
            $scope.isSignIn = true;
        }
        $scope.customerInfo.phone_number = data.phone_number;
    });*/
    if ($rootScope.identity) {
        appHomeService.getAppHome().then(function (data) {
            if (data != null) {
                $scope.isSignIn = true;
                $scope.customerInfo = data;
            }
        });
    }
    $scope.alertOnline = function () {
        $scope.alertOnlineService = true;
        alert($scope.alertOnlineService)
    }
    //(function (a, h, c, b, f, g) { a["UdeskApiObject"] = f; a[f] = a[f] || function () { (a[f].d = a[f].d || []).push(arguments) }; g = h.createElement(c); g.async = 1; g.src = b; c = h.getElementsByTagName(c)[0]; c.parentNode.insertBefore(g, c) })(window, document, "script", "http://assets-cli.huipiaoxian.udesk.cn/im_client/js/udeskApi.js?1484906754367", "ud");

    //ud({
    //    "code": "19hb4g1h",
    //    "link": "http://www.huipiaoxian.udesk.cn/im_client?web_plugin_id=23504",
    //    "targetSelector": "#online-service",
    //    "mobile": {
    //        "mode": "inner",
    //        "color": "#307AE8",
    //        "pos_flag": "srm",
    //        "onlineText": "联系客服，在线咨询",
    //        "offlineText": "客服下班，请留言",
    //        "pop": {
    //            "direction": "top",
    //            "arrow": {
    //                "top": 0,
    //                "left": "70%"
    //            }
    //        }
    //    }
    //});
    $scope.openService = function () {
        $scope.alertOnlineService = true;
    }
    $scope.closeService = function () {
        $scope.alertOnlineService = false;
    }
    $scope.onlineService = function () {
        $ionicPopup.alert({
            title: "通知",
            template: "暂不支持！",
            okType: "button-assertive",
        });
    }
})
ionicApp.controller('userInfoController', function ($scope, $rootScope, $state, customerService, addressService, $ionicPopup) {
    $scope.model = {};
    $scope.filter = {
        isModified: 1,
        tradCity: true,
        tip: false
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.provinceChange();
        if ($scope.model.trade_location_province_id != 1 || $scope.model.trade_location_province_id != 20 || $scope.model.trade_location_province_id != 860 || $scope.model.trade_location_province_id != 2462) {
            $scope.cityChange();
        }
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.provinceChange = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            $scope.filter.isModified == 0;
            //document.getElementById("tradCity").style.display = "none";
            $scope.filter.tradCity = false;
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            $scope.filter.isModified == 1;
            //document.getElementById("tradCity").style.display = "block";
            $scope.filter.tradCity = true;
            $scope.AddressData = null;
            return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取对应市的区
    $scope.cityChange = function () {
        if ($scope.model.trade_location_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.trade_location_city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
    }
    $scope.modified = function () {
        $scope.model.is_verified = 0;
        var tempList = $scope.model.telephone_number.split('-');
        $scope.model.telephone_code = tempList[0];
        $scope.model.telephone_number_number = tempList[1];
        $scope.filter.isModified = 1;
        setTimeout(function () {
            if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
                $scope.filter.tradCity = false;
            }
        }, 50);
    };
    //提交客户信息进行审核
    $scope.save = function () {
        if (!$scope.model.customer_name) {
            $ionicPopup.alert({
                title: '警告',
                template: '请输入联系人！',
                okType: 'button-assertive',
            });
            return;
        }
        if ($scope.model.telephone_code && $scope.model.telephone_number_number) {
            $scope.model.telephone_number = $scope.model.telephone_code + '-' + $scope.model.telephone_number_number;
        }
        customerService.updateCustomer($scope.model).then(function (data) {
            //$state.go("app.main.enterpriseInfo");
            //$ionicPopup.alert({
            //    title: '警告',
            //    template: '提交成功，请继续完善企业信息！',
            //    okType: 'button-assertive',
            //});
            $scope.filter.tip = true;
        });
    };
})