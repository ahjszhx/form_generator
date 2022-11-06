/*
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-05-13 18:06:40
 * @LastEditTime: 2021-05-28 13:12:14
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/router/index.js
 * @Environment: Win 10
 * @Description:
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  getLocalUserInfo
} from '../utils/util'
import routes from './routes'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function ( /* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({
      x: 0,
      y: 0
    }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  Router.beforeEach((to, from, next) => {
    console.log('path', to, from)
    let userInfo = localStorage.getItem('userInfo')
    window.document.title = to.meta.title
    //if (to.path == '/' || to.path == '/login' || to.path == '/ssologin' || to.path == '/*' || to.path == '/report/basicform') {
    if (to.meta != null && to.meta.pass == true) {
      next()
    } else if (!userInfo || userInfo == null) {
      next({
        path: '/login'
      })
    } else {
      let menus = JSON.parse(localStorage.getItem('menu'))
      let childs = []
      childs.push('/home/index')
      childs.push('/logout')
      //测试
      if (menus) {
        console.log("menus", menus)
        menus.forEach(item => {
          if (item.avos.length > 0) {
            item.avos.forEach(a => {
              childs.push(a.url)
            })
          }
        })
      }
      let valid = false
      childs.forEach(a => {
        if (a == to.path) {
          valid = true
        }
      })
      if (valid == true) {
        next()
      }
      else {
        // alert('您无权限')
        next({ path: '/home/index' })
      }
    }
  })
  return Router
}
