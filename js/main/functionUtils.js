let functionUtils = {
  array: {
    /**
     * @desc 创建指定大小的数组
     *
     * @param {Number} size 要创建数组的长度
     *
     * @return {Array} 创建好的数组
     * */
    createSizeArray(size) {

      if (typeof size !== 'number') {
        throw TypeError('size must be a number');
      }

      return [...Array(size).keys()];
    },
    /**
     * @desc 数组去重
     *
     * @param {Array} arr 要去重的数组
     *
     * @return {Array} 去重好的新数组
     * */
    repeat(arr) {

      if (!Array.isArray(arr)) {
        throw TypeError('please transfer a array, thanks!');
      }

      return arr.length < 2 ? arr : [...new Set(arr)];
    },
    /**
     * @desc 数组混淆
     *
     * @param {Array} arr 要混淆的数组
     *
     * @return {Array} 混淆好的新数组
     * */
    mix(arr) {

      if (!Array.isArray(arr)) {
        throw TypeError('please transfer a array, thanks!');
      }

      return arr.slice().sort(() => Math.random() - 0.5);
    },
    /**
     * @desc 判断是否为类数组对象
     *
     * @param {ArrayLike} arrayLike 要做判断的类数组对象
     *
     * @return {Boolean} 经过去重后的新数组
     * */
    isArrayLike(arrayLike) {

      if (
        arrayLike && // arrayLike非undefined、null等
        typeof arrayLike === 'object' && // arrayLike是对象
        typeof arrayLike.length === 'number' && // arrayLike.length 是数字类型
        isFinite(arrayLike.length) && // arrayLike.length 是有限数值
        arrayLike.length < Math.pow(2, 32) && // arrayLike.length < 2^32
        arrayLike.length >= 0 && // arrayLike.length 为非负数
        arrayLike.length === Math.floor(arrayLike.length) // arrayLike.length 是正整数
      ) {
        return true;
      }

      return false;
    },
    /**
     * @desc 将类数组对象转换为真正的数组
     *
     * @param {ArrayLike} arrayLike 要转换为数组的类对象
     * @param {Number} startIndex default: 0; 开始位置
     *
     * @return {Array} 转换好的数组
     * */
    arrayLikeToArray(arrayLike, startIndex) {
      return Array.prototype.slice.call(arrayLike, startIndex || 0);
    },
    /**
     * @desc 判断要比较的数组们是否完全一致
     *
     * @param {Array} arrs 要比较的数组们
     *
     * @return {Boolean}
     * */
    equal(arrs) {

      if (!Array.isArray(arrs)) {
        functionUtils.log('传入的参数数据必须是个数组，该数据为:');
        functionUtils.log(arrs);
        throw TypeError();
      }

      let startArr = arrs[0],
          arrLen = arrs.length,
          startArrLen = startArr.length,
          i,
          j
      ;

      if (arrLen < 2) {
        return true;
      }

      // 数据验证
      for (i = 1; i < arrLen; i++) {

        let currArr = arrs[i];

        if (!Array.isArray(currArr)) {

          functionUtils.log(`第 ${i} 位置处的数据必须是个数组，该数据为:`);

          functionUtils.log(currArr);

          throw TypeError();

        }

        if (startArr !== currArr) {

          if (startArrLen !== currArr.length) {

            functionUtils.log(`第 ${i} 位置处的数据与前面的数据长度不一致，该数据为:`);

            functionUtils.log(currArr);

            return false;

          }

          for (j = 0; j < startArrLen; j++) {

            if (startArr[j] !== currArr[j]) {

              functionUtils.log(`第 ${i} 位置处的数据里面的第 ${j} 位置处的数据与前面的数据不一致，该数据为:`);

              functionUtils.log(currArr[j]);

              return false;

            }
          }
        }

      }

      return true;
    },
    /**
     * @desc 数组排序方法
     * */
    sorts: {
      /**
       * @desc 数组冒泡排序
       *
       * @param {Array} arr 要冒泡排序的数组
       *
       * @return {array} 经过冒泡排序后的数组
       * */
      bubble(arr) {

        if (!Array.isArray(arr)) {
          throw TypeError('please transfer a array, thanks!');
        }

        for (let i = 0, len_i = arr.length; i < len_i; i++) {

          for (let j = 0, len_j = len_i - i; j < len_j; j++) {

            if (arr[j] > arr[j + 1]) {

              let temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;

            }

          }
        }
        return arr;
      }
    },
    /**
     * @desc 数值数组数学方法
     * */
    math: {
      /**
       * @desc 获取数字数组中的最大值
       *
       * @param {Array} arr 要获取的数字数组
       *
       * @return {Number} 要获取的数字数组中的最大值
       */
      max(arr) {

        if (!Array.isArray(arr)) {
          throw TypeError('please transfer a array, thanks!');
        }

        return Math.max.apply(Math, arr);
      },
      /**
       * @desc 获取数字数组中的最小值
       *
       * @param {Array} arr 要获取的数字数组
       *
       * @return {Number} 要获取的数字数组中的最小值
       */
      min(arr) {

        if (!Array.isArray(arr)) {
          throw TypeError('please transfer a array, thanks!');
        }

        return Math.min.apply(Math, arr);
      },
      /**
       * @desc 获取数字数组中的数值和
       *
       * @param {Array} arr 要获取的数字数组
       *
       * @return {Number} 数字数组中的数值和
       */
      sum(arr) {

        if (!Array.isArray(arr)) {
          throw TypeError('please transfer a array, thanks!');
        }

        return arr.reduce((accumulator, currentValue) => accumulator + currentValue);
      },
      /**
       * @desc 获取数字数组中的平均值
       *
       * @param {Array} arr 要获取的数字数组
       *
       * @return {Number} 数字数组中的数值和
       */
      avg(arr) {

        if (!Array.isArray(arr)) {
          throw TypeError('please transfer a array, thanks!');
        }

        return functionUtils.array.math.sum(arr) / arr.length;
      },
      /**
       * @desc 获取数字数组中的标准差
       *
       * @param {Array} arr 要获取的数字数组
       *
       * @return {Number} 数字数组中的标准差
       */
      stddev(arr) {

        if (!Array.isArray(arr)) {
          throw TypeError('please transfer a array, thanks!');
        }

        let avg = functionUtils.array.math.avg(arr);

        return Math.sqrt(

          arr.reduce((accumulator, currentValue) => {

            currentValue -= avg;

            return accumulator += currentValue * currentValue;

          }, 0) / (arr.length - 1)

        );
      },
      commonDivisor: {
        /**
         * @desc 求两个数的最大公约数
         *
         * @param {Number} num1 要比较的数字1
         * @param {Number} num2 要比较的数字2
         * @returns {Number} 两个数的最大公约数
         */
        maxForTwoNumber(num1, num2) {

          if (typeof (num1) !== "number") {
            throw TypeError("num1 must be a number, current value is " + num1);
          }

          if (typeof (num2) !== "number") {
            throw TypeError("num2 must be a number, current value is " + num2);
          }

          // 递归方式
          // return num2 === 0 ? num1 : functionUtils.array.math.commonDivisor.maxForTwoNumber(num2, num1 % num2);

          // 循环方式
          let temp; // 使用临时变量来存储交换数值
          // 保证num2最小
          if (num1 < num2) {
            temp = num2;
            num2 = num1;
            num1 = temp;
          }

          // 当num2的值不为0时，循环查询
          while (num2) {
            temp = num2;
            num2 = num1 % num2;
            num1 = temp;
          }

          return num1;
        },
        /**
         * @desc 求数组内多个数的最大公约数
         *
         * @param {Array} arrNumber 要比较的数字数组
         * @returns {Number} 公共公约数数组
         */
        maxForArrayNumber(arrNumber) {

          if (!Array.isArray(arr)) {
            throw TypeError('please transfer a array, thanks!');
          }

          // 方式二(推荐)：拷贝一份原数组副本，直接操作新数组
          let cloneArr = [...arrNumber],
              maxForTwoNumber = functionUtils.array.math.commonDivisor.maxForTwoNumber
          ;

          while (cloneArr.length > 1) {

            let gcd = maxForTwoNumber(cloneArr.shift(), cloneArr.shift());

            if (gcd === 1) { return gcd; }

            // 再把最大公约数添加到数组头部，与后续元素继续比较，反复此操作
            cloneArr.unshift(gcd);

          }

          // 数组内部所有元素的最大公约数在数组的第一个元素中
          return cloneArr[0];

          // 方式一：直接使用原数组
          /* let commonDivisorsForTwoNumber, // 内部项与当前项的所有公约数
            commonDivisors = [], // 公约数列表
            commonCommonDivisor = [], // 共同的公约数列表
            newCurrItemCommonDivisor = [], //新的当前项公约数
            arrNumberLen = arrNumber.length,
            isExitsCommonDivisor = true,
            hasIterateCommonDivisorItem = {}, // 已经遍历过的公约数项
            i,
            j
            ;

          if (arrNumberLen < 2) {
            throw RangeError("data length must greater than 1");
          }

          // 首先检索数组中是否有值为0或-0的元素，有则0就是集体的最大公约数
          if (arrNumber.indexOf(0) !== -1) { return 0; }
          // 否则检索数组中是否有值为1的元素，有则1就是集体的最大公约数
          else if (arrNumber.indexOf(1) !== -1) { return 1; }
          // 否则检索数组中是否有值为-1的元素，有则-1就是集体的最大公约数
          else if (arrNumber.indexOf(-1) !== -1) { return -1; }

          // 依次循环遍历数组
          for (i = 0; i < arrNumberLen; i++) {

            // 数组内部每一项都需要与其他项做比较，选出与其他项的最大公约数
            for (j = 1; j < arrNumberLen; j++) {
              if (i === j) { continue; }

              // 获取当前项与其他项的所有公约数
              commonDivisorsForTwoNumber = functionUtils.array.math.commonDivisor.allForArrayNumber([arrNumber[i], arrNumber[j]], "positive", Math.max.call(Math, commonDivisors[i]));

              // 如果当前项与其他项的所有公约数只有一个，那只能是1，则1就是集体的最大公约数
              if (commonDivisorsForTwoNumber.length === 1) {
                return 1;
              }

              // 如果当前公约数项还没有数据，直接把得到公约数项数据赋值给当前项
              if (!commonDivisors[i]) {
                commonDivisors[i] = commonDivisorsForTwoNumber;
              }
              // 如果 当前公约数项 不都在 当前项与其他项的所有公约数 中
              else if (commonDivisorsForTwoNumber.join().indexOf(commonDivisors[i].join()) === -1) {
                // 清空当前的新项公约数列表
                newCurrItemCommonDivisor = [];

                // 谁的长度短，就拿谁来循环，得到公共公约数，把公共公约数 添加到 当前的新项公约数列表
                if (commonDivisors[i].length <= commonDivisorsForTwoNumber.length) {
                  commonDivisors[i].forEach((item) => {
                    if (commonDivisorsForTwoNumber.indexOf(item) !== -1) {
                      newCurrItemCommonDivisor.push(item);
                    }
                  });
                }
                else {
                  commonDivisorsForTwoNumber.forEach((item) => {
                    if (commonDivisors[i].indexOf(item) !== -1) {
                      newCurrItemCommonDivisor.push(item);
                    }
                  });
                }

                // 如果当前项与其他项的所有公约数只有一个，那只能是1，则1就是集体的最大公约数
                if (commonDivisorsForTwoNumber.length === 1) {
                  return 1;
                }
                // 把当前的新项公约数列表 赋值给 当前项公约数列表
                commonDivisors[i] = newCurrItemCommonDivisor;
              }
            }
          }

          // 遍历公约数列表中的第一项，内部的数据挨个去与后续公约数列表项内的数据比较，
          //  如果后续公约数列表项内都有此数据，则把该数据添加到公共公约数列表中
          for (i = commonDivisors[0].length; i > 0; i--) {
            // 重置当前公共公约数存在状态为存在
            isExitsCommonDivisor = true;

            // 循环遍历后续公约数列表，公约数列表长度同传入的数值数组列表长度一致
            for (j = arrNumberLen - 1; j > 0; j--) {
              let key = commonDivisors[j].join();
              // 不需要比较完全包含的数据 | 当前公约数项已经在前边有共同的数据遍历过
              if (key.indexOf(commonDivisors[0].join()) !== -1 ||
                hasIterateCommonDivisorItem[key]
              ) {
                // 重置当前公共公约数存在状态为不存在
                isExitsCommonDivisor = false;
                continue;
              }

              // 如果当前访问项未注册，则注册当前已访问项
              if (!hasIterateCommonDivisorItem[key]) {
                hasIterateCommonDivisorItem[key] = true;
              }

              // 如果在后续公约数列表 找不到 第一项公约数内部的当前数据，
              // 则证明该数据 不是 公共公约数，后续循环也没有必要了，退出当前遍历循环
              if (commonDivisors[j].indexOf(commonDivisors[0][i]) === -1) {
                // 重置当前公共公约数存在状态为不存在
                isExitsCommonDivisor = false;
                break;
              }
            }

            // 如果当前公约数是 公共公约数，则添加到公共公约数列表中
            if (isExitsCommonDivisor) {
              commonCommonDivisor.push(commonDivisors[0][i]);
            }
          }

          // 如果当前公共公约数列表一个数据都没有，那证明公约数列表中内部的所有数据都一致
          if (commonCommonDivisor.length === 0) {
            commonCommonDivisor = commonDivisors[0];
          }

          // 否则，则这个数字数组中的内部数据的最大公约数就是公共公约数列表的最大值
          return Math.max.apply(Math, commonCommonDivisor); */
        },
        /**
         * @desc 求数组内多个数的所有公约数
         *
         * @param {Array} arrNumber 数字数组
         * @param {String} type ? default "positive", option val is "all" | "positive" | "negative"
         * @param {Number} max ? 最大值   * 如果要是有该值，type必须传值
         *
         * @returns {Array} 公共公约数数组
         */
        allForArrayNumber(arrNumber, type, max) {
          // 初始化类型
          type = type || "positive";

          if (!Array.isArray(arrNumber)) {
            throw TypeError("arrNumber must be a array, current value is " + arrNumber);
          }

          if (!/^(all|positive|negative)$/.test(type)) {
            throw RangeError('type val must "all" | "positive" | "negative"，current value is : ' + type);
          }

          if (max && typeof (max) !== "number") {
            throw TypeError("max must be a string，current value is : " + max);
          }

          // 必须是数字数组
          if (/[^\d]/.test(arrNumber.join(""))) { throw TypeError("please transfer a number array, thanks!"); }

          // 首先检索数组中是否有值为0或-0的元素，有则0就是集体的最大公约数
          if (arrNumber.includes(0)) { return [0]; }

          // 再检索数组中是否有值为1或-1的元素，有则1或-1就是集体的最大公约数
          if (arrNumber.includes(1) || arrNumber.includes(-1)) {

            switch (type) {

              case "all":
                commonDivisor = [1, -1];
                break;

              case "positive":
                commonDivisor = [1];
                break;

              case "negative":
                commonDivisor = [-1];
                break;

            }

            return commonDivisor;

          }

          // 数组排序
          let uniqueArrNumber = [...new Set(arrNumber.map(item => Math.abs(item)))].sort((a, b) => a - b),
            uniqueArrNumberLen = uniqueArrNumber.length,
            min = Math.abs(uniqueArrNumber[0]), // 获取最小值
            commonDivisor = [], // 公约数列表
            i = 0,
            j = 0
          ;

          for (; j <= min; j++) {

            // 如果有最大值，并且当前数 大于 最大值的绝对值，则表明要求执行到此结束
            if (max && j > Math.abs(max)) {
              return commonDivisor;
            }

            for (i = 0; i < uniqueArrNumberLen; i++) {

              // 如果当前数不能都被所有数整除，则此数不是所有数的共同公约数
              if (uniqueArrNumber[i] % j !== 0) { break; }

              // 不到最后一个通过就不是所有数的共同公约数
              if (i !== uniqueArrNumberLen - 1) { continue; }

              // 根据获取类型来添加所有数的共同公约数
              switch (type) {

                case "all":
                  commonDivisor.push(j, -j);
                  break;

                case "positive":
                  commonDivisor.push(j);
                  break;

                case "negative":
                  commonDivisor.push(-j);
                  break;

              }
            }
          }

          return commonDivisor;
        }
      }
    }
  },
  object: {
    /**
     * @desc 判断要比较的对象们是否完全一致
     *
     * @param {Array} objArr 数组内部是要比较的对象们
     *
     * @return {Boolean}
     * */
    equal(objArr) {

      if (!Array.isArray(objArr)) {
        throw TypeError('please transfer a array, thanks!');
      }

      let objLen = objArr.length,
          startObj = objArr[0],
          startObjKey = Object.keys(startObj),
          startObjLen = startObjKey.length,
          i
      ;

      if (objLen < 2) {
        return true;
      }

      // 数据验证
      for (i = 1; i < objLen; i++) {

        let currObj = objArr[i];

        if (functionUtils.getDataType(currObj) !== 'Object') {

          functionUtils.log(`第 ${i} 位置处的数据必须是个对象，该数据为:`);

          functionUtils.log(currObj);

          throw TypeError();

        }

        if (startObj !== currObj) {

          if (startObjLen !== Object.keys(currObj).length) {

            functionUtils.log(`第 ${i} 位置处的数据与前面的数据长度不一致，该数据为:`);

            functionUtils.log(currObj);

            return false;
          }

          for (j = 0; j < startObjLen; j++) {

            let currKey = startObjKey[j];

            if (!currObj.hasOwnProperty(currKey)) {

              functionUtils.log(`第 ${i} 位置处的数据没有属性名为：${currKey} 的数据`);

              return false;
            }

            if (startObj[currKey] !== currObj[currKey]) {

              functionUtils.log(`第 ${i} 位置处的数据里面的属性名为：${currKey} 的数据与前面的数据不一致，该数据为:`);

              functionUtils.log(currObj[currKey]);

              return false;
            }
          }
        }
      }

      return true;
    },
    /**
     * @desc 深度扩展对象内容，以第一个对象为源对象，后续的对象属性会直接覆盖前面的对象属性
     *
     * @param {Object} objArr 要扩展的对象数组
     *
     * @returns {Object} 扩展好的第一个对象
     */
    extend(objArr) {

      if (!Array.isArray(objArr)) {
        throw TypeError('please transfer a array, thanks!');
      }

      let argLen = objArr.length,
          originalObj = objArr[0]
      ;

      if (argLen < 2) {
        return originalObj;
      }

      // 遍历参数列表，开始执行继承
      for (let i = 1; i < argLen; i++) {

        for (let key in objArr[i]) {

          if (objArr[i].hasOwnProperty(key)) {
            originalObj[key] = objArr[i][key];
          }

        }
      }

      // 清楚无效数据
      argLen = null;

      // 返回根对象，即第一个参数
      return originalObj;
    },
    /**
     * @desc 深度扩展对象内容（属性值为对象也会继续扩展内部对象属性，一直递归扩展下去），
     *        以第一个对象为源对象，后续的对象属性会覆盖前面的对象属性
     *
     * @param {Object} objArr 要扩展的对象数组
     *
     * @returns {Object} 扩展好的第一个对象
     */
    extendChildren(objArr) {

      if (!Array.isArray(objArr)) {
        throw TypeError('please transfer a array, thanks!');
      }


      let argLen = objArr.length,
          originalObj = objArr[0],
          _extendInnerJson
      ;

      if (argLen < 2) {
        return originalObj;
      }

      // 继承内部json
      _extendInnerJson = (root, json) => {
        if (functionUtils.getDataType(json) !== "Object") {
          throw TypeError(json + "必须是对象");
        }

        // 迭代json
        Object.keys(json).forEach((key) => {

          let currRootVal = root[key],
              currJsonVal = json[key]
          ;

          // 如果root对象中有这个key并且值是一个对象
          if (root.hasOwnProperty(key) && functionUtils.getDataType(currRootVal) === "Object") {

            // 如果要继承的json中这个key的值不是一个对象，则抛出异常
            if (functionUtils.getDataType(currJsonVal) !== "Object") {
              throw TypeError(key + "必须是对象");
            }

            // 否则继续递归迭代该对象值
            return _extendInnerJson(currRootVal, currJsonVal);
          }

          // 否则直接把json中这个key的值赋给root中对应的key
          root[key] = currJsonVal;
        });
      };

      // 遍历参数列表，开始执行继承
      for (let i = 1; i < argLen; i++) {
        _extendInnerJson(originalObj, objArr[i]);
      }

      // 清楚无效数据
      argLen = null;
      _extendInnerJson = null;

      // 返回根对象，即第一个参数
      return originalObj;
    }
  },
  string: {
    /**
     * @desc 字符串倒叙排序
     *
     * @param {String} str 要倒叙排序的字符串
     *
     * @return {String} 经过倒叙排序后的字符串
     * */
    reverse(str) {

      if (typeof str !== 'string') {
        throw TypeError('please transfer a string, thanks!');
      }

      if (str.length < 2) {
        return this;
      }

      // method1 借助数组的reverse方法
      return Array.prototype.slice
        .call(str)
        .reverse()
        .join('')
      ;

      // method2 倒序遍历
      /* for (let i = this.length, newStr = ''; i > 0; newStr += this[--i]);
      return newStr; */
    },
    /**
     * @desc 将一段单词首字母转换为大写
     *
     * @param {String} str 要转换的一段单词
     *
     * @return {String} 转换好的一段单词
     */
    capitalUpperCase(str) {

      if (typeof str !== 'string') {
        throw TypeError('please transfer a string, thanks!');
      }

      return str.replace(/\b[a-z]/g, (s) => s[0].toUpperCase() + s.slice(1));
    },
    /**
     * @desc 将一段单词首字母转换为小写
     *
     * @param {String} str 要转换的一段单词
     *
     * @return {String} 转换好的一段单词
     */
    capitalLowerCase(str) {

      if (typeof str !== 'string') {
        throw TypeError('please transfer a string, thanks!');
      }

      return str.replace(/\b[A-Z]/g, (s) => s[0].toLowerCase() + s.slice(1));
    }
  },
  jsonWithFunction: {
    /**
     * @desc json中数值有function的序列化
     *
     * @param {JSONObject} json 要序列化的对象
     *
     * @return {String} 经过序列化的字符串
     * */
    stringify(json) {
      return JSON.stringify(json, (key, val) => typeof val === 'function' ? val + '' : val);
    },
    /**
     * @desc json中数值有function的反序列化
     *
     * @param {JSONString} json 要反序列化的JOSN字符串
     *
     * @return {JSONObject} 经过反序列化的JSON对象
     * */
    parse(json) {
      return JSON.parse(json, (key, val) => {

        if (/^function\s*\(.*\)/.test(val)) {
          return eval('(function(){return ' + val + ' })()');
        }

        return val;
      });
    }
  },
  closure: {
    /**
      * @desc 使用闭包实现对象属性的getter和setter
      * 给对象中的指定的属性实现存储器方法，
      * 	方法名称为get<Name>和set<Name>，例如 o.getName();
      * 如果提供了一个判断函数，setter方法就会用它来检测参数的合法性，
      *  如果验证返回值为false，setter方法抛出一个异常，否则存储它
      *
      * 这个函数有一个非同寻常之处，
      * 	就是getter和sertter方法所操作的属性值并没有存储在对象o中，
      * 	相反，这个值仅仅是保存在函数中的局部变量中
      * getter和setter方法同样是局部函数，因此可以访问这个局部变量，
      * 	也就是说，对于两个存储器方法来说这个变量是私有的，
      * 	没有办法绕过存储器方法来设置或修改这个值
      *
      * @param {Object} o 需要实现存储器方法的对象
      * @param {String} name 需要实现存储器方法的名字
      * @param {Function} predicate setter 方法的检查方法，
      *           return {Object} { result: {Boolean}, msg: {String} }
      *
      * @return void
    */
    addPrivateProperty(o, name, predicate) {

      // 参数验证操作
      if (functionUtils.getDataType(o) !== "Object") {
        throw TypeError(o + " must be a object");
      }
      if (typeof (name) !== "string") {
        throw TypeError(name + " must be a string");
      }
      if (predicate && typeof (predicate) !== "function") {
        throw TypeError(predicate + " must be a function");
      }

      // 对name首字母做大写操作
      if (name[0] !== name[0].toUpperCase()) {
        name = name[0].toUpperCase() + name.slice(1);
      }

      let value; // 这是一个私有值

      // getter 方法简单地将其返回
      o["get" + name] = () => { return value; };

      // setter 方法首先检测值是否合法，若不合法，抛出一个异常，否则存储它
      o["set" + name] = (val) => {

        if (predicate && !predicate(val).result) {
          throw new Error("set" + name + ": invaild, because " + name[0].toLowerCase() + name.slice(1) + " " + predicate(val).msg);
        }

        value = val;
      };
    },
    /**
     * @desc 使用闭包动态修改对象已有方法--“monkey-patching”
     *
      * @param o {Object} 需要实现存储器方法的对象
      * @param name {String} 需要实现存储器方法的名字
      *
      * @return void
    */
    trace(o, name) {

      // 参数验证操作
      if (functionUtils.getDataType(o) !== "Object") {
        throw TypeError(o + " must be a object");
      }
      if (typeof (name) !== "string") {
        throw TypeError(name + " must be a string");
      }
      if (typeof (o[name]) !== "function") {
        throw TypeError(o[name] + " must be a function");
      }


      o[name] = () => {

        functionUtils.log("Entering " + name);

        // 调用原方法

        functionUtils.log("Exiting " + name);

        return o[name].apply(this, arguments);
      }
    },
    /**
     * @desc 使用闭包来实现函数记忆
     *
     * @param {Function} fn
     *
     * @returns {Function} 返回 fn() 的带有记忆功能的版本，只有当 fn() 的实参的字符串表示都不相同时它才会工作
     */
    memorize(fn) {

      if (typeof fn !== 'function') {
        throw TypeError('please transfer a function, thanks!');
      }


      // 将值缓存在闭包内
      let cache = {};

      return () => {

        let key = arguments.length + Array.prototype.join.call(arguments, ",");

        if (key in cache) { return cache[key]; }

        return cache[key] = fn.apply(this, arguments);
      };
    }
  },
  random: {
    /**
     * @desc 生成一个范围区间内的数据
     *
     * @param {Number} min 最小值
     * @param {Number} max 最大值
     *
     * @returns {String}
     * */
    number(min, max) {

      if (typeof min !== 'number' || typeof max !== 'number') {
        throw TypeError('please transfer a number, thanks!');
      }

      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    /**
     * @desc 生成长度为11的随机字母数字字符串
     *
     * @returns {String}
     * */
    ID() {
      return Math.random().toString(36).substring(2);
    },
    /**
     * @desc 生成十六进制颜色
     *
     * @returns {String}
     * */
    hexColor() {
      return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0');
    }
  },
  format: {
    /**
     * @desc 格式化url参数为对象
     *
     * @param {String} urls
     *
     * @return {Object} ParamsObject
     * */
    urlParams(url) {

      if (typeof url !== 'string') {
        throw TypeError('please transfer a string, thanks!');
      }


      let obj = {};

      url.replace(/([^?&=]+)=([^&]+)/g, (_, key, value) => obj[key] = value);

      return obj;
    },
    /**
     * @desc 给后面携带s的单词加引号: Jeffs => Jeff's
     *
     * @param {String} word 单词
     * @param {String} text 文本
     *
     * @return {String} 替换好的文本
     * */
    wordSAddSingleQuotes(word, text) {

      if (typeof word !== 'string' || typeof text !== 'string') {
        throw TypeError('please transfer a string, thanks!');
      }

      return text.replace(new RegExp(`(?<=${word})(?=s)`, "ig"), "'");
    },
    /**
     * @desc 给长数字加逗号: 1000000 => 1,000,000
     *
     * @param {Number | String} num 单词
     *
     * @return {String} 替换好的数字
     * */
    numberAddComma(num) {

      if (!(typeof num !== 'number' || typeof num !== 'string')) {
        throw TypeError('please transfer a number or string, thanks!');
      }

      if (typeof num === 'number') {
        num = num.toString();
      }

      return num.replace(/([^.]\d{1,3})(?=(\d{3})+(?:\b))/g, "$1,");
    },
    /**
     * @desc 日期时间格式化方法
     *
     * @param oDate {Date} 日期对象
     * @param formatStr {String} 格式字符串
     *
     * @return {String} 经过格式化后的日期字符串
     * */
    date(oDate, formatStr) {

      if (!(oDate instanceof Date)) {
        throw TypeError('please transfer a Date, thanks!');
      }
      if (typeof formatStr !== 'string') {
        throw TypeError('please transfer a string, thanks!');
      }


      let week = ['日', '一', '二', '三', '四', '五', '六'],
          year = oDate.getYear(),
          month = oDate.getMonth() + 1,
          date = oDate.getDate(),
          hours = oDate.getHours(),
          minutes = oDate.getMinutes(),
          seconds = oDate.getSeconds()
      ;

      return formatStr.replace(/yyyy|YYYY/, oDate.getFullYear())
        .replace(/yy|YY/, (year % 100) > 9 ? (year % 100).toString() : '0' + (year % 100))
        .replace(/MM/, month > 9 ? month.toString() : '0' + month).replace(/M/g, month)
        .replace(/w|W/g, week[oDate.getDay()])
        .replace(/dd|DD/, date > 9 ? date.toString() : '0' + date).replace(/d|D/g, date)
        .replace(/hh|HH/, hours > 9 ? hours.toString() : '0' + hours).replace(/h|H/g, hours)
        .replace(/mm/, minutes > 9 ? minutes.toString() : '0' + minutes).replace(/m/g, minutes)
        .replace(/ss|SS/, seconds > 9 ? seconds.toString() : '0' + seconds).replace(/s|S/g, seconds)
        ;
    }
  },
  calendar: {
    /**
     * @desc 获取7天的日期，默认获取过去7天的日期
     *
     * @param {Boolean} isFuture 值为true，则获取未来7天的日期
     *
     * @return {Array} 日期数组
     * */
    getSevenDay(isFuture) {

      if (typeof isFuture !== 'boolean') {
        throw TypeError('please transfer a boolean, thanks!');
      }


      // -1 代表过去，1 代表将来
      let dir = -1;

      if (isFuture) { dir = 1; }

      return [...Array(7).keys()].map(days => new Date(Date.now() + dir * 86400000 * days));
    }
  },
  verify: {
    /**
     * @desc 是否正整数，可使用ES6的 Number.isInteger(data)
     *
     * @param {Any} data 要验证的数据
     *
     * @returns {Boolean} 是否正整数
     * */
    isInteger(data) {
      return typeof data === "number" && isFinite(data) && data > 0 && data === Math.abs(data) && data === Math.ceil(data);
    },
    /**
     * @desc 是否邮箱
     *
     * @param {Any} data 要验证的数据
     *
     * @returns {Boolean} 是否邮箱
     * */
    isEmail(data) {
      return typeof data === "string" && /^[\w-\.]+@([a-zA-Z\d-]+\.)+[a-zA-Z\d]{2,6}$/.test(data);
    },
    /**
     * @desc 是否固话
     *
     * @param {Any} data 要验证的数据
     *
     * @returns {Boolean} 是否固话
     * */
    isPhone(data) {
      return /^0\d{2,3}-\d{7,8}(-\d{3,4})?$/.test(data);
    },
    /**
     * @desc 是否手机
     *
     * @param {Any} data 要验证的数据
     *
     * @returns {Boolean} 是否手机
     * */
    isMobile(data) {
      return /^1(3|4|5|7|8)\d{9}$/.test(data);
    },
    /**
     * @desc 是否身份证 -> 2013.1.1 一代身份证禁用，只需验证二代
     *
     * @param {Any} data 要验证的数据
     *
     * @returns {Boolean} 是否身份证
     * */
    isIDCard(data) {

      // return /^\d{17}(\d|X)$/i.test(data);

      // 参数验证
      if (typeof data !== "string" || data.length !== 18) {
        return false;
      }

      //号码规则校验
      let IDCardReg = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|(7[1])|(8[1-2]))\d{4}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/;

      if (!IDCardReg.test(data)) {
        return false;
      }

      //区位码校验
      //出生年月日校验   前正则限制起始年份为1900;
      let year = data.substr(6, 4), //身份证年
          month = data.substr(10, 2), //身份证月
          date = data.substr(12, 2), //身份证日
          time = Date.parse(month + '-' + date + '-' + year), //身份证日期时间戳date
          now_time = Date.parse(new Date()),//当前时间戳
          dates = (new Date(year, month, 0)).getDate() //身份证当月天数
      ;

      if (time > now_time || date > dates) {
        return false;
      }

      //校验码判断
      let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], //系数
          parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'], //校验码对照表
          sum = 0
      ;

      for (let i = 0; i < 17; i++) {
        sum += data[i] * factor[i];
      }

      if (data[17].toUpperCase() !== parity[sum % 11]) {
        return false;
      }

      return true;
    },
    /**
     * @desc 是否身份证姓名
     *
     * @param {Any} data 要验证的数据
     *
     * @returns {Boolean} 是否身份证姓名
     * */
    isIDCardName(data) {
      return /^[\u4e00-\u9fa5]{2,4}$/.test(data);
    },

  },
  /**
   * @desc 加工版（时间和换行）日志
   *
   * @param {Any} msg 要打印的日志信息
   *
   * @return void
   * */
  log(msg) {
    console.log(new Date().toLocaleString() + '\n');
    console.log(msg);
  },
  /**
   * @desc 获取数据类型
   *
   * @param {Any} data 要获取数据类型的数据
   *
   * @return {String} 数据类型
   * */
  getDataType(data) {
    return Object.prototype.toString.call(data).slice(8, -1);
  },
  /**
   * @desc 判断用户的浏览器设备是 移动端 | pc端 | 微信
   *
   * @returns {String}
   * */
  getBrowserRedirect() {

    let sUserAgent = navigator.userAgent.toLowerCase(),
      bIsIpad = sUserAgent.match(/ipad/i) == 'ipad',
      bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os',
      bIsMidp = sUserAgent.match(/midp/i) == 'midp',
      bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4',
      bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb',
      bIsAndroid = sUserAgent.match(/android/i) == 'android',
      bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce',
      bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
    ;

    if (sUserAgent.search(/MicroMessenger/ig) !== -1) {
      return "weixin"
    }
    else if (
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
    }
    else {
      return 'pc';
    }
  },
  /**
   * @desc 按照原始宽高和指定容器宽高，得出两者之间的比率，
   *        根据比率来返回动态放大或缩小的原始宽高
   *
   * @param {Number} originalWidth 原始宽，大于0的正整数
   * @param {Number} originalHeight 原始高，大于0的正整数
   * @param {Number} containerWidth 指定容器宽，大于0的正整数
   * @param {Number} containerHeight 指定容器高，大于0的正整数
   *
   * @returns {Object} 原始宽高数据对象 { originalWidth: 原始宽, originalHeight: 原始高 }
   * */
  getRateBox(originalWidth, originalHeight, containerWidth, containerHeight) {

    if (typeof originalWidth !== 'number' ||
      typeof originalHeight !== 'number' ||
      typeof containerWidth !== 'number' ||
      typeof containerHeight !== 'number'
    ) {
      throw TypeError('please transfer a number, thanks!');
    }


    let argLen = arguments.length,
        rateWidth,
        rateHeight,
        rateWidthHeight
    ;

    // 参数验证
    for (let i = 0; i < argLen; i++) {

      if (Number.isInteger(arguments[i]) || arguments[i] <= 0 ) {
        throw new Error(`请输入正整数，错误数据位置为：${i} ，错误数据为：${arguments[i]}`);
      }

    }

    // 原始宽高 与 指定容器宽高 的比率：originalWidth/containerWidth - originalHeight/containerHeight;
    rateWidth = originalWidth / containerWidth;
    rateHeight = originalHeight / containerHeight;
    rateWidthHeight = rateWidth - rateHeight;

    // 比例相等，直接替换
    if (rateWidthHeight === 0) {
      originalWidth = containerWidth;
      originalHeight = containerHeight;
    }
    // 宽度比例大，以宽度变换为主；并且两者宽度不相等;
    //  如果两者宽度已相等，证明原始高度 <= 指定容器高度，则高度无需更改，因为已经做到等比例展示
    else if (rateWidthHeight > 0 && rateWidth !== 1) {
      // 原始高度跟着宽度比率一起变化(放大或缩小)
      originalHeight /= rateWidth;
      // 原始宽度为指定容器宽度
      originalWidth = containerWidth;
    }
    // 高度比例大，以高度变换为主；并且两者高度度不相等;
    //  如果两者高度已相等，证明原始宽度 <= 指定容器宽度，则宽度无需更改，因为已经做到等比例展示
    else if (rateWidthHeight < 0 && rateHeight !== 1) {
      // 原始宽度跟着高度比率一起变化(放大或缩小)
      originalWidth /= rateHeight;
      // 原始高度为指定容器高度
      originalHeight = containerHeight;
    }

    // 返回原始宽高结果对象
    return {
      originalWidth: Math.floor(originalWidth),
      originalHeight: Math.floor(originalHeight)
    }
  },
  /**
   * @desc 获取两个正整数的中间值
   *
   * @param {Number} min 最小值
   * @param {Number} max 最大值
   *
   * @returns {Number} 两个正整数的中间值
   * */
  getIntegerMedian(min, max) {

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw TypeError('please transfer a number, thanks!');
    }

    return Math.floor((min + max) / 2 / 10) * 10;
  },
  /**
   * @desc 获取函数名
   *
   * @returns {String} 函数名
   * */
  getFunctionName(fn) {

    if (typeof fn !== 'function') {
      throw TypeError('please transfer a function, thanks!');
    }

    return fn.name || fn.toString().match(/function\s*([^(]*)\(/)[1] || "anonymous";
  }
};

// 测试代码
// functionUtils.log(functionUtils.array.math.stddev([1,2,3,4,5]));

// functionUtils.log(functionUtils.array.math.commonDivisor.maxForArrayNumber([200, 300, 400, 60, 50, 100]));

// functionUtils.log(functionUtils.array.math.commonDivisor.allForArrayNumber([300, 150, 600, 400]));

// functionUtils.log(functionUtils.getRateBox(300, 150, 600, 400));

// functionUtils.object.extend([{ a: 1, b: 2 }, { c: 3, d: 4 }, { a: 123, e: 43 }, { b: 43534, h: 2435 }]);

// functionUtils.log(functionUtils.format.wordSAddSingleQuotes("Jeff", "我的Jeffs你的Jeffs他的"));

// functionUtils.log(functionUtils.format.numberAddComma(`
//   afsd1000000000000asf 1000000 asd 10000.00 ghfj3542345
//   jkl;a10000000000asf 1000000000 asd 10000000.0000 ghfj3542345
// `));

// functionUtils.log(functionUtils.getFunctionName(function(){}));














// export default functionUtils;