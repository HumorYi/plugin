/**
 * @desc
 *  1、在全局和所有元素类型的父类型的原型中，封装相同的$方法
 *  2、专用于在各种情况下用选择器查询元素对象
 *  3、接收一个字符串格式的选择器作为参数
 *  4、返回找到的一个元素对象或多个元素对象的数组
 *
 *  @use $(selector)
 * */
window.$ = HTMLElement.prototype.$ = function(selector) {
  //如果this指向window，则在document范围内查询 选择器
  //否则，就在当前元素范围内查询 选择器
  var elems = (this === window ? document : this).querySelectorAll(selector);

  /**
   * @desc
   *  1、如果获取不到该选择器，则设置该变量数组的值为null，
   *  2、否则，如果只获取到该选择器下的一个元素，设置该变量数组的值为该变量数组的第0个元素，
   *  3、否则，设置该变量数组的值为所有获取到的变量数组
   * */

  // 易读 且 可确定查询值
  if (
    Object.prototype.toString.call(elems).slice(8, -1) === 'Array' &&
    elems.length === 0
  ) {
    return null;
  } else if (elems.length === 1) {
    return elems[0];
  } else {
    return elems;
  }
  // return !elems ? null : elems.length === 1 ? elems[0] : elems;
};

/**
 * @desc 显示 元素
 *
 * @use obj.show()
 * */
Object.prototype.show = function() {
  this.style.display = 'block';
  return this;
};

/**
 * @desc 隐藏 元素
 *
 * @use obj.hide()
 * */
Object.prototype.hide = function() {
  this.style.display = 'none';
  return this;
};

/**
 * @desc 捕获 / 设置 属性
 *  1、如果只有一个参数，则获取 obj属性 的值 为 第一个参数
 *  2、否则，如果有两个参数，第一个参数必须为属性，第二个参数必须为值，
 *      就设置 obj属性(第一个参数)的值 为 第二个参数
 *
 * @use obj.attr()
 * */
Object.prototype.attr = function() {
  if (arguments.length == 1) {
    return eval('this.' + arguments[0]);
  } else if (arguments.length == 2) {
    eval('this.' + arguments[0] + ' = ' + argument[1]);
    return this;
  }
};

/**
 * @desc 捕获 / 设置 值
 *  1、如果没有参数，则获取 obj 的值
 *  2、否则,如果有一个参数, 则设置 obj 的值为该参数
 *
 * @use obj.val()
 * */
Object.prototype.val = function() {
  if (arguments.length == 0) {
    return this.value;
  } else if (arguments.length == 1) {
    this.value = arguments[0];
    return this;
  }
};

/**
 * @desc 捕获 / 设置 html内容
 *  1、如果没有参数，则获取该标签下的所有内容（html标签、文本等）
 *  2、否则，如果有一个参数，则设置该标签下的内容为该参数
 *
 * @use obj.html()
 * */
Object.prototype.html = function() {
  //
  if (arguments.length == 0) {
    return this.innerHTML;
  } else if (arguments.length == 1) {
    this.innerHTML = argumetns[0];
    return this;
  }
};

/**
 * CSS方法
 * */
/**
 * @desc 捕获 / 设置 css 属性
 *  1、如果只有一个参数，则获取该参数属性样式的值
 *  2、否则，如果有两个参数，第一个参数必须为样式属性，第二个参数必须为值，
 *      则设置该参数样式的属性为指定值
 *
 * @use obj.css()
 * */
Object.prototype.css = function() {
  if (arguments.length == 1) {
    return eval('this.style' + arguments[0]);
  } else if (arguments.length == 2) {
    eval('this.style.' + arguments[0] + '= " ' + arguments[1] + ' " ');
    return this;
  }
};

/**
 * @desc 添加元素
 *  属性解析：
 *      1、innerHTML: 从对象的起始位置到终止位置的全部内容,不包括Html标签。
 *      2、outerHTML: 除了包含innerHTML的全部内容外, 还包含对象标签本身。
 *
 * @param newElem {nodeList / string} 新元素 或 新内容
 *
 * @use
 *  1、obj.append() 末尾添加
 *  2、obj.prepend() 头部添加
 *  3、obj.after() 指定标签之后添加
 *  4、obj.before() 指定标签之前添加
 * */
Object.prototype.append = function(newElem) {
  this.innerHTML += newElem;
  return this;
};

Object.prototype.prepend = function(newElem) {
  this.innerHTML = newElem + this.innerHTML;
  return this;
};

Object.prototype.after = function(newElem) {
  this.outerHTML += newElem;
  return this;
};

Object.prototype.before = function(newElem) {
  this.outerHTML = newElem + this.outerHTML;
  return this;
};

/**
 * @desc 删除标签 / 设置标签内容为空
 *
 * @use obj.empty()
 * */
Object.prototype.empty = function() {
  this.innerHTML = '';
  return this;
};

/**
 * @desc 替换当前元素 为 新 元素
 *
 * @param newElem {elem / string} 新元素 或 新内容
 *
 * @use obj.replaceWith()
 * */
Object.prototype.replaceWith = function(newElem) {
  this.outerHTML = newElem;
  return this;
};

/**
 * @desc 封装ajax
 *
 * @param opt {object} 配置选项
 *
 * @use obj.ajax()
 * */
Object.prototype.ajax = function(opt) {

  opt = opt || {};
  opt.type = opt.type ? opt.type.toUpperCase() : 'GET';
  opt.url = opt.url || '';
  opt.data = opt.data || null;
  opt.dataType = opt.dataType || 'json';
  opt.callbackName = opt.callbackName || '';
  opt.async = opt.async || true;
  opt.success = opt.success || function() {};
  opt.error = opt.error || function() {};

  // 实例化请求
  var xhr = XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHttp');

  // 遍历要发送的数据，并进行组装

  // 方式一：数组转字符串
  /*
	    var params = [];
	    var data = opt.data;
	    if (data &&
	     	Object.prototype.toString.call(data).slice(8, -1) === "Object" &&
	     	Object.keys(data).length > 0
	    ) {
		    for (var key in data) {
		    	if (data.hasOwnProperty(key) === true) {
		        	params.push(key + '=' + data[key]);
		    	}
		    }
	    }

	    // 通过 & 符号拼接 组装好的数据，http 请求的 url 数据参数格式为: key=val&key1=val1
	    var postData = params.join('&');
	*/

  // 方式二：直接字符串拼接
  var postData = '';
  var data = opt.data;
  if (
    data &&
    Object.prototype.toString.call(data).slice(8, -1) === 'Object' &&
    Object.keys(data).length > 0
  ) {
    for (var key in data) {
      if (data.hasOwnProperty(key) === true) {
        postData += '&' + key + '=' + data[key];
      }
    }

    postData = postData.slice(1);
  }

  if (opt.type === 'POST') {
    // 启动连接
    xhr.open(opt.type, opt.url, opt.async);
    // 设置请求头
    xhr.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=utf-8'
    );
    // post 请求，数据在请求体中发送过去
    xhr.send(postData);
  }
  else if (opt.type === 'GET') {
    /**
     * 1、get 请求，参数要拼接到url后面，中间用 ? 分隔，
     * 2、http get 请求参数格式为 url + ? + key=val&key1=val1
     *  http 通过 urlComponent 解析url 时，是通过 ? 来判断 url 和 传输的参数，
     *  ? 左边为 url，右边为 传输的参数
     * */
    xhr.open(opt.type, opt.url + '?' + postData, opt.async);
    // 设置请求头
    xhr.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded;charset=utf-8'
    );
    xhr.send(null);
  }

  // 监听 后台 响应 状态
  xhr.onreadystatechange = function() {
    // 只有 后台 对数据进行 处理完成（4） 并且 响应回来的 状态码 为 200（成功），才表示响应成功
    if (xhr.readyState == 4 && xhr.status == 200 || xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      // jsonp数据类型处理
      if (opt.dataType === 'jsonp') {
        var oScript = document.createElement('script');
        oScript.src = opt.url + '?' + postData + '&callback=' + callbackName;
        document.body.appendChild(oScript);

        window[callbackName] = function(data) {
          opt.success(data);
          document.body.removeChild(oScript);
        };
      } else {
        // 其它数据类型处理
        // 接收后台响应成功返回的数据
        opt.success(xhr.responseText);
      }
    }
  };

  // 滞空变量，释放内容，帮助浏览器垃圾回收机制处理
  // xhr = params = postData = null;
};

/**
 * @desc 为当前元素绑定事件
 *
 * */
Object.prototype.addEventHandler = function(event, handler, e) {
  e = window.event || e;
  var target = e.srcElement || e.target;
  var attachEvent = this.attachEvent;
  var addEventListener = this.addEventListener;

  if (attachEvent) {
    attachEvent('on' + event, handler);
    return target;
  } else if (addEventListener) {
    addEventListener(event, handler, false);
    return target;
  }

  return false;
};

/**
 * @desc 判断用户的浏览器设备是移动端还是pc端
 * @returns {String}
 * */
function getBrowserRedirect() {
  var sUserAgent = navigator.userAgent.toLowerCase();
  var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad';
  var bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os';
  var bIsMidp = sUserAgent.match(/midp/i) == 'midp';
  var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
  var bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb';
  var bIsAndroid = sUserAgent.match(/android/i) == 'android';
  var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce';
  var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';

  if (
    bIsIpad ||
    bIsIphoneOs ||
    bIsMidp ||
    bIsUc7 ||
    bIsUc ||
    bIsAndroid ||
    bIsCE ||
    bIsWM
  ) {
    return 'phone';
  } else {
    return 'pc';
  }
}

/**
 * @desc 判断是否微信浏览器中打开
 */
function isWeiXinBrowser() {
  return navigator.userAgent.indexOf('MicroMessenger') !== -1;
}

/**
 * @desc 定义一个扩展函数，用来讲第二个以及后续参数复制至第一个参数，
 *          这里处理IE bug：在多数IE版本中，
 *          如果o的属性拥有一个不可枚举的同名属性，
 *          则for/in循环，不会枚举对象o的可枚举属性，也就是说，
 *          将不会正确地处理诸如toString的属性，除非我们显示检测它
 *
 * @params o {Object} 要检测的对象
 *
 * @return {Object}
 */
var extend = (function() {
  // 在修复它之前，首先检测是否存在bug
  for (var p in { toString: null }) {
    // 如果代码执行到这里，那么for/iun循环会正确工作并返回
    // 一个简单版本的extend() 函数
    return function extend(o) {
      for (var i = 0, argLen = arguments.length; i < argLen; i++) {
        var source = arguments[i];
        for (var prop in source) {
          o[prop] = source[prop];
        }
      }
    };
  }

  // 如果代码执行到这里，说明for/in循环不会枚举测试对象的toString属性，
  // 因此返回拎一个的extend()函数，这个函数显示测试 Object.prototype中的补课枚举属性
  var protoProps = [
    'toString',
    'valueOf',
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString'
  ];

  return function patched_extend() {
    for (var i = 0, argLen = arguments.length; i < argLen; i++) {
      var source = arguments[i];
      // 复制所有的可枚举属性
      for (var prop in source) {
        o[prop] = source[prop];
      }

      // 现在检测特殊属性
      for (var j = 0, propLen = protoProps.length; j < propLen; j++) {
        var prop = protoProps[j];
        if (source.hasOwnProperty(prop)) {
          o[prop] = source[prop];
        }
      }
    }
  };
})();

/**
 * @desc 单个单词首字母大写
 *
 * @params str {String} 要转换的单词
 *
 * @return {String} 转换好的单词
 */
function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * @desc 单个单词首字母小写
 *
 * @params str {String} 要转换的单词
 *
 * @return {String} 转换好的单词
 */

function capitalLowerCase(str) {
  return str[0].toLowerCase() + str.slice(1);
}

/**
 * @desc 一段单词首字母大写
 *
 * @params str {String} 要转换的一段单词
 *
 * @return {String} 转换好的一段单词
 */
function titleCaseAll(str) {
  return str.replace(/\b[a-z]/g, function(s) {
    return s[0].toUpperCase() + s.slice(1);
  });
}

/**
 * @desc 一段单词首字母小写
 *
 * @params str {String} 要转换的一段单词
 *
 * @return {String} 转换好的一段单词
 */
function capitalLowerCase(str) {
  return str.replace(/\b[A-Z]/g, function(s) {
    return s[0].toLowerCase() + s.slice(1);
  });
}

/**
 * @desc 获取数字数组中的最大值
 *
 * @params arr {Array} 要获取的数字数组
 *
 * @return {Number} 要获取的数字数组中的最大值
 */
function getNumberArrayMax(arr) {
  return Math.max.apply(Math, arr);
}

/**
 * @desc 获取数字数组中的最小值
 *
 * @params arr {Array} 要获取的数字数组
 *
 * @return {Number} 要获取的数字数组中的最小值
 */
function getNumberArrayMin(arr) {
  return Math.min.apply(Math, arr);
}
