// JavaScript source code
hpxAdminApp.factory('portalSuggestionTypeService', ['Restangular', function (Restangular) {
    var res = Restangular.all('portals');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        queryAll: function () {
            return res.get('suggestionType', {});
        },
        queryKey: function (id){
            return res.get('suggestionType/'+id);
        },
        //query:function(params,keyword){
        //    var queryParam = {
        //        'keyword': keyword,
        //        'p': params.page(),
        //        'n': params.count(),
        //        'orderBy': params.orderBy()
        //}

        //    return res.get('suggestionType', queryParam).then(function (result) {
        //        params.total(result.page_info.items_number);
        //        return result;
        //    });
//},
      
      //  add: function (model) {
      //      return res.all('suggestionType').post(model);
      //  },
      //  update: function (model) {
      //     return res.one('suggestionType', model.id).customPUT(model);
      //   },
      //    remove: function (id) {
      //      return res.one('suggestionType').customDELETE(id);
      //}
    };
}]);