(function(global, factory, plug) {
	factory(global.jQuery, plug);
})(window, function($, plug) {	
	// 判断插件是否已存在，避免同名插件被覆盖
	if ($.fn.hasOwnProperty(plug)) {
		throw new Error("插件 " + plug + " 已存在");
	}

	// 默认配置信息
	var __DEFAULTS__ = {
		// 数据
		data: [],
		// 当前激活的索引(0~data.length)
		activeIndex: 0,
		// 间隔定时器时间(number)，单位秒
		intervalTime: 1,
		// 是否开启自定义事件(true | false)，只有当值为true时，才可以监听自定义事件
		isOpenCustomEvent: false,
		// 是否开启自动轮播(true | false)，只有当值为false时，才关闭自动轮播
		isOpenAutoPlay: true,
		// 标题配置信息
		titleConfig: {
			// 显示类型("square" | "circle")
			showType: "square",
			// 显示方向("left" | "right" | "top" | "bottom")，
			// 如果不想用内部显示方向，可传一个不在可选范围的值（必传）
			direction: "left",
			// 激活标题的左边框宽度，当标题设置显示方向为 "top" | "bottom" 时，
			// 根据需要传入该参数，用于计算标题的ul总宽度(可选)
			borderLeftWidth: 5,
			// 自定义已经计算好的标题ul总宽度（可选）
			totalWidth: undefined,
			// 触发事件类型("hover", "click")
			eventType: "hover"
		},
		// 自定义轮播功能配置信息
		carouselConfig: {
			// 是否初始化(true | false)，开启初始化则首次不执行内部动画
			isInit: true,
			// 自定义处理功能(fn)，如果有值，后面的参数则不需要传
			fn: undefined,
			// 执行时间(number)，单位秒
			time: 0,
			// 特效类型("toggle" | "fade" | "slide")
			type: "toogle"
		}
	};
	
	// 私有方法
	var __PRIVETE__ = {		
		// 验证数据是否为有效的数字
		_isNumber: function(num) {
			if (String(num) === "NaN" || typeof num !== "number") {
				throw new Error(num + "必须是有效的数字");
			}
			
			return this;
		},
		// 验证数据是否为布尔类型
		_isBoolean: function(bool) {
			if (typeof bool !== "boolean") {
				throw new Error(bool + "必须是布尔类型");
			}
			
			return this;
		},
		// 验证数据是否为函数类型
		_isFunction: function(fn) {
			if (typeof fn !== "function") {
				throw new Error(fn + "必须是函数类型");
			}
			
			return this;
		},
		// 获取数据类型
		_type: function(data) {			
			return Object.prototype.toString.call(data).slice(8, -1);
		},
		// 继承
		_extend: function() {
			var root = arguments[0];
			
			for (var i = 1, len = arguments.length; i < len; i++) {
				this._extendInnerJson(root, arguments[i]);				
			}
			
			return this;
		},
		// 继承内部json
		_extendInnerJson: function (root, json){
			if (this._type(json) !== "Object") {
				throw new Error(json + "必须是对象");
			}
			
			// 迭代json
			Object.keys(json).map(function(key, index) {
				var currRootVal = root[key],
						currJsonVal = json[key]
				;
				
				// 如果root对象中有这个key并且值是一个对象
				if (root.hasOwnProperty(key) && this._type(currRootVal) === "Object") {
					// 如果要继承的json中这个key的值不是一个对象，则抛出异常
					if(this._type(currJsonVal) !== "Object") {
						throw new Error(key + "必须是对象");
					}
					
					// 否则继续递归迭代该对象值
					return this._extendInnerJson(currRootVal, currJsonVal);
				}
				
				// 否则直接把json中这个key的值赋给root中对应的key
				root[key] = currJsonVal;
			}.bind(this));
			
			return this;
		}
	};
	
	// 功能方法
	var __PROTO__ = {
		// 初始化
		_init: function() {
			// 数据验证
			__PRIVETE__._isNumber(this.activeIndex)
									._isNumber(this.intervalTime)
									._isNumber(this.titleConfig.borderLeftWidth)
									._isBoolean(this.isOpenCustomEvent)
									._isBoolean(this.isOpenAutoPlay)
									._isBoolean(this.carouselConfig.isInit)
			;
			this.titleConfig.totalWidth && __PRIVETE__._isNumber(this.titleConfig.totalWidth);
			this.carouselConfig.fn && __PRIVETE__._isFunction(this.carouselConfig.fn);
			this.carouselConfig.time && __PRIVETE__._isNumber(this.carouselConfig.time);
			
			if (this.activeIndex < 0 || this.activeIndex > this.data.length-1) {
				throw new Error("activeIndex 必须是 0~" + (this.data.length-1) + " 之间的数字");
			}
			
			// 默认上一个激活索引值 为 -1，即表示没有
			this.prevActiveIndex = -1;
			
			return this._render()._carousel()._handel()._autoPlay();
		},
		// 渲染dom
		_render: function() {
			var html_title = "",
					html_picture = "",
					// 标题ul标签
					$ul_title = $("<ul></ul>").addClass("_title"),
					// 图片ul标签
					$ul_picture = $("<ul></ul>").addClass("_picture"),
					// 标题显示方向
					direction = this.titleConfig.direction
			;
			
			// 生成标题列表和图片列表html
			this.data.forEach(function(obj) {
				html_title += "<li>"+(obj.title || "")+"</li>";
				html_picture += "<li>"
													+ "<a href='"+(obj.href || "javascript: void(0);")+"' target='_blank'>"
														+ "<img src="+(obj.src || "")+" alt="+(obj.alt || "")+">"
													+ "</a>"
												+ "</li>"
				;
			});
			
			// 为当前元素添加ul标签内容
			$(this).addClass("_content")
							.html("")
							.append($ul_title.html(html_title).addClass("_" + this.titleConfig.showType))
							.append($ul_picture.html(html_picture))
			;			
			
			// 标题li标签列表
			this._$lis_title = $ul_title.find(">li");
			// 图片li标签列表
			this._$lis_picture = $ul_picture.find(">li");
			
			// 设置标题ul宽度
			switch (direction) {
				case "left":
				case "right":
					$ul_title.addClass("_horizontal _" + direction);
					break;
				case "top":
				case "bottom":
					$ul_title.addClass("_vertical _" + direction);
					
					if (this.titleConfig.showType === "square") {
						var css_li = $ul_title.find(">li").css(["width", "marginRight"]),
								marginRight = (parseInt(css_li.marginRight) || 0),
								totalWidth = this.titleConfig.totalWidth
													|| ((parseInt(css_li.width) || 0) + marginRight) * this.data.length - marginRight + this.titleConfig.borderLeftWidth
						;
						
						$ul_title.css("width", totalWidth);
					}
					break;
				default:
					break;
			}
			
			return this;
		},
		// 图片轮播
		_carousel: function() {
			// 如果上一个激活的索引等于当前激活的索引，则没必要执行轮播功能
			if (this.prevActiveIndex === this.activeIndex) { return this; }
			
			var fn = this.carouselConfig.fn,
					isInit = this.carouselConfig.isInit
			;
			
			// 默认初始化的时候不执行轮播功能，直接显示指定图片
			isInit && this._$lis_picture.eq(this.activeIndex).show();
			
			// 用户自定义轮播处理功能
			if (fn) { fn.bind(this)(); }
			// 默认轮播功能处理
			else {
				// 为上一个激活索引标题去除激活类			
				this._$lis_title.eq(this.prevActiveIndex).removeClass("_active");
				// 为当前激活索引标题添加激活类
				this._$lis_title.eq(this.activeIndex).addClass("_active");
				
				// 待初始结束之后才开启轮播功能
				if (!isInit) {
					var prevActiveEffect = "",
							activeEffect = "",
							time = this.carouselConfig.time * 1000 / 2 || undefined
					;
					
					// 内置轮播功能处理
					switch(this.carouselConfig.type) {
						case "fade":
							prevActiveEffect = "fadeOut";
							activeEffect = "fadeIn";
							break;
						case "slide":
							prevActiveEffect = "slideUp";
							activeEffect = "slideDown";
							break;
						default:
							prevActiveEffect = "hide";
							activeEffect = "show";
							break;
					}
					// 处理上一个激活索引图片
					this._$lis_picture.eq(this.prevActiveIndex)[prevActiveEffect](time);
					// 处理当前激活索引图片
					this._$lis_picture.eq(this.activeIndex)[activeEffect](time);
				}
			}
			
			// 初始化结束
			if (isInit) { this.carouselConfig.isInit = false; }
			
			return this;
		},
		// 定时器自动轮播
		_autoPlay: function() {
			// 如果开启间隔定时器，则先清除间隔定时器，可以保证不会重复开启n个间隔定时器
			this._intervalTimer && clearInterval(this._intervalTimer);
			
			// 只有事件类型为hover并且允许自动轮播时，才启动自动轮播功能
			if (this.titleConfig.eventType === "hover" && this.isOpenAutoPlay) {
				var maxCount = this.data.length - 1,
						// 间隔时间 = 间隔定时器时间 + 轮播功能执行时间
						intervalTime = this.intervalTime * 1000 + (this.carouselConfig.time * 1000 || 0)
				;
				// 设置间隔定时器
				this._intervalTimer = setInterval(function() {
					// 更新索引
					this.prevActiveIndex = this.activeIndex;
					this.activeIndex = this.activeIndex >= maxCount ? 0 : this.activeIndex + 1;
					// 执行轮播功能
					this._carousel();
				}.bind(this), intervalTime);
			}
			
			return this;
		},
		// 事件处理
		_handel: function() {
			var _this = this;
			
			// 事件类型为"click"
			if (this.titleConfig.eventType === "click") {
				this._$lis_title.click(function(e){
					_this._activeEvent({
						activeIndex: $(this).index(),
						customEvents: ["beforeTitleClick", "afterTitleClick"]
					});
				});
				
				return this;
			}
			
			// 事件类型为"hover"
			var _$this = $(this);
			
			// 鼠标移动到内容区域
			_this.isOpenAutoPlay && _$this.hover(
				function(e) {
					if (_this.isOpenCustomEvent) {
						_this._attachEvent("beforeContentHover");
						clearInterval(_this._intervalTimer);
						_this._attachEvent("afterContentHover");
					}
					else {
						clearInterval(_this._intervalTimer);
					}
				},
				function(e) {						
					// 坐标信息
					var x = e.clientX,
							y = e.clientY,
							offset = _$this.offset(), 
							left = offset.left,
							top = offset.top,
							leftAndWidth = left + _$this.width(),
							topAndHeight = top + _$this.height()
					;
					
					// 只有当鼠标移出内容区域时，才开启自动轮播
					if( x < left || x > leftAndWidth || y < top || y > topAndHeight){
						_this.isOpenCustomEvent ? _this._attachEvent("beforeContentLeave")
																					._autoPlay()
																					._attachEvent("afterContentLeave")
																		: _this._autoPlay();
					}
				}
			);
			
			// 鼠标移动到标题区域
			this._$lis_title.hover(
				function(e) {
					// 只有开启自动轮播时定时器才有效
					if (_this.isOpenAutoPlay) {
						e.stopPropagation();
						clearInterval(_this._intervalTimer);
					}
					
					_this._activeEvent({
						activeIndex: $(this).index(),
						customEvents: ["beforeTitleHover", "afterTitleHover"]
					});						
				},
				function(e) {
					_this.prevActiveIndex = _this.activeIndex;
					_this.isOpenCustomEvent && _this._attachEvent("titleLeave");
				}
			);
			
			return this;
		},
		/*
		 * @desc 季候事件
		 * @params opts [Object] 选项信息，
     *							key: activeIndex(激活索引), val: [Number]
     *							key: customEvents(自定义事件), val: [Array], length: 2
		*/
		_activeEvent: function(opts) {
			// 更新索引
			this.prevActiveIndex = this.activeIndex;
			this.activeIndex = opts.activeIndex;
			
			// 上一个激活索引 = 当前激活索引 时，则不执行任何操作，直接返回当前对象
			if (this.prevActiveIndex === this.activeIndex) { return this; }
			
			// 如果开启自定义事件 并且 有传入自定义事件数组
			if (this.isOpenCustomEvent && opts.customEvents) {
				// 则先执行自定义开始事件，再执行轮播功能，最后执行自定义结束事件
				this._attachEvent(opts.customEvents[0])
						._carousel()
						._attachEvent(opts.customEvents[1])
				;
			}
			else {// 否则直接执行轮播功能
				this._carousel();
			}
			
			return this;
		},
		// 触发自定义绑定事件
		_attachEvent: function(e) {
			return this.trigger(e, {
				prevActiveIndex: this.prevActiveIndex,
				prevActiveTitleDom: this._$lis_title.eq(this.prevActiveIndex),
				prevActivePictureDom: this._$lis_picture.eq(this.prevActiveIndex),
				activeIndex: this.activeIndex,
				activeTitleDom: this._$lis_title.eq(this.activeIndex),
				activePictureDom: this._$lis_picture.eq(this.activeIndex)
			});
		}
	};
	
	// 注册插件
	$.fn[plug] = function(opts) {
		
		// 使用自定义继承方法，外部调用时可以按需传递配置信息
		__PRIVETE__._extend(this, __DEFAULTS__, opts || {}, __PROTO__);
		return this._init();
	};

}, "jqueryBanner");