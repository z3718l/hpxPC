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