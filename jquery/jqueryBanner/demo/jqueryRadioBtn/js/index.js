(function(root, factory, plug){
	factory(root.jQuery, plug);
})(window, function($, plug){
	var __DEFAULTS__ = {
		isOpen: true
	};
	
	var __PROTO__ = {
		_init: function () {
			setTimeout(function() {
				this.addClass("_animate");
			}.bind(this), 0);

			return this.addClass("_radioBtn _" + (this.isOpen ? "open" : "close"))._handle();
		},
		_handle: function () {
			return this.on("click", function (e) {
				var $this = $(this),
						isOpen = $this.hasClass("_open")
				;

				$this.removeClass("_" + (!isOpen ? "close" : "open"))
							.addClass("_" + (isOpen ? "close" : "open"))
				;
			});
		}
	};	
	
	// 判断插件是否已存在，避免同名插件被覆盖
	if ($.fn.hasOwnProperty(plug)) {
		throw new Error("插件 " + plug + " 已存在");
	}

	$.fn[plug] = function (opts) {
		$.extend(this, __DEFAULTS__, opts || {}, __PROTO__);

		return this._init();
	}
}, "jqueryRadioBtn");