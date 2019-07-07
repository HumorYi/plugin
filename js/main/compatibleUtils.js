var compatibleUtils = {
	event: {
		/**
		 * @desc 添加事件
		 *
		 * @param element {elem} 元素
		 * @param type {string} 事件类型
		 * @param callback {function} 事件触发时执行的函数
		 * @return void
		 * */
		add: function (element, type, callback) {
			if (element.addEventListener) {
				element.addEventListener(type, callback, false);
			} else if (element.attachEvent) {
				element.attachEvent('on' + type, callback);
			} else {
				element['on' + type] = callback;
			}
		},
		/**
		 * @desc 移除事件
		 *
		 * @param element {elem} 元素
		 * @param type {string} 事件类型
		 * @param callback {function} 事件触发时执行的函数
		 * @return void
		 * */
		remove: function (element, type, callback) {
			if (element.removeEventListener) {
				element.removeEventListener(type, callback, false);
			} else if (element.detachEvent) {
				element.detachEvent('on' + type, callback);
			} else {
				element['on' + type] = null;
			}
		},
		/**
		 * @desc 获取 event 对象
		 *
		 * @param event {Object} 事件对象
		 * @return event {Object} 事件对象
		 * */
		getEvent: function (event) {
			return event ? event : window.event;
		},
		/**
		 * @desc 获取 target 属性
		 *
		 * @param event {Object} 事件对象
		 * @return target {Object} 事件目标对象
		 * */
		getTarget: function (event) {
			return event.target || event.srcElement;
		},
		/**
		 * @desc 阻止浏览器默认事件
		 *
		 * @param event {Object} 事件对象
		 * @return void
		 * */
		preventDefault: function (event) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
		},
		/**
		 * @desc 阻止事件流或使用 cancelBubble
		 *
		 * @param event {Object} 事件对象
		 * @return void
		 * */
		stopPropagation: function (event) {
			event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
		}
	},
	array: function () {
		/*兼容ES5 API S*/

		/**
		 * @desc isArray 判断当前元素是否为数组
		 *
		 * @params arr 要检查的数组
		 *
		 * @use Array.isArray(arr);
		 *
		 * @return {Boolean}
		 * */
		if (typeof Array.isArray !== "function") {
			Array.isArray = function (arr) {
				return Object.prototype.toString.call(arr) === "[object Array]";
			};
		}


		/**
		 * @desc forEach 遍历数组
		 *
		 * @params cb {Function} require 回调函数，
		 *												返回参数为：当前元素，当前元素所在下标，当前数组
		 * 									context? cb上下文，当传入cb是外部函数，需要指定上下文，避免this指向出错
		 *
		 * @use arr.forEach(function(val, i, currArr){});
		 *
		 * @return void
		 * */
		if (typeof Array.prototype.forEach !== "function") {
			Array.prototype.forEach = function (cb, context) {
				if (typeof cb !== "function") {
					throw new Error(cb + " is not a function at Array.forEach");
				}

				for (var i = 0, len = this.length; i < len; i++) {
					cb.call(context, this[i], i, this);
				}
			};
		}

		/**
		 * @desc map 遍历数组，按照指定的需求映射出新的数组
		 *
		 * @params cb {Function} require 回调函数，
		 *												返回参数为：当前元素，当前元素所在下标，当前数组
		 * 									context? cb上下文，当传入cb是外部函数，需要指定上下文，避免this指向出错
		 *
		 * @use arr.map(function(val, i, currArr){});
		 *
		 * @return {Array} newArray
		 * */
		if (typeof Array.prototype.map !== "function") {
			Array.prototype.map = function (cb, context) {
				if (typeof cb !== "function") {
					throw new Error(cb + " is not a function at Array.map");
				}

				for (var i = 0, len = this.length, result = []; i < len; i++) {
					result.push(cb.call(context, this[i], i, this));
				}
				return result;
			};
		}

		/**
		 * @desc filter 筛选符合条件的元素
		 *
		 * @params cb {Function} require 回调函数，
		 *												返回参数为：当前元素，当前元素所在下标，当前数组
		 * 									context? cb上下文，当传入cb是外部函数，需要指定上下文，避免this指向出错
		 *
		 * @use arr.filter(function(val, i, currArr){return val % 2 === 0; });
		 *
		 * @return {Array} newArray
		 * */
		if (typeof Array.prototype.filter !== "function") {
			Array.prototype.filter = function (cb, context) {
				if (typeof cb !== "function") {
					throw new Error(cb + " is not a function at Array.filter");
				}

				for (var i = 0, len = this.length, result = []; i < len; i++) {
					cb.call(context, this[i], i, this) && result.push(this[i]);
				}
				return result;
			};
		}

		/**
		 * @desc some 遍历数组中每个元素
		 *
		 * @params cb {Function} require 回调函数，
		 *												返回参数为：当前元素，当前元素所在下标，当前数组
		 * 									context? cb上下文，当传入cb是外部函数，需要指定上下文，避免this指向出错
		 *
		 * @use arr.some(function(val, i, currArr){return val % 2 === 0; });
		 *
		 * @return {Boolean}  只要有一个满足true，结束遍历, 否则返回false
		 * */
		if (typeof Array.prototype.some !== "function") {
			Array.prototype.some = function (cb, context) {
				if (typeof cb !== "function") {
					throw new Error(cb + " is not a function at Array.some");
				}

				for (var i = 0, len = this.length; i < len; i++) {
					if (cb.call(context, this[i], i, this)) {
						return true;
					}
				}

				return false;
			};
		}

		/**
		 * @desc every 遍历数组中每个元素
		 *
		 * @params cb {Function} require 回调函数，
		 *												返回参数为：当前元素，当前元素所在下标，当前数组
		 * 									context? cb上下文，当传入cb是外部函数，需要指定上下文，避免this指向出错
		 *
		 * @use arr.every(function(val, i, currArr){return val % 2 === 0; });
		 *
		 * @return {Boolean}  全部都满足条件，则返回true，否则只要有一个不满足就结束遍历，返回false
		 * */
		if (typeof Array.prototype.every !== "function") {
			Array.prototype.every = function (cb, context) {
				if (typeof cb !== "function") {
					throw new Error(cb + " is not a function at Array.every");
				}

				for (var i = 0, len = this.length; i < len; i++) {
					if (!cb.call(context, this[i], i, this)) {
						return false;
					}
				}

				return true;
			};
		}

		/**
		 * @desc reduce 按照数组索引值从低到高将元素组合，生成单个值
		 *
		 * @params cb {Function} require 回调函数，
		 *												返回参数为：上一个元素，当前元素，当前元素所在下标，当前数组
		 *									initialValue? 初始值
		 * 									context? cb上下文，当传入cb是外部函数，需要指定上下文，避免this指向出错
		 *
		 * @use arr.reduce(function(previous, current, i, arr){}, initialValue);
		 *
		 * @return {Any}
		 * */
		if (typeof Array.prototype.reduce !== "function") {
			Array.prototype.reduce = function (cb, initialValue, context) {
				if (typeof cb !== "function") {
					throw new Error(cb + " is not a function at Array.reduce");
				}

				var previous = initialValue,
					len = this.length,
					i = 0
					;

				// 未传初始值
				if (initialValue === undefined) {
					// 空数组不带初始值调用，报类型错误异常
					if (len === 0) {
						throw new TypeError("Reduce of empty array with no initial value");
					}
					else if (len === 1) { // 数组只有一个元素，则直接返回当前元素
						return this[0];
					}

					// 上一个值为数组第一个元素值，下标后移一位
					previous = this[0];
					i = 1;
				}
				else if (len === 0) {
					// 空数组直接返回初始值
					return initialValue;
				}

				for (; i < len; i++) {
					previous = cb.call(context, previous, this[i], i, this);
				}

				return previous;
			}
		}

		/**
		 * @desc reduceRight 按照数组索引值从高到低将元素组合，生成单个值
		 *
		 * @params cb {Function} require 回调函数，
		 *												返回参数为：上一个元素，当前元素，当前元素所在下标，当前数组
		 *									initialValue? 初始值
		 * 									context? cb上下文，当传入cb是外部函数，需要指定上下文，避免this指向出错
		 *
		 * @use arr.reduceRight(function(previous, current, i, arr){}, initialValue);
		 *
		 * @return {Any}
		 * */
		if (typeof Array.prototype.reduceRight !== "function") {
			Array.prototype.reduceRight = function (cb, initialValue, context) {
				if (typeof cb !== "function") {
					throw new Error(cb + " is not a function at Array.reduceRight");
				}

				var previous = initialValue,
					len = this.length,
					i = len - 1
					;

				// 未传初始值
				if (initialValue === undefined) {
					// 空数组不带初始值调用，报类型错误异常
					if (len === 0) {
						throw new TypeError("Reduce of empty array with no initial value");
					}
					else if (len === 1) { // 数组只有一个元素，则直接返回当前元素
						return this[0];
					}

					// 上一个值为数组第一个元素值，下标后移一位
					previous = this[i];
					i--;
				}
				else if (len === 0) {
					// 空数组直接返回初始值
					return initialValue;
				}

				for (; i >= 0; i--) {
					previous = cb.call(context, previous, this[i], i, this);
				}

				return previous;
			}
		}

		/**
		 * @desc indexOf 正序查找某元素在数组中的下标
		 *
		 * @params searchElement 要查找的元素
		 * 									fromIndex? default 0, 从哪个位置开始查找，支持负数，即倒叙查找
		 *
		 * @use arr.indexOf(4);
		 *
		 * @return {Number} 未查找到则返回-1，否则返回查找到的下标
		 * */
		if (typeof Array.prototype.indexOf !== "function") {
			Array.prototype.indexOf = function (searchElement, fromIndex) {
				// 默认从0开始查找
				var startIndex = 0,
					len = this.length
					;

				// 如果是纯字符串正整数
				if (/^-?\d+$/.test(fromIndex)) {
					if (typeof (fromIndex) === "string") {
						// 否则则转为数字类型
						fromIndex = Number(fromIndex);
					}

					// 如果要查找的下标 > 数组最大下标，即不可能找到，返回-1
					if (fromIndex > len - 1) {
						return -1;
					}
					else if (fromIndex >= 0) { // 否则如果要查找的下标 >= 0,则从此下标开始查找
						startIndex = fromIndex;
					}
					else if (-fromIndex <= len - 1) { // 否则如果要查找的下标小于0,并且取正数之后 <= 数组最大下标，则从 len + fromIndex 位置开始查找
						startIndex = len + fromIndex;
					}
				}

				for (; startIndex < len; startIndex++) {
					if (searchElement === this[startIndex]) {
						return startIndex;
					}
				}

				return -1;
			};
		}

		/**
		 * @desc lastIndexOf 倒序查找某元素在数组中的下标
		 *
		 * @params searchElement 要查找的元素
		 * 									fromIndex? default 0, 从哪个位置开始查找，支持负数，即倒叙查找
		 *
		 * @use arr.lastIndexOf(4);
		 *
		 * @return {Number} 未查找到则返回-1，否则返回查找到的下标
		 * */
		if (typeof Array.prototype.lastIndexOf !== "function") {
			Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
				// 默认从0开始查找
				var startIndex = this.length - 1;

				// 如果是纯字符串正整数
				if (/^-?\d+$/.test(fromIndex)) {
					if (typeof (fromIndex) === "string") {
						// 否则则转为数字类型
						fromIndex = Number(fromIndex);
					}

					// 如果要查找的下标 > 数组最大下标，即不可能找到，返回-1
					if (fromIndex > startIndex) {
						return -1;
					}
					else if (fromIndex >= 0) { // 否则如果要查找的下标 >= 0,则从此下标开始查找
						startIndex = fromIndex;
					}
					else if (-fromIndex <= startIndex) { // 否则如果要查找的下标小于0,并且取正数之后 <= 数组最大下标，则从 startIndex +=  fromIndex 位置开始查找
						startIndex += fromIndex;
					}
				}

				for (; startIndex >= 0; startIndex--) {
					if (searchElement === this[startIndex]) {
						return startIndex;
					}
				}

				return -1;
			};
		}

		/*兼容ES5 API E*/
	},
	object: function () {
		/*兼容ES5 API S*/

		/**
		 * @desc create 创建一个已经选择了原型的新对象，但没有把第二个参数考虑在内。
		 *					请注意，尽管在 ES5 中 Object.create支持设置为[[Prototype]]为null，
		 *						但因为那些ECMAScript5以前版本限制，此 polyfill 无法支持该特性。
		 *
		 * @params father 要继承的对象
		 *
		 * @use Object.create(father);
		 *
		 * @return {Object} 一个已经选择了原型的新对象
		 *
		 * @note 为什么create方法定义在构造函数上 ?
		 * 					=> 将来继承的父对象无法确定(所有的对象均可调用)
		 * 			兼容IE8 => 不支持四大特性，只能传value
		 * */
		if (typeof Object.create !== "function") {
			Object.create = function (father, properties) {
				if (typeof father !== 'object' && typeof father !== 'function') {
					throw new TypeError('Object prototype may only be an Object: ' + father);
				} else if (father === null) {
					throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
				}

				//Step1:定义临时空构造
				var Temp = function () { };
				//Step2:设置空构造的prototype引用父对象
				Temp.prototype = father;
				//Step3:用临时构造函数实例化子对象
				var child = new Temp();
				Temp = null;
				//Step4.为child扩展新属性:
				if (properties) {
					for (var key in properties) {
						if (properties.hasOwnProperty(key)) {
							child[key] = properties[key].value;
						}
					}
				}
				return child;
			};
		}
		/*兼容ES5 API E*/
	},
	function: function () {
		/**
		 * @desc bind 将函数绑定至某个对象
		 *
		 * @params obj 要检查的对象
		 *
		 * @use fn.bind(obj);
		 *
		 * @return void
		 * */
		if (typeof Function.prototype.bind !== "function") {
			Function.prototype.bind = function (context/*, arg */) {
				/* 参数检测 S */
				if (typeof this !== "function") {
					throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
				}

				if (Object.prototype.toString.call(context).slice(8, -1) !== "Object") {
					throw new TypeError("context must be a json");
				}
				/* 参数检测 E */

				var target = this;
				// 获取函数绑定时传递的实参，默认第一个为要绑定的执行上下文对象，剩余实参为函数调用时传递的实参
				var args = Array.prototype.slice.call(arguments, 1);

				/**
				 * 注意：构造函数调用时会忽略bind绑定的上下文，构造函数内部的上下文为实例化出来的新对象。
				 *
				 * 问题来了：如何判断用户是 普通函数调用 还是 构造函数调用？
				 * 	已知：构造函数调用会创建一个实例，如何拿这个实例来做点文章？
				 * 	求解：通过为函数调用时绑定函数执行上下文，返回的是一个新函数，
				 * 			如果是通过构造函数调用新函数，那么也是基于这个新函数实例化出来的，或者说是要绑定的函数的子类。
				 *
				 * 			如果 要绑定的函数和返回的新函数 都是某个构造函数的实例，
				 * 				则 用户调用新函数 是 构造函数调用，否则为普通函数调用。
				 *
				 * 实现方式：闭包
				*/

				// 函数绑定执行上下文调用时执行的动态函数
				var bound;

				// 要返回的新函数
				var binder = function () {
					// 函数绑定时传递的实参 拼接上 函数调用时传递的实参，最终结果传递给函数形参对象使用
					var finalArgs = args.concat(Array.prototype.slice.call(arguments));
					// 如果是使用new操作符用于构造函数方式调用，则内部this为新创建的对象this
					if (this instanceof bound) {
						// 获取函数返回值
						var result = target.apply(this, finalArgs);
						// 如果返回值是一个引用类型数据，则直接返回该数据，否则返回当前对象内部的this
						return Object(result) === result ? result : this;
					}

					// 如果是普通函数调用，则内部this为要绑定的执行上下文context
					return target.apply(context, finalArgs);
				};

				// 获取未传参个数
				var boundLength = Math.max(0, target.length - args.length);
				// 存储为传递的参数名
				var boundArgs = [];
				for (var i = 0; i < boundLength; boundArgs.push('$' + i++)) { }

				// 动态绑定剩余未传递参数，提示用户输入
				bound = Function('binder', 'return function(' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

				// 如果要调用的函数由原型，则把要返回的新函数 关联 要绑定的函数 -> 构造函数
				if (target.prototype) {
					// 1、创建一个临时的构造函数
					var Empty = function () { };
					// 2、设置临时构造函数的原型为要绑定的函数的原型
					Empty.prototype = target.prototype;
					// 3、设置新函数的原型为一个实例化的临时构造函数
					bound.prototype = new Empty();
					// 4、清除临时构造函数原型绑定引用
					Empty.prototype = null;
				}

				// 返回函数绑定执行上下文调用时执行的动态函数
				return bound;
			};
		}
	},
	string: function () {
		/**
		 * @desc trim 去掉字符串两端的多余空格
		 *
		 * @use str.trim();
		 *
		 * @return void
		 * */
		if (typeof String.prototype.trim !== "function") {
			String.prototype.trim = function () {
				// 空字符串不做处理
				if (!this) { return this; }

				// 使用正则表达式进行空格替换
				return this.replace(/^\s+|\s+$/g, "");
			};
		}
	},
	h5: function () {
		/**
		 * @desc requestAnimationFrame 智能定时器
		 *
		 * @use window.requestAnimationFrame();
		 *
		 * @return void
		 * */
		if (typeof window.requestAnimationFrame !== 'function') {
			window.requestAnimationFrame =
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
					return window.setTimeout(callback, 1000 / 60);
				};
		}
	},
	other: function () {
		/**
		 * @desc CustomEvent 自定义事件
		 *
		 * @params {String} type 事件类型名字 require
		 * @params {Object} config 事件配置
		 * 	default: { bubbles: false, cancelable: false }
		 *
		 * @use new CustomEvent('test');
		 *
		 * @return {Object} CustomEvent
		 * */
		if (typeof window.CustomEvent !== "function") {
			window.CustomEvent = function(type, config) {
				config = config || { bubbles: false, cancelable: false, detail: undefined};
				var e = document.createEvent('CustomEvent');
				e.initCustomEvent(type, config.bubbles, config.cancelable, config.detail);
				return e;
			};
			window.CustomEvent.prototype = window.Event.prototype;
		}
	}
};

// 依次执行内部的兼容函数
for (var key in compatibleUtils) {
	typeof compatibleUtils[key] === "function" && compatibleUtils[key]();
}