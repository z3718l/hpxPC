hpxAdminApp.factory('billService', ['Restangular', function (Restangular) {
    var res = Restangular.all('bills');
    return {
        get: function (id) {
            return res.one(id).get();
        },
        searchBillProduct: function (params, isAlive, billTypeId, billStyleId, billStatusCode, acceptorTypeId, locationId, tradeTypeCode, billCharacterCode, billFlawId) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'isAlive': isAlive,
                'billTypeId': billTypeId,
                'billStyleId': billStyleId,
                'billStatusCode': billStatusCode,
                'acceptorTypeId': acceptorTypeId,
                'locationId': locationId,
                'tradeTypeCode': tradeTypeCode,
                'billCharacterCode': billCharacterCode,
                'billFlawId': billFlawId
            }

            return res.get('billProduct', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_products;
            });
        },
        searchBillOffer: function (params, search, publishingTimeS, publishingTimeB, billStyleId, enterpriseName) {
            var queryParam = {
                'func': 'search',
                'billStyleId': billStyleId,
                'enterpriseName': enterpriseName,
                'publishingTimeS': publishingTimeS,
                'publishingTimeB':publishingTimeB,
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
            }

            return res.get('billOffer', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_offers;
            });
        },
        getBillOffer: function (billOfferId) {
            return res.all('billOffer').one(billOfferId.toString()).get();
        },
        insertBillProduct: function (model) {
            return res.all('bill').post(model);
        },
        getOwnBillProduct: function (params, isAlive, billTypeId, billStyleId) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
                'isAlive': isAlive,
                'billTypeId': billTypeId,
                'billStyleId': billStyleId
            }

            return res.get('bill', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_products;
            });
        },
        newOrderBidding: function (model) {
            return res.all('order').post(model, { 'type': 'bidding' });
        },
        getOwnBillBidding: function (params) {
            var queryParam = {
                'p': params.page(),
                'n': params.count()
            }

            return res.get('bidding', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_product_biddings;
            });
        },
        getOwnBidding: function () {
            return res.get('bidding', {}).then(function (result) {
                return result.bill_product_biddings;
            });
        },

        getOrderWait: function (params) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'orderBy': params.orderBy(),
            }

            return res.get('orderWait', queryParam).then(function (result) {
                return result.bill_confirms;
            });
        },
        confirmOrderWait: function (orderConfirmId, model) {
            return res.all('orderWait').one(orderConfirmId.toString()).customPUT(model);
        },
        getBillProduct: function (billProductId) {
            return res.all('bill').one(billProductId.toString()).get();
        },
        getBillProductBidding: function (billProductId) {
            return res.all('bidding').one(billProductId.toString()).get();
        },
        insertBillBidding: function (model) {
            return res.all('bidding').post(model);
        },
        deleteBillBidding: function (id) {
            return res.all('bidding').one(id.toString()).customDELETE();
        },
        getOwnBillOffer: function (params, billTypeId, billStyleId, maxPrice, tradeLocationId,keyword) {
            var queryParam = {
                'p': params.page(),
                'n': params.count(),
                'keyword':keyword,
                'orderBy': params.orderBy(),
                'billTypeId': billTypeId,
                'billStyleId': billStyleId,
                'tradeLocationId': tradeLocationId,
                'maxPrice':maxPrice
            }

            return res.get('billOffer', queryParam).then(function (result) {
                params.total(result.page_info.items_number);
                return result.bill_offers;
            });
        },
        updateOwnBillOffer: function (model) {
            return res.one('billOffer', model.id).customPUT(model);
        },
        queryOfferData: function () {
            return res.get('billOffer', {}).then(function (result) {
                return result.bill_offer_rates;
            });
        },
        insertBillOffer: function (model) {
            return res.all('billOffer').post(model);
        },

        updateBillOffer: function (model) {
            return res.one('billOffer', model.id).customPUT(model);
        },
        deleteBillOffer: function (billOfferId) {
            return res.all('billOffer').customDELETE(billOfferId);
        },
        billProductElectronic: function () {
            var queryParam = {
                'billTypeId': 101,
                'func': 'home'
            }

            return res.get('billProduct', queryParam);
        },
        billProductPaper: function () {
            var queryParam = {
                'billTypeId': 102,
                'func': 'home'
            }

            return res.get('billProduct', queryParam);
        },
        billOfferPaper: function () {
            var queryParam = {
                'func': 'home'
            }

            return res.get('billOffer', queryParam);
        },

        updateBillProduct: function (billProductId, model) {
            return res.all('bill').one(billProductId.toString()).customPUT(model);
        },
        deleteBill: function (billId) {
            return res.all('bill').customDELETE(billId);
        },
    }
}]);
