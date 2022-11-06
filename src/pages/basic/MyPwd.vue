<template>
  <div class="q-pa-md q-gutter-y-md page-box row justify-center">
    <q-card class="q-gutter-y-md items-center">
      <div class="q-pa-md q-gutter-y-md ">
        <q-input
          style="width: 300px"
          filled
          v-model="info.rePassword"
          label="Original Password"
          lazy-rules
          @blur="validOldPasswd()"
          :rules="[ val => val && val.length > 0 || 'Please enter the original password']"
        />

        <q-input
          style="width: 300px"
          filled
          v-model="info.newPassword"
          :type="isPwd ? 'password' : 'text'"
          label="New Password"
          lazy-rules
          :rules="[val => val !== null && val !== '' || 'Please enter a new password']">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <span>Password needs to contain numbers, upper and lower case letters</span>

        <q-input
          style="width: 300px"
          filled
          v-model="info.confirmPassword"
          :type="isPwd ? 'password' : 'text'"
          label="Confirm new password"
          lazy-rules
          :rules="[val => val !== null && val !== '' || 'Please confirm the new password']">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-btn style="width: 300px" label="Submit" type="submit" color="primary" :disabled ="canSubmit" @click="changePassword"/>
      </div>
    </q-card>
  </div>
</template>
<script>
    import {
        changePasswordInitial,validOldPasswd
    } from '../../api/data'
    import { logout } from '../../api/rbac'
    import { goto_login_url } from '../../utils/co_util'
    const rule = /(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
  export default {
    data() {
      return {
          isPwd: true,
          canSubmit: false,
          ifShow: false,
          info: {
              id: '',
              rePassword: '',
              newPassword: '',
              confirmPassword: '',
          }
      }
    },
    methods: {
        changePassword() {
            if(this.info.newPassword!= this.info.confirmPassword){
                this.$q.notify({position: 'top', color: 'red-5', textColor: 'white', icon: 'error', message: '两次输入密码不一致'})
                // this.canSubmit = true
                return false
            }
            if (this.info.newPassword.length<6) {
                this.$q.notify({position: 'top', color: 'red-5', textColor: 'white', icon: 'error', message: '密码长度不能低于6位'})
                // this.canSubmit = true
                return false
            }
            if (!this.info.newPassword.match(rule)) {
                this.$q.notify({position: 'top', color: 'red-5', textColor: 'white', icon: 'error', message: '密码至少包含 数字和大小写英文，长度6-18'})
                // this.canSubmit = true
                return false
            }


            changePasswordInitial(this.info).then(res => {
                this.getOptResult(res)
                console.log('res.data:' + res.data)
                res.data.suc === true ?
                    (this.ifShow = false,
                            logout().then(res => {
                                if (res.data.suc) {
                                    localStorage.removeItem('roleInfo')
                                    console.log(111)
                                    localStorage.removeItem('userInfo')
                                    console.log(222)
                                    localStorage.removeItem('menu')
                                    console.log(333)
                                    window.location.href = goto_login_url(process.env.DEV)
                                }
                            })
                    ) :
                    (this.ifShow = true);
                setTimeout(() => {
                    // this.info = {}
                    // this.$emit('refresh')
                }, 500);
            })
        },
        getOptResult(res) {
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
        },
        validOldPasswd () {
            let pswd = this.info.rePassword;
            console.log(pswd)
            validOldPasswd(pswd).then(res => {
                if(res.data.suc == false){
                    this.$q.notify({position: 'top', color: 'red-5', textColor: 'white', icon: 'error', message: '原密码错误'})
                    this.canSubmit = true
                }
                else {
                    this.canSubmit = false
                }
            })
        }
    },
    created() {

    }
  }

</script>
<style scoped>

</style>
