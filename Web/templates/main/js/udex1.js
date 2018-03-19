$(".ud1").hover(function () {
    $(".ud1").css("border-radius", "50px");
    $(".ud1 img").css("display", "none");
    $(".ud1 label").css("display", "block");
    $(".ud1 label").css("top", "1px");

}, function () {
    $(".ud1 img").css("display", "block");
    $(".ud1").css("border-radius","0%");
    $(".ud1 label").css("display", "none");
    $(".ud1 label").css("top", "-42px");
});
$(".ud2").hover(function () {
    $(".ud2").css("background", "none");
    $(".qf").css("display", "block");
    $(".ud2 label").css("display", "block");
    $(".ud2 span").css("display", "block");

}, function () {
    $(".ud2").css("background", "#d9d9d9");
    $(".qf").css("display", "none");
    $(".ud2 label").css("display", "none");
    $(".ud2 span").css("display", "none");

});
$(".ud3").hover(function () {
    $(".ud3").css("background", "none");
    $(".qf1").css("display", "block");
    $(".ud3 label").css("display", "block");
    $(".ud3 span").css("display", "block");
    $(".kmi").css("display", "block");

}, function () {
    $(".ud3").css("background", "#d9d9d9");
    $(".qf1").css("display", "none");
    $(".ud3 label").css("display", "none");
    $(".ud3 span").css("display", "none");
    $(".kmi").css("display", "none");

});
$(".ud4").hover(function () {
    $(".ud4").css("background", "none");
    $(".qf2").css("display", "block");
    $(".ud4 label").css("display", "block");
    $(".kmi1").css("display", "block");
}, function () {
    $(".ud4").css("background", "#d9d9d9");
    $(".qf2").css("display", "none");
    $(".ud4 label").css("display", "none");
    $(".kmi1").css("display", "none");
});
$(".ud5").hover(function () {
    $(".lkm3").css("display", "none");
    $(".qf3").css("display", "block");
         
}, function () {
    $(".lkm3").css("display", "block");
    $(".qf3").css("display", "none");
});
$(".ud5").click(function () {
    $("html,body").animate({ scrollTop: 0 }, 500);

});
