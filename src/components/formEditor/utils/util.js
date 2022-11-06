/*
 * @Author: ZhangHx
 * @LastEditors: ZhangHx
 * @Date: 2021-03-17 15:22:53
 * @LastEditTime: 2021-05-26 14:44:11
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/components/formEditor/utils/util.js
 * @Environment: Win 10
 * @Description: 
 */

/** 校验为空 */
export function isEmpty (obj) {
  if (typeof obj == "undefined" || obj == null || obj == "" || obj.length == 0) {
    return true;
  } else {
    return false;
  }
}

export function IsExists (obj) {
  console.log("IsExists", obj)
  return false
}
