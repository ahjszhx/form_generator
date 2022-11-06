<template>
  <div class="q-pa-md q-gutter-y-md">
    <q-card class="q-gutter-y-md items-center">
      <div class="q-pa-md">
        <div class="row q-gutter-x-md justify-left" style="margin-top:0">
          <!-- <q-input dense outlined v-model="filter.belong" style="min-width: 200px; max-width: 250px" label="请输入学院名称" @keyup.esc="clearName" @keyup.enter="query"/> -->
          <q-input
            dense
            outlined
            v-model="filterLocation.name"
            style="min-width: 200px; max-width: 250px"
            label="请输入学校或校区"
            @keyup.enter="query"
          >
            <template v-slot:append>
              <q-icon
                v-show="filterLocation.name != ''"
                name="close"
                @click="reset"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <q-btn small color="primary" @click="query" icon="search">查询</q-btn
          >
          <!-- <q-btn small color="primary" @click="reset" icon="refresh">重置</q-btn
          >&nbsp; -->
          <q-btn small color="primary" @click="showAdd('学校')" icon="add"
            >新增学校</q-btn
          >
          <q-btn small color="primary" @click="showAdd('校区')" icon="add"
            >新增校区</q-btn
          >
        </div>
      </div>
    </q-card>
    <q-card class="q-gutter-y-md items-center">
      <div class="row ">
        <q-splitter
          v-model="splitterModel"
          :limits="[30, 100]"
          style="height: 80vh;width: 90vw"
        >
          <template v-slot:before>
            <div class="q-pa-md row q-col-gutter-sm">
              <div class="col-12 col-sm-12">
                <!-- <q-toggle v-model="isShow"/>编辑结构 -->
                <q-toggle v-model="isShow2" />显示类型
                <q-toggle v-model="isShow" />修改树结构
                <!-- <q-btn v-if="isShow"  @click="showFatherNodeAdd(this.ticked)" style="margin-left:5px" size="sm" color="secondary"
                        dense>添加父节点
                      </q-btn>
                      <q-btn v-if="isShow"  @click="showChildNodeAdd(this.ticked)" style="margin-left:5px" size="sm" color="primary"
                        dense>添加子节点
                      </q-btn>
                      <q-btn v-if="isShow" @click="showNodeDlt(this.ticked)" style="margin-left:5px" size="sm" color="warning"
                        dense>删除
                      </q-btn> -->
              </div>
              <q-tree
                ref="orgTree"
                :nodes="props"
                accordion
                selected-color="red-5"
                :selected.sync="selectedTree"
                node-key="id"
                label-key="nodeName"
                @update:selected="getSelectedNode"
                @lazy-load="onLazyLoad"
              >
                <template v-slot:default-header="prop">
                  <div
                    class="row items-center"
                    draggable="true"
                    @dragstart="drag($event, prop.node)"
                    @drop="drop($event, item, prop.node)"
                    @dragover="allowDrop($event)"
                  >
                    <!-- <div>{{prop.node.icon}}</div> -->
                    <q-icon
                      :name="
                        'img:' +
                          require(`../../statics/icons/icon_${prop.node.icon}.png`)
                      "
                      color="orange"
                      size="20px"
                      class="q-mr-sm"
                    />
                    <!-- <img :src="`/statics/icons/icon_${prop.node.icon}.png`"/> -->
                    <!-- <img src="../../statics/icons/icon_school.png" syle/> -->
                    <div class="text-weight-bold">{{ prop.node.nodeName }}</div>
                    <div class="text-weight-bold" v-if="isShow2">
                      <q-chip>{{ prop.node.type }}</q-chip>
                    </div>
                    <div v-if="prop.node.level >= 0">
                      <!-- <q-btn v-if="isShow && prop.node.level>0 && (prop.node.type==='校区')" @click="showFatherNodeAdd(prop.node)" style="margin-left:5px" size="sm" color="secondary" dense>添加父节点
                      </q-btn> -->
                      <q-btn
                        v-if="
                          isShow &&
                            (prop.node.type === '教委' ||
                              prop.node.type === '学校')
                        "
                        @click="showChildNodeAdd(prop.node)"
                        style="margin-left:5px"
                        size="sm"
                        color="primary"
                        dense
                      >
                        添加子节点
                      </q-btn>
                      <q-btn
                        v-if="isShow"
                        @click="showNodeDlt(prop.node)"
                        style="margin-left:5px"
                        size="sm"
                        color="warning"
                        dense
                        >删除
                      </q-btn>
                    </div>
                  </div>
                </template>
              </q-tree>
            </div>
          </template>

          <q-dialog v-model="addChildNodeShow">
            <q-card style="width:60%; max-width: 80vw;">
              <q-toolbar>
                <q-toolbar-title class="text-center"
                  ><span class="text-weight-bold"
                    >新增子节点</span
                  ></q-toolbar-title
                >
                <q-btn flat round dense icon="close" v-close-popup />
              </q-toolbar>
              <q-separator />
              <div class="q-pa-md doc-container q-gutter-y-md">
                <div class="row justify-center q-gutter-x-md">
                  <div class="col-md-10 q-gutter-y-md">
                    <!-- <q-input outlined v-model="info.number" label="设备号" readonly/> -->
                    <!-- <q-input outlined v-model="info.collegeName" label="所属学校名称" /> -->
                    <q-input
                      outlined
                      v-model="addChildNodeInfo.nodeName"
                      label="父节点名称"
                      readonly
                    />
                    <q-input
                      outlined
                      v-model="addChildNodeInfo.name"
                      label="子节点名称"
                    />
                    <q-select
                      outlined
                      v-model="addChildNodeInfo.type"
                      :options="types"
                      label="类型"
                    />
                  </div>
                </div>
                <div class="row justify-center q-gutter-x-md">
                  <div class="col-md-10" style="margin-left:0"></div>
                </div>
                <div class="row justify-center" style="margin-top:15px">
                  <q-btn
                    label="确认"
                    @click="addChildNode"
                    color="primary"
                  ></q-btn>
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

          <q-dialog v-model="addFatherNodeShow">
            <q-card style="width:60%; max-width: 80vw;">
              <q-toolbar>
                <q-toolbar-title class="text-center"
                  ><span class="text-weight-bold"
                    >新增父节点</span
                  ></q-toolbar-title
                >
                <q-btn flat round dense icon="close" v-close-popup />
              </q-toolbar>
              <q-separator />
              <div class="q-pa-md doc-container q-gutter-y-md">
                <div class="row justify-center q-gutter-x-md">
                  <div class="col-md-10 q-gutter-y-md">
                    <!-- <q-input outlined v-model="info.number" label="设备号" readonly/> -->
                    <!-- <q-input outlined v-model="info.collegeName" label="所属学校名称" /> -->
                    <q-input
                      outlined
                      v-model="addFatherNodeInfo.name"
                      label="父节点名称"
                    />
                    <q-input
                      outlined
                      v-model="addFatherNodeInfo.nodeName"
                      label="子节点名称"
                      readonly
                    />
                    <q-select
                      outlined
                      v-model="addFatherNodeInfo.type"
                      :options="types"
                      label="类型"
                    />
                  </div>
                </div>
                <div class="row justify-center q-gutter-x-md">
                  <div class="col-md-10" style="margin-left:0"></div>
                </div>
                <div class="row justify-center" style="margin-top:15px">
                  <q-btn
                    label="确认"
                    @click="addFatherNode"
                    color="primary"
                  ></q-btn>
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

          <!-- 学校 -->
          <template v-slot:after>
            <!-- 通用节点 -->
            <q-table
              class="my-sticky-column-table shadow-0 full-height"
              :data="data"
              :columns="nodeColumns"
              row-key="uuid"
              :rows-per-page-options="[8, 15, 20]"
              :pagination.sync="pagination"
              :loading="loading"
              @request="onRequest"
            >
              <template v-slot:top>
                <q-space />
                <q-input
                  dense
                  outlined
                  v-model="filter.name"
                  style="min-width: 200px; max-width: 250px;margin-right:20px;"
                  label="姓名"
                  @keyup.enter="getLocationById"
                >
                  <template v-slot:append>
                    <q-icon
                      v-show="filter.name != ''"
                      name="close"
                      @click="reset"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
                <!-- <q-select dense outlined v-model="filter.role" :options="roles"
                  style="min-width: 200px; max-width: 250px;" label="选择角色" @keyup.enter="getLocationById">
                </q-select> -->
                <!-- <q-btn  @click="showAddCollege()" style="margin-left:5px" size="sm" color="primary"
                        dense>添加
                      </q-btn> -->
                <q-btn
                  flat
                  color="secondary"
                  @click="getLocationById()"
                  icon="search"
                  >查询</q-btn
                >
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="userId" :props="props">
                    <q-chip
                      color="primary"
                      outline
                      text-color="white"
                      icon="bookmark"
                      clickable
                    >
                      {{ props.row.userId }}
                    </q-chip>
                    <!-- <q-chip color="primary" text-color="white" icon="bookmark"> {{ props.row.ftype }}</q-chip> -->
                  </q-td>

                  <q-td key="username" :props="props">
                    <div class="text-pre-wrap">{{ props.row.username }}</div>
                  </q-td>

                  <!-- <q-td key="role" :props="props">
                    <div class="text-pre-wrap">
                      <div class="text-pre-wrap">{{ props.row.role }}</div>
                    </div>
                  </q-td> -->

                  <q-td key="job" :props="props">
                    <div class="text-pre-wrap">{{ props.row.job }}</div>
                  </q-td>

                  <q-td key="phone" :props="props">
                    <div class="text-pre-wrap">{{ props.row.phone }}</div>
                  </q-td>

                  <q-td key="btn" :props="props">
                    <!-- <q-btn style = "margin-left:5px" color="primary" dense @click="jumpToNext(props.row)">进入</q-btn> -->
                    <!-- <q-btn style="margin-left:5px" color="primary" dense @click="showInfo(props.row)">查看详情</q-btn> -->
                    <q-btn
                      style="margin-left:5px"
                      color="primary"
                      dense
                      @click="showUpdate(props.row)"
                      >修改</q-btn
                    >
                    <q-btn
                      style="margin-left:5px"
                      color="warning"
                      dense
                      @click="showDlt(props.row)"
                      >删除</q-btn
                    >
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </template>
        </q-splitter>
      </div>
    </q-card>

    <!-- 删除 -->
    <q-dialog v-model="dltShow">
      <q-card style="width: 300px">
        <q-card-section class="bg-red text-white">
          <div class="text-h6">删除小贴士</div>
        </q-card-section>
        <q-card-section>
          您确认删除<br />
          名称：{{ dltRow.username }}<br />
          的用户信息吗？
          <!-- 发布对象学校：{{dltRow.collegeNames}}<br/>的计划吗? -->
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="确定" @click="deleteRow()" v-close-popup />
          <q-btn flat label="取消" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- 删除节点 -->
    <q-dialog v-model="dltNodeShow">
      <q-card style="width: 300px">
        <q-card-section class="bg-red text-white">
          <div class="text-h6">删除小贴士</div>
        </q-card-section>
        <q-card-section>
          您确认删除<br />
          节点名称：<q-chip>{{ dltNodeRow.nodeName }}</q-chip
          ><br />
          的节点信息吗？
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="确定" @click="deleteNodeRow()" v-close-popup />
          <q-btn flat label="取消" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- 移动节点 -->
    <q-dialog v-model="MoveShow">
      <q-card style="width: 300px">
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">小贴士</div>
        </q-card-section>
        <q-card-section>
          您确认为将 <q-chip>{{ this.item.nodeName }}</q-chip> 移动到
          <q-chip>{{ this.target.nodeName }}</q-chip> 下吗？
          <!-- 您确认为该{{this.selected.length}}位学生取消其新宿舍资格吗? -->
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="确定" @click="moveNode()" v-close-popup />
          <q-btn flat label="取消" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="updateShow">
      <q-card style="width:60%; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title class="text-center"
            ><span class="text-weight-bold">修改所属信息</span></q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <div class="row justify-center q-gutter-x-md">
            <div class="col-md-10 q-gutter-y-md">
              <!-- <q-input outlined v-model="info.department" label="所属单位" /> -->
              <q-select
                outlined
                v-model="info.department"
                :options="departments"
                label="所属单位"
              />
              <q-select
                outlined
                v-model="info.depart"
                :options="departs"
                label="所属校区"
                v-if="departs.length > 0"
              />
            </div>
          </div>

          <div class="row justify-center" style="margin-top:15px">
            <q-btn
              label="确认"
              @click="changeDepartment"
              color="primary"
            ></q-btn>
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

    <q-dialog v-model="infofShow">
      <q-card style="width:60%; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title class="text-center"
            ><span class="text-weight-bold"
              >{{ this.infof.fnodeName }}详情信息</span
            >
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <div class="row justify-center q-gutter-x-md">
            <div class="col-md-8 q-gutter-y-md">
              <q-input
                outlined
                v-model="infof.fnodeName"
                label="节点名称"
                readonly
              />
              <q-input
                outlined
                v-model="infof.ftype"
                label="节点类型"
                readonly
              />
              <!-- <q-input outlined v-model="info.nodeName" label="子节点名称" readonly/>
        <q-input outlined v-model="info.type" label="子节点类型" readonly/> -->
            </div>
          </div>
          <div class="row justify-center q-gutter-x-md">
            <div class="col-md-8 q-gutter-y-md" v-if="infof.ftype == '学校'">
              <q-input
                outlined
                v-model="locationInfo.a"
                label="地址"
                readonly
              />
              <q-input
                outlined
                v-model="locationInfo.b"
                label="联系方式"
                readonly
              />
              <q-input
                outlined
                v-model="locationInfo.c"
                label="邮编"
                readonly
              />
            </div>
            <div class="col-md-8 q-gutter-y-md" v-if="infof.ftype == '校区'">
              <q-input
                outlined
                v-model="locationInfo.a"
                label="地址"
                readonly
              />
              <q-input
                outlined
                v-model="locationInfo.b"
                label="联系人"
                readonly
              />
              <q-input
                outlined
                v-model="locationInfo.c"
                label="联系方式"
                readonly
              />
              <!-- <q-input outlined v-model="locationInfo.c" label="邮编" readonly/> -->
            </div>
            <div class="col-md-8 q-gutter-y-md" v-if="infof.ftype == '楼宇'">
              <q-input
                outlined
                v-model="locationInfo.a"
                label="是否为高楼"
                readonly
              />
              <q-input
                outlined
                v-model="locationInfo.b"
                label="管理员姓名"
                readonly
              />
            </div>
            <div class="col-md-8 q-gutter-y-md" v-if="infof.ftype == '设备'">
              <q-input
                outlined
                v-model="locationInfo.a"
                label="设备状态"
                readonly
              />
              <q-input
                outlined
                v-model="locationInfo.b"
                label="开关状态"
                readonly
              />
            </div>
          </div>
          <div class="row justify-center" style="margin-top:15px">
            <!-- <q-btn label = "确认" @click="addDorm" color="primary" ></q-btn> -->
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

    <q-dialog v-model="addShow">
      <q-card style="width:60%; max-width: 80vw;">
        <q-toolbar>
          <q-toolbar-title class="text-center"
            ><span class="text-weight-bold">新增{{ addInfo.type }}信息</span>
          </q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <div class="row justify-center q-gutter-x-md">
            <div class="col-md-10 q-gutter-y-md"></div>
          </div>
          <div class="row justify-center q-gutter-x-md">
            <div class="col-md-10" q-gutter-y-md>
              <div class="col-md-8 q-gutter-y-md" v-if="addInfo.type == '学校'">
                <q-input
                  outlined
                  v-model="addInfo.locationName"
                  label="学校名称"
                />
              </div>
              <div class="col-md-8 q-gutter-y-md" v-if="addInfo.type == '校区'">
                <q-input
                  outlined
                  v-model="addInfo.locationName"
                  label="校区名称"
                />
                <q-select
                  class="in"
                  outlined
                  v-model="addInfo.parentName"
                  :options="colleges"
                  use-input
                  input-debounce="0"
                  @filter="filterCollege"
                  label="请输入高校名称"
                  ><template v-slot:append>
                    <!-- <q-icon name="search" /> -->
                    <q-btn push color="primary" @click="search"
                      >查询一下</q-btn
                    > </template
                  ><template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        未查询到相关高校
                      </q-item-section>
                    </q-item>
                  </template></q-select
                >
                <!-- <q-input outlined v-model="addInfo.parentName" label="所属学校名称" /> -->
              </div>
            </div>
          </div>
          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="确认" @click="addLocation" color="primary"></q-btn>
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
  </div>
</template>

<script>
import {
  getLocationTree,
  getLocationById,
  addLocation,
  addCampus,
  addArea,
  addBuilding,
  changeArea,
  changeBuilding,
  moveNode,
  getAreas,
  getColleges,
  getCampuses,
  changeCollege,
  changeCampus,
  deleteCollegeById,
  getAreasByCampus,
  addDorm,
  getBuildingsByAreaId,
  addChildNode,
  addFatherNode,
  deleteNodeById,
  getIfHaveChildren,
  getChildrenByKey,
  getInfoById,
  getRoles,
  deleteUserById,
  getUserDepartment,
  getDepartments,
  getDepartByMent,
  changeDepartment,
  getCollegesBySearch
} from "../../api/data";
// import {
//   getLocationTree, getStuffByName, getRbacRoles, addDptManager, getOrgs,
//   addProjectRole, addUser, getUserPageByRoleId, removeUserRoleByOid, getStudentByName
// } from '../api/rbac'
// import { teacherOrgs, groupOrgs } from '../../apis/datapc'
// import { setTimeout } from 'timers'

export default {
  data() {
    return {
      departs: [],
      isShow: false,
      // types: ['学校', '校区', '区域', '楼宇', '楼层', '房间', '设备', '功能'],
      departments: [],
      types: ["学校", "校区"],
      OpUserRole: {
        uuid: "",
        username: ""
      },
      colleges: [],
      disable: false,
      stuffList: [],
      studentList: [],
      campusInfo: {
        collegeInfo: {
          label: "",
          value: ""
        },
        name: "",
        address: "",
        postCode: "",
        phone: ""
      },
      org: {
        level: "",
        type: "",
        pname: "",
        pid: "",
        nodeCode: "",
        nodeName: ""
        // type: ''
      },
      role: {
        value: "",
        label: ""
      },
      stuffInfo: {
        value: "",
        label: ""
      },
      studentInfo: {
        value: "",
        label: ""
      },
      dltRow: {},
      dltCode: "",
      filter: {
        type: "",
        id: "",
        pcode: "",
        roleId: "",
        oid: "",
        name: "",
        role: ""
      },
      roles: [],
      // org: {},
      addCampusShow: false,
      showAddLocation: false,
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
        sortBy: "name",
        descending: false,
        page: 1,
        rowsPerPage: 8,
        rowsNumber: 15
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "学校名称",
          align: "center",
          field: "name",
          sortable: true
        },
        {
          name: "address",
          required: true,
          label: "地址",
          align: "center",
          field: "address"
        },
        {
          name: "postCode",
          required: true,
          label: "邮编",
          align: "center",
          field: "postCode"
        },
        {
          name: "phone",
          required: true,
          label: "联系电话",
          align: "center",
          field: "phone"
        },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "center",
          field: "btn"
        }
      ],

      nodeColumns: [
        {
          name: "userId",
          required: true,
          label: "登录号",
          align: "center",
          field: "userId",
          sortable: true
        },
        {
          name: "username",
          required: true,
          label: "姓名",
          align: "center",
          field: "username"
        },
        // {
        //   name: "role",
        //   required: true,
        //   label: "角色",
        //   align: "center",
        //   field: "role",
        // },
        {
          name: "job",
          required: true,
          label: "职务",
          align: "center",
          field: "job"
        },
        {
          name: "phone",
          required: true,
          label: "手机号",
          align: "center",
          field: "phone"
        },
        // { name: 'phone', required: true, label: '联系电话', align: 'center', field: 'phone' },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "center",
          field: "btn"
        }
      ],
      campusColumns: [
        {
          name: "collegeName",
          required: true,
          label: "学校名称",
          align: "center",
          field: "collegeName",
          sortable: true
        },
        {
          name: "name",
          required: true,
          label: "校区名称",
          align: "center",
          field: "name",
          sortable: true
        },
        {
          name: "address",
          required: true,
          label: "地址",
          align: "center",
          field: "address"
        },
        // { name: 'postCode', required: true, label: '邮编', align: 'center', field: 'postCode' },
        {
          name: "telPhone",
          required: true,
          label: "联系电话",
          align: "center",
          field: "telPhone"
        },
        {
          name: "telPerson",
          required: true,
          label: "联系人",
          align: "center",
          field: "telPerson"
        },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "center",
          field: "btn"
        }
      ],
      areaColumns: [
        {
          name: "name",
          required: true,
          label: "区域名称",
          align: "center",
          field: "name",
          sortable: true
        },
        {
          name: "campusName",
          required: true,
          label: "所属校区",
          align: "center",
          field: "campusName"
        },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "center",
          field: "btn"
        }
      ],
      buildingColumns: [
        {
          name: "name",
          required: true,
          label: "楼宇名称",
          align: "center",
          field: "name",
          sortable: true
        },
        {
          name: "areaName",
          required: true,
          label: "所属区域",
          align: "center",
          field: "areaName"
        },
        {
          name: "zoneAdminName",
          required: true,
          label: "楼宇管理员",
          align: "center",
          field: "zoneAdminName"
        },
        {
          name: "isHeight",
          required: true,
          label: "高楼/非高楼",
          align: "center",
          field: "isHeight"
        },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "center",
          field: "btn"
        }
      ],
      dormColumns: [
        {
          name: "buildingName",
          required: true,
          label: "楼宇名称",
          align: "center",
          field: "buildingName",
          sortable: true
        },
        {
          name: "dormName",
          required: true,
          label: "房间名称",
          align: "center",
          field: "dormName"
        },
        {
          name: "floorName",
          required: true,
          label: "楼层",
          align: "center",
          field: "floorName"
        },
        // { name: 'bedList', required: true, label: '床位信息', align: 'center', field: 'bedList' },
        // { name: 'isHeight', required: true, label: '高楼/非高楼', align: 'center', field: 'isHeight' },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "center",
          field: "btn"
        }
      ],
      deviceColumns: [
        {
          name: "deviceName",
          required: true,
          label: "设备名称",
          align: "center",
          field: "deviceName",
          sortable: true
        },
        {
          name: "dormName",
          required: true,
          label: "房间名称",
          align: "center",
          field: "dormName"
        },
        {
          name: "buildingName",
          required: true,
          label: "楼宇名称",
          align: "center",
          field: "buildingName"
        },
        {
          name: "areaName",
          required: true,
          label: "区域名称",
          align: "center",
          field: "areaName"
        },
        {
          name: "campusName",
          required: true,
          label: "校区名称",
          align: "center",
          field: "campusName"
        },
        {
          name: "collegeName",
          required: true,
          label: "学校名称",
          align: "center",
          field: "collegeName"
        },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "center",
          field: "btn"
        }
      ],
      data: [],
      roles: [],
      selectNode: {},
      props: [],
      orgs: [],
      selectedTree: {},
      MoveShow: false,
      dltShow: false,
      changeShowCollege: false,
      changeRowCollege: {},
      dltShowCollege: false,
      dltRowCollege: {},
      changeCampusShow: false,
      changeCampusRow: {},
      addAreaShow: false,
      changeAreaShow: false,
      changeAreaRow: {
        campus: {
          label: "",
          value: ""
        }
      },
      areaInfo: {},
      campuses: [],
      filterLocation: {
        name: ""
      },
      areas: [],
      isHeights: [
        {
          label: "高楼",
          value: 1
        },
        {
          label: "非高楼",
          value: 0
        }
      ],
      buildingInfo: {},
      addBuildingShow: false,
      changeBuildingShow: false,
      changeBuildingRow: {},
      dormInfo: {},
      addDormShow: false,
      changeDormShow: false,
      changeDormRow: {},
      buildings: [],
      floors: [
        "00层",
        "01层",
        "02层",
        "03层",
        "04层",
        "05层",
        "06层",
        "07层",
        "08层",
        "09层",
        "10层",
        "11层",
        "12层",
        "13层",
        "14层",
        "15层"
      ],
      addChildNodeInfo: {},
      addChildNodeShow: false,
      addShow: false,
      addInfo: {
        type: "",
        name: "",
        locationName: "",
        parentName: ""
      },

      addFatherNodeInfo: {},
      addFatherNodeShow: false,
      dltNodeShow: false,
      isShow2: false,
      dltNodeRow: {},
      item: {},
      target: {},
      ticked: [],
      expanded: [],
      tickStrategy: "none",
      ifHaveChildren: false,
      updateShow: false,
      infoShow: false,
      infofShow: false,
      infocShow: false,
      info: {
        userId: "",
        department: "",
        depart: "",
        nodeName: "",
        type: "",
        fnodeName: "",
        ftype: "",
        id: ""
      },
      infof: {
        nodeName: "",
        type: "",
        fnodeName: "",
        ftype: "",
        id: ""
      },
      infoc: {
        nodeName: "",
        type: "",
        fnodeName: "",
        ftype: "",
        id: ""
      },
      locationInfo: {
        a: "",
        b: "",
        c: "",
        fa: "",
        fb: "",
        fc: ""
      },
      locationInfo2: {
        a: "",
        b: "",
        c: "",
        fa: "",
        fb: "",
        fc: ""
      }
    };
  },
  methods: {
    filterCollege(val, update, abort) {
      if (val.length < 2) {
        return;
      }
      update(() => {
        this.getCollegesBySearch(val);
      });
    },
    getCollegesBySearch(val) {
      getCollegesBySearch(val).then(res => {
        this.colleges.splice(0, this.colleges.length);
        if (res.data.length > 0) {
          res.data.forEach(element => {
            this.colleges.push(element.name);
          });
        }
      });
    },
    changeDepartment() {
      changeDepartment(this.info).then(res => {
        res.data.suc === true
          ? (this.updateShow = false)
          : (this.updateShow = true);
        this.getOptResult(res);
        setTimeout(() => {
          this.getLocationById();
        }, 500);
      });
    },
    query() {
      this.getLocationTree();
    },
    showAdd(row) {
      this.addInfo = {};
      this.addShow = true;
      this.addInfo.type = row;
    },
    showUpdate(row) {
      // this.info = {};
      console.log(row);
      this.updateShow = true;
      // this.info = row;
      // this.info.department = row.department
      this.info.userId = row.userId;
      console.log("row.userId" + row.userId);
      this.getUserDepartment(row.userId);
      this.getDepartments();
      console.log("info" + this.info.department);
    },
    getDepartments() {
      getDepartments().then(res => {
        this.departments.splice(0, this.departments.length);
        if (res.data.length > 0) {
          res.data.forEach(element => {
            this.departments.push(element.nodeName);
          });
        }
      });
    },
    getUserDepartment(userId) {
      getUserDepartment(userId).then(res => {
        this.info.department = res.data.pl;
        this.info.depart = res.data.l;
      });
    },
    showfInfo(row) {
      this.infoc = {};
      this.infof = {};
      this.infofShow = true;
      this.infof = row;
      console.log("row.pid" + row.pid);
      this.getInfoById(row.pid, -1);
    },
    showcInfo(row) {
      this.infoc = {};
      this.infof = {};
      this.infocShow = true;
      this.infoc = row;
      console.log("row.id" + row.id);
      this.getInfoById(row.id, -1);
    },
    getInfoById2(id, pid) {
      this.locationInfo2 = {};
      getInfoById(id, pid).then(res => {
        this.locationInfo2 = res.data;
      });
    },
    getInfoById(id, pid) {
      this.locationInfo = {};
      getInfoById(id, pid).then(res => {
        this.locationInfo = res.data;
        if (this.infof.ftype === "楼宇" || this.infoc.type === "楼宇") {
          if (this.locationInfo.a === 1) {
            this.locationInfo.a = "高楼";
          } else if (this.locationInfo.a === 0) {
            this.locationInfo.a = "非高楼";
          }
        } else if (this.infof.ftype === "设备" || this.infoc.type === "设备") {
          if (this.locationInfo.a === 1) {
            this.locationInfo.a = "异常";
          } else if (this.locationInfo.a === 0) {
            this.locationInfo.a = "正常";
          }
          if (this.locationInfo.b === 1) {
            this.locationInfo.b = "关";
          } else if (this.locationInfo.b === 0) {
            this.locationInfo.b = "开";
          }
        }
      });
    },
    onLazyLoad({ node, key, done, fail }) {
      // call fail() if any error occurs

      // simulate loading and setting an empty node

      // console.log('node.nodeName' + node.nodeName)
      // console.log('key' + key)

      // 获取子节点
      // const label = node.nodeName
      var children;
      console.log("c" + children);
      children = getChildrenByKey(key);
      console.log(key + "children" + children);
      // console.log(children[1])
      children = children.then(res => {
        console.log(res.data);
        // return res.data
        done(res.data.children);
      });
      // console.log('super' + children)
      // done(children)
      // done(this.getChildrenByKey(key))
      // done([
      //   { nodeName: `${label}.1` },
      //   { nodeName: `${label}.2`, lazy: true },
      //   {
      //     nodeName: `${label}.3`,
      //     children: [
      //       { nodeName: `${label}.3.1`, lazy: true },
      //       { nodeName: `${label}.3.2`, lazy: true }
      //     ]
      //   }
      // ])
    },
    getChildrenByKey(key) {
      getChildrenByKey(key).then(res => {
        // console.log('data' + res.data)
        return res.data;
      });
    },
    getIfHaveChildren(id) {
      getIfHaveChildren(id).then(res => {
        console.log("flag:" + res.data);
        // return res.data
        return res.data;
      });
    },
    clickIsShow() {
      this.isShow = !this.isShow;
      if (this.tickStrategy === "strict") {
        this.tickStrategy = "none";
      } else {
        this.tickStrategy = "strict";
      }
      console.log(this.tickStrategy);
    },
    moveNode() {
      moveNode(this.item.id, this.target.id).then(res => {
        this.MoveShow = false;
        this.getOptResult(res);
        setTimeout(() => {
          this.getLocationTree();
        }, 200);
      });
    },
    drop(ev, item, row) {
      ev.preventDefault();
      console.log("123" + row.nodeName + item.nodeName);
      this.target = row;
      this.MoveShow = true;
      // this.bedList = row.bedList
      // this.filter2.dormId = row.dormId

      // this.getBedPageByDormId()
      // this.buildingDormName = row.buildingName + row.dormName
      // this.moveIntoShow = true

      // let treeNode = ev.target
      // if(treeNode){
      //   treeNode.appendChild(this.dom)
      // }
    },
    allowDrop(ev) {
      // 允许拖拉放下
      ev.preventDefault();
    },
    drag(ev, item) {
      this.dom = ev.currentTarget.cloneNode(true);
      this.item = item;
    },
    deleteNodeRow() {
      deleteNodeById(this.dltNodeRow.id).then(res => {
        this.getOptResult(res);
        // res.data.suc === true ? this.addChildNodeShow = false : this.addChildNodeShow = true
        setTimeout(() => {
          this.getLocationTree();
        }, 200);
      });
    },
    showNodeDlt(row) {
      console.log("999" + row);
      this.dltNodeShow = true;
      this.dltNodeRow = row;
    },
    addChildNode() {
      addChildNode(this.addChildNodeInfo).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.addChildNodeShow = false)
          : (this.addChildNodeShow = true);
        setTimeout(() => {
          this.getLocationTree();
        }, 200);
      });
    },
    addFatherNode() {
      addFatherNode(this.addFatherNodeInfo).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.addFatherNodeShow = false)
          : (this.addFatherNodeShow = true);
        setTimeout(() => {
          this.getLocationTree();
        }, 200);
      });
    },
    showChildNodeAdd(row) {
      console.log("row" + row.nodeName + row.id);
      this.addChildNodeInfo = row;
      this.addChildNodeShow = true;
    },
    showFatherNodeAdd(row) {
      this.addFatherNodeInfo = row;
      this.addFatherNodeShow = true;
    },
    filterBuildingsByArea(val, update) {
      this.buildings.splice(0, this.buildings.length);
      if (this.dormInfo.campus != null) {
        update(() => {
          getBuildingsByAreaId(this.dormInfo).then(res => {
            this.buildings.splice(0, this.buildings.length);
            this.buildings = res.data;
          });
        });
      }
    },
    addDorm() {
      addDorm(this.dormInfo).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.addDormShow = false)
          : (this.addDormShow = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    filterAreasByCampus(val, update) {
      // console.log('111')
      this.areas.splice(0, this.areas.length);
      if (this.buildingInfo.campus != null) {
        update(() => {
          getAreasByCampus(this.buildingInfo).then(res => {
            this.areas.splice(0, this.areas.length);
            this.areas = res.data;
          });
        });
      }
      if (this.changeBuildingRow.campus != null) {
        update(() => {
          getAreasByCampus(this.changeBuildingRow).then(res => {
            this.areas.splice(0, this.areas.length);
            this.areas = res.data;
          });
        });
      }
      if (this.dormInfo.campus != null) {
        update(() => {
          getAreasByCampus(this.dormInfo).then(res => {
            this.areas.splice(0, this.areas.length);
            this.areas = res.data;
          });
        });
      }
      if (this.changeDormRow.campus != null) {
        update(() => {
          getAreasByCampus(this.changeDormRow).then(res => {
            this.areas.splice(0, this.areas.length);
            this.areas = res.data;
          });
        });
      }
    },
    showChangeCollege(item) {
      this.changeShowCollege = true;
      this.changeRowCollege = item;
    },
    showdltCollege(item) {
      this.dltShowCollege = true;
      this.dltRowCollege = item;
    },
    changeCollege() {
      changeCollege(this.changeRowCollege).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.changeShowCollege = false)
          : (this.changeShowCollege = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    changeBuilding() {
      changeBuilding(this.changeBuildingRow).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.changeBuildingShow = false)
          : (this.changeBuildingShow = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    search() {
      if (this.addInfo.parentName) {
        // this.showContent = true;
      } else {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "mood_bad",
          message: "请输入正确的学校名称后进行查询"
        });
      }
    },
    // changeDorm () {
    //   changeDorm(this.changeDormRow).then(res => {
    //     this.getOptResult(res)
    //     res.data.suc === true ? this.changeDormShow = false : this.changeDormShow = true
    //     setTimeout(() => {
    //       this.getLocationById()
    //     }, 200)
    //   })
    // },
    deleteRowCollege() {
      deleteCollegeById(this.dltRowCollege.id).then(res => {
        this.getOptResult(res);
        this.getLocationById();
      });
    },
    deleteRow() {
      deleteUserById(this.dltRow.id).then(res => {
        this.getOptResult(res);
        this.getLocationById();
      });
    },
    addCampus() {
      addCampus(this.campusInfo).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.addCampusShow = false)
          : (this.addCampusShow = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    addBuilding() {
      addBuilding(this.buildingInfo).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.addBuildingShow = false)
          : (this.addBuildingShow = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    changeCampus() {
      changeCampus(this.changeCampusRow).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.changeCampusShow = false)
          : (this.changeCampusShow = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    addArea() {
      addArea(this.areaInfo).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.addAreaShow = false)
          : (this.addAreaShow = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    changeArea() {
      changeArea(this.changeAreaRow).then(res => {
        this.getOptResult(res);
        res.data.suc === true
          ? (this.changeAreaShow = false)
          : (this.changeAreaShow = true);
        setTimeout(() => {
          this.getLocationById();
        }, 200);
      });
    },
    getCampuses() {
      getCampuses().then(res => {
        this.campuses.splice(0, this.campuses.length);
        this.campuses = res.data;
      });
    },
    showChange(row) {
      if (this.filter.id == null) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "mood_bad",
          message: "请在左侧机构树中选择一个区域"
        });
        return false;
      }

      console.log("dlt" + this.filter.type + this.filter.id);
      if (this.filter.type === "校区") {
        this.changeCampusRow = row;
        this.changeCampusShow = true;
      }
      if (this.filter.type === "区域") {
        this.campuses.splice(0, this.campuses.length);
        this.getCampuses();
        this.changeAreaRow = row;
        this.changeAreaShow = true;
      }
      if (this.filter.type === "楼宇") {
        this.campuses.splice(0, this.campuses.length);
        this.getCampuses();
        this.changeBuildingRow = row;
        if (this.changeBuildingRow.isHeight === 0) {
          this.changeBuildingRow.isHeight = {
            label: "非高楼",
            value: 0
          };
        } else {
          this.changeBuildingRow.isHeight = {
            label: "高楼",
            value: 1
          };
        }
        this.changeBuildingShow = true;
      }
      if (this.filter.type === "房间") {
        this.campuses.splice(0, this.campuses.length);
        this.getCampuses();
        this.changeDormRow = row;
        this.changeDormShow = true;
      }
    },
    jumpToNext(item) {},
    showDlt(row) {
      if (this.filter.id == null) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "mood_bad",
          message: "请在左侧机构树中选择一个区域"
        });
        return false;
      }

      console.log("dlt" + this.filter.type + this.filter.id);
      this.dltRow = row;
      this.dltShow = true;
      if (this.filter.type === "房间") {
        this.dltRow.name = row.dormName;
      }
    },
    // deleteUserRole () {
    //   if (this.filter.oid === '') {
    //     this.$q.notify({
    //       position: 'top',
    //       color: 'red-5',
    //       textColor: 'white',
    //       icon: 'fas fa-exclamation-triangle',
    //       message: '请在左侧机构树中选择一个角色'
    //     })
    //     return false
    //   }
    //   removeUserRoleByOid(this.filter, this.OpUserRole.uuid).then(res => {
    //     this.getOptResult(res)
    //     res.data.suc === true ? this.showDltUser = false : this.showDltUser = true
    //     this.getUserPageByRoleId()
    //   })
    // },
    onRequest(props) {
      const { page, rowsPerPage, descending } = props.pagination;
      this.loading = true;
      // don't forget to update local pagination object
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.descending = descending;
      this.getLocationById();
      this.loading = false;
    },
    // addProjectRole () {
    //   addProjectRole(this.org, this.role).then(res => {
    //     this.getOptResult(res)
    //     res.data.suc === true ? this.showRole = false : this.showRole = true
    //     this.getLocationTree()
    //     this.$refs.orgTree.setExpanded(this.org.pid, true)
    //   })
    // },
    showVolunteerAdd(node) {
      if (
        node == null ||
        node.level == null ||
        node.level === undefined ||
        node.type !== "角色"
      ) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "fas fa-exclamation-triangle",
          message: "请在左侧机构树中选择一个角色"
        });
        return false;
      }
      this.showVolunteer = true;
      this.studentList.splice(0, this.studentList.length);
      this.studentInfo.value = "";
      this.studentInfo.label = "";
    },
    showLocationAdd(node) {
      if (this.filter.id == null) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "mood_bad",
          message: "请在左侧机构树中选择一个区域"
        });
        return false;
      }

      console.log("888" + this.filter.type + this.filter.id);
      if (this.filter.type === "校区") {
        this.colleges.splice(0, this.colleges.length);
        this.getColleges();
        this.campusInfo = {};
        this.addCampusShow = true;
      }
      if (this.filter.type === "区域") {
        this.colleges.splice(0, this.colleges.length);
        this.campuses.splice(0, this.campuses.length);
        this.getCampuses();
        this.getColleges();
        this.areaInfo = {};
        this.addAreaShow = true;
      }
      if (this.filter.type === "楼宇") {
        // this.colleges.splice(0, this.colleges.length)
        this.campuses.splice(0, this.campuses.length);
        this.getCampuses();
        this.getColleges();
        this.buildingInfo = {};
        this.addBuildingShow = true;
      }
      if (this.filter.type === "房间") {
        // this.colleges.splice(0, this.colleges.length)
        this.campuses.splice(0, this.campuses.length);
        this.getCampuses();
        this.dormInfo = {};
        this.addDormShow = true;
      }
    },

    getAreas() {
      getAreas().then(res => {
        this.areas.splice(0, this.areas.length);
        this.areas = res.data;
      });
    },

    getColleges() {
      getColleges().then(res => {
        this.colleges.splice(0, this.colleges.length);
        this.colleges = res.data;
      });
    },
    showGroupUserAdd(node) {
      this.org = "";
      if (
        node == null ||
        node.level == null ||
        node.level === undefined ||
        node.type !== "角色"
      ) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "fas fa-exclamation-triangle",
          message: "请在左侧机构树中选择一个角色"
        });
        return false;
      }
      this.showAddDptUser = true;
      // groupOrgs().then(res => {
      //   this.orgs = res.data
      // })
      this.stuffList.splice(0, this.stuffList.length);
      this.stuffInfo.value = "";
      this.stuffInfo.label = "";
    },

    showTeacherUserAdd(node) {
      this.org = "";
      if (
        node == null ||
        node.level == null ||
        node.level === undefined ||
        node.type !== "角色"
      ) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "fas fa-exclamation-triangle",
          message: "请在左侧机构树中选择一个角色"
        });
        return false;
      }
      this.showAddDptUser = true;
      // teacherOrgs().then(res => {
      //   this.orgs = res.data
      // })
      this.stuffList.splice(0, this.stuffList.length);
      this.stuffInfo.value = "";
      this.stuffInfo.label = "";
    },
    showOrgAdd() {
      const node = this.selectNode;
      this.org.nodeCode = "";
      this.org.nodeName = "";
      if (node == null || node.level == null || node.level === undefined) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "fas fa-exclamation-triangle",
          message: "父节点不能为空，请在人员树中选择您要添加节点的父节点"
        });
        return false;
      }
      if (node.level > 4) {
        this.$q.notify({
          position: "top",
          color: "red-5",
          textColor: "white",
          icon: "fas fa-exclamation-triangle",
          message: "已超出项目结构树层级限制，无法再添加子节点"
        });
        return false;
      } else {
        this.showRole = true;
        this.org.level = node.level + 1;
        this.org.pid = node.id;
        this.org.pname = node.nodeName;
        this.org.type = "角色";
      }
    },
    getSelectedNode(target) {
      if (target != null) {
        this.selectNode = this.$refs.orgTree.getNodeByKey(target);
      }
      this.filter.pid = "";
      // this.filter.roleId = ''
      if (this.selectNode != null) {
        this.filter.id = this.selectNode.id;
        this.filter.type = this.selectNode.type;
        // this.filter.name = this.selectNode.nodeName
      }
      console.log("666" + this.selectNode.id + this.selectNode.type);
      // this.getUserPageByRoleId()
      this.getLocationById();
    },
    addLocation() {
      addLocation(this.addInfo).then(res => {
        console.log("777" + this.filter.id + this.filter.type);
        this.getOptResult(res);
        res.data.suc === true ? (this.addShow = false) : (this.addShow = true);
        setTimeout(() => {
          this.getLocationTree();
        }, 200);
      });
    },
    getLocationById() {
      getLocationById(this.pagination, this.filter).then(res => {
        this.data = res.data.records;
        this.pagination.rowsNumber = res.data.total;
      });
    },
    // getUserPageByRoleId () {
    //   getUserPageByRoleId(this.pagination, this.filter).then(res => {
    //     this.data = res.data.records
    //     this.pagination.rowsNumber = res.data.total
    //   })
    // },
    reset() {
      this.filter.name = "";
      this.filter.role = "";
      this.filterLocation.name = "";
      this.getLocationById();
      this.getLocationTree();
    },
    getLocationTree() {
      getLocationTree(this.filterLocation).then(res => {
        if (res.data == null) {
          this.props.splice(0, this.props.length);
        } else {
          this.props.splice(0, this.props.length);
          this.props.push(res.data);
        }
      });
    },
    // getRbacRoles () {
    //   this.roles.splice(0, this.roles.length)
    //   getRbacRoles().then(res => {
    //     res.data.forEach(item => {
    //       this.roles.push({ value: item.id, label: item.name })
    //     })
    //   })
    // },
    getDepartByMent(val) {
      getDepartByMent(val).then(res => {
        this.departs.splice(0, this.departs.length);
        if (res.data.length > 0) {
          res.data.forEach(element => {
            this.departs.push(element.nodeName);
          });
        } else {
          this.info.depart = "";
        }
      });
    },
    getOptResult(res) {
      if (res.data.suc === true) {
        this.$q.notify({
          position: "top",
          color: "green-4",
          textColor: "white",
          icon: "mood",
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
    getRoles() {
      getRoles().then(res => {
        this.roles = res.data;
      });
    }
    // filterStuff (val, update) {
    //   if (val.length < 2) {
    //     return
    //   }
    //   update(() => {
    //     getStuffByName(val).then(res => {
    //       this.stuffList = res.data
    //     })
    //   })
    // },
    // filterStudent (val, update) {
    //   if (val.length < 2) {
    //     return
    //   }
    //   update(() => {
    //     getStudentByName(val).then(res => {
    //       this.studentList = res.data
    //     })
    //   })
    // }
  },
  computed: {
    watchIsShow() {
      return this.isShow;
    }
  },
  watch: {
    "info.department": {
      handler: function(newVal, oldVal) {
        console.log("newVal" + newVal);
        console.log("oldVal" + oldVal);
        //do something
        this.getDepartByMent(newVal);
      }
    },
    isShow(val) {
      console.log("789" + val);
      if (!val) {
        this.tickStrategy = "none";
      } else {
        this.tickStrategy = "strict";
      }
    }
  },
  mounted() {
    getLocationTree(this.filterLocation).then(res => {
      this.props.splice(0, this.props.length);
      this.props.push(res.data);
      for (var i = 1; i < 100; i++) {
        const node = this.$refs.orgTree.getNodeByKey(i);
        // console.log('node.level:' + node.level)
        if (node && node.level < 3) {
          this.$refs.orgTree.setExpanded(i, true);
        }
      }
    });
    // this.getRbacRoles()
    this.getLocationById();
    this.getRoles();
  }
};
</script>
