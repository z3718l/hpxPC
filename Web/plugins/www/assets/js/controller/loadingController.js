hpxAdminApp.controller('loadingController', function ($rootScope, $scope, $state) {
    $(document).scroll(function () {
        $(".loading-modal").css("height", document.body.scrollHeight);
        $(".loader").css("top", document.body.clientHeight * 0.35 + document.body.scrollTop);
    });
});
