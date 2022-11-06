<template>
  <tableCard>
    <!-- 表格标题 -->
    <template v-slot:top>
      Table标题
    </template>
    <!-- 表格筛选块 -->
    <template v-slot:filter>
      <q-input dense outlined v-model="data1" label="请输入组内成员名称" />
      <q-select
        dense
        outlined
        v-model="data2"
        :options="options"
        label="筛选"
      />
      <q-btn color="primary" icon="search">查询</q-btn>
      <q-btn color="primary" icon="refresh">重置</q-btn>
      <q-btn color="primary" icon="add">新增组别</q-btn>
    </template>
  
    <template v-slot:left>
      左侧
    </template>
    <!-- 表格内容块 -->
        <!-- :pagination.sync="pagination" -->
    <template v-slot:table>
      <q-table
        :data="data"
        :columns="columns"
        row-key="id"
        class="right-sticky"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">
              <div class="text-pre-wrap">{{ props.row.name }}</div>
            </q-td>

            <q-td key="username" :props="props">
              <div class="locationName" v-if="props.row.username">
                {{ props.row.username }},{{ props.row.locationName }}
              </div>
              <div class="locationName" v-else>
                {{ props.row.locationName }}
              </div>
            </q-td>
            <q-td key="username1" :props="props">
              <div class="locationName" v-if="props.row.username">
                {{ props.row.username }},{{ props.row.locationName }}
              </div>
              <div class="locationName" v-else>
                {{ props.row.locationName }}
              </div>
            </q-td>
            <q-td key="username2" :props="props">
              <div class="locationName" v-if="props.row.username">
                {{ props.row.username }},{{ props.row.locationName }}
              </div>
              <div class="locationName" v-else>
                {{ props.row.locationName }}
              </div>
            </q-td>
            <q-td key="username3" :props="props">
              <div class="locationName" v-if="props.row.username">
                {{ props.row.username }},{{ props.row.locationName }}
              </div>
              <div class="locationName" v-else>
                {{ props.row.locationName }}
              </div>
            </q-td>
            <q-td key="username4" :props="props">
              <div class="locationName" v-if="props.row.username">
                {{ props.row.username }},{{ props.row.locationName }}
              </div>
              <div class="locationName" v-else>
                {{ props.row.locationName }}
              </div>
            </q-td>
            <q-td key="btn" :props="props" class="q-gutter-x-sm btn-col">
              <q-btn color="primary">修改信息</q-btn>
              <q-btn color="red">删除</q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </template>
  </tableCard>
</template>

<script>
export default {
  data() {
    return {
      data1: "",
      data2: "",
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"],
      data: [
        {
          id: 1,
          name: "高校组",
          username: null,
          locationName: "复旦大学",
          member: null
        },
        {
          id: 2,
          name: "管理组",
          username: null,
          locationName: null,
          member: null
        },
        {
          id: 3,
          name: "浏览组",
          username: null,
          locationName: "市教委",
          member: null
        },
        {
          id: 4,
          name: "测试组",
          username: null,
          locationName: null,
          member: null
        },
        {
          id: 5,
          name: "测试组",
          username: null,
          locationName: null,
          member: null
        },
        {
          id: 6,
          name: "测试组",
          username: null,
          locationName: null,
          member: null
        },
        {
          id: 7,
          name: "测试组",
          username: null,
          locationName: null,
          member: null
        }
      ],
      columns: [
        {
          name: "name",
          required: true,
          label: "组别名称",
          align: "center",
          field: "name"
        },
        {
          name: "username",
          required: true,
          label: "组内成员",
          align: "center",
          field: "username"
        },
        {
          name: "username1",
          required: true,
          label: "组内成员",
          align: "center",
          field: "username1"
        },
        {
          name: "username2",
          required: true,
          label: "组内成员",
          align: "center",
          field: "username2"
        },
        {
          name: "username3",
          required: true,
          label: "组内成员",
          align: "center",
          field: "username3"
        },
        {
          name: "username4",
          required: true,
          label: "组内成员",
          align: "center",
          field: "username4"
        },
        {
          name: "btn",
          required: true,
          label: "操作",
          align: "right",
          field: "btn"
        }
      ]
    };
  }
};
</script>

<style></style>
