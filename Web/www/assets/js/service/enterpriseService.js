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
