hpxAdminApp.controller('accountInfoController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, customerService, orderService, billService) {
    $scope.filter = {
        count:0,
    }
    //��ȡ�����еĳ�Ʊ��������
    orderService.getOrderRunning('drawer').then(function (data) {
        if (data == undefined) {
            $scope.drawerCount = 0;
        } else {
            $scope.drawerCount = data;
        }
    });
    //��ȡ�����еĶ�Ʊ��������
    orderService.getOrderRunning('receiver').then(function (data) {
        if (data == undefined) {
            $scope.receiverCount = 0;
        } else {
            $scope.receiverCount = data;
        }
    });
    //var count = 0;
    billService.getOwnBidding().then(function (data) {
        //return data;
        for (var i = 0, n = data.length; i < n; i++) {
            if (data[i].bid_result == 1) {
                $scope.filter.count++;
            }
        }
    });



});

hpxAdminApp.controller('addressController', function ($scope, $rootScope, $state, ngTableParams, addressService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取所有省级地址名称
    addressService.queryAll().then(function (data) {
        $scope.PData = data;
        $scope.filterProvince();
    });
    //根据省级地址id，获取本省市区地址名称
    $scope.filterProvince = function () {
        if ($scope.model.province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.province_id).then(function (data) {
                $scope.CData = data;
            });
        }
        $scope.filterCity();
    },
    //根据市级地址id，获取本市区的地址名称
    $scope.filterCity = function () {
        if ($scope.model.city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.city_id).then(function (data) {
                $scope.DstrictData = data;
            });
        }
    },
    //获取客户对应的所有客户地址
   $scope.tableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
       getData: function (params) {
           return customerService.getAllCustomerAddress(params).then(function (data) {
               $scope.first = $scope.getFirst(params);
               $scope.AddressData = data;
               for (var i = 0; i < $scope.AddressData.length; i++) {
                   if ($scope.AddressData[i].is_default == 1) {
                       $scope.AddressData[i].is_default = "是";
                   } else {
                       $scope.AddressData[i].is_default = null;
                   }
               }
           });
       }
   });
    //刷新表格
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //设置默认地址
    $scope.default = function (item) {
        customerService.updateAddressDefault(item).then(function (data) {
            $scope.tableParams.reload();
        });
    }
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内容
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
            $scope.filterProvince();
            $scope.filterCity();
        }
        $('#modal-edit').modal('show');
    };
    //若id为空，则新增客户地址；否则为更新客户地址
    $scope.save = function () {
        if ($scope.model.id == null) {
            //新增客户地址
            customerService.addAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            //更新客户地址
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除客户地址信息，默认地址不能删除
    $scope.delete = function (data) {
        if (data.is_default == 1) {
            alert("不能删除默认地址信息！");
        } else {
            if (confirm('确定要删除本条地址信息吗？')) {
                customerService.removeAddress(data.id).then(function (data) {
                    $scope.tableParams.reload();
                });
            }
        }
    };

});
hpxAdminApp.controller('appController', function ($rootScope, $scope, $state) {
    $scope.getFirst = function (params) {
        if (params.total() <= (params.page() - 1) * params.count()) {
            return Math.floor(params.total() / params.count()) * params.count() + 1;
        }
        else {
            return (params.page() - 1) * params.count() + 1;
        }
    };

    $scope.tbd = function () {
        alert('此功能正在开发中，敬请期待...');
    };

    //大写的金额
    $scope.amountInWords = function(n) {
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
});

hpxAdminApp.controller('calendarController', function ($rootScope, $scope, $state, uiCalendarConfig, constantsService, toolService) {
    $scope.filter = {
        billTypeId: 101,
        number: 6,
    };

    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    });

    $scope.uiConfig = {
        calendar: {
            editable: true,
            dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            }
        }
    };

    toolService.searchCalendar(new Date().getFullYear(), new Date().getMonth() + 1, $scope.filter.billTypeId, $scope.filter.number).then(function (data) {
        //$scope.events = [];
        for (var i = 0; i < data.length; i++) {
            $scope.events.splice($scope.events, 1);
        }
        for (var i = 0; i < data.length; i++) {
            $scope.events.push({
                id: data[i].id,
                title: data[i].bill_calendar_days + '天' + ' ' + data[i].day_status,
                start: new Date(data[i].day),
                allDay: true
            })
        }
        //$scope.eventSources = [$scope.events];
    });


    $scope.show = function () {
        if ($scope.filter.billTypeId == 102) {
            $scope.filter.number = 6;
        }
        toolService.searchCalendar(new Date().getFullYear(), new Date().getMonth() + 1, $scope.filter.billTypeId, $scope.filter.number).then(function (data) {
            //$scope.events = [];
            for (var i = 0; i < data.length; i++) {
                $scope.events.splice($scope.events,1);
            }
            for (var i = 0; i < data.length; i++) {
                $scope.events.push({
                    id: data[i].id,
                    title: data[i].bill_calendar_days + '天' + ' ' + data[i].day_status,
                    start: new Date(data[i].day),
                    allDay: true
                })
            }
            //$scope.eventSources = [$scope.events];
        });
    }
    


    $scope.events = [];
    $scope.eventSources = [$scope.events];

});

hpxAdminApp.controller('customerAddressController', function ($scope, $rootScope, $state, ngTableParams, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };
    //获取客户对应的所有客户地址
    $scope.tableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getAllCustomerAddress(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新表格
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //若data==null，为新增，弹窗内容为空；否则，为编辑，弹窗为对应id的内容
    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };
    //若id为空，则新增客户地址；否则为更新客户地址
    $scope.save = function () {
        if ($scope.model.id == null) {
            customerService.addAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //删除客户地址信息
    $scope.remove = function (data) {
        if (confirm('确定要删除本条地址信息吗？')) {
            customerService.removeAddress(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
});
hpxAdminApp.controller('customerController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {

    $scope.filter = {
    };
    //默认客户类型为企业客户
    $scope.model = {
        customer_type_code: 301
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.provinceChange();
        $scope.cityChange();
        if (!$scope.model.credential_front_photo_path) {
            $scope.model.credential_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.credential_back_photo_path) {
            $scope.model.credential_back_photo_path = 'assets/img/hpx-15.jpg';
        }
    });
    //获取客户类型
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeData = data;
    })
    //获取交易类型
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCode = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.provinceChange = function () {
        if ($scope.model.enterprise_province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.enterprise_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    //获取对应市的区
    $scope.cityChange = function () {
        if ($scope.model.enterprise_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.enterprise_city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
    }
    //提示信息按钮
    $scope.Reminder = function () {
        $('#modal-license').modal('show');
    }
    //刷新页面信息
    $scope.reflash = function () {
        customerService.getCustomer().then(function (data) {
            $scope.model = data;
        });
    }
    //提交客户信息进行审核
    $scope.save = function () {
        if (!$scope.model.enterprise_name) {
            alert('请输入企业名称！');
            return;
        }

        if (!$scope.model.customer_name) {
            alert('请输入联系人！');
            return;
        }

        if (!$scope.model.credential_front_photo_id) {
            alert('请上传营业执照！');
            return;
        }

        if (confirm("更新客户资料后需经过管理员审核才能开通交易，是否确认提交？")) {
            $scope.model.credential_description = '营业执照';
            customerService.updateCustomer($scope.model).then(function (data) {
                alert('提交成功，请等待管理员审核！');
                window.location.reload();
            });
        }
    };
    //审核通过的信息，点击修改，更改为未审核状态，重新进行客户信息的编辑
    $scope.submit = function () {
        if (confirm("已审核客户修改信息将导致重新审核！是否确认修改？")) {
            $scope.model.credential_description = '营业执照';
            customerService.updateCustomer($scope.model).then(function (data) {
                window.location.reload();
            });
        }
    };

    //获取文件的url
    $scope.getFileURL = function (id) {
        if (id != null) {
            return FILE_URL + '/file' + id;
        }
    }
    //上传文件
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
    //设置证件照片为上传的文件
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.credential_front_photo_id = response.data.data.id;
            $scope.model.credential_front_photo_path = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.credential_back_photo_id = response.data.data.id;
            $scope.model.credential_back_photo_path = response.data.data.file_path;
        })
    };
});
hpxAdminApp.controller('editQuoteController', function ($rootScope, $scope, $timeout, $state, $stateParams, addressService, customerService, ngTableParams, billService, constantsService) {
    //判断是否可进行报价，不行就直接返回
    if ($rootScope.identity.can_publish_offer != 1) {
        alert("您暂时还不能报价！");
        window.history.back();
        return;
    }
    //设置默认的内容
    var emptyEntity = {
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
        'offer_detail': {},
        'bill_style_id': 201,
        'deadline_type_code': 1701,
        'trade_type_id': 1801,
        'trade_background_code': 1601,
        'max_price_type': 0,
    };
    //如果id不为0，获取指定报价信息
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
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
    }
    //获取所有省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取所有市级地址
    $scope.provinceChange = function () {
        if ($scope.model.trade_province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.trade_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取票据类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类型
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //票据属性发生变化时，获取不同的承兑机构
    $scope.billStyleChange = function () {
        constantsService.queryAcceptorTypeforOffer($scope.model.bill_style_id).then(function (data) {
            $scope.acceptorTypeData = data;
            for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
                if ($scope.acceptorTypeData[i].code == 2001) {
                    $scope.acceptorTypeData[i].checked = true;
                }
            }
            $scope.acceptorTypeChange();
        })
    }
    //获取贸易背景
    constantsService.queryConstantsType(16).then(function (data) {
        $scope.tradeBackgroundData = data;
    })
    //获取期限类型
    constantsService.queryConstantsType(17).then(function (data) {
        $scope.deadlineTypeData = data;
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取交易类型
    constantsService.queryConstantsType(18).then(function (data) {
        $scope.tradeType = data;
    })
    //获取勾选的承兑机构
    $scope.acceptorTypeChange = function () {
        $scope.offer_acceptorType = [];
        for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
            if ($scope.acceptorTypeData[i].checked) {
                $scope.offer_acceptorType.push($scope.acceptorTypeData[i]);
            }
        }
        $scope.offer_acceptorType.push($scope.plus);
    }

    $scope.save = function () {
        if ($scope.model.bill_style_id == 201 || $scope.model.bill_style_id == 203 || $scope.model.bill_style_id == 205) {
            if (!$scope.model.trade_location_id) {
                alert("请选择交易地点。");
                return;
            }
        }

        $scope.model.offer_detail = JSON.stringify($scope.model.offer_detail);

        if ($scope.model.id == null) {
            //新增报价
            billService.insertBillOffer($scope.model).then(function (data) {
                alert('新增报价成功！');
                $state.go('app.main.quote');
            });
        }
        else {
            //修改报价
            billService.updateBillOffer($scope.model).then(function (data) {
                alert('修改报价成功！');
                $state.go('app.main.quote');
            });
        }
    };
});
hpxAdminApp.controller('endorsementController', function ($rootScope, $scope, $timeout, $state, FILE_URL, Upload, billService, fileService) {
    //默认显示的图片
    $scope.model = {
        'bill_front_photo_address': 'assets/img/hpx-14.jpg',
        'bill_back_photo_address': 'assets/img/hpx-15.jpg',
    };
    $scope.filter = {};
    //获取文件url
    $scope.getFileURL = function (id) {
        if (id != null) {
            return FILE_URL + '/file' + id;
        }
    }
    //上传文件
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
    //设置图片id，url
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
    //保存上传的图片，并提示上传成功
    $scope.save = function () {
        alert("图片上传成功！");
        location.reload(false);
    };

});

hpxAdminApp.controller('enterpriseAccountController', function ($scope, $rootScope, $state, ngTableParams, customerService, bankService, addressService, constantsService) {
    var emptyEntity = {  };
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取账户类型
    constantsService.queryConstantsType(5).then(function (data) {
        $scope.accountTypeData = data;
    })
    //获取所有的银行账户信息，并显示是否为默认银行账户
    $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getEnterpriseAccount(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                $scope.AccountData = data;
                for (var i = 0; i < $scope.AccountData.length; i++) {
                    if ($scope.AccountData[i].is_default == 1) {
                        $scope.AccountData[i].is_default = "是";
                    } else {
                        $scope.AccountData[i].is_default = null;
                    }
                }
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //设置为默认账户
    $scope.default = function (item) {
        customerService.updateEnterpriseDefault(item).then(function (data) {
            $scope.tableParams.reload();
        });
    }
    //读取对应银行账户的详细信息
    $scope.read = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-read').modal('show');
    };
    //获取对应银行账户的信息，用于修改银行账户信息
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        if ($scope.model.bank_name) {
            $scope.model.keyword = $scope.model.bank_name;
            $scope.BankChange();
        }
        $scope.model.keyword = null;
        $('#modal-add').modal('show');
    };
    //新增银行账户
    $scope.add = function (data) {
        if (data == null) {
            $scope.model = newEntity;
            $scope.model = {
                'account_person': $rootScope.identity.enterprise_name,
            };
            $('#modal-add').modal('show');  // 显示增加银行账号的弹出窗口
        }
    };

    $scope.submit = function () {
        if (!$scope.model.account_person) {
            alert("没有注册企业账户，请先注册企业账户再注册银行账户！");
        } else {
            if ($scope.model.id == null) {
                //新增银行账户信息
                customerService.insertEnterpriseAccount($scope.model).then(function (data) {
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.addForm.$setPristine();
                    $('#modal-add').modal('hide');
                });
            }
            else {
                //更新银行账户信息
                if (!$scope.model.is_default) {
                    $scope.model.is_default = 1;
                } else {
                    $scope.model.is_default = null;
                }
                customerService.updateWnterpriseAccount($scope.model).then(function (data) {
                    $scope.tableParams.reload();
                    angular.copy(emptyEntity, newEntity);
                    $scope.addForm.$setPristine();
                    $('#modal-add').modal('hide');
                });
            }
        }
    };
    //获取所有的银行账户总行信息
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });
    //获取对应省的市级地址
    $scope.ProvinceChange = function () {
        if ($scope.model.bankprovince) {
            return addressService.getCity($scope.model.bankprovince).then(function (data) {
                $scope.BankCityData = data;
                addressService.queryAll().then(function (Pdata) {       //获取所有的地址信息，找到对应的id，把对应的addressname发给银行所在省
                    for (var i = 0; i < Pdata.length; i++) {
                        if ($scope.model.bankprovince == Pdata[i].id) {
                            $scope.model.bank_province = Pdata[i].address_name;
                        };
                    }
                });
            });
        }
    },
    //根据总行，所在市，关键字找到对应的分行数据
    $scope.BankChange = function () {
        if ($scope.filter.HeadBankID || $scope.model.bankcity || $scope.model.keyword) {
            return bankService.getBank($scope.filter.HeadBankID, $scope.model.bankcity, $scope.model.keyword).then(function (data) {
                $scope.branchData = data;
                if ($scope.model.bankprovince) {
                    addressService.getCity($scope.model.bankprovince).then(function (Cdata) {       //获取对应省的地址信息，找到对应的id，把对应的addressname发给银行所在市
                        for (var i = 0; i < Cdata.length; i++) {
                            if ($scope.model.bankcity == Cdata[i].id) {
                                $scope.model.bank_city = Cdata[i].address_name;
                            };
                        }
                    });
                }
            });
        }
    },
    //删除银行账户
    $scope.remove = function (data) {
        if (confirm('确定要删除本银行账户吗？')) {
            customerService.deleteEnterpriseAccount(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };
    //弹出验证窗口
    $scope.verify = function (data) {
        $scope.model = data;
        $('#modal-verify').modal('show');
    };
    //调用后台功能进行自动验证
    $scope.verifySubmit = function () {
        customerService.verify($scope.model.id, $scope.model.verify_string).then(function () {
            alert('验证成功！');
            $scope.tableParams.reload();
            $('#modal-verify').modal('hide');
        });
    };
});
hpxAdminApp.controller('enterpriseController', function ($scope, $rootScope, $timeout, $state, Upload, FILE_URL, ngTableParams, customerService, fileService, addressService, constantsService, bankService) {
    var emptyEntity = { };
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.model2 = {
        'credential_photos': 'assets/img/hpx-14.jpg',
        //'credential_photos': 'assets/img/hpx-15.jpg',
    };
    $scope.filter = {};

    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        $scope.filterProvinceChange();
    });
    $scope.filterProvinceChange = function () {
        if ($scope.filter.ProvinceID == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    }

    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
        $scope.BankChange();
    });
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });
    $scope.ProvinceChange = function () {
        if ($scope.model.bankprovince == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.bankprovince).then(function (data) {
                $scope.BankCityData = data;
                $scope.BankChange();
                addressService.queryAll().then(function (Pdata) {
                    for (var i = 0; i < Pdata.length; i++) {
                        if ($scope.model.bankprovince == Pdata[i].id) {
                            $scope.model.bank_province = Pdata[i].address_name;
                        };
                    }
                });
            });
        }
    },
    $scope.BankChange = function () {
        return bankService.getBank($scope.filter.HeadBankID, $scope.model.bankcity).then(function (data) {
            $scope.branchData = data;
            addressService.queryCity($scope.model.bankprovince).then(function (Cdata) {
                for (var i = 0; i < Cdata.length; i++) {
                    if ($scope.model.bankcity == Cdata[i].id) {
                        $scope.model.bank_city = Cdata[i].address_name;
                    };
                }
            });
        });
    },

    addressService.queryAll().then(function (data) {
        $scope.PData = data;
        $scope.filterProvince();
    });
    $scope.filterProvince = function () {
        if ($scope.model.province_id == null) {
            return;
        }
        else {
            return addressService.queryCity($scope.model.province_id).then(function (data) {
                $scope.CData = data;
            });
        }
        $scope.filterCity();
    },
    $scope.filterCity = function () {
        if ($scope.model.city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.city_id).then(function (data) {
                $scope.DstrictData = data;
            });
        }
    },

    constantsService.queryConstantsType(5).then(function (data) {
        $scope.accountTypeData = data;
    })
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCode = data;
    })
    //$scope.tableParams = new ngTableParams({ sorting: { 'enterprise_address_id': 'asc' } }, {
    //    getData: function (params) {
    //        return customerService.getAllEnterprise(params).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});

    customerService.getAllEnterprise().then(function (data) {
        $scope.model2 = data;
    });
    $scope.save = function () {
        if (!$scope.model2.enterprise_name) {
            alert("请输入企业名称！");
            return;
        }
        if (!$scope.model2.telephone) {
            alert("请输入固定电话！");
            return;
        }
        //if (!$scope.model.fax_number) {
        //    alert("请输入传真号码！");
        //    return;
        //}
        if (!$scope.model2.enterprise_address_id) {
            alert("请选择企业省市地址！");
            return;
        }
        if (!$scope.model2.enterprise_address) {
            alert("请输入企业详细地址！");
            return;
        }
        if (!$scope.model2.credential_number) {
            alert("请输入证件号码！");
            return;
        } 
        if (!$scope.model2.credential_description) {
            alert("请选择证件类型！");
            return;
        } 
        if (!$scope.model2.trade_level_code) {
            alert("请选择交易类型！");
            return;
        }
        if (!$scope.model2.credential_photos) {
            alert("请上传证件照片！");
            return;
        }
        //if ($scope.model.id == null) {
        customerService.insertEnterprise($scope.model2).then(function (data) {
            angular.copy(emptyEntity, newEntity);
            customerService.getAllEnterprise().then(function (data) {
                $scope.model2 = data;
            });
        });
        //}
        //else {
        //    customerService.updateEnterprise($scope.model).then(function (data) {
        //    });
        //}
        if (confirm("保存成功！是否申请管理员审核？？？")) {
            customerService.sendCustomerReview().then(function (data) { });
        };
    };

    $scope.tableParams = new ngTableParams({ 'sorting': { 'enterprise_address_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getEenterpriseAccount(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                $scope.AccountData= data;
            });
        }
    });
    $scope.AddresstableParams = new ngTableParams({ 'sorting': { 'customer_id': 'asc' } }, {
        getData: function (params) {
            return customerService.getAllCustomerAddress(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                $scope.AddressData= data;
            });
        }
    });
    //customerService.insertEenterpriseAccount($scope.model).then(function (data) {
    //    $scope.tableParams.reload();
    //    angular.copy(emptyEntity, newEntity);
    //    $scope.editForm.$setPristine();
    //});

    $scope.read = function (data) {
        $scope.model = angular.copy(data);
        $('#modal-read').modal('show');
    };

    $scope.add = function (data) {
        if (data == null) {
            $scope.model = angular.copy(data);
            $('#modal-add').modal('show');  // 显示增加银行账号的弹出窗口
        }
    };
    $scope.submit = function () {
        if ($scope.model.id == null) {
            customerService.insertEenterpriseAccount($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.addForm.$setPristine();
                $('#modal-add').modal('hide');
            });
        }
    };

    $scope.remove = function (data) {
        if (confirm('确定要删除本银行账户吗？')) {
            customerService.deleteEenterpriseAccount(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    };

    $scope.edit = function (data) {
        if (data == null) {
            $scope.model = newEntity;
        }
        else {
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };
    $scope.sure = function () {
        if ($scope.model.id == null) {
            customerService.addAddress($scope.model).then(function (data) {
                $scope.AddresstableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {
            customerService.updateAddress($scope.model).then(function (data) {
                $scope.AddresstableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    $scope.delete = function (data) {
        if (confirm('确定要删除本条地址信息吗？')) {
            customerService.removeAddress(data.id).then(function (data) {
                $scope.AddresstableParams.reload();
            });
        }
    };


});
hpxAdminApp.controller('footerController', function ($rootScope, $scope, $state) {
     
});

hpxAdminApp.controller('forgetPasswordController', function ($rootScope, $scope, $state, $interval, billService, customerService, constantsService) {
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    $scope.update = function () {
        //重置密码
        customerService.customerPasswordReset($scope.model.phone_number, $scope.model).then(function () {
            alert('重置密码成功！')
        })
    }

    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            alert('请输入正确的手机号码！');
            return;
        }

        customerService.phoneVerify($scope.model.phone_number).then(function () {
            alert('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };
    //跳转到网站首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});

hpxAdminApp.controller('freeController', function ($rootScope, $scope, $state, customerService) {
});

hpxAdminApp.controller('headerController', function ($rootScope, $scope, $state, Restangular, customerService, localStorageService) {
    //退出登录功能，退出后跳转到网站首页
    $scope.logout = function () {
        if (confirm('确认要退出登录吗？')) {
            customerService.customerLogout().then(function () {
                localStorageService.set('customer', null);
                $rootScope.identity = null;
                Restangular.setDefaultHeaders({});
                $state.go('home');
            });
        }
    };

});

hpxAdminApp.controller('homeController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, localStorageService, Restangular, customerService, portalService, orderService, billService, toolService) {
    //��¼�¼�
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //��¼���ܣ���¼�ɹ�����ת����������
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            localStorageService.set('customer', data);

            // TODO
            $rootScope.identity = data;
            Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
            $state.go('app.main.accountInfo');
        });
    };
    //��ȡ������Ϣ
    portalService.lastInformation(2).then(function (data) {
        $scope.news = data;
    });
    //��ȡ�жһ�������
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //��������
    portalService.lastInformation(3).then(function (data) {
        $scope.guides = data;
    });
    //��ת��ע�����
    $scope.tosignup = function () {
        $state.go("app.signup");
    }
    //��ȡ���׶�
    orderService.orderCount().then(function (data) {
        $scope.orderCount = data;
    });
    //��ȡ��ҳ��Ʊ������Ϣ
    billService.billProductElectronic().then(function (data) {
        $scope.billProductElectronic = data.bill_products;
    });
    //��ȡ��ҳֽƱ������Ϣ
    billService.billProductPaper().then(function (data) {
        $scope.billProductPaper = data.bill_products;
    });
    //��ȡ��ҳ����������Ϣ
    billService.billOfferPaper().then(function (data) {
        $scope.billOfferPaper = data.bill_offers;

        for (var i = 0; i < $scope.billOfferPaper.length; i++) {
            try {
                $scope.billOfferPaper[i].offer_detail = JSON.parse($scope.billOfferPaper[i].offer_detail);
            }
            catch (e) {
            }
        }
    });
    //toolService.interestRate().then(function (data) {
    //    $scope.interestRate = data;
    //});

    //toolService.priceTrend().then(function (data) {
    //    $scope.priceTrend = data;
    //}); 


    $scope.showCalculator = function () {
        $('#modal-calculator').modal('show');
    }

    $scope.submitCalculator = function () {
        toolService.calculator($scope.calculatorModel).then(function (data) {
            $scope.calculatorResult = data;
        })
    }

    $scope.showEnterprise = function () {
        $('#modal-enterprise').modal('show');
    }

    $scope.submitEnterprise = function () {
        customerService.enterpriseDetail($scope.enterpriseModel.keyword).then(function (data) {
            $scope.enterpriseResult = data[0];
        })
    }

    $scope.showBank = function () {
        $('#modal-bank').modal('show');
    }

    //��ȡ���е������˻���Ϣ������ʾ�Ƿ�ΪĬ�������˻�
    $scope.tableParams = new ngTableParams({ }, {
        getData: function (params) {
            if ($scope.filter.headBankId || $scope.filter.bankAddressId || $scope.filter.keyword) {
                return bankService.getBank($scope.filter.headBankId, $scope.filter.bankAddressId, $scope.filter.keyword).then(function (data) {
                    return data;
                });
            }
        }
    });
    //ˢ��
    $scope.submitBank = function () {
        $scope.tableParams.reload();
    }

    //��ȡ���е������˻�������Ϣ
    bankService.queryAll().then(function (data) {
        $scope.bankData = data;
    });

    //��ȡ���е�ʡ����ַ
    addressService.queryAll().then(function (data) {
        $scope.ProAddressData = data;
        $scope.ProvinceChange();
    });

    //��ȡ��Ӧʡ���м���ַ
    $scope.ProvinceChange = function () {
        if ($scope.filter.bankprovince) {
            return addressService.getCity($scope.filter.bankprovince).then(function (data) {
                $scope.BankCityData = data;
                addressService.queryAll().then(function (Pdata) {       //��ȡ���еĵ�ַ��Ϣ���ҵ���Ӧ��id���Ѷ�Ӧ��addressname������������ʡ
                    for (var i = 0; i < Pdata.length; i++) {
                        if ($scope.model.bankprovince == Pdata[i].id) {
                            $scope.model.bank_province = Pdata[i].address_name;
                        };
                    }
                });
            });
        }
    }

    $scope.showCalendar = function () {
        $('#modal-calendar').modal('show');
    }
});

hpxAdminApp.controller('imgController', function ($rootScope, $scope, $state, $stateParams) {
    $scope.path = decodeURI($stateParams.path);
});

hpxAdminApp.controller('informationController', function ($rootScope, $scope, $state, $stateParams, $sce, portalService) {
    //��ȡָ��id�ķ�����Ϣ
    portalService.getInformation($stateParams.id).then(function (data) {
        $scope.model = data;
        $scope.detail = $sce.trustAsHtml(data.detail);
    });
});

hpxAdminApp.controller('informationListController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, portalService) {
    //��ȡ������Ϣ����
    portalService.getInformationType($stateParams.type).then(function (data) {
        $scope.typeName = data.information_type_name;
    });
    //��ȡ���з�����Ϣ
    portalService.queryInformation($stateParams.type).then(function (data) {
        $scope.informations = data;
    });
});

hpxAdminApp.controller('loadingController', function ($rootScope, $scope, $state) {
    $(document).scroll(function () {
        $(".loading-modal").css("height", document.body.scrollHeight);
        $(".loader").css("top", document.body.clientHeight * 0.35 + document.body.scrollTop);
    });
});

hpxAdminApp.controller('mainController', function ($rootScope, $scope, $state, $timeout, customerService, localStorageService) {
    customerService.testLogin().then(function (data) {
        $rootScope.identity.can_publish = data.can_publish;
        $rootScope.identity.can_receive = data.can_receive;
        $rootScope.identity.can_bid_paper_bill = data.can_bid_paper_bill;
        $rootScope.identity.can_bid_electronic_bill = data.can_bid_electronic_bill;
        $rootScope.identity.can_sell_paper_bill = data.can_sell_paper_bill;
        $rootScope.identity.can_sell_electronic_bill = data.can_sell_electronic_bill;
        $rootScope.identity.can_see_bill_detail = data.can_see_bill_detail;
        $rootScope.identity.can_publish_offer = data.can_publish_offer;
        $rootScope.identity.can_see_offer_detail = data.can_see_offer_detail;
        $rootScope.identity.is_verified = data.is_verified;

        localStorageService.set('customer', $rootScope.identity);
    })
});

hpxAdminApp.controller('menuController', function ($rootScope, $scope, $state, customerService) {
 
});

hpxAdminApp.controller('modifyPasswordController', function ($rootScope, $scope, $state, billService, customerService, constantsService) {
    $scope.model = {};
    $scope.update = function () {
        //修改密码
        customerService.customerModifyPassword($scope.model).then(function () {
            alert('修改密码成功！')
        })
    }
    //获取验证码
    $scope.getVerify = function () {
        customerService.phoneVerify($scope.model.phone_number).then(function () {
            alert('验证码已发送');
        });
    };
    //跳转到网站首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});

hpxAdminApp.controller('myBiddingController', function ($rootScope, $scope, $state, ngTableParams, billService) {
    $scope.filter = {};
    //获取我的出价信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillBidding(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //$scope.reflash = function () {
    //    $scope.tableParams.reload();
    //}

    //$scope.show = function (data) {
    //    $scope.model = angular.copy(data);
    //};

    //$scope.showBidding = function (item) {
    //    billService.getBillProductBidding(item.id).then(function (data) {
    //        $scope.biddings = data;
    //        $scope.model = item;
    //    });

    //    $('#modal-bidding').modal('show');
    //};

    //$scope.finishBidding = function (item) {
    //    if (confirm('确认选择该收票人进行交易吗？')) {
    //        billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
    //            alert('确认交易方成功！');

    //            $scope.tableParams.reload();
    //            $('#modal-bidding').modal('hide');
    //        });
    //    }
    //};
});

hpxAdminApp.controller('myBillController', function ($rootScope, $scope, $state, FILE_URL, ngTableParams, $timeout, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    $scope.filter = {};
   
    //$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    //    getData: function (params) {
    //        return billService.getOwnBillProduct(params, 1).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});
    //获取我的票据的出价信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillProduct(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }

    //$scope.show = function (data) {
    //    $scope.model = angular.copy(data);
    //};
    //获取对应的票据的出价信息，弹出窗口
    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
        });
        $('#modal-bidding').modal('show');
    };
    //选择交易方，隐藏弹窗
    $scope.finishBidding = function (item) {
        if (confirm('确认选择该收票人进行交易吗？')) {
            billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
                alert('确认交易方成功！');

                $scope.tableParams.reload();
                $('#modal-bidding').modal('hide');
            });
        }
    };
    //删除某条发布
    $scope.remove = function (data) {
        if (confirm('确定要删除该发布吗？')) {
            billService.deleteBill(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    }
    //获取所有的常量类型
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型信息
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类型
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取电票瑕疵类型
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
    })
    //获取纸票瑕疵类型
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
    });
    //获取对应省的市级地址
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        }
        else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    //默认汇票到期日
    $scope.billTypeChange = function () {
        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
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
    //设置传递给后台的图片数据为上传的图片信息
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
        })
    };

    //$scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
    //    getData: function (params) {
    //        return billService.getOwnBillProduct(params, 0).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});
    //编辑信息；获取对应省的市区数据；设置默认显示的图片信息；弹出窗口
    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $scope.provinceChange();

        if (!$scope.model.bill_front_photo_path) {
            $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.bill_back_photo_path) {
            $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        }

        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.bill_type_id) {
            alert("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            alert("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            alert("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                alert("请上传汇票正面");
                return;
            }
        }
        else {
            if (!$scope.model.acceptor_type_id) {
                alert("请选择承兑机构");
                return;
            }

            if (!$scope.model.acceptor_name) {
                alert("请输入承兑人名称");
                return;
            }

            if (!$scope.model.bill_deadline_time) {
                alert("请输入汇票到期日");
                return;
            }

            if (!$scope.model.contact_name) {
                alert("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                alert("请输入联系方式");
                return;
            }
        }
        
        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {     //获取所有勾选的电票的瑕疵
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {     //获取所有勾选的纸票的瑕疵
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        //修改对应的我的发布，刷新列表，隐藏弹窗
        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    }
});

hpxAdminApp.controller('myBillFailController', function ($rootScope, $scope, $state, FILE_URL, ngTableParams, $timeout, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
    })
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
    });
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        }
        else {
            return addressService.queryCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    $scope.billTypeChange = function () {
        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
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
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.bill_front_photo_id = response.data.data.id;
            $scope.model.bill_front_photo_path = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.bill_back_photo_id = response.data.data.id;
            $scope.model.bill_back_photo_path = response.data.data.file_path;
        })
    };

    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillProduct(params, 0).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    $scope.edit = function (data) {
        $scope.model = angular.copy(data);
        $scope.provinceChange();

        if(!$scope.model.bill_front_photo_path) {
            $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.bill_back_photo_path) {
            $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
        }

        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!$scope.model.bill_type_id) {
            alert("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            alert("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            alert("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                alert("请上传汇票正面");
                return;
            }
        }
        else {
            if (!$scope.model.acceptor_type_id) {
                alert("请选择承兑机构");
                return;
            }

            if (!$scope.model.acceptor_name) {
                alert("请输入承兑人名称");
                return;
            }

            if (!$scope.model.bill_deadline_time) {
                alert("请输入汇票到期日");
                return;
            }

            if (!$scope.model.contact_name) {
                alert("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                alert("请输入联系方式");
                return;
            }
        }

        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }

        billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-edit').modal('hide');
        });
    }
});

hpxAdminApp.controller('orderDrawerController', function ($rootScope, $scope, $timeout, $state, FILE_URL, Upload, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取我的出票订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return orderService.getOwnOrderDrawer(params).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
            
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取出票订单对应id的详细信息
    $scope.read = function (item) {
        orderService.getOrder(item.id).then(function (data) {
            $scope.model = data;
        });
    };
});

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

hpxAdminApp.controller('orderReceiverController', function ($rootScope, $scope, $state, API_URL, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};
    //获取我的收票订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return orderService.getOwnOrderReceiver(params).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取收票订单对应id的票据详情
    $scope.read = function (item) {
        orderService.getOrder(item.id).then(function (data) {
            $scope.model = data;
        });
    };
});

hpxAdminApp.controller('orderReceiverInfoController', function ($rootScope, $scope, $timeout, $state, $stateParams, API_URL, ngTableParams, orderService, customerService, payingService, constantsService) {

    //获取收票订单详情
    init = function () {
        orderService.getOrder($stateParams.id).then(function (data) {
            $scope.model = data;
            $timeout(function () {
                $('.jqzoom').imagezoom();
            });
        });
    }
    init();
    //图片放大镜功能
    if ($stateParams.id) {
        $('.jqzoom').imagezoom();
    }
    //获取背书账号
    customerService.getAllEnterpriseAccount(502).then(function (data) {
        $scope.accounts = data;
        $scope.addressModel = {};
        $scope.addressModel.receiver_account_id = data[0].id;
    })
    //获取支付方式类型信息
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.orderPayTypeData = data;
    })

    //获取企业对应的收货地址信息
    customerService.getAllCustomerAddress().then(function (data) {
        $scope.addresses = data;
    })
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
    //弹出付款窗口
    $scope.showPay = function () {
        $('#modal-address').modal('show');
    };
    //支付票据款
    $scope.pay = function () {
        if (confirm('确定要支付票据款吗？')) {
            orderService.updateOrderReceiver($scope.model.id, $scope.addressModel).then(function () {
                window.open(API_URL + '/orders/orderPay/' + $scope.model.id.toString() + '?orderPayTypeId=' + $scope.addressModel.order_pay_type_id.toString());
                $('#modal-address').modal('hide');
            });
        }
    };
    //签收背书
    $scope.confirm = function () {
        if (confirm('确认签收背书并完成交易吗？')) {
            orderService.orderConfirm($scope.model.id).then(function () {
                alert('背书签收完成！');

                init();
                $('#modal-edit').modal('hide');
            });
        }
    };
});

hpxAdminApp.controller('orderWaitController', function ($rootScope, $scope, $stateParams, $state, ngTableParams, billService, constantsService, orderService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
    };
    //获取支付方式类型
    constantsService.queryConstantsType(12).then(function (data) {
        $scope.payTypes = data;
    })

   //获取账户所有的待确认订单
    $scope.tableParams = new ngTableParams({ 'sorting': { 'id': 'desc' } }, {
        getData: function (params) {
            return billService.getOrderWait(params).then(function (data) {
               // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //获取对应id的待确认交易的票据详情，弹出窗口
    $scope.edit = function (item) {
        $scope.model = item;

        $('#modal-edit').modal('show');
        $('.jqzoom').imagezoom();
    };

    //$scope.showFront = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    //}
    //$scope.showBack = function () {
    //    window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    //}
    //选择支付方式，确认交易
    $scope.confirm = function () {
        if (!$scope.model.order_pay_type_id) {
            alert("请选择支付方式！")
        }
        else if (confirm('确认该交易吗？')) {
            billService.confirmOrderWait($scope.model.id, { 'is_confirm': 1, 'order_pay_type_id': $scope.model.order_pay_type_id }).then(function (data) {
                alert('确认交易成功！');

                $scope.tableParams.reload();
                $('#modal-edit').modal('hide');
                $('#modal-appraisal').modal('show');
            });
        }
    };
    //提交评价
    $scope.submit = function () {
        if (confirm('确认提交该评价吗？')) {
            orderService.orderAppraisal($scope.model.id, { 'appraisal_message': $scope.model.appraisal_message }).then(function (data) {
                alert('确认评价成功！');

                $scope.tableParams.reload();
                $('#modal-appraisal').modal('hide');
            });
        }
    };
    //拒绝交易
    $scope.reject = function () {
        if (confirm('拒绝该交易吗？')) {
            billService.confirmOrderWait($scope.model.id, { 'is_confirm': 0 }).then(function (data) {
                alert('拒绝交易成功！');

                $scope.tableParams.reload();
                $('#modal-edit').modal('hide');
            });
        }
    };
});

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

hpxAdminApp.controller('portalSuggestionController', function ($scope, $rootScope, $state, ngTableParams, portalSuggestionService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        suggestionTypeId: "1",  //投诉
        handleStatusCode: "0"   //未查看
    };

    

    //获取所有的投诉与建议
    $scope.tableParams = new ngTableParams({'sorting': { 'id': 'asc' } }, {
        getData: function (params) {
            return portalSuggestionService.query(params, $scope.filter.suggestionTypeId, $scope.filter.handleStatusCode, $scope.filter.keyword).then(function (data) {
                if (data != null) {
                    $scope.first = $scope.getFirst(params);
                    return data;
                }
                //else $scope.tableParams.reload();
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    
    $scope.edit = function (data) {
        if (data == null) {     //弹出新增窗口
            $scope.model = newEntity;
        }
        else {      //弹出修改窗口
            $scope.model = angular.copy(data);
        }
        $('#modal-edit').modal('show');
    };
    //获取对应id的投诉建议内容
    $scope.read = function (data) {
       // var id = data.id;
        $scope.model = angular.copy(data);
        $('#modal-read').modal('show');
    };

    $scope.save = function () {
        if ($scope.model.id == null) {      //新增投诉建议
            portalSuggestionService.add($scope.model).then(function (data) {
                $scope.tableParams.reload();
                angular.copy(emptyEntity, newEntity);
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
        else {      //修改投诉建议
            portalSuggestionService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };
    //处理投诉信息
    $scope.deal = function () {
        portalSuggestionService.update($scope.model, $scope.modell).then(function (data) {
            $scope.tableParams.reload();
            $scope.editForm.$setPristine();
            $('#modal-read').modal('hide');
        });
        
    };




});

hpxAdminApp.controller('publishController', function ($rootScope, $scope, $timeout, $stateParams, $state, FILE_URL, Upload, billService, addressService, customerService, constantsService, bankService, fileService) {
    $scope.model = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
        'endorsement_number': 0,
        'contact_name': $rootScope.identity.customer_name,
        'contact_phone': $rootScope.identity.phone_number,
    };
    //获取全部汇票类型
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取票据属性类型
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取客户信息中的省市地址信息
    if (!$stateParams.id) {
        customerService.getCustomer().then(function (data) {
            $scope.model.product_province_id = data.enterprise_province_id;
            addressService.getCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
            $scope.model.product_location_id = data.enterprise_city_id;
        });
    }
    
    //获取我的发布详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            $timeout(function () {
                if (!$scope.model.bill_front_photo_path) {
                    $scope.model.bill_front_photo_path = 'assets/img/hpx-14.jpg';
                }
                if (!$scope.model.bill_back_photo_path) {
                    $scope.model.bill_back_photo_path = 'assets/img/hpx-15.jpg';
                }
            });
            //$('.jqzoom').imagezoom();
        });
    }
    
    //获取电票瑕疵类型
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
        for (var i = 0; i < $scope.billFlawData.length; i++) {
            if ($scope.billFlawData[i].code == 1500) {
                $scope.billFlawData[i].checked = true;
                break;
            }
        }
    })
    //获取纸票瑕疵类型
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
        for (var i = 0; i < $scope.billFlawData2.length; i++) {
            if ($scope.billFlawData2[i].code == 1500) {
                $scope.billFlawData2[i].checked = true;
                break;
            }
        }
    })
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取全部省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取各省市下面的市区
    $scope.provinceChange = function () {
        if (!$scope.model.product_province_id) {
            $scope.cityData = [];
        }
        else {
            return addressService.getCity($scope.model.product_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }
    }
    //在不同交易类型下，循环获取汇票瑕疵的多选结果
    $scope.tradeTypeChange = function () {
        if ($scope.model.trade_type_code == 701) {
            if ($scope.model.bill_type_id == 101) {
                for (var i = 0; i < $scope.billFlawData.length; i++) {
                    if ($scope.billFlawData[i].code == 1500) {
                        $scope.billFlawData[i].checked = true;
                    }
                }
            }
            else {
                for (var i = 0; i < $scope.billFlawData2.length; i++) {
                    if ($scope.billFlawData2[i].code == 1500) {
                        $scope.billFlawData2[i].checked = true;
                    }
                }
            }          
        }       
    }
    //电票，当选中无瑕疵时，其他选项均为false；反之，选中其他选项时，无瑕疵选项为false
    $scope.billFlawChange = function (item) {
        if (item.code == 1500) {
            item.checked = true;
            for (var i = 1; i < $scope.billFlawData.length; i++) {
                $scope.billFlawData[i].checked = false;
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if (i == 0) {
                    $scope.billFlawData[i].checked = true;
                }
                else {
                    if ($scope.billFlawData[i].checked) {
                        $scope.billFlawData[0].checked = false;
                    }
                }
            }
        }
    }
    //纸票，当选中无瑕疵时，其他选项均为false；反之，选中其他选项时，无瑕疵选项为false
    $scope.billFlawChange2 = function (item) {
        if (item.code == 1500) {
            item.checked = true;
            for (var i = 1; i < $scope.billFlawData2.length; i++) {
                $scope.billFlawData2[i].checked = false;
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if (i == 0) {
                    $scope.billFlawData2[i].checked = true;
                }
                else {
                    if ($scope.billFlawData2[i].checked) {
                        $scope.billFlawData2[0].checked = false;
                    }
                }
            }
        }
    }
    //点击汇票到期日，默认选中的时间
    $scope.billTypeChange = function () {
        if ($scope.model.bill_type_id == 101) {
            $scope.model.bill_deadline_time = new Date().setYear(new Date().getFullYear() + 1);
        }
        else {
            $scope.model.bill_deadline_time = new Date().setMonth(new Date().getMonth() + 6);
        }
    }
    //图片上传功能
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
    //上传图片后，点击图片跳转页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    //上传图片后，点击图片跳转页面，放大图片
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }



    $scope.save = function () {
        //校验，提示信息
        if (!$scope.model.bill_type_id) {
            alert("请选择票据类型");
            return;
        }

        if (!$scope.model.trade_type_code) {
            alert("请选择交易方式");
            return;
        }

        if (!$scope.model.bill_sum_price) {
            alert("请输入票面金额");
            return;
        }

        if ($scope.model.trade_type_code == 701) {
            if (!$scope.model.bill_front_photo_id) {
                alert("请上传汇票正面");
                return;
            }
        }
        else {
            if (!$scope.model.acceptor_type_id) {
                alert("请选择承兑机构");
                return;
            }

            if (!$scope.model.acceptor_name) {
                alert("请输入付款行全称");
                return;
            }

            if (!$scope.model.bill_deadline_time) {
                alert("请输入汇票到期日");
                return;
            }

            if (!$scope.model.contact_name) {
                alert("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                alert("请输入联系方式");
                return;
            }
        }

        $scope.model.bill_flaw_ids = [];
        $scope.model.bill_type_id = parseInt($scope.model.bill_type_id);
        $scope.model.trade_type_code = parseInt($scope.model.trade_type_code);
         
        if ($scope.model.bill_type_id == 101) {
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        if (confirm('确定要发布汇票吗？')) {
            if (!$scope.model.id) {
                //发布汇票信息
                billService.insertBillProduct($scope.model).then(function (data) {
                    alert('发布成功，等待后台审核（30分钟以内）。');
                    $state.go("app.main.myBill");
                });
            } else {
                //修改汇票信息
                billService.updateBillProduct($scope.model.id, $scope.model).then(function (data) {
                    alert('修改成功，等待后台审核（30分钟以内）。');
                    $state.go("app.main.myBill");
                });
            }
        }
    }
});

hpxAdminApp.controller('queryBillController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {
        //billTypeAll: true,
        billStyleAll: true,
        acceptorTypeAll: true,
        billCharacterAll: true,
        billStatusAll: true,
        tradeTypeCode: '',
        billTypeID: '',
        billStatusCode: '800,801,802,803,804,805,806,807,808,809,810,811,812',
        billCharacterCode: ''
    };

    if ($stateParams.type == 101) {
        $scope.filter.billTypeID = 101;
    } else if ($stateParams.type == 102) {
        $scope.filter.billTypeID = 102;
    } else {
        $scope.filter.billTypeAll = true;
    }

 //获取票据类型
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
        $scope.billTypeData.unshift({ 'code': '', 'constant_name': '全部' });
        if ($stateParams.type) {
            $scope.filter.billTypeAll = false;
            for (var i = 0; i < $scope.billTypeData.length; i++) {
                if ($scope.billTypeData[i].code == $stateParams.type) {
                    $scope.billTypeData[i].checked = true;
                }
            }
            $scope.tableParams.reload();
        }
    });
    //获取承兑机构类型
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    });
    //承兑机构全选
    $scope.acceptorTypeChangeAll = function () {
        for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
            if($scope.filter.acceptorTypeAll) {
                $scope.acceptorTypeData[i].checked = false;

            }
        }
    };
    //选中某个选项时，‘全部’为不勾选状态
    $scope.acceptorTypeChange = function () {
        for (var i = 0; i < $scope.acceptorTypeData.length; i++) {
            if ($scope.acceptorTypeData[i].checked)
                $scope.filter.acceptorTypeAll = false;
        }
    };

    //获取汇票特点类型
    constantsService.queryConstantsType(14).then(function (data) {
        $scope.billCharacterData = data;
        $scope.billCharacterData.unshift({ 'code': '', 'constant_name': '全部' });
    });
    //获取交易方式类型
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeData = data;
        $scope.tradeTypeData.unshift({ 'code': '', 'constant_name': '全部' });
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
        $scope.filterProvinceChange();
    });
    //获取对应的省下所有的市级地址
    $scope.filterProvinceChange = function () {
        if ($scope.filter.ProvinceID == null) {
            return;
        }
        else {
            return addressService.getCity($scope.filter.ProvinceID).then(function (data) {
                $scope.CityData = data;
            });
        }
    }
    
    $scope.tableParams = new ngTableParams({ 'sorting': { 'publishing_time ': 'desc' } }, {
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

            //查看票据
            return billService.searchBillProduct(params, 1, $scope.filter.billTypeID, $scope.filter.billStyleID, $scope.filter.billStatusCode, $scope.filter.acceptorTypeID, $scope.filter.CityID, $scope.filter.tradeTypeCode, $scope.filter.billCharacterCode, $scope.filter.billFlawID).then(function (data) {
                // $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //如果id不等于0，获取对应id的票据详情
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
        });
    }
    //提示信息
    $scope.Reminder = function () {
        alert('大票是指汇票面额大于100万的电票、纸票。\n足月是指从对该银行承兑汇票进行电查或者实查当日起计算到该汇票票面到期日之间的天数，到期日为周末或者法定节假日顺延，另外在加上异地在途3日，算头不算尾，所计算出来的天数>180天，即为足月！');
    }
    //显示详细信息
    $scope.show = function (data) {
        $scope.model = angular.copy(data);
    };
    //获取对应id的票据的出价记录信息
    $scope.showBidding = function (item) {
        billService.getBillProductBidding(item.id).then(function (data) {
            $scope.biddings = data;
            $scope.model = item;
            $('#modal-bidding').modal('show');
        });
    };
    //弹出出价记录窗口
    $scope.showAddBidding = function (item) {
        $scope.biddingModel = {
            bill_product_id: $scope.model.id
        };
        $('#modal-addBidding').modal('show');
    };
    //撤销报价功能
    $scope.cancelBidding = function (item) {
        if (confirm('确定要撤销报价吗？')) {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            });
        }
    };
    //我要出价功能
    $scope.addBidding = function () {
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            alert('出价成功！');
            //获取出价记录详情
            billService.getBillProductBidding($scope.model.id).then(function (data) {
                $scope.biddings = data;
                $('#modal-addBidding').modal('hide');
            });
        });
    };
});

hpxAdminApp.controller('queryOfferController', function ($rootScope, $scope, $stateParams, $state, $filter ,ngTableParams, billService, addressService, constantsService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    $scope.filter = {
        'billStyleId': 201,      //默认选中银纸大票
    };
    //获取票据类型数据
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    });

    $scope.tableParams = new ngTableParams({ 'sorting': { 'offer_time': 'desc' } }, {
        getData: function (params) {
            var newdate = new Date();
            $scope.filter.publishingTimeS = $filter('date')(newdate, 'yyyy-MM-dd');     //设置时间为当前日期
            $scope.filter.publishingTimeB = $filter('date')(newdate, 'yyyy-MM-dd');
            //获取当前日期的报价信息
            return billService.searchBillOffer(params, $scope.filter.func, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId, $scope.filter.enterpriseName).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    try {
                        data[i].offer_detail = JSON.parse(data[i].offer_detail);
                    }
                    catch (e) {
                    }
                }
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };
});

hpxAdminApp.controller('quoteController', function ($rootScope, $scope, $timeout, $state, addressService, customerService, ngTableParams, billService, constantsService) {
    //判断是否可以报价
    if ($rootScope.identity.can_publish_offer != 1) {
        alert("您暂时还不能报价！");
        window.history.back();
        return;
    }

    $scope.filter = { };
    //获取所有我的报价信息
    $scope.tableParams = new ngTableParams({ 'sorting': { 'offer_time ': 'desc' } }, {
        getData: function (params) {
            return billService.getOwnBillOffer(params, $scope.filter.billTypeId, $scope.filter.billStyleId, $scope.filter.maxPrice, $scope.filter.tradeLocationId, $scope.filter.keyword).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    try {
                        data[i].offer_detail = JSON.parse(data[i].offer_detail);
                    }
                    catch (e) {
                    }
                }
                
                return data;
            });
        }
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    };
    //删除报价
    $scope.remove = function (data) {
        if (confirm('确定要删除该报价吗？')) {
            billService.deleteBillOffer(data.id).then(function (data) {
                $scope.tableParams.reload();
            });
        }
    }
    
    $scope.edit = function (data) {
        if (data == null) {         //跳转至新建报价
            $state.go('app.main.editQuote');
        }
        else {      //跳转到报价详细信息
            $state.go('app.main.editQuote', { 'id': data.id });
        }
    };
});
hpxAdminApp.controller('readBillController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService, orderService) {
    $scope.filter = {
        'bill_front_photo_path': 'assets/img/hpx-14.jpg',
        'bill_back_photo_path': 'assets/img/hpx-15.jpg',
    };

    //根据id获取对应的票据详细信息
    if ($stateParams.id) {
        billService.getBillProduct($stateParams.id).then(function (data) {
            $scope.model = data;
            $('.jqzoom').imagezoom();

            //根据条件判断，成立则获取出价记录
            if ($stateParams.id && $rootScope.identity && ($rootScope.identity.can_see_bill_detail == 1 || $scope.model.publisher_id == $rootScope.identity.customer_id)) {
                billService.getBillProductBidding($stateParams.id).then(function (data) {
                    $scope.biddings = data;
                });
            }
        });
    }

    //$scope.showAddBidding = function (item) {
    //    $scope.biddingModel = {
    //        bill_product_id: $scope.model.id,
    //        bill_type_id: $scope.model.bill_type_id,
    //    };
    //    $('#modal-addBidding').modal('show');
    //};

    //选择交易方
    $scope.finishBidding = function (item) {
        if (confirm('确认选择该收票人进行交易吗？')) {
            billService.newOrderBidding({ 'bill_product_id': $scope.model.id, 'bill_product_bidding_id': item.id }).then(function (data) {
                alert('确认交易方成功！');
                billService.getBillProduct($stateParams.id).then(function (data) {
                    $scope.model = data;
                    $('.jqzoom').imagezoom();

                    billService.getBillProductBidding($stateParams.id).then(function (data) {
                        $scope.biddings = data;
                    });
                });
            });
        }
    };

    //撤销报价
    $scope.cancelBidding = function (item) {
        if (confirm('确定要撤销报价吗？')) {
            billService.deleteBillBidding(item.id).then(function () {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            });
        }
    };
    //新增报价信息
    $scope.addBidding = function () {
        billService.insertBillBidding($scope.biddingModel).then(function (data) {
            alert('出价成功！');
            $('#modal-addBidding').modal('hide');
            //if ($scope.model.id && identity && (identity.can_see_bill_detail == 1 || model.publisher_id == identity.customer_id)) {
                billService.getBillProductBidding($scope.model.id).then(function (data) {
                    $scope.biddings = data;
                });
            //}
        });
    };

    $scope.showAddBidding = function (item) {
        $scope.biddingModel = {
            bill_product_id: $scope.model.id
        };
        $('#modal-addBidding').modal('show');
    };
});

hpxAdminApp.controller('readOfferController', function ($rootScope, $scope, $state, $stateParams, ngTableParams, addressService, billService, constantsService) {
    //����id��ȡ������ϸ��Ϣ
    if ($stateParams.id) {
        billService.getBillOffer($stateParams.id).then(function (data) {
            $scope.model = data;
            try {
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
            catch (e) {
            }
        });
    }
});

hpxAdminApp.controller('readOrderController', function ($rootScope, $stateParams, $scope, $state, API_URL, ngTableParams, orderService, customerService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = {};

    if ($stateParams.id != 0) {
        orderService.getOrder($stateParams.id).then(function (data) {
            $scope.model = data;
        });
    };

});

hpxAdminApp.controller('rechargeController', function ($scope, $rootScope, $state, API_URL, ngTableParams, payingService) {
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);

    $scope.filter = { };
    //获取账户充值记录
    $scope.tableParams = new ngTableParams({ 'sorting': { 'change_time': 'desc' } }, {
        getData: function (params) {
            return payingService.platformAccountBalance(params).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //获取账户余额
    payingService.GetPlatformAccount().then(function (data) {
        $scope.model= data;
    });
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }
    //弹出充值窗口
    $scope.recharge = function () {
        $scope.model = newEntity;
        $('#modal-edit').modal('show');
    };
    //打开一个新页面，进行充值活动
    $scope.submit = function () {
        window.open(API_URL + '/paying/recharge?rechargePrice=' + $scope.model.recharge_price + '&customerId=' + $rootScope.identity.customer_id);
        $('#modal-edit').modal('hide');
    };
});
hpxAdminApp.controller('signupController', function ($rootScope, $scope, $state, $interval, billService, customerService,constantsService) {  
    $scope.model = {};
    $scope.verifyStr = "获取验证码";
    $scope.disableVerify = false;
    //获取客户的类型
    constantsService.queryConstantsType(3).then(function (data) {
        $scope.customerTypeCcode = data;
    })
    //获取交易方式的类型
    constantsService.queryConstantsType(11).then(function (data) {
        $scope.tradeLevelCcode = data;
    })

    var second = 90;
    //发送验证码
    $scope.getVerify = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            alert('请输入正确的手机号码！');
            return;
        }

        customerService.phoneVerify($scope.model.phone_number).then(function () {
            alert('验证码已发送');
            $scope.second = 90;
            $scope.disableVerify = true;

            $interval(function () {
                $scope.verifyStr = $scope.second + "秒后可重新获取";
                $scope.second--;

                if ($scope.second == 0) {
                    $scope.verifyStr = "重新获取验证码";
                    $scope.disableVerify = false;
                }
            }, 1000, 90);
        })
    };

    $scope.signup = function () {
        if (!$scope.model.phone_number || $scope.model.phone_number.length != 11) {
            alert('请输入手机号码！');
            return;
        }

        if (!$scope.model.password || $scope.model.password.length == 0) {
            alert('请输入密码！');
            return;
        }

        if ($scope.model.password != $scope.model.password2) {
            alert("两次密码输入不一致！");
            return;
        }

        if (!$scope.model.phone_verify_code || $scope.model.phone_verify_code.length == 0) {
            alert('请输入验证码！');
            return;
        }
        //注册功能
        customerService.customerReg($scope.model).then(function (data) {
            alert("注册成功!");
            $scope.loginRequest = {
                username: $scope.model.phone_number,
                password: $scope.model.password
            }
            //新建账户信息
            customerService.customerLogin($scope.loginRequest).then(function (data) {
                localStorageService.set('customer', data);

                $rootScope.identity = data;
                Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + data.token });
                $state.go('app.main.accountInfo');      //跳转到个人中心
            });
            $state.go("home");          //跳转到首页
        });
    }
    //注册成功跳转到首页
    $scope.tosignon = function () {
        $state.go("home");
    }
});
