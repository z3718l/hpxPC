hpxAdminApp.factory('enterpriseXingyeUserService', ['Restangular', function (Restangular) {
    var res = Restangular.all('enterpriseXingyeUser');
    return {
        getLegalName: function (enterpriseId) {
            return res.one("getLegalInfo"+"?enterpriseId="+enterpriseId).get();
        }
    }
}]);
