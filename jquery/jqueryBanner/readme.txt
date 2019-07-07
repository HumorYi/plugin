1、what: 这是一个基于jquery开发的轮播图功能
2、when: 楼梯式轮播图
3、where: 首页、产品展示页等
4、how: 
    4.1、html
        4.1.1、在header里面引入jqueryBanner/css/index.css
				4.1.2、样式如果不符合你的要求，可以覆盖框架样式
    4.3、js
        4.3.1、先引入jquery.js，再引入jqueryBanner/js/index.js
        4.3.2、直接调用：
					let data = [
						{
							title: "态度",
							href: "https://www.baidu.com",		
							src: "./images/0.jpg",
							alt: "0.jpg"
						}
					];
					
					
					/*
						注意：
							
							最终生成的dom结构为：
								标题层：ul>li
								图片层：ul>li>a>img
					*/
					
					// 注意：插件参数里面的配置信息可以按需传递，不需要全部写一遍
					// 配置参数解析：
						{
							/*
							  数据，默认[]，
								内部对象数据格式：{
																		title: "态度", // 标题li文字
																		href: "https://www.baidu.com", // 图片链接
																		src: "./images/0.jpg", // 图片路径
																		alt: "0.jpg" // 图片信息提示
																	}
							*/
							data: data,
							
							// 当前激活的索引(0~data.length)，默认0
							activeIndex: 0,
							
							// 注意：间隔定时器的间隔时间 = 间隔时间 + carousel.time(轮播功能执行时间);
							// 间隔定时器时间，单位秒，默认1
							intervalTime: 1,
							
							// 是否开启自动轮播(true | false)，默认true，只有当值为false时，才关闭自动轮播
							isOpenAutoPlay: true,
							
							// 是否开启自定义事件(true | false)，默认false，
							// 只有当值为true时，才可以监听自定义事件
							isOpenCustomEvent: true,
							
							// 标题配置信息
							titleConfig: {
								// 标题显示类型("square" | "circle")，默认square
								showType: "square",
								
								// 标题显示方向("left" | "right" | "top" | "bottom")，默认left，
								// 如果不想用内部标题显示方向，可传一个不在可选范围的值（必传）
								direction: "left",
								
								// 当标题设置显示方向为 "top" | "bottom" 时，传入激活标题的左边框宽度，默认5，
								// 根据需要传入该参数，用于计算标题的ul总宽度(可选)
								borderLeftWidth: 5,
								
								// 自定义已经计算好的标题ul总宽度（可选），默认0，不计算
								totalWidth: 0,
								
								// 触发事件类型("hover", "click")，默认hover
								eventType: "hover"
							},
							
							// 自定义轮播功能，值为一个函数，默认是直接显示隐藏效果
							carousel: {
								// 是否初始化(true | false)，默认true，开启初始化则首次不执行内部动画
								isInit: true,
								
								// 自定义处理功能(fn)，默认undefined，如果有值，后面的参数则不需要传
								fn: undefined,
								
								// 注意：如果使用内部特效，这里的时间是一分为二的，即显示和隐藏各占一半时间
								// 执行时间(number)，单位秒，默认0，即使用jq内部自定义动画处理时间
								time: 0,
								
								// 特效类型("toggle" | "fade" | "slide")，默认toggle，这里的特效是使用jq内部的动画
								type: "toogle"
							}
						}
					
					// 注意：只有当配置参数中的 isOpenCustomEvent = true 时才启动
					// 自定义事件解析：
						// 触发事件类型为hover时，即配置参数中的 titleConfig.eventType = "hover"
							
							// 注意：只有当配置参数中的 isOpenAutoPlay = true，下面的 内容区域 自定义监听事件才启动，因为内部做了鼠标在整个轮播区域移动时是停止定时器的，便于用户点击图片进行跳转，鼠标移开整个轮播区域时才重新启动定时器
							// 鼠标移动到内容区域之前事件
							.on("beforeContentHover", function(e, msg) {})
							// 鼠标移动到内容区域之后事件
							.on("afterContentHover", function(e, msg) {})
							// 鼠标移开内容区域之前事件
							.on("beforeContentLeave", function(e, msg) {})
							// 鼠标移开内容区域之后事件
							.on("afterContentLeave", function(e, msg) {})			
							
							// 鼠标移动到标题标签之前事件
							.on("beforeTitleHover", function(e, msg) {})
							// 鼠标移动到标题标签之后事件
							.on("afterTitleHover", function(e, msg) {})
							// 鼠标移开标题标签事件
							.on("titleLeave", function(e, msg) {})
							
						// 触发事件类型为click时，即配置参数中的 titleConfig.eventType = "click"
							// 鼠标点击标题标签之前事件
							.on("beforeTitleClick", function(e, msg) {})
							// 鼠标点击标题标签之后事件
							.on("afterTitleClick", function(e, msg) {})
							
					
					// 最精简调用方式
					$("#wrap >.content").jqueryBanner({data: data});
					
					// 当触发类型为hover时
					$(function() {
						$("#wrap >.content").jqueryBanner({
							data: data,
							activeIndex: 0,
							intervalTime: 1000,
							isOpenAutoPlay: true,
							isOpenCustomEvent: true,
							titleConfig: {
								showType: "square",
								direction: "left",
								borderLeftWidth: 5,
								totalWidth: 0,
								eventType: "hover"
							},
							carousel: {
								isInit: true,
								fn: function() {
									// 为上一个激活索引标题去除激活类			
									this._$lis_title.eq(this.prevActiveIndex).removeClass("_active");
									// 为当前激活索引标题添加激活类
									this._$lis_title.eq(this.activeIndex).addClass("_active");
									
									// 隐藏上一个激活索引图片
									this._$lis_picture.eq(this.prevActiveIndex).fadeOut();
									// 显示当前激活索引图片
									this._$lis_picture.eq(this.activeIndex).fadeIn();
								},
								time: 1,
								type: "toogle"
							}
						})
						.on("beforeContentHover", function(e, msg) {
							console.log("beforeContentHover");
							console.log("msg", msg);
						})
						.on("afterContentHover", function(e, msg) {
							console.log("AfterContentHover");
							console.log("msg", msg);
						})
						.on("beforeContentLeave", function(e, msg) {
							console.log("beforeContentLeave");
							console.log("msg", msg);
						})
						.on("afterContentLeave", function(e, msg) {
							console.log("afterContentLeave");
							console.log("msg", msg);
						})
						.on("beforeTitleHover", function(e, msg) {
							console.log("beforeTitleHover");
							console.log("msg", msg);
						})
						.on("afterTitleHover", function(e, msg) {
							console.log("AfterTitleHover");
							console.log("msg", msg);
						})
						.on("titleLeave", function(e, msg) {
							console.log("titleLeave");
							console.log("msg", msg);
						});
					});
					
					// 当触发类型为click时
					$(function() {
						$("#wrap >.content").jqueryBanner({
							data: data,
							activeIndex: 0,
							intervalTime: 1000,
							isOpenCustomEvent: true,
							titleConfig: {
								showType: "square",
								direction: "left",
								borderLeftWidth: 5,
								totalWidth: 0,
								eventType: "click"
							},
							carousel: {
								isInit: true,
								fn: undefined,
								time: 1,
								type: "toogle"
							}
						})
						.on("beforeTitleClick", function(e, msg) {
							console.log("beforeTitleClick");
							console.log("msg", msg);
						})
						.on("afterTitleClick", function(e, msg) {
							console.log("afterTitleClick");
							console.log("msg", msg);
						});
					});
5、demo: 看demo目录