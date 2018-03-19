// JavaScript source code
hpxAdminApp.factory('publicationService', function (Restangular) {
    var res = Restangular.all('tools');

    return {
        getAllServiceByPublication: function (params,filter) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy':params.orderBy(),
                'billNumber':filter.billNumber,
                'enterpriseName':filter.enterpriseName,
                'announceCourt':filter.announceCourt,
                'time1':filter.time1,
                'time2':filter.time2
                /*,'money1':parseFloat(filter.money1)+0.01,
                'money2':parseFloat(filter.money2)+0.01*/
            };
            return res.get('serviceByPublication', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.service_by_publications;
            });
        },
        deleteServiceByPublication: function (id) {
            return res.all('serviceByPublication').one(id.toString()).customDELETE();
        },
    };
});
