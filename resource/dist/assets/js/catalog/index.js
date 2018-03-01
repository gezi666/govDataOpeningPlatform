var icons = ['icon-shujutongji', 'icon-shuju', 'icon-yingji', 'icon-xinyongtixi', 'icon-huanbao', 'icon-qiandai', 'icon-shehuibaozhang', 'icon-anquanshengchan', 'icon-erjishichang',
        'icon-quanbu', "icon-zhufang", "icon-jiankangxin", "icon-anquan", 'icon-guojiaanquanyaopin'],
    treeNodeCls = [".one-catalog", ".two-catalog", ".three-catalog", ".four-catalog"];

var type=1,code,sort;

var flag = 0
var initFlag = true  // 页面初始化标记
var eachPageCount = 5   //分页每页显示的条数
var providMode = ''    //提供方式
var inputtext = ''     //搜索内容
var createtime = 'desc'    //   发布时间排序（必填）
var accesscount = ''   //   访问量排序    asc=正序，desc=倒序
var downcount = ''   //   下载量排序    asc=正序，desc=倒序
var callcount = ''   //   调用量排序    asc=正序，desc=倒序
var pCode;           //左侧菜单节点code

$(document).ready(function () {

    type = tool.getParams("type") || 0;
    code = tool.getParams("code");
    pCode= tool.getParams("code");
    sort= tool.getParams("sort");     //排序方式  0-按发布时间；1-按访问量；2-按下载量
    
    if($('.item-basic').attr('code') == ''){
       getClassificationCode()     //获取资源分类码
   }

    if(sort){
        if(sort == '0'){
            $('.publish-sort').addClass("active").siblings().removeClass("active")
            createtime = 'desc'
            accesscount = ''
            downcount = ''
        } else if(sort == '1'){
            $('.visit-sort').addClass("active").siblings().removeClass("active")
            createtime = ''
            accesscount = 'desc'
            downcount = ''
        } else if(sort == '2'){
            $('.download-sort').addClass("active").siblings().removeClass("active")
            createtime = ''
            accesscount = ''
            downcount = 'desc'
        }
    }

    registerHandHelp();

    if(!pCode){
        getListData({          //获取列表数据
            "code": "",
            "type": "",
            "inputtext": "",
            "createtime": createtime,
            "accesscount": accesscount,
            "downnum": downcount,
            "callnum": "",
            "page": 1,
            "rows": eachPageCount
        })
    }

    //选择共享方式
    $('.mode-item').click(function(){
        $(this).addClass("active").siblings().removeClass("active")
    })

    // 排序功能
    $('body').delegate(".sort-item","click",function(){
        
        $(this).addClass('active').siblings().removeClass('active')

        var sortName = $(this).text()
        if(sortName == "按访问量"){
            accesscount = "desc"
            createtime = ""
            downcount = ""
            callcount = ""
        } else if(sortName == "按发布时间"){
            createtime = "desc"
            accesscount = ""
            downcount = ""
            callcount = ""
        } else if(sortName == "按下载量"){
            createtime = ""
            accesscount = ""
            downcount = "desc"
            callcount = ""
        } else if(sortName == "按调用量"){
            createtime = ""
            accesscount = ""
            downcount = ""
            callcount = "desc"
        }

        getListData({
            "code": code,
            "type": providMode,
            "inputtext": inputtext,
            "createtime": createtime,
            "accesscount": accesscount,
            "downnum": downcount,
            "callnum": callcount,
            "page": 1,
            "rows": eachPageCount
        })
    })

});

//获取资源分类码
function getClassificationCode(){
    api.get('/resCatalog/ziyuanfenlei').done(function(res){

        $('.item-basic').attr('code',res.jcCODE)        //基础

        $('.item-theme').attr('code',res.zwCODE)       //主题

        $('.item-department').attr('code',res.bmCODE)  //部门

        $('.item-local').attr('code',res.dfCODE)       //地方

        bindEvent()

        $(".tree-type li:eq("+type+")").click();
    })
}

function bindEvent() {

    $(".tree-type li").click(function (node) {

        $(".tree-type li").removeClass("active");
        $(this).addClass("active");

        var txt = $(this).text();
        var classifiCode = $(this).attr('code');
        var index = txt == '基础' ? 0 : txt == '主题' ? 1 : txt == '部门' ? 2 : 3;
        $(".tree-container .left-bar").removeClass("active");

        var $container = $(".tree-container .left-bar:eq(" + index + ")");
        $container.addClass("active");
        if($container.html()) return;

        loadTree(classifiCode, $container.attr("id"));

    });
}

//加载左侧树
function loadTree(code, containerId) {

    api.get("/resCatalog/findDirect?code=" + code).then(function (result) {

        tool.renderList("#" + containerId, "#tree-template", result);

        $(".left-bar.active").mCustomScrollbar();     //左侧树滚动条优化 

        if(initFlag && pCode) {                 //出发左侧树相应节点点击事件
            $('#'+pCode).click();
            initFlag = false
        } 
    });
}

//初始化右侧列表
function initList(code){
    console.log(code);
}

//树点击事件
function treeClick(type, id, node) {

    code = id;
    flag = 0
    getListData({                            //获取列表数据
        "code": code,
        "type": providMode,
        "inputtext": "",
        "createtime": createtime,
        "accesscount": accesscount,
        "downnum": downcount,
        "callnum": callcount,
        "page": 1,
        "rows": eachPageCount
    });

    switch (type) {
        case 1:
        case 2:
            $(".icon-arrow-left", $(treeNodeCls[type - 1])).removeClass("icon-arrow-left").addClass("icon-arrow-t");
            $("i.icon-arrow-t", node).removeClass("icon-arrow-t").addClass("icon-arrow-left");
        case 3:
            $('.clickableActive', $(treeNodeCls[type - 1])).removeClass("clickableActive");
            $(node).addClass("clickableActive");
        default:
            break;
    }

    if (type == 3) return;

    $(treeNodeCls[type]).hide();
    var $container = $(node).parent();
    var $childNode = $("div" + treeNodeCls[type], $container);
    if ($childNode.length > 0) {
        $childNode.show();
        return;
    }

    api.get("/resCatalog/findDirect?code=" + id).then(function (result) {

        var html = "";
        if (type == 1) {
            html = '<div class="clickable-content two-catalog">';
            $(result.data).each(function (index, item) {
                html += '<div><a class="clickable2" onclick="treeClick(2,' + item.id + ',this)"><em></em>' + '<span>' + item.name + '</span></span>' + '<i class="icon iconfont icon-arrow-t"></i></a></div>'
            });
            html += "</div>"
        }
        else {
            html = '<div class="clickable-content three-catalog">';
            $(result.data).each(function (index, item) {
                html += '<a onclick="treeClick(3,' + item.id + ',this)">' + '<span>' + item.name + '</span>' + '</a>'
            });
            html += "</div>";
        }
        $container.append(html);
    });
}

function registerHandHelp() {

    var iconsLen = icons.length;
    Handlebars.registerHelper("getIcon", function (name) {
        var index = parseInt(Math.random() * iconsLen);
        return icons[index];
    });
}

//获取目录列表
function getListData(params){

    api.get('/resCatalog/find',params)
    .done(function(res){
        if(typeof(res) == 'string'){
            res = $.parseJSON(res)
        }

        var isLogin = tool.getCookie('currUser')        //获取登录状态
        res.isLogin = isLogin

        tool.renderList('#list-wrap1','#list-wrap1-template',res)

        var totalPage = Math.ceil(res.count / eachPageCount)

        if(totalPage == 0) {
            $('.page-wrap').addClass("dn");
            $('.result-count').html("0");
            return
        } else{
            $('.page-wrap').removeClass("dn")
        }

        $('.result-count').html(res.count)
        $('.total-count').html('共'+totalPage+'页，每页'+eachPageCount+'条')

        if(flag == 0){                       //防止进入死循环
            $('.pagination').pagination({
                totalData: res.count,
                showData: eachPageCount,
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
                callback:function(api){
                    flag = 1                  //防止进入死循环

                    getListData({
                        "code": code,
                        "type": providMode,
                        "inputtext": inputtext,
                        "createtime": createtime,
                        "accesscount": accesscount,
                        "downnum": downcount,
                        "callnum": callcount,
                        "page": api.getCurrent(),
                        "rows": eachPageCount
                    })
                }
            });
        }
    })
}

//根据提供方式过滤目录列表数据    提供方式(接口=6，数据库=7，文件=8)
function filterListByType(type){
    flag = 0

    $('.search-txt').val("")       //清空搜索框内容

    if(type){
        providMode = type
    } else {
        providMode = ""
    }
    
    getListData({
        "code": code,
        "type": providMode,
        "inputtext": "",
        "createtime": createtime,
        "accesscount": accesscount,
        "downnum": downcount,
        "callnum": callcount,
        "page": 1,
        "rows": eachPageCount
    })
}

//按搜索内容过滤目录列表数据
function filterListBySearch(){
    flag = 0
    var txt = $('.search-txt').val()
    txt = $.trim(txt)
    inputtext = txt
    getListData({
        "code": code,
        "type": providMode,
        "inputtext": inputtext,
        "createtime": createtime,
        "accesscount": accesscount,
        "downnum": downcount,
        "callnum": callcount,
        "page": 1,
        "rows": eachPageCount
    })
}
//搜索回车事件
function btnSearch(){
    if(event.keyCode == 13){
        filterListBySearch();
    }
}
