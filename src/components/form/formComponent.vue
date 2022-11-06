<template>
  <div class="form-component-wrap">
    <component
      :is="type"
      :config="config"
      :options="options"
      :model.sync="value.value"
      v-bind="$attrs"
    />
    <addition-remark
      :config="config.remarkConfig"
      :model.sync="value.remark"
      v-bind="$attrs"
    />
    <addition-uploader
      :config="config.uploaderConfig"
      :model.sync="value.uploader"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import AdditionRemark from "../addition/additionRemark.vue";
import AdditionUploader from "../addition/additionUploader.vue";
export default {
  components: {
    AdditionRemark,
    AdditionUploader
  },
  props: {
    type: {
      type: String
    },
    config: {
      type: Object
    },
    options: {
      type: Array
    },
    model: {
      type: [String, Object, Array],
      default: ""
    }
  },
  watch: {
    model: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.value = newValue;
        }
      },
      immediate: true
    },
    value(newValue, oldValue) {
      this.$emit("update:model", newValue);
    }
  },
  data() {
    return {
      value: {}
    };
  }
};
</script>

<style></style>
