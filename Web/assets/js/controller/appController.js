hpxAdminApp.controller('appController', function ($rootScope, $scope, $state) {
    $scope.getFirst = function (params) {
        if (params.total() <= (params.page() - 1) * params.count()) {
            return Math.floor(params.total() / params.count()) * params.count() + 1;
        }
        else {
            return (params.page() - 1) * params.count() + 1;
        }
    };

    $scope.tbd = function () {
        alert('此功能正在开发中，敬请期待...');
    };

    //大写的金额
    $scope.amountInWords = function(n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
            return "";
        var unit = "千百拾亿千百拾万千百拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
    }
});
