/**
 * Created by luoxing on 2018/4/9 19:36
 */

(function(root, factory, plug) {
  factory(root.jQuery, plug);
})(window, function($, plug) {
  var __DEFAULTS__ = {
    iconSerial: {
	    isShow: true,
	    activeIndex: 0,
	  	direction: "right",
	  	count: 0
    }
  };

  var __PROTO__ = {
    _init: function() {
      this.$sectionWrap = $(this).addClass("_sectionWrapper")
      														.find(">ul:first").addClass("_sectionWrap _sectionAnimate")
      ;
      this.$sections = this.$sectionWrap.find(">li").addClass("_section");
      this.iconSerial.prevActiveIndex = this.iconSerial.activeIndex;
      this.endIndex = this.$sections.length - 1;
      this.lock = true;
      this.iconSerial.isShow && this._generateIconSerial();

      return this._handel();
    },
    _handel: function() {
      var _this = this;

      this.on("mousewheel", function(e) {
        _this._wrap(e);
      });

      // 只有显示并激活小圆圈按钮功能才执行小圆圈点击事件
     	this.iconSerial.isShow && this.on("click", ">ul._iconSerial >li:not(._active)", function(e) {
        _this._wrap(e, $(this).index());
      });

      return this;
    },
    _wrap: function(e, index) {
      var _this = this,
          $serials = this.$serials,
          $sections = this.$sections,
          activeIndex = this.iconSerial.activeIndex
      ;

      // 未开启滚动时，不做任何处理，直接退出
      if (!this.lock) { return this; }

      this.iconSerial.prevActiveIndex = activeIndex;

      // 便于后续扩展事件类型
      switch (e.type) {
        case "mousewheel":
            // 鼠标滚动事件，通过鼠标滚动事件的源对象事件的deltaY 属性值来判定滚动方向
            var dir = e.originalEvent.deltaY === 100 ? "bottom" : "top";

            // 第一个元素往上滚动，则滚动到最后一个元素
            if (activeIndex === 0 && dir === "top") {
                activeIndex = this.endIndex;
            }
            // 最后一个元素往下滚动，则滚动到第一个元素
            else if (activeIndex === this.endIndex && dir === "bottom") {
            	activeIndex = 0;
            }
            else {
            	dir === "bottom" ? ++activeIndex : --activeIndex;
            }
            
            break;
        case "click":
            activeIndex = index;
            break;
        default:
            throw new Error("invaild e.type === " + e.type);
      }

      // 滚动之前处理事件抛给用户自处理
      this._attachEvent("wheelBefore");

      // 如果开启激活滚动事件，则把点击小圆圈进行滚动之前的事件抛给用户自处理
     	this.iconSerial.isShow && this._attachEvent("clickBefore");

      // 开始滚动
      this.lock = false;
      this.iconSerial.activeIndex = activeIndex;
      activeIndex *= 100;

      this.$sectionWrap.css({
        "-webkit-transform" : "translateY(-" + activeIndex + "%)",
        "-moz-transform"    : "translateY(-" + activeIndex + "%)",
        "-ms-transform"     : "translateY(-" + activeIndex + "%)",
        "-o-transform"      : "translateY(-" + activeIndex + "%)",
        "transform"         : "translateY(-" + activeIndex + "%)"
      });

      this.timer = setTimeout(function() {
        // 滚动完毕，开启滚动
        _this.lock = true;

        // 滚动之后的处理事件抛给用户 自处理
        _this._attachEvent("wheelAfter");

        // 如果开启激活滚动事件，则把点击小圆圈进行滚动之后的事件抛给用户自处理
        _this.iconSerial.isShow && _this._attachEvent("clickAfter");

        // 如果启动显示小圆圈按钮，则为之前已添加激活状态类的小圆圈移除激活状态类,为当前小圆圈添加激活状态类
        if (_this.iconSerial.isShow && _this.$serials) {
            _this.$serials.eq(_this.iconSerial.prevActiveIndex).removeClass("_active");
            _this.$serials.eq(_this.iconSerial.activeIndex).addClass("_active");
        }
      }, 1000);

      return this;
    },
    _attachEvent: function(e) {
      return this.trigger(e, {   	
        prevActiveIndex: this.iconSerial.prevActiveIndex,
        prevActiveDom: this.$sections.eq(this.iconSerial.prevActiveIndex),
        activeIndex: this.iconSerial.activeIndex,
        activeDom: this.$sections.eq(this.iconSerial.activeIndex)
      });
    },
    _generateIconSerial: function() {
    	var count = this.iconSerial.count;

    	if (count <= 0) { return this; }

      var $ul = $("<ul></ul>");
      $ul.addClass("_iconSerial _" + this.iconSerial.direction);
      for (var i=0; i < count; i++) { $ul.append($("<li></li>")); }

      // 默认激活第一个按钮
      $ul.find(">li:first").addClass("_active");

      this.append($ul).$serials = $ul.find(">li");

      return this;
    }
  };
  
  // 判断插件是否已存在，避免同名插件被覆盖
  if ($.fn.hasOwnProperty(plug)) { throw new Error("插件 " + plug + " 已存在"); }

  $.fn[plug] = function(opts) {
  	return $.extend(this, __DEFAULTS__, opts || {}, __PROTO__)._init();
  };
}, "jquerySectionWrapper");