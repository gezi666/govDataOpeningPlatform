$(function(){
	initMap()            //初始化访问来源追溯地图
	initRegisterChart()  //初始化注册类型分析图表
	initHistoryChart()  //初始化平台访问历史图表
	initOpenChart()    //初始化数据开放统计图表
	initVisitChart()  //初始化访问次数图表
	initDepartmentTop10() //初始化部门数据Top10图表
	initUpdateChart()   //数据更新统计
	initDownloadTop10()  //数据下载Top10
	initAPITop10()  //API访问Top10

	//数据开放统计tab切换
	$('.tab li').click(function(){
		$(this).addClass('active').siblings().removeClass('active')
	})
})

//初始化访问来源追溯地图
function initMap(){

    var myChart = echarts.init(document.getElementById('chart-map'));

    var geoCoordMap = {
        '上海': [121.4648,31.2891],
        '东莞': [113.8953,22.901],
        '东营': [118.7073,37.5513],
        '中山': [113.4229,22.478],
        '临汾': [111.4783,36.1615],
        '临沂': [118.3118,35.2936],
        '丹东': [124.541,40.4242],
        '丽水': [119.5642,28.1854],
        '乌鲁木齐': [87.9236,43.5883],
        '佛山': [112.8955,23.1097],
        '保定': [115.0488,39.0948],
        '兰州': [103.5901,36.3043],
        '包头': [110.3467,41.4899],
        '北京': [116.4551,40.2539],
        '北海': [109.314,21.6211],
        '南京': [118.8062,31.9208],
        '南宁': [108.479,23.1152],
        '南昌': [116.0046,28.6633],
        '南通': [121.1023,32.1625],
        '厦门': [118.1689,24.6478],
        '台州': [121.1353,28.6688],
        '合肥': [117.29,32.0581],
        '呼和浩特': [111.4124,40.4901],
        '咸阳': [108.4131,34.8706],
        '哈尔滨': [127.9688,45.368],
        '唐山': [118.4766,39.6826],
        '嘉兴': [120.9155,30.6354],
        '大同': [113.7854,39.8035],
        '大连': [122.2229,39.4409],
        '天津': [117.4219,39.4189],
        '太原': [112.3352,37.9413],
        '威海': [121.9482,37.1393],
        '宁波': [121.5967,29.6466],
        '宝鸡': [107.1826,34.3433],
        '宿迁': [118.5535,33.7775],
        '常州': [119.4543,31.5582],
        '广州': [113.5107,23.2196],
        '廊坊': [116.521,39.0509],
        '延安': [109.1052,36.4252],
        '张家口': [115.1477,40.8527],
        '徐州': [117.5208,34.3268],
        '德州': [116.6858,37.2107],
        '惠州': [114.6204,23.1647],
        '成都': [103.9526,30.7617],
        '扬州': [119.4653,32.8162],
        '承德': [117.5757,41.4075],
        '拉萨': [91.1865,30.1465],
        '无锡': [120.3442,31.5527],
        '日照': [119.2786,35.5023],
        '昆明': [102.9199,25.4663],
        '杭州': [119.5313,29.8773],
        '枣庄': [117.323,34.8926],
        '柳州': [109.3799,24.9774],
        '株洲': [113.5327,27.0319],
        '武汉': [114.3896,30.6628],
        '汕头': [117.1692,23.3405],
        '江门': [112.6318,22.1484],
        '沈阳': [123.1238,42.1216],
        '沧州': [116.8286,38.2104],
        '河源': [114.917,23.9722],
        '泉州': [118.3228,25.1147],
        '泰安': [117.0264,36.0516],
        '泰州': [120.0586,32.5525],
        '济南': [117.1582,36.8701],
        '济宁': [116.8286,35.3375],
        '海口': [110.3893,19.8516],
        '淄博': [118.0371,36.6064],
        '淮安': [118.927,33.4039],
        '深圳': [114.5435,22.5439],
        '清远': [112.9175,24.3292],
        '温州': [120.498,27.8119],
        '渭南': [109.7864,35.0299],
        '湖州': [119.8608,30.7782],
        '湘潭': [112.5439,27.7075],
        '滨州': [117.8174,37.4963],
        '潍坊': [119.0918,36.524],
        '烟台': [120.7397,37.5128],
        '玉溪': [101.9312,23.8898],
        '珠海': [113.7305,22.1155],
        '盐城': [120.2234,33.5577],
        '盘锦': [121.9482,41.0449],
        '石家庄': [114.4995,38.1006],
        '福州': [119.4543,25.9222],
        '秦皇岛': [119.2126,40.0232],
        '绍兴': [120.564,29.7565],
        '聊城': [115.9167,36.4032],
        '肇庆': [112.1265,23.5822],
        '舟山': [122.2559,30.2234],
        '苏州': [120.6519,31.3989],
        '莱芜': [117.6526,36.2714],
        '菏泽': [115.6201,35.2057],
        '营口': [122.4316,40.4297],
        '葫芦岛': [120.1575,40.578],
        '衡水': [115.8838,37.7161],
        '衢州': [118.6853,28.8666],
        '西宁': [101.4038,36.8207],
        '西安': [109.1162,34.2004],
        '贵阳': [106.6992,26.7682],
        '连云港': [119.1248,34.552],
        '邢台': [114.8071,37.2821],
        '邯郸': [114.4775,36.535],
        '郑州': [113.4668,34.6234],
        '鄂尔多斯': [108.9734,39.2487],
        '重庆': [107.7539,30.1904],
        '金华': [120.0037,29.1028],
        '铜川': [109.0393,35.1947],
        '银川': [106.3586,38.1775],
        '镇江': [119.4763,31.9702],
        '长春': [125.8154,44.2584],
        '长沙': [113.0823,28.2568],
        '长治': [112.8625,36.4746],
        '阳泉': [113.4778,38.0951],
        '青岛': [120.4651,36.3373],
        '韶关': [113.7964,24.7028]
    };

    var BJData = [
        [{name:'北京'}, {name:'北京',value:100}],
        [{name:'北京'}, {name:'上海',value:95}],
        [{name:'北京'}, {name:'广州',value:90}],
        [{name:'北京'}, {name:'大连',value:80}],
        [{name:'北京'}, {name:'南宁',value:70}],
        [{name:'北京'}, {name:'南昌',value:60}],
        [{name:'北京'}, {name:'拉萨',value:50}],
        [{name:'北京'}, {name:'长春',value:40}],
        [{name:'北京'}, {name:'包头',value:30}],
        [{name:'北京'}, {name:'重庆',value:20}],
        [{name:'北京'}, {name:'常州',value:10}]
    ];

    var SHData = [
        [{name:'上海'},{name:'包头',value:95}],
        [{name:'上海'},{name:'昆明',value:90}],
        [{name:'上海'},{name:'广州',value:80}],
        [{name:'上海'},{name:'郑州',value:70}],
        [{name:'上海'},{name:'长春',value:60}],
        [{name:'上海'},{name:'重庆',value:50}],
        [{name:'上海'},{name:'长沙',value:40}],
        [{name:'上海'},{name:'北京',value:30}],
        [{name:'上海'},{name:'丹东',value:20}],
        [{name:'上海'},{name:'大连',value:10}]
    ];

    var GZData = [
        [{name:'广州'},{name:'福州',value:95}],
        [{name:'广州'},{name:'太原',value:90}],
        [{name:'广州'},{name:'长春',value:80}],
        [{name:'广州'},{name:'重庆',value:70}],
        [{name:'广州'},{name:'西安',value:60}],
        [{name:'广州'},{name:'成都',value:50}],
        [{name:'广州'},{name:'常州',value:40}],
        [{name:'广州'},{name:'北京',value:30}],
        [{name:'广州'},{name:'北海',value:20}],
        [{name:'广州'},{name:'海口',value:10}]
    ];

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[1].name,
                    toName: dataItem[0].name,
                    coords: [toCoord, fromCoord]
                });
            }
        }
        return res;
    };

    var color = ['#a6c84c', '#ffa022', '#46bee9'];
    var series = [];
    [['北京', BJData], ['上海', SHData], ['广州', GZData]].forEach(function (item, i) {
        series.push(
            // 线条附加效果
            {
                name: item[0],
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },

            // 线条与箭头效果
            {
                name: item[0],
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.4,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },

            // 端点效果
            {
                name: item[0],
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    var size = val[2] / 8
                    if(size < 6){
                        size = 6
                    } else if(size < 15){
                        size = 15
                    }
                    return size;
                },
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
                        tooltip:{
                            formatter:function(){
                                return dataItem[1].name+'('+ dataItem[1].value + ')'
                            }
                        }
                    };
                })
            });
    });

    option = {
        title : {
            text: '访问来源追溯',
            left: 'center',
            top: '15%',
            textStyle : {
                color: '#83bdff',
                fontSize: 20
            }
        },
        tooltip : {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data:['北京', '上海', '广州'],
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: false,
            itemStyle: {
                normal: {
                    areaColor: 'transparent',
                    areaColor: '#083994',
                    borderColor: '#051a4d'
                },
                emphasis: {
                    areaColor: '#083994'
                }
            }
        },
        series: series
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化注册类型分析图表
function initRegisterChart(){

    var myChart = echarts.init(document.getElementById('chart1'));

    option = {
        backgroundColor:'#011337',
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            show:false
        },
        legend: {
            orient: 'horizontal',
            bottom:20,
            left:'center',
            width:250,
            icon:'roundRect',
            itemWidth:12,
            itemHeight:7,
            textStyle:{
                color:'#8199c3',
                fontSize:12,
            },
            data:['个人','单位','个人2','企业','政府','事业单位','社会团体']
        },
        color:['#a37c32','#0169ac','#503339','#503a39','#50453a','#504d3b','#01327c'],
        series: [
            {
                name:'访问来源',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
                center:['center','45%'],
                label: {
                    normal: {
                        show:false,
                        position: 'inner',
                        formatter: '{d}%\n{b}',
                        align:'left'
                    },
                    emphasis:{
                        show:true
                    }
                },
                data:[
                    {value:335, name:'个人'},
                    {value:679, name:'单位'}
                ]
            },
            {
                name:'访问来源',
                type:'pie',
                radius: ['40%', '55%'],
                center:['center','45%'],
                label: {
                    normal: {
                        show:false,
                        formatter: '{d}%\n{b}',
                        align:'left'
                    },
                    emphasis:{
                        show:true
                    }
                },
                data:[
                    {value:100, name:'个人2'},
                    {value:100, name:'企业'},
                    {value:100, name:'政府', selected:true},
                    {value:100, name:'事业单位'},
                    {value:1048, name:'社会团体'}
                ]
            }
        ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化平台访问历史图表
function initHistoryChart(){

    var myChart = echarts.init(document.getElementById('chart2'));

    option = {
        backgroundColor:'#011337',
        grid:{
            top:100,
            left:65,
            right:25,
            bottom:40
        },
        tooltip : {
            trigger: 'axis',
            axisPointer:{
                lineStyle:{
                    color:'#18418a',
                    opacity:0.6
                }
            }
        },
        legend: {
            top:60,
            left:65,
            icon:'roundRect',
            itemWidth:15,
            itemHeight:3,
            textStyle:{
                color:'#8199c3'
            },
            data:['平台访问次数','数据下载次数','API访问次数']
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                splitLine:{ show:false },
                axisTick:{ show:false },
                axisLabel:{ color:'#8199c3' },
                axisLine:{
                    lineStyle:{
                        color:"#18418a"
                    }
                },
                data : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
            }
        ],
        yAxis : [
            {
                type : 'value',
                splitLine:{ show:false },
                axisTick:{ show:false },
                axisLabel:{ color:'#8199c3' },
                axisLine:{
                    lineStyle:{
                        color:"#18418a"
                    }
                }
            }
        ],
        color:['#008ae5','#d2931d','#bc4e1e'],
        series : [
            {
                name:'平台访问次数',
                type:'line',
                stack: '总量',
                symbolSize:0,
                lineStyle:{normal:{width:1}},
                areaStyle:{
                    normal:{
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#008ae5'
                        }, {
                            offset: 1,
                            color: 'transparent'
                        }])
                    }
                },
                data:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 134, 90]
            },
            {
                name:'数据下载次数',
                type:'line',
                stack: '总量',
                symbolSize:0,
                lineStyle:{normal:{width:1}},
                areaStyle:{
                    normal:{
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#d2931d'
                        }, {
                            offset: 1,
                            color: 'transparent'
                        }])

                    }
                },
                data:[220, 182, 191, 234, 290, 330, 310, 234, 290, 330, 290, 330]
            },
            {
                name:'API访问次数',
                type:'line',
                stack: '总量',
                symbolSize:0,
                lineStyle:{normal:{width:1}},
                areaStyle:{
                    normal:{
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#bc4e1e'
                        }, {
                            offset: 1,
                            color: 'transparent'
                        }])

                    }
                },
                data:[150, 232, 201, 154, 190, 330, 410, 201, 154, 190, 330, 410]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化数据开放统计图表
//参数：type-请求类型 1:主题 2:部门 3:地方 4:基础
function initOpenChart(){
    var myChart = echarts.init(document.getElementById('chart3'));

    option ={
        grid:{
            top:100,
            left:60,
            right:30,
            bottom:60
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            top:55,
            icon:'roundRect',
            itemWidth:12,
            itemHeight:7,
            textStyle:{
                color:'#8199c3'
            },
            data:['数据集','API']
        },
        dataZoom: [{
            show: true,
            height: 15,
            xAxisIndex: [0],
            left: '12%',
            right: '12%',
            bottom: 10,
            backgroundColor: 'rgba(0,114,255,0.3)',
            dataBackground: {
                areaStyle: {
                    color: 'rgba(79, 140, 210, 0.4)'
                },
                lineStyle: {
                    opacity: 0.8,
                    color: '#8392A5'
                }
            },
            fillerColor: 'rgba(0,114,255,0.3)',
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
                color: '#00ADFA',
                shadowBlur: 0,
                shadowColor: 'rgba(255, 0, 0, 1)',
                shadowOffsetX: 0,
                shadowOffsetY: 0
            },
            textStyle: {
                color: "#11caff",
                // color: "#8199c3",
                fontSize: '12'
            },
            borderColor: "#3458B4"
        }, {
            type: "inside"
        }],
        xAxis: [
            {
                type: 'category',
                axisPointer: {
                    type: 'shadow'
                },
                nameTextStyle:{color:'#8199c3'},
                splitLine:{ show:false },
                axisTick:{ show:false },
                axisLabel:{
                    color:'#8199c3',
                    formatter: function(value){
                        if(value.length > 6){
                            return value.substring(0,5)+'...'
                        } else{
                            return value
                        }
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:"#18418a"
                    }
                },
                data: ['综合政务','信息产业','商业、贸易','政法、监察','劳动、人事','政法、监察1','劳动、人事1','政法、监察2','劳动、人事2','政法、监察3','劳动、人事3']
                // data: res[0]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '数量（个）',
                nameTextStyle:{color:'#8199c3'},
                splitLine:{ show:false },
                axisTick:{ show:false },
                axisLabel:{ color:'#8199c3' },
                axisLine:{
                    lineStyle:{
                        color:"#18418a"
                    }
                }
            }
        ],
        series: [
            {
                name:'数据集',
                type:'bar',
                barWidth:13,
                barGap:'40%',
                itemStyle:{
                    normal:{
                        color:'rgba(0,114,255,0.3)',
                        borderColor:'#005ec8',
                        barBorderRadius:5
                    }
                },
                data:[12.0, 4.9, 7.0, 223.2, 25.6, 26.4, 28.7, 23.2, 25.6, 26.4, 28.7]
                // data: res[2]
            },
            {
                name:'API',
                type:'bar',
                barWidth:13,
                barGap:'40%',
                itemStyle:{
                    normal:{
                        color:'rgba(255,203,45,0.3)',
                        borderColor:'#b08c1e',
                        barBorderRadius:5
                    }
                },
                data:[5.6, 5.9, 9.0, 26.4, 28.7, 26.4, 28.7, 23.2, 25.6, 26.4, 28.7]
                // data: res[1]
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化访问次数图表
function initVisitChart(){
    var myChart = echarts.init(document.getElementById('chart4'));
    option = {
        grid:{
            top:60,
            left:23,
            right:5,
            bottom:20
        },
        xAxis:  {
            show:false,
            type: 'value',
            nameTextStyle:{color:'#8199c3'},
            splitLine:{ show:false },
            axisTick:{ show:false },
            axisLabel:{ color:'#8199c3' },
            axisLine:{
                lineStyle:{
                    color:"#18418a"
                }
            },
        },
        yAxis: {
            show:false,
            type: 'category',
            data: ['浙江','山东','安徽','广东','北京','上海','内蒙古','贵州','河北','重庆'],
            nameTextStyle:{color:'#8199c3'},
            splitLine:{ show:false },
            axisTick:{ show:false },
            axisLabel:{ color:'#8199c3' },
            axisLine:{
                lineStyle:{
                    color:"#18418a"
                }
            }
        },
        series: [
            {
                name: '访问次数',
                type: 'bar',
                barWidth:10,
                label: {
                    normal: {
                        show: true,
                        position: [1,-20],
                        formatter:'{b}'
                    }
                },
                itemStyle:{
                    normal:{
                        color: function(params){
                            if(params.dataIndex === 1){
                                return '#ff772d'
                            }else if(params.dataIndex === 2){
                                return '#ff902d'
                            }else if(params.dataIndex === 3){
                                return '#ffcb2d'
                            }else{
                                return '#0072ff'
                            }
                        },
                        opacity:0.6,
                        barBorderRadius:5
                    }
                },
                data: [718582, 718582, 718582, 718582, 718582, 718582, 718582, 718582, 718582, 718582]
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化部门数据Top10图表
function initDepartmentTop10(){
    var myChart = echarts.init(document.getElementById('chart5'));
    option ={
        grid:{
            top:90,
            left:100,
            right:10,
            bottom:30
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            top:50,
            icon:'roundRect',
            itemWidth:12,
            itemHeight:7,
            textStyle:{
                color:'#8199c3'
            },
            data: ['数据集', 'API']
        },
        xAxis:  {
            show:false,
            type: 'value',
            nameTextStyle:{color:'#8199c3'},
            splitLine:{ show:false },
            axisTick:{ show:false },
            axisLabel:{ color:'#8199c3' },
            axisLine:{
                lineStyle:{
                    color:"#18418a"
                }
            },
        },
        yAxis: {
            type: 'category',
            data: ['市农委','市教育局','市质监局','市公安交管局','市商务局','市人社局','市卫计委','市生态委','市交通委','市统计局'],
            nameTextStyle:{color:'#8199c3'},
            splitLine:{ show:false },
            axisTick:{ show:false },
            axisLabel:{
                color:'#8199c3',
                formatter: function(value){
                    if(value.length > 6){
                        return value.substring(0,6)+'...'
                    } else {
                        return value
                    }
                }
            },
            axisLine:{
                lineStyle:{
                    color:"#18418a"
                }
            }
        },
        series: [
            {
                name: '数据集',
                type: 'bar',
                stack: '总量',
                barWidth:5,
                label: {
                    normal: {
                        show: false,
                        color:'#0072ff',
                        position: 'insideRight',
                        offset: [0,-10],
                        formatter: function(p){
                            if(p.value == '0'){
                                return ''
                            } else {
                                return p.value
                            }
                        }
                    }
                },
                itemStyle:{
                    normal:{
                        color:'rgba(0,114,255,0.3)',
                        borderColor:'#005ec8',
                        barBorderRadius:5
                    }
                },
                data: [31,31,32,42,43,44,45,54,62,203]
            },
            {
                name: 'API',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: false,
                        color:'#ffcb2d',
                        position: 'insideRight',
                        formatter: function(p){
                            if(p.value == '0'){
                                return ''
                            } else {
                                return p.value
                            }
                        }
                    }
                },
                itemStyle:{
                    normal:{
                        color:'rgba(255,203,45,0.3)',
                        borderColor:'#b08c1e',
                        barBorderRadius:5
                    }
                },
                data: [4,4,5,5,6,6,7,10,10,56]
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化数据更新统计图表
function initUpdateChart(){
    var myChart = echarts.init(document.getElementById('chart6'));

    option = {
        grid:{
            top:100,
            left:70,
            right:60,
            bottom:40
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [
            {
                type: 'category',
                nameTextStyle:{color:'#8199c3'},
                splitLine:{ show:false },
                axisTick:{ show:false },
                axisLabel:{ color:'#8199c3' },
                axisLine:{
                    lineStyle:{
                        color:"#18418a"
                    }
                },
                data: ['17年11月','17年10月','17年9月','17年8月','17年7月','17年6月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '更新频率（次）',
                nameTextStyle:{color:'#8199c3'},
                splitLine:{ show:false },
                axisTick:{ show:false },
                axisLabel:{ color:'#8199c3' },
                axisLine:{
                    lineStyle:{
                        color:"#18418a"
                    }
                }
            }
        ],
        series: [
            {
                name:'更新频率',
                type:'bar',
                barWidth:15,
                itemStyle:{
                    normal:{
                        color:'rgba(0,114,255,0.3)',
                        borderColor:'#005ec8',
                        barBorderRadius:5
                    }
                },
                data:[200, 300, 400, 500, 600, 700]
            }
        ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化数据下载Top10图表
function initDownloadTop10(){
    var myChart = echarts.init(document.getElementById('chart7'));

    option = {
                grid:{
                    top:70,
                    left:23,
                    right:5,
                    bottom:20
                },
                xAxis:  {
                    show:false,
                    type: 'value',
                    nameTextStyle:{color:'#8199c3'},
                    splitLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{ color:'#8199c3' },
                    axisLine:{
                        lineStyle:{
                            color:"#18418a"
                        }
                    },
                },
                yAxis: {
                    show:false,
                    type: 'category',
                    data: ['四川省《建筑用地规划许可证》月度发证明细表','质监行政处罚信息','定期定额核定公告清册','注吊销个体','四川省《建设工程竣工认可证》月度发证明细表','企业主体表','企业负责人信息','四川省水务局行政许可结果','四川省主要粮油副食品每日检测表','统计年鉴'],
                    nameTextStyle:{color:'#8199c3'},
                    splitLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{ color:'#8199c3' },
                    axisLine:{
                        lineStyle:{
                            color:"#18418a"
                        }
                    }
                },
                series: [
                    {
                        name: '访问次数',
                        type: 'bar',
                        barWidth:5,
                        label: {
                            normal: {
                                show: true,
                                position: [1,-20],
                                formatter:'{b}  {c}',
                                color:'#8199c3'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color: function(params){
                                    if(params.dataIndex > 6){
                                        return 'rgba(0,114,255,0.5)'
                                    }else{
                                        return 'rgba(0,114,255,0.1)'
                                    }
                                },
                                borderColor:'#005ec8',
                                barBorderRadius:5
                            }
                        },
                        data: [668, 695, 731, 822, 873, 2382, 2632, 3161, 4255, 17090]
                    }
                ]
            };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

//初始化API访问Top10图表
function initAPITop10(){

    var myChart = echarts.init(document.getElementById('chart8'));

    option = {
                grid:{
                    top:70,
                    left:23,
                    right:5,
                    bottom:20
                },
                xAxis:  {
                    show:false,
                    type: 'value',
                    nameTextStyle:{color:'#8199c3'},
                    splitLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{ color:'#8199c3' },
                    axisLine:{
                        lineStyle:{
                            color:"#18418a"
                        }
                    },
                },
                yAxis: {
                    show:false,
                    type: 'category',
                    data: ['政府补贴培训清单信息','药品经营企业信息','四川省安全培训机构名单','四川省绿色食品名录','互联网上网服务经营场所安全审核','欠税情况公告','四川省无公害农产品产地备案表','四川省《建设工程规划许可证》审批','房屋预售许可证信息','四川省市级以上文物保护单位名录'],
                    nameTextStyle:{color:'#8199c3'},
                    splitLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{ color:'#8199c3' },
                    axisLine:{
                        lineStyle:{
                            color:"#18418a"
                        }
                    }
                },
                series: [
                    {
                        name: '访问次数',
                        type: 'bar',
                        barWidth:5,
                        label: {
                            normal: {
                                show: true,
                                position: [1,-20],
                                formatter:'{b}  {c}',
                                color:'#8199c3'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color: function(params){
                                    if(params.dataIndex > 6){
                                        return 'rgba(255,203,45,0.5)'
                                    }else{
                                        return 'rgba(255,203,45,0.1)'
                                    }
                                },
                                borderColor:'#b08c1e',
                                barBorderRadius:5
                            }
                        },
                        data: [18, 19, 21, 22, 28, 30, 31, 37, 40, 47]
                    }
                ]
            };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}