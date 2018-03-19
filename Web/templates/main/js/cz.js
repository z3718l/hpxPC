var oCon = $('.con .ji')
console.log(oCon)
for (var i = 0; i < oCon.length; i++) {
    // var index = i
    $('.con .ji').eq(i).click(function () {
        var num = $(this).index()
        console.log(num)
        sessionStorage.setItem('gnum', num)
        // // console.log(gnum)
        // var gnum = sessionStorage.setItem(num)
        // console.log(gnum)
    })
}