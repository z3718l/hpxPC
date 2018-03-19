// JavaScript source code
hpxAdminApp.factory('resourceService', ['Restangular', function (Restangular) {
    var res = Restangular.all('resources');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('resource', {});
        },
        query: function (params) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('resource', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.resources;
            });
        },

        queryByUserID: function (userID) {
            return res.get('queryRoleByUserID', { 'userID': userID }).then(function (result) {
                return result.Data;
            });
        },
        //queryByRoleID:function(role_id){
        //    return res.get('queryByRoleID',{'role_id':role_id}).then(function(result){
        //        return result.Data;
        //    });
        //},
        add: function (model) {
            return res.all('resource').post(model);
        },
        update: function (model) {
            return res.one('resource', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('resource').customDELETE(id);
        }
    };
}]);