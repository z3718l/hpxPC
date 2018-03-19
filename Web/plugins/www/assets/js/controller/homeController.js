hpxAdminApp.controller('homeController', function ($rootScope, $scope, $state, ngTableParams, addressService, constantsService, bankService, $cookieStore, Restangular, customerService, portalService, orderService, billService, toolService) {
    //��¼�¼�
    $scope.login = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode != 13 && keycode != 0 && keycode != 1 && keycode != undefined) {
            return;
        }
        //��¼���ܣ���¼�ɹ�����ת����������
        $scope.loginRequest.enterprise_id = 29
        customerService.customerLogin($scope.loginRequest).then(function (data) {
            $cookieStore.put('customer', data);

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

    $scope.showCalendar = function () {
        $('#modal-calendar').modal('show');
    }

    $scope.submitCalendar = function () {

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
