ionicApp.controller('billOfferDetailController', function ($scope, $rootScope, $state, $ionicPopup, billService, enterprisesService, toolService, customerService) {
    $scope.appraisalModel = {};
    billService.getBillOffer($rootScope.billOfferbillOfferId).then(function (data) {
        $scope.model = data;
        toolService.getStars($scope.model.enterprise_id).then(function (data) {
            $scope.star = data;
        });
        $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
    });
    $scope.getorderAppraisal = function () {
        //enterprisesService.getorderAppraisal('101', $scope.model.id).then(function (data) {
        //    $scope.appraisalModel = data;
        //});
    }
    $scope.changeBillStyleId = function (bill_style_id) {
        if (bill_style_id == $scope.model.bill_style_id)
            return;
        $scope.params = $scope.Params.Create('-offer_time', 1);
        $scope.filter = {
            search: '',
            publishingTimeS: '',
            publishingTimeB: '',
            tradeLocationId: '',
        };
        //billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, $scope.filter.billStyleId[0], $scope.filter.enterpriseName, $scope.filter.tradeLocationId).then(function (data) {
           
        billService.searchBillOffer($scope.params, $scope.filter.search, $scope.filter.publishingTimeS, $scope.filter.publishingTimeB, bill_style_id, $scope.model.enterprise_name, $scope.filter.tradeLocationId).then(function (data) {
            if (!data[0]) {
                $ionicPopup.alert({
                    title: "通知",
                    template: "没有该类报价信息！",
                    okType: "button-assertive",
                });
            }
            else {
                $scope.model = data[0];
                $scope.model.offer_detail = JSON.parse($scope.model.offer_detail);
            }
        })
    }
    $scope.follow = function (follow) {
        $scope.followModel = {
            collection_enterprise_id: $scope.model.enterprise_id,
            is_collection_enterprise: follow
        }
        customerService.followEnterprise($scope.followModel).then(function () {
            $scope.model.is_collection_enterprise = follow;
        })
    }

    $scope.share = function () {
        $(".g-alert-shares").fadeIn(300);
    };

    $scope.shareClose = function () {
        $(".g-alert-shares").fadeOut(300);
    };

    $scope.shareToWechatFriend = function () {
        Wechat.share({
            text: "分享内容",
            scene: Wechat.Scene.TIMELINE
        }, function () {
            alert("Success");
        }, function (reason) {
            alert("Failed: " + reason);
        });
    };

    $scope.shareToWechat = function () {
        Wechat.share({
            text: "分享内容",
            scene: Wechat.Scene.SESSION
        }, function () {
            alert("Success");
        }, function (reason) {
            alert("Failed: " + reason);
        });
    };

    $scope.shareToWeibo = function () {
        var args = {};
        args.url = 'https://www.huipiaoxian.com';
        args.title = '分享标题';
        args.description = '分享内容';
        args.image = 'https://cordova.apache.org/static/img/pluggy.png';
        WeiboSDK.shareToWeibo(function () {
            alert('share success');
        }, function (failReason) {
            alert(failReason);
        }, args);
    };

    $scope.shareToQQ = function () {
        var args = {};
        args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        args.scene = QQSDK.Scene.QQ;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
        args.text = '分享内容';
        QQSDK.shareText(function () {
            alert('shareText success');
        }, function (failReason) {
            alert(failReason);
        }, args);
    };

    $scope.shareToQQZone = function () {
        var args = {};
        args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        args.scene = QQSDK.Scene.QQZone;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
        args.text = '分享内容';
        QQSDK.shareText(function () {
            alert('shareText success');
        }, function (failReason) {
            alert(failReason);
        }, args);
    };
})