import axios from 'axios'
import { Notify, Loading } from 'quasar'
var errorCount = 0
import { url_prefix, goto_login_url, url_prefix_ws } from '../utils/co_util.js'


axios.defaults.withCredentials = true
axios.interceptors.request.use(config => {
  // Loading.show({})
  return config
}, err => {
  Notify.create({ 'message': 'request timeout!', 'position': 'top', 'color': 'negative' })
  return Promise.reject(err)
})
axios.interceptors.response.use(data => {
  // Loading.hide()
  if (data.status && data.status === 200 && data.data.status === 'error') {
    Notify.create({ 'message': data.data.msg, 'position': 'top', 'color': 'negative' })
    return
  }
  if (data.data.code === 606) {
    errorCount = errorCount + 1
    window.setTimeout(function () {
      if (errorCount !== 0) {
        Notify.create({ 'message': '权限不足，请联系管理员', 'position': 'top', 'color': 'red', icon: 'warning' })
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
    Notify.create({ 'message': 'User not logged in or expired', 'position': 'top', 'color': 'red', icon: 'warning' })

    return
  }
  if (data.data.code === 909) {
    errorCount = errorCount + 1
    window.setTimeout(function () {
      if (errorCount !== 0) {
        Notify.create({ 'message': '填写的数据过长', 'position': 'top', 'color': 'red', icon: 'warning' })
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
    Notify.create({ 'message': 'Link not found', 'position': 'top', 'color': 'negative' })
  } else if (err.response.status === 403) {
    Notify.create({ 'message': '权限不足!', 'position': 'top', 'color': 'negative' })
  } else {
    Notify.create({ 'message': 'Undefined error!', 'position': 'top', 'color': 'negative' })
  }
  return Promise.reject(err)
})

export const baseUrl = () => {
  return url_prefix(process.env.DEV)
}
export const baseWXUrl = () => {
  return url_prefix_ws(process.env.DEV)
}
//获取发送的消息列表(管理)
export const MesInfoPage = (page, size, filter) => {
  const param = new URLSearchParams()
  param.append('page', page)
  param.append('size', size)
  param.append('title', filter.title)
  param.append('dt', filter.dt)
  return axios.post(baseUrl() + '/mes/mes_manage_info', param)
}
//获取发送的消息列表(个人)
export const MesPersonalInfoPage = (page, size, filter) => {
  const param = new URLSearchParams()
  param.append('page', page)
  param.append('size', size)
  param.append('title', filter.title)
  param.append('dt', filter.dt)
  return axios.post(baseUrl() + '/mes/mes_personal_info', param)
}
//消息标志已读
export const MesYue = (id) => {
  const param = new URLSearchParams()
  param.append('id', id)
  return axios.post(baseUrl() + '/mes/mes_yue', param)
}
//获取发送的消息列表(个人)(未读)
export const WeiMesPersonalInfoPage = () => {
  const param = new URLSearchParams()
  param.append('page', 1)
  param.append('size', 3)
  param.append('yue', false)
  return axios.post(baseUrl() + '/mes/mes_personal_info', param)
}
//发布消息
export const pushMes = (form, data) => {
  const param = new URLSearchParams()
  param.append('title', form.title)
  param.append('content', form.content)
  param.append('sysname', form.sysname)
  param.append('auto', form.auto)
  param.append('data', data)
  return axios.post(baseUrl() + '/mes/push', param)
}

//获取接口信息
export const InterfaceInfoPage = (page, size, filter) => {
  const param = new URLSearchParams()
  param.append('page', page)
  param.append('size', size)
  param.append('title', filter.title)
  return axios.post(baseUrl() + '/mes/interface_info', param)
}

//编辑接口信息
export const editInterfaceInfo = (form) => {
  const param = new URLSearchParams()
  param.append('id', form.id)
  param.append('name', form.name)
  param.append('ipaddress', form.ipaddress)
  param.append('objectname', form.objectname)
  param.append('interfacekey', form.interfacekey)
  return axios.post(baseUrl() + '/mes/interface_edit', param)
}

//删除接口信息
export const delInterfaceInfo = (id) => {
  const param = new URLSearchParams()
  param.append('id', id)
  return axios.post(baseUrl() + '/mes/interface_del', param)
}

//获取接口规则信息
export const rulePage = (id) => {
  const param = new URLSearchParams()
  param.append('id', id)
  return axios.post(baseUrl() + '/mes/interface_rule', param)
}

//保存接口规则
export const saveInterfaceRule = (id, data) => {
  const param = new URLSearchParams()
  param.append('id', id)
  param.append('data', data)
  return axios.post(baseUrl() + '/mes/interface_rule_save', param)
}

