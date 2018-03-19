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