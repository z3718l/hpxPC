hpxAdminApp.factory('notisService', ['Restangular', function (Restangular) {
    var res = Restangular.all('notis');
    return {
        getNotification: function (params, type, isRead, time1, time2) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'type': type,
                'isRead': isRead,
                'time1': time1,
                'time2': time2
            }
            return res.get('notification', queryParam).then(function (data) {
                params.total(data.page_info.items_number);
                return data.notifications;
            });
        },
        seeNotification: function (notificationId) {
            return res.all('notification').one(notificationId.toString()).get();
        },
        deleteNotification: function (notificationId) {
            return res.all('notification').customDELETE(notificationId);
        },
    }
}]);
