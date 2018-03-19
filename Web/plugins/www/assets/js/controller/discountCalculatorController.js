hpxAdminApp.controller('discountCalculatorController', function ($rootScope, $scope, $state, toolService) {
    var date = new Date();
    var tormorrow = new Date();
    tormorrow.setDate(tormorrow.getDate() + 1);
    $scope.model = {
        "start_time": date.toISOString().slice(0, 10),
        "end_time": tormorrow.toISOString().slice(0, 10),
        "interest_type": "year",
        "bill_type": "elec",
        "adjust_day": 0,
        "days": "",
    };
    $scope.initModel = {};
    angular.copy($scope.model, $scope.initModel);

    $scope.calcuInterest = function (func) {
        var query = {};
        angular.copy($scope.model, query);
        if (!$scope.model.denomination) {
            swal('请输入票面金额.');
            return;
        }
        //通过利率计算
        if (!func) {
            if (!$scope.model.interest) {
                swal('请输入利率.');
                return;
            }
            if (!$scope.model.start_time || !$scope.model.end_time) {
                swal('请输入开始和结束时间.');
                return;
            }
            if (parseInt($scope.model.start_time.replace(/-/g, "")) >= parseInt($scope.model.end_time.replace(/-/g, ""))) {
                swal('贴现时间必须小于到期时间.');
                return;
            }
            if ($scope.model.interest) {
                query['interest_year'] = null;
                query['interest_month'] = null;
                query['interest_' + $scope.model.interest_type] = query.interest;
            }
        } else {
            //十万计算
            if (!$scope.model.every_plus) {
                swal('请输入贴息.');
                return;
            }
            query.start_time = null;
            query.end_time = null;
            if ($scope.model.many_start_time && $scope.model.many_end_time) {
                if (parseInt($scope.model.many_start_time.replace(/-/g, "")) >= parseInt($scope.model.many_end_time.replace(/-/g, ""))) {
                    swal('贴现时间必须小于到期时间.');
                    return;
                }
                query.start_time = $scope.model.many_start_time;
                query.end_time = $scope.model.many_end_time;
            }
        }
        toolService.calculator(query, func).then(function (data) {
            $scope.interestResult = data;
        });
    }
    //选择时间，请求是否假期
    $scope.onTimeSet = function (newDate, oldDate, key) {
        toolService.isCalendarSpecial(newDate).then(function (data) {
            $scope.model[key + '_tip'] = data.holiday_name;
        });
    }
    //重置表单
    $scope.clear = function () {
        angular.copy($scope.initModel, $scope.model);
        $scope.interestResult = "";
    }

    $scope.changeMode = function (mode) {
        $scope.chooseMany = mode;
        $scope.clear();
    }

});
