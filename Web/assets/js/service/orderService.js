hpxAdminApp.factory('orderService', ['Restangular', function (Restangular) {
    var res = Restangular.all('orders');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        orderCount: function () {
            return res.get('orderCount', {});
        },
        getOwnOrderDrawer: function (params) {
            var queryParam = {
                'role': 'drawer',
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('order', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.orders;
            });
        },
        getOwnOrderReceiver: function (params) {
            var queryParam = {
                'role': 'receiver',
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy()
            }

            return res.get('order', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.orders;
            });
        },
        getOrder: function (orderId) {
            return res.all('order').one(orderId.toString()).get();
        },
        orderPayCommission: function (orderId) {
            return res.all('orderCommission').one(orderId.toString()).put();
        },
        orderPay: function (orderId, model) {
            return res.all('orderPay').one(orderId.toString()).customPUT(model);
        },
        updateOrderReceiver: function (orderId, model) {
            return res.all('orderReceiver').one(orderId.toString()).customPUT(model);
        },
        //orderPay: function (orderId) {
        //    return res.all('orderPay').all('temp').one(orderId.toString()).get();
        //},
        //orderPayConfirm: function (orderId) {
        //    return res.all('orderPayConfirm').all('temp').one(orderId.toString()).get();
        //},
        orderEndorsement: function (orderId, model) {
            return res.all('orderEndorsement').one(orderId.toString()).customPUT(model);
        },
        getOrderEndorsement: function (orderId) {
            return res.all('orderEndorsement').one(orderId.toString()).get();
        },
        deleteOrderEndorsement: function (orderId) {
            return res.all('orderEndorsement').one(orderId.toString()).remove();
        },
        orderLogistics: function (orderLogisticId, model) {
            return res.all('orderLogistic').one(orderLogisticId.toString()).customPUT(model);
        },
        orderConfirm: function (orderId) {
            return res.all('orderConfirm').one(orderId.toString()).get();
        },
        orderFinish: function (orderId) {
            return res.all('orderFinish').one(orderId.toString()).get();
        },
        orderAppraisal: function (orderId, model) {
            return res.all('orderAppraisal').one(orderId.toString()).customPUT(model);
        },
        getOrderRunning: function (role) {
            var queryParam = {
                'func': 'count',
                'role': role
            }

            return res.get('order', queryParam);
        },
    }
}]);
