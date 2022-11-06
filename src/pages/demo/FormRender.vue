<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="text-h5">营业结束安全巡检</div>
    <template>
      <div v-for="(subject,index) in subjects" :key="index">
        <formRadio v-if="subject.choiceType=='RADIO'"
          :config="subject.subjectConfig"
          :options="subject.options"
          :model.sync="answer[subject.id]"
        />
        <formCheckbox v-if="subject.choiceType=='CHECKBOX'"
          :config="subject.subjectConfig"
          :options="subject.options"
          :model.sync="answer[subject.id]"
        />
        <formSelect v-if="subject.choiceType=='SELECTOR'"
          :config="subject.subjectConfig"
          :options="subject.options"
          :model.sync="answer[subject.id]"
        />
        <formInput v-if="subject.choiceType=='INPUT'"
          :config="subject.subjectConfig"
          :model.sync="answer[subject.id]"
          @getState="subject.state = $event"
        />
      </div>
      <q-btn label="提交" @click="submit()" color="primary" style="width:150px" />
    </template>
  </div>
</template>

<script>
import { getSubjects,saveAnswer } from '../../api/demo'
export default {
  data() {
    return {
      domainId:1,
      subjects:[],
      answer:{}
    };
  },
  methods: {
    getSubjects () {
      getSubjects(this.domainId).then(res =>{
        this.subjects = res.data
      })
    },
    submit(){
      let data = JSON.stringify(this.answer)
      saveAnswer(data).then(res=>{
        console.log(res.data)
      })
    }
  },
  mounted () {
    this.getSubjects()
  }
};
</script>

<style></style>
