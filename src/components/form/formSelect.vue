<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div
      class="select-wrap"
      :class="{ error: iserror, withoutCheck: cfg.withoutCheck }"
    >
      <q-select
        dense
        outlined
        bg-color="white"
        slot="right"
        emit-value
        map-options
        :option-value="optionValue"
        :option-label="optionLabel"
        v-model="value"
        :options="opt"
        :disable="cfg.disable"
        :readonly="cfg.readonly"
      >
        <template v-slot:selected>
          <div v-if="value">
            {{
              opt[opt.findIndex(val => val[optionValue] == value)][optionLabel]
            }}
          </div>
          <div v-else class="placeholder-style">{{ cfg.placerHolder }}</div>
        </template>
      </q-select>
      <div class="q-field__bottom row items-start" v-if="!cfg.withoutCheck">
        <div class="q-field__messages col text-negative">{{ errorText }}</div>
      </div>
    </div>
  </form-title>
</template>

<script>
/**
 * 传入参数
 * model(默认值，已有值)
 *
 * config:
 * mandatory(是否必填)
 * placerHolder(占位符)
 * disable(不可用)[True|False]
 * readonly(只读)[True|False]
 * withoutCheck(不需要校验)
 * isShowTitleNum(是否显示序号)
 *
 * options:
 * [{label:"",value:""}]
 *
 * optionValue(option中值字段的名称)
 * optionLabel(option中标签字段的名称)
 *
 * 方法：
 * change：
 * 传出选择内容
 */
import formTitle from "./formTitle.vue";
const util = require("./utils/util");

export default {
  name: "formSelect",
  components: { formTitle },
  props: {
    config: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    model: {
      type: [String, Number, Boolean],
      default: undefined
    },
    optionValue: {
      //option中值字段的名称
      type: [String, Number],
      default: "value"
    },
    optionLabel: {
      //option中标签字段的名称
      type: [String, Number],
      default: "label"
    }
  },
  data() {
    return {
      value: null,
      cfg: {},
      opt: [],
      iserror: false,
      errorText: ""
    };
  },
  watch: {
    config: {
      handler: function(newValue, oldValue) {
        this.initCfg(newValue);
      },
      immediate: true
    },
    options: {
      handler: function(newValue, oldValue) {
        this.initOpt(newValue);
      },
      immediate: true
    },
    model: {
      handler: function(newValue, oldValue) {
        if (util.isFill(newValue)) {
          this.value = newValue.toString();
        }
      },
      immediate: true
    },
    value(newValue, oldValue) {
      this.$emit("change", newValue);
      this.$emit("update:model", newValue);
      //   this.verify();
    }
  },
  methods: {
    initCfg(config) {
      this.cfg = config;
    },
    initOpt(options) {
      this.opt = options;
    },
    errorState(errorText) {
      this.iserror = true;
      this.errorText = errorText;
    },
    normalState() {
      this.iserror = false;
      this.errorText = " ";
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
</style>
