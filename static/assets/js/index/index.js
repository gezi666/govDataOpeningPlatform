$(function(){
	$(".index-tab-tit ul li").click(function(){
		$(this).addClass("active").siblings().removeClass("active");
		var n = $(this).index();
		$(".index-tab-cont").find(".index-tab").eq(n).show().siblings().hide();
	})

	//13以内随机数
	Handlebars.registerHelper("random13", function (index) {
	    index = Math.round(Math.random()*13);
	    if(index == 0){
	    	index = Math.round(Math.random()*13);
	    }
	    return index;
	});

	/*getBannerData(); //获取banner数据
	getResourcesData(); //获取主题部门地方数据
    setTimeout(function () {
        getAccessData(); //获取接入数数据
        getNewResourcesList(); //获取最新资源数据
        getHotResourcesList(); //获取热门资源数据
        getRecommrcesList(); //获取推荐资源数据
    });*/

    //首页搜索功能
    $('body').delegate('.icon-chaxun','click',function(){
        toSearch()
    })
})


//搜索回车事件
function btnSearch(){
    location.href = '../../../searchResult/index.html';
    if(event.keyCode == 13){
        location.href = '../../../searchResult/index.html';
    }
}

//获取banner数据
/*function getBannerData() {
    api.get('/home/getOpenTotal').done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res)
        }
        tool.renderList('#banner', '#banner-template', res.data[0])
    })
}*/
//获取主题部门地方数据
/*function getResourcesData() {
    api.get('/home/datareCommend').done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res)
        }

        if(res.data[0].jichuinfolist && res.data[0].jichuinfolist.length > 0){
            res.data[0].jichuinfolist.forEach(function(item,i){
                $(".basic-item"+i).find(".index-theme1").html(item.name)
                $(".basic-item"+i).find(".item-count").html(item.count)
                $(".basic-item"+i).find(".index-tab-dis a").attr("href","../catalog/index.html?type=0&code="+item.code)
            })
        }
        setTimeout(function () {
            tool.renderList('#themelist', '#themelist-template', res.data[0].themelist);
            tool.renderList('#departmentlist', '#departmentlist-template', res.data[0].departmentlist);
            tool.renderList('#basisinfolist', '#basisinfolist-template', res.data[0].basisinfolist);
        });

    })
}*/
//获取接入数数据
/*function getAccessData(){
    api.get('/home/getJoinTotal').done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res)
        }
        tool.renderList('#access', '#access-template', res.data[0]);
    })
}*/
//获取最新资源数据
/*function getNewResourcesList() {
    var params = {
        "type":1,  //1-最新 2-热门 3-推荐
        "rows":10
    }
    api.get('/home/rankSource',params).done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res.data)
        }
        tool.renderList('#newresources', '#newresources-template', res.data);
    })
}*/
//获取热门资源数据
function getHotResourcesList() {
    var params = {
        "type":2,  //1-最新 2-热门 3-推荐
        "rows":10
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
        "rows":10
    }
    api.get('/home/rankSource',params).done(function (res) {
        if (typeof(res) == 'string') {
            res = $.parseJSON(res.data)
        }
        tool.renderList('#recommresources', '#recommresources-template', res.data);
    })
}

