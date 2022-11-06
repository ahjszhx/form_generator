<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div
      class="domain-line-wrap"
    >
      <div class="dividing_line"></div>
    </div>
  </form-title>
</template>

<script>
/**
 * 传入参数
 * model(默认值，已有值)
 *
 * config:
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
export default {
  name: "formDomainLine",
  components: { formTitle },
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      cfg: {}
    };
  },
  watch: {
    config: {
      handler: function(newValue, oldValue) {
        this.initCfg(newValue);
      },
      immediate: true
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
.dividing_line {
  height: 0;
  width: 100%;
  border-top: 1px dashed #aaa;
  margin: 8px 0;
}
</style>
