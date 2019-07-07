/**
* Created by luoxing on 2018/4/11 15:11
*/

(function(root, factory, plug) {
  factory(root.jQuery, plug);
})(window, function($, plug) {
  var __DEFAULTS__ = {
    triggerEvent : "blur",
    errorMessage : "You entered a wrong"
  };

  var __RULES__ = {
    // 当前值不为空
    require: function(originalVal, ruleVal) {
      return originalVal !== "";
    },
    // 指定正则验证当前值
    regexp: function(originalVal, ruleVal) {
      return new RegExp(ruleVal).test(originalVal);
    },
    // 指定长度验证当前值长度
    length: function(originalVal, ruleVal) {
      return originalVal.length === Number(ruleVal);
    },
    // 当前值长度是否大于指定长度
    minlength: function(originalVal, ruleVal) {
      return originalVal.length >= Number(ruleVal);
    },
    // 当前值长度是否小于指定长度
    maxlength: function(originalVal, ruleVal) {
      return originalVal.length <= Number(ruleVal);
    },
    // 前值长度是否位于指定两个长度之间，两个长度用 - 连接
    betweenlength: function(originalVal, ruleVal) {
      var range  = ruleVal.split("-"),
          length = originalVal.length
      ;
      return length >= Number(range[0]) && length <= Number(range[1]);
    },
    // 当前值是否为数字类型
    number: function(originalVal, ruleVal) {
      return !isNaN(Number(originalVal));
    },
    // 当前值是否为整数
    integer: function(originalVal, ruleVal) {
      return /^\-?\d*[1-9]\d*$/.test(originalVal);
    },
    // 当前值是否与指定选择器值相等
    equalto: function(originalVal, ruleVal) {
      var $elem = $(ruleVal);
      if (String($elem.val()).trim() === originalVal) {
          $elem
              .parents(".input-group")
              .removeClass("has-error")
              .addClass("has-success")
              .next("p")
              .remove();
          return true;
      }
      return false;
    },
    // 当前值是否小于指定值
    lessthan: function(originalVal, ruleVal) {
      return Number(originalVal) < Number(ruleVal);
    },
    // 当前值是否大于指定值
    greaterthan: function(originalVal, ruleVal) {
      return Number(originalVal) > Number(ruleVal);
    },
    // 当前值是否位于指定两个值之间，两个值用 - 连接
    middle: function(originalVal, ruleVal) {
      var range = ruleVal.split("-"),
          val   = Number(originalVal)
      ;
      return val >= Number(range[0]) && val <= Number(range[1]);
    },
    // 当前值是否为 url
    url: function(originalVal, ruleVal) {
      return /^(https?|ftp|file):\/\/[-A-z\d+&@#\/%?=~_|!:,.;]+[-A-z\d+&@#\/%=~_|]$/.test(originalVal);
    },
    // 当前值是否为 固话
    phone: function(originalVal, ruleVal) {
      return /0\d{2,3}-\d{7,8}/.test(originalVal);
    },
    // 当前值是否为 手机号码
    mobile: function(originalVal, ruleVal) {
      return /^1\d{10}$/.test(originalVal);
    },
    // 当前值是否为 email
    email: function(originalVal, ruleVal) {
      return /^\w+((-\w+)|(\.\w+))*\@[A-z\d]+((\.|-)[A-z\d]+)*\.[A-z\d]+$/.test(originalVal);
    },
    // 当前值是否为 金额
    amount: function(originalVal, ruleVal) {
      return /^([1-9]\d{0,}|0)(\.\d{1,2})?$/.test(originalVal);
    },
    // 当前值是否为日期格式
    date: function(originalVal, ruleVal) {
      //验证日期格式为 YYYY-MM-DD | YYYY/MM/DD
      var year      = "\\d{4}",
          month     = "(0[1-9]|1[0-2])",
          day       = "(0[1-9]|[1-2]\\d|3[0-1])",
          separator = {
              "whippletree" : "-",
              "slash"       : "\/"
          }
      ;

      var reg = "^(" + year + separator["whippletree"] + month + separator["whippletree"] + day
                + ")|(" + year + separator["slash"] + month + separator["slash"] + day + ")$";
      return new RegExp(reg).test(originalVal);
    },
    // 当前值是否为日期时间格式
    datetime: function(originalVal, ruleVal) {
      //验证日期时间格式为 YYYY-MM-DD hh:mm:ss | YYYY/MM/DD hh:mm:ss
      var year      = "\\d{4}",
          month     = "(0[1-9]|1[0-2])",
          day       = "(0[1-9]|[1-2]\\d|3[0-1])",
          hour      = "([0-1]\\d|2[0-3])",
          minute    = "([0-5]\\d)",
          second    = "([0-5]\\d)",
          separator = {
              "whippletree" : "-",
              "slash"       : "\/",
              "colon"       : ":"
          }
      ;

      var reg = "^(" 
                  + "(" + year + separator["whippletree"] + month + separator["whippletree"] + day + ")"
                  + "|" + "(" + year + separator["slash"] + month + separator["slash"] + day + ")"
                +") "
                + hour + separator["colon"] + minute + separator["colon"] + second + "$";
      return new RegExp(reg).test(originalVal);
    }
  };

  var __PROTOTYPE__ = {
    _init: function() {
      // 初始化目标验证对象
      this.$fields = this.find(".form-group .form-control:visible");

      return this._handel();
    },
    _handel: function() {
      var _this = this;

      // 数据监听
      _this.$fields.on(_this.triggerEvent, function(e) {
          // this指向触发当前事件的元素
          var $this  = $(this),
              $group = $this.parent(".input-group"),
              result = true
          ;

          // 先删除掉错误提示信息
          $group.next("p").remove();

          var originalVal = String($this.val()).trim(), // 获取原始值，并去除原始值前后的空格
              userRules   = $this.data("bv") // 获取用户自定义验证规则
          ;

          // 用户自定义验证规则数据不是对象，则默认验证失败
          if ($.type(userRules) !== "object") { return false; }

          // 用户自定义验证规则数据长度为0 或者 对该表单元素，则默认验证成功
          /**
           * 用户自定义验证规则数据长度为0 或者
           * 当用户自定义验证规则对象参数中有nullValueSuccess属性名 并且 原始值为 空时
           *  （有的时候，当输入值时，则按照规则验证，
           *     当值为空时（可能作为筛选条件），则视为通过，
           *      这个时候用户自定义验证规则对象参数中需要传入一个属性名为 nullValueSuccess，可以是任意值
           *   ）
           * 则默认验证成功
           * */
          if (Object.keys(userRules).length === 0
            || userRules.hasOwnProperty("nullValueSuccess") && originalVal === ""
          ) {
              $group.removeClass("has-error has-success").addClass("has-success");
              return true;
          }

          /*
           *优点：
           * 1、不需要重复写属性前缀，用户只需要注意验证规则即可，弄成一种可配置的参数，便于管理和维护
           * 2、验证规则的优先级由用户自定义
           * 3、只遍历用户需要的规则
           * 4、可以防止有些用户通过浏览器控制台直接修改 表单元素的验证规则
           * */
          $.each(userRules, function(key, obj) {
              if (__RULES__.hasOwnProperty(key)) {
                  result = __RULES__[key].call($this, originalVal, obj.val);
                  // 为验证失败的规则添加提示信息
                  !result && $group.after("<p class='text-danger'>" + obj.msg || _this.errorMessage + "</p>");

                  return result;
              }
          });

          // 添加验证结果类，通过直观视觉效果响应给用户
          $group.removeClass("has-error has-success").addClass("has-" + (result ? "success" : "error"));
      });

      _this.on("submit", function() {
        var $groups = _this.$fields.trigger(_this.triggerEvent).parents(".input-group");
        var eventName = $groups.filter(".has-error").size() ? "error" : "success";
        _this._attachEvent(eventName);

        return false;
      });

      return this;
    },
    _attachEvent: function(e) {
      return this.trigger(e);
    }
  };

  // 判断插件是否已存在，避免同名插件被覆盖
  if ($.fn.hasOwnProperty(plug)) { throw new Error("插件 " + plug + " 已存在"); }

  $.fn[plug] = function(options) {
    // 只接受form元素调用
    if (this.is("form") === false) { throw new ReferenceError(this + " is not the form tag"); }

    return $.extend(this, __DEFAULTS__, options || {}, __PROTOTYPE__)._init();
  };

  // 定义一个扩展规则方法，方便用户扩展规则和使用自定义同名规则覆盖插件规则
  $.fn[plug].extendRules = function(rules) {
    $.extend(__RULES__, rules || {});
  };
}, "bambooBootStrapValidator");