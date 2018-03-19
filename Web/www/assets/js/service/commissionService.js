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
