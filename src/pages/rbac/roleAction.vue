<template>
  <div class="q-pa-md">
    <q-table
      class="my-sticky-header-table"
      title="角色管理"
      :data="data"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[8, 10, 20]"
      @request="onRequest"
      :pagination.sync="pagination"
      :loading="loading"
    >
      <template v-slot:top-right="">
        <q-input
          dense
          outlined
          v-model="filter"
          label="角色名"
          style="width: 150px"
        />&nbsp;&nbsp;
        <q-btn small color="primary" @click="getRolePage" icon="search"
          >查询</q-btn
        >&nbsp;&nbsp;
        <q-btn small color="primary" @click="reset" icon="refresh">重置</q-btn
        >&nbsp;&nbsp;
        <q-btn small color="primary" @click="create" icon="person_add_alt_1"
          >创建新角色</q-btn
        >&nbsp;&nbsp;
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="createdAt" :props="props">
            <div class="text-pre-wrap">{{ props.row.createdAt }}</div>
          </q-td>
          <q-td key="btn" :props="props">
            <!-- <q-btn color="primary" sm @click="showDevicePicker(props.row)">修改可管理范围</q-btn>&nbsp;&nbsp; -->
            <!-- <q-btn
              label="修改菜单权限"
              sm
              @click="showEdit(props.row.id, 1)"
              color="primary"
            />&nbsp;&nbsp; -->

             <q-btn
              label="修改菜单权限"
              sm
              @click="showEdit(props.row.id, 1)"
              color="primary"
              :disable="props.row.name == '系统管理员'"
            />&nbsp;&nbsp;
            <!-- <q-btn label="修改动作权限" sm @click="showEdit(props.row.id,0)" color="primary" />&nbsp;&nbsp; -->
            <q-btn
              label="删除"
              sm
              @click="showDel(props.row)"
              color="red"
              :disable="props.row.name == '系统管理员'"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="editShow1">
      <q-card style="width: 70vw; max-width: 80vw">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="q-pa-md doc-container q-gutter-x-xs q-gutter-y-lg">
          <div class="row justify-center">
            <q-list class="rounded-borders" style="width:70vw" separator>
              <q-item
                v-for="group in groups1"
                :key="group.index"
                style="flex-wrap:wrap"
              >
                <q-item-section top class="col-12 gt-sm">
                  <q-item-label class="q-mt-sm">{{ group.name }}</q-item-label>
                </q-item-section>
                <q-item-section
                  top
                  side
                  v-for="action in group.rbacActions"
                  :key="action.index"
                >
                  <q-checkbox
                    v-model="check_actions"
                    :val="action.id"
                    :label="action.name"
                    color="teal"
                    style=""
                  />
                </q-item-section>
              </q-item>
              <q-separator spaced />
            </q-list>
          </div>
          <div class="row justify-center" style="margin-top:15px">
            <q-btn
              label="提交"
              @click="onSubmit(1)"
              color="primary"
              style="width:150px"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editShow2">
      <q-card style="width: 70vw; max-width: 80vw">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">关闭</q-tooltip>
          </q-btn>
        </q-bar>
        <div class="q-pa-md doc-container q-gutter-x-xs q-gutter-y-lg">
          <div class="row justify-center">
            <q-list class="rounded-borders" style="width:70vw" separator>
              <q-item
                v-for="group in groups2"
                :key="group.index"
                style="flex-wrap:wrap"
              >
                <q-item-section top class="col-12 gt-sm">
                  <q-item-label class="q-mt-sm">{{ group.name }}</q-item-label>
                </q-item-section>
                <q-item-section
                  top
                  side
                  v-for="action in group.rbacActions"
                  :key="action.index"
                >
                  <q-checkbox
                    v-model="check_actions"
                    :val="action.id"
                    :label="action.name"
                    color="teal"
                    style=""
                  />
                </q-item-section>
              </q-item>
              <q-separator spaced />
            </q-list>
          </div>
          <div class="row justify-center" style="margin-top:15px">
            <q-btn
              label="提交"
              @click="onSubmit(0)"
              color="primary"
              style="width:150px"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addShow">
      <q-card style="width:60%; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title class="text-center"
            ><span class="text-weight-bold">创建新角色</span></q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-sm">
          <div class="row justify-center q-gutter-sm">
            <div class="col-md-10 q-gutter-md" style="margin-left:0">
              <!-- <q-input outlined v-model="info.id" label="id"></q-input> -->
              <q-input outlined v-model="info.name" label="名称"></q-input>
            </div>
          </div>
          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="确认" @click="addRole" color="primary"></q-btn>
            <q-btn
              label="关闭"
              type="reset"
              v-close-popup
              color="primary"
              flat
              class="q-ml-sm"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dltShow">
      <q-card style="width: 300px">
        <q-card-section class="bg-red text-white">
          <div class="text-h6">删除小贴士</div>
        </q-card-section>
        <q-card-section>
          您确认删除<br />
          名称：{{ dltRow.name }}<br />
          的角色以及其下所有绑定用户信息吗？
          <!-- 发布对象学校：{{dltRow.collegeNames}}<br/>的计划吗? -->
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="确定" @click="deleteRow()" v-close-popup />
          <q-btn flat label="取消" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <Menu :showMenu="editShow3" :id="roleId" @close="closeEdit3"></Menu>

  </div>
</template>

<script>

import Menu from "./components/Menu.vue";
import {
  getRolePage,
  getActions,
  getMenusByRoleId,
  roleUpdate,
  addRole,
  deleteRole
} from "../../api/rbac";
// import Vue from 'vue'

export default {
  components: {
    DevicePicker,
    Menu
  },
  data() {
    return {
      dltRow: {},
      info: {
        id: "",
        name: ""
      },
      devicePickerInfo: {
        isShow: false,
        userId: "",
        userType: ""
      }, // devicePicker配置
      editShow1: false,
      editShow2: false,
      editShow3: false,
      loading: false,
      addShow: false,
      dltShow: false,
      size: "sm",
      filter: "",
      roleId: 0,
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 8,
        rowsNumber: 15
      },
      columns: [
        {
          name: "id",
          align: "center",
          field: "id"
        },
        {
          name: "name",
          align: "center",
          label: "角色名",
          field: "name"
        },
        {
          name: "createdAt",
          align: "center",
          label: "创建时间",
          field: "createdAt"
        },
        {
          name: "btn",
          align: "center",
          label: "操作",
          field: "btn"
        }
      ],
      data: [],
      groups1: [],
      groups2: [],
      check_actions: []
    };
  },
  methods: {
    closeEdit3() {
      this.editShow3 = false;
    },
    deleteRow() {
      deleteRole(this.dltRow.id).then(res => {
        this.getOptResult(res);
        res.data.suc === true ? (this.dltShow = false) : (this.dltShow = true);
        setTimeout(() => {
          this.getRolePage();
        }, 200);
      });
    },
    getOptResult(res) {
      if (res.data.suc === true) {
        this.$q.notify({
          position: "top",
          icon: "mood",
          color: "green-4",
          textColor: "white",
          message: res.data.msg
        });
      } else {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "mood_bad",
          message: res.data.emsg
        });
      }
    },
    addRole() {
      addRole(this.info).then(res => {
        this.getOptResult(res);
        res.data.suc === true ? (this.addShow = false) : (this.addShow = true);
        setTimeout(() => {
          this.getRolePage();
        }, 200);
      });
    },
    showDel(row) {
      this.dltShow = true;
      this.dltRow = row;
    },
    create() {
      this.addShow = true;
      this.info.name = "";
    },
    showDevicePicker(info) {
      console.log(info);
      this.devicePickerInfo.userId = info.id;
      this.devicePickerInfo.userType = "角色"; // info.userType
      this.devicePickerInfo.isShow = true;
    },
    closeDevicePicker() {
      this.devicePickerInfo.isShow = false;
    },
    // fileds: files => [{ name: 'file', value: 'file' }],
    onRequest(props) {
      // console.log(props.pagination)
      const { page, rowsPerPage, descending } = props.pagination;

      this.loading = true;
      // don't forget to update local pagination object
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.descending = descending;

      this.getRolePage();
      // ...and turn of loading indicator
      this.loading = false;
    },
    getRolePage() {
      getRolePage(
        this.pagination.page,
        this.pagination.rowsPerPage,
        this.filter
      ).then(res => {
        this.data = res.data.records;
        this.pagination.rowsNumber = res.data.total;
      });
    },
    getActions(isMenu) {
      getActions(isMenu).then(res => {
        if (isMenu === 1) {
          this.groups1 = res.data.data;
        } else {
          this.groups2 = res.data.data;
        }
      });
    },
    reset() {
      this.filter = "";
      this.getRolePage();
    },
    showEdit(id, isMenu) {
      this.editShow3 = true;
      this.roleId = id;
      // // this.editShow = true
      // getMenusByRoleId(id, isMenu).then((res) => {
      //   this.check_actions.splice(0, this.check_actions.length)
      //   if (res.data.data.length > 0) {
      //     res.data.data.forEach(element => {
      //       this.check_actions.push(element.id)
      //     });
      //   }

      //   // this.check_actions = res.data.data
      //   console.log(this.check_actions)
      // })
      // isMenu === 1 ? this.editShow1 = true : this.editShow2 = true
    },
    onSubmit(isMenu) {
      // console.log(this.check_actions)
      const ids = JSON.stringify(this.check_actions);
      roleUpdate(this.roleId, ids, isMenu).then(res => {
        if (res.data.suc === true) {
          this.$q.notify({
            position: "top",
            color: "green-4",
            textColor: "white",
            icon: "mood",
            message: "提交成功"
          });
          isMenu === 1 ? (this.editShow1 = false) : (this.editShow2 = false);
        } else {
          this.$q.notify({
            position: "top",
            color: "red-5",
            textColor: "white",
            icon: "mood_bad",
            message: res.data.emsg
          });
        }
      });
    }
  },
  mounted() {
    // console.log(this.$router.options.routes)
    this.getRolePage();
    // this.getActions(1)
    // this.getActions(0)
  }
};
</script>

<style lang="stylus">
.my-sticky-header-table
  /* max height is important */
  .q-table__middle
    max-height 70vh
  .q-table__top, .q-table__bottom, thead tr:first-child th /* bg color is important for th; just specify one */
    background-color #ffffff
  thead tr:first-child th
    position sticky
    top 0
.table-responsive
  border 0
  overflow-x auto
  min-height 0.01%
</style>
