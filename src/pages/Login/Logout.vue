<template>
  <div class="fixed-center text-center">
    <p class="text-faded" style="margin-top:50px;" v-if='error == 0'>登出中...</p>
    <p class="text-faded" style="margin-top:50px;" v-if='error == 1'>登出失败<strong>(560){{emsg}}</strong></p>
    <p class="text-faded" style="margin-top:50px;" v-if='error == 2'>登出成功</p>
    <q-btn v-if='error == 1' color="secondary" style="width:200px;" @click="toLogin">Go back</q-btn>
  </div>
</template>
<script>
import { logout } from '../../api/rbac'
import { goto_login_url } from '../../utils/co_util'
export default {
  name: 'PcLogin',
  data() {
    return {
      error: 0,
      emsg: '',
    }
  },
  methods: {
    logout(){
      logout().then(res=>{
        if(res.data.suc){
          this.error = 2
          localStorage.removeItem('roleInfo')
          localStorage.removeItem('userRole')
          localStorage.removeItem('menu')
          this.toLogin()
        }
        else {
          this.error = 1
          this.emsg = res.data.emsg
        }
      })
    },
    toLogin() {
      window.location.href = goto_login_url(process.env.DEV)
    }
  },
  mounted () {
    this.logout()
  }
}
</script>
