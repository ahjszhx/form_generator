<template>
  <div class="component-content-wrap">
    <template v-if="choiceTypeDict[type] === 'form-select'">
      <form-component
        :type="choiceTypeDict[type]"
        :config="cfg"
        :options="options"
      />

      <!-- <formSelect :config="cfg" :options="options" /> -->
      <div
        class="radio-options-box q-option-group q-gutter-x-sm q-option-group--inline"
        v-for="item of options"
        :key="item.value"
      >
        <div class="q-radio no-outline row inline no-wrap items-center q-mt-sm">
          <q-icon size="md" name="arrow_drop_down" />
          <div>{{ item.label }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <form-component
        :type="choiceTypeDict[type]"
        :config="cfg"
        :options="options"
      />
    </template>
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
  name: "componentContent",
  props: {
    config: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    options: {
      type: Array
    }
  },
  watch: {
    config: {
      handler(newValue, oldValue) {
        this.$nextTick(function() {
          // console.log("config");
          let cfg = this.deepCopy(newValue);
          delete cfg.title;
          delete cfg.titleNum;
          cfg.withoutCheck = true;
          this.cfg = cfg;
        });
      },
      deep: true,
      immediate:true
    }
  },
  data() {
    return {
      choiceTypeDict: ChoiceTypeDict,
      cfg: {}
    };
  },
  methods: {
    deepCopy(obj) {
      // console.log("deepCopy", obj);
      var result = Array.isArray(obj) ? [] : {};
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key]); //递归复制
          } else {
            result[key] = JSON.parse(JSON.stringify(obj[key]));
          }
        }
      }
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
.component-content-wrap {
  pointer-events: none;
}
</style>
