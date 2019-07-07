var EventUtil = {
	/**
	 * @desc 添加事件
	 *
	 * @param element {elem} 元素
	 * @param type {string} 事件类型
	 * @param callback {function} 事件触发时执行的函数
	 * @return void
	 * */
	add: function(element, type, callback){
		if(element.addEventListener){
				element.addEventListener(type, callback, false);
		} else if(element.attachEvent){
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
	remove: function(element, type, callback){
		if(element.removeEventListener){
				element.removeEventListener(type, callback, false);
		} else if(element.detachEvent){
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
	getEvent: function(event){
		return event ? event : window.event;
	},
	/**
	 * @desc 获取 target 属性
	 *
	 * @param event {Object} 事件对象	 
	 * @return target {Object} 事件目标对象
	 * */
	getTarget: function(event){
		return event.target || event.srcElement;
	},
	/**
	 * @desc 阻止浏览器默认事件
	 *
	 * @param event {Object} 事件对象	 
	 * @return void
	 * */
	preventDefault: function(event) {
		event.preventDefault ? event.preventDefault() : event.returnValue = false;
	},
	/**
	 * @desc 阻止事件流或使用 cancelBubble
	 *
	 * @param event {Object} 事件对象	 
	 * @return void
	 * */
	stopPropagation: function(event){
		event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
	}
};