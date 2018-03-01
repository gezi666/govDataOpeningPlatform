/**
 * Created by guohuimin on 2017/11/17.
 */
$(function () {
    // 切换
    $(document).ready(function () {
        $("#tabBox-ul li").click(function () {
            var index = $(this).index();
            $(this).addClass("active").siblings().removeClass("active");
            $(".form-box").eq(index).show().siblings(".form-box").hide();
        })
    })
    //registerVef(); //获取验证码
})
function getRegisterData() {

    var loginname = $("#loginnameID").val();
    var loginpassword = $("#loginpasswordID").val();
    var loginAffirmpassword = $("#loginAffirmpasswordID").val();
    var realname = $("#realnameID").val();
    var phone = $("#phoneID").val();
    var email = $("#emailID").val();
    var companyname = $("#companynameID").val();
    var creditcode = $("#authCode").val();

    if (!validatePeo("loginnameID", "个人登录用户名不能为空")) {
        return;
    } else if (!validatePeo("loginpasswordID", "登录密码不能为空")) {
        return;
    } else if (loginpassword.length < 6) {
        $("#peoMsg").text("登录密码最少6位");
        $("#loginpasswordID").focus();
        emptyMsg();
        return;
    } else if (!validatePeo("loginAffirmpasswordID", "确认密码不能为空")) {
        return;
    } else if (loginpassword != loginAffirmpassword) {
        $("#peoMsg").text("二次密码输入不一致");
        $("#loginAffirmpasswordID").focus();
        emptyMsg();
        return;
    } else if (!validatePeo("realnameID", "真实姓名不能为空")) {
        return;
    } else if (!validatePeo("phoneID", "电话不能为空")) {
        return;
    } else if (!tool.validatePhone(phone)) {
        $("#peoMsg").text("电话号码格式错误");
        $("#phoneID").focus();
        emptyMsg();
        return;
    } else if (email && !tool.validateEmail(email)) {
        $("#peoMsg").text("请输入正确的邮箱格式");
        $("#emailID").focus();
        emptyMsg();
        return;
    } else if (!validatePeo("authCode", "验证码不能为空")) {
        return;
    } else if (!$("#chkAgree")[0].checked) {
        $("#peoMsg").text("请勾选我已阅读并同意");
        emptyMsg();
        return;
    }

    var params = {
        'registertype': 1,    //注册类型：1 个人注册 2单位注册
        'loginname': loginname,  //单位/个人用户名称
        'loginpassword': loginpassword,   //登录密码
        'realname': realname,    //真实姓名
        'phone': phone,   //移动电话
        'email': email,   //电子邮箱
        'companytype': 1,  //单位类型
        'companyname': companyname,  //单位名称
        'imgcode': creditcode     //验证码
    }
    api.post('/user/register', params).done(function (res) {
        console.log(res);
        $("#peoMsg").text(res.result == 1 ? "个人注册成功" : res.msg);
        emptyMsg();
        if (res.result == 1) resetPeo();
    });
}

function resetPeo() {
    $("#loginnameID").val("");
    $("#loginpasswordID").val("");
    $("#loginAffirmpasswordID").val("");
    $("#realnameID").val("");
    $("#phoneID").val("");
    $("#emailID").val("");
    $("#authCode").val("");
}

function validatePeo(container, msg) {
    if (!$("#" + container).val()) {
        $("#peoMsg").text(msg);
        $("#" + container).focus();
        emptyMsg();
        return false;
    }
    return true;
}

function emptyMsg() {
    setTimeout(function () {
        $("#peoMsg").empty();
        $("#comMsg").empty();
    }, 3000)
}

function getInfoData() {

    var loginname = $("#loginnameIDinfo").val();
    var companytype = $("#companytypeIDinfo").val();
    var companyname = $("#companynameIDinfo").val();
    var loginpassword = $("#loginpasswordIDinfo").val();
    var loginAffirmpassword = $("#loginAffirmpasswordIDinfo").val();
    var realname = $("#realnameIDinfo").val();
    var phone = $("#phoneIDinfo").val();
    var email = $("#emailIDinfo").val();
    var creditcode = $("#creditcodeIDinfo").val();
    var imgCode = $("#authCode2").val();
    
    if (!validateCom("loginnameIDinfo", "单位登录用户名不能为空")) {
        return;
    } else if (!validateCom("companytypeIDinfo", "请选择单位类型")) {
        return;
    } else if (!validateCom("companynameIDinfo", "单位名称不能为空")) {
        return;
    } else if (!validateCom("loginpasswordIDinfo", "登录密码不能为空")) {
        return;
    } else if (loginpassword.length < 6) {
        $("#comMsg").text("登录密码最少6位");
        $("#loginpasswordIDinfo").focus();
        emptyMsg();
        return;
    } else if (!validateCom("loginAffirmpasswordIDinfo", "确认密码不能为空")) {
        return;
    } else if (loginpassword != loginAffirmpassword) {
        $("#comMsg").text("二次密码输入不一致");
        $("#loginAffirmpasswordIDinfo").focus();
        emptyMsg();
        return;
    } else if (!validateCom("realnameIDinfo", "真实姓名不能为空")) {
        return;
    } else if (!validateCom("phoneIDinfo", "移动电话不能为空")) {
        return;
    } else if (!tool.validatePhone(phone)) {
        $("#comMsg").text("电话号码格式错误");
        $("#phoneIDinfo").focus();
        emptyMsg();
        return;
    } else if (email && !tool.validateEmail(email)) {
        $("#comMsg").text("请输入正确的邮箱格式");
        $("#emailIDinfo").focus();
        emptyMsg();
        return;
    } else if (!validateCom("authCode2", "验证码不能为空")) {
        return;
    } else if (!$("#comChkAgree")[0].checked) {
        $("#comMsg").text("请勾选我已阅读并同意");
        emptyMsg();
        return;
    }
    var params = {
        'registertype': 2,    //注册类型：1 个人注册 2单位注册
        'loginname': loginname,  //单位/个人用户名称
        'loginpassword': loginpassword,   //登录密码
        'realname': realname,    //真实姓名
        'phone': phone,   //移动电话
        'email': email,   //电子邮箱
        'companytype': companytype,  //单位类型
        'companyname': companyname,  //单位名称
        'creditcode': creditcode,     //统一社会信用代码
        'imgcode': imgCode    //验证码
    }
    api.post('/user/register', params).done(function (res) {
        $("#comMsg").text(res.result == 1 ? "单位注册成功" : res.msg);
        if (res.result == 1) resetCom();
    });
}

function validateCom(container, msg) {
    if (!$("#" + container).val()) {
        $("#comMsg").text(msg);
        $("#" + container).focus();
        emptyMsg();
        return false;
    }
    return true;
}

function resetCom() {

    $("#loginnameIDinfo").val("");
    $("#companytypeIDinfo").val("");
    $("#companynameIDinfo").val("");
    $("#loginpasswordIDinfo").val("");
    $("#loginAffirmpasswordIDinfo").val("");
    $("#realnameIDinfo").val("");
    $("#phoneIDinfo").val("");
    $("#emailIDinfo").val("");
    $("#verification").val("");
}

//获取验证码
function registerVef() {
    $(".register-verification-img").attr("src", servicePath + "/user/imageCode?num=" + Math.random());
}