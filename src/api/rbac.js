import axios from 'axios'
import { Notify } from 'quasar'
import 'url-search-params-polyfill'
import { url_prefix, goto_login_url, url_prefix_ws } from '../utils/co_util.js'
var errorCount = 0

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
        Notify.create({ message: '权限不足，请联系管理员', position: 'top', color: 'red', icon: 'warning' })
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
        Notify.create({ message: '填写的数据过长', position: 'top', color: 'red', icon: 'warning' })
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
    Notify.create({ message: 'Link not found', position: 'top', color: 'negative' })
  } else if (err.response.status === 403) {
    Notify.create({ message: '权限不足!', position: 'top', color: 'negative' })
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

export const getMenuList = (oid) => {
  // console.log(index)
  const param = new URLSearchParams()
  param.append('oid', oid)
  return axios.post(baseUrl() + '/common/getMenu', param)
}

export const adminLogout = () => {
  const param = new URLSearchParams()
  return axios.post(baseUrl() + '/logout', param)
}

export const getUserName = () => {
  return axios.get(baseUrl() + '/common/login')
}

export const getStuffByName = (name) => {
  return axios.get(baseUrl() + '/common/stuffs/name?name=' + name)
}

export const getRolePage = (page, size, val) => {
  const param = new URLSearchParams()
  param.append('page', page)
  param.append('size', size)
  param.append('name', val)
  return axios.post(baseUrl() + '/rbac/role/page', param)
}

export const addRole = (info) => {
  const param = new URLSearchParams()
  // param.append('id', info.id)
  param.append('name', info.name)
  return axios.post(baseUrl() + '/rbac/role/create', param)
}

export const deleteRole = (id) => {
  const param = new URLSearchParams()
  // param.append('id', info.id)
  param.append('id', id)
  return axios.post(baseUrl() + '/rbac/role/del', param)
}

export const getGroups = () => {
  return axios.get(baseUrl() + '/rbac/groups')
}

export const getControllers = () => {
  return axios.get(baseUrl() + '/rbac/controllers')
}

export const getActions = (isMenu) => {
  return axios.get(baseUrl() + '/rbac/actions?isMenu=' + isMenu)
}

export const addAction = (group, name, method, url, isMenu) => {
  const param = new URLSearchParams()
  param.append('groupId', group)
  param.append('name', name)
  param.append('action', method)
  param.append('url', url)
  param.append('isMenu', isMenu)
  return axios.post(baseUrl() + '/rbac/action/save', param)
}

export const getMethods = (controller) => {
  return axios.get(baseUrl() + '/rbac/mapping?controller=' + controller)
}

export const getActionsByGid = (pagination, filter) => {
  return axios.get(baseUrl() + '/rbac/actions/gid?page=' +
    pagination.page + '&size=' + pagination.rowsPerPage +
    '&gid=' + filter.gid + '&name=' + filter.name)
}

export const getMenusByRoleId = (val, isMenu) => {
  const param = new URLSearchParams()
  param.append('id', val)
  param.append('isMenu', isMenu)
  return axios.post(baseUrl() + '/rbac/menus/role', param)
}

export const roleUpdate = (roleId, ids, isMenu) => {
  const param = new URLSearchParams()
  param.append('roleId', roleId)
  param.append('ids', ids)
  param.append('isMenu', isMenu)
  return axios.post(baseUrl() + '/rbac/action/roleUpdate', param)
}

export const getRbacRoles = () => {
  return axios.post(baseUrl() + '/rbac/roles')
}

export const getProTree = () => {
  return axios.get(baseUrl() + '/project/tree')
}

export const getUserPageByRoleId = (pagination, filter) => {
  // console.log(filter)
  const param = new URLSearchParams()
  param.append('page', pagination.page)
  param.append('size', pagination.rowsPerPage)
  param.append('oid', filter.oid)
  param.append('name', filter.name)
  return axios.post(baseUrl() + '/project/userInfo/oid', param)
}

export const removeUserRoleByOid = (filter, uid) => {
  // console.log(filter)
  return axios.get(baseUrl() +
    '/project/userRole/oid?oid=' + filter.oid + '&uid=' + uid)
}

export const addDptManager = (node, stuff, org, campus) => {
  const param = new URLSearchParams()
  param.append('oid', node.id)
  param.append('userId', stuff.value)
  param.append('username', stuff.username)
  param.append('roleId', node.nodeCode)
  param.append('orgId', org.id)
  if (node.nodeName == '校区管理员') {
    param.append('campusId', campus.id)
  }
  return axios.post(baseUrl() + '/project/dptUser', param)
}

export const addProjectRole = (org, role) => {
  const param = new URLSearchParams()
  param.append('pid', org.pid)
  param.append('nodeCode', role.value)
  param.append('nodeName', role.label)
  return axios.post(baseUrl() + '/project/projectRole', param)
}

export const addUser = (oid, userId, roleId, pid, username, type) => {
  const param = new URLSearchParams()
  param.append('oid', oid)
  param.append('userId', userId)
  param.append('roleId', roleId)
  param.append('projectId', pid)
  param.append('username', username)
  param.append('userType', type)
  return axios.post(baseUrl() + '/project/user', param)
}

export const getOrgs = (val) => {
  return axios.get(baseUrl() + '/common/orgs?name=' + val)
}

export const getStudentByName = (name) => {
  return axios.get(baseUrl() + '/common/student/name?name=' + name)
}

// 退出账号
export const logout = () => {
  const param = new URLSearchParams()
  // param.append('bedId', bed.id)
  return axios.get(baseUrl() + '/sso/user-logout', param)
}
