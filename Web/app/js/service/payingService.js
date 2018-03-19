ionicApp.factory('payingService', ['Restangular', function (Restangular) {
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
        //econtractRegister: function (enterpriseId, model) {
        //    return res.all('xingyeapi').one('econtract').one('register').all(enterpriseId.toString()).post(model);
        //},
        econtractFirstSign: function (fromEnterpriseId, fromKeyWord) {
            return res.all('xingyeapi').one('econtract').one('firstSign').all(fromEnterpriseId.toString()).post({ 'fromKeyWord': fromKeyWord });
        },
        econtractNextSign: function (toEnterpriseId, toKeyWord, orderId) {
            return res.all('xingyeapi').one('econtract').one('nextSign').all(toEnterpriseId.toString()).post({ 'toKeyWord': toKeyWord, 'orderId': orderId });
        },
        postAgentTreasurer: function (enterpriseId, model) {
            return res.all('xingyeapi').one('insertAgentTreasurer').all(enterpriseId.toString()).post(model);
        },
        updateAgentTreasurer: function (enterpriseId, model) {
            return res.all('xingyeapi').one('updateAgentTreasurer').one(enterpriseId.toString()).customPUT(model);
        },
        getAgentTreasurer: function (enterpriseId) {
            return res.all('xingyeapi').one('selectAgentTreasurer').one(enterpriseId.toString()).get();
        }

    };
}]);