hpxAdminApp.controller('autonymAuthenticationController', function ($scope, $rootScope, $state, Upload, FILE_URL, $timeout, ngTableParams, customerService, fileService, addressService, constantsService, bankService, payingService) {
    $scope.filter = {
        isModified: 1,
        enterprise_proxy_agree: false,
        enterprise_check: 1,
        agent_check: 1,
        choiceenterprise: 1, 
    };
    var emptyEntity = {};
    var newEntity = angular.copy(emptyEntity, newEntity);
    // 默认图片
    $scope.model = {
        
    };
    //获取自己的注册资料；调用provinceChange获取市，调用cityChange获取区；设置默认显示的证件图片
    customerService.getCustomer().then(function (data) {
        $scope.model = data;
        $scope.customerProvince();
        if ($scope.model.trade_location_province_id != 1 || $scope.model.trade_location_province_id != 20 || $scope.model.trade_location_province_id != 860 || $scope.model.trade_location_province_id != 2462) {
            $scope.customerCityChange();
        }
        if (!$scope.model.id_front_photo_address) {
            $scope.model.id_front_photo_address = 'assets/img/hpx-14.jpg';
        }
        if (!$scope.model.id_back_photo_address) {
            $scope.model.id_back_photo_address = 'assets/img/hpx-15.jpg';
        }
        // 通过SingleEnterprise接口查询客户信息
        if ($rootScope.identity.customer_id && $scope.model.is_verified != 0) {
            customerService.SingleEnterprise($rootScope.identity.customer_id).then(function (data) {
                $scope.singleEnterprise = data;
                $scope.enterpriseModel = data;
                if ($scope.singleEnterprise.enterprise_id == "" || $scope.singleEnterprise.enterprise_id == 0) {
                    $scope.enterpriseModel = {};
                } else {
                    if ($scope.enterpriseModel.location_province_id != 1 || $scope.enterpriseModel.location_province_id != 20 || $scope.enterpriseModel.location_province_id != 860 || $scope.enterpriseModel.location_province_id != 2462) {
                        if (($scope.model.id != 0 && $scope.singleEnterprise.enterprise_id == 0 && model.is_verified != 0) || ($scope.enterpriseModel.is_alive == -1 && $scope.filter.enterprise_check == -1)) {
                            $scope.cityChange();
                        }
                    }
                }
                if (!$scope.enterpriseModel.credential_photo_address) {
                    $scope.enterpriseModel.credential_photo_address = 'assets/img/hpx-14.png';
                }
                if (!$scope.enterpriseModel.artificial_person_front_photo_address) {
                    $scope.enterpriseModel.artificial_person_front_photo_address = 'assets/img/hpx-15.png';
                }
                if (!$scope.enterpriseModel.artificial_person_back_photo_address) {
                    $scope.enterpriseModel.artificial_person_back_photo_address = 'assets/img/hpx-16.png';
                }
                //获取对应省的市
                $scope.provinceChange = function () {
                    if ($scope.enterpriseModel.location_province_id == null) {
                        return;
                    } else if ($scope.enterpriseModel.location_province_id == 1 || $scope.enterpriseModel.location_province_id == 20 || $scope.enterpriseModel.location_province_id == 860 || $scope.enterpriseModel.location_province_id == 2462) {
                        $scope.filter.tradeProvinceId = $scope.enterpriseModel.location_province_id + 1;
                        $scope.filter.isModified == 0;
                        $scope.CityData = null;
                        return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                            $scope.AddressData = data;
                        });
                    } else {
                        $scope.filter.isModified == 1;
                        $scope.AddressData = null;
                        return addressService.queryCity($scope.enterpriseModel.location_province_id).then(function (data) {
                            $scope.CityData = data;
                        });
                    }
                };
                //获取对应市的区
                $scope.cityChange = function () {
                    if ($scope.enterpriseModel.location_city_id == null) {
                        return;
                    }
                    else {
                        return addressService.queryDstrict($scope.enterpriseModel.location_city_id).then(function (data) {
                            $scope.AddressData = data;
                        });
                    }
                }
                if ($scope.singleEnterprise.enterprise_id != 0 && ($scope.singleEnterprise.enterprise_id != null || $scope.enterpriseModel.is_verified != 0)) {
                    // 根据企业id查询经办人信息
                    payingService.getAgentTreasurer($scope.singleEnterprise.enterprise_id).then(function (agentData) {
                        if (agentData) {
                            $scope.agentModel = agentData;
                            if ($scope.agentModel.enterprise_proxy_agree == "Y") {
                                $scope.filter.enterprise_proxy_agree = true;
                            }
                            if ($scope.agentModel.authorization_cert_agree == "Y") {
                                $scope.filter.authorization_cert_agree = true;
                            }
                            $scope.accountModel = {};          // 如果有经办人信息，给账户一个初始值
                        } else {
                            $scope.agentModel = {}
                        }
                        if (!$scope.agentModel.agent_treasurer_cert_photo_front_address) {
                            $scope.agentModel.agent_treasurer_cert_photo_front_address = 'assets/img/hpx-15.png';
                        }
                        if (!$scope.agentModel.agent_treasurer_cert_photo_back_address) {
                            $scope.agentModel.agent_treasurer_cert_photo_back_address = 'assets/img/hpx-16.png';
                        }
                    });
                    // 根据企业信息查询银行卡信息
                    payingService.getAccount($scope.singleEnterprise.enterprise_id).then(function (accountData) {
                        if (accountData) {
                            $scope.AccountData = accountData.acct_list;
                        } else {
                            $scope.AccountData = ""
                        }
                    })
                }
            })
        }
    });
    //获取所有的省级地址
    addressService.queryAll().then(function (data) {
        $scope.ProvinceData = data;
    });
    //获取对应省的市
    $scope.customerProvince = function () {
        if ($scope.model.trade_location_province_id == null) {
            return;
        } else if ($scope.model.trade_location_province_id == 1 || $scope.model.trade_location_province_id == 20 || $scope.model.trade_location_province_id == 860 || $scope.model.trade_location_province_id == 2462) {
            $scope.filter.tradeProvinceId = $scope.model.trade_location_province_id + 1;
            $scope.filter.isModified == 0;
            //document.getElementById("tradCity").style.display = "none";
            $scope.CityData = null;
            return addressService.queryDstrict($scope.filter.tradeProvinceId).then(function (data) {
                $scope.AddressData = data;
            });
        } else {
            $scope.filter.isModified == 1;
            //document.getElementById("tradCity").style.display = "block";
            $scope.AddressData = null;
            return addressService.queryCity($scope.model.trade_location_province_id).then(function (data) {
                $scope.CityData = data;
            });
        }
    };
    //获取对应市的区
    $scope.customerCityChange = function () {
        if ($scope.model.trade_location_city_id == null) {
            return;
        }
        else {
            return addressService.queryDstrict($scope.model.trade_location_city_id).then(function (data) {
                $scope.AddressData = data;
            });
        }
    }
    //刷新页面信息
    $scope.reflash = function () {
        customerService.getCustomer().then(function (data) {
            $scope.model = data;
        });
    }
    //提交客户信息进行审核
    $scope.save = function () {
        if (!$scope.model.customer_name) {
            swal('请输入联系人！');
            document.querySelector("body").css({ "overflow": "visible" });
            return;
        }
        if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test($scope.model.id_number) || !$scope.model.id_number) {
            swal('请输入正确的身份证号码！');
            return;
        }
        else {
            customerService.updateCustomer($scope.model).then(function () {
                swal({ 'title': '联系人信息保存成功，请完善企业信息！！！' }, function () {
                    //$state.go("app.main.enterpriseInfo");
                    // 出现企业完善的信息
                    window.location.reload();
                    //$scope.filter.currentPage = 2;

                })
            })
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
    //设置证件照片为上传的文件
    $scope.setFrontID = function (response) {
        $timeout(function () {
            $scope.model.id_front_photo_id = response.data.data.id;
            $scope.model.id_front_photo_address = response.data.data.file_path;
        })
    };
    $scope.setBackID = function (response) {
        $timeout(function () {
            $scope.model.id_back_photo_id = response.data.data.id;
            $scope.model.id_back_photo_address = response.data.data.file_path;
        })
    };
    // 准备资料
    $scope.ycimg = function () {
        var accordion = document.getElementById("fileaccordion");
        var trans = document.getElementById("trans")
        if (accordion.className == "accordionhide") {
            accordion.className = "accordionshow";
        } else {
            accordion.className = "accordionhide";
        }
        if (trans.className == "rote") {
            trans.className = "rotes";
        } else {
            trans.className = "rote";
        }
    }

    // 机构认证
    $scope.enterpriseModel = {}
    if ($scope.model.is_verified != 0) {
        $scope.setCredentialID = function (response) {
            $timeout(function () {
                $scope.enterpriseModel.credential_photo_id = response.data.data.id;
                $scope.enterpriseModel.credential_photo_address = response.data.data.file_path;
            })
        };
        $scope.legalFrontID = function (response) {
            $timeout(function () {
                $scope.enterpriseModel.artificial_person_front_photo_id = response.data.data.id;
                $scope.enterpriseModel.artificial_person_front_photo_address = response.data.data.file_path;
            })
        };
        $scope.legalBackID = function (response) {
            $timeout(function () {
                $scope.enterpriseModel.artificial_person_back_photo_id = response.data.data.id;
                $scope.enterpriseModel.artificial_person_back_photo_address = response.data.data.file_path;
            })
        };
    }
    // 保存企业信息
    $scope.enterpriseSave = function () {
        if (!$scope.enterpriseModel.enterprise_name) {
            swal("请输入企业名称！");
            return;
        }
        if (!$scope.enterpriseModel.credential_number) {
            swal("请输入营业执照号！");
            return;
        }
        if (!$scope.enterpriseModel.credential_photo_id) {
            swal("请上传营业执照！");
            return;
        }
        if (!$scope.enterpriseModel.artificial_person_front_photo_id || !$scope.enterpriseModel.artificial_person_back_photo_id) {
            swal("请上传法人代表身份证！");
            return;
        }
        if (_.isEqual($scope.enterpriseModel, newEntity)) {
            swal('请确认更改之后再次提交！');
            return;
        }
        $scope.enterpriseModel.enterprise_address_id = $scope.enterpriseModel.location_id;
        if ($scope.enterpriseModel.enterprise_id == null || $scope.enterpriseModel.enterprise_id == 0) {
            customerService.insertEnterprise($scope.enterpriseModel).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    $scope.enterpriseModel = data;
                    swal({ 'title': '保存成功，请继续完成经办人绑定！' }, function () {
                        window.location.reload();
                    });
                });
            });
        } else {
            customerService.postEnterprise($scope.enterpriseModel.enterprise_id, $scope.enterpriseModel).then(function (data) {
                customerService.getAllEnterprise().then(function (data) {
                    swal({ 'title': '保存成功，请等待管理员审核！' }, function () {
                        window.location.reload();
                    });
                });
            });
        }
    };
    
    // 企业审核失败
    //$scope.enterpriseCheck = function () {
    //    $scope.filter.enterprise_check = -1;
    //}
    // 经办人审核失败
    //$scope.agentCheck = function () {
    //    $scope.filter.agent_check = -1;
    //}
    // 业务授权
    // 获取当前时间
    var todayDate = new Date();
    $scope.newYear = todayDate.getFullYear();
    $scope.newMonth = (todayDate.getMonth() + 1) < 10 ? '0' + (todayDate.getMonth() + 1) : (todayDate.getMonth() + 1);
    $scope.newToday = todayDate.getDate() < 10 ? '0' + todayDate.getDate() : todayDate.getDate();
    // 签订企业授权书弹窗
    $scope.EnAuthorizationModel = function () {
        if (!$scope.agentModel.agent_treasurer_name) {
            swal({
                'title': '请填写经办人姓名！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal({
                'title': '请填写经办人手机号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal({
                'title': '请填写经办人身份证号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal({
                'title': '身份证信息有误，请核实信息！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.enterprise_proxy_agree = false;
                }, 100);
            })
            return;
        }
        $('#modal-EnAuthorization').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    // 签订企业授权书
    $scope.EnAuthorizationAgent = function () {
        $scope.filter.enterprise_proxy_agree = true;
        $scope.agentModel.enterprise_proxy_agree = "Y";
    }
    $scope.EnAuthorizationClose = function () {
        $scope.filter.enterprise_proxy_agree = false;
    }
    // 签订业务授权书弹窗
    $scope.BusAuthorizationModel = function () {
        if (!$scope.agentModel.agent_treasurer_name) {
            swal({
                'title': '请填写经办人姓名！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal({
                'title': '请填写经办人手机号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal({
                'title': '请填写经办人身份证号！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal({
                'title': '身份证信息有误，请核实信息！',
                confirmButtonText: "OK",
            }, function () {
                $timeout(function () {
                    $scope.filter.authorization_cert_agree = false;
                }, 100);
            })
            return;
        }
        $('#modal-BusAuthorization').modal({
            backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
            keyboard: false,//键盘关闭对话框
            show: true//弹出对话框
        })
    }
    $scope.BusAuthorizationAgent = function () {
        $scope.filter.authorization_cert_agree = true;
        $scope.agentModel.authorization_cert_agree = "Y";
    }
    $scope.BusAuthorizationClose = function () {
        $scope.filter.authorization_cert_agree = false;
    }
    // 上传经办人身份证
    $scope.setAgentFrontID = function (response) {
        $timeout(function () {
            $scope.agentModel.agent_treasurer_cert_photo_front_id = response.data.data.id;
            $scope.agentModel.agent_treasurer_cert_photo_front_address = response.data.data.file_path;

        })
    };
    $scope.setAgentBackID = function (response) {
        $timeout(function () {
            $scope.agentModel.agent_treasurer_cert_photo_back_id = response.data.data.id;
            $scope.agentModel.agent_treasurer_cert_photo_back_address = response.data.data.file_path;
        })
    };
    // 提交保存经办人
    $scope.saveAgent = function () {
        if (!$scope.agentModel.agent_treasurer_name) {
            swal("请填写经办人姓名！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_phone) {
            swal("请填写经办人手机号！");
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_no) {
            swal("请填写经办人身份证号码！");
            return;
        }
        if ($scope.agentModel.agent_treasurer_cert_no.length > 18) {
            swal("身份证信息有误。请核实信息！！！")
            return;
        }
        if (!$scope.agentModel.agent_treasurer_cert_photo_front_id || !$scope.agentModel.agent_treasurer_cert_photo_back_id) {
            swal("请上传身份证！");
            return;
        }
        if (!$scope.agentModel.isChecked) {
            payingService.postAgentTreasurer2($scope.singleEnterprise.enterprise_id, $scope.agentModel).then(function (data) {
                swal({ 'title': '经办人保存成功，等待管理员审核。\n 请进行账户绑定！' }, function () {
                    //$state.go("app.main.enterpriseAccountInfo")
                    window.location.reload();
                })
            });
        }
        //else {
        //    payingService.updateAgentTreasurer($scope.singleEnterprise.enterprise_id, $scope.agentModel).then(function (data) {
        //        swal("保存成功，请等待管理员审核！");
        //        //$state.go("app.main.enterpriseAccountInfo")
        //    });
        //}
    }

    // 账户绑定
    $scope.filter = {
        isView: false
    }
    // 根据支行行号查询银行名称
    $scope.findNumber = function () {
        if ($scope.accountModel.cnaps_code) {
            if ($scope.accountModel.cnaps_code.length == 12) {
                bankService.getBanks($scope.accountModel.cnaps_code).then(function (data) {
                    if (data.bank_branch_name) {
                        $scope.bankModel = data.bank_branch_name;
                    } else {
                        $scope.filter.isView = true;
                    }
                })
            }
        } else if (!$scope.accountModel.cnaps_code || $scope.accountModel.cnaps_code.length == 0) {
            $scope.filter.isView = false;
        }

    }
    $scope.saveAccount = function () {
        $scope.accountModel.account_type_code = "501";
        payingService.saveAccount($scope.accountModel).then(function (data) {
            swal({ 'title': '账户提交成功。\n 请等待鉴权！' }, function () {
                //window.location.reload();
                $state.go("app.main.accountStatus");
            })
        })
    }
    // 显示个人信息
    //$scope.infoModel = function () {
    //    $('#modal-info').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    // 机构详情
    //$scope.enterDetail = function () {
    //    $('#modal-enterprise').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    // 业务授权详情
    //$scope.authorizaDetail = function () {
    //    $('#modal-busAuthoriza').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    // 鉴权
    //$scope.authentication = function () {
    //    // 企业或者业务授权没有成功，无法进行鉴权
    //    if ($scope.enterpriseModel.is_verified == 2) {
    //        swal("企业正在审核，请联系客服人员！");
    //        return;
    //    }
    //    if ($scope.enterpriseModel.is_verified == -1) {
    //        swal("企业审核失败，请联系客服人员！");
    //        return;
    //    }
    //    if ($scope.agentModel.isChecked == 0) {
    //        swal("业务授权正在审核，请联系客服人员！");
    //        return;
    //    }
    //    if ($scope.agentModel.isChecked == -1) {
    //        swal("业务授权审核失败，请联系客服人员！");
    //        return;
    //    }
    //    $('#modal-authentication').modal({
    //        backdrop: "static",//点击空白处不关闭对话框  如果直接是false 则背景没有灰色透明
    //        keyboard: false,//键盘关闭对话框
    //        show: true//弹出对话框
    //    })
    //}
    //$scope.smallValid = function () {

    //    payingService.checkAccount($scope.model.enterpriseId, $scope.model.verify_string, $scope.model.is_default, $scope.model.account_type_code).then(function (data) {
    //        swal({
    //            "title": "小额验证通过。",
    //            confirmButtonText: "OK",
    //        }, function () {
    //            window.location.reload();
    //        })
    //    });
    //}
});