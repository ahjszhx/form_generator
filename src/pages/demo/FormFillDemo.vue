<template>
  <div>
    <formFill
      :formConfig="formConfig"
      :formTitle="formTitle"
      @submit="submit"
      @save="submit"
    ></formFill>
  </div>
</template>

<script>
import { getSubjects, saveAnswer } from '../../api/demo'

const testdata = [
  {
    id: "1",
    canDrag: true,
    choiceType: "INPUT",
    subjectConfig: {
      title: "Please fill in this item",
      titleNum: 1,
      format: "TEXT",
      placerHolder: "Please fill in here",
      mandatory: true,
      categoryTitle: "",
      categoryId: 0
    }
  },
  {
    id: "2",
    canDrag: true,
    choiceType: "RADIO",
    subjectConfig: {
      title: "Please select an option",
      titleNum: 2,
      mandatory: true,
      categoryTitle: "",
      categoryId: 0
    },
    options: [
      { label: "Option1", value: "1" },
      { label: "Option2", value: "2" }
    ]
  },
  {
    id: "3",
    canDrag: true,
    choiceType: "CHECKBOX",
    subjectConfig: {
      title: "Please select the following options (multiple choices)",
      titleNum: 3,
      mandatory: true,
      categoryTitle: "",
      categoryId: 0
    },
    options: [
      { label: "Option1", value: "1", disable: false },
      { label: "Option2", value: "2", disable: false }
    ]
  },
  {
    id: "4",
    canDrag: true,
    choiceType: "SELECTOR",
    subjectConfig: {
      title: "Please select an option",
      titleNum: 4,
      placerHolder: "Please click here to select options",
      mandatory: true,
      categoryTitle: "",
      categoryId: 0
    },
    options: [
      { label: "Option1", value: "1" },
      { label: "Option2", value: "2" }
    ]
  }
];

export default {
  data () {
    return {
      domainId: 1,
      formConfig: testdata,
      formTitle: "DEMO Questionnaire",
      answer: {}
    };
  },
  methods: {
    getSubjects () {
      getSubjects(this.domainId).then(res => {
        this.formConfig = res.data
      })
    },
    submit (event) {
      console.log(1111)
      let data = JSON.stringify(event)
      console.log(data)
      saveAnswer(data).then(res => {
        this.$q.notify({
          position: 'top',
          color: 'green-5',
          textColor: 'white',
          message: 'Submitted successfully'
        })
      })
    }
  },
  mounted () {
    this.getSubjects()
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    this.formTitle = 'Demo Questionnaire of' + ' ' + userinfo.username
  }
};
</script>

<style></style>
