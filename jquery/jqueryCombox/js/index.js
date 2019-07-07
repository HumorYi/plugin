(function(root, factory, plug){
	factory(root.jQuery, plug);
})(window, function($, plug){
	var __DEFAULTS__ = {
		data: [],
		triggerEvent: {
			input: "keyup",
			arrow: "click",
			options: "mouseover"
		},
		isFilter: true
	};

	var __PROTO__ = {
		_init: function() {
			return this._render()._handle();
		},
		_render: function () {
			var lis = "";
			$.each(this.data, function (i, val) {
				lis += "<li>"+val+"</li>";
			});

			var html = '<input class="_content" type="text" placeholder="请输入时间" />'
								+'<span class="_arrow"></span>'
								+'<ul class="_options">'+lis+'</ul>'
			;

			return this.addClass("_combox").html(html);
		},
		_handle: function () {
			var _this = this;

			// 输入框获取焦点
			_this.find(">input._content").on("focus", function (e) {
				$(this).addClass("_active").nextAll("ul._options").show();
			})
			// 触发自定义输入框事件
			.on(_this.triggerEvent.input, function (e) {
				if (_this.isFilter) {
					var $ul = $(this).nextAll("ul._options"),
							$li_noResult = $ul.find("li._no-result")
					;
					
					$li_noResult.size() && $li_noResult.remove();

					$ul.find(">li").hide()
							.filter(":contains("+this.value+")").show()
							.size() === 0 && $ul.append("<li class='_no-result'>无法找到</li>");
				}
			})
			// 触发自定义箭头事件
			.next().on(_this.triggerEvent.arrow, function (e) {
				$(this).toggleClass("_active")
								.prev().toggleClass("_active")
								.nextAll("ul._options").toggle()
				;
			})
			// 触发自定义下拉框选项事件
			.next().find(">li").on(_this.triggerEvent.options, function (e) {
				$(this).parent().prevAll("input._content").val(this.innerHTML);
			});

			return this;
		}
	};
	
	// 判断插件是否已存在，避免同名插件被覆盖
	if ($.fn.hasOwnProperty(plug)) {
		throw new Error("插件 " + plug + " 已存在");
	}

	$.fn[plug] = function(opts){
		opts = opts || {};

		// $.extend　只能扩展一层对象数据，多层源数据会被替换掉
		opts.triggerEvent = $.extend(__DEFAULTS__.triggerEvent, opts.triggerEvent || {});

		return $.extend(this, __DEFAULTS__, opts, __PROTO__)._init();
	}
}, "jqueryCombox");