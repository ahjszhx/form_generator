<template>
  <div>
    <q-dialog v-model="showWhiteMenu">
      <q-card style="width:100%; max-width: 90vw">
        <q-toolbar>
          <q-toolbar-title class="text-center"><span class="text-weight-bold"></span>白名单接口</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <tableCard>
            <!-- 表格筛选块 -->
            <template v-slot:filter>
              <q-select outlined  dense v-model="filter.syname" :options="filtersynames" label="系统名称" />
              <q-select outlined  dense v-model="filter.menu" :options="filtermenus" label="菜单名称" />
              <q-btn color="primary" @click="search" icon="search">查询</q-btn>
              <q-btn color="primary" @click="rest" icon="refresh">重置</q-btn>
              <q-btn color="primary" @click="addMenu">添加白名单接口</q-btn>
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
                    <!--              <q-td key="id" :props="props">{{ props.row.id }}</q-td>-->
                    <q-td key="menuname" :props="props">
                      {{ props.row.menuname }}
                    </q-td>
                    <q-td key="menuurl" :props="props">
                      {{ props.row.menuurl }}
                    </q-td>
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
                      {{ props.row.syname }}
                    </q-td>
                    <q-td key="operation" :props="props" class="q-gutter-x-sm btn-col">
                      <q-btn style="margin-left:5px" color="secondary" dense @click="editWhite(props.row)" >编辑</q-btn>
                      <q-btn style="margin-left:5px" color="negative" dense @click="delWhite(props.row.id)" >删除</q-btn>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </template>
          </tableCard>

          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
          </div>
        </div>
      </q-card>
    </q-dialog>


    <q-dialog v-model="showAddMenu">
      <q-card style="width:100%; max-width: 60vw">
        <q-toolbar>

          <q-toolbar-title class="text-center"><span class="text-weight-bold"></span>编辑白名单接口</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <q-select outlined  dense v-model="choice.syname" :options="synames" label="系统名称" />
          <q-select outlined  dense v-model="choice.menu" :options="menus" label="菜单名称" />
          <q-input outlined  dense v-model="form.action" label="方法名(如cn.edu.controller.XXX)" />
          <q-input outlined  dense v-model="form.url" label="方法路径(如/api/pc/demo)" />
          <q-input outlined  dense v-model="form.remarks" label="方法描述(如'新增会议')" />
          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="保存"  @click="addWhiteMenu" color="primary"  class="q-ml-sm" />
            <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
          </div>
        </div>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
    import {whitemenuPage,MenuOptions,MenuAdd,MenuDel} from '../../../api/whitelist'
    export default {
        name: "WhiteListDialog",
        data() {
            return {
                filter:{
                    syname:null,
                    menu:null
                },
                choice:{
                    syname:null,
                    menu:null
                },
                form:{
                    id:'',
                    menuname:'',
                    menuid:'',
                    menuurl:'',
                    action:'',
                    url:'',
                    remarks:'',
                    syname:''
                },
                menus:[],
                synames:[
                    {
                        label:'内部管理系统',
                        value:'inside'
                    },
                    {
                        label:'食品安全系统',
                        value:'canteen'
                    }
                ],
                filtermenus:[],
                filtersynames:[
                    {
                        label:'内部管理系统',
                        value:'inside'
                    },
                    {
                        label:'食品安全系统',
                        value:'canteen'
                    }
                ],
                showWhiteMenu:false,
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
                    { name: "menuname", label: "菜单名称", field: "menuname", align: "center" },
                    { name: "menuurl", label: "菜单路径", field: "menuurl", align: "center" },
                    { name: "action", label: "方法名", field: "action", align: "center" },
                    { name: "url", label: "方法路径", field: "url", align: "center" },
                    { name: "remarks", label: "方法描述", field: "remarks", align: "center" },
                    { name: "syname", label: "所属系统", field: "syname", align: "center" },
                    {
                        name: "operation",
                        label: "操作",
                        field: "operation",
                        align: "center",
                    },
                ],
                data:[]
            }
        },
        props: {
            show: {
                type: Boolean,
                default: false,
            },
        },
        watch:{
            showWhiteMenu(newValue) {
                if (!newValue) {
                    this.closeDialog();
                }
            },
            show: {
                handler(newValue, oldValue) {
                    this.showWhiteMenu = newValue;
                    if (newValue) {
                        this.search()
                    }
                },
                immediate: true,
            },
            "choice.syname" (newValue, oldValue) {
                var that=this;
                if(newValue){
                    this.form.syname=newValue.label;
                    MenuOptions(newValue.value).then(res=>{
                        that.menus=[]
                        if(res){
                            let arr=res.data;
                            arr.forEach(function (v,i) {
                                that.menus.push({label:v.name+'('+v.url+')',value:v.id,name:v.name,url:v.url})
                            })
                        }
                    })
                }
            },
            "choice.menu" (newValue, oldValue) {
                if(newValue){
                    this.form.menuname=newValue.name;
                    this.form.menuid=newValue.value;
                    this.form.menuurl=newValue.url;
                }
            },
            "filter.syname" (newValue, oldValue) {
                var that=this;
                if(newValue){
                    MenuOptions(newValue.value).then(res=>{
                        that.filtermenus=[]
                        if(res){
                            let arr=res.data;
                            arr.forEach(function (v,i) {
                                that.filtermenus.push({label:v.name+'('+v.url+')',value:v.id,name:v.name,url:v.url})
                            })
                        }
                    })
                }
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
                this.pagination.page = 1;
                this.getWhiteMenu()
            },
            rest(){
                this.filter.syname=null;
                this.filter.menu=null;
                this.getWhiteMenu()
            },
            hasEmpty (){
                if(!this.form.syname){
                    return '系统名称未填写'
                }else if(!this.form.menuname){
                    return '菜单名称未填写'
                }else if(!this.form.action){
                    return '方法名未填写'
                }else if(!this.form.url){
                    return '方法路径未填写'
                }else if(!this.form.remarks){
                    return '方法描述未填写'
                }
                else{
                    return false
                }
            },
            async addWhiteMenu(){
                let text = this.hasEmpty();
                if (text) {
                    this.$q.notify({
                        message: text === true ? "有内容没有填写完整无法提交" : text,
                        color: "red-12",
                        position: "top"
                    });
                } else {
                    let item=await MenuAdd(this.form);
                    if (item.data.suc) {
                        // 成功
                        this.$q.notify({
                            message: "保存成功",
                            color: "green",
                            position: "top"
                        });
                        this.showAddMenu=false;
                        this.getWhiteMenu()
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
                this.pagination.page = page;
                this.pagination.rowsPerPage = rowsPerPage;
                this.pagination.descending = descending;
                //console.log(this.filter)
                this.getWhiteMenu();
                // ...and turn of loading indicator
                this.loading = false;
            },
            async getWhiteMenu(){
                let item=await whitemenuPage(this.pagination,this.filter);
                this.data=item.data.records;
                this.pagination.rowsNumber=item.data.total
            },
            addMenu(){
                this.form.id='';
                this.form.menuname='';
                this.form.menuid='';
                this.form.menuurl='';
                this.form.action='';
                this.form.url='';
                this.form.remarks='';
                this.form.syname='';
                this.showAddMenu=true
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
