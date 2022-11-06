<template>

  <q-dialog v-model="ifShow">
    <q-card style="width:60%; max-width: 80vw;">
      <q-toolbar>
        <q-toolbar-title class="text-center"><span class="text-weight-bold">修改用户信息</span></q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <q-separator />
      <div class="q-pa-md doc-container q-gutter-y-md">
        <div class="row justify-center q-gutter-x-md">
          <div class="big-box">
            <div class="box-one">
              <div class="kind-one">
                <q-input class="input-1" dense outlined v-model="info.username" label="姓名" readonly></q-input>
              </div>
              <div class="kind-one">
                <q-input class="input-1" dense outlined v-model="info.userId" label="工号" readonly></q-input>
              </div>
            </div>

            <div class="box-one">
              <div class="kind-one">
                <q-select class="input-1" dense outlined v-model="info.gender" :options="genders" label="性别" readonly>
                </q-select>
              </div>
              <div class="kind-one">
                <q-input class="input-1" dense outlined v-model="info.job" label="职务"></q-input>
              </div>
            </div>

            <div class="box-one">
              <div class="kind-one">
                <q-input class="input-1" dense outlined v-model="info.phone" label="联系方式">
                </q-input>
              </div>
              <div class="kind-one">
                <q-input class="input-1" dense outlined v-model="info.idCard" label="身份证号" readonly></q-input>
              </div>
            </div>

            <div class="box-one">
              <div class="kind-one">
                <q-select class="input-1" outlined dense v-model="info.college" :options="departments" label="所属单位" />

                <!-- <q-select class="input-1" dense outlined v-model="info.parentName" :options="colleges" use-input
                  input-debounce="0" @filter="filterCollege" label="请输入学校名称"><template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        未查询到相关高校
                      </q-item-section>
                    </q-item>
                  </template></q-select> -->
              </div>
              <div class="kind-one">
                <q-select class="input-1" outlined dense v-model="info.campus" :options="departs" label="所属校区"
                  v-if=" departs.length>0">
                  <template v-if="info.campus" v-slot:append>
                    <q-icon name="cancel" @click.stop="info.campus = ''" class="cursor-pointer" />
                  </template>
                </q-select>
              </div>
            </div>

          </div>
        </div>

      </div>
      <div class="row justify-center" style="margin-top:15px; margin-bottom:10px">
        <q-btn label="确认" @click="updateUser" color="primary"></q-btn>
        <q-btn label="关闭" type="reset" v-close-popup color="primary" flat class="q-ml-sm" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
  import {
    getCollegesBySearch,
    getDepartByMent,
    updateUserInfo
  } from '../../../api/data'
  export default {
    name: 'UpdateUser',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      userInfo: {
        type: Object,
        default: () => {}
      },
      de: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        genders: ['男', '女'],
        ifShow: false,
        info: {
          userId: '',
          username: '',
          idCard: '',
          gender: '',
          phone: '',
          job: '',
          parentName: '',
          depart: '',
          campus:'',
        },
        colleges: [],
        departs: [],
        departments: [],
      }
    },
    methods: {
      getOptResult(res) {
        if (res.data.suc === true) {
          this.$q.notify({
            position: "top",
            icon: "mood",
            color: "green-4",
            textColor: "white",
            message: res.data.msg,
          });
        } else {
          this.$q.notify({
            position: "top",
            color: "red-5",
            textColor: "white",
            icon: "mood_bad",
            message: res.data.emsg,
          });
        }
      },
      filterCollege(val, update, abort) {
        if (val.length < 2) {
          return;
        }
        update(() => {
          console.log('val', val)
          this.getCollegesBySearch(val);
        });
      },
      getCollegesBySearch(val) {
        getCollegesBySearch(val).then((res) => {
          this.colleges.splice(0, this.colleges.length);
          if (res.data.length > 0) {
            res.data.forEach((element) => {
              this.colleges.push(element.name);
            });
          }
        });
      },
      updateUser() {
        updateUserInfo(this.info).then((res) => {
          this.getOptResult(res);
          res.data.suc === true ?
            (this.ifShow = false) :
            (this.ifShow = true);
          setTimeout(() => {
            this.$emit('refresh')
          }, 500);
        });
      },
      closeDialog() {
        this.$emit('close', false)
      },
      getDepartByMent(val) {
        getDepartByMent(val).then((res) => {
          this.departs.splice(0, this.departs.length);
          if (res.data.length > 0) {
            res.data.forEach((element) => {
              this.departs.push(element.nodeName);
            });
          } else {
            this.info.campus = '';
          }
        });
      },
    },
    watch: {
      show: {
        handler(newVal, oldVal) {
          console.log('oldVal', oldVal)
          console.log('newVal', newVal)
          this.ifShow = newVal
          if (newVal) {}
        },
        immediate: true
      },
      ifShow: {
        handler(newVal, oldVal) {
          console.log('new', newVal)
          console.log('old', oldVal)
          if (!newVal) {
            this.closeDialog()
          }
        }
      },
      "info.college": {
        handler: function (newVal, oldVal) {
          console.log("college newVal" + newVal);
          console.log("college oldVal" + oldVal);
          //do something
          if (newVal) {
            if (newVal.length > 0) {
              this.getDepartByMent(newVal);
            }
          }
        },
        deep: true
      },
      departs: {
        handler(newVal, oldVal) {
          console.log("departs newVal", newVal);
          console.log("departs oldVal", oldVal);
          if (newVal.length <= 0) {
            console.log('清空了info.depart')
            this.info.campus = ''
          }
        },
        deep: true
      },
      userInfo: {
        handler(newVal, oldVal) {
          console.log("userInfo newVal", newVal);
          console.log("userInfo oldVal", oldVal);
          this.info = this.userInfo
          if(this.info.campus === null){
            this.info.campus = ''
          }
          if(this.info.depart === null){
            this.info.depart = ''
          }
        },
        immediate: true,
        deep: true
      },
      de: {
        handler(newVal, oldVal) {
          this.departments = this.de
        },
        deep: true
      }
    }
  }

</script>
<style scoped>
  .big-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    /* height: 80%; */
  }

  .box-one {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
  }

  .kind-one {
    width: 45%;
  }

  .input-1 {
    width: 80%;
  }

</style>
