hpxAdminApp.factory('addressService', ['Restangular', function (Restangular) {
    var res = Restangular.all('otherconstants');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('addressNext', {});
        },

        queryCity: function (Provinceid) {
            return res.all('addressNext').one(Provinceid.toString()).get({ 'onlyCity': 0 });
        },
        getCity: function(Provinceid){
            return res.all('addressNext').one(Provinceid.toString()).get();
        },

        queryDstrict: function (Cityid) {
            return res.all('addressNext').one(Cityid.toString()).get();
        },

        //query: function (params, parent_address_id) {
        //    var queryParam = {
        //        'parentAddressId': parent_address_id,
        //        'addressCode': address_code,
        //        'keyword': keyword,
        //        'p': params.page(),
        //        'n': params.count(),
        //        'orderBy': params.orderBy()
        //    }

        //    return res.get('address', queryParam).then(function (result) {
        //        params.total(result.page_info.items_number);
        //        return result.addresses;
        //    });
        //}
    };
}]);
hpxAdminApp.factory('agentService', ['Restangular', function (Restangular) {
    var res = Restangular.all('paying');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('xingyeapi/getAgentTreasurer', {});
        },
        query: function (params, filter) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'isChecked': filter.checkedType,
            }
            return res.get('xingyeapi/getAgentTreasurer', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.accounts;
            });
        },

        //getUnverifiedAccount: function (id) {
        //    return res.all('xingyeapi').one('getAgentTreasurer').all(id.toString()).get();
        //},
        //checkAccount: function (id, model) {
        //    return res.all('xingyeapi').one('getAgentTreasurer').all(id.toString()).customPUT(model);
        //},
        //ReviewEnterPriseAccount: function (id, data) {
        //    return res.one('xingyeapi').one('getAgentTreasurer').customPUT(data, id, { 'func': 'auto' });
        //},

        queryAllCustomersUnverified: function (params, isChecked) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'isChecked': isChecked,
            }
            return res.get('xingyeapi/getAgentTreasurer', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result;
            });
        },
        //getCustomerUnverified: function (id) {
        //    return res.all('customerReview').one(id.toString()).get();
        //},
        checkCustomerReview: function (enterprise_id, model) {
            return res.all('xingyeapi/checkAgentTreasurer').one(enterprise_id.toString()).customPOST(model);
        },
        //checkCustomerReview: function (enterprise_id, model) {
        //    console.log(enterprise_id)
        //    console.log(model)
        //    return res.customPOST(model, 'xingyeapi/checkAgentTreasurer', { 'isChecked': 1 });
        //},
        //updateCustomer: function (model) {
        //    return res.one('customer').customPUT(model);
        //},
        //remove: function (id) {
        //    return res.all('customer').customDELETE(id);
        //},
    }
}]);
hpxAdminApp.factory('appraisalTempletService',['Restangular',function (Restangular) {
    var res = Restangular.all('otherconstants');

    return{
        query :function(params,star){
            var queryParams = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'star':star
            };
            return res.get('appraisalTemplet', queryParams).then(function (result) {
                params.total(result.page_info.items_number);
                return result.appraisal_templets;
            });
        },
        add: function (model) {
            return res.all('appraisalTemplet').post(model);
        },
        update: function (model) {
            return res.one('appraisalTemplet', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.all('appraisalTemplet').customDELETE(id);
        }
    };
}]);
hpxAdminApp.factory('bankService', ['Restangular', function (Restangular) {
    var res = Restangular.all('banks');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('bankNext', {});
        },

        query: function (params, head_bank_id, bank_address_id, keyword) {
            var queryParam = {
                'headBankId': head_bank_id,
                'bankAddressId': bank_address_id,
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('bank', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.banks;
            });
        },

        getBank: function (head_bank_id, bank_address_id, keyword, params) {
            if (!params) {
                return res.get('bank', { 'headBankId': head_bank_id, 'bankAddressId': bank_address_id, 'keyword': keyword }).then(function (data) {
                    return data.banks;
                });
            } else {
                return res.get('bank', { 'headBankId': head_bank_id, 'bankAddressId': bank_address_id, 'keyword': keyword, 'p': params.page(), 'n': params.count() }).then(function (data) {
                    params.total(data.page_info.items_number);
                    return data.banks;
                });

            }
            return res.get('bank', { 'headBankId': head_bank_id, 'bankAddressId': bank_address_id, 'keyword': keyword, 'p': params.page(), 'n': params.count()}).then(function (data) {
                if(param)
                return data.banks;
            });
        },

        getSpecificBank:function(bankId){
            return res.all('bank').one(bankId.toString()).get()
        },

        //findSpecificBank: function (bankId) {
        //    return res.get('bank', { "find": bankId });
        //},

        findSpecificBank: function (bankId, params) {
            var queryParam = {
                'find': bankId,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('bank', queryParam).then(function (result) {
                params.total(1);
                return result;
            });
        },

        add: function (model) {
            return res.all('bankNext').post(model);
        },
        update: function (model) {
            return res.one('bankNext', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.all('bankNext').customDELETE(id);
        },
        getBanks: function (bankId) {
            return res.all('bank').one('getCnapsInfo').one(bankId.toString()).get()
        },
    }
}]);
hpxAdminApp.factory('cacheService', ['$cacheFactory', function ($cacheFactory) {
    return {
        ID: function (cacheId) {
            var cacheId = arguments[0] ? arguments[0] : 'default';
            return $cacheFactory(cacheId);
        },
    }
}]);
hpxAdminApp.factory('billService', ['Restangular', function (Restangular) {
    var res = Restangular.all('bills');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        searchBillProduct: function (params, billTypeId, billStyleId, billStatusCode, acceptorTypeId, locationId, tradeTypeCode, billCharacterCode, billFlawId) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                //'isAlive': isAlive,
                'billTypeId': billTypeId,
                'billStyleId': billStyleId,
                'billStatusCode': billStatusCode,
                'acceptorTypeId': acceptorTypeId,
                'locationId': locationId,
                'tradeTypeCode': tradeTypeCode,
                'billCharacterCode': billCharacterCode,
                'billFlawId': billFlawId
            }

            return res.get('billProduct', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_products;
            });
        },
        searchBillOffer: function (params, search, publishingTimeS, publishingTimeB, billStyleId, enterpriseName, tradeLocationId) {
            var queryParam = {
                'func': 'search',
                'billStyleId': billStyleId,
                'enterpriseName': enterpriseName,
                'publishingTimeS': publishingTimeS,
                'publishingTimeB': publishingTimeB,
                'tradeLocationId': tradeLocationId,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
            }

            return res.get('billOffer', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_offers;
            });
        },
        getOwnBillOffer: function (params, billStyleId, enterpriseName, tradeLocationId) {
            var queryParam = {
                'billStyleId': billStyleId,
                'enterpriseName': enterpriseName,
                'tradeLocationId': tradeLocationId,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
            }

            return res.get('billOffer', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_offers;
            });
        },
        getBillOffer: function (billOfferId) {
            return res.all('billOffer').one(billOfferId.toString()).get();
        },
        insertBillProduct: function (model) {
            return res.all('bill').post(model);
        },
        updateBillHpx: function (billProductId, model) {
            return res.all('bill').one(billProductId.toString() + '?doComplete=' + 1).customPUT(model);
        },
        findBillHpx: function (billProductId) {
            return res.all('bill').one(billProductId.toString()).get();
        },
        getOwnBillProduct: function (params, billTypeId, isAlive, billStatusCode) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'isAlive': isAlive,
                'billTypeId': billTypeId,
                'billStatusCode': billStatusCode,
            }

            return res.get('bill', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_products;
            });
        },
        newOrderBidding: function (model) {
            return res.all('order').post(model);
        },
        generateOrders: function (model) {
            return res.all('order').one('ahead').customPOST(model)
        },
        getOwnBillBidding: function (params, billTypeId, status) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'billTypeId': billTypeId,
                'status': status,
            }

            return res.get('bidding', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_product_biddings;
            });
        },
        getOwnBidding: function () {
            return res.get('bidding', {}).then(function (result) {
                return result.bill_product_biddings;
            });
        },

        getOrderWait: function (params) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
            }

            return res.get('orderWait', queryParam).then(function (result) {
                return result.bill_confirms;
            });
        },
        confirmOrderWait: function (orderConfirmId, model) {
            return res.all('orderWait').one(orderConfirmId.toString()).customPUT(model);
        },
        getBillProduct: function (billProductId) {
            return res.all('bill').one(billProductId.toString()).get();
        },
        getBillProductBidding: function (billProductId) {
            return res.all('bidding').one(billProductId.toString()).get();
        },
        insertBillBidding: function (model) {
            return res.all('bidding').post(model);
        },
        deleteBillBidding: function (id) {
            return res.all('bidding').one(id.toString()).customDELETE();
        },
        getAllOwnBillOffer: function (params, billTypeId, billStyleId, maxPrice, tradeLocationId,keyword) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'keyword':keyword,
                'orderBy': params.orderBy(),
                'billTypeId': billTypeId,
                'billStyleId': billStyleId,
                'tradeLocationId': tradeLocationId,
                'maxPrice':maxPrice
            }

            return res.get('billOffer', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_offers;
            });
        },
        updateOwnBillOffer: function (model) {
            return res.one('billOffer', model.id).customPUT(model);
        },
        queryOfferData: function () {
            return res.get('billOffer', {}).then(function (result) {
                return result.bill_offer_rates;
            });
        },
        insertBillOffer: function (model) {
            return res.all('billOffer').post(model);
        },
        updateBillOffer: function (model) {
            return res.one('billOffer', model.id).customPUT(model);
        },
        deleteBillOffer: function (billOfferId) {
            return res.all('billOffer').customDELETE(billOfferId);
        },
        billProductElectronic: function () {
            var queryParam = {
                'billTypeId': 101,
                'func': 'home'
            }

            return res.get('billProduct', queryParam);
        },
        billProductPaper: function () {
            var queryParam = {
                'billTypeId': 102,
                'func': 'home'
            }

            return res.get('billProduct', queryParam);
        },
        billOfferPaper: function () {
            var queryParam = {
                'func': 'home'
            }

            return res.get('billOffer', queryParam);
        },

        updateBillProduct: function (billProductId, model) {
            return res.all('bill').one(billProductId.toString()).customPUT(model);
        },
        deleteBill: function (billId) {
            return res.all('bill').customDELETE(billId);
        },
        //deleteBill: function (billProductId) {
        //    return res.all('bill').customDELETE(billProductId);
        //},

        getBillsNumber: function (billTypeId) {
            return res.get('number', { 'billTypeId': billTypeId });
        },

        finishBillNew: function (billProductId) {
            return res.all('billFinish').one(billProductId.toString()).get();
        },
        insertEnterpriseId: function (billId, enterpriseId) {
            return res.all('bill').one('insertEnterpriseId' + '?billId=' + billId + '&enterpriseId=' + enterpriseId).get();
        }
       
    }
}]);


hpxAdminApp.factory('commissionService', ['Restangular', function (Restangular) {
    var res = Restangular.all('customers');

    return {
        get: function (id) {
            return res.one(id).get();
        },
        query: function (params,enterpriseName) {
            var queryParam = {
                'enterpriseName':enterpriseName,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            };
            return res.get('enterpriseCommission', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.enterprise_commissions;
            });
        },
        update: function (model) {
            return res.one('enterpriseCommission', model.id).customPUT(model);
        }
    }
}]);

hpxAdminApp.factory('constantsService', ['Restangular', function (Restangular) {
    var res = Restangular.all('mainconstants');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('constant', {});
        },
        queryConstantsType: function (constant_type_id) {
            return res.get('constant', { 'constantTypeId': constant_type_id}).then(function (result) {
                return result.constants;
            });
        },
        queryAcceptorTypeforOffer: function (billStyleId) {
            return res.get('constant', { 'constantTypeId': 20, 'billStyleId': billStyleId }).then(function (result) {
                return result.constants;
            });
        },
        query: function (params, constant_type_id, keyword) {
            var queryParam = {
                'constantTypeId': constant_type_id,
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('constant', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.constants;
            });
        },
    }
}]);
hpxAdminApp.factory('constantsTypeService', ['Restangular', function (Restangular) {
    var res = Restangular.all('mainconstants');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('constantType', {});
        },
        queryByConstantTypeID: function (constant_type_id) {
            return res.get('constantType', { 'constant_type_id': constant_type_id }).then(function (result) {
                return result.constant_types;
            });
        },
        query: function (params, keyword) {
            var queryParam = {
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('constantType', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.constant_types;
            });
        },

        add: function (model) {
            return res.all('constantType').post(model);
        },
        update: function (model) {
            return res.one('constantType', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.all('constantType').customDELETE(id);
        },
    }
}]);
hpxAdminApp.factory('customerLevelService', ['Restangular', function (Restangular) {
    var res = Restangular.all('mainconstants');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('customerLevel', {});
        },
        query: function (params, keyword) {
            var queryParam = {
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('customerLevel', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.customer_levels;
            });
        },
        add: function (model) {
            return res.all('customerLevel').post(model);
        },
        update: function (model) {
            return res.one('customerLevel', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.all('customerLevel').customDELETE(id);
        },
    }
}]);
hpxAdminApp.factory('customerService', ['Restangular', '$interval', '$rootScope', '$state', '$cookieStore', function (Restangular, $interval, $rootScope, $state, $cookieStore) {
    var res = Restangular.all('customers');
    return {
        testLogin: function () {
            return res.get('testLogin', {});
        },
        customerLogin: function (model) {
            return res.all('customerLogin').post(model);
        },
        customerLoginEnterprise: function (model) {
            return res.all('customerLoginEnterprise').post(model);
        },

        //退出登录功能，退出后跳转到网站首页
        logout: function () {
            res.all('customerLogout').post().then(function () {
                $cookieStore.put('customer', null);
                $rootScope.identity = null;
                Restangular.setDefaultHeaders({});
                window.location.href = '/index.aspx';
            });
        },
        //发送验证码,抽象
        getVerify: function (phone, model, verifyStr, disableVerifyStr) {
            if (model[disableVerifyStr])
                return;
            if (!phone || phone.length != 11) {
                swal('请输入正确的手机号码！');
                return;
            }

            res.all('phoneVerify').one(phone.toString()).get().then(function () {
                swal('验证码已发送');
                model[verifyStr + 'Second'] = 90;
                model[disableVerifyStr] = true;

                $interval(function () {
                    model[verifyStr] = model[verifyStr + 'Second'] + "秒后可重新获取";
                    model[verifyStr + 'Second']--;

                    if (model[verifyStr + 'Second'] <= 0) {
                        model[verifyStr] = "重新获取验证码";
                        model[disableVerifyStr] = false;
                    }
                }, 1000, 90);
            })
        },
        customerLogout: function () {
            return res.all('customerLogout').post();
        },
        phoneVerify: function (phone) {
            return res.all('phoneVerify').one(phone.toString()).get();
        },
        customerPhone: function (data) {
            return res.one('customerPhone').customPUT(data);
        },
        customerReg: function (model) {
            return res.all('customerReg').post(model);
        },
        customerPasswordReset: function (phone, model) {
            return res.customPUT(model, 'customerPasswordReset', { 'phone': phone, 'r': 2 });
        },
        customerPasswordResets: function (phone, model) {
            return res.customPUT(model, 'customerPasswordReset', { 'phone': phone, 'r': 1 });
        },
        customerModifyPassword: function (model) {
            return res.one('customerPassword').customPUT(model);
        },

        getAllCustomerAddress: function () {
            return res.get('customerAddress', {});
        },
        getCustomerAddress: function (customerAddressId) {
            return res.all('customerAddress').one(customerAddressId.toString()).get();
        },
        addAddress: function (model) {
            return res.all('customerAddress').post(model);
        },
        updateAddress: function (model) {
            return res.one('customerAddress', model.id).customPUT(model);
        },
        updateAddressDefault: function (data) {
            return res.one('customerAddress').customPUT({}, data.id, { 'func': 'default' });
        },

        removeAddress: function (id) {
            return res.all('customerAddress').customDELETE(id);
        },
        getAllEnterpriseAccount: function (accountTypeCode) {
            return res.get('enterpriseAccount', { 'accountTypeCode': accountTypeCode });
        },
        getEnterpriseAccount: function (accountId) {
            return res.all('enterpriseAccount').one(accountId.toString()).get();
        },
        getAllEnterprise: function () {
            return res.get('enterprise', {});
        },
        getEnterprise: function (enterpriseId) {
            return res.all('enterprise').one(enterpriseId.toString()).get();
        },
        insertEnterprise: function (model) {
            return res.all('enterprise').post(model);
        },
        /*在前台进行企业修改*/
        postEnterprise: function (enterpriseId, model) {
            return res.all('enterprise').all(enterpriseId.toString()).post(model);
        },

        updateEnterprise: function (model) {
            return res.one('enterprise').customPUT(model);
        },
        deleteEnterprise: function (enterpriseId) {
            return res.all('enterprise').customDELETE(enterpriseId);
        },
        updateEnterpriseDefault: function (data) {
            return res.one('enterpriseAccount').customPUT({}, data.id, { 'func': 'default' });
        },

        updateEnterpriseCredential: function (model) {
            return res.one('enterpriseCredential', model.id).customPUT(model);
        },

        sendCustomerReview: function () {
            return res.one('customerReview').post();
        },

        getEnterpriseMember: function () {
            return res.get('enterpriseMember', {});
        },
        insertEnterpriseMember: function (model) {
            return res.all('enterpriseMember').post(model);
        },
        deleteEnterpriseMember: function (operater) {
            console.log(operater)
            return res.all('enterpriseMember').customDELETE(operater.remove_phone_number, { 'code': operater.operator_phone_number_code });
        },
        insertEnterpriseAccount: function (model) {
            return res.all('enterpriseAccount').post(model);
        },
        updateWnterpriseAccount: function (model) {
            return res.all('enterpriseAccount').one(model.id.toString()).customPUT(model);
        },
        deleteEnterpriseAccount: function (enterpriseId) {
            return res.all('enterpriseAccount').customDELETE(enterpriseId);
        },

        getCustomer: function () {
            return res.get('customer', {});
        },
        updateCustomer: function (model) {
            return res.one('customer').customPUT(model);
        },
        verify: function (id, verify_string) {
            return res.one('enterpriseAccountCheck', id.toString()).customPUT({ 'verify_string': verify_string }, '', { 'func': 'auto' });
        },
        enterpriseDetail: function (keyword, is_simple) {
            return res.get("enterpriseDetail", { 'isSimple': is_simple, 'keyword': keyword });
        },
        testPhoneNumber: function (phone) {
            return res.get("testPhoneNumber", { 'phone': phone });
        },
        SingleEnterprise: function (customerId) {
            return res.all('customerReview').one('getSingleEnterprise' + '?customerId=' + customerId).get();
        }
    }
}]);

hpxAdminApp.factory('enterpriseService', ['Restangular', function (Restangular) {
    var res = Restangular.all('customers');
    return {
        get: function (id) {
            return res.one(id).get();
        },

        getAllAliveEnterprise: function (params,keyword,isAlive) {
            var queryParam = {
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'isAlive': isAlive
            };
            return res.get('enterprise', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.enterprises;
            });
        },
        freezeEnterprise: function (model) {
            var queryParam = {
                'func':'freeze'
            };
            return res.one('enterpriseFreeze',model.id).customPOST(model,'',queryParam);
        },
        unfreezeEnterprise: function (model) {
            var queryParam = {
                'func':'unfreeze'
            };
            return res.one('enterpriseFreeze',model.id).customPUT(model,'',queryParam);
        },
        getAllEnterpriseUser: function (params,filter) {
            var queryParam = {
                'phoneNumber': filter.phoneNumber,
                'customerName':filter.customerName,
                'enterpriseName ':filter.enterpriseName,
                'accountNumber':filter.accountNumber,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            };
            return res.get('enterpriseUser', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.enterprises;
            });
        },
        getOneEnterpriseUserInfo:function (model) {
            return res.one('enterpriseUser',model.id).get();
        }
    };
}]);

hpxAdminApp.factory('enterprisesService', ['Restangular', function (Restangular) {
    var res = Restangular.all('enterprises');
    return {
        //评价
        insertAppraisal: function (model) {
            return res.all('enterpriseAppraisal').post(model);
        },
        //getAppraisal1:function(model){
        //    return res.one('enterpriseAppraisal?p=1&n=2&star=&func=mine').post(model);
        //},
        //getAppraisal2: function (model) {
        //    return res.one('enterpriseAppraisal?p=1&n=2&star=&func=tome').post(model);
        //},
        //追加评价
        updateAppraisal: function (model) {
            return res.all('enterpriseAppraisal').one('enterpriseAppraisalId').post(model);
        },
        //getAppraisal: function (model) {
        //    return res.one('enterpriseAppraisal?p=1&n=2&star=&func=tome').post(model);
        //},
        getorderAppraisal: function(billtypeid, orderid){
           var queryParam = {
               'typeId': billtypeid,
               'toId': orderid,
               'func': 'show',
           }
            
            return res.get('enterpriseAppraisal', queryParam).then(function(data){
                return data;
            })
        },
     
    }
}]);



hpxAdminApp.factory('enterpriseXingyeUserService', ['Restangular', function (Restangular) {
    var res = Restangular.all('enterpriseXingyeUser');
    return {
        getLegalName: function (enterpriseId) {
            return res.one("getLegalInfo"+"?enterpriseId="+enterpriseId).get();
        }
    }
}]);

// JavaScript source code
hpxAdminApp.factory('exportService', function ($http, EXPORT_URL,Upload) {
    return {
        exportExcel: function (func, token, requestBody) {
            return $http({
                method: 'POST',
                url: EXPORT_URL + "/tools/excel?func=" + func,
                data: requestBody,
                headers: {
                    'Authorization': 'Bearer ' + token
                }

            });
        },
        uploadPublication: function (token, file) {
            return Upload.upload({
                url: EXPORT_URL + "/tools/excelImport?func=serviceByPublication", //upload.php script, node.js route, or servlet url
                method: 'POST',
                file: file,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function(data, status, headers, config) {        // file is uploaded successfully
                console.log(data);
            });      //.error(...)
            //.then(success, error, progress);
            // access or attach event listeners to the underlying XMLHttpRequest.
            //.xhr(function(xhr){xhr.upload.addEventListener(...)})
        }
    }
});

hpxAdminApp.factory('fileService', ['Restangular', function (Restangular) {
    var res = Restangular.all('files');
    return {
        getFileById: function (fid) {
            return res.all('file').one(fid.toString()).get();
        }
    }
}]);

// JavaScript source code
hpxAdminApp.factory('holidayService', ['Restangular', function (Restangular) {
    var res = Restangular.all('otherconstants');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('holiday', {}).then(function (result) {
                return result.holidays;
            });
        },
      
        query: function (params,year) {
            var queryParam = {
                'year':year,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('holiday', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.holidays;
            });
        },

      
        add: function (model) {
            return res.all('holiday').post(model);
        },
        update: function (model) {
            return res.one('holiday', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('holiday').customDELETE(id);
        }
    };
}]);
hpxAdminApp.factory('messageService', ['Restangular', '$interval', '$rootScope', '$state', '$cookieStore', function (Restangular, $interval, $rootScope, $state, $cookieStore) {
    var res = Restangular.all('notis');
    return {

        getMessage: function () {
            return res.one('notification' + '?isRead=' + 0 + '&' + 'n=' + 10).get();
        }
    }
}]);
hpxAdminApp.factory('myBillService', ['Restangular', function (Restangular) {
    var res = Restangular.all('bills');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        //queryAll: function () {
        //    return res.get('bill', {}).then(function (result) {
        //        return result.bill_products;
        //    });
        //},
        //bill_status_code, acceptor_type_id, bill_character_code, product_location_id, trade_type_code,
        query: function (params, bill_deadline_time, bill_type_id, bill_style_id, keyword) {
            var queryParam = {
                'bdeadline_time': bill_deadline_time,
                'billTypeId':bill_type_id,
                'billStyleId': bill_style_id,
                //'billStatusCode': bill_status_code,
                //'acceptorTypeId': acceptor_type_id,
                //'billCharacterCode': bill_character_code,
                //'locationId': product_location_id,
                //'tradeTypeCode': trade_type_code,
                //'isValid': isValid,
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('bill', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_products;
            });
        },
        //add: function (model) {
        //    return res.all('billProduct').post(model);
        //},
        //update: function (model) {
        //    return res.one('billProduct', model.id).customPUT(model);
        //},
        //remove: function (id) {
        //    return res.all('billProduct').customDELETE(id);
        //},
        //login: function (loginRequest) {
        //    return res.all('Login').post(loginRequest);
        //},
        //updateUserInfo: function (user) {
        //    return res.all('UpdateUserInfo').post(user);
        //},
        //updatePassword: function (oldPassword, newPassword) {
        //    return res.all('UpdatePassword').post(
        //        {
        //            'oldPassword': oldPassword,
        //            'newPassword': newPassword,
        //        });
        //},
        //resetPassword: function (userID) {
        //    return res.get('ResetPassword', { 'userID': userID });
        //}
    }
}]);



hpxAdminApp.factory('notisService', ['Restangular', function (Restangular) {
    var res = Restangular.all('notis');
    return {
        getNotification: function (params, type, isRead, time1, time2) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'type': type,
                'isRead': isRead,
                'time1': time1,
                'time2': time2
            }
            return res.get('notification', queryParam).then(function (data) {
                params.total(data.page_info.items_number);
                return data.notifications;
            });
        },
        seeNotification: function (notificationId) {
            return res.all('notification').one(notificationId.toString()).get();
        },
        deleteNotification: function (notificationId) {
            return res.all('notification').customDELETE(notificationId);
        },
    }
}]);

hpxAdminApp.factory('orderService', ['Restangular', function (Restangular) {
    var res = Restangular.all('orders');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        orderCount: function () {
            return res.get('orderCount', {});
        },
        getOwnOrderDrawer: function (params) {
            var queryParam = {
                'role': 'drawer',
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('order', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.orders;
            });
        },
        getOwnOrderReceiver: function (params) {
            var queryParam = {
                'role': 'receiver',
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('order', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.orders;
            });
        },
        getOwnOrder: function (params, billTypeId, status) {
            var queryParam = {
                'billTypeId': billTypeId,
                'status': status,
                'role': 'drawer',
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('order', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.orders;
            });
        },
        getOwnBiddingOrder: function (params, billTypeId, status) {
            var queryParam = {
                'billTypeId': billTypeId,
                'status': status,
                'role': 'receiver',
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('order', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.orders;
            });
        },
        getOrder: function (orderId) {
            return res.all('order').one(orderId.toString()).get();
        },
        deleteOrder: function (orderId) {
            return res.all('order').customDELETE(orderId);
        },

        orderPayCommission: function (orderId) {
            return res.all('orderCommission').one(orderId.toString()).put();
        },
        //orderPay: function (orderId, model) {
        //    return res.all('orderPay').one(orderId.toString()).customPUT(model);
        //},
        //orderPay: function (orderNum, sallerVAcctNo, buyerVAcctNo, orderId, phone_number, verifyCode) {
        //    return res.all('orderPay').one('?orderName=' + orderNum + '&sallerVAcctNo=' + sallerVAcctNo + '&buyerVAcctNo=' + buyerVAcctNo + '&orderId=' + orderId + '&phone=' + phone_number + '&verifyCode=' + verifyCode).post();
        //},
        updateOrderReceiver: function (orderId, model) {
            return res.all('orderReceiver').one(orderId.toString()).customPUT(model);
        },
        orderPayNew: function (orderId, orderPayTypeId, phone_number, verifyCode) {
            return res.all('orderPay').one(orderId.toString()).get({ 'orderPayTypeId': orderPayTypeId, 'phone': phone_number, 'verifyCode': verifyCode });
        },
        //orderPay: function (orderId) {
        //    return res.all('orderPay').all('temp').one(orderId.toString()).get();
        //},
        //orderPayConfirm: function (orderId) {
        //    return res.all('orderPayConfirm').all('temp').one(orderId.toString()).get();
        //},
        orderEndorsement: function (orderId) {
            return res.all('orderEndorsement').one(orderId.toString()).customPUT();
        },
        getOrderEndorsement: function (orderId) {
            return res.all('orderEndorsement').one(orderId.toString()).get();
        },
        deleteOrderEndorsement: function (orderId) {
            return res.all('orderEndorsement').one(orderId.toString()).remove();
        },
        orderLogistics: function (orderLogisticId, model) {
            return res.all('orderLogistic').one(orderLogisticId.toString()).customPUT(model);
        },
        orderConfirm: function (orderId , token) {
            return res.all('orderConfirm').one(orderId.toString()).get({ 'token': token });
        },
        orderFinish: function (orderId) {
            return res.all('orderFinish').one(orderId.toString()).get();
        },
        orderAppraisal: function (orderId, model) {
            return res.all('orderAppraisal').one(orderId.toString()).customPUT(model);
        },
        getOrderRunning: function (role) {
            var queryParam = {
                'func': 'count',
                'role': role
            }

            return res.get('order', queryParam);
        },
        updateOrderAccountReceiver: function (orderId, receiver_account_id) {
            //return res.all('orderAccount').customPUT({ 'account_id': receiver_account_id }, orderId, { 'func': 'receiver' });
            return res.all('orderAccount').one(orderId.toString() + '?account_id=' + receiver_account_id + '&func=' + 'receiver').customPUT();
        },
        updateOrderAccountDrawer: function (orderId, drawer_account_id) {
            //return res.all('orderAccount').customPUT({ 'account_id': drawer_account_id }, orderId, { 'func': 'drawer' });
            //return res.all('orderAccount').customPUT(orderId, { 'func': 'drawer' } + '&account_id' + drawer_account_id);
            return res.all('orderAccount').one(orderId.toString() + '?account_id=' + drawer_account_id + '&func=' + 'drawer').customPUT();
        },
        getOrderTime: function (orderId) {
            return res.all('order').one('getOrderTime').one(orderId.toString()).get();
        }
    }
}]);

hpxAdminApp.factory('payingService', ['Restangular', function (Restangular) {
    var res = Restangular.all('paying');
    return {
        payByAlipay: function (recharge_price) {
            return res.all('orderLogistic').one(orderLogisticId.toString()).customPUT({ 'recharge_price': recharge_price });
        },
        platformAccountBalance: function (params, changeType) {
            var queryParam = {
                'changeType': 1,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
            }

            return res.get('platformAccountBalance', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.balance_changes;
            });
        },
        recharge: function (recharge_price) {
            return res.all('recharge').customPUT({ 'recharge_price': recharge_price });
        },
        GetPlatformAccount: function () {
            return res.one('platformAccount').get();
        },
        bfapi: {
            queryBalance: function (p, n) {
                var queryParam = {
                    'type': 3,
                    'p': p,
                    'n': n,
                    'orderBy': '-id',
                    'status': 1,
                }
                return res.all('bfapi').get('queryBalance', queryParam);
            }
        },

        //bindingAgentTreasurer: function (enterpriseId, model) {
        //    return res.all('xingyeapi').one('bindingAgentTreasurer').one(enterpriseId.toString()).post(model);
        //},
        openAccount: function (enterpriseId, model) {
            return res.all('xingyeapi').one('xingYeOpenAccount').one('openAccount').all(enterpriseId.toString()).post(model);
        },
        addMoreAccount: function (enterpriseId, model) {
            return res.all('xingyeapi').one('xingYeOpenAccount').one('addMoreAccount').all(enterpriseId.toString()).post(model);
        },
        checkAccount: function (enterpriseId, amt, isDefault, accountTypeCode) {
            var queryParam = {
                'amt': amt,
                'isDefault': isDefault,
                'accountTypeCode': accountTypeCode
            }
            return res.all('xingyeapi').one('xingYeOpenAccount').one('checkAccount').all(enterpriseId.toString()).post(queryParam)
        },
        getAccount: function (enterpriseId) {
            return res.all('xingyeapi').one('account').one('getAccount').one(enterpriseId.toString()).get();
        },
        getAccountR: function (accountId) {
            return res.all('xingyeapi').one('account').one('getAccountR').one(accountId.toString()).get()
        },
        queryAccount: function (token) {
            return res.all('xingyeapi').one('query').get({ 'token': token });
        },
        //orderPay:function(token){
        //    return res.all('xingyeapi').one('orderPay' + '?token' + token).post()
        //},  , phone_number, verifyCode   + '&phone=' + phone_number + '&verifyCode=' + verifyCode
        orderPay: function (orderNum, sallerVAcctNo, buyerVAcctNo, orderId) {
            return res.all('xingyeapi').one('orderPay').one('?orderName=' + orderNum + '&sallerVAcctNo=' + sallerVAcctNo + '&buyerVAcctNo=' + buyerVAcctNo + '&orderId=' + orderId).post();
        },
        //econtractRegister: function (enterpriseId, model) {
        //    return res.all('xingyeapi').one('econtract').one('regispayingter').all(enterpriseId.toString()).post(model);
        //},
        getVacctNo: function (vacctNo, contractNum, billId) {
            return res.all('xingyeapi').one('econtract').one('getVacctNo' + '?vacctNo=' + vacctNo + '&contractNum=' + contractNum + '&billId=' + billId + '&type=' + 0).get();
        },
        getVacctNos: function (vacctNo, contractNum, billId) {
            return res.all('xingyeapi').one('econtract').one('getVacctNo' + '?vacctNo=' + vacctNo + '&contractNum=' + contractNum + '&billId=' + billId + '&type=' + 1).get();
        },
        econtractFirstSign: function (fromEnterpriseId, fromKeyWord,product_bid_id,account_id) {
            model = {
                "from_key_word": fromKeyWord,
                "account_id": account_id, //�׷��˻�id
                "product_bidding_id": product_bid_id  //����id
            }
            return res.all('xingyeapi').one('econtract').one('firstSign').all(fromEnterpriseId.toString()).post(model);
        },
    //{ 'toKeyWord': toKeyWord, 'orderId': orderId }
        econtractNextSign: function (toEnterpriseId, orderId) {
            return res.all('xingyeapi').one('econtract').one('nextSign').all(toEnterpriseId.toString() + '?orderId=' + orderId).post();
        },
        postAgentTreasurer: function (enterpriseId, model) {
            return res.all('xingyeapi').one('insertAgentTreasurer').all(enterpriseId.toString()).post(model);
        },
        postAgentTreasurer2: function (enterpriseId, model) {
            return res.all('xingyeapi').one('insertAgentTreasurer2').all(enterpriseId.toString()).post(model);
        },
        updateAgentTreasurer: function (enterpriseId, model) {
            return res.all('xingyeapi').one('updateAgentTreasurer').one(enterpriseId.toString()).customPUT(model);
        },
        getAgentTreasurer: function (enterpriseId,model) {
            return res.all('xingyeapi').one('selectAgentTreasurer').one(enterpriseId.toString()).get();
        },
        confirmXYPay: function(orderId){
            return res.all('xingyeapi').one('pay' + '?orderId=' + orderId).customPUT();
        },
        getAccountPX: function (id) {
            return res.all('xingyeapi').one('account').one('getAccountP').one(id.toString() + '?type=' + 1).get();
        },
        getAccountPY: function (id) {
            return res.all('xingyeapi').one('account').one('getAccountP').one(id.toString() + '?type=' + 2).get();
        },
        saveAccount: function (model) {
            console.log(model)
            return res.all('xingyeapi').all('account').post(model);
        }
        
      

    };

}]);
hpxAdminApp.factory('payService', ['Restangular', function (Restangular) {
    var res = Restangular.all('paying');
    return {
        get: function (id) {
            return res.one(id).get();
        },

        payDrawer: function (id,model) {
            return res.all('payToDrawer').one(id.toString()).customPUT(model);
        },

        getEnterpriseBalance: function (params,filter) {
            var queryParam = {
                'keyword':filter.keyword,
                'phone':filter.phone,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('enterpriseBalance', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.enterprises;
            });
        },

        getEnterpriseBalanceWithId: function (id,params,filter) {
            var queryParam = {
                'time1':filter.time1,
                'time2':filter.time2,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('enterpriseBalance/'+id, queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.enterprise_balances;
            });
        },
        updateEnterpriseBalanceWithId:function (id,data) {
            return res.one('enterpriseBalance',id).customPUT(data);
        },
        getBaofooBalanceWithId: function (id,params,filter) {
            var queryParam = {
                'time1':filter.time1,
                'time2':filter.time2,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'enterpriseId':id,
                'type':filter.type,
                'status':filter.status
            };
            return res.get('bfapi/queryBalance', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result;
            });
        },
        getBaofooView:function (id) {
            var queryParam = {
                'orderId':id,
            };
            return res.get('bfapi/unfreeze', queryParam).then(function (result) {
                 return result;
            });
        },
        getAllEnterpriseBaofoo:function(params,filter){
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'keyword':filter.keyword,
                'phone':filter.phone,
            };
            return res.get('enterpriseBaofoo', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.enterprise_baofoos;
            });
        },
        updateEnterpriseBaofoo:function (model) {
            return res.one('enterpriseBaofoo',model.id).customPUT(model);
        },
        econtractRegister: function (enterpriseId, model) {
            return res.all('xingyeapi').one('econtract').one('register').all(enterpriseId.toString()).post(model);
        },
        applyRefund: function (orderId) {
            return res.all('xingyeapi').one('cancelled' + '?orderId=' + orderId).customPUT();
        },
    };
}]);
hpxAdminApp.factory('portalInformationService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        get: function (id) {
            return res.all('information').one(id.toString()).get();
        },
        queryAll: function () {
            return res.get('information', {});
        },
        query: function (params, keyword, informationTypeId, publishingTimeS, publishingTimeB) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'keyword': keyword,
                'informationTypeId': informationTypeId,
                'publishingTimeS': publishingTimeS,
                'publishingTimeB': publishingTimeB
                //'publishing_time': publishing_time
            }

            return res.get('information', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.portal_information;
            });
        },
        queryByInformationTypeId: function (informationTypeId) {
            return res.get('information', { 'informationTypeId': informationTypeId }).then(function (result) {
                return result.portal_information;
            });
        },

        getPortals: function(params, informationTypeId){
            var getParam={
                'p': params.page(),
                'n': params.count(),
                'informationTypeId': informationTypeId,
            }
            return res.get('information', getParam).then(function (result) {
                return result.portal_information;
            });
        },
        //getPortals: function (informationTypeId) {
        //    return res.get('information', informationTypeId).then(function (result) {
        //        return result.portal_information;
        //    });
        //},
        updatePortals: function (model) {
            return res.all('information').one(model.id.toString()).customPUT(model);
        },

        //queryByPublishingTime: function(publishingTime){
        //    return ref.get('information', { 'publishing_time': publishing_time }).then(function (result) {
        //        return result.publishing_time;
        //    });
        //},
        add: function (model) {
            return res.all('information').post(model);
        },
        update: function (model) {
            return res.one('information', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('information').customDELETE(id);
        },
    }
}]);




hpxAdminApp.factory('portalInformationTypeService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        get: function (id) {
            return res.all('informationType').one(id.toString()).get();
        },
        queryAll: function () {
            return res.get('informationType', {});
        },
        query: function (params) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
            }

            return res.get('informationType', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.portal_information_types;
            });
        },
        queryByInformationTypeID: function (informationTypeId) {
            return res.get('informationType', { 'informationTypeId': informationTypeId }).then(function (result) {
                return result.portal_information_types;
            });
        },

        add: function (model) {
            return res.all('informationType').post(model);
        },
        update: function (model) {
            return res.one('informationType', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.all('informationType').customDELETE(id);
        },
    }
}]);
hpxAdminApp.factory('portalService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        lastInformation: function (type) {
            var queryParam = {
                'informationTypeId': type,
                'p': 1,
                'n': 5,
                'orderBy': '-publishing_time'
            }

            return res.get('information', queryParam).then(function (result) {
                return result.portal_information;
            });
        },
        queryInformation: function (type) {
            var queryParam = {
                'informationTypeId': type,
                'p': 1,
                'n': 100,
                'orderBy': '-publishing_time'
            }

            return res.get('information', queryParam).then(function (result) {
                return result.portal_information;
            });
        },
        getInformation: function (id) {
            return res.all('information').one(id.toString()).get();
        },
        getInformationType: function (id) {
            return res.all('informationType').one(id.toString()).get();
        }
    };
}]);
// JavaScript source code
hpxAdminApp.factory('portalSuggestionInfoService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('suggestion', {});
        },

        query: function (params, suggestionType_id, handleStatusCode, keyword) {
            //if (suggestionType_id == null) {
            //    suggestionType_id = 1;
            //}
            var queryParam = {
                'suggestionTypeId': suggestionType_id,
                'handleStatusCode': handleStatusCode,
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('suggestion', queryParam).then(function (result) {
                if (result != null) {
                    params.total(result.page_info.items_number);
                    return result.portal_suggestions;
                } else return null;
                
            });
        },

        add: function (model) {
            return res.all('suggestion').post(model);
        },
        update: function (model) {
            return res.one('suggestion', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.all('suggestion').customDELETE(id);
        },
    }
}]);
hpxAdminApp.factory('portalSuggestionService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('suggestion', {});
        },

        query: function (params, suggestionType_id, handleStatusCode, keyword) {
            //if (suggestionType_id == null) {
            //    suggestionType_id = 1;
            //}
            var queryParam = {
                'suggestionTypeId': suggestionType_id,
                'handleStatusCode': handleStatusCode,
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('suggestion', queryParam).then(function (result) {
                if (result != null) {
                    params.total(result.page_info.items_number);
                    return result.portal_suggestions;
                } else return null;

            });
        },

        add: function (model) {
            return res.all('suggestion').post(model);
        },
        update: function (model, modell) {

            if (modell.is_suggest_person_accept == "1") {
                modell.is_suggest_person_accept = 1;
            } else modell.is_suggest_person_accept = 0;

            return res.one('suggestion', model.id).customPUT(modell);
        },
       
    }
}]);
// JavaScript source code
hpxAdminApp.factory('portalSuggestionTypeService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('suggestionType', {});
        },
        queryKey: function (id){
            return res.get('suggestionType/'+id);
        },
        //query:function(params,keyword){
        //    var queryParam = {
        //        'keyword': keyword,
        //        'p': params.page(),
        //        'n': params.count(),
        //        'orderBy': params.orderBy()
        //}

        //    return res.get('suggestionType', queryParam).then(function (result) {
        //        params.total(result.page_info.items_number);
        //        return result;
        //    });
//},
      
      //  add: function (model) {
      //      return res.all('suggestionType').post(model);
      //  },
      //  update: function (model) {
      //     return res.one('suggestionType', model.id).customPUT(model);
      //   },
      //    remove: function (id) {
      //      return res.one('suggestionType').customDELETE(id);
      //}
    };
}]);
hpxAdminApp.factory('privilegeService', ['Restangular', '$interval', '$rootScope', '$state', '$cookieStore', function (Restangular, $interval, $rootScope, $state, $cookieStore) {
    var res = Restangular.all('privilege');
    return {
        //testLogin: function () {
        //    return res.get('testLogin', {});
        //},
        //customerLogin: function (model) {
        //    return res.all('customerLogin').post(model);
        //},
        //customerLoginEnterprise: function (model) {
        //    return res.all('customerLoginEnterprise').post(model);
        //},

        //退出登录功能，退出后跳转到网站首页
        //logout: function () {
        //    res.all('customerLogout').post().then(function () {
        //        $cookieStore.put('customer', null);
        //        $rootScope.identity = null;
        //        Restangular.setDefaultHeaders({});
        //        window.location.href = '/index.aspx';
        //    });
        //},
        //发送验证码,抽象
        //getVerify: function (phone, model, verifyStr, disableVerifyStr) {
        //    if (model[disableVerifyStr])
        //        return;
        //    if (!phone || phone.length != 11) {
        //        swal('请输入正确的手机号码！');
        //        return;
        //    }

        //    res.all('phoneVerify').one(phone.toString()).get().then(function () {
        //        swal('验证码已发送');
        //        model[verifyStr + 'Second'] = 90;
        //        model[disableVerifyStr] = true;

        //        $interval(function () {
        //            model[verifyStr] = model[verifyStr + 'Second'] + "秒后可重新获取";
        //            model[verifyStr + 'Second']--;

        //            if (model[verifyStr + 'Second'] <= 0) {
        //                model[verifyStr] = "重新获取验证码";
        //                model[disableVerifyStr] = false;
        //            }
        //        }, 1000, 90);
        //    })
        //},

        // 判断是否有使用权限 
        customerPrivilege: function (model) {
            return res.all('customerPrivilege').post(model)
        },
        // 查询套餐
        privilegePackage: function (model) {
            return res.all('privilegePackage').post(model)
        },
        // 购买套餐
        privilegePackOrder: function (model) {
            return res.all('privilegePackOrder').post(model)
        },


        customerLogout: function () {
            return res.all('customerLogout').post();
        },
        phoneVerify: function (phone) {
            return res.all('phoneVerify').one(phone.toString()).get();
        },
        customerPhone: function (data) {
            return res.one('customerPhone').customPUT(data);
        },
        customerReg: function (model) {
            return res.all('customerReg').post(model);
        },
        customerPasswordReset: function (phone, model) {
            return res.customPUT(model, 'customerPasswordReset', { 'phone': phone, 'r': 2 });
        },
        customerPasswordResets: function (phone, model) {
            return res.customPUT(model, 'customerPasswordReset', { 'phone': phone, 'r': 1 });
        },
        customerModifyPassword: function (model) {
            return res.one('customerPassword').customPUT(model);
        },

        getAllCustomerAddress: function () {
            return res.get('customerAddress', {});
        },
        getCustomerAddress: function (customerAddressId) {
            return res.all('customerAddress').one(customerAddressId.toString()).get();
        },
        addAddress: function (model) {
            return res.all('customerAddress').post(model);
        },
        updateAddress: function (model) {
            return res.one('customerAddress', model.id).customPUT(model);
        },
        updateAddressDefault: function (data) {
            return res.one('customerAddress').customPUT({}, data.id, { 'func': 'default' });
        },

        removeAddress: function (id) {
            return res.all('customerAddress').customDELETE(id);
        },
        getAllEnterpriseAccount: function (accountTypeCode) {
            return res.get('enterpriseAccount', { 'accountTypeCode': accountTypeCode });
        },
        getEnterpriseAccount: function (accountId) {
            return res.all('enterpriseAccount').one(accountId.toString()).get();
        },
        getAllEnterprise: function () {
            return res.get('enterprise', {});
        },
        getEnterprise: function (enterpriseId) {
            return res.all('enterprise').one(enterpriseId.toString()).get();
        },
        insertEnterprise: function (model) {
            return res.all('enterprise').post(model);
        },
        updateEnterprise: function (model) {
            return res.one('enterprise').customPUT(model);
        },
        deleteEnterprise: function (enterpriseId) {
            return res.all('enterprise').customDELETE(enterpriseId);
        },
        updateEnterpriseDefault: function (data) {
            return res.one('enterpriseAccount').customPUT({}, data.id, { 'func': 'default' });
        },

        updateEnterpriseCredential: function (model) {
            return res.one('enterpriseCredential', model.id).customPUT(model);
        },

        sendCustomerReview: function () {
            return res.one('customerReview').post();
        },

        getEnterpriseMember: function () {
            return res.get('enterpriseMember', {});
        },
        insertEnterpriseMember: function (model) {
            return res.all('enterpriseMember').post(model);
        },
        deleteEnterpriseMember: function (operater) {
            return res.all('enterpriseMember').customDELETE(operater.remove_phone_number, { 'code': operater.operator_phone_number_code });
        },
        insertEnterpriseAccount: function (model) {
            return res.all('enterpriseAccount').post(model);
        },
        updateWnterpriseAccount: function (model) {
            return res.all('enterpriseAccount').one(model.id.toString()).customPUT(model);
        },
        deleteEnterpriseAccount: function (enterpriseId) {
            return res.all('enterpriseAccount').customDELETE(enterpriseId);
        },

        getCustomer: function () {
            return res.get('customer', {});
        },
        updateCustomer: function (model) {
            return res.one('customer').customPUT(model);
        },
        verify: function (id, verify_string) {
            return res.one('enterpriseAccountCheck', id.toString()).customPUT({ 'verify_string': verify_string }, '', { 'func': 'auto' });
        },
        enterpriseDetail: function (keyword, is_simple) {
            return res.get("enterpriseDetail", { 'isSimple': is_simple, 'keyword': keyword });
        },
        testPhoneNumber: function (phone) {
            return res.get("testPhoneNumber", { 'phone': phone });
        }
    }
}]);

// JavaScript source code
hpxAdminApp.factory('publicationService', function (Restangular) {
    var res = Restangular.all('tools');

    return {
        getAllServiceByPublication: function (params,filter) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy':params.orderBy(),
                'billNumber':filter.billNumber,
                'enterpriseName':filter.enterpriseName,
                'announceCourt':filter.announceCourt,
                'time1':filter.time1,
                'time2':filter.time2
                /*,'money1':parseFloat(filter.money1)+0.01,
                'money2':parseFloat(filter.money2)+0.01*/
            };
            return res.get('serviceByPublication', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.service_by_publications;
            });
        },
        deleteServiceByPublication: function (id) {
            return res.all('serviceByPublication').one(id.toString()).customDELETE();
        },
    };
});

hpxAdminApp.factory('queryBillService', ['Restangular', function (Restangular) {
    var res = Restangular.all('bills');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        //queryAll: function () {
        //    return res.get('billProduct', {}).then(function (result) {
        //        return result.bill_products;
        //    });
        //},
        //queryBillProduct: function (ProductId) {
        //    return res.get('billProduct' + '/' + ProductId);
        //},
        query: function (params, bill_style_id, bill_status_code, acceptor_type_id, bill_character_code, product_location_id, trade_type_code, keyword) {
            var queryParam = {
                'billStyleId': bill_style_id,
                'billStatusCode': bill_status_code,
                'acceptorTypeId': acceptor_type_id,
                'billCharacterCode': bill_character_code,
                'locationId': product_location_id,
                'tradeTypeCode': trade_type_code,
                //'isValid': isValid,
                'keyword': keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('billProduct', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_products;
            });
        },
        //add: function (model) {
        //    return res.all('billProduct').post(model);
        //},
        //update: function (model) {
        //    return res.one('billProduct', model.id).customPUT(model);
        //},
        //remove: function (id) {
        //    return res.all('billProduct').customDELETE(id);
        //},
        //login: function (loginRequest) {
        //    return res.all('Login').post(loginRequest);
        //},
        //updateUserInfo: function (user) {
        //    return res.all('UpdateUserInfo').post(user);
        //},
        //updatePassword: function (oldPassword, newPassword) {
        //    return res.all('UpdatePassword').post(
        //        {
        //            'oldPassword': oldPassword,
        //            'newPassword': newPassword,
        //        });
        //},
        //resetPassword: function (userID) {
        //    return res.get('ResetPassword', { 'userID': userID });
        //}
    }
}]);

// JavaScript source code
hpxAdminApp.factory('resourceService', ['Restangular', function (Restangular) {
    var res = Restangular.all('resources');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('resource', {});
        },
        query: function (params) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('resource', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.resources;
            });
        },

        queryByUserID: function (userID) {
            return res.get('queryRoleByUserID', { 'userID': userID }).then(function (result) {
                return result.Data;
            });
        },
        //queryByRoleID:function(role_id){
        //    return res.get('queryByRoleID',{'role_id':role_id}).then(function(result){
        //        return result.Data;
        //    });
        //},
        add: function (model) {
            return res.all('resource').post(model);
        },
        update: function (model) {
            return res.one('resource', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('resource').customDELETE(id);
        }
    };
}]);
// JavaScript source code
hpxAdminApp.factory('roleService', ['Restangular', function (Restangular) {
    var res = Restangular.all('resources');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('role', {}).then(function (result) {
                return result.roles;
            });
        },
      
        query: function (params,role_name,keyword) {
            var queryParam = {
                'rolename': role_name,
                'keyword':keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('role', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.roles;
            });
        },

        copyRole:function (id, model){
            return res.all('roleCopy/' + id.toString()).post(model);
        },
        getRoleResource:function(id){
            return res.get('roleResourceOperation', { 'r' : id }).then(function (data) {
               return data.role_resource_operations;
            });
        },
        addRoleResource: function(model){
            return res.all('roleResourceOperation').post(model);
        },
        updateRoleResource: function(model){
            return res.all('roleResourceOperation').one(model.id.toString()).customPUT(model);
        },
        removeRoleResource: function(model){
            return res.all('roleResourceOperation').customDELETE(model.id.toString());
        },

      
        add: function (model) {
            return res.all('role').post(model);
        },
        update: function (model) {
            return res.one('role', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('role').customDELETE(id);
        }
    };
}]);
hpxAdminApp.factory('searchService', ['Restangular', function (Restangular) {
    var res = Restangular.all('search');
    return {
        getEnterpriseAppraisal: function (model,filter) {
            var queryParam = {
                'func':filter.func,
                'customerName':filter.customerName,
                'phoneNumber':filter.phoneNumber,
                'enterpriseName':filter.enterpriseName,
                'orderId':model.id
            };
            return res.get('enterpriseAppraisal',queryParam);
        },
        getAllEnterpriseAppraisal: function (params,filter) {
            var queryParam = {
                'func':filter.func,
                'customerName':filter.customerName,
                'phoneNumber':filter.phoneNumber,
                'enterpriseName':filter.enterpriseName,
                'n': params.count(),
                'p':params.page(),
                'orderBy':params.orderBy()
            };
            return res.get('enterpriseAppraisal',queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.enterprises;
            });
        },
        getAllPayToDrawer: function (params,filter) {
            var queryParam = {
                'func':filter.func,
                'customerName':filter.customerName,
                'phoneNumber':filter.phoneNumber,
                'enterpriseName':filter.enterpriseName,
                'time1':filter.time1,
                'time2':filter.time2,
                'n': params.count(),
                'p':params.page(),
                'orderBy':params.orderBy()
            };
            return res.get('payToDrawer',queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.orders;
            });
        },
        getPlatformAccountBalance:function (model,filter,params) {
            var queryParam = {
                enterpriseId:model.id,
                isMadeBill:filter.isMadeBill,
                'n': params.count(),
                'p':params.page(),
                'orderBy':params.orderBy()
            };

            return res.get('platformAccountBalance',queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.balance_changes;
            })
        },
        updatePlatformAccountBalance:function (itemIds) {
            var queryParam = {
                balance_ids:itemIds
            };
            return res.one('platformAccountBalance').customPUT(queryParam).then(function (result) {
                return result;
            })
        }
    };
}]);
hpxAdminApp.factory('toolService', ['Restangular', function (Restangular) {
    var res = Restangular.all('tools');
    return {
        interestRate: function () {
            return res.get('interestRate', {});
        },
        priceTrend: function () {
            return res.get('priceTrend', {});
        },
        calculator: function (model, func) {
            var param = {};
            if (func)
                param['func'] = func;
            return res.all("calculator").post(model, param);
        },
        searchCalendar: function (year, month, billTypeId, number) {
            var queryParam = {
                'year': year,
                'month': month,
                'billTypeId': billTypeId,
                'number': number
            }

            return res.get('calendar', queryParam).then(function (data) {
                return data;
            });
        },
        isCalendarSpecial: function (day_str) {
            return res.get('calendar', { 'date': day_str });
        },
        serviceByPublication: function (params) {
            return res.get('serviceByPublication', params);
        },
        getSystemTime: function(){
            return res.get('systemTime', {});
        }

    }
}]);

// JavaScript source code
hpxAdminApp.factory('userService', ['Restangular', function (Restangular) {
    var res = Restangular.all('users');
    return {
        get: function (id) {
            res.one(id).get();
        },
        queryAll: function () {
            return res.get('user', {}).then(function (result) {
                return result.users;
            });
        },
        queryUserData:function(){
            return res.get('userLogin', {}).then(function (result) {
                return result.data;
            });
        },
        queryUserMenu: function () {
            return res.get('userLogin', {}).then(function (result) {
                return result.menus;
            });
        },
        query: function (params, username, role_name, is_valid,keyword) {
            var queryParam = {
                'username': username,
                'rolename':role_name,
                'isValid': is_valid,
                'keyword': keyword,
                'p':params.page(),
                'n': params.count(),
                'orderBy':params.orderBy()
            }
  
            return res.get('user', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.users;
            });
        },

        add: function (model) {
            return res.all('user').post(model);
        },
        update: function (model) {
            return res.one('user', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('user').customDELETE(id);
        },
        login: function (loginRequest) {
            return res.all('userLogin').post(loginRequest);
        },
        logout: function (logoutRequest) {
            return res.all('userLogout').post(logoutRequest);
        },
        updateUerInfo: function (user) {
            return res.all('user').post(user);
        },
        updatePassword: function (password, new_password) {
            return res.all('userPassword').post(
                {
                    'password': password,
                    'new_password': new_password,
                });
        },
        resetPassword: function (userId) {
            return res.get('ResetPassword', { 'userId': userId });
        },

        queryRoleOperation: function (params, roleid) {
            var queryParam = {
                'roleid': roleid,
                'p': params.page(),
                'n': params.count(),
            }

            return res.get('roleOperation', queryParam).then(function (result) {
                //params.total(result.page_info.items_number);
                return result.role_resource_operations;
            });
        },
        //getRoleOperation: function(roleid){
        //    return res.get("roleOperation", { "roleid": roleid }).then(function (data) {
        //        return data.role_resource_operations;
        //    });
        //},
        getRole: function (roleid) {
            return res.all("role").one(roleid.toString()).get();
        },
        getRoleOperation: function (roleid) {
            return res.all("roleOperation").one(roleid.toString()).get();
        },
    }
}]);