// JavaScript source code
hpxAdminApp.factory('userService', ['Restangular', function (Restangular) {
    var res = Restangular.all('users');
    return {
        get: function (id) {
            res.one(id).get();
        },
        queryAll: function () {
            return res.get('user', {}).then(function (result) {
                return result.users;
            });
        },
        queryUserData:function(){
            return res.get('userLogin', {}).then(function (result) {
                return result.data;
            });
        },
        queryUserMenu: function () {
            return res.get('userLogin', {}).then(function (result) {
                return result.menus;
            });
        },
        query: function (params, username, role_name, is_valid,keyword) {
            var queryParam = {
                'username': username,
                'rolename':role_name,
                'isValid': is_valid,
                'keyword': keyword,
                'p':params.page(),
                'n': params.count(),
                'orderBy':params.orderBy()
            }
  
            return res.get('user', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.users;
            });
        },

        add: function (model) {
            return res.all('user').post(model);
        },
        update: function (model) {
            return res.one('user', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('user').customDELETE(id);
        },
        login: function (loginRequest) {
            return res.all('userLogin').post(loginRequest);
        },
        logout: function (logoutRequest) {
            return res.all('userLogout').post(logoutRequest);
        },
        updateUerInfo: function (user) {
            return res.all('user').post(user);
        },
        updatePassword: function (password, new_password) {
            return res.all('userPassword').post(
                {
                    'password': password,
                    'new_password': new_password,
                });
        },
        resetPassword: function (userId) {
            return res.get('ResetPassword', { 'userId': userId });
        },

        queryRoleOperation: function (params, roleid) {
            var queryParam = {
                'roleid': roleid,
                'p': params.page(),
                'n': params.count(),
            }

            return res.get('roleOperation', queryParam).then(function (result) {
                //params.total(result.page_info.items_number);
                return result.role_resource_operations;
            });
        },
        //getRoleOperation: function(roleid){
        //    return res.get("roleOperation", { "roleid": roleid }).then(function (data) {
        //        return data.role_resource_operations;
        //    });
        //},
        getRole: function (roleid) {
            return res.all("role").one(roleid.toString()).get();
        },
        getRoleOperation: function (roleid) {
            return res.all("roleOperation").one(roleid.toString()).get();
        },
    }
}]);