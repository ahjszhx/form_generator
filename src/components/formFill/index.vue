<template>
  <div class="form-fill-wrap">
    <div class="form-title" v-if="formTitle">{{ formTitle }}</div>
    <form-component
      class="form-component"
      v-for="(item, index) of formConfig"
      :key="index"
      :type="choiceTypeDict[item.choiceType]"
      :config="item.subjectConfig"
      :options="item.options"
      :model.sync="result[item.id]"
      v-bind="$attrs"
    />
    <div class="save-wrap" v-if="!noSubmit">
      <q-btn
        v-if="!noSave"
        color="primary"
        outline
        class="card-style"
        label="Save"
        size="lg"
        @click="save"
      /><q-btn
        style="flex:2;"
        color="primary"
        class="card-style"
        label="Submit"
        size="lg"
        @click="submit"
      />
    </div>
  </div>
</template>

<script>
const ChoiceTypeDict = {
  INPUT: "form-input",
  input: "form-input",
  RADIO: "form-radio",
  radio: "form-radio",
  CHECKBOX: "form-checkbox",
  checkbox: "form-checkbox",
  SELECTOR: "form-select",
  selector: "form-select",
  FILEUPLOADER: "form-upload",
  fileuploader: "form-upload",
  IMAGEUPLOADER: "form-upload",
  imageuploader: "form-upload",
  DOMAIN: "form-domain-line",
  doamin: "form-domain-line",
  DESCR: "form-descr",
  descr: "form-descr"
};
export default {
  props: {
    formConfig: {
      // 问卷配置
      type: Array
    },
    formTitle: {
      // 问卷标题
      type: String
    },
    answer: {
      // 已有答案
      type: Object,
      default: undefined
    },
    noSubmit: {
      // 是否不显示提交按钮
      type: Boolean
    },
    noSave: {
      // 是否不显示保存按钮
      type: Boolean
    }
  },
  watch: {
    answer: {
      handler: function(newValue, oldValue) {
        // console.log("answer", newValue, this.isFill(newValue));
        if (this.isFill(newValue)) {
          this.result = newValue;
        } else {
          this.initResult();
        }

      },
      immediate: true
    }
  },
  data() {
    return {
      choiceTypeDict: ChoiceTypeDict,
      result: {}
    };
  },
  methods: {
    initResult() {
      const { formConfig, result } = this;
      for (let item of formConfig) {
        result[item.id] = {
          value: null,
          remark: null,
          uploader: null
        };
      }
    },
    // 提交，需要校验
    submit() {
      const { result, formConfig } = this;
      let finishIndex = 0;
      for (
        let index = 0;
        index < formConfig.length;
        index++, finishIndex = index
      ) {
        let config = formConfig[index];
        if (config.subjectConfig.mandatory) {
          // 是必填项
          let resultKey = config.id ? config.id : index;
          let value = result[resultKey].value;
          if (!this.isFill(value)) {
            // 未填写
            break;
          }
        }
      }
      // console.log("finishIndex", finishIndex);
      if (finishIndex !== formConfig.length) {
        // 提前结束，有未填写内容
        const titleNum = formConfig[finishIndex].subjectConfig.titleNum;
        this.$q.notify({
          position: "top",
          type: "warning",
          message: `${
            titleNum
              ? "The" + titleNum + "quesiont"
              : formConfig[finishIndex].subjectConfig.title
          }is required, please fill in and submit`
        });
      } else {
        // 不存在问题，抛出填写内容
        this.$emit("submit", result);
      }
    },
    // 保存，不校验
    save() {
      const { result } = this;
      this.$emit("save", result);
    },
    /**
     * 内容是否填写
     * @return {Boolean} true:已填写;false:未填写
     */
    isFill(value) {
      // 是否填写
      if (value === null || value === "" || value === undefined) {
        return false;
      } else if (
        typeof value == "object" &&
        value instanceof Array &&
        value.length == 0
      ) {
        // 数组
        return false;
      } else if (typeof value == "object" && JSON.stringify(value) === "{}") {
        // 对象
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-fill-wrap {
  max-width: 814px;
  min-width: 300px;
  padding: 40px 30px 30px;
  margin: 0 auto 10px;
}
* + .form-fill-wrap {
  padding: 20px;
}
.form-component + .form-component {
  margin-top: 10px;
}
.form-title {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}
.save-wrap {
  width: 100%;
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  button + button {
    margin-left: 8px !important;
  }
  button {
    width: 20%;
    min-width: 100px;
  }
}
// 屏幕宽度小于500px后，保存按钮上下排列
@media screen and (max-width: 500px) {
  .save-wrap {
    width: 100%;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    button + button {
      margin-top: 12px !important;
      margin-left: 0 !important;
    }
    button {
      width: 100%;
      // min-width: 100px;
    }
  }
}
</style>
