/**
 * Created by 魏阁 on 2017-10-31.
 */

var resourcecode = ''    //目录资源码
var flag = 0
var eachPageCount = 10   //分页每页显示的条数
var listId = ''          //从url上获取目录id

$(function () {

    //tab切换效果
    $('.tab-item').click(function () {
        console.log("tab-item");
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
    });

    initLineChat();

    checkIsLogin();

})


//判断是否登录
function checkIsLogin() {
    if($(".unlogin") ==""){
        $('.logined').removeClass('dn')
        $('.unlogin').addClass('dn')
        return true
    } else {
        $('.logined').addClass('dn')
        $('.unlogin').removeClass('dn')
        return null
    }
}

//初始化统计图表
function initLineChat() {

    var myChart = echarts.init(document.getElementById('statistics-chart'));

    // 指定图表的配置项和数据
    option = {
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
            data:[259,542,636,427,399,611,573,548,134,343,268,133],
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
                data:[109,442,236,527,799,611,573,348,534,243,468,733],
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
                data:[259,342,436,627,499,111,273,648,434,343,468,633],
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
                data:[259,542,736,727,599,611,573,548,734,643,568,633],
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
