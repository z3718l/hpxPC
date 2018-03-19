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