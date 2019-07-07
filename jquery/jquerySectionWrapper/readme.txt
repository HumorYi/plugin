1、what: 这是一个基于jquery开发的全屏滚动插件，滚动切换时有简单动画效果
    滚动方式：
        1、有鼠标滚动切换
        2、激活小圆圈时点击小圆圈切换
2、when: 全屏滚动切换页面数据
3、where: 首页、产品展示页等
4、how:
    4.1、html
        4.1.1、在header里面引入css/index.min.css
        4.1.2、
            <div id="sectionWrapper">
                <ul class="sectionWrap">
                    <li class="sectionOne"></li>
                    <li class="sectionTwo"></li>
                    <li class="sectionThree"></li>
                    <li class="sectionFour"></li>
                    <li class="sectionFive"></li>
                </ul>
            </div>

            解析：需要用户自定义滚动数据，结构为 div>ul>li，而显示的小圆圈框架内部会直接在div后面添加ul>li
    4.2、js
        4.2.1、先引入jquery.js，再引入js/index.min.js
        4.2.2、调用元素必须是 包含类名为 section-wrapper 元素 且 该元素必须是上述html机构，调用方式为：
            注意：如果要传递options参数，必须传一个对象，否则插件内部会自动把该参数置为空对象
                options用于传递用户配置，如果不传options，则使用插件内部默认配置，
                只有传递与默认值同名属性才有效，其它属性名不做处理。

            默认配置为：
							iconSerial: {
								isShow: true, // 是否显示小圆圈，注意：只有显示之后才能点击和进行自定义点击事件处理
								activeIndex: 0, // 激活的索引
								direction: "right", // 小圆圈显示位置，默认为右边，可在"left","right","top","bottom"四个方向中选一个
								count: 0 // 小圆圈显示数量
							}

						调用：
							$(function(){
								$("#sw").jquerySectionWrapper({
									iconSerial: {    	
										isShow: true,
										activeIndex: 0,
										direction: "right",
										count: 5
									}
								})
								.on("wheelBefore",function(event,opts){
									console.log("beforeWheel");
								})
								.on("wheelAfter",function(event,opts){
									console.log("afterWheel");
								})
								.on("clickBefore", function(event, opts){
									console.log("clickBefore");
								})
								.on("clickAfter", function(event, opts){
									console.log("clickBefore");
								});
							});