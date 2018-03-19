hpxAdminApp.factory('cacheService', ['$cacheFactory', function ($cacheFactory) {
    return {
        ID: function (cacheId) {
            var cacheId = arguments[0] ? arguments[0] : 'default';
            return $cacheFactory(cacheId);
        },
    }
}]);