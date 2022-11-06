<template>
  <div class="q-pa-md q-gutter-y-md">
    <q-card class="q-gutter-y-md items-center">
      <div class="row ">
        <q-splitter v-model="splitterModel" :limits="[20, 100]" style="height: 80vh;width: 90vw">
          <template v-slot:before>
            <div class="q-pa-md">
              <q-tree ref="orgTree" :nodes="props" accordion selected-color='teal-8' :selected.sync="selectedTree" node-key="id" label-key="nodeName" @update:selected="getSelectedNode">
                <template v-slot:default-header="prop">
                  <div class="row items-center">
                    <div class="text-weight-bold">{{ prop.node.nodeName }}</div>
                    <div v-if="prop.node.level>0">
                      <q-btn v-if="prop.node.nodeName == '学校管理员'|| prop.node.nodeName=='校区管理员'" @click="showDptUserAdd(prop.node)" style="margin-left:5px" size="sm" color="primary" dense>添加人员</q-btn>
                      <q-btn v-else @click="showUserAdd(prop.node)" style="margin-left:5px" size="sm" color="primary" dense>添加人员
                      </q-btn>
                    </div>
                  </div>
                </template>
              </q-tree>
            </div>
          </template>

          <template v-slot:after>
            <q-table class="my-sticky-column-table" :data="data" :columns="columns" row-key="uuid" :rows-per-page-options="[8, 15, 20]" :pagination.sync="pagination" :loading="loading" @request="onRequest">
              <template v-slot:top>
                <q-space />
                <q-input borderless debounce="300" v-model="filter.name" placeholder="姓名" @keyup.enter="getUserPageByRoleId">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-btn dense color="primary" @click="reset" icon="refresh" style="margin-left:2%">重置</q-btn>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="userId" :props="props">
                    {{ props.row.userId }}
                  </q-td>
                  <q-td key="username" :props="props">
                    {{ props.row.username }}
                  </q-td>
                  <q-td key="userType" :props="props">
                    {{ props.row.userType }}
                  </q-td>
                  <q-td key="orgName" :props="props">
                    {{ props.row.orgName }} {{props.row.campusName }}
                  </q-td>
                  <q-td key="btn" :props="props">
                    <q-btn style="margin-left:5px" color="red" @click="showUserDlt(props.row)">删除</q-btn>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </template>
        </q-splitter>
      </div>
    </q-card>

    <q-dialog v-model="showAddUser">
      <q-card style="width:100%; max-width: 90vw">
        <q-toolbar>
          <q-toolbar-title class="text-center"><span class="text-weight-bold"></span>添加人员</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <div class="row justify-center q-gutter-x-md">
            <div class="col-md-8 q-gutter-y-md">
              <q-input readonly dense outlined v-model="selectNode.nodeName" label="所属角色" />
              <q-select dense outlined v-model="stuffInfo" use-input input-debounce="0" label="姓名" :options="stuffList" @filter="filterStuff" />
            </div>
          </div>
          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="提交" @click="addUser()" color="primary"></q-btn>
            <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showAddDptUser">
      <q-card style="width:100%; max-width: 90vw">
        <q-toolbar>
          <q-toolbar-title class="text-center"><span class="text-weight-bold"></span>添加学院管理员</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <div class="row justify-center q-gutter-x-md">
            <div class="col-md-8 q-gutter-y-md">
              <q-input readonly dense outlined v-model="selectNode.nodeName" label="所属角色" />
              <q-select dense outlined v-model="org" option-value="id" option-label="nodeName" use-input input-debounce="0" label="管理学校" :options="orgs" @filter="filterOrgs" />
              <q-select dense outlined v-model="campus" :options="org.child" option-value="id" option-label="nodeName" label="管理校区" v-if="this.selectNode.nodeName=='校区管理员'" />
              <q-select dense outlined v-model="stuffInfo" use-input input-debounce="0" label="姓名" :options="stuffList" @filter="filterStuff" />
            </div>
          </div>
          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="提交" @click="addDptManager()" color="primary"></q-btn>
            <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDltUser">
      <q-card style="width: 300px">
        <q-card-section class="bg-red text-white">
          <div class="text-h6">删除小贴士</div>
        </q-card-section>
        <q-card-section>
          您确认移除{{OpUserRole.username}}吗?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="确定" @click="deleteUserRole()" v-close-popup />
          <q-btn flat label="取消" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import {
  getProTree, getStuffByName, getRbacRoles, addDptManager, getOrgs,
  addProjectRole, addUser, getUserPageByRoleId, removeUserRoleByOid, getStudentByName
} from '../../api/rbac'
// import { teacherOrgs, groupOrgs } from '../../apis/datapc'
import { setTimeout } from 'timers'

export default {
  data() {
    return {
      OpUserRole: {
        uuid: '',
        username: ''
      },
      disable: false,
      stuffList: [],
      studentList: [],
      org: {
        level: '',
        type: '',
        pname: '',
        pid: '',
        nodeCode: '',
        nodeName: '',
        child: []
      },
      campus: [],
      role: {
        value: '',
        label: ''
      },
      stuffInfo: {
        value: '',
        label: '',
        username: '',
        type: ''
      },
      studentInfo: {
        value: '',
        label: ''
      },
      dltRow: {},
      dltCode: '',
      filter: {
        pcode: '',
        roleId: '',
        oid: '',
        name: ''
      },
      // org: {},
      showEditUser: false,
      showAddDptUser: false,
      showAddUser: false,
      showRole: false,
      showDltUser: false,
      showVolunteer: false,
      splitterModel: 32,
      loading: false,
      confirm: false,
      visible: false,
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 8,
        rowsNumber: 15
      },
      columns: [
        { name: 'userId', align: 'center', label: '工号', field: 'userId' },
        { name: 'username', align: 'center', label: '用户名', field: 'username' },
        { name: 'userType', align: 'center', label: '类型', field: 'userType' },
        { name: 'orgName', align: 'center', label: '学校/校区', field: 'orgName' },
        { name: 'btn', align: 'center', label: '操作', field: 'btn' }
      ],
      data: [],
      roles: [],
      selectNode: {},
      props: [],
      orgs: [],
      selectedTree: {}
    }
  },
  methods: {
    showUserDlt(row) {
      this.OpUserRole.uuid = row.userId
      this.OpUserRole.username = row.username
      this.showDltUser = true
    },
    deleteUserRole() {
      if (this.filter.oid === '') {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '请在左侧机构树中选择一个角色'
        })
        return false
      }
      removeUserRoleByOid(this.filter, this.OpUserRole.uuid).then(res => {
        this.getOptResult(res)
        res.data.suc === true ? this.showDltUser = false : this.showDltUser = true
        this.getUserPageByRoleId()
      })
    },
    onRequest(props) {
      const { page, rowsPerPage, descending } = props.pagination
      this.loading = true
      // don't forget to update local pagination object
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.descending = descending
      this.getUserPageByRoleId()
      this.loading = false
    },
    addProjectRole() {
      addProjectRole(this.org, this.role).then(res => {
        this.getOptResult(res)
        res.data.suc === true ? this.showRole = false : this.showRole = true
        this.getProTree()
        this.$refs.orgTree.setExpanded(this.org.pid, true)
      })
    },
    showVolunteerAdd(node) {
      if (node == null || node.level == null ||
        node.level === undefined || node.type !== '角色') {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '请在左侧机构树中选择一个角色'
        })
        return false
      }
      this.showVolunteer = true
      this.studentList.splice(0, this.studentList.length)
      this.studentInfo.value = ''
      this.studentInfo.label = ''
    },
    showUserAdd(node) {
      console.log('778')
      if (node == null || node.level == null ||
        node.level === undefined || node.type !== '角色') {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '请在左侧机构树中选择一个角色'
        })
        return false
      }
      this.showAddUser = true
      this.stuffList.splice(0, this.stuffList.length)
      this.stuffInfo.value = ''
      this.stuffInfo.label = ''
      this.stuffInfo.username = ''
      this.stuffInfo.type = ''
    },
    showGroupUserAdd(node) {
      this.org = ''
      if (node == null || node.level == null ||
        node.level === undefined || node.type !== '角色') {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '请在左侧机构树中选择一个角色'
        })
        return false
      }
      this.showAddDptUser = true
      // groupOrgs().then(res => {
      //   this.orgs = res.data
      // })
      this.stuffList.splice(0, this.stuffList.length)
      this.stuffInfo.value = ''
      this.stuffInfo.label = ''
      this.stuffInfo.username = ''
      this.stuffInfo.type = ''
    },

    showTeacherUserAdd(node) {
      this.org = ''
      if (node == null || node.level == null ||
        node.level === undefined || node.type !== '角色') {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '请在左侧机构树中选择一个角色'
        })
        return false
      }
      this.showAddDptUser = true
      // teacherOrgs().then(res => {
      //   this.orgs = res.data
      // })
      this.stuffList.splice(0, this.stuffList.length)
      this.stuffInfo.value = ''
      this.stuffInfo.label = ''
      this.stuffInfo.username = ''
      this.stuffInfo.type = ''
    },
    showDptUserAdd(node) {
      this.org = ''
      if (node == null || node.level == null ||
        node.level === undefined || node.type !== '角色') {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '请在左侧机构树中选择一个角色'
        })
        return false
      }
      this.showAddDptUser = true
      getOrgs().then(res => {
        this.orgs = res.data
      })
      this.stuffList.splice(0, this.stuffList.length)
      this.stuffInfo.value = ''
      this.stuffInfo.label = ''
      this.stuffInfo.username = ''
      this.stuffInfo.type = ''
    },
    addDptManager() {
      if(this.selectNode=='校区管理员'&&this.campus.id==''){
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '请选择校区'
        })
      }
      addDptManager(this.selectNode, this.stuffInfo, this.org, this.campus).then(res => {
        this.getOptResult(res)
        res.data.suc === true ? this.showAddDptUser = false : this.showAddDptUser = true
      })
      setTimeout(() => {
        this.getUserPageByRoleId()
      }, 100)
    },
    addUser() {
      // UerRole  uid uname roleId buildings projectId
      addUser(this.filter.oid, this.stuffInfo.value, this.selectNode.nodeCode, this.filter.pcode, this.stuffInfo.username, this.stuffInfo.type).then(res => {
        this.getOptResult(res)
        res.data.suc === true ? this.showAddUser = false : this.showAddUser = true
      })
      setTimeout(() => {
        this.getUserPageByRoleId()
      }, 300)
    },
    addStudentUser() {
      // UerRole  uid uname roleId buildings projectId
      addUser(this.filter.oid, this.studentInfo.value, this.selectNode.nodeCode, this.filter.pcode).then(res => {
        this.getOptResult(res)
        res.data.suc === true ? this.showAddUser = false : this.showAddUser = true
      })
      setTimeout(() => {
        this.getUserPageByRoleId()
      }, 100)
    },
    showOrgAdd() {
      const node = this.selectNode
      this.org.nodeCode = ''
      this.org.nodeName = ''
      if (node == null || node.level == null || node.level === undefined) {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '父节点不能为空，请在人员树中选择您要添加节点的父节点'
        })
        return false
      }
      if (node.level > 4) {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'fas fa-exclamation-triangle',
          message: '已超出项目结构树层级限制，无法再添加子节点'
        })
        return false
      } else {
        this.showRole = true
        this.org.level = node.level + 1
        this.org.pid = node.id
        this.org.pname = node.nodeName
        this.org.type = '角色'
      }
    },
    getSelectedNode(target) {
      if (target != null) {
        this.selectNode = this.$refs.orgTree.getNodeByKey(target)
      }
      this.filter.pid = ''
      this.filter.roleId = ''
      if (this.selectNode != null) {
        this.filter.oid = this.selectNode.id
      }
      console.log('selectNode', this.selectNode)
      this.getUserPageByRoleId()

    },
    getUserPageByRoleId() {
      getUserPageByRoleId(this.pagination, this.filter).then(res => {
        this.data = res.data.records
        this.pagination.rowsNumber = res.data.total
      })
    },
    reset() {
      this.filter.name = ''
      this.getUserPageByRoleId()
    },
    getProTree() {
      getProTree().then(res => {
        this.props.splice(0, this.props.length)
        this.props.push(res.data)
      })
    },
    getRbacRoles() {
      this.roles.splice(0, this.roles.length)
      getRbacRoles().then(res => {
        res.data.forEach(item => {
          this.roles.push({ value: item.id, label: item.name })
        })
      })
    },
    getOptResult(res) {
      if (res.data.suc === true) {
        this.$q.notify({
          position: 'top',
          color: 'green-4',
          textColor: 'white',
          icon: 'mood',
          message: res.data.msg
        })
      } else {
        this.$q.notify({
          position: 'top',
          color: 'red-5',
          textColor: 'white',
          icon: 'mood_bad',
          message: res.data.emsg
        })
      }
    },
    filterOrgs(val, update) {
      if (val.length < 2) {
        return
      }
      update(() => {
        getOrgs(val).then(res => {
          this.orgs = res.data
        })
      })
    },
    filterStuff(val, update) {
      if (val.length < 2) {
        return
      }
      update(() => {
        getStuffByName(val).then(res => {
          this.stuffList = res.data
        })
      })
    },
    filterStudent(val, update) {
      if (val.length < 2) {
        return
      }
      update(() => {
        getStudentByName(val).then(res => {
          this.studentList = res.data
        })
      })
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    getProTree().then(res => {
      this.props.splice(0, this.props.length)
      this.props.push(res.data)
      for (var i = 1; i < 100; i++) {
        const node = this.$refs.orgTree.getNodeByKey(i)
        if (node && node.level < 3) {
          this.$refs.orgTree.setExpanded(i, true)
        }
      }
    })
    this.getRbacRoles()
    this.getUserPageByRoleId()
  }
}
</script>
