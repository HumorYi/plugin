(function(root, factory, plug){
	factory(root.jQuery, plug);
})(window, function($, plug){	
	var __DEFAULTS__ = {
		placeholder: "请输入时间",
		//autoScrollY: false, //是否显示系统默认Y轴溢出时滚动条
		//openWheel: true, // 开启滚动事件
		times: new Date().toTimeString().substr(0, 8)
	};

	var __PROTO__ = {
		_init: function() {
			return this._render()._handle();
		},
		// 初始化Dom
		_render: function () {
			var lis_hours = "";
			var lis = "";

			// 小于10的数字补0
			for (var i=0; i<10; i++) { lis += "<li>0"+i+"</li>"; }
			for (var i=10; i<24; i++) { lis += "<li>"+i+"</li>"; }

			// 时钟
			lis_hours = lis;

			// 分钟和 秒钟
			for (var i=24; i<60; i++) { lis += "<li>"+i+"</li>"; }

			var html = '<input type="text" class="_content" placeholder="'+this.placeholder+'">'
								+'<i class="fa fa-clock-o"></i>'
								+'<i class="fa fa-times-circle"></i>'
								+'<div class="_times '+ (this.autoScrollY === true ? "autoScrollY" : "") +'">'
									+'<div class="_hours">'
										+'<ul>'+lis_hours+'</ul>'
									+'</div>'
									+'<div class="_minutes">'
										+'<ul>'+lis+'</ul>'
									+'</div>'
									+'<div class="_seconds">'
										+'<ul>'+lis+'</ul>'
									+'</div>'
								+'</div>',
					$content = this.addClass("_time-picker _close").html(html).find(">input._content").data("prevTimes", this.times),
					$hours = $content.nextAll("div._times").find(">div:first"),
					prevTimes = this.times.split(":")
			;

			this.li_height = $hours.find(">ul >li:first").height();

			return this._scrollY($content, $hours, Number(prevTimes[0]))
									._scrollY($content, $hours = $hours.next(), Number(prevTimes[1]))
									._scrollY($content, $hours = $hours.next(), Number(prevTimes[2]))
			;
		},
		// 处理器
		_handle: function () {
			var _this = this,
				// 控制点击页面其它地方时，收起时间栏			
				isSlideUp = false,
				// 是否被动获取焦点，用于配合input的选中位置设置
				isPassiveFocus = false
			;

			// 时间控件区域移动
			this.hover(function(e){
				isSlideUp = false;
			},function(e){
				isSlideUp = true;
			})
			// 时间输入框获得焦点
			.find(">input._content").on("focus", function (e) {
				e.stopPropagation();

				if (isPassiveFocus) {
					isPassiveFocus = false;
					return this;
				}

				var $this = $(this);
				// 显示时间框
				$this.parent().removeClass("_close").addClass("_open")
								.siblings().removeClass("_open").addClass("_close")
				;
				// 设置文本框选中区域为文本所有内容
				_this._setInputSelectRange({
					$input: $this,
					startPos: 0,
					endPos: this.value.length,
					isOpen: true
				});
			})
			// 情况输入框
			.nextAll("i.fa-times-circle").on("click", function (e) {
				var $content = $(this).prevAll("input._content");
				// 点击删除图标清空文本框内容
				$content.val() && $content.val("");
			})
			// 在时间区域点击时，不做任何操作
			.nextAll("._times").find(">div").on("click", function(e){
				e.stopPropagation();

				var $this = $(this),
						$content = $this.parent().prevAll("input._content")
				;

				if (!isPassiveFocus) { isPassiveFocus = true; }

				_this._setInputSelectRange({ $input: $content });
			})			
			// 在时间区域移动
			.on("mouseover", function (e) {
				var $this = $(this),
						$content = $(this).parent().prevAll("input._content")
				;

				_this._restoreInputEffectVal($content)
						._setInputSelectRange({
							$input: $content,
							startPos: $this.index() * 3,
							isOpen: true
						})
				;
			})
			// 在时间区域滚动
			.on("wheel", function(e){// 时间栏滚动
				e.preventDefault();
				e.stopPropagation();

				var $this = $(this),
						$content = $this.parent().prevAll("input._content"),
						activeLiIndex = Number($this.data("activeLiIndex")) || 0,
						// 通过e.originalEvent.wheelDeltaY的值判断鼠标滚动方向
						dir = e.originalEvent.wheelDeltaY === 120 ? "top" : "bottom"
				;

				_this._restoreInputEffectVal($content)
						._setInputSelectRange({
							$input: $content,
							startPos: $this.index() * 3,
							isOpen: true
						})
				;
				
				// 当前时间栏不可以滚动的条件：
				// 	1、当前活动的li索引为0 并且 往上滚动
				// 	2、当前活动的li索引为li的结尾索引 并且 往下滚动
				if (!(activeLiIndex === 0 && dir === "top"
							|| activeLiIndex === $this.find(">ul >li").size() - 1 && dir === "bottom"
						)
				) {
					dir === "top" ? --activeLiIndex : ++activeLiIndex;
					_this._scrollY($content, $this, activeLiIndex);
				}
			})
			// 点击时间 项
			.find(">ul >li").on("click", function (e) {
				e.stopPropagation();

				var $this = $(this),
						$div = $this.parent().parent(),
						$content = $div.parent().prevAll("input._content")
				;

				if (!isPassiveFocus) { isPassiveFocus = true; }

				_this._scrollY($content, $div, $this.text())
							._restoreInputEffectVal($content)
							._setInputSelectRange({ $input: $content })
				;
			})
			// 点击页面html部分
			.parents("html").on("click", function (e) {
				// 点击页面其它地方收起下拉框
				if (isSlideUp){
					isSlideUp = false;
					_this.removeClass("_open").addClass("_close");
				}
			})
			;

			return this;
		},
		// 滚动Y轴
		_scrollY: function ($input, $div, activeLiIndex) {
			activeLiIndex = Number(activeLiIndex) || 0;

			// 当清空文本框时，使用之前的时间来做处理
			// （当前时间栏滚动时，获取其它时间栏的当前时间）
			var times = ($input.val() || $input.data("prevTimes")).split(":");
			times[$div.index()] = activeLiIndex < 10 ? "0" + activeLiIndex : activeLiIndex;
			times = times.join(":");
			$input.val(times).data("prevTimes", times);

			$div.data("activeLiIndex", activeLiIndex)
					.find(">ul").css("transform","translateY(-"+(this.li_height * activeLiIndex)+"px");

			return this;
		},
		// 设置文本框选中区域，前提条件：必须在input获取焦点时才有效
		_setInputSelectRange: function (opts) {
			setTimeout(function () {
				opts.isOpen = opts.isOpen || false;

				// 被动获取焦点获取
				if (!opts.isOpen) {
					opts.$input.trigger("focus");
				}
				else {
					var orginalInput = opts.$input[0],
							startPos = opts.startPos,
							endPos = opts.endPos
					;

					// 默认 endPos = startPos + 2;
					if (!endPos) { endPos = startPos + 2; }

					if (orginalInput.setSelectionRange) { orginalInput.setSelectionRange(startPos, endPos); }
					else if (orginalInput.createTextRange) {
						var range = orginalInput.createTextRange();
						range.moveStart("character", startPos);
						range.moveEnd("character", endPos);
						range.select();
					}					
				}

				return this;
			}.bind(this), 0);
		},
		// 避免用户输入脏数据
		_restoreInputEffectVal: function ($input) {
			var prevTimes = $input.data("prevTimes");
			var val = $input.val();
			val && val !== prevTimes && $input.val(prevTimes);

			return this;
		}
	};
	
	// 判断插件是否已存在，避免同名插件被覆盖
	if ($.fn.hasOwnProperty(plug)) {
		throw new Error("插件 " + plug + " 已存在");
	}

	$.fn[plug] = function(opts){
		opts = opts || {};
		// 验证用户传过来的时间格式
		if (opts.hasOwnProperty("times")
			&& /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(opts.times) === false
		) {
			alert("请输入标准的时间格式");
		}

		return $.extend(this, __DEFAULTS__, opts, __PROTO__)._init();
	}
}, "jqueryTimePicker");