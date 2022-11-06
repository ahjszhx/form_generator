<!--
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-05-12 15:05:32
 * @LastEditTime: 2021-05-31 14:03:15
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/components/form/formDescr.vue
 * @Environment: Win 10
 * @Description: 表单组件，备注说明
-->
<template>
  <div class="descr-wrap">
    <div v-html="cfg.content"></div>
  </div>
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
export default {
  name: "formDescr",
  props: {
    config: {}
  },
  data () {
    return {
      cfg: {}
    };
  },
  watch: {
    config: {
      handler: function (newValue, oldValue) {
        this.initCfg(newValue);
      },
      immediate: true
    }
  },
  methods: {
    initCfg (config) {
      this.cfg = config;
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
</style>
