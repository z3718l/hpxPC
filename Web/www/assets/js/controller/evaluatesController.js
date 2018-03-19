hpxAdminApp.controller('evaluatesController', function ($rootScope, $scope, $state, $timeout, $stateParams, $interval, FILE_URL, Upload, ngTableParams, orderService, billService, customerService, payingService, enterprisesService) {
    $scope.filter = {
        star: 0,
    };
    $scope.evalutaModel = {
        description: null,
    };
    $scope.addevaluateModel = {
        additional_description: null,
    };
    $scope.model = {
        type_id: $stateParams.type_id,
        to_id: $stateParams.to_id,
        gettype: $stateParams.gettype,
        star: 0,
        bill_status_code: 810,
        order_status_id: 810,
        description: null,
        additional_description: null,
    };

    //发布方评价
    $scope.clickimg1 = function () {
        var star = document.getElementById("star1");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 1;
    };
    $scope.clickimg2 = function () {
        var star = document.getElementById("star2");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 2;
    };
    $scope.clickimg3 = function () {
        var star = document.getElementById("star3");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 3;
    };
    $scope.clickimg4 = function () {
        var star = document.getElementById("star4");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 4;
    };
    $scope.clickimg5 = function () {
        var star = document.getElementById("star5");
        star.src = "assets/img/stars2.png";
        $scope.filter.star = 5;
    };
    $scope.showEvaluatesell = function () {
        $scope.model.star = $scope.filter.star;

        enterprisesService.insertAppraisal($scope.model).then(function (data) {
            $state.go('app.main.myBill');
        });
    };
    //追加评价
    $scope.showaddEvaluatesell = function () {
        $scope.addevaluatesell = {};
        $scope.model.additional_description = $scope.addevaluateModel.additional_description;
        $state.go('app.main.myBill');
    };
    init = function () {
        if ($scope.model.type_id == 101) {
            orderService.getOrder($scope.model.to_id).then(function (data) {
                $scope.orderModel = data;
                $scope.model.bill_status_code = data.bill_status_code;
                $scope.model.order_status_id = data.order_status_id;

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                    });
                }
            });
        } else if ($scope.model.type_id == 102) {
            billService.getBillProduct($scope.model.to_id).then(function (data) {
                $scope.billModel = data;
                $scope.model.bill_status_code = data.bill_status_code;

                if ($scope.model.bill_status_code > 810) {
                    enterprisesService.getorderAppraisal($scope.model.type_id, $scope.model.to_id).then(function (data) {
                        $scope.drawerevalutaModel = data.drawer_appraisal;
                        $scope.receiverevalutaModel = data.receiver_appraisal;
                    });
                }
            });
        };

    };
    init();

});