<template>
  <div class="login-wrap">
    <div class="login-wrap-title">A Form Generator Demo</div>

    <div class="login-window">
      <div class="img">
        <q-img src="../../statics/login/login_img1.png" />
      </div>
      <div class="login-box">
        <div class="box-title">
          <q-icon name="cdesktop_mac" />&nbsp;&nbsp; Welcome
        </div>
        <div class="box-input">
          <form-input
            :config="{ placerHolder: 'userId' }"
            :model.sync="username"
          />
          <form-input
            :config="{ placerHolder: 'password', format: 'PASSWORD' }"
            :model.sync="password"
          />

          <form-input
            :config="{ placerHolder: 'veriCode' }"
            :model.sync="veriCode"
          />
          <a href="javascript:;"  @click="getVeriCode()" title="Click to change the verification code">
            <q-img :src="codeUrl"  alt="Failed to load the verification code"  @click="getVeriCode()"  style="width: 100px; height:30px"/>
          </a>
        </div>
        <div class="box-tools" style="display:none;">
          <div class="forget">Forgot your password?</div>
        </div>
        <q-btn
          class="full-width q-mt-md"
          color="secondary"
          @click="toLogin"
          @keyup.enter="toLogin"
          label="Login"
        />
      </div>
    </div>
    <change-password
      :show="changePasswordShow"
      @close="closeChangePasswordShow"
    ></change-password>
  </div>
</template>
<script>
import { adminLogin, getMenuList, ssoCheck,baseUrl } from "../../api/data";
import { url_jump } from "../../utils/co_util";
import { encrypt } from "../../api/aes";
import ChangePassword from "../basic/components/ChangeInitialPassword.vue";
export default {
  components: {
    ChangePassword
  },
  data() {
    return {
      username: null,
      password: null,
      appcode: "",
      veriCode:"",
      codeUrl:baseUrl()+"/sso/getCode",
      changePasswordShow: false
    };
  },
  methods: {
    getVeriCode() {
        this.codeUrl = baseUrl()+"/sso/getCode?ran=" + new Date();
    },
    toLogin() {
      console.log(this.$store.getters.getUserInfo);
      let username = encrypt(this.username);
      let password = encrypt(this.password);
      adminLogin(username, password, this.veriCode).then(res => {
        if (res.data.suc === true) {
          if (res.data.data.pwd === true) {
            let url = "";
            console.log(this.appcode);
            url = url_jump(process.env.DEV, this.appcode);
            this.$store.commit("setUserInfo", res.data.data);
            if (res.data.data.currentRole != null) {
              getMenuList(res.data.data.currentRole.oid).then(resk => {
                this.$store.commit("setMenu", resk.data);
                console.log(this.$store.getters.getMenu);
                console.log(this.$store.getters.getUserInfo);
              });
            }
            window.location.href = url;
          } else {
            this.changePasswordShow = true;
          }
        } else {
          this.$q.notify({
            message: res.data.emsg,
            color: "red",
            position: "top"
          });
          this.getVeriCode()
        }
      });
    },
    closeChangePasswordShow() {
      this.changePasswordShow = false;
    }
  },
  mounted() {
    this.appcode = this.$route.query.appcode;
    this.token = this.$route.query.token;
    this.once = this.$route.query.once;
    this.timestamp = this.$route.query.timestamp;
  }
};
</script>
<style lang="scss" scoped>
.login-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url("../../statics/login/login_bg.png");
  background-size: cover;
  background-position: center center;
  .login-wrap-title {
    font-size: 26px;
    text-align: center;
    font-weight: bold;
    letter-spacing: -0.5px;
    color: #fff;
    margin: 28px auto;
  }
}
.login-window {
  height: 70%;
  width: 63%;
  background-image: url("../../statics/login/login_window.png");
  background-size: cover;
  background-position: center center;
  border-radius: var(--radius);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 90px;
  position: relative;
  .login-window-title {
    position: absolute;
    top: 40px;
    left: 30px;
    right: 30px;
    font-size: 28px;
    text-align: center;
    font-weight: bold;
    color: #0060cf;
    letter-spacing: -0.5px;
  }
  .img {
    width: 580px;
    max-width: 55%;
  }
  .login-box {
    width: 45%;
    padding: 30px;
    max-width: 320px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 40px;
    .box-title {
      color: var(--secondary);
      color: #008bcf;
      font-weight: bold;
      font-size: 30px;
      text-align: center;
    }
    .box-input {
      width: 100%;
      margin-top: 50px;
    }
    .box-tools {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .forget {
        color: var(--secondary);
        cursor: pointer;
      }
    }
  }
}
@media screen and (max-width: 1600px) {
  .login-window {
    justify-content: center;
    .login-box {
      width: 100%;
      padding: 0;
      max-width: 240px;
      margin: 20px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .login-window {
    padding: 60px;
    .img {
      max-width: 65%;
    }
  }
}
@media screen and (max-width: 800px) {
  .login-wrap-title {
    font-size: 22px !important;
  }
  .login-window {
    .login-window-title {
      font-size: 22px;
      top: -74px;
      color: #fff;
    }
    width: 80%;
    height: 50%;
    padding: 20px;
    justify-content: center;
    .img {
      display: none;
    }
    .login-box {
      width: 100%;
      padding: 0;
    }
  }
}
</style>
