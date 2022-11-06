<template>
  <div class="q-pa-md q-gutter-y-md page-box">
    <q-card class="q-gutter-y-md items-center">
      <div class="q-pa-md q-gutter-y-md">
        <div class="row q-gutter-md justify-left" style="margin-top:0">
          <!-- <q-input dense outlined v-model="filter.userId" style="min-width: 200px; max-width: 250px" label="请输入工号"
            @keyup.enter="query" /> -->
          <q-input dense outlined v-model="filter.username" style="min-width: 200px; max-width: 250px" label="请输入姓名"
            @keyup.enter="query" />
          <!-- <q-select dense outlined v-model="filter.gender" :options="genders" style="min-width: 200px; max-width: 250px"
            label="请选择性别" @keyup.enter="query" />
          <q-input dense outlined v-model="filter.job" style="min-width: 200px; max-width: 250px" label="请输入职务"
            @keyup.enter="query" /> -->
        </div>

        <div class="row q-gutter-sm justify-left">
          <!-- <q-btn small color="primary" @click="showAdd" icon="add">新增</q-btn>&nbsp;&nbsp; -->
          <q-btn small color="primary" @click="query" icon="search">查询</q-btn>&nbsp;&nbsp;
          <q-btn small color="primary" @click="reset" icon="refresh">重置</q-btn>&nbsp;
        </div>
      </div>
    </q-card>

    <q-table title="日志列表" :data="data" :columns="columns" row-key="id" :rows-per-page-options="[8, 15, 30]"
      @request="onRequest" :pagination.sync="pagination">

      <template v-slot:body="props">
        <q-tr :props="props">
          <!-- <q-td>
            <q-checkbox dense v-model="props.selected" style="margin-left:42%" />
          </q-td> -->
          <q-td key="username" :props="props">
            <div class="text-pre-wrap">{{ props.row.username }}</div>
          </q-td>
          <q-td key="content" :props="props">
            <div class="text-pre-wrap">{{ props.row.content }}</div>
          </q-td>
          <!-- <q-td key="deviceId" :props="props">
            <div class="text-pre-wrap">{{ props.row.deviceId }}</div>
          </q-td> -->
          <q-td key="createdTime" :props="props">
            <div class="text-pre-wrap">
              {{ props.row.createdTime }}
            </div>
          </q-td>

        </q-tr>
      </template>
    </q-table>


  </div>
</template>
<script>
  import {
    getLogPage
  } from '../../api/data'
  export default {
    data() {
      return {
        data: [],
        filter: {
          userId: '',
          username: '',
          gender: '',
          job: '',
        },
        columns: [
          {
            name: 'username',
            align: 'center',
            label: '姓名',
            field: 'username'
          },
          {
            name: 'content',
            align: 'center',
            label: '操作行为',
            field: 'content'
          },

          {
            name: 'createdTime',
            align: 'center',
            label: '操作时间',
            field: 'createdTime'
          },
        ],

        pagination: {
          page: 1,
          rowsPerPage: 30,
          descending: false,
          rowsNumber: 1,
        },
      }
    },
    methods: {
      query() {
        if (
          this.filter.userId === "" && this.filter.username === ""
          // this.filter.startTime === "" && this.filter.endTime === ""
        ) {
          this.$q.notify({
            position: "top",
            color: "red-5",
            icon: "mood_bad",
            textColor: "white",
            message: "查询条件不能为空",
          });
          return;
        }
        this.onRequest({
          pagination: this.pagination,
          filter: this.filter,
        });
      },
      reset() {
        this.filter.userId = "";
        this.filter.username = ""
        // this.filter.type = "";
        this.getLogPage();
      },
      onRequest(props) {
        const {
          page,
          rowsPerPage,
          descending
        } = props.pagination;
        // this.loading = true
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.descending = descending;
        this.getLogPage();
        // this.loading = false
      },
      getLogPage() {
        getLogPage(this.pagination, this.filter).then(res => {
          console.log('res.data:', res.data)
          this.data.splice(0, this.data.length)
          this.data = res.data.records;
          this.pagination.rowsNumber = res.data.total;
        })
      },
    },
    created() {
      this.getLogPage()
    }
  }

</script>
<style scoped>

</style>
