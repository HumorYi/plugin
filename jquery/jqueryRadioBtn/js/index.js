// 插件扩展只需要定义一次，使用立即执行函数 (function(){})();

/**
 * 参数解析：
 * 	root: 当前插件的作用域，浏览器环境是window，NodeJs环境是global；
 *  factory: 当前插件的处理函数，这里传入一个匿名函数即可；
 *  plug: 插件名字，这里传入一个字符串
 * 
 * 注意：jQuery有两个名字，全称是 jQuery，简称是 $
 */ 
(function(root, factory, plug){
	factory(root.jQuery, plug);
})(window, function($, plug){
	// 默认参数
	var __DEFAULTS__ = {
		// 是否开启单选按钮
		isOpen: true
	};
	
	// 处理方法
	var __PROTO__ = {
		
		// 初始化
		_init: function () {
			/**
			 * 需求：用户点击的时候才触发animate动效类样式
			 * 由于初始状态直接添加animate动效类是会有一个样式过渡的效果；
			 * 所以使用一次性定时器是为了等基础样式渲染之后再添加animate动效类；
			 * 注意位置：return后面的任何代码时不会执行的，
			 * 		而定时器是等所有代码执行完毕之后再执行的，所以不会发生冲突
			*/
			setTimeout(function(e) { this.addClass("_animate") }.bind(this), 0);

			return this.addClass("_radioBtn _" + (this.isOpen ? "open" : "close"))._handle();
		},	
		// 事件处理
		_handle: function () {
			// 监听按钮点击事件
			return this.on("click", function (e) {
				var $this = $(this),
						// 判断单选按钮状态是不是开启状态
						isOpen = $this.hasClass("_open")
				;

				// 当单选按钮状态是关闭状态时，移除关闭类样式，添加开启类样式；
				// 当单选按钮状态是开启状态时，移除开启类样式，添加关闭类样式；
				$this.removeClass("_" + (!isOpen ? "close" : "open"))
							.addClass("_" + (isOpen ? "close" : "open"))
				;
			});
		}
	};
	
	// 判断插件是否已存在，避免同名插件被覆盖
	// 注意：必须得放在扩展插件代码前面
	if ($.fn.hasOwnProperty(plug)) {
		// 抛出插件名字已存在错误，后面扩展插件代码将不会执行
		throw new Error("插件 " + plug + " 已存在");
	}

	// 通过传入的插件名来扩展jquery插件
	$.fn[plug] = function (opts) {
		
		// 要求当前元素必须是button标签
		this.each(function(i, buttonEle) {
			if (!$(buttonEle).is("button")) {
				// 抛出传入元素
				throw new Error("请传入一个button元素");
			}
		});

		// 扩展当前元素，把配置和方法都扩展到当前调用对象中
		$.extend(this, __DEFAULTS__, opts || {}, __PROTO__);

		// 调用初始化方法，执行初始化操作
		return this._init();
	}
}, "jqueryRadioBtn");