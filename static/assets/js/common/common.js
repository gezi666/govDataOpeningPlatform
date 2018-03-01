/**
 * Created by guohuimin on 2017/10/25.
 */
$(document).ready(function () {

    $(".head-login-txt").click(function () {
        if ($(".head-login-dis").hasClass("head-login-show")) {
            $(".head-login-dis").stop().removeClass("head-login-show").slideUp();
        } else {
            $(".head-login-dis").stop().addClass("head-login-show").slideDown();
        }
    })
});
