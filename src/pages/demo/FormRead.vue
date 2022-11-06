<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="text-h5">营业结束安全巡检</div>
    <template>
      <div v-for="(subject,index) in subjects" :key="index">
        <formRadio v-if="subject.choiceType=='RADIO'"
          :config="subject.subjectConfig"
          :options="subject.options"
          :model.sync="answer[subject.id].value"
        />
        <formCheckbox v-if="subject.choiceType=='CHECKBOX'"
          :config="subject.subjectConfig"
          :options="subject.options"
          :model.sync="answer[subject.id].value"
        />
        <formSelect v-if="subject.choiceType=='SELECTOR'"
          :config="subject.subjectConfig"
          :options="subject.options"
          :model.sync="answer[subject.id].value"
        />
        <formInput v-if="subject.choiceType=='INPUT'"
          :config="subject.subjectConfig"
          :model.sync="answer[subject.id].value"
          @getState="subject.state = $event"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { getMake,getMakeAnwser } from '../../api/demo'
export default {
  data() {
    return {
      subjects:[],
      answer:{"1":"1111","2":"111","3":1}
    };
  },
  methods: {
    getMake () {
      getMake().then(res =>{
        this.subjects = res.data
        console.log(this.subjects)
      })
    },
    getMakeAnwser() {
      getMakeAnwser().then(res => {
        this.answer = res.data
      })
    }
  },
  mounted () {
    this.getMake()
    this.getMakeAnwser()
  }
};
</script>

<style></style>
