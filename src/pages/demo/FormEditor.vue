<!--
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-03-12 10:21:16
 * @LastEditTime: 2021-05-21 10:04:41
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/pages/demo/FormEditor.vue
 * @Environment: Win 10
 * @Description: 
-->
<template>
  <div>
    <form-editor
      @save="save"
      :developMode="true"
      :optionsSourceUrl="optionsSourceUrl"
      :formTitle="title.domainTitle"
      :questionConfig="questionConfig"
      :uploadUrl="uploadUrl"
    >
    </form-editor>
    <q-dialog
      v-model="showLetter"
      persistent
    >
      <q-card
        flat
        bordered
        class="my-card"
      >
        <q-card-section align="center">
          <div class="text-h6">Instructions</div>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-none">
            Please click the component on the left to add a question</div>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-none">
            Please click the question to set various filling configuration items.</div>
        </q-card-section>
        <q-card-section>
          <div class="q-pt-none">
            These configurations will take effect when you click Save.</div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            class="full-width"
            style="margin-bottom:10px;"
            color="primary"
            :label="
              `${timerNum != 0 ? + timerNum + 's' : 'I am ready to use'}`
            "
            :disable="timerNum != 0"
            @click="hideLetterDialog()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { saveForm, getSubjects } from "../../api/demo";
import { baseUrl } from "src/api/data";
export default {
  data () {
    return {
      uploadUrl: `${baseUrl()}/api/pc/img/upload`,
      timerNum: 0, // 倒计时用
      timeClock: null, // 计时器
      showLetter: false, // 显示承诺书
      confirm: false,
      categories: [],
      title: {},
      questionConfig: null,
      optionsSourceUrl: `${baseUrl()}/score/dict/info`
    };
  },
  methods: {
    showLetterDialog () {
      this.timerNum = 2;
      var that = this;
      var timeClock = setInterval(function () {
        that.timerNum = that.timerNum - 1;
        if (that.timerNum == 0) {
          clearInterval(timeClock);
        }
      }, 1000);
      this.showLetter = true;
    },
    hideLetterDialog () {
      this.showLetter = false;
      localStorage.setItem("showLetter", true);
    },
    getSubjects () {
      console.log('requestTitle', this.title)
      getSubjects(1).then(res => {
        this.questionConfig = res.data
        console.log('questionConfig', this.questionConfig)
      })
    },
    save (event) {
      this.questionConfig = event;
      console.log("questionConfig", event);
      let data = JSON.stringify(this.questionConfig);
      saveForm(data, this.title).then(res => {
        this.getSubjects()
        if (res.data.suc == true) {
          this.$q
            .dialog({
              title: "Complete Reminder",
              message: '<span class="text-blue">You have successfully created a questionnaire. Do you want to fill it out now?</span>',
              cancel: {
                flat: true,
                label: "cancel"
              },
              ok: {
                label: "confirm"
              },
              html: true
            })
            .onOk(() => {
              //   console.log(">>>> OK");
              this.$router.push({ path: '/demo/form_render' })
            })
            .onCancel(() => {
              // console.log('>>>> Cancel')
            })
        }
      });
    }
  },
  mounted () {
    this.getSubjects()
    console.log(JSON.parse(localStorage.getItem('categories')))
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    this.title = { domainId: 1, domainTitle: 'Demo Questionnaire of' + ' ' + userinfo.username }
    if (!JSON.parse(localStorage.getItem("showLetter"))) {
      this.showLetterDialog()
    }
  }
};
</script>

<style>
.q-pt-none {
  font-size: 16px;
}
.my-card {
  width: 45vw;
}
</style>
