<!--
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-06-08 13:21:48
 * @LastEditTime: 2021-06-09 09:46:48
 * @Email: ahjszhx@126.com
 * @FilePath: /formGenerator/src/components/formFill/categoryItem.vue
 * @Environment: Win 10
 * @Description: 
-->
<template>
  <div class="category-item-wrap">
    <template v-if="isArray(formConfig)">
      <div v-for="(config, index) of formConfig" :key="index">
        <template v-if="config.categoryTitle">
          <div class="category-title">{{ config.categoryTitle }}</div>
        </template>
        <template v-if="config.subjects && config.subjects.length > 0">
          <form-component
            class="form-component"
            v-for="(subject, index) of config.subjects"
            :key="index"
            :type="choiceTypeDict[subject.choiceType]"
            :config="subject.subjectConfig"
            :options="subject.options"
            :model.sync="result[subject.id]"
            v-bind="$attrs"
          />
        </template>
        <template v-if="config.childs">
          <!-- 递归 -->
          <categoryItem
            class="child-category"
            :formConfig="config.childs"
            :choiceTypeDict="choiceTypeDict"
            :result="result"
            v-bind="$attrs"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="formConfig.categoryTitle">
        <div class="category-title">{{ formConfig.categoryTitle }}</div>
      </template>
      <template v-if="formConfig.subjects && formConfig.subjects.length > 0">
        <form-component
          class="form-component"
          v-for="(subject, index) of formConfig.subjects"
          :key="index"
          :type="choiceTypeDict[subject.choiceType]"
          :config="subject.subjectConfig"
          :options="subject.options"
          :model.sync="result[subject.id]"
          v-bind="$attrs"
        />
      </template>
      <template v-if="formConfig.childs">
        <!-- 递归 -->
        <categoryItem
          class="child-category"
          :formConfig="formConfig.childs"
          :choiceTypeDict="choiceTypeDict"
          :result="result"
          v-bind="$attrs"
        />
      </template>
    </template>
  </div>
</template>

<script>
const util = require("./utils/util");
export default {
  name: "categoryItem",
  props: ["formConfig", "choiceTypeDict", "result"],
  data() {
    return {};
  },
  methods: {
    ...util
  }
};
</script>

<style lang="scss" scoped>
.category-item-wrap {
  // padding: 10px;
  .category-title{
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
  }
}
.child-category {
  margin-bottom: 20px;
  padding: 24px 24px 0;
  border-radius: 12px;
  background-color: rgba($color: rgb(0, 0, 0), $alpha: 0.02);
}
.child-category   .child-category {
//   margin-left: 24px;
}
</style>
