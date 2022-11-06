<!--
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-05-12 10:15:51
 * @LastEditTime: 2021-05-26 13:20:04
 * @Email: ahjszhx@126.com
 * @FilePath: /formGenerator/src/pages/demo/FormFill.vue
 * @Environment: Win 10
 * @Description: 
-->
<template>
  <div>
    <!-- noSubmit，
      noSave -->
    <formFill
      :formConfig="formConfig"
      :formTitle="formTitle"
      :answer="answer"
      @submit="submit"
      @save="save"
      :uploadUrl="uploadUrl"
      downloadUrl="http://xxx.hq.gench.edu.cn:9801/api/pc/img/download"
    ></formFill>
  </div>
</template>

<script>
import { baseUrl } from "src/api/data";

//const testdata =[{"canDrag":true,"choiceType":"INPUT","subjectConfig":{"title":"请填写本项内容","titleNum":1,"format":"TEXT","placerHolder":"Please fill in here","mandatory":true,"remarkConfig":{"display":false},"uploaderConfig":{"display":false},"categoryTitle":"","categoryId":0}},{"canDrag":true,"choiceType":"RADIO","subjectConfig":{"title":"Please select an option","titleNum":2,"mandatory":true,"remarkConfig":{"display":false},"uploaderConfig":{"display":false},"categoryTitle":"","categoryId":0},"options":[{"label":"Option1","value":"1"},{"label":"Option2","value":"2"}]},{"canDrag":true,"choiceType":"DESCR","subjectConfig":{"content":"<p>请阅读本项说明，然后填写1111111111<img src=\"http://xxx.hq.gench.edu.cn:9802/api/pc/img/download?fileName=92b0952e1d9b4ece9f26413b1d870798微信图片_20210329102718.jpg\" contenteditable=\"false\" style=\"color: var(--black); font-size: 14px; max-width: 100%;\"/></p>","isShowTitleNum":false,"titleNum":"","categoryTitle":"","categoryId":0,"remarkConfig":{},"uploaderConfig":{}}},{"canDrag":true,"choiceType":"FILEUPLOADER","subjectConfig":{"title":"请上传文件","format":"file","maxFileCount":"1","titleNum":3,"mandatory":true,"remarkConfig":{"display":false,"format":"TEXT"},"uploaderConfig":{"display":false,"format":"FILE"},"categoryTitle":"","categoryId":0}}];
const testdata = []

export default {
  data() {
    return {
      uploadUrl:`${baseUrl()}/api/pc/img/upload`,
      uploadUrl:`http://xxx.hq.gench.edu.cn/api/pc/img/upload`,
      formConfig: testdata,
      formTitle: "DEMO表单标题",
      answer: {
        "1": { value: "1", remark: null, uploader: null },
        "2": { value: "2", remark: null, uploader: null },
        "3": { value: ["2"], remark: null, uploader: null },
        "4": { value: "2", remark: null, uploader: null }
      }
    };
  },
  methods: {
    submit(event) {
      console.log(event);
      this.answer = event;
    },
    save(event) {
      console.log(event);
      this.answer = event;
    }
  }
};
</script>

<style></style>
