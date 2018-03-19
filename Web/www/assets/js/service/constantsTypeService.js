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