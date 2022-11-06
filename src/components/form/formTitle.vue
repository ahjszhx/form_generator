<!--
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-05-31 14:06:14
 * @LastEditTime: 2021-06-03 13:49:47
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/components/form/formTitle.vue
 * @Environment: Win 10
 * @Description: 
-->
<template>
  <div :class="`title-position-${titlePosition}`">
    <div
      class="title-wrap"
      :class="{ subtitle: subtitle }"
      v-if="title"
    >
      <span
        class="titleNum"
        v-if="titleNum"
      > {{ titleNum }}. </span>
      <span :class="{ mandatory: mandatory }">{{ title }}</span>
      <!-- <span class="asterisk" v-if="mandatory">*</span> -->
    </div>
    <div class="form-item">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * 传入参数
 * title(标题)
 * titleNum(序号)
 * mandatory(是否必填)[True|False]
 * titlePosition(标题位置)[top|left|between]
 * subtitle(副标题)[True|False]
 *
 */
export default {
  name: "formTitle",
  props: {
    title: {
      type: [String, Number],
      default: ""
    },
    titleNum: {
      type: [String, Number],
      default: ""
    },
    mandatory: {
      type: Boolean,
      default: false
    },
    titlePosition: {
      type: [String],
      default: "top"
    },
    subtitle: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
.title-position-top {
  display: flex;
  flex-direction: column;
}

.title-position-left {
  display: flex;
  flex-direction: row;
}
.title-position-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.title-wrap {
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  .titleNum {
    margin-right: 8px;
  }
  .mandatory::after {
    content: "*";
    color: #ff6d56;
    margin-left: 5px;
    font-size: 20px;
    position: absolute;
    bottom: 1px;
  }
}

.title-wrap.subtitle {
  font-size: 14px;
  color: var(--grey);
}
.title-position-top .title-wrap {
  padding-bottom: 8px;
}
.title-position-left .title-wrap {
  margin-right: 18px;
  line-height: 30px;
  padding-bottom: 20px;
}
.title-position-between .title-wrap {
  margin-right: 18px;
  line-height: 30px;
  padding-bottom: 20px;
}
.form-item {
  flex: 1;
}
</style>
