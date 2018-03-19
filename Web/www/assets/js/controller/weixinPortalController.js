hpxAdminApp.controller('weixinPortalController', function ($scope, $rootScope, $state, $stateParams, $window, API_URL, NgTableParams, portalInformationService, portalInformationTypeService) {
    //portalInformationTypeService.get($stateParams.type).then(function (data) {
    //    $scope.typeName = data.information_type_name;
    //})

    var emptyEntity = {
        //information_type_id: $stateParams.type
    };
    var newEntity = angular.copy(emptyEntity);

    $scope.filter = {};

    $scope.tableParams = new NgTableParams({}, {
        getData: function (params) {

            return portalInformationService.query(params, $scope.filter.keyword, 5).then(function (data) {
                $scope.first = $scope.getFirst(params);
                return data;
            });
        }
    });

    //portalInformationTypeService.queryByInformationTypeID($scope.filter.information_type_id).then(function (data) {
    //    $scope.informationTypes = data;
    //});
    //init = function () {
    //    portalInformationService.getPortals(5).then(function (data) {
    //        return data;
    //    });
    //}
    //init();

    //$scope.tableParams = new NgTableParams({}, {
    //    getData: function (params) {

    //        return portalInformationService.getPortals(params, $scope.filter.informationTypeId).then(function (data) {
    //            $scope.first = $scope.getFirst(params);
    //            return data;
    //        });
    //    }
    //});


    function IsURL(str_url) {
        var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
        + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@ 
        + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184 
        + '|' // 允许IP和DOMAIN（域名） 
        + '([0-9a-z_!~*\'()-]+.)*' // 域名- www. 
        + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名 
        + '[a-z]{2,6})' // first level domain- .com or .museum 
        + '(:[0-9]{1,4})?' // 端口- :80 
        + '((/?)|' // a slash isn't required if there is no file name 
        + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
        var re = new RegExp(strRegex);
        //re.test() 
        if (re.test(str_url)) {
            return (true);
        } else {
            return (false);
        }
    }


    $scope.edit = function (item) {
        portalInformationService.get(item.id).then(function (data) {
            $scope.model = data;
        });
        $('#modal-edit').modal('show');
    };

    $scope.save = function () {
        if (!IsURL(model.detail)) {
            alert("您输入的链接不合法。请重新输入。");
        }else{
            portalInformationService.update($scope.model).then(function (data) {
                $scope.tableParams.reload();
                $scope.editForm.$setPristine();
                $('#modal-edit').modal('hide');
            });
        }
    };

    //$scope.remove = function () {
    //    if (confirm('确认放弃吗？')) {
    //        init();
    //    }
    //}

});