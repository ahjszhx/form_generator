/*
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-06-08 14:11:30
 * @LastEditTime: 2021-06-08 15:04:52
 * @Email: ahjszhx@126.com
 * @FilePath: /formGenerator/src/components/formFill/util/util.js
 * @Environment: Win 10
 * @Description: 
 */
export function isArray (arr) {
  return Object.prototype.toString.call(arr) === "[object Array]";
}

export function isObject (obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
