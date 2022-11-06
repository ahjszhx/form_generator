<template>
  <div>
    <tableCard>
      <!-- 表格标题 -->
      <template v-slot:top>
        <div style="justify-content:flex-start">
          <q-btn color="primary" @click="showWhiteMenu">查看白名单接口</q-btn>
          <div style="margin-top: 1.2rem">访问IP白名单</div>
        </div>
      </template>

<!--      <template v-slot:left >-->
<!--        <div class="q-pa-md row q-col-gutter-sm">-->
<!--          <q-tree ref="orgTree" :nodes="props" accordion selected-color="red-5" :selected.sync="selectedTree"-->
<!--                  node-key="id" label-key="nodeName" @update:selected="getSelectedNode" @lazy-load="onLazyLoad">-->
<!--            <template v-slot:default-header="prop">-->
<!--              <div class="row items-center" draggable="true" @dragstart="drag($event, prop.node)"-->
<!--                   @drop="drop($event, item, prop.node)" @dragover="allowDrop($event)">-->
<!--                &lt;!&ndash; <div>{{prop.node.icon}}</div> &ndash;&gt;-->
<!--                <q-icon :name="-->
<!--                        'img:' +-->
<!--                          require(`../../statics/icons/icon_${prop.node.icon}.png`)-->
<!--                      " color="orange" size="20px" class="q-mr-sm" />-->
<!--                &lt;!&ndash; <img :src="`/statics/icons/icon_${prop.node.icon}.png`"/> &ndash;&gt;-->
<!--                &lt;!&ndash; <img src="../../statics/icons/icon_school.png" syle/> &ndash;&gt;-->
<!--                <div class="text-weight-bold">{{ prop.node.nodeName }}</div>-->
<!--                <div class="text-weight-bold" v-if="isShow2">-->
<!--                  <q-chip>{{ prop.node.type }}</q-chip>-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
<!--          </q-tree>-->
<!--        </div>-->
<!--      </template>-->

      <!-- 表格筛选块 -->
      <template v-slot:filter>
        <q-input outlined  dense v-model="filter.ip" label="IP地址" />
        <q-btn color="primary" @click="search" icon="search">查询</q-btn>
        <q-btn color="primary" @click="rest" icon="refresh">重置</q-btn>
        <q-btn color="primary" @click="addIPs">添加白名单IP地址</q-btn>
      </template>

      <!-- 表格内容块 -->
      <template v-slot:table>
        <q-table
          :data="data"
          :columns="columns"
          row-key="id"
          @request="onRequest"
          rows-per-page-label="每页行数"
          :pagination.sync="pagination"
          :no-data-label="'没有数据'"
          class="right-sticky"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="ip" :props="props">
                {{ props.row.ip }}
              </q-td>
<!--              <q-td key="locationname" :props="props">-->
<!--                {{ props.row.locationname }}-->
<!--              </q-td>-->
              <q-td key="operation" :props="props" class="q-gutter-x-sm btn-col">
                <q-btn style="margin-left:5px" color="secondary" dense @click="editIp(props.row)" >编辑</q-btn>
                <q-btn style="margin-left:5px" color="negative" dense @click="delIp(props.row.id)" >删除</q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </template>
    </tableCard>

    <whiteDialog :show="ifShow"  @close="closeifShow"></whiteDialog>
    <whiteIp :show="ipShow" :selectNode="selectNode"  @close="closeipShow" :showEdit="editShow" :selectEdit="selectedEdit" :ipId="ipid"></whiteIp>
  </div>
</template>

<script>
    import {
        getLocationTree,
        getLocationRoleById,
        getCollegeByName,
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
        getAreasByCampus,
        addDorm,
        getBuildingsByAreaId,
        addChildNode,
        addFatherNode,
        deleteNodeById,
        getIfHaveChildren,
        getChildrenByKey,
        getInfoById,
        getRoleNames,
        getSystemNames,
        deleteRoleUserById,
        getUserDepartment,
        getDepartments,
        getDepartByMent,
        changeDepartment,
        getCollegesBySearch,
        getStuffByName,
        addRoleUser
    } from "../../api/data";
    import {ipPage,IPDel,ipBid} from "../../api/whitelist";
    import whiteDialog from "./components/WhiteListDialog.vue";
    import whiteIp from "./components/WhiteIpDialog.vue";
export default {
    components: {
        whiteDialog,
        whiteIp
    },
    data() {
        return {
            ipid:'',
            selectedEdit:[],
            editShow:false,
            ipShow:false,
            ifShow:false,
            roleNames: [],
            systemNames: [],
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
                ip: ''
            },
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
            depnames: [],
            columns: [
                { name: "ip", label: "IP地址", field: "ip", align: "center" },
                // { name: "locationname", label: "所处位置", field: "locationname", align: "center" },
                {
                    name: "operation",
                    label: "操作",
                    field: "operation",
                    align: "center",
                }
            ],
            data: [],
            roles: [],
            selectNode: {id:1},
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
            isHeights: [{
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
                id: '',
                username: '',
                systemName: [],
                roleName: {
                    label: '',
                    value: ''
                },
                stuffInfo: {
                    value: "",
                    label: ""
                },
                depname: {
                    value: "",
                    label: ""
                },
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
            },
            systems: []
        };
    },
    methods: {
        async editIp(row){
            let item=await ipBid(row.id);
            this.selectedEdit=item.data;
            this.ipid=row.id+'';
            this.editShow=true
        },
        delIp(id){
            this.$q
                .dialog({
                    title: "删除提醒",
                    message: '<span class="text-red">确定要删除吗?</span>',
                    cancel: {
                        flat: true,
                        label: "取消"
                    },
                    ok: {
                        label: "确定"
                    },
                    html: true
                })
                .onOk(() => {
                    //   console.log(">>>> OK");
                    IPDel(id).then(res=>{
                        if (res.data.suc) {
                            // 成功
                            this.$q.notify({
                                message: "删除成功",
                                color: "green",
                                position: "top"
                            });
                            this.getLocationById();
                        } else {
                            this.$q.notify({
                                message: res.data.emsg,
                                color: "red",
                                position: "top"
                            });
                        }
                    })
                })
                .onOk(() => {
                    // console.log('>>>> second OK catcher')
                })
                .onCancel(() => {
                    // console.log('>>>> Cancel')
                })
                .onDismiss(() => {
                    // console.log('I am triggered on both OK and Cancel')
                });
        },
        addIPs(){
            if(this.selectNode.id){
                this.ipShow=true
            }else{
                this.$q.notify({position: 'top', color: 'red-5', textColor: 'white', icon: 'error', message: '请选择区域'})
            }

        },
        rest(){
          this.filter.ip='';
          this.search()
        },
        showWhiteMenu(){
          this.ifShow=true
        },
        closeifShow(){
            this.ifShow=false
        },
        closeipShow(){
            this.getLocationById();
            this.ipShow=false;
            this.editShow=false
        },
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
                res.data.suc === true ?
                    (this.updateShow = false) :
                    (this.updateShow = true);
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

            this.addShow = true;
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
        onLazyLoad({
                       node,
                       key,
                       done,
                       fail
                   }) {
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
                res.data.suc === true ?
                    (this.addChildNodeShow = false) :
                    (this.addChildNodeShow = true);
                setTimeout(() => {
                    this.getLocationTree();
                }, 200);
            });
        },
        addFatherNode() {
            addFatherNode(this.addFatherNodeInfo).then(res => {
                this.getOptResult(res);
                res.data.suc === true ?
                    (this.addFatherNodeShow = false) :
                    (this.addFatherNodeShow = true);
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
                res.data.suc === true ?
                    (this.addDormShow = false) :
                    (this.addDormShow = true);
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
                res.data.suc === true ?
                    (this.changeShowCollege = false) :
                    (this.changeShowCollege = true);
                setTimeout(() => {
                    this.getLocationById();
                }, 200);
            });
        },
        changeBuilding() {
            changeBuilding(this.changeBuildingRow).then(res => {
                this.getOptResult(res);
                res.data.suc === true ?
                    (this.changeBuildingShow = false) :
                    (this.changeBuildingShow = true);
                setTimeout(() => {
                    this.getLocationById();
                }, 200);
            });
        },
        search() {
            this.pagination.page = 1;
            this.getLocationById()
        },
        deleteRow() {
            deleteRoleUserById(this.dltRow.sid).then(res => {
                this.getOptResult(res);
                this.getLocationById();
            });
        },
        addCampus() {
            addCampus(this.campusInfo).then(res => {
                this.getOptResult(res);
                res.data.suc === true ?
                    (this.addCampusShow = false) :
                    (this.addCampusShow = true);
                setTimeout(() => {
                    this.getLocationById();
                }, 200);
            });
        },
        addBuilding() {
            addBuilding(this.buildingInfo).then(res => {
                this.getOptResult(res);
                res.data.suc === true ?
                    (this.addBuildingShow = false) :
                    (this.addBuildingShow = true);
                setTimeout(() => {
                    this.getLocationById();
                }, 200);
            });
        },
        changeCampus() {
            changeCampus(this.changeCampusRow).then(res => {
                this.getOptResult(res);
                res.data.suc === true ?
                    (this.changeCampusShow = false) :
                    (this.changeCampusShow = true);
                setTimeout(() => {
                    this.getLocationById();
                }, 200);
            });
        },
        addArea() {
            addArea(this.areaInfo).then(res => {
                this.getOptResult(res);
                res.data.suc === true ?
                    (this.addAreaShow = false) :
                    (this.addAreaShow = true);
                setTimeout(() => {
                    this.getLocationById();
                }, 200);
            });
        },
        changeArea() {
            changeArea(this.changeAreaRow).then(res => {
                this.getOptResult(res);
                res.data.suc === true ?
                    (this.changeAreaShow = false) :
                    (this.changeAreaShow = true);
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
        },
        onRequest(props) {
            const {
                page,
                rowsPerPage,
                descending
            } = props.pagination;
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
        addRoleUser() {
            addRoleUser(this.addInfo).then(res => {
                console.log("777" + this.filter.id + this.filter.type);
                this.getOptResult(res);
                res.data.suc === true ? (this.addShow = false) : (this.addShow = true);
                setTimeout(() => {
                    this.getLocationById();
                }, 500);
            });
        },
        async getLocationById() {
            let item=await ipPage(this.pagination,this.selectNode.id, this.filter);
            this.data = item.data.records;
            this.pagination.rowsNumber = item.data.total;
        },
        // getUserPageByRoleId () {
        //   getUserPageByRoleId(this.pagination, this.filter).then(res => {
        //     this.data = res.data.records
        //     this.pagination.rowsNumber = res.data.total
        //   })
        // },
        reset() {
            this.filter.name = "";
            this.filter.job = "";
            this.filter.systemName = "";
            this.filter.roleName = {
                label: '',
                value: ''
            };
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
        getRoleNames() {
            getRoleNames().then(res => {
                this.roleNames = res.data
            })
        },
        getSystemNames() {
            getSystemNames().then(res => {
                this.systemNames = res.data
                this.systems.splice(0, this.systems.length)
                res.data.forEach(element => {
                    var obj = new Object()
                    obj.label = element
                    obj.value = element
                    this.systems.push(obj)
                });
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
        filterCollege(val, update) {
            if (val.length < 2) {
                return
            }
            update(() => {
                getCollegeByName(val).then(res => {
                    this.depnames = res.data
                })
            })
        },
    },
    computed: {
        watchIsShow() {
            return this.isShow;
        }
    },
    watch: {
        "info.department": {
            handler: function (newVal, oldVal) {
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
        // this.getRoles();
        this.getRoleNames()
        this.getSystemNames()
    }
}
</script>
<style scoped>
  .big-box {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .big-box>div {
    padding: 10px;
  }

  .btn-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .op {
    display: flex;
    flex-direction: row;

  }

  .op>* {
    margin: 10px;
  }

  .add-box {
    width: 100%;
    flex-wrap: wrap;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .add-box>div {
    width: 100%;
    padding: 20px 24px;
  }

</style>
