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