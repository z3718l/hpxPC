hpxAdminApp.controller('checkBillController', function (exportService,$rootScope, $interval, $scope, $stateParams, $state, API_URL, NgTableParams, billService, constantsService, addressService,EXPORT_URL) {
    console.log($scope)
    console.log($rootScope)
    $scope.filter = {
        checkedType: '0'     //默认未审核
    };
    //获取所有的常量类型数据
    constantsService.queryAll().then(function (data) {
        $scope.contantData = data;
    })
    //获取承兑机构类型信息
    constantsService.queryConstantsType(4).then(function (data) {
        $scope.acceptorTypeData = data;
    })
    //获取票据类型信息
    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    })
    //获取汇票属性信息
    constantsService.queryConstantsType(2).then(function (data) {
        $scope.billStyleData = data;
    })
    //获取电票汇票瑕疵信息
    constantsService.queryConstantsType(19).then(function (data) {
        $scope.billFlawData = data;
        var model = $stateParams.data;
        if(model != null){
            check(model.bill);
            $stateParams.model = null;
        }
    })
    //获取纸票汇票瑕疵信息
    constantsService.queryConstantsType(15).then(function (data) {
        $scope.billFlawData2 = data;
    })
    //获取交易方式类型信息
    constantsService.queryConstantsType(7).then(function (data) {
        $scope.tradeTypeCode = data;
    })
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.provinceData = data;
        $scope.provinceChange();
    });
    //获取对应省的所有市级地址
    $scope.provinceChange = function () {
        if (!$scope.model.product_location_province_id) {
            $scope.cityData = [];
        } else if ($scope.model.product_location_province_id == 1 || $scope.model.product_location_province_id == 20 || $scope.model.product_location_province_id == 860 || $scope.model.product_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.product_location_province_id + 1;
            return addressService.queryCity($scope.filter.tradeProvinceId).then(function (data) {
                $scope.cityData = data;
            });
        } else {
            return addressService.queryCity($scope.model.product_location_province_id).then(function (data) {
                $scope.cityData = data;
            });
        }

        //if (!$scope.model.product_location_province_id) {
        //    $scope.cityData = [];
        //}
        //else {
        //    return addressService.queryCity($scope.model.product_location_province_id).then(function (data) {
        //        $scope.cityData = data;
        //    });
        //}
    }

    //获取所有未审核或者已审核的票据资料信息
    $scope.tableParams = new NgTableParams({'sorting': {'publishing_time': 'desc'}}, {
        getData: function (params) {

            var checkedType = [];
            if (document.getElementById("unchecked").checked)
                checkedType.push(document.getElementById("unchecked").value);
            else if (document.getElementById("checked").checked)
                checkedType.push(document.getElementById("checked").value);
            $scope.filter.checkedType = checkedType;

            return billService.getAllBillUnchecked(params, $scope.filter).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });
    //跳转到新页面，放大图片
    $scope.showFront = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_front_photo_path);
    }
    $scope.showBack = function () {
        window.open('index.html#/img?path=' + $scope.model.bill_back_photo_path);
    }
    //刷新
    $scope.reflash = function () {
        $scope.tableParams.reload();
    }


    var timer = $interval($scope.reflash, 60 * 1000);
    $scope.$on(
        "$destroy",
        function (event) {
            $interval.cancel(timer);
        }
    );

    $scope.isSelectBillFlaw =function(id,ids){
        return ids.indexOf(id)>=0;
    }

    var check = $scope.check = function (item) {
        $scope.model = item;         //获取某条客户资料详细信息
        $scope.provinceChange();        //获取对应省的市级地址

        //弹出审核窗口
        $('#modal-check').modal('show');
        $('.jqzoom').imagezoom();       //图片放大功能
    };


    $scope.handWriting = function (model, type, imgUrl) {
        $('#modal-check').modal('hide');
   /*     var url = $state.href('handwriting');
        window.open(url + '?type=' + type + '&billid=' + model.id, '_blank');
*/

        var data = {
            model:model,
            type:type
        }
        $state.go('handwriting',{data:data});
    }

    $scope.resd = function (item) {
        $scope.model = item;         //获取某条客户资料详细信息
        $scope.provinceChange();        //获取对应省的市级地址
        //获取电票或纸票的票据瑕疵
        for (var i = 0; i < $scope.billFlawData.length; i++) {
            $scope.billFlawData[i].checked = false;
        }

        for (var i = 0; i < $scope.model.bill_flaw_ids.length; i++) {
            for (var j = 0; j < $scope.billFlawData.length; j++) {
                if ($scope.model.bill_flaw_ids[i] == $scope.billFlawData[j].code) {
                    $scope.billFlawData[j].checked = true;
                }
            }
        }
        //弹出详细窗口

        $('#modal-read').modal('show');
        $('.jqzoom').imagezoom();       //图片放大功能
    };

    $scope.pass = function () {
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
        } else {
            if (!$scope.model.acceptor_type_id) {
                alert("请选择承兑方类型");
                return;
            }

           /* if (!$scope.model.acceptor_name) {
                alert("请输入承兑方名称");
                return;
            }
*/
           /* if (!$scope.model.bill_deadline_time) {
                alert("请输入汇票到期日");
                return;
            }*/

            if (!$scope.model.contact_name) {
                alert("请输入联系人");
                return;
            }

            if (!$scope.model.contact_phone) {
                alert("请输入联系方式");
                return;
            }
        }

        if (confirm('确认通过吗？')) {
            $scope.model.is_real = 1;
            save();
        }
    };
    $scope.reject = function () {
        if (!$scope.model.check_description || $scope.model.check_description.length == 0) {
            alert('请填写不通过原因！');
            return;
        }

        if (confirm('确认不通过吗？')) {
            $scope.model.is_real = 0;
            save();
        }
    };

    save = function () {
        $scope.model.bill_flaw_ids = [];
        if ($scope.model.bill_type_id == 101) {     //电票瑕疵信息
            for (var i = 0; i < $scope.billFlawData.length; i++) {
                if ($scope.billFlawData[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData[i].code);
                }
            }
        }
        else {
            for (var i = 0; i < $scope.billFlawData2.length; i++) {     //纸票瑕疵信息
                if ($scope.billFlawData2[i].checked) {
                    $scope.model.bill_flaw_ids.push($scope.billFlawData2[i].code);
                }
            }
        }
        $scope.model.bill_id = $scope.model.id;
        //审核票据，并推送审核结果给后台
        billService.checkBill($scope.model).then(function (data) {
            $scope.tableParams.reload();
            $scope.checkForm.$setPristine();
            $('#modal-check').modal('hide');
        });
    };
    //导出表格
    $scope.exportExcel = function () {
        var resource_url = EXPORT_URL+"/bills/billCheck?n=65535&orderBy=-publishing_time&p=1";
        var sheet_name = "票据审核表";

        //根据条件生成url
        /*switch ($scope.filter.billTypeId){
            case '101':
                sheet_name += "_电票";
                resource_url += "&billTypeId=101";
                break;
            case '102':
                sheet_name += "_纸票";
                resource_url += "&billTypeId=102";
                break;
        }
        switch ($scope.filter.tradeTypeCode){
            case '701':
                sheet_name += "_现票卖断";
                resource_url += "&tradeTypeCode=701";
                break;
            case '702':
                sheet_name += "_预约出票";
                resource_url += "&tradeTypeCode=702";
                break;
        }
        switch ($scope.filter.checkedType){
            case '0':
                sheet_name += "_未审核";
                resource_url += "&checkedType=0";
                break;
            case '1':
                sheet_name += "_已审核";
                resource_url += "&checkedType=1";
                break;
        }*/

        var excelRequest =   {
            "resource_url":resource_url,
            "resource_name":"bills",
            "sheet_name":sheet_name,
            "label_names":["汇票类型","交易方式","票面金额","汇票到期日","联系人","联系电话","发布时间","审核状态"],
            "label_types":["String","String","Decimal","Date","String","String","Time","String"],
            "label_keys":["bill_type_name","trade_type_name","bill_sum_price","bill_deadline_time","contact_name","contact_phone","publishing_time","checked_name"]
        };
        var token = '';
        if ($rootScope.identity != undefined) {
            token = $rootScope.identity.token;
        }
        exportService.exportExcel('export',token,excelRequest).then(function (result) {
            var newWin = window.open('loading page');
            newWin.location.href = result.data.data;
        })
    }

});
