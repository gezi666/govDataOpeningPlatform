/**
 * Created by guohuimin on 2017/11/21.
 */
var pageNum = 10, txtNeed = "", txtAdvise = "";
$(function () {

    // 切换
    $(document).ready(function () {

        isOnLine();

        $("#tabBox-ul li").click(function () {
            var index = $(this).index();
            $(this).addClass("active").siblings().removeClass("active");
            $(".form-box").eq(index).show().siblings(".form-box").hide();
        })

        var flag = tool.getParams("flag");
        if (flag == 1 || flag == 2) {
            flag = parseInt(flag);
            $("#tabBox-ul li:eq(" + (1 + flag) + ")").click();
        }
    })

    personalDetails();
    myNeed(true, 1)
    mySuggest(true, 1);

})
//个人信息
function personalDetails() {

    api.get('/user/myMessage').done(function (res) {
        tool.renderList('#personal-details', '#personal-details-template', res.data[0])
    })
}

//保存个人信息
function saveInfo() {

    var registerName = $("#registerName").val();
    var realName = $("#realName").val();
    var personagePhone = $("#personagePhone").val();
    var personageMail = $("#personageMail").val();

    if (!validateUser("realName", "请输入真实姓名")) {
        return;
    } else if (!validateUser("personagePhone", "请输入移动电话")) {
        return;
    } else if (!tool.validatePhone(personagePhone)) {
        $("#userMsg").text("电话号码格式错误");
        $("#personagePhone").focus();
        emptyMsg();
        return;
    } else if (personageMail && !tool.validateEmail(personageMail)) {
        $("#userMsg").text("请输入正确的邮箱格式");
        $("#personageMail").focus();
        emptyMsg();
        return;
    }
    var params = {
        'loginname': registerName,
        'realname': realName,
        'phone': personagePhone,
        'email': personageMail
    }

    api.post('/user/alterMyMessage', params).done(function (res) {
        $("#userMsg").text(res.result == 1 ? "修改成功" : res.msg);
        emptyMsg();
    });
}

function validateUser(container, msg) {
    if (!$("#" + container).val()) {
        $("#userMsg").text(msg);
        $("#" + container).focus();
        emptyMsg();
        return false;
    }
    return true;
}


function emptyMsg() {
    setTimeout(function () {
        $("#userMsg").empty();
        $("#pwdMsg").empty();
    }, 3000)
}

//修改密码
function changePwd() {

    var oldPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword").val();
    var surePassword = $("#surePassword").val();

    if (!oldPassword) {
        $("#pwdMsg").text("请输入原密码");
        $("#oldPassword").focus();
        emptyMsg();
        return;
    } else if (!newPassword) {
        $("#pwdMsg").text("请输入新密码");
        $("#newPassword").focus();
        emptyMsg();
        return;
    } else if (newPassword.length < 6) {
        $("#pwdMsg").text("登录密码最少6位");
        $("#newPassword").focus();
        emptyMsg();
        return;
    } else if (!surePassword) {
        $("#pwdMsg").text("请输入确认密码");
        $("#surePassword").focus();
        emptyMsg();
        return;
    }else if (newPassword != surePassword) {
        $("#pwdMsg").text("二次密码输入不一致");
        $("#surePassword").focus();
        emptyMsg();
        return;
    }

    var params = {
        'oldPassword': oldPassword, //原密码
        'password': newPassword, //新密码
        'surePassword': surePassword //确认密码
    };
    api.post('/user/alterPassword', params).done(function (res) {
        $("#pwdMsg").text(res.result == 1 ? "修改成功" : res.msg);
        emptyMsg();
    })
}

//我的需求
function myNeed(isLoadPaganation, pageIndex) {
    var params = {
        "page": pageIndex,
        "rows": pageNum,
        "PL_DEMAND_TITLE": txtNeed
    }
    api.get('/demandApply/myDemand', params).done(function (res) {
        //console.log(res.data);
        if (typeof(res) == 'string') {
            res = $.parseJSON(res)
        }
        tool.renderList('#data-myneed-table', '#data-myneed-table-template', res.data);

        if (isLoadPaganation) {
            var totalPage = Math.ceil(res.count / pageNum);
            $("#totalNums1").html(res.count);
            $('#spage1').html('共' + totalPage + '页，每页' + pageNum + '条')
            initPagination("page1", res.count);
        }
    });
}

//我的建议
function mySuggest(isLoadPaganation, pageIndex) {
    var params = {
        "page": pageIndex,
        "rows": pageNum,
        "PL_ADVISE_TITLE": txtAdvise
    }
    api.get('/adviseFeedback/myAdvise', params).done(function (res) {
        //console.log(res.data);
        tool.renderList('#data-suggest-table', '#data-suggest-table-template', res.data);
        if (isLoadPaganation) {
            var totalPage = Math.ceil(res.count / pageNum);
            $("#totalNums2").html(res.count);
            $('#spage2').html('共' + totalPage + '页，每页' + pageNum + '条')
            initPagination("page2", res.count);
        }
    })
}

function search(type) {
    if (type == 1) {
        txtNeed = $("#txtNeed").val();
        myNeed(true, 1);
    } else {
        txtAdvise = $("#txtAdvise").val();
        mySuggest(true, 1);
    }
}

function initPagination(containerId, totalNum) {

    $("#"+containerId)[totalNum>0?"show":"hide"]();
    $('#' + containerId).pagination({
        totalData: totalNum,
        showData: pageNum,
        count: 1,
        current: 1,
        prevCls: 'item-first',
        nextCls: 'item-last',
        homePage: '首页',
        endPage: '末页',
        prevContent: '上页',
        nextContent: '下页',
        activeCls: 'item-active',
        jumpBtnCls: 'btn-queding',
        jumpBtn: '跳转',
        coping: true,
        isHide: false,
        jump: true,
        callback: function (api) {
            if (containerId == "page1")
                myNeed(false, api.getCurrent());
            else
                mySuggest(false, api.getCurrent());
        }
    });
}

function isOnLine() {

    var user = User.getCurrUser();
    if (user == null)
        location.href = "../index/index.html";
}

//搜索回车事件
function keyDemand() {
    if(event.keyCode ==13){
        search(1)
    }
}
function keySuggest() {
    if(event.keyCode ==13){
        search(2)
    }
}