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