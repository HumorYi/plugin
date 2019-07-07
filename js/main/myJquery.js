var $lx = luoXingQuery = (function(root){
	var _proxy = function(selector,parent){
		return (parent ? parent : root.document).querySelectorAll(selector);
	}
	var $ = function(selector,parent){
		return _proxy(selector,parent);
	};

	// 公用API
	var __PUBLIC__ = {
		extend: function(target){
			for (var i = 1; i < arguments.length; i++) {
				var currArg = arguments[i];
				for(var prop in currArg){
					target[prop] = currArg[prop];
				}
			}
			return target;
		},
		each: function(target,callback){
			// 对象 | hash数组 遍历，避免类数组对象进入
			var targetType = this.type(target);
			if (targetType === "Object" && target.length === undefined
				|| targetType === "Array" && String(this) === ""
			) {
				if (Object.keys(target).length === 0) {
					return;
				}

				for (var prop in target) {
					callback && callback.call(target,prop,target[prop]);
				}

				return;
			}

			// 索引数组遍历
			var len = target.length;
			if (len === 0) {
				return;
			}

			for (var i = 0; i < len; i++) {
				callback && callback.call(target[i],i,target[i]);
			}
		},
		type: function (data) {
			return Object.prototype.toString.call(data).slice(8, -1);
		},
		getStyle: function (target,name) {
			return target.currentStyle ? target.currentStyle[name] : document.defaultView.getComputedStyle(target, null)[name];
		}
	};

	// 公用API扩展至 $ 对象
	__PUBLIC__.extend($, __PUBLIC__);

	// 仅限$dn对象调用API
	var __PROTO__ = {
		each : function(callback){
			for (var i = 0, len = this.length; i < len; i++) {
				callback && callback.call(this[i],i,this[i]);
			}

			return this;
		},
		eq : function(index){
			return this[index];
		},
		find : function(selector){
			return $(selector, this);
		},
		hasClass : function(className){
			return this.className.search(new RegExp('(^|\\s+)' + cls + '(\\s+|$)')) !== -1;
		},
		addClass : function(className){
			this.each(function(index,object){
				object.className += (object.className ? " " : "") + className;
			});
			return this;
		},
		removeClass : function(className){
			this.each(function(index,object){
				object.className = object.className.replace(new RegExp("\\b" + className + "\\b", "g"), "");
			});
			return this;
		},
		show: function() {
			this.style.display = "block";
			return this;
		},
		hide: function () {
			this.style.display = "hide";
			return this;
		},
		/**
		 * @desc 捕获 / 设置 值
		 *  1、如果没有参数，则获取 当前元素 的值
		 *  2、否则,如果有一个参数, 则设置 当前元素 的值为该参数
		 *
		 * @use $el.val()
		 * */
		val : function(val){
			if (arguments.length == 0) {
				return this.value;
			}

			this.each(function(index,object){
				object.value = val;
			});
			return this;
		},
		/**
		 * @desc 捕获 / 设置 内容
		 *  1、如果没有参数，则获取 当前元素 的内容
		 *  2、否则,如果有一个参数, 则设置 当前元素 的内容为该参数
		 *
		 * @use $el.html()
		 * */
		html : function(html){
			if (arguments.length == 0) {
				return this.innerHTML;
			}

			this.each(function(index,object){
				object.innerHTML = html;
			});
			return this;
		},
		/**
		 * @desc 捕获 / 设置 属性
		 *  1、如果只有一个参数，则获取元素 属性 的值 为 第一个参数
		 *  2、否则，如果有两个参数，第一个参数必须为属性，第二个参数必须为值，
		 *      就设置获取元素属性(第一个参数)的值 为 第二个参数
		 *
		 * @use $el.attr()
		 * */
		attr : function(attr, val){
			if (arguments.length == 0) {
				return this.getAttribute(attr);
			}

			this.each(function(index,object){
				object.setAttribute(attr, val);
			});
			return this;
		},
		css: function (name, valOrFun) {
			if (typeof(name) !== "string") {
				throw new TypeError(name + "must be a string css attribute name");
			}
			/* 这里猜测 获取元素样式时， 选择器针对最终查找的元素("#ddd > #ggg > 最终查找的元素 ") 有两种情况
				1、标签、伪类、属性等的返回值有多种情况，可能每个值的属性均不同（行内样式可能会对同一个样式属性，设置不同的值），
					目前发现Jquery内部只会返回查找到的第一个元素的值
				2、class只找样式表中的样式，返回值只有一种情况

				问题：如何拿到选择器，有时可能是直接使用获取到的Jquery元素，这里无解（待继续研究）
			*/

			// 获取属性值（只获取第一个即可）
			if (arguments.length === 1) {
				var first = this[0];
				switch(__PUBLIC__.type(name)) {
					case "String":
						return __PUBLIC__.getStyle(first, name);
					case "Array":
						var obj = {};
						__PUBLIC__.each(name, function(index, val){
							obj[val] = __PUBLIC__.getStyle(first, val);
						});

						return obj;
					case "Object":
						__PUBLIC__.each(name, function(prop, val){
							switch(__PUBLIC__.type(val)){
								case "String":
									first.style[prop] = val;
									break;
								case "Function":
									// 对象的index目前发现Jquery返回的均为0，内部处理待研究
									first.style[prop] = val && val.call(name,0, __PUBLIC__.getStyle(first, prop));
									break;
								default:
									throw new TypeError(name);
							}
						});
						return;
					default:
						throw new TypeError(name);
				}

				return;
			}

			// 设置属性值（挨个都要设置）
			this.each(function(index,object){
				switch(__PUBLIC__.type(valOrFun)) {
					case "String":
						object.style[name] = valOrFun;
						break;
					case "Function":
						// 对象的index目前发现Jquery返回的均为0，内部处理待研究
						object.style[name] = valOrFun && valOrFun.call(object,0,__PUBLIC__.getStyle(object, name));
						break;
					default:
						throw new TypeError(valOrFun, "invalid arguments");
				}
			});

			return this;
		},
		ajax: function(opt) {

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
		},
		/**
		 * @desc 替换当前元素 为 新 元素
		 *
		 * @param newElem {elem / string} 新元素 或 新内容
		 *
		 * @use $el.replaceWith()
		 * */
		replaceWith: function(newElem) {
			this.outerHTML = newElem;
			return this;
		},
		/**
		 * @desc 删除标签 / 设置标签内容为空
		 *
		 * @use $el.empty()
		 * */
		empty: function() {
			this.innerHTML = '';
			return this;
		},
		/**
		 * @desc 添加元素
		 *  属性解析：
		 *      1、innerHTML: 从对象的起始位置到终止位置的全部内容,不包括Html标签。
		 *      2、outerHTML: 除了包含innerHTML的全部内容外, 还包含对象标签本身。
		 *
		 * @param newElem {nodeList / string} 新元素 或 新内容
		 *
		 * @use
		 *  1、$el.append() 末尾添加
		 *  2、$el.prepend() 头部添加
		 *  3、$el.after() 指定标签之后添加
		 *  4、$el.before() 指定标签之前添加
		 * */
		append: function(newElem) {
			this.innerHTML += newElem;
			return this;
		},
		prepend: function(newElem) {
			this.innerHTML = newElem + this.innerHTML;
			return this;
		},
		after: function(newElem) {
			this.outerHTML += newElem;
			return this;
		},
		before: function(newElem) {
			this.outerHTML = newElem + this.outerHTML;
			return this;
		},
	};

	// 私有的API扩展至 $.fn 对象
	//[native code] prototype 是 const
	$.fn = $.extend(NodeList.prototype,__PROTO__);
	//创建了一个闭包空间
	return $;
}(window));

return;
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