import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
const state = {
  action: [],
  roleInfo: {
    id: "",
    oid: "",
    roleId: "",
    roleName: "",
    projectId: "",
    projectName: "",
    userId: "",
    userName: ""
  },
  userInfo: {
    userId: "",
    username: "",
    roles: [],
    depId: "",
    depName: "",
    currentRole: {},
    timestamp: 0
  },
  menu: [],
  isloading: true,
  mpInfo: {
    type: ""
  }
};
const getters = {
  getRoleInfo() {
    return JSON.parse(localStorage.getItem("roleInfo"));
  },
  getUserInfo() {
    return JSON.parse(localStorage.getItem("userInfo"));
  },
  getMenu() {
    return JSON.parse(localStorage.getItem("menu"));
  },
  getAction() {
    return JSON.parse(localStorage.getItem("action"));
  }
};

const mutations = {
  setRoleInfo(state, roleInfo) {
    state.roleInfo = roleInfo;
    localStorage.setItem("roleInfo", JSON.stringify(roleInfo));
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  },
  setMenu(state, menu) {
    state.menu = menu;
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  setAction(state, action) {
    state.action = action;
    localStorage.setItem("action", JSON.stringify(action));
  }
};

const actions = {};

const store = new Vuex.Store({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
});

export default store;
