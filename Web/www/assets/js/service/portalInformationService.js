hpxAdminApp.factory('portalInformationService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        get: function (id) {
            return res.all('information').one(id.toString()).get();
        },
        queryAll: function () {
            return res.get('information', {});
        },
        query: function (params, keyword, informationTypeId, publishingTimeS, publishingTimeB) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'keyword': keyword,
                'informationTypeId': informationTypeId,
                'publishingTimeS': publishingTimeS,
                'publishingTimeB': publishingTimeB
                //'publishing_time': publishing_time
            }

            return res.get('information', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.portal_information;
            });
        },
        queryByInformationTypeId: function (informationTypeId) {
            return res.get('information', { 'informationTypeId': informationTypeId }).then(function (result) {
                return result.portal_information;
            });
        },

        getPortals: function(params, informationTypeId){
            var getParam={
                'p': params.page(),
                'n': params.count(),
                'informationTypeId': informationTypeId,
            }
            return res.get('information', getParam).then(function (result) {
                return result.portal_information;
            });
        },
        //getPortals: function (informationTypeId) {
        //    return res.get('information', informationTypeId).then(function (result) {
        //        return result.portal_information;
        //    });
        //},
        updatePortals: function (model) {
            return res.all('information').one(model.id.toString()).customPUT(model);
        },

        //queryByPublishingTime: function(publishingTime){
        //    return ref.get('information', { 'publishing_time': publishing_time }).then(function (result) {
        //        return result.publishing_time;
        //    });
        //},
        add: function (model) {
            return res.all('information').post(model);
        },
        update: function (model) {
            return res.one('information', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.one('information').customDELETE(id);
        },
    }
}]);



