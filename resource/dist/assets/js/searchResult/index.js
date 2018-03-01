
var flag = 0
var eachPageCount = 5   //分页每页显示的条数
var inputtext = ''     //搜索内容

$(document).ready(function () {

    inputtext = tool.getParams("search")   //获取搜索内容
    
    getListData({          //获取列表数据
        "code": "",
        "type": "",
        "inputtext": inputtext,
        "createtime": "",
        "accesscount": "",
        "downnum": "",
        "callnum": "",
        "page": 1,
        "rows": eachPageCount
    })

    getNewResourcesList()  //获取最新资源数据
    getHotResourcesList()  //获取热门资源数据
    getRecommrcesList()  //获取推荐资源数据

});

//搜索回车事件
function btnSearch(){
    if(event.keyCode == 13){
        getListByInput()
    }
}

//获取目录列表
function getListData(params){
    api.get('/resCatalog/find',params)
    .done(function(res){
        if(typeof(res) == 'string'){
            res = $.parseJSON(res)
        }

        $('.result-count').html(res.count)
        tool.renderList('#list-wrap1','#list-wrap1-template',res)

        var totalPage = Math.ceil(res.count / eachPageCount)

        if(totalPage == 0) {
            $('.page-wrap').addClass("dn");
            return
        } else{
            $('.page-wrap').removeClass("dn")
        }
        
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
                        "code": '',
                        "type": '',
                        "inputtext": inputtext,
                        "createtime": '',
                        "accesscount": '',
                        "downnum": '',
                        "callnum": '',
                        "page": api.getCurrent(),
                        "rows": eachPageCount
                    })
                }
            });
        }
    })
}

//搜索框搜索结果
function getListByInput(){
    var txt = $('.search-txt').val()
    txt = $.trim(txt)
    if(txt == '') return
    getListData({          //获取列表数据
            "code": "",
            "type": "",
            "inputtext": txt,
            "createtime": "",
            "accesscount": "",
            "downnum": "",
            "callnum": "",
            "page": 1,
            "rows": eachPageCount
        })
}

//获取最新资源数据
function getNewResourcesList() {
    var params = {
        "type":1,  //1-最新 2-热门 3-推荐
        "rows":5
    }
    api.get('/home/rankSource',params).done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res.data)
        }
        tool.renderList('#newresources', '#newresources-template', res.data);
    })
}
//获取热门资源数据
function getHotResourcesList() {
    var params = {
        "type":2,  //1-最新 2-热门 3-推荐
        "rows":5
    }
    api.get('/home/rankSource',params).done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res.data)
        }
        tool.renderList('#hotresources', '#hotresources-template', res.data);
    })
}
//获取推荐资源数据
function getRecommrcesList() {
    var params = {
        "type":3,  //1-最新 2-热门 3-推荐
        "rows":5
    }
    api.get('/home/rankSource',params).done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res.data)
        }
        tool.renderList('#recommresources', '#recommresources-template', res.data);
    })
}