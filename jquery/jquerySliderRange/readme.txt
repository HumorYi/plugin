1、what: 这是一个基于jquery开发的 获取滑动区域值插件
2、when: 进度显示
3、where: 进度条
4、how:
    4.1、html
        4.1.1、在header里面引入css目录下的index.min.css
    4.3、js
        4.3.1、先引入jquery.js，再引入js目录下的index.min.js
        4.3.2、直接调用：
           	$(".range").jquerySliderRange({
							min: 0, // 最小值 默认值为0
							max: 100 // 最大值 默认值为100
						});