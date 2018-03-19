// JavaScript source code
hpxAdminApp.factory('holidayService', ['Restangular', function (Restangular) {
    var res = Restangular.all('otherconstants');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('holiday', {}).then(function (result) {
                return result.holidays;
            });
        },
      
        query: function (params,year) {
            var queryParam = {
                'year':year,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('holiday', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.holidays;
            });
        },

      
        add: function (model) {
            return res.all('holiday').post(model);
        },
        update: function (model) {
            return res.one('holiday', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('holiday').customDELETE(id);
        }
    };
}]);