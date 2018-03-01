
var timer;  //计时器

$(function(){
    //tab切换
    $("#tabBox-ul li").click(function () {
        var index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $(".form-box").eq(index).show().siblings(".form-box").hide();
    })
    //点击划出部门
	$(document).on('click', function (e) {
        $(".he-bmchange-dis").stop().removeClass("active").slideUp("fast");
    });
    $('.he-bmchange-dis').on('click', function (e) {
        e.stopPropagation();
    });
    $('.he-bmchange').on('click', function (e) {
        e.stopPropagation();
    });
    $(".he-bmchange-r").click(function () {
        if ($(".he-bmchange-dis").hasClass("active")) {
            $(this).find(".he-bmchange-dis").stop().removeClass("active").slideUp("fast");
        } else {
            $(this).find(".he-bmchange-dis").stop().addClass("active").slideDown("fast");
        }
    })

    
    //postFunctionDept(); //获取职能部门
    delBm();//删除部门
})
//增加部门
function addBm(){
    $(".he-bmchange-dis li").click(function(){
        var bmLen = $(".he-bmchange-l").find("li").length;
        var checkedTxt = $(this).text();
        var checkedId = $(this).attr("id");
        if(bmLen == 3){
            $(this).parent("ul").siblings(".he-bmchange-tip").text("最多选择三个部门");
            setTimeout(function(){
                $(".he-bmchange-tip").text("");
            },3000)
            return;
        }
        var compared = $(".he-bmchange-l ul li").text();
        if(compared.indexOf(checkedTxt) >=0 ){
            $(this).parent("ul").siblings(".he-bmchange-tip").text('重复选中：'+checkedTxt);
            setTimeout(function(){
                $(".he-bmchange-tip").text("");
            },3000)
            return;
        }else{
            var addTxt = '<li id="'+checkedId+'">'+checkedTxt+'<i>&times;</i></li>'
            $(".he-bmchange-l ul").append(addTxt);
            delBm();
        }            
    })
}
//删除部门
function delBm(){
    $(".he-bmchange-l li i").click(function(){
        $(this).parent("li").remove();
    })
}
//获取职能部门
function postFunctionDept(){
    api.post('/openStatistics/getFunctionDept').done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res)
        }
        
        tool.renderList('#functiondept', '#functiondept-template', res);
        addBm(); //增加部门
    })
}

//判断是否登录
function isLogin(){
    if(tool.getCookie('currUser')){
        return true
    } else {
        return null
    }
}

//提交反馈
function postFeedback(){

    clearTimeout(timer)

    //判断是否登录
    if(!isLogin()) {
        $("#feedback-error").text('请登录后再提交');
        setTimeout(function () {
            $("#feedback-error").empty();
        }, 3000)
        return
    }

    var fbTitle = $("#fbTitle").val();
    var fbDetails = $("#fbDetails").val();;
    var params = {
        "advise_title":fbTitle, 
        "advise_details":fbDetails
    }
    if (fbTitle == '') {
        $("#feedback-error").text('请填写标题');
        timer = setTimeout(function () {
            $("#feedback-error").empty();
        }, 3000)
        return;
    }else if(fbTitle.length >= 50){
        $("#feedback-error").text('标题文字数量不可超过50字');
        timer = setTimeout(function () {
            $("#feedback-error").empty();
        }, 3000)
        return;
    }else if(fbDetails == ''){
        $("#feedback-error").text('请填写详情');
        timer = setTimeout(function () {
            $("#feedback-error").empty();
        }, 3000)
        return;
    }else if(fbDetails.length >= 500){
        $("#feedback-error").text('详情文字数量不可超过500字');
        timer = setTimeout(function () {
            $("#feedback-error").empty();
        }, 3000)
        return;
    }
    api.post('/adviseFeedback/submitAdvise',params).done(function (res) {
        $(".btn-he").css("display","none").siblings(".btn-he-dis").css("display","block");
        $("#feedback-error").html('<span style="color:#018fee;">提交成功</span>');
        // $("#fbTitle").val('');
        // $("#fbDetails").val('');
        timer = setTimeout(function () {
            $(".btn-he-dis").css("display","none").siblings(".btn-he").css("display","block");
            $("#feedback-error").empty();
            window.location.href = '../user/info.html?flag=2'   //跳转到个人中心--我的建议
        }, 500)
    })
}

//提交需求
function postDemand(){

    clearTimeout(timer)

    //判断是否登录
    if(!isLogin()) {
        $("#demand-error").text('请登录后再提交');
        setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return
    }
    
    //获取用途列表
    var useList = ''
    $('.he-label input[type="checkbox"]').each(function(){
        if($(this).is(':checked')){
            if(useList == ''){
                useList = $(this).val()
            } else{
                useList += ','+ $(this).val()
            }
        }
    })

    //获取职能部门id列表
    var detpList = ''
    $('.he-bmchange-l li').each(function(){
        if(detpList == ''){
            detpList = $(this).attr('id')
        } else{
            detpList += ','+ $(this).attr('id')
        }
    })

    var title = $("#title").val();  //需求标题
    var type = $('.he-label input[type="radio"]:checked').val();   //需求类型：1-文件数据 2-API服务
    var describe = $('.demand-describe').val();   //需求描述
    var purpose = useList;    //用途：1-学习 2-研究 3-商业 4-公益 5-教育 6-其他
    var detp = detpList; //职能部门选择
    

    var params = {
        "PL_DEMAND_TITLE":title, 
        "PL_DEMAND_TYPE":type,
        "PL_DEMAND_DESCRIBE":describe,
        "PL_DEMAND_PURPOSE":purpose,
        "PL_FUNCTION_DEPT_SELECT":detp
    }
    console.log(title.value)

    if (title == '') {
        $("#demand-error").text('请填写需求标题');
        timer = setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return;
    }else if(title.length >= 50){
        $("#demand-error").text('需求标题文字数量不可超过50字');
        timer = setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return;
    }else if(type == ''){
        $("#demand-error").text('请选择需求类型');
        timer = setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return;
    }else if(describe == ''){
        $("#demand-error").text('请填写需求描述');
        timer = setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return;
    }else if(describe.length >= 500){
        $("#demand-error").text('需求描述文字数量不可超过500字');
        timer = setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return;
    }else if(purpose == ''){
        $("#demand-error").text('请填选择用途');
        timer = setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return;
    }else if(detp == ''){
        $("#demand-error").text('请填选择职能部门');
        timer = setTimeout(function () {
            $("#demand-error").empty();
        }, 3000)
        return;
    }
    api.post('/demandApply/submitDemand',params).done(function (res) {
        $(".btn-he").css("display","none").siblings(".btn-he-dis").css("display","block");
        $("#demand-error").html('<span style="color:#018fee;">提交成功</span>');
        timer = setTimeout(function () {
            $(".btn-he-dis").css("display","none").siblings(".btn-he").css("display","block");
            $("#demand-error").empty();
            window.location.href = '../user/info.html?flag=1'   //跳转到个人中心--我的需求
        }, 500)
    })
}