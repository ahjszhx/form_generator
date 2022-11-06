<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="bg-gradual-blue text-white">
      <q-toolbar class="GNL__toolbar">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mr-sm"
        />

        <q-toolbar-title
          v-if="$q.screen.gt.xs"
          shrink
          style="font-size:18px"
          class="row items-center no-wrap"
        >
          FormGenerator
        </q-toolbar-title>

        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            flat
            dense
            no-wrap
            no-caps
            style="font-size:16px;padding:1px 8px;"
          >
            <img
              src="../statics/icons/user.png"
              style="width:16px;margin-right:6px;"
            />
            <div>{{ roleInfo.userName }}【{{ roleInfo.roleName }}】</div>
          </q-btn>
          <q-btn
            v-if="userInfo.roles && userInfo.roles.length > 1"
            flat
            dense
            no-wrap
            no-caps
            style="font-size:16px;padding:1px 8px;"
            class="hidden700"
          >
            <img
              src="../statics/icons/change.png"
              style="width:16px;margin-right:6px;"
            />
            <div>Switch Role</div>
            <q-menu
              fit
              anchor="bottom left"
              self="top left"
              transition-show="jump-down"
              transition-hide="jump-up"
            >
              <q-list
                class="text-grey-8"
                style="min-width: 120px"
              >
                <q-item aria-hidden="true">
                  <q-item-section
                    class="text-uppercase text-grey-7"
                    style="font-size: 0.7rem"
                  >选择角色</q-item-section>
                </q-item>
                <q-item
                  v-for="(role, index) in userInfo.roles"
                  :key="role.index"
                  clickable
                  v-close-popup
                  aria-hidden="true"
                >
                  <q-item-section @click="switchRole(index)">
                    {{role.roleName}}{{role.campusName!=null?'-'+role.campusName:''}}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn
            flat
            dense
            no-wrap
            no-caps
            style="font-size:16px;padding:1px 8px;"
            icon="email"
            class="hidden700"
          >
            <q-badge
              color="red"
              floating
              transparent
              v-if="weiMail.count > 0"
            >
              {{ weiMail.count }}
            </q-badge>
            <q-menu>
              <div class="row no-wrap q-pa-md">
                <div class="column items-center">
                  <q-list>
                    <q-item
                      clickable
                      v-for="(item, index) in weiMail.infos"
                      @click="toCheckWs(item)"
                      v-bind:key="index"
                    >
                      <q-item-section avatar>
                        <q-icon
                          color="blue-grey-6"
                          name="announcement"
                        />
                        <q-item-label style="font-size: 10px">
                          {{ item.puname }}({{ item.puid }})</q-item-label>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ item.title }}</q-item-label>
                        <q-item-label style="font-size: 8px;color: #7f7f7f">{{
                          item.pcdt
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      to="/mes/list"
                    >
                      <q-item-section avatar>
                        <q-icon
                          color="primary"
                          name="more"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>Read all the messages</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-menu>
          </q-btn>

          <!--          <q-btn flat dense no-wrap no-caps style="font-size:16px;padding:1px 8px;" @click="tologout" class="hidden700">-->
          <!--            <img src="../statics/icons/loginout.png" style="width:16px;margin-right:6px;" />-->
          <!--            <div>退出</div>-->
          <!--          </q-btn>-->
          <q-btn
            flat
            dense
            no-wrap
            no-caps
            style="font-size:16px;padding:1px 8px;"
            icon="settings"
            class="hidden700"
            label="Setting"
          >
            <q-menu
              content-class="bg-blue-9 text-white"
              auto-close
            >
              <div class="row no-wrap q-pa-md">
                <div class="column items-center">
                  <q-list>
                    <q-item
                      clickable
                      to="/basic/mypwd"
                    >
                      <q-item-section>
                        <div class="inline-block text-white">
                          <q-icon
                            name="lock"
                            style="width:16px;margin-right:6px;"
                          />
                          <span>Change Password</span>
                        </div>
                      </q-item-section>
                    </q-item>

                    <q-item
                      clickable
                      @click="tologout"
                    >
                      <q-item-section>
                        <div class="inline-block text-white">
                          <img
                            src="../statics/icons/loginout.png"
                            style="width:16px;margin-right:6px;"
                          />
                          <span>Log out</span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-white"
      :width="200"
      :breakpoint="700"
    >
      <q-scroll-area class="fit">
        <div class="sysmtem-name">FormGenerator</div>
        <q-list
          padding
          class="text-grey-8"
        >
          <q-expansion-item
            v-for="menu in menus"
            :key="menu.index"
            group="somegroup"
            header-class="text-dark"
            expand-separator
          >
            <template v-slot:header>
              <q-item-section
                avatar
                style="min-width:20px;"
              >
                <img
                  :src="imgUrl(menu.iconClass)"
                  style="width:20px"
                />
              </q-item-section>

              <q-item-section>{{ menu.name }}</q-item-section>
            </template>
            <q-item
              v-for="item in menu.avos"
              :key="item.index"
              :label="item.name"
              :to="item.url"
              :ref="item.url"
              active-class="menu-link"
              class="menu-style"
              clickable
              v-ripple
            >
              <q-item-section style="margin-left:36px;">
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
      <div class="menu-btn-wrap">
        <q-btn
          outline
          color="primary"
          label="切换角色"
        >
          <q-menu
            fit
            anchor="bottom left"
            self="top left"
            transition-show="jump-up"
            transition-hide="jump-down"
          >
            <q-list
              class="text-grey-8"
              style="min-width: 100px"
            >
              <q-item aria-hidden="true">
                <q-item-section
                  class="text-uppercase text-grey-7"
                  style="font-size: 0.7rem"
                >选择角色</q-item-section>
              </q-item>
              <q-item
                v-for="(role, index) in userInfo.roles"
                :key="role.index"
                clickable
                v-close-popup
                aria-hidden="true"
              >
                <q-item-section @click="switchRole(index)">{{
                  role.roleName
                }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          outline
          color="primary"
          label="Read all the messages"
          to="/mes/list"
        />
        <q-btn
          outline
          color="negative"
          label="Log out"
          @click="tologout"
        />
      </div>
    </q-drawer>
    <q-page-container>
      <!--      <keep-alive>-->
      <!--        <router-view  />-->
      <!--      </keep-alive>-->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
      <!--      <router-view  />-->
    </q-page-container>
    <wscontent-dialog ref="wscontShow"></wscontent-dialog>
  </q-layout>
</template>

<script>
import {
  getMenuList, baseWXUrl
} from '../api/data'
import {
  MesYue,
  WeiMesPersonalInfoPage
} from '../api/message'
import {
  logout
} from '../api/rbac'
import wscontentDialog from "../pages/message/components/ContentDialog.vue";
import {
  goto_login_url
} from '../utils/co_util'
import {
  bus
} from '../utils/bus.js'
export default {
  name: 'PcLayout',
  components: {
    wscontentDialog
  },
  data () {
    return {
      timer: null,
      leftDrawerOpen: false,
      search: "",
      showAdvanced: false,
      showDateOptions: false,
      exactPhrase: "",
      hasWords: "",
      excludeWords: "",
      byWebsite: "",
      byDate: "Any time",
      menus: [],
      userInfo: {},
      roleInfo: {
        id: "",
        roleId: "",
        userId: "",
        roleName: "",
        projectId: "",
        projectName: ""
      },
      wsUser: "",
      weiMail: {
        count: 0,
        infos: []
      }
    };
  },
  methods: {
    lisen () {
      var that = this;
      that.$root.myEvent.$on("trans", function (msg) {
        console.log("子路由传过来的值  " + msg);
        that.getchild = msg;
      });
    },
    imgUrl (item) {
      if (item) {
        return require("../statics/tabbar/" + item + ".png");
      }
    },
    tologout () {
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
      });
    },
    onClear () {
      this.exactPhrase = "";
      this.hasWords = "";
      this.excludeWords = "";
      this.byWebsite = "";
      this.byDate = "Any time";
    },
    changeDate (option) {
      this.byDate = option;
      this.showDateOptions = false;
    },
    getUserName () {
      this.userInfo = this.$store.getters.getUserInfo;
    },
    switchRole (index) {
      this.roleIndex = index;
      this.roleInfo = this.userInfo.roles[index];
      console.log(this.roleInfo);
      getMenuList(this.roleInfo.oid).then(resk => {
        this.$store.commit("setMenu", resk.data);
        this.menus = resk.data;
      });
    },
  },
  // beforeDestroy() {
  //   this.onbeforeunload();
  //   if (this.timer) {
  //     //如果定时器还在运行 或者直接关闭，不用判断
  //     clearInterval(this.timer); //关闭
  //     this.$store.state.isloading = true;
  //   }
  // },
  mounted () {
    if (this.$store.getters.getUserInfo.userId === "") {
      this.$q.notify({
        position: "top",
        color: "red-5",
        textColor: "white",
        icon: "announcement",
        message: "未发现用户信息"
      });
    } else {
      this.userInfo = this.$store.getters.getUserInfo;
      this.roleInfo = this.userInfo.currentRole;
      console.log(this.roleInfo);
      //console.log("---------------");
      this.menus = this.$store.getters.getMenu;
      //console.log('666menus', this.menus)
      getMenuList(this.roleInfo.oid).then(resk => {
        this.$store.commit("setMenu", resk.data);
        this.menus = resk.data;
        //console.log('777menus', this.menus)
      });

      this.wsUser = this.$store.getters.getUserInfo.userId;
    }
  },
  watch: {
    wsUser (newVal, oldVal) {
      if (newVal) {
      }
    }
  }
};

</script>

<style lang="scss" scoped>
.q-toolbar {
  min-height: 60px;
}

.q-drawer--left.q-drawer--bordered {
  border-right-color: #dadada;
}

.menu-link {
  background: #f4f4f4;
  border-left: 4px solid var(--primary) !important;
  /* border-radius:10px; */
}

.menu-style {
  border-left: 4px solid transparent;
}

.sysmtem-name {
  padding: 12px 16px 0;
  font-size: 14px;
  font-weight: bold;
}

.menu-btn-wrap {
  position: absolute;
  bottom: 0;
  padding: 12px 16px;

  button,
  a {
    width: 100%;

    & + button,
    & + a {
      margin-top: 10px;
    }
  }
}

// 屏幕宽度大于700px不显示
@media screen and (min-width: 700px) {
  .sysmtem-name {
    display: none;
  }

  .menu-btn-wrap {
    display: none;
  }
}

// 屏幕宽度小于700px不显示
@media screen and (max-width: 700px) {
  .hidden700 {
    display: none;
  }
}
</style>
