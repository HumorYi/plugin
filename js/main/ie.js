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