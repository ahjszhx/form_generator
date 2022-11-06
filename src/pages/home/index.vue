<template>
  <div class="home-page">
    <!-- 左侧 -->
    <div class="card-box">
      <div class="card-style user-card">
        <div class="user-box">
          <q-avatar
            size="125px"
            :style="imgStyle"
          >
            <q-img :src="userInfo.avatar" />
          </q-avatar>
          <div class="user-info">
            <div class="username">{{ userInfo.username }}</div>
            <div class="username">Welcome to Haixiao's Form Generator！</div>
          </div>
        </div>
        <div class="todo-box">
          <div class="doing bg-blue light radius">
            <div>in progress</div>
            <div class="num">{{ allTodoNumber }}</div>
          </div>
          <div class="finish bg-grey light radius">
            <div>Completed</div>
            <div class="num">{{ allDoneNumber }}</div>
          </div>
        </div>
      </div>
      <div class="card-style">
        <div class="card-top">Project Description</div>
        <div class="card-content row">
          <q-card-section>
            <div class="q-pt-none">
              This is a tool that can design and generate questionnaires online. It provides various atomized form components, such as input box, radio box, file uploader, etc.
            </div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <div class="q-pt-none">
              Each form component provides rich user-defined configuration functions. You can click the question to set various filling configuration items, such as whether it is required, character length and validation rules.</div>
          </q-card-section>
          <q-separator inset />
          <q-card-section>
            <div class="q-pt-none">
              I created this tool because in 2020 we need to develop a data reporting platform for the Shanghai Municipal Education Commission, involving many business areas (such as food safety, garbage classification). To reduce the business code development, I encapsulated Quasar Form components and defined a set of models. Questionnaire can be designed and rendered by JSON for users to fill in. This tool greatly reduces the development workload of the project, and makes the project delivery 3 months ahead of schedule.</div>
          </q-card-section>
          <q-card-section>
            <div class="q-pt-none">
              <span>GitHub : </span>
              <a href>https://github.com/ahjszhx/form_generator.git</a>
            </div>
            <div class="text-h6">Thanks for your review and may you have a nice day !</div>
          </q-card-section>
          <br />
          <q-card-section align="center">
            <q-btn
              color="orange"
              icon-right="send"
              label="Try it now"
              @click="tryIt()"
              size="20px"
            />
          </q-card-section>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="card-box">
      <div class="card-style">
        <div class="card-top">Practical Links</div>
        <div class="card-content row">
          <div
            class="app-wrap col-6 col-sm-4"
            v-for="(item, index) of appList"
            :key="index"
            @click="toChildSystem(item)"
          >
            <div class="app-box  radius">
              <div class="app-top">
                <q-img :src="item.appIcon" />
                <div>{{ item.appName }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-style">
        <div class="card-top">Admissions Data</div>
        <div class="card-content row">
          <div
            class="data-wrap col-12 col-sm-6"
            v-for="(item, index) of schoolDataList"
            :key="index"
          >
            <div class="data-box radius">
              <div>{{ item.title }}</div>
              <div class="num">{{ item.number }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getIndexSessionUser,
  getIndexMessage,
  getIndexSchoolData,
  getIndexTransaction
} from "../../api/data";
export default {
  data () {
    return {
      userInfo: {}, // 用户信息
      messageList: [],
      appList: [],
      schoolDataList: [], // 数据中心,
      allTodoNumber: "--", //总进行中任务数量
      allDoneNumber: "--" //总已完成任务数量
    };
  },
  mounted () {
    this.getIndexSessionUser();
    this.getIndexSchoolData();
    this.getIndexMessage();
    this.getIndexTransaction();
  },
  methods: {
    tryIt () {
      this.$router.push({ path: '/demo/form_editor' })
    },
    toChildSystem (item) {
      let url = item.url
      if (url.startsWith("http")) {
        window.location.href = url
      }
    },
    getIndexSessionUser () {
      getIndexSessionUser().then(res => {
        console.log(res);
        if (res.data.suc) {
          let userInfo = res.data.data;
          if (!userInfo.avatar) {
            userInfo.avatar = "https://files.catbox.moe/e879g4.png";
          }
          this.userInfo = res.data.data;
          this.userInfo.avatar = require(`../../statics/avatar/${res.data.data.avatar}`);
        }
      });
    },
    getIndexSchoolData () {
      getIndexSchoolData().then(res => {
        if (res.data.suc) {
          this.schoolDataList = res.data.data;
        }
      });
    },
    getIndexMessage () {
      getIndexMessage().then(res => {
        if (res.data.suc) {
          this.messageList = res.data.data;
        }
      });
    },
    getIndexTransaction () {
      getIndexTransaction().then(res => {
        if (res.data.suc) {
          let appList = res.data.data;
          let allTodoNumber = 0;
          let allDoneNumber = 0;
          for (let item of appList) {
            item.appIcon = require(`../../statics/icons/${item.appIcon}`);
            allTodoNumber += item.todo;
            allDoneNumber += item.done;
          }
          this.appList = appList;
          this.allTodoNumber = allTodoNumber;
          this.allDoneNumber = allDoneNumber;
        }
      });
    }
  },
  computed: {
    imgStyle () {
      if (!this.userInfo.background) {
        return {
          background: '#003865'
        };
      }
      else {
        return {
          background: this.userInfo.background
        }
      }

    },
  }
};
</script>

<style lang="scss" scoped>
.home-page {
  background: #fafafd;
  min-height: calc(100vh - var(--headerHeight));
  display: flex;
  flex-direction: row;
  padding: 20px;
  > :nth-child(1) {
    width: 65%;
    min-width: 630px;
    margin-right: 20px;
  }
  > :nth-child(2) {
    flex: 1;
    width: 35%;
  }
}
.card-box {
  display: flex;
  flex-direction: column;
}
.card-style {
  & + .card-style {
    margin-top: 20px;
    flex: 1;
  }
  .card-top {
    padding: 10px 16px;
    font-weight: bold;
    font-size: 1rem;
    border-bottom: 1px solid var(--link);
  }
  .card-content {
    padding: 10px 16px;
    font-size: 16px;
  }
}
.message-line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: #a7a6af;
  line-height: 2rem;
  font-size: 1rem;
  .message-title {
    display: inline-block;
    white-space: nowrap;
    width: calc(100% - 100px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.user-card {
  display: flex;
  flex-direction: row;
  height: 180px;
}
.user-box {
  width: 60%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: inherit;
  padding: 3%;
  display: flex;
  flex-direction: row;
  align-items: center;
  > * {
    position: relative;
    color: #fff;
  }
}
.user-box::before {
  content: "";
  position: absolute;
  left: -30px;
  width: 35vw;
  height: 30vw;
  min-width: 400px;
  min-height: 400px;
  background: linear-gradient(-40deg, #004ecf, #0087cf);
  border-radius: 50%;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 0;
}
.user-avatar {
  height: 120px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    position: relative;
    z-index: 10;
    width: 70%;
    border-radius: 50%;
  }
}
.user-avatar::after {
  content: "";
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  z-index: 1;
}
.user-avatar::before {
  content: "";
  position: absolute;
  height: 78%;
  width: 78%;
  background: linear-gradient(-40deg, #3f99db, #88c0e9);
  border-radius: 50%;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.user-info {
  margin-left: 20px;
  font-size: 1rem;
  > * {
    margin: 6px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .username {
    font-weight: bold;
    font-size: 1.3rem;
  }
  .units {
    margin-bottom: 20px;
  }
}
.todo-box {
  flex: 1;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 3%;
  font-weight: bold;
  font-size: 1rem;
  > * {
    height: 120px;
    width: 120px;
    margin: 0 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .num {
    font-size: 2rem;
  }
  .doing::after {
    content: "";
    background: url("../../statics/icons/doing.png") no-repeat 0 0;
    background-size: 100%;
    position: absolute;
    width: 50px;
    height: 50px;
    right: -10px;
    bottom: -12px;
  }
  .finish::after {
    content: "";
    background: url("../../statics/icons/finish.png") no-repeat 0 0;
    background-size: 100%;
    position: absolute;
    width: 50px;
    height: 50px;
    right: -10px;
    bottom: -12px;
  }
}
.app-wrap {
  padding: 6px;
  .app-box {
    background: #ffffff;
    padding: 20px;
    border: 1px solid #e7e8f2;
  }
  .app-top {
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    .q-img {
      width: 26px;
      height: 26px;
      margin-right: 7px;
    }
  }
  .app-todo {
    > * {
      margin-top: 16px;
      height: 48px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      font-size: 1rem;
      font-weight: bold;
      .q-img {
        width: 1.5rem;
        height: 1.5rem;
      }
      .num {
        font-size: 1.1rem;
      }
    }
  }
}
.data-wrap {
  padding: 5px;
  .data-box {
    background: #ffffff;
    border: 1px solid #e7e8f2;
    height: 62px;
    padding: 17px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    > :nth-child(1) {
      color: #a7a6af;
      font-size: 1rem;
    }
    > :nth-child(2) {
      color: #3b3c46;
      font-size: 1.2rem;
      font-weight: bold;
    }
  }
}
</style>
