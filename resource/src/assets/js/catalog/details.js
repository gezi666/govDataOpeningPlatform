/**
 * Created by 魏阁 on 2017-10-31.
 */

var myChart = echarts.init(document.getElementById('statistics-chart'))
var charData = {}        //图表统计数据
var resourcecode = ''    //目录资源码
var flag = 0
var eachPageCount = 10   //分页每页显示的条数
var listId = ''          //从url上获取目录id
var sharedType = ''      //共享方式

$(function () {
  
    //判断数据项列表行是否向社会开放
    Handlebars.registerHelper('isActive', function (i) {
        if (i == 1) {
            return 'active'
        } else {
            return ''
        }
    })

    //对文件下载地址进行加密处理
    Handlebars.registerHelper('toEncode', function (address) {
        if (address) {
            address = encodeURI(address)
            return address
        } else {
            return ''
        }
    })
  
    listId = tool.getParams("id")   //从url上获取目录id

    getBaseInfo(listId)      //获取基本信息
    dataCatalog(listId)     //相关数据目录
    getChartInfo({          //获取图表基本信息
        "id": listId,
        "starttime": '',
        "endtime": ''
    })

    $('.time-confirm').click(function () {
        var starTime = $.trim($('#d1').val())
        var endTime = $.trim($('#d2').val())
        if (starTime == "") {
            $('#d1').addClass("notime")
            return
        } else if(endTime == ""){
            $('#d2').addClass("notime")
            return
        } else {
            getChartInfo({          //获取图表基本信息
                "id": listId,
                "starttime": starTime,
                "endtime": endTime
            })
        }
    })

    //tab切换效果
    $('.tab-item').click(function () {
        $(this).addClass("active").siblings().removeClass("active")
        var txt = $(this).text()
        switch (txt) {
            case '基本信息':
                $('.base-info').removeClass("dn").siblings().addClass("dn");
                var starTime = $.trim($('#d1').val()) || "";
                var endTime = $.trim($('#d2').val()) || "";
                getChartInfo({
                    "id": listId,
                    "starttime": starTime,
                    "endtime": endTime
                })
                break
            case '信息项':
                $('.data-item').removeClass("dn").siblings().addClass("dn")
                $('.info-preview').addClass("active")
                $('.data-preview').removeClass("active")
                $('.info-item-wrap').removeClass("dn")
                $('.data-item-wrap').addClass("dn")

                //获取信息项预览列表数据
                getDataItemList({
                    "resourcecode": resourcecode
                })
                break
            case '文件下载':
                $('.file-download').removeClass("dn").siblings().addClass("dn")

                getDownloadInfo({
                    "id": listId,
                    "page": 1,
                    "rows": eachPageCount
                })
                break
            case 'API服务':
                $('.api-service').removeClass("dn").siblings().addClass("dn")

                getAPIInfo({
                    "id": listId
                })
                break
            default:
                break
        }
    })

    //信息项tab切换
    $('body').delegate(".inner-tab-item","click",function(){
        $(this).addClass("active").siblings(".inner-tab-item").removeClass("active")
        var txt = $(this).text()
        if(txt == '信息项预览'){
            $('.download-data').addClass("dn")     //隐藏数据下载按钮

            $('.info-item-wrap').removeClass("dn")
            $('.data-item-wrap').addClass("dn")
            getDataItemList({
                "resourcecode": resourcecode
            })
        } else{
            return
        }
    })

    //点击申请订阅
    $('.toapply').click(function(){
        location.href = './directory-apply.html?id='+listId
    })

})

//时间选择判断
function hasDate(obj){
    if($.trim($(obj).val()) != ''){
        $(obj).removeClass("notime")
    }
}

//判断是否登录
function checkIsLogin() {
    if(tool.getCookie('currUser')){
        $('.logined').removeClass('dn')
        $('.unlogin').addClass('dn')
        return true
    } else {
        $('.logined').addClass('dn')
        $('.unlogin').removeClass('dn')
        return null
    }
}

//判断共享方式是否匹配
//参数：typeNum-共享类型；misMatchObj-不匹配的dom元素；matchObj-匹配的dom元素
function checkMatching(typeNum,misMatchObj,matchObj){
    if(sharedType != typeNum) {                     //判断共享方式
        $(misMatchObj).removeClass("dn")
        $(matchObj).addClass("dn")
        return null
    } else {
        $(misMatchObj).addClass("dn")
        $(matchObj).removeClass("dn")
        return true
    }
}

//相关数据目录
function dataCatalog(id) {
    api.get("/resCatalog/getCodeNameAndData", {id: id, rows: 10}).then(function (result) {
        var data = [];
        if(result.data.length>0){
            if(result.data[0].labelname !=''){
                var liDom = "<li class='label-list-item' id='code'></li>"
                $('#label-list').append(liDom)
                $("#code").html(result.data[0].labelname);
            }
            data=result.data[0].codedatalist;
            tool.renderList("#dataCatalog", "#dataCatalog-template", {data: data})
        }
    });
}

//获取目录资源详情基本信息
function getBaseInfo(id) {
    api.get('/resCatalog/getdetailsbyid', {
        "id": id
    })
        .done(function (res) {
            if (typeof(res) == 'string') {
                res = $.parseJSON(res)
            }

            if(res.data.length > 0){
                resourcecode = res.data[0].resourcecode   //目录资源码
                sharedType = res.data[0].shartype         //目录资源码（共享方式  5=邮件或介质、6=接口、7=数据库、8=文件、10=无、空字符串，直接显示）
                
                $('.info-name').text(res.data[0].name)   //资源名称

                $('.provider').text(res.data[0].providedept)   //信息资源提供方

                $('.provider').attr('title',res.data[0].providedept)   //信息资源提供方

                $('.resource-catalog').text(res.data[0].providedeptchild)   //信息资源目录

                $('.resource-catalog').attr('title',res.data[0].providedeptchild)   //信息资源目录

                $('.count').text(res.data[0].resourcesnum)   //数据总量

                $('.catalog-summary').text(res.data[0].absractinfo) //目录简介
            
                $('.visit-num').text(res.data[0].accesscount) //访问量

                $('.download-num').text(res.data[0].downnum) //下载量

                $('.use-num').text(res.data[0].callnum) //调用量

                var modetxt = ''
                if (res.data[0].shartype == '5') {
                   modetxt = '邮件或介质'
                } else if (res.data[0].shartype == '6') {
                    modetxt = '接口'
                } else if (res.data[0].shartype == '7') {
                    modetxt = '数据库'
                } else if (res.data[0].shartype == '8') {
                    modetxt = '文件'
                } else if (res.data[0].shartype == '10') {
                    modetxt = '--'
                } else {
                    modetxt = '--'
                }
                $('.shared').text(modetxt)   //共享方式

                $('.publish').text(res.data[0].createtime)   //发布时间
            }
        })
}

//获取tab基本信息数据
function getChartInfo(params) {
    myChart.showLoading({
        text: '加载中...',
        color: '#49b4ff'
    });
    api.get('/resCatalog/getaccesscount', params)
        .done(function (res) {
            if (typeof(res) == 'string') {
                res = $.parseJSON(res)
            }

            myChart.hideLoading();

            if(res.data.length == 0) return
                
            initLineChat(res.data[0])   //初始化统计图表
        })
        .fail(function(){
            myChart.hideLoading();
        })
}

//获取信息项预览列表数据
function getDataItemList(params) {

    api.get('/resCatalog/getinfoitembycode', params)
        .done(function (res) {
            if (typeof(res) == 'string') {
                res = $.parseJSON(res)
            }
            tool.renderList('#info-item-table', '#info-item-table-template', res)
        })
}

//初始化统计图表
function initLineChat(data) {

    // 指定图表的配置项和数据
    var option = {
        tooltip: {
            trigger: 'axis',
            textStyle: {
                color: '#fff',
                fontSize: 14
            }
        },
        legend: {
            data: ['访问量','下载量','调用量'],
            right: 15,
            top: 5,
            textStyle: {color: "#666666"}
        },
        toolbox: {
            show: false
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '3px',
            containLabel: true
        },
        xAxis: {
            name: '日',
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {show: false},
            textLabel: {
                show: false,
                textStyle: {
                    color: '#3c516a'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#dce2e9'
                }
            },
            boundaryGap: false,
            data: data.dateList
        },
        yAxis: {
            name: '数量',
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {show: false},
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#dce2e9'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['#f6f6f6', '#fff']
                }
            }
        },
        color: ['#5fa1fb', '#fcb10e', '#38e7f7', '#4ec115', '#4738fc'],
        series: [
            {
                name: '访问量',
                type: 'line',
                smooth: true,
                symbolSize: 10,
                areaStyle: {normal: {opacity: 0.8}},
                data: data.dataList,
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(173,221,249,.9)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(173,221,249,.2)' // 100% 处的颜色
                            }],
                            globalCoord: true // 缺省为 false
                        }
                    }
                }
            },
            {
                name: '下载量',
                type: 'line',
                smooth: true,
                symbolSize: 10,
                areaStyle: {normal: {opacity: 0.8}},
                data: data.datadownlist,
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(252,168,11,.9)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(252,168,11,.2)' // 100% 处的颜色
                            }],
                            globalCoord: true // 缺省为 false
                        }
                    }
                }
            },
            {
                name: '调用量',
                type: 'line',
                smooth: true,
                symbolSize: 10,
                areaStyle: {normal: {opacity: 0.8}},
                data: data.datacalllist,
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(57,231,247,.9)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgba(57,231,247,.2)' // 100% 处的颜色
                            }],
                            globalCoord: true // 缺省为 false
                        }
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//获取API服务
function getAPIInfo(params){
    //判断是够登录
    if(!checkIsLogin()) return

    //判断共享方式
    if(!checkMatching('6','.api-service .mis-matching','.api-service .matching')) return

    api.get('/resCatalog/getApiData', params)
        .done(function (res) {
            if (typeof(res) == 'string') {
                res = $.parseJSON(res)
            }

            if(res.result == '1160'){             //  数据未对接
                $('.api-service .undocking').removeClass('dn')
                $('.api-service .unsubscribe').addClass('dn')
                $('.api-service .normal').addClass('dn')
            } else if(res.result == '1202'){     //   未订阅数据
                $('.api-service .unsubscribe').removeClass('dn')
                $('.api-service .undocking').addClass('dn')
                $('.api-service .normal').addClass('dn')
            } else if(res.result == '1'){       //   正常情况
                $('.api-service .normal').removeClass('dn')
                $('.api-service .undocking').addClass('dn')
                $('.api-service .unsubscribe').addClass('dn') 

                //渲染API信息
                tool.renderList('#api-info', '#api-info-template', res.data[0])
            }
            
        })

}

//获取文件下载信息
function getDownloadInfo(params){

    //判断是够登录
    if(!checkIsLogin()) return

    //判断共享方式
    if(!checkMatching('8','.file-download .mis-matching','.file-download .matching')) return

    api.get('/resCatalog/getFileData', params)
        .done(function (res) {
            if (typeof(res) == 'string') {
                res = $.parseJSON(res)
            }

            if(res.result == '1160'){             //  数据未对接
                $('.file-download .undocking').removeClass('dn')
                $('.file-download .unsubscribe').addClass('dn')
                $('.file-download .normal').addClass('dn')
            } else if(res.result == '1202'){     //   未订阅数据
                $('.file-download .unsubscribe').removeClass('dn')
                $('.file-download .undocking').addClass('dn')
                $('.file-download .normal').addClass('dn')
            } else if(res.result == '1'){       //   正常情况
                $('.file-download .normal').removeClass('dn')
                $('.file-download .undocking').addClass('dn')
                $('.file-download .unsubscribe').addClass('dn')

                if(res.data.length > 0){
                    res.data.forEach(function(item){
                        item.fileDownloadTsourceinfoID = tool.getParams("id")
                        item.path = servicePath
                    })
                }
                
                tool.renderList('#download-table', '#download-table-template', res)

                if(flag == 0){                       //防止进入死循环
                    intPages(res.count)
                }
            }
            
        })

}

//初始化文件下载列表分页
//参数：totalCount-记录总条数
function intPages(totalCount){

    var totalPage = Math.ceil(totalCount / eachPageCount)

    if(totalPage == 0) {
        $('.download-table-wrap .page-wrap').addClass("dn")
        return
    } else{
        $('.download-table-wrap .page-wrap').removeClass("dn")
    }

    $('.download-table-wrap .total-count').html('共'+totalPage+'页，每页'+eachPageCount+'条')
    
    $('.download-table-wrap .pagination').pagination({
        totalData: totalCount,
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
        isHide: true,
        jump: true,
        callback:function(api){
            flag = 1                  //防止进入死循环
            getDownloadInfo({
                "id": listId,
                "page": api.getCurrent(),
                "rows": eachPageCount
            })
        }
    });

}