<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div class="input-wrap">
      <template v-if="cfg.withoutCheck">
        <q-input
          dense
          outlined
          bg-color="white"
          v-model="value"
          @blur="verify"
          :type="cfg.format"
          :maxlength="cfg.maxLength"
          :placeholder="cfg.placerHolder"
          :disable="cfg.disable"
          :readonly="cfg.readonly"
        />
      </template>
      <template v-else>
        <q-input
          dense
          outlined
          bg-color="white"
          v-model="value"
          :error="iserror"
          :error-message="errorText"
          @blur="verify"
          :type="cfg.format"
          :maxlength="cfg.maxLength"
          :placeholder="cfg.placerHolder"
          :disable="cfg.disable"
          :readonly="cfg.readonly"
        />
      </template>
    </div>
  </form-title>
</template>

<script>
/**
 * 传入参数
 * model(默认值，已有值)
 *
 * config:
 * format(格式):text(不限),password(密码),number(数字),phone(手机号),idcard(身份证),email(邮箱)
 * minLength(最小长度)
 * maxLength(最大长度)
 * mandatory(是否必填)
 * placerHolder(占位符)
 * disable(不可用)[True|False]
 * readonly(只读)[True|False]
 * title(标题)
 * titleNum(标题序号)
 * withoutCheck(不需要校验，底部padding消失)
 * isShowTitleNum(是否显示序号)
 *
 * 方法：
 * change：
 * 传出内容
 * getstate:
 * 传出内容是否符合要求，符合要求返回Ture,否则返回False
 */
const formatDict = {
  TEXT: "text", // 不限
  PASSWORD: "password", // 密码
  NUMBER: "number", // 数字
  PHONE: "phone", // 手机号
  IDCARD: "idcard", // 身份证
  EMAIL: "email", // 邮箱
  DAY: "date", //  天
  MINUTE: "time" // 时间
};
import formTitle from "./formTitle.vue";
const util = require("./utils/util");
export default {
  name: "formInput",
  components: { formTitle },
  props: {
    config: {
      type: Object,
      required: true
    },
    model: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      iserror: false,
      errorText: "",
      cfg: {},
      value: ""
    };
  },
  watch: {
    config: {
      handler: function(newValue, oldValue) {
        this.initCfg(newValue);
      },
      immediate: true
    },
    model: {
      handler: function(newValue, oldValue) {
        if (util.isFill(newValue)) {
          this.value = newValue;
        }
      },
      immediate: true
    },
    value(newValue, oldValue) {
      this.$emit("change", newValue);
      this.$emit("update:model", newValue);
      if (this.iserror) {
        // 已处于错误状态则每次更新都检测
        this.verify();
      }
    },

    iserror(newValue, oldValue) {
      this.$emit("getState", !newValue);
    }
  },
  methods: {
    // 初始化cfg
    initCfg(config) {
      config.format = formatDict[config.format]
        ? formatDict[config.format]
        : "text";
      // text(不限),password(密码),number(数字),phone(手机号),idcard(身份证),email(邮箱)
      if (config.format === "phone") {
        config.minLength = 11;
        config.maxLength = 11;
      }
      this.cfg = config;
    },
    //校验
    verify() {
      const { cfg, value } = this;
      //   console.log("input verify");
      //长度要求
      //format要求
      if (cfg.withoutCheck) {
        this.normalState();
      } else if (cfg.mandatory && util.isEmpty(value)) {
        this.errorState(`Please enter the content`);
      } else if (cfg.format === "phone" && !util.checkPhone(value)) {
        this.errorState(`Please enter the correct mobile phone number`);
      } else if (cfg.format === "idcard" && !util.checkIdCard(value)) {
        this.errorState(`Please enter the correct ID number`);
      } else if (cfg.format === "email" && !util.checkEmail(value)) {
        this.errorState(`Please enter the correct email address`);
      } else if (cfg.minLength && cfg.minLength > value.length) {
        this.errorState(`Please enter at least${cfg.minLength}characters`);
      } else if (cfg.maxLength && cfg.maxLength < value.length) {
        this.errorState(`Please enter at most${cfg.maxLength}characters`);
      } else {
        this.normalState();
      }
    },
    errorState(errorText) {
      this.iserror = true;
      this.errorText = errorText;
    },
    normalState() {
      this.iserror = false;
      this.errorText = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
</style>
