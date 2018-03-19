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

        getBank: function (head_bank_id, bank_address_id, keyword) {
            return res.get('bank',{ 'headBankId': head_bank_id, 'bankAddressId': bank_address_id , 'keyword': keyword }).then(function(data){
                return data.banks;
            });
        },

        getSpecificBank:function(bankId){
            return res.all('bank').one(bankId.toString()).get()
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
    }
}]);
hpxAdminApp.factory('billService', ['Restangular', function (Restangular) {
    var res = Restangular.all('bills');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        searchBillProduct: function (params, isAlive, billTypeId, billStyleId, billStatusCode, acceptorTypeId, locationId, tradeTypeCode, billCharacterCode, billFlawId) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'isAlive': isAlive,
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
        searchBillOffer: function (params, search, publishingTimeS, publishingTimeB, billStyleId, enterpriseName) {
            var queryParam = {
                'func': 'search',
                'billStyleId': billStyleId,
                'enterpriseName': enterpriseName,
                'publishingTimeS': publishingTimeS,
                'publishingTimeB':publishingTimeB,
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
        getOwnBillProduct: function (params, isAlive, billTypeId, billStyleId) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'isAlive': isAlive,
                'billTypeId': billTypeId,
                'billStyleId': billStyleId
            }

            return res.get('bill', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_products;
            });
        },
        newOrderBidding: function (model) {
            return res.all('order').post(model, { 'type': 'bidding' });
        },
        getOwnBillBidding: function (params) {
            var queryParam = {
                'p': params.page(),
                'n': params.count()
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
        getOwnBillOffer: function (params, billTypeId, billStyleId, maxPrice, tradeLocationId,keyword) {
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
hpxAdminApp.factory('customerService', ['Restangular', function (Restangular) {
    var res = Restangular.all('customers');
    return {
        testLogin: function () {
            return res.get('testLogin', {});
        },
        customerLogin: function (model) {
            return res.all('customerLogin').post(model);
        },
        customerLogout: function () {
            return res.all('customerLogout').post();
        },
        phoneVerify: function (phone) {
            return res.all('phoneVerify').one(phone.toString()).get();
        },
        customerReg: function (model) {
            return res.all('customerReg').post(model);
        },
        customerPasswordReset: function (phone, model) {
            return res.customPUT(model, 'customerPasswordReset', { 'phone': phone });
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
        updateAddressDefault: function(data){
            return res.one('customerAddress').customPUT({}, data.id, { 'func': 'default' });
        },

        removeAddress: function (id) {
            return res.all('customerAddress').customDELETE(id);
        },
        getAllEnterpriseAccount: function (accountTypeCode) {
            return res.get('enterpriseAccount', { 'accountTypeCode': accountTypeCode });
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
            return res.one('enterprise', model.id).customPUT(model);
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
        
        sendCustomerReview:function(){
            return res.one('customerReview').post();
        },

        getEnterpriseAccount: function () {
            return res.get('enterpriseAccount', {});
        },
        insertEnterpriseAccount: function (model) {
            return res.all('enterpriseAccount').post(model);
        },
        updateWnterpriseAccount: function(model){
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
        enterpriseDetail: function (keyword) {
            return res.get("enterpriseDetail", { 'isSimple': 1, 'keyword': keyword });
        }
     }
}]);

hpxAdminApp.factory('fileService', ['Restangular', function (Restangular) {
    var res = Restangular.all('files');
    return {
        getFileById: function (fid) {
            return res.all('file').one(fid.toString()).get();
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
        getOrder: function (orderId) {
            return res.all('order').one(orderId.toString()).get();
        },
        orderPayCommission: function (orderId) {
            return res.all('orderCommission').one(orderId.toString()).put();
        },
        orderPay: function (orderId, model) {
            return res.all('orderPay').one(orderId.toString()).customPUT(model);
        },
        updateOrderReceiver: function (orderId, model) {
            return res.all('orderReceiver').one(orderId.toString()).customPUT(model);
        },
        //orderPay: function (orderId) {
        //    return res.all('orderPay').all('temp').one(orderId.toString()).get();
        //},
        //orderPayConfirm: function (orderId) {
        //    return res.all('orderPayConfirm').all('temp').one(orderId.toString()).get();
        //},
        orderEndorsement: function (orderId, model) {
            return res.all('orderEndorsement').one(orderId.toString()).customPUT(model);
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
        orderConfirm: function (orderId) {
            return res.all('orderConfirm').one(orderId.toString()).get();
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
    };
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

hpxAdminApp.factory('toolService', ['Restangular', function (Restangular) {
    var res = Restangular.all('tools');
    return {
        interestRate: function () {
            return res.get('interestRate', {});
        },
        priceTrend: function () {
            return res.get('priceTrend', {});
        },
        calculator: function (model) {
            return res.all("calculator").post(model);
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
        }
    }
}]);
