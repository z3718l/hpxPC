hpxAdminApp.controller('headerController', function ($rootScope, $scope, $state, Restangular, customerService, $cookieStore) {
    //退出登录功能，退出后跳转到网站首页
    $scope.logout = function () {
        swal({
            title: "确认要退出登录吗?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "是",
            cancelButtonText: "否",
            closeOnConfirm: true
        }, function () {
            customerService.customerLogout().then(function () {
                $cookieStore.put('customer', null);
                $rootScope.identity = null;
                Restangular.setDefaultHeaders({});
                window.location.href = '/index.aspx';
            });
        });
    };

    $scope.publishbill = function () {
        if ($rootScope.identity) {
            window.location.href = '/www/index.html#/app/main/publish';
        } else {
            window.location.href = '/www/index.html#/app/loginInfo';
        }
    }
    $scope.editQuoteaccount = function () {
        if ($rootScope.identity) {
            window.location.href = '/www/index.html#/app/main/editQuote';
        } else {
            window.location.href = '/www/index.html#/app/loginInfo';
        }
    }

});
