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
        swal('此功能正在开发中，敬请期待...');
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

    //禁止鼠标右键功能
    function click(e) {
        if (document.all) {
            if (event.button == 1 || event.button == 2 || event.button == 3) {
                oncontextmenu = 'return false';
            }
        }
        if (document.layers) {
            if (e.which == 3) {
                oncontextmenu = 'return false';
            }
        }
    }
    if (document.layers) {
        document.captureEvents(Event.MOUSEDOWN);
    }
    document.onmousedown = click;
    document.oncontextmenu = new Function("return false;")

    var travel = true
    var hotkey = 17      /* hotkey即为热键的键值,是ASII码,这里99代表c键 */
    if (document.layers)
        document.captureEvents(Event.KEYDOWN)
    function gogo(e) {
        if (document.layers) {
            if (e.which == hotkey && travel) {
                alert("操作错误.或许是您按错了按键!");
            }
        }
        else if (document.all) {
            if (event.keyCode == hotkey && travel) { alert("操作错误.或许是您按错了按键!"); }
        }
    }

    document.onkeydown = gogo();
});
