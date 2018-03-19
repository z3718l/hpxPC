hpxAdminApp.controller('sidebarController', function ($scope, $rootScope, $state, $location,userService) {
    $scope.$emit('refreshMenu');

    $scope.menuClick = function (id) {
        var target = $('#' + id);
        var otherMenu = '.sidebar .nav > li.has-sub > .sub-menu';
        if ($('.page-sidebar-minified').length === 0) {
            $(otherMenu).not(target).slideUp(250, function () {
                $(this).closest('li').removeClass('expand');
            });
            $(target).slideToggle(250, function () {
                var targetLi = $(this).closest('li');
                if ($(targetLi).hasClass('expand')) {
                    $(targetLi).removeClass('expand');
                } else {
                    $(targetLi).addClass('expand');
                }
            });
        }
    }

    $state.includes = function(name){
        var parentMenu = $("#"+name);

        if(parentMenu.attr("is-parent")) {
            var url = $location.url();
            if(parentMenu.hasClass('active')){
                parentMenu.removeClass('active');
            }
            parentMenu.find('ul>li>a').each(function(){
                var sref = $(this).attr("href");
                var curUrl = sref.replace("#","");
                if(curUrl === url){
                    $("#"+name).addClass('active');
                    $(this).parent().addClass('active');
                    return false;
                }
            });
        }
    }

    $scope.subMenuClick = function (id) {
        if ($('.page-sidebar-minified').length === 0) {
            var target = $('#' + id);
            $(target).slideToggle(250);
        }
    }

    App.initSidebar();
});
