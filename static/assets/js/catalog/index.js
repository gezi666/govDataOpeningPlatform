$(document).ready(function () {

    bindEvent();

});

//ghm-左侧菜单
function bindEvent() {

    $(".tree-type li").click(function () {

        $(".tree-type li").removeClass("active");
        $(this).addClass("active");

        var treeTypeIndex = $(this).index()+1;
        $(".left-bar").removeClass("active");
        $(".bar"+treeTypeIndex).addClass("active");


    });
    $(".left-bar div a").click(function (){
        $(this).next(".clickable-content").slideToggle();
        $(this).find(".icon-arrow-t").removeClass("icon-arrow-t").addClass("icon-arrow-left");
    });
}
