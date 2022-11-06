<template>
  <div>
    <q-dialog v-model="showWhiteIp">
      <q-card style="width:100%; max-width: 90vw">
        <q-toolbar>
          <q-toolbar-title class="text-center"><span class="text-weight-bold"></span>白名单IP</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <q-splitter v-model="splitterModel" :limits="[40, 50]" >
            <template v-slot:before>
              <tableCard>
                <!-- 表格筛选块 -->
                <template v-slot:filter>
                  <q-input outlined  dense v-model="form.ip"  label="IP地址" />
                  <q-btn color="primary" @click="addIP">添加</q-btn>
                </template>
                <!-- 表格内容块 -->
                <template v-slot:table>
                  <q-table
                    :data="data"
                    :columns="columns"
                    row-key="id"
                    rows-per-page-label="每页行数"
                    :pagination.sync="pagination"
                    :no-data-label="'没有数据'"
                    class="right-sticky"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <!--              <q-td key="id" :props="props">{{ props.row.id }}</q-td>-->
                        <q-td key="ip" :props="props">
                          {{ props.row.ip }}
                        </q-td>
                        <q-td key="operation" :props="props" class="q-gutter-x-sm btn-col">
                          <q-btn style="margin-left:5px" color="negative" dense @click="delIP(props.row,props.rowIndex)" >删除</q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </template>
              </tableCard>
            </template>

            <template v-slot:after>
              <tableCard>
                <!-- 表格筛选块 -->
                <template v-slot:filter>
                  白名单接口
                </template>
                <!-- 表格内容块 -->
                <template v-slot:table>
                  <q-table
                    :data="datamenu"
                    :columns="columnsmenu"
                    row-key="id"
                    @request="onRequest"
                    rows-per-page-label="每页行数"
                    :pagination.sync="paginationmenu"
                    :no-data-label="'没有数据'"
                    class="right-sticky"
                    selection="multiple"
                    :selected.sync="selected"
                  >
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <!--              <q-td key="id" :props="props">{{ props.row.id }}</q-td>-->
                        <q-td class="text-center">
                          <q-checkbox dense v-model="props.selected"  />
                        </q-td>
                        <q-td key="menuname" :props="props">
                          {{ props.row.menuname }}
                        </q-td>
<!--                        <q-td key="menuurl" :props="props">-->
<!--                          {{ props.row.menuurl }}-->
<!--                        </q-td>-->
                        <q-td key="action" :props="props">
                          {{ props.row.action }}
                        </q-td>
                        <q-td key="url" :props="props">
                          {{ props.row.url }}
                        </q-td>
                        <q-td key="remarks" :props="props">
                          {{ props.row.remarks }}
                        </q-td>
                        <q-td key="syname" :props="props">
                          {{ props.row.syname }}<br/>({{ props.row.remarks }})
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </template>
              </tableCard>
            </template>
          </q-splitter>



          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="保存"  @click="addWhiteIp" color="primary"  class="q-ml-sm" />
            <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
          </div>
        </div>
      </q-card>
    </q-dialog>


    <q-dialog v-model="showEditIp">
      <q-card style="width:100%; max-width: 90vw">
        <q-toolbar>
          <q-toolbar-title class="text-center"><span class="text-weight-bold"></span>白名单IP</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <tableCard>
            <!-- 表格筛选块 -->
            <template v-slot:filter>
              白名单接口
            </template>
            <!-- 表格内容块 -->
            <template v-slot:table>
              <q-table
                :data="datamenu"
                :columns="columnsmenu"
                row-key="id"
                @request="onRequest"
                rows-per-page-label="每页行数"
                :pagination.sync="paginationmenu"
                :no-data-label="'没有数据'"
                class="right-sticky"
                selection="multiple"
                :selected.sync="selected"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <!--              <q-td key="id" :props="props">{{ props.row.id }}</q-td>-->
                    <q-td class="text-center">
                      <q-checkbox dense v-model="props.selected"  />
                    </q-td>
                    <q-td key="menuname" :props="props">
                      {{ props.row.menuname }}
                    </q-td>
                    <!--                        <q-td key="menuurl" :props="props">-->
                    <!--                          {{ props.row.menuurl }}-->
                    <!--                        </q-td>-->
                    <q-td key="action" :props="props">
                      {{ props.row.action }}
                    </q-td>
                    <q-td key="url" :props="props">
                      {{ props.row.url }}
                    </q-td>
                    <q-td key="remarks" :props="props">
                      {{ props.row.remarks }}
                    </q-td>
                    <q-td key="syname" :props="props">
                      {{ props.row.syname }}<br/>({{ props.row.remarks }})
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </template>
          </tableCard>



          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="保存"  @click="editWhiteIp" color="primary"  class="q-ml-sm" />
            <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
    import {whitemenuPage,MenuOptions,ipSave,MenuDel,ipEdit} from '../../../api/whitelist'
    export default {
        name: "WhiteIpDialog",
        data() {
            return {
                ipid:'',
                showEditIp:false,
                splitterModel: 32,
                form:{
                    ip:''
                },
                filter:{
                    syname:null,
                    menu:null
                },
                node:{
                    locationid:'1',
                    locationname:'市教委'
                },
                selected:[],
                menus:[],
                showWhiteIp:false,
                showAddMenu:false,
                loading: false,
                pagination: {
                    sortBy: "name",
                    descending: false,
                    page: 1,
                    rowsPerPage: 15,
                    rowsNumber: 1,
                },
                columns: [
                    { name: "ip", label: "IP地址", field: "ip", align: "center" },
                    {
                        name: "operation",
                        label: "操作",
                        field: "operation",
                        align: "center",
                    },
                ],
                data:[],
                paginationmenu: {
                    sortBy: "name",
                    descending: false,
                    page: 1,
                    rowsPerPage: 15,
                    rowsNumber: 1,
                },
                columnsmenu: [
                    { name: "menuname", label: "菜单名称", field: "menuname", align: "center" },
                    // { name: "menuurl", label: "菜单路径", field: "menuurl", align: "center" },
                    { name: "action", label: "方法名", field: "action", align: "center" },
                    { name: "url", label: "方法路径", field: "url", align: "center" },
                    { name: "remarks", label: "方法描述", field: "remarks", align: "center" },
                    { name: "syname", label: "所属系统", field: "syname", align: "center" }
                ],
                datamenu:[]
            }
        },
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            selectNode: {
                type: Object,
                default: undefined,
            },
            showEdit: {
                type: Boolean,
                default: false,
            },
            selectEdit: {
                type: Array,
                default: undefined,
            },
            ipId: {
                type: String,
                default: undefined,
            },
        },
        watch:{
            showWhiteIp(newValue) {
                if (!newValue) {
                    this.closeDialog();
                }
            },
            showEditIp(newValue) {
                if (!newValue) {
                    this.closeDialog();
                }
            },
            show: {
                handler(newValue, oldValue) {
                    this.showWhiteIp = newValue;
                    this.data=[];
                    this.selected=[];
                    this.form.ip='';
                    if (newValue) {
                        this.getWhiteMenu()
                    }
                },
                immediate: true,
            },
            showEdit: {
                handler(newValue, oldValue) {
                    this.showEditIp = newValue;
                    this.data=[];
                    this.form.ip='';
                    if (newValue) {
                        this.getWhiteMenu()
                    }
                },
                immediate: true,
            },
            selectEdit:{
                handler(newValue, oldValue) {
                    this.selected=[];
                    if (newValue) {
                        this.selected=newValue;
                    }
                },
                immediate: true,
            },
            selectNode: {
                handler(newValue, oldValue) {

                    if (newValue) {
                        this.node.locationid=newValue.id;
                        this.node.locationname=newValue.nodeName
                    }
                },
                immediate: true,
            },
            ipId: {
                handler(newValue, oldValue) {
                    if (newValue) {
                        this.ipid=newValue
                    }
                },
                immediate: true,
            }
        },
        methods:{
            delWhite(id){
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
                        MenuDel(id).then(res=>{
                            if (res.data.suc) {
                                // 成功
                                this.$q.notify({
                                    message: "删除成功",
                                    color: "green",
                                    position: "top"
                                });
                                this.getWhiteMenu()
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
            closeDialog() {
                this.$emit("close")
            },
            async editWhite(row){
                var that=this;
                this.form.id=row.id;
                this.form.menuname=row.menuname;
                this.form.menuid=row.menuid;
                this.form.menuurl=row.menuurl;
                this.form.action=row.action;
                this.form.url=row.url;
                this.form.remarks=row.remarks;
                this.form.syname=row.syname;
                await this.synames.filter(function (v,i) {
                    if(v.label==row.syname){
                        that.choice.syname=v
                    }
                });
                await MenuOptions(that.choice.syname.value).then(res=>{
                    that.menus=[]
                    if(res){
                        let arr=res.data;
                        arr.forEach(function (v,i) {
                            that.menus.push({label:v.name+'('+v.url+')',value:v.id,name:v.name,url:v.url})
                        })
                    }
                })
                await this.menus.filter(function (v,i) {
                    if(v.value==row.menuid){
                        that.choice.menu=v
                    }
                });
                this.showAddMenu=true

            },
            search(){
                this.paginationmenu.page = 1;
                this.getWhiteMenu()
            },
            rest(){
                this.filter.syname=null;
                this.filter.menu=null;
                this.getWhiteMenu()
            },
            hasEmpty (){
                if(!(this.data.length>0)){
                    return 'IP地址未填写'
                }else if(!(this.selected.length>0)){
                    return '白名单接口未选择'
                }
                else{
                    return false
                }
            },
            hasEmptyEdit (){
                if(!(this.selected.length>0)){
                    return '白名单接口未选择'
                }
                else{
                    return false
                }
            },
            async addWhiteIp(){
                let text = this.hasEmpty();
                if (text) {
                    this.$q.notify({
                        message: text === true ? "有内容没有填写完整无法提交" : text,
                        color: "red-12",
                        position: "top"
                    });
                } else {
                    let item=await ipSave(this.node.locationid,this.node.locationname,JSON.stringify(this.data),JSON.stringify(this.selected));
                    if (item.data.suc) {
                        // 成功
                        this.$q.notify({
                            message: "保存成功",
                            color: "green",
                            position: "top"
                        });
                        this.closeDialog();
                    } else {
                        this.$q.notify({
                            message: item.data.emsg,
                            color: "red",
                            position: "top"
                        });
                    }
                }
            },
            async editWhiteIp(){
                let text = this.hasEmptyEdit();
                if (text) {
                    this.$q.notify({
                        message: text === true ? "有内容没有填写完整无法提交" : text,
                        color: "red-12",
                        position: "top"
                    });
                } else {
                    let item=await ipEdit(this.ipid,JSON.stringify(this.selected));
                    if (item.data.suc) {
                        // 成功
                        this.$q.notify({
                            message: "保存成功",
                            color: "green",
                            position: "top"
                        });
                        this.closeDialog();
                    } else {
                        this.$q.notify({
                            message: item.data.emsg,
                            color: "red",
                            position: "top"
                        });
                    }
                }
            },
            onRequest(props) {
                //console.log(props.pagination)
                let { page, rowsPerPage, descending } = props.pagination;

                this.loading = true;
                // don't forget to update local pagination object
                this.paginationmenu.page = page;
                this.paginationmenu.rowsPerPage = rowsPerPage;
                this.paginationmenu.descending = descending;
                //console.log(this.filter)
                this.getWhiteMenu();
                // ...and turn of loading indicator
                this.loading = false;
            },
            async getWhiteMenu(){
                let item=await whitemenuPage(this.paginationmenu,this.filter);
                this.datamenu=item.data.records;
                this.paginationmenu.rowsNumber=item.data.total
            },
            addIP(){
                var that=this;
                var rule =/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
                if (!this.form.ip.match(rule)) {
                    this.$q.notify({position: 'top', color: 'red-5', textColor: 'white', icon: 'error', message: 'IP地址不合法'})
                }else{
                    let flag=false;
                    this.data.filter(function (v,i) {
                        if(v.ip==that.form.ip){
                            flag=true;
                        }
                    });
                    if(flag){
                        this.$q.notify({position: 'top', color: 'red-5', textColor: 'white', icon: 'error', message: 'IP地址已存在'})
                    }else{
                        this.data.push({ip:this.form.ip});
                        this.form.ip=''
                    }

                }
            },
            delIP(row,index){
                this.data.splice(index,1)
            }
        }
    }
</script>
<style lang="scss" scoped>
  .input-line {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .title {
      margin-right: 10px;
      font-size: 12pt;
    }
    label {
      min-width: 200px;
    }
    label + label {
      margin-left: 12px;
    }
  }
</style>
