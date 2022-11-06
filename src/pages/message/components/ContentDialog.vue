<template>
  <div>
    <q-dialog v-model="showContent">
      <q-card style="width:100%; max-width: 80vw">
        <q-toolbar>
          <q-toolbar-title class="text-center"><span class="text-weight-bold"></span>{{info.title}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-separator />
        <div class="q-pa-md doc-container q-gutter-y-md">
          <div class="row justify-center">
            <div class="vote-time">发送时间：{{info.pcdt}}&nbsp;&nbsp;&nbsp;&nbsp;发送人：{{info.puname}}({{info.puid}})</div>
          </div>
          <div class="vote-introduction" v-html="info.content"></div>
          <div class="row justify-center" style="margin-top:15px">
            <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
    export default {
        name: "ContentDialog",
        data() {
            return {
                showContent:false,
               info:{
                   title:'',
                   puid:'',
                   puname:'',
                   pcdt:'',
                   content:''
               }
            }
        },
        methods:{
            showDialog(row){
                this.info.title=row.title
                this.info.puid=row.puid
                this.info.puname=row.puname
                this.info.pcdt=row.pcdt
                this.info.content=row.content
                this.showContent=true
            }
        }
    }
</script>

<style lang="scss" scoped>
  .vote-introduction {
    margin-top: 10px;
  }
  .vote-time{
    color: #7f7f7f;
    text-align: center;
  }
</style>
