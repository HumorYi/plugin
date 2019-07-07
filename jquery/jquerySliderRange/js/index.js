(function(root, factory, plug){
	factory(root.jQuery, plug);
})(window, function($, plug){
	var __DEFAULTS__ = {
		min: 0,
		max: 100
	};

	var __PROTO__ = {
		_init: function() {
			return this._render()._handle();
		},
		_render: function () {
			var html = '<span class="_circle"></span>'
						+'<span class="_line"></span>'
						+'<span class="_value">0</span>'
			;

			return this.addClass("_slide").html(html);
		},
		_handle: function () {
			var _this = this;

			return this.find(">span._circle").on("mousedown",function (e) {
				var $this = $(this),
						$slide = $this.parent(),
						e = e || window.event,
						mouseX = e.clientX || e.pageX,
						// 鼠标点击小圆圈时，把小圆圈距离父元素的left值设为0
						disX = mouseX - $this.position().left,
						circle_outerWidth = $this.outerWidth(),
						slide_width = $slide.width(),
						moveLen = slide_width-circle_outerWidth
				;

				document.onmousemove = function(ev){
					var ev = ev || window.event,
							// 小圆圈距离父元素的left值
							mouseX = e.clientX || e.pageX,
							left = ev.clientX - disX
					;

					if(left <= 0){
					    left = 0;  //最短距离
					}
					else if(left >= moveLen){
					     left = moveLen;  //最长距离
					}

					var len = left + "px";

					$this.css("left", len)
								.next().css("width", len)
								.next().text(left === 0 ? _this.min : parseInt((left + circle_outerWidth) / slide_width * _this.max));
				}

				document.onmouseup = function(){ document.onmousemove = null; }
			});
		}
	};
	
	// 判断插件是否已存在，避免同名插件被覆盖
	if ($.fn.hasOwnProperty(plug)) { throw new Error("插件 " + plug + " 已存在"); }
	$.fn[plug] = function (opts) { return $.extend(this, __DEFAULTS__, opts || {}, __PROTO__)._init(); }
}, "jquerySliderRange");