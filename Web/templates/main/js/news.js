var innerGroup = $(".innerwraper");
var leftArrow = $(".left-arrow");
var rightArrow = $(".right-arrow");
var spanGroup = $(".pagination span");
var imgWidth = $(".innerwraper img:first-child").eq(0).width();
var _index = 0;
var timer = null;
var flag = true;
rightArrow.on("click", function () {
    //�Ҽ�ͷ
    flag = false;
    clearInterval(timer);
    _index++;
    selectPic(_index);
})
leftArrow.on("click", function () {
    //���ͷ
    flag = false;
    clearInterval(timer);
    if (_index == 0) {
        _index = innerGroup.length - 1;
        $(".inner").css("left", -(innerGroup.length - 1) * imgWidth);
    }
    _index--;
    selectPic(_index);
})
spanGroup.on("click", function () {
    //�����л�
    _index = spanGroup.index($(this));
    selectPic(_index);
})

$(".container").hover(function () {
    //�������
    clearInterval(timer);
    flag = false;
}, function () {
    flag = true;
    timer = setInterval(go, 3000);
});

function autoGo(bol) {
    //�Զ�����
    if (bol) {
        timer = setInterval(go, 3000);
    }
}
autoGo(flag);

function go() {
    //��ʱ���ĺ���
    _index++;
    selectPic(_index);
}
function selectPic(num) {
    $(".pagination span").eq(num).addClass("active").siblings().removeClass("active");
    $(".inner").animate({
        left: -num * imgWidth,
    }, 1000, function () {
        //����Ƿ����һ��
        if (_index == innerGroup.length - 1) {
            _index %= 8;
            $(".inner").css("left", "0px");
            $(".pagination span").eq(0).addClass("active").siblings().removeClass("active");
        }
    })
}
