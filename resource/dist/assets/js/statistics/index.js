
var loadingParams = {     //echart图表loading效果配置
	color: '#fff',
    textColor: '#fff',
    text: '加载中...',
    maskColor: 'rgba(2,18,53,.8)'
}
var map = echarts.init(document.getElementById('chart-map'));  //访问来源追溯
var chart1 = echarts.init(document.getElementById('chart1'));  //注册类型分析
var chart2 = echarts.init(document.getElementById('chart2'));  //平台访问历史
var chart3 = echarts.init(document.getElementById('chart3'));  //数据开放统计
var chart4 = echarts.init(document.getElementById('chart4'));  //数据开放统计
var chart5 = echarts.init(document.getElementById('chart5'));  //部门数据Top10
var chart6 = echarts.init(document.getElementById('chart6'));  //数据更新统计
var chart7 = echarts.init(document.getElementById('chart7'));  //数据下载Top10
var chart8 = echarts.init(document.getElementById('chart8'));  //API访问Top10

$(function(){
	getStatistics()      //获取头部统计数据

	initMap()            //初始化访问来源追溯地图
	initRegisterChart()  //初始化注册类型分析图表
	initHistoryChart()  //初始化平台访问历史图表
	initOpenChart("4")    //初始化数据开放统计图表
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

//获取头部统计数据
function getStatistics(){
	api.post('/openStatistics/statisticTitleCoount')
		.done(function(res){
			if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }

	        $('.visit-num').text(res.pingtaifangwenCount)  //平台访问次数

	        $('.download-num').text(res.downLoadCount)  //数据下载次数

	        $('.api-num').text(res.APIinvokeCount)  //API调用次数

	        $('.directory-total-num').text(res.shujumuluCount)  //数据目录总量

	        $('.api-service-num').text(res.apifuwucount)  //API服务总量
		})
}

//初始化访问来源追溯地图
function initMap(){

	map.showLoading({
		color: '#fff',
	    textColor: '#fff',
	    text: '加载中...',
	    maskColor: 'transparent'
	});

	var MapData = [];
	var destination = ''  //目的地

	api.post('/openStatistics/fangwenlaiyuan').done(function(res){

		map.hideLoading();

		MapData = res
		destination = res[0][0].name

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
	                    coords: [toCoord,fromCoord]
	                });
	            }
	        }
	        return res;
	    }
	    var color = ['#a6c84c', '#ffa022', '#46bee9'];
	    var series = [];
	    [[destination, MapData]].forEach(function (item, i) {
	        series.push(
	            {    // 线条附加效果
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
	            {   // 线条与箭头效果
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
	                label: {
	                    normal: {
	                        show: true,
	                        position: 'right',
	                        formatter: '{b}'
	                    }
	                },
	                data: convertData(item[1])
	            },
	            {    // 端点效果
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
	                	if(val){
	                		var size = val[2] / 8
		                    if(size < 6){
		                        size = 6
		                    } else if(size < 15){
		                        size = 15
		                    }
		                    return size;
	                	}
	                },
	                itemStyle: {
	                    normal: {
	                        color: color[i]
	                    }
	                },
	                data: item[1].map(function (dataItem) {
	                	if(dataItem[1].name !='' ){
	                		return {
		                        name: dataItem[1].name,
		                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
		                        tooltip:{
		                            formatter:function(){
		                                return dataItem[1].name+'('+ dataItem[1].value + ')'
		                            }
		                        }
		                    }
	                	}
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
	            show:false,
	            orient: 'vertical',
	            top: 'bottom',
	            left: 'right',
	            data:[destination],
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
	            roam: true,
	            itemStyle: {
	                normal: {
	                    areaColor: '#083994',
	                    borderColor: '#051a4d'
	                },
	                emphasis: {
	                    areaColor: '#083994'
	                }
	            }
	        },
	        series: series
	    };

	    map.setOption(option);
	})
    .fail(function(){
    	map.hideLoading()
    	console.log('请求失败!')
    })
}

//初始化注册类型分析图表
function initRegisterChart(){

	chart1.showLoading(loadingParams);

	api.post('/openStatistics/registerTypeStatistic')
		.done(function(res){
			if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }

			chart1.hideLoading();

	        chart1.setOption({
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
		            // data:['个人','单位','个人2','企业','政府','事业单位','社会团体']
		            data: res[0]
		        },
		        color:['#a37c32','#0169ac','#503339','#503a39','#50453a','#504d3b','#01327c'],
		        series: [
		            {
		                name:'注册类型',
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
		                // data:[
		                //     {value:335, name:'个人'},
		                //     {value:679, name:'单位'}
		                // ]
		                data: res[2]
		            },
		            {
		                name:'注册类型',
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
		                // data:[
		                //     {value:100, name:'个人2'},
		                //     {value:100, name:'企业'},
		                //     {value:100, name:'政府', selected:true},
		                //     {value:100, name:'事业单位'},
		                //     {value:1048, name:'社会团体'}
		                // ]
		                data: res[1]
		            }
		        ]
		    });
		})
		.fail(function(){
			chart1.hideLoading();
			console.log('请求失败!')
		})
}

//初始化平台访问历史图表
function initHistoryChart(){

	chart2.showLoading(loadingParams);

	api.get('/openStatistics/pingtaifangwenlishi')
		.done(function(res){
			if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }

	        chart2.hideLoading()

	        if(res.result == '1' && res.data.length > 0){
				chart2.setOption({
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
			                // data : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
			                data : res.data[0].x
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
			                // stack: '总量',
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
			                // data:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 134, 90]
			                data:res.data[0].y1
			            },
			            {
			                name:'数据下载次数',
			                type:'line',
			                // stack: '总量',
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
			                // data:[220, 182, 191, 234, 290, 330, 310, 234, 290, 330, 290, 330]
			                data:res.data[0].y2
			            },
			            {
			                name:'API访问次数',
			                type:'line',
			                // stack: '总量',
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
			                // data:[150, 232, 201, 154, 190, 330, 410, 201, 154, 190, 330, 410]
			                data:res.data[0].y3
			            }
			        ]
				});
	        }
		})
		.fail(function(){
			chart2.hideLoading();
			console.log('请求失败!')
		})
}

//初始化数据开放统计图表
//参数：type-请求类型 1:主题 2:部门 3:地方 4:基础
function initOpenChart(type){
	
	chart3.showLoading(loadingParams);

	api.get('/openStatistics/shujukaifatongji?type='+type)
		.done(function(res){
			if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }

	        chart3.hideLoading()
	        if(res.length > 0){
	        	chart3.setOption({
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
			            labelFormatter: function(value){
			            	if(res[0][value].length > 6){
			            		return res[0][value].substring(0,5)+'...'
			            	} else {
			            		return res[0][value]
			            	}
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
			                // data: ['综合政务','信息产业','商业、贸易','政法、监察','劳动、人事','政法、监察1','劳动、人事1','政法、监察2','劳动、人事2','政法、监察3','劳动、人事3']
			                data: res[0]
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
			                // data:[2.0, 4.9, 7.0, 23.2, 25.6, 26.4, 28.7, 23.2, 25.6, 26.4, 28.7]
			                data: res[2]
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
			                // data:[2.6, 5.9, 9.0, 26.4, 28.7, 26.4, 28.7, 23.2, 25.6, 26.4, 28.7]
			                data: res[1]
			            }
			        ]
				});
	        }
		})
		.fail(function(){
			chart3.hideLoading();
			console.log('请求失败!')
		})
}

//初始化访问次数图表
function initVisitChart(){
	chart4.showLoading(loadingParams);

    api.post('/openStatistics/fangwencishu')
    	.done(function(res){
    		if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }

	        chart4.hideLoading()
	        if(res.length > 0){
	        	chart4.setOption({
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
			            // data: ['浙江','山东','安徽','广东','北京','上海','内蒙古','贵州','河北','重庆'],
			            data: res[0],
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
			                        formatter:'{b} {c}'
			                    }
			                },
			                itemStyle:{
			                    normal:{
			                        color: function(params){
			                            if(params.dataIndex === res[1].length-1){
			                                return '#ff772d'
			                            }else if(params.dataIndex === res[1].length-2){
			                                return '#ff902d'
			                            }else if(params.dataIndex === res[1].length-3){
			                                return '#ffcb2d'
			                            }else{
			                                return '#0072ff'
			                            }
			                        },
			                        opacity:0.6,
			                        barBorderRadius:5
			                    }
			                },
			                // data: [2025, 2852, 3605, 9542, 11115, 13909, 87697, 113216, 343966, 718582]
			                data: res[1]
			            }
			        ]
				});
	        }
    	})
    	.fail(function(){
			chart4.hideLoading();
			console.log('请求失败!')
		})
}

//初始化部门数据Top10图表
function initDepartmentTop10(){
	chart5.showLoading(loadingParams);

    api.post('/openStatistics/bumenshujutop')
    	.done(function(res){
    		if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }
	        
	        chart5.hideLoading()

	        if(res.length > 0){
	        	var labelList = [],dataList = [],apiList = []
	        	res.forEach(function(i){
	        		labelList.push(i.name)
	        		dataList.push(i.count2)
	        		apiList.push(i.count1)
	        	})

				chart5.setOption({
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
			            // data: ['市农委','市教育局','市质监局','市公安交管局','市商务局','市人社局','市卫计委','市生态委','市交通委','市统计局'],
			            data: labelList,
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
			                // data: [31,31,32,42,43,44,45,54,62,203]
			                data: dataList
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
			                // data: [4,4,5,5,6,6,7,10,10,56]
			                data: apiList
			            }
			        ]
				});
	        }
	        
	    })
	    .fail(function(){
			chart5.hideLoading();
			console.log('请求失败!')
		})
}

//初始化数据更新统计图表
function initUpdateChart(){
	chart6.showLoading(loadingParams);

    api.post('/openStatistics/shujugengxintongji')
    	.done(function(res){
    		if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }
	        // console.log(res)
	        chart6.hideLoading()

	        if(res.length > 0){
	        	chart6.setOption({
			        grid:{
			            top:100,
			            left:70,
			            right:60,
			            bottom:40
			        },
			        tooltip: {
			            trigger: 'axis'
			        },
			        // legend: {
			        //     top:55,
			        //     icon:'roundRect',
			        //     itemWidth:12,
			        //     itemHeight:7,
			        //     textStyle:{
			        //         color:'#8199c3'
			        //     },
			        //     // data:['更新频率','更新效率']
			        //     data:['更新频率']
			        // },
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
			                // data: ['17年11月','17年10月','17年9月','17年8月','17年7月','17年6月']
			                data: res[0]
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
			            // ,{
			            //     type: 'value',
			            //     name: '更新效率（%）',
			            //     nameTextStyle:{color:'#8199c3'},
			            //     splitLine:{ show:false },
			            //     axisTick:{ show:false },
			            //     axisLabel:{ color:'#8199c3' },
			            //     axisLine:{
			            //         lineStyle:{
			            //             color:"#18418a"
			            //         }
			            //     }
			            // }
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
			                // data:[200, 300, 400, 500, 600, 700]
			                data: res[1]
			            }
			            // ,
			            // {
			            //     name:'更新效率',
			            //     type:'line',
			            //     yAxisIndex: 1,
			            //     smooth: true,
			            //     symbolSize:0,
			            //     lineStyle:{normal:{width:1}},
			            //     itemStyle:{
			            //         normal:{
			            //             color:'#eeae0f'
			            //         }
			            //     },
			            //     data:[10, 15, 20, 25, 32, 45]
			            // }
			        ]
				})
	        }
	    })
	    .fail(function(){
			chart6.hideLoading();
			console.log('请求失败!')
		})
}

//初始化数据下载Top10图表
function initDownloadTop10(){
	chart7.showLoading(loadingParams);

    api.post('/openStatistics/shujuxiazaitop')
    	.done(function(res){
    		if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }

	        chart7.hideLoading()
	        if(res.length > 0){
	        	chart7.setOption({
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
			            // data: ['四川省《建筑用地规划许可证》月度发证明细表','质监行政处罚信息','定期定额核定公告清册','注吊销个体','四川省《建设工程竣工认可证》月度发证明细表','企业主体表','企业负责人信息','四川省水务局行政许可结果','四川省主要粮油副食品每日检测表','统计年鉴'],
			            data: res[0].reverse(),
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
			                // data: [668, 695, 731, 822, 873, 2382, 2632, 3161, 4255, 17090]
			                data: res[1].reverse()
			            }
			        ]
				});
	        }
	    })
	    .fail(function(){
			chart7.hideLoading();
			console.log('请求失败!')
		})
}

//初始化API访问Top10图表
function initAPITop10(){
	chart8.showLoading(loadingParams);

    api.post('/openStatistics/APIdiaoyongtop')
    	.done(function(res){
    		if(typeof(res) == 'string'){
	            res = $.parseJSON(res)
	        }

	        chart8.hideLoading()

	        if(res.length > 0){
	        	chart8.setOption({
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
			            // data: ['政府补贴培训清单信息','药品经营企业信息','四川省安全培训机构名单','四川省绿色食品名录','互联网上网服务经营场所安全审核','欠税情况公告','四川省无公害农产品产地备案表','四川省《建设工程规划许可证》审批','房屋预售许可证信息','四川省市级以上文物保护单位名录'],
			            data: res[0],
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
			                // data: [18, 19, 21, 22, 28, 30, 31, 37, 40, 47]
			                data: res[1]
			            }
			        ]
				});
	        }
	    })
	    .fail(function(){
			chart8.hideLoading();
			console.log('请求失败!')
		})
}