/** 校验手机号 */
export function checkPhone(phone) {
  if (phone.length == 0 || phone == '') {
    return false;
  } else if (!/^1[3456789]\d{9}$/.test(phone)) {
    return false;
  } else {
    return true;
  }
}

/** 校验身份证号 */
export function checkIdCard(idCard) {
  let idCardReg =
    /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
  if (!idCardReg.test(idCard)) {
    return false
  } else {
    return true
  }
}

/** 校验邮箱 */
export function checkEmail(emailInput) {
  var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if (!myreg.test(emailInput)) {
    return false;
  } else {
    return true;
  }
}

/** 校验为空 */
export function isEmpty(obj) {
  if (typeof obj == "undefined" || obj == null || obj == "" || obj.length == 0) {
    return true;
  } else {
    return false;
  }
}


//查询sessionStorage的值
export const getLocalUserInfo = () => {
  if (!window.sessionStorage) {
      // alert("浏览器支持sessionStorage");
      return false;
  } else {
      var storage = window.sessionStorage;
      return storage.getItem("userInfo")
  }
}