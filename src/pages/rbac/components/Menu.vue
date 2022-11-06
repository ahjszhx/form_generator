<template>
  <div>
    <q-dialog v-model="isShow" transition-show="rotate" transition-hide="rotate">
      <q-card class="box">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>
          <!-- <q-tab name="canteen" label="食品安全系统" /> -->
          <q-tab name="inside" label="内部管理系统" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="canteen">
            <div class="q-pa-md doc-container q-gutter-x-xs q-gutter-y-lg">
              <div class="row justify-center">
                <q-list style="width:100vw" v-for="group in groups1" :key="group.index" separator>
                  <div v-if="group.systemName ===tab">
                    <q-item style="flex-wrap:wrap">
                      <q-item-section top class="col-12 gt-sm">
                        <q-item-label class="q-mt-sm">{{ group.name }}</q-item-label>
                      </q-item-section>

                      <q-item-section top side v-for="action in group.rbacActions" :key="action.index">
                        <q-checkbox v-model="check_actions" :val="action.id" :label="action.name" color="teal"
                          style="" />
                      </q-item-section>

                    </q-item>
                  </div>
                  <!-- <q-separator spaced /> -->
                </q-list>
              </div>
              <div class="row justify-center" style="margin-top:15px">
                <q-btn label="提交" @click="onSubmit(1)" color="primary" style="width:150px" />
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="inside">
            <div class="q-pa-md doc-container q-gutter-x-xs q-gutter-y-lg">
              <div class="row justify-center">
                <q-list style="width:100vw" v-for="group in groups1" :key="group.index" separator>
                  <div v-if="group.systemName ===tab">
                    <q-item style="flex-wrap:wrap">
                      <q-item-section top class="col-12 gt-sm">
                        <q-item-label class="q-mt-sm">{{ group.name }}</q-item-label>
                      </q-item-section>

                      <q-item-section top side v-for="action in group.rbacActions" :key="action.index">
                        <q-checkbox v-model="check_actions" :val="action.id" :label="action.name" color="teal"
                          style="" />
                      </q-item-section>

                    </q-item>
                  </div>
                  <!-- <q-separator spaced /> -->
                </q-list>
              </div>
              <div class="row justify-center" style="margin-top:15px">
                <q-btn label="提交" @click="onSubmit(1)" color="primary" style="width:150px" />
              </div>
            </div>
          </q-tab-panel>


        </q-tab-panels>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  import {
    roleUpdate,
    getMenusByRoleId,
    getActions
  } from '../../../api/rbac'
  export default {
    name: 'Menu',
    props: {
      showMenu: {
        type: Boolean,
        default: false
      },
      id: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        tab: 'inside',
        splitterModel: 15,
        isShow: false,
        groups1: [],
        groups2: [],
        check_actions: []
      }
    },
    methods: {
      getActions(isMenu) {
        getActions(isMenu).then(res => {
          if (isMenu === 1) {
            this.groups1 = res.data.data
          } else {
            this.groups2 = res.data.data
          }
        })
      },
      closeMenu() {
        this.$emit('close')
      },
      onSubmit(isMenu) {
        // console.log(this.check_actions)
        const ids = JSON.stringify(this.check_actions)
        const roleId = this.id
        roleUpdate(roleId, ids, isMenu).then(res => {
          if (res.data.suc === true) {
            this.$q.notify({
              position: 'top',
              color: 'green-4',
              textColor: 'white',
              icon: 'mood',
              message: '提交成功'
            })
            isMenu === 1 ? this.editShow1 = false : this.editShow2 = false
          } else {
            this.$q.notify({
              position: 'top',
              color: 'red-5',
              textColor: 'white',
              icon: 'mood_bad',
              message: res.data.emsg
            })
          }
        })
      },
      getMenusByRoleId(id, isMenu) {
        getMenusByRoleId(id, isMenu).then((res) => {
          this.check_actions.splice(0, this.check_actions.length)
          if (res.data.data.length > 0) {
            res.data.data.forEach(element => {
              this.check_actions.push(element.id)
            });
          }
        })
      }
    },
    watch: {
      showMenu: {
        handler(newVal, oldVal) {
          this.isShow = newVal
        },
        immediate: true
      },
      id: {
        handler(newVal, oldVal) {
          console.log('role_id', this.id)
          this.getMenusByRoleId(newVal, 1)
        },
        immediate: true
      },
      isShow: {
        handler(newVal, oldVal) {
          if (!newVal) {
            this.closeMenu()
          }
        },
        immediate: true
      }
    },
    mounted() {
      this.getActions(1)
    }
  }

</script>
<style scoped>
  .box {
    min-width: 1000px;
    height: 100%;
  }

</style>
