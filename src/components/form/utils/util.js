/*
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-05-21 09:28:34
 * @LastEditTime: 2021-05-31 13:58:46
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/components/form/utils/util.js
 * @Environment: Win 10
 * @Description: 
 */
/** 校验手机号 */
export function checkPhone (phone) {
  if (phone.length == 0 || phone == '') {
    return false;
  } else if (!/^1[3456789]\d{9}$/.test(phone)) {
    return false;
  } else {
    return true;
  }
}

/** 校验身份证号 */
export function checkIdCard (idCard) {
  let idCardReg =
    /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
  if (!idCardReg.test(idCard)) {
    return false
  } else {
    return true
  }
}

/** 校验邮箱 */
export function checkEmail (emailInput) {
  var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if (!myreg.test(emailInput)) {
    return false;
  } else {
    return true;
  }
}

/** 校验为空 */
export function isEmpty (obj) {
  if (typeof obj == "undefined" || obj == null || obj == "" || obj.length == 0) {
    return true;
  } else {
    return false;
  }
}


export function getOptResult (res) {
  if (res.data.suc === true) {
    this.$q.notify({
      position: "top",
      icon: "mood",
      color: "green-4",
      textColor: "white",
      message: res.data.msg,
    });
  } else {
    this.$q.notify({
      position: "top",
      color: "red-5",
      textColor: "white",
      icon: "mood_bad",
      message: res.data.emsg,
    });
  }
}
/**
 * 内容是否填写
 * @return {Boolean} true:已填写;false:未填写
 */
export function isFill (value) {
  // 是否填写
  if (value === null || value === "" || value === undefined) {
    return false;
  } else if (
    typeof value == "object" &&
    value instanceof Array &&
    value.length == 0
  ) {
    // 数组
    return false;
  } else if (
    typeof value == "object" &&
    JSON.stringify(value) === "{}"
  ) {
    // 对象
    return false;
  } else {
    return true;
  }
}
