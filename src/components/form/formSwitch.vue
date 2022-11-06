<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div class="switch-wrap">
      <q-toggle v-model="value" color="primary" :disable="cfg.disable" />
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
 * disable(不可用)[True|False]
 * isShowTitleNum(是否显示序号)
 *
 * 方法：
 * change：
 * 传出选择内容
 */
import formTitle from "./formTitle.vue";
const util = require("./utils/util");

export default {
  name: "formSwitch",
  components: { formTitle },
  props: {
    config: {
      type: Object,
      required: true
    },
    model: {
      type: [String, Number, Boolean],
      default: undefined
    }
  },
  data() {
    return {
      value: false,
      cfg: {}
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
      //   this.verify();
    }
  },
  methods: {
    initCfg(config) {
      this.cfg = config;
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
.title-position-left .switch-wrap {
  padding-bottom: 20px;
}
.title-position-between .switch-wrap {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 20px;
}
</style>
