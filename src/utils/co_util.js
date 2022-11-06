const JW_URL_DEV = 'xxx.hq.gench.edu.cn:9801'
const JW_URL_DEV_WS = 'xxx.hq.gench.edu.cn:9807'
const JW_SITE_URL_DEV = 'xxx.hq.gench.edu.cn:8080'
const JW_XXX_URL_DEV = 'xxx.hq.gench.edu.cn:8081'
const JW_URL_PROD = 'hxzhang.gench.top'
const JW_URL_PROD_SECURITY = 'http://hxzhang.gench.top'



export function judgeUrl (dev) {
  //console.log('location:', location.origin)
  //console.log('https:', location.origin.indexOf('https'))
  if (dev) {
    return 'http://' + JW_URL_DEV
  }
  else {
    if (location.origin.indexOf('https') != -1) {
      return 'https://' + JW_URL_PROD_SECURITY
    }
    else {
      return 'http://' + JW_URL_PROD
    }
  }
}

export function url_prefix (dev) {
  return judgeUrl(dev) + "/api/pc"
}

export function goto_login_url (dev) {
  if (dev) {
    return 'http://xxx.hq.gench.edu.cn:8080/login'
  }
  else {
    return 'http://hxzhang.gench.top/login'
  }
}


export const url_prefix_ws = (dev) => {
  if (dev) {
    return 'ws://' + JW_URL_DEV_WS + '/apiwebsocket/'
  }
  else {
    if (location.origin.indexOf('https') != -1) {
      return 'ws://' + JW_URL_PROD_SECURITY + '/apiwebsocket/'
    }
    else {
      return 'ws://' + JW_URL_PROD + '/apiwebsocket/'
    }
  }
}

export const url_prefix_upload = (dev) => {
  return judgeUrl(dev) + '/api/pc/img/upload'
}

export const url_prefix_download = (dev) => {
  return judgeUrl(dev) + '/api/pc/img/download'
  // if(dev){
  //   return 'http://' + JW_URL_DEV + "/api/pc/img/download"
  // }
  // return 'http://' + JW_URL_PROD + "/api/pc/img/download"
}

export const url_prefix_qztr = (dev) => {
  return judgeUrl(dev) + '/apiqrtz/pc/qrtz'
  // if(dev){
  //   return 'http://' + JW_URL_QZTR + "/apiqrtz/pc/qrtz"
  // }
  // return 'http://' + JW_URL_QZTR_PROD + "/apiqrtz/pc/qrtz"
}

export const url_prefix_download_new = (dev) => {
  return judgeUrl(dev) + '/api/pc/img/get_report_file'
  // if(dev){
  //   return 'http://' + JW_URL_DEV + "/api/pc/img/get_report_file"
  // }
  // return 'http://' + JW_URL_PROD + "/api/pc/img/get_report_file"
}

export const url_jump = (dev, appcode) => {
  if (dev) {
    return 'http://' + JW_SITE_URL_DEV + "/home/index"
  } else {
    return 'http://' + JW_URL_PROD + "/home/index"
  }

}

