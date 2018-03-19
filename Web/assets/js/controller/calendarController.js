hpxAdminApp.controller('calendarController', function ($rootScope, $scope, $state, uiCalendarConfig, constantsService, toolService) {
    $scope.filter = {
        billTypeId: 101,
        number: 6,
    };

    constantsService.queryConstantsType(1).then(function (data) {
        $scope.billTypeData = data;
    });

    $scope.uiConfig = {
        calendar: {
            editable: true,
            dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            header: {
                left: 'title',
                center: '',
                right: 'today prev,next'
            }
        }
    };

    toolService.searchCalendar(new Date().getFullYear(), new Date().getMonth() + 1, $scope.filter.billTypeId, $scope.filter.number).then(function (data) {
        //$scope.events = [];
        for (var i = 0; i < data.length; i++) {
            $scope.events.splice($scope.events, 1);
        }
        for (var i = 0; i < data.length; i++) {
            $scope.events.push({
                id: data[i].id,
                title: data[i].bill_calendar_days + '天' + ' ' + data[i].day_status,
                start: new Date(data[i].day),
                allDay: true
            })
        }
        //$scope.eventSources = [$scope.events];
    });


    $scope.show = function () {
        if ($scope.filter.billTypeId == 102) {
            $scope.filter.number = 6;
        }
        toolService.searchCalendar(new Date().getFullYear(), new Date().getMonth() + 1, $scope.filter.billTypeId, $scope.filter.number).then(function (data) {
            //$scope.events = [];
            for (var i = 0; i < data.length; i++) {
                $scope.events.splice($scope.events,1);
            }
            for (var i = 0; i < data.length; i++) {
                $scope.events.push({
                    id: data[i].id,
                    title: data[i].bill_calendar_days + '天' + ' ' + data[i].day_status,
                    start: new Date(data[i].day),
                    allDay: true
                })
            }
            //$scope.eventSources = [$scope.events];
        });
    }
    


    $scope.events = [];
    $scope.eventSources = [$scope.events];

});
