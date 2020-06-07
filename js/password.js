/*
 * @Author: Bamboo
 * @AuthorEmail: bamboo8493@126.com
 * @Date: 2019-08-15 17:49:58
 * @Description:
 * @LastEditors:
 * @LastEditorsEmail:
 * @LastEditTime: 2019-08-15 17:58:22
 * @LastEditorsDescription:
 */
const crypto = require('crypto')

const md5 = str => crypto.createHash('md5').update(str).digest('hex')

// 前后端要一致，可存放在一个共享文件中
const SUGAR = '!#@$&^*())@#%gdfsgsdsGD#@$%2345324@#$';

module.exports = {
  encrypt(salt, password) {
    return md5(salt + '!@#$AeaR@^124356~!@$asdF' + password)
  },
  getSalt() {
    return md5(Math.random() * 1251894 + '' + new Date().getTime())
  },
  getFromText(username, password) {
    return md5(username + SUGAR + password);
  }
}