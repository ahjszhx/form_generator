<template>
  <q-dialog v-model="ifShow">
    <q-card>
      <q-card-section>
        <div class="text-h6">修改初始密码</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="content">
        <q-input
          style="width: 300px"
          filled
          v-model="info.rePassword"
          label="原密码"
          lazy-rules
          @blur="validOldPasswd()"
          :rules="[ val => val && val.length > 0 || '请输入原密码']"
        />

        <q-input
          style="width: 300px"
          filled
          v-model="info.newPassword"
          :type="isPwd ? 'password' : 'text'"
          label="新密码"
          lazy-rules
          :rules="[val => val !== null && val !== '' || '请输入新密码']">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <span>密码需要包含数字、大小写字母</span>

        <q-input
          style="width: 300px"
          filled
          v-model="info.confirmPassword"
          :type="isPwd ? 'password' : 'text'"
          label="确认新密码"
          lazy-rules
          :rules="[val => val !== null && val !== '' || '请确认新密码']">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
<!--        <div>-->
<!--          <q-input outlined v-model="info.rePassword" type="password" label="原密码"></q-input>-->
<!--        </div>-->
<!--        <div>-->
<!--          <q-input outlined v-model="info.newPassword" type="password" label="新密码"></q-input>-->
<!--        </div>-->
<!--        <div>-->
<!--          <q-input outlined v-model="info.confirmPassword" type="password" label="确认新密码"></q-input>-->
<!--        </div>-->

      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
<!--        <q-btn flat label="确认" color="primary" @click="changePassword()" />-->
        <q-btn style="width: 300px" label="提交" type="submit" color="primary" :disabled ="canSubmit" @click="changePassword"/>
        <q-btn flat label="关闭" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
  import {
      changePasswordInitial,validOldPasswd
  } from '../../../api/data'
  import { logout } from '../../../api/rbac'
  import { goto_login_url } from '../../../utils/co_util'
  const rule = /(?![0-9A-Z]+$)(?![0-9a-z]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
  export default {
    name: 'ChangePassword',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      id: {
        type: Number,
        default: 0
      }
    },
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
      closeDiglog() {
        this.$emit('close')
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
        },
    },
    watch: {
      show: {
        handler(newVal, oldVal) {
          console.log('show newVal', newVal)
          console.log('show oldVal', oldVal)
          this.ifShow = this.show
        },
        immediate: true
      },
      ifShow: {
        handler(newVal, oldVal) {
          if (!newVal) {
            this.closeDiglog()
          }
        }
      },
      id: {
        handler(newVal, oldVal) {
          console.log('id new', newVal)
          console.log('id old', oldVal)
          this.info.id = newVal
        },
        immediate: true
      }
    }
  }

</script>
<style scoped>
  .content {
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    /* height: 500px; */
  }

  .content>div {
    width: 80%;
    margin-top: 20px;
  }

</style>
