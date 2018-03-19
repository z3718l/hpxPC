hpxAdminApp.factory('messageService', ['Restangular', '$interval', '$rootScope', '$state', '$cookieStore', function (Restangular, $interval, $rootScope, $state, $cookieStore) {
    var res = Restangular.all('notis');
    return {

        getMessage: function () {
            return res.one('notification' + '?isRead=' + 0 + '&' + 'n=' + 10).get();
        }
    }
}]);