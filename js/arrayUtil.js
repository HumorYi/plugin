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
	Array.isArray = function(arr){
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
	Array.prototype.forEach = function(cb, context){
		if (typeof cb !== "function") {
			throw new Error(cb + " is not a function at Array.forEach");
		}

	 for(var i=0, len=this.length; i<len; i++){
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
	Array.prototype.map = function(cb, context){
		if (typeof cb !== "function") {
			throw new Error(cb + " is not a function at Array.map");
		}

		for(var i=0, len=this.length, result=[]; i<len; i++){
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
	Array.prototype.filter = function(cb, context){
		if (typeof cb !== "function") {
			throw new Error(cb + " is not a function at Array.filter");
		}

		for(var i=0, len=this.length, result=[]; i<len; i++){
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
	Array.prototype.some = function(cb, context){
		if (typeof cb !== "function") {
			throw new Error(cb + " is not a function at Array.some");
		}

		for(var i=0, len=this.length; i<len; i++){
			if(cb.call(context, this[i], i, this)) {
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
	Array.prototype.every = function(cb, context){
		if (typeof cb !== "function") {
			throw new Error(cb + " is not a function at Array.every");
		}

		for(var i=0, len=this.length; i<len; i++){
			if(!cb.call(context, this[i], i, this)) {
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
	Array.prototype.reduce = function(cb, initialValue, context){
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
		else if (len === 0){
			// 空数组直接返回初始值
			return initialValue;
		}

		for (; i<len; i++) {
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
	Array.prototype.reduceRight = function(cb, initialValue, context){
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
		else if (len === 0){
			// 空数组直接返回初始值
			return initialValue;
		}

		for (; i>=0; i--) {
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
if (typeof Array.prototype.indexOf  !== "function") {
	Array.prototype.indexOf = function(searchElement, fromIndex){		
		// 默认从0开始查找
		var startIndex = 0,
					len = this.length
		;

		// 如果是纯字符串正整数
		if (/^-?\d+$/.test(fromIndex)){
			if (typeof(fromIndex)==="string") {
				// 否则则转为数字类型
				fromIndex = Number(fromIndex);					
			}

			// 如果要查找的下标 > 数组最大下标，即不可能找到，返回-1
			if (fromIndex > len-1) {
				return -1;
			}
			else if (fromIndex >= 0) { // 否则如果要查找的下标 >= 0,则从此下标开始查找
				startIndex = fromIndex;
			}
			else if (-fromIndex <= len - 1) { // 否则如果要查找的下标小于0,并且取正数之后 <= 数组最大下标，则从 len + fromIndex 位置开始查找 
				startIndex = len + fromIndex;
			}
		}

		for(; startIndex<len; startIndex++){
			if(searchElement === this[startIndex]) {
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
if (typeof Array.prototype.lastIndexOf  !== "function") {
	Array.prototype.lastIndexOf = function(searchElement, fromIndex){
		// 默认从0开始查找
		var startIndex = this.length-1;

		// 如果是纯字符串正整数
		if (/^-?\d+$/.test(fromIndex)){
			if (typeof(fromIndex)==="string") {
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
				startIndex +=  fromIndex;
			}
		}

		for(; startIndex>=0; startIndex--){
			if(searchElement === this[startIndex]) {
				return startIndex;
			}
		}

		return -1;
	};
}

 /*兼容ES5 API E*/

// 判断是否为类数组对象
Array.prototype.isArrayLike = function() {
	if (
		this &&																														// this非undefined、null等
		typeof(this) === "object" &&													// this是对象
		typeof(this.length) === "number" &&						// this.length 是数字类型
		isFinite(this.length) &&																		// this.length 是有限数值
		this.length < Math.pow(2, 32)	 &&									// this.length < 2^32
		this.length >= 0 &&																				// this.length 为非负数
		this.length === Math.floor(this.length)					// this.length 是正整数
	) {
		return true;
	}

	return false;
};

/**
 * @desc 数组元素去重
 *
 * @use arr.unique();
 *
 * @return {array} 经过去重后的新数组
 * */
Array.prototype.unique = function(){
	if (this.length<2) {return this;}
	
	var res = [], json = {};
	for(var i=0, len=this.length; i<len; i++){
		var currElem = this[i];
		if(!json[currElem]){
			res.push(currElem);
			json[currElem] = true;
		}
	}

	json = null;
	return res;
};

/**
 * @desc 数组元素倒叙排序
 *
 * @use arr.reverseArr();
 *
 * @return {array} 经过倒叙排序后的新数组
 * */
Array.prototype.reverseArr = function(){
	if (this.length<2) {return this;}
	
	for(var i=this.length-1, res=[]; i>=0; res.push(this[i--]));
	return res;
};

/**
 * @desc 判断两个数组内部的元素是否完全一致
 *
 * @param arr1 {Array}
 * @param arr2 {Array}
 *
 * @return {Boolean}
 * */
function arrayEqueal(arr1, arr2) {
		if (Object.prototype.toString.call(arr1).slice(8, -1) !== "Array") {
			throw new Error("arr1 不是数组");
		}

		if (Object.prototype.toString.call(arr2).slice(8, -1) !== "Array") {
			throw new Error("arr2 不是数组");
		}

		if (arr1 === arr2) {return true;}

    if (arr1.length !== arr2.length) {return false;}

    for (var i = arr1.length - 1; i > 0; i--) {
        if (arr1[i] !== arr2[i]) {return false;}
    }

    return true;
};

/**
 * @desc 数组冒泡排序
 *
 * @use arr.bubbleSort();
 *
 * @return {array} 经过冒泡排序后的数组
 * */
Array.prototype.bubbleSort = function () {
    for (var i = 0, len_i=this.length; i < len_i; i++) {
        for (var j = 0, len_j = this.length - i; j < len_j; j++) {
            if (this[j] >  this[j + 1]) {
                // 效率过低 且 可读性差
                 // this[j] = [ this[j + 1], this[j + 1] =  this[j]][0];

                var temp = this[j];
                this[j] = this[j + 1];
                this[j + 1] = temp;
            }
            // curr_j > next_j && (curr_j = [next_j, next_j = curr_j][0]);
        }
    }
    return this;
};

/**
 * @desc 字符串倒叙排序
 *
 * @use str.reverseStr();
 *
 * @return {string} 经过倒叙排序后的字符串
 * */
String.prototype.reverseStr = function(){
	if (this.length<2) {return this;}
	
	for(var i=this.length, str=''; i>0; str+=this[--i]);
	return str;
};