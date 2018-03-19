hpxAdminApp.factory('appraisalTempletService',['Restangular',function (Restangular) {
    var res = Restangular.all('otherconstants');

    return{
        query :function(params,star){
            var queryParams = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'star':star
            };
            return res.get('appraisalTemplet', queryParams).then(function (result) {
                params.total(result.page_info.items_number);
                return result.appraisal_templets;
            });
        },
        add: function (model) {
            return res.all('appraisalTemplet').post(model);
        },
        update: function (model) {
            return res.one('appraisalTemplet', model.id).customPUT(model);
        },
        remove: function (id) {
            return res.all('appraisalTemplet').customDELETE(id);
        }
    };
}]);