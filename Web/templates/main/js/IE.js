$(function () {

    $("input[type='text'],textarea").bind({
        "focus": function () {
            var placeholderVal = $(this).attr("placeholder");
            var realVal = $(this).val();
            if ($.trim(realVal) == placeholderVal) {
                $(this).val("");
            }
        },
        "blur": function () {
            var placeholderVal = $(this).attr("placeholder");
            var realVal = $(this).val();
            if ($.trim(realVal) == "") {
                $(this).val(placeholderVal);
            }
        }
    });

    $("input[type='text'],textarea").each(function (i, n) {
        $(this).val($(this).attr("placeholder"));
    });


    $("input[type='password']").bind({
        "focus": function () {
            var placeholderVal = $(this).attr("placeholder");
            var realVal = $(this).val();
            if ($.trim(realVal) == placeholderVal) {
                var copy_this = $(this).clone(true, true);
                $(copy_this).attr("type", "password");
                $(copy_this).insertAfter($(this));
                $(this).remove();
                $(copy_this).val("");
                $(copy_this).focus();
            }
        },
        "blur": function () {
            var placeholderVal = $(this).attr("placeholder");
            var realVal = $(this).val();
            if ($.trim(realVal) == "") {
                var copy_this = $(this).clone(true, true);
                $(copy_this).attr("type", "text");
                $(copy_this).insertAfter($(this));
                $(this).remove();
                $(copy_this).val(placeholderVal);
            }
        }
    });

    $("input[type='password']").each(function (i, n) {
        var placeHolderVal = $(this).attr("placeholder");
        var copy_this = $(this).clone(true, true);
        $(copy_this).attr("type", "text");
        $(copy_this).insertAfter($(this));
        $(this).remove();
        $(copy_this).val(placeHolderVal);
    });
});
