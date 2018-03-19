var hpxAdminApp = angular.module('hpxAdminApp', [
    'ui.router',
    'restangular',
    'ngCookies'
]);

hpxAdminApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$cookiesProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $cookiesProvider) {
    $urlRouterProvider.otherwise('/share/shareBill');
    //$locationProvider.html5Mode(true);

    $stateProvider
        //分享功能
        .state('share', {
            url: '/share',
            templateUrl: 'template/share.html',
            abstract: true
        })
        .state('share.shareBill', {
            url: '/shareBill?id',
            templateUrl: 'views/shareBill.html'
        })
        .state('share.shareOffer', {
            url: '/shareOffer?id',
            templateUrl: 'views/shareOffer.html'
        })

    $cookiesProvider.defaults.path = '/';
}]);

hpxAdminApp.run(function ($rootScope, $templateCache) {
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
        if (typeof (current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    });
});

hpxAdminApp.run(function ($rootScope, $state, API_URL, Restangular, $cookieStore) {
    Restangular.setBaseUrl(API_URL);
    //$rootScope.identity = $cookieStore.get('customer');

    //var token = '';
    //if ($rootScope.identity) {
    //    token = $rootScope.identity.token;
    //    Restangular.setDefaultHeaders({ 'Authorization': 'Bearer ' + token });
    //}

    Restangular.setRequestInterceptor(function (elem, operation, what) {
        //if (!$rootScope.proc) {
        //    $rootScope.proc = 1;
        //}
        //else {
        //    $rootScope.proc++;
        //}
        //$rootScope.loading = true;

        return elem;
    });
    Restangular.setResponseInterceptor(function (data, operation, what, url, response, deferred) {
        //$rootScope.proc--;
        //if ($rootScope.proc <= 0) {
        //    $rootScope.proc = 0;
        //    $rootScope.loading = false;
        //}

        if (data.meta.code == 411) {
            deferred.reject(data);
            //$rootScope.identity = null;
            //$cookieStore.put('customer', null);
            alert('需要验证！');
        }
        else if (data.meta.code >= 300) {
            deferred.reject(data);
            alert(data.meta.message);
        }
        else {
            return data.data;
        }
    });

    Restangular.setErrorInterceptor(function (resp) {
        //$rootScope.proc--;
        //if ($rootScope.proc <= 0) {
        //    $rootScope.proc = 0;
        //    $rootScope.loading = false;
        //}
        if (resp.status == 401) {
            alert('需要验证！');
        }
        else {
            if (resp.data && resp.data.meta) {
                alert(resp.data.meta.message + "(" + resp.data.meta.code + ")");
            }
            else {
                alert("未知错误! " + resp.status);
            }

            return false;
        }
    });
});

hpxAdminApp.run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});