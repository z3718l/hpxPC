// JavaScript source code
hpxAdminApp.factory('roleService', ['Restangular', function (Restangular) {
    var res = Restangular.all('resources');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('role', {}).then(function (result) {
                return result.roles;
            });
        },
      
        query: function (params,role_name,keyword) {
            var queryParam = {
                'rolename': role_name,
                'keyword':keyword,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }
            return res.get('role', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.roles;
            });
        },

        copyRole:function (id, model){
            return res.all('roleCopy/' + id.toString()).post(model);
        },
        getRoleResource:function(id){
            return res.get('roleResourceOperation', { 'r' : id }).then(function (data) {
               return data.role_resource_operations;
            });
        },
        addRoleResource: function(model){
            return res.all('roleResourceOperation').post(model);
        },
        updateRoleResource: function(model){
            return res.all('roleResourceOperation').one(model.id.toString()).customPUT(model);
        },
        removeRoleResource: function(model){
            return res.all('roleResourceOperation').customDELETE(model.id.toString());
        },

      
        add: function (model) {
            return res.all('role').post(model);
        },
        update: function (model) {
            return res.one('role', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('role').customDELETE(id);
        }
    };
}]);