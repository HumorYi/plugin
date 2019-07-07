1、what: 这是一个基于jquery开发的下拉组件插件
2、when: 下拉组件显示、筛选
3、where: 省份、城市、吗，美食
4、how:
    4.1、html
        4.1.1、在header里面引入css/index.min.css
    4.3、js
        4.3.1、先引入jquery.js，再引入js/index.min.js
        4.3.2、直接调用：
           	$("div.showCombox").combox({
							data: [], // 选项数据
							triggerEvent: { // 触发事件
								input: "keyup", // 文本框事件
								arrow: "click", // 箭头事件
								options: "mouseover" // 选项事件
							},
							isFilter: true // 是否开启模糊筛选
						});