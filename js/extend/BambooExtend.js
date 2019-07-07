(function(global, factory, plug){
	if (global.hasOwnProperty(plug)) {
		throw new Error("插件 " + plug + " 已存在");
	}
	
	global[plug] = factory;
})(window, function(){
	// 类型判断
	var _type = function(data) {
		return Object.prototype.toString.call(data).slice(8, -1);
	};
	
	// 继承内部json
	var _extendInnerJson = function (root, json){
		if (_type(json) !== "Object") {
			throw new Error(json + "必须是对象");
		}
		
		// 迭代json
		Object.keys(json).map(function(key, index) {
			var currRootVal = root[key],
					currJsonVal = json[key]
			;
			
			// 如果root对象中有这个key并且值是一个对象
			if (root.hasOwnProperty(key) && _type(currRootVal) === "Object") {
				// 如果要继承的json中这个key的值不是一个对象，则抛出异常
				if(_type(currJsonVal) !== "Object") {
					throw new Error(key + "必须是对象");
				}
				
				// 否则继续递归迭代该对象值
				return _extendInnerJson(currRootVal, currJsonVal);
			}
			
			// 否则直接把json中这个key的值赋给root中对应的key
			root[key] = currJsonVal;
		}.bind(this));
	};
	
	// 遍历参数列表，开始执行继承
	for (var i = 1, len = arguments.length; i < len; i++) {
		_extendInnerJson(arguments[0], arguments[i]);				
	}

	_type = null;
	_extendInnerJson = null;
	
	// 返回根对象，即第一个参数
	return arguments[0];
}, "BambooExtend");