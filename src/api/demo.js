import axios from 'axios'
import { Notify } from 'quasar'
import 'url-search-params-polyfill'
var errorCount = 0
import { url_prefix, goto_login_url, url_prefix_ws } from '../utils/co_util.js'

axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
  // Loading.show({})
  return config
}, err => {
  Notify.create({ message: 'request timeout!', position: 'top', color: 'negative' })
  return Promise.reject(err)
})
axios.interceptors.response.use(data => {
  // Loading.hide()
  if (data.status && data.status === 200 && data.data.status === 'error') {
    Notify.create({ message: data.data.msg, position: 'top', color: 'negative' })
    return
  }
  if (data.data.code === 606) {
    errorCount = errorCount + 1
    window.setTimeout(function () {
      if (errorCount !== 0) {
        Notify.create({ message: 'Insufficient permission, please contact the administrator', position: 'top', color: 'red', icon: 'warning' })
        errorCount = 0
      }
    }, 2000)
    return
  }
  if (data.data.code === 2000) {
    errorCount = errorCount + 1
    window.setTimeout(function () {
      window.location.href = goto_login_url(process.env.DEV)
    }, 2000)
    Notify.create({ message: 'User not logged in or expired', position: 'top', color: 'red', icon: 'warning' })
    return
  }
  if (data.data.code === 909) {
    errorCount = errorCount + 1
    window.setTimeout(function () {
      if (errorCount !== 0) {
        Notify.create({ message: 'The data filled in is too long', position: 'top', color: 'red', icon: 'warning' })
        errorCount = 0
      }
    }, 2000)
    return
  }
  return data
}, err => {
  // Loading.hide()
  if (err.toString() === 'Error: Network Error') {
    errorCount = errorCount + 1
    window.setTimeout(function () {
      if (errorCount !== 0) {
        Notify.create({ message: '网络错误....', position: 'top', color: 'orange', icon: 'warning' })
        errorCount = 0
      }
    }, 1000)
    return Promise.reject(err)
  }
  if (err.response.status === 504 || err.response.status === 404) {
    Notify.create({ message: 'Link not found!', position: 'top', color: 'negative' })
  } else if (err.response.status === 403) {
    Notify.create({ message: 'Insufficient permissions!', position: 'top', color: 'negative' })
  } else {
    Notify.create({ message: 'Undefined error!', position: 'top', color: 'negative' })
  }
  return Promise.reject(err)
})

export const baseUrl = () => {
  return url_prefix(process.env.DEV)
}
export const baseWXUrl = () => {
  return url_prefix_ws(process.env.DEV)
}

export const saveForm = (data, title) => {
  const param = new URLSearchParams()
  param.append('data', data)
  param.append('domainId', title.domainId)
  param.append('domainTitle', title.domainTitle)
  return axios.post(baseUrl() + '/score/subject/new', param)
}

export const getSubjects = (domainId) => {
  console.log(domainId)
  const param = new URLSearchParams()
  param.append('domainId', domainId)
  return axios.get(baseUrl() + '/score/templates/test?domainId=' + domainId)
}

export const getCategorySubjects = (domainId) => {
  console.log(domainId)
  const param = new URLSearchParams()
  param.append('domainId', domainId)
  return axios.get(baseUrl() + '/score/subjects?domainId=' + domainId)
}

export const saveAnswer = (data) => {
  const param = new URLSearchParams()
  param.append('data', data)
  return axios.post(baseUrl() + '/make/test/create', param)
}

export const saveCanteenAnswer = (data, middle) => {
  const param = new URLSearchParams()
  param.append('data', data)
  for (var key in middle) {
    //console.log(middle[key],middle[key]!=='makeDate')
    if (middle[key] != null && key !== 'makeDate') {
      param.append(key, middle[key])
    }
  }
  return axios.post(baseUrl() + '/make/canteen/save', param)
}

export const getFileUrl = () => {
  return baseUrl() + '/make/test/create'
}

export const getMake = () => {
  return axios.get(baseUrl() + '/make/test/read')
}


export const getMakeAnwser = () => {
  return axios.get(baseUrl() + '/make/test/read/answer')
}



