<template>
  <div class="addition-wrap">
    <template v-if="cfg.display && !isDisplay">
      <q-btn
        size="sm"
        color="primary"
        flat
        icon="drive_file_rename_outline"
        label="Add Comments"
        @click="display"
      />
    </template>
    <div v-else-if="cfg.display" class="addition-line">
      <form-input :config="cfg" :model.sync="value" />
      <q-btn
        round
        size="md"
        color="primary"
        flat
        icon="cancel"
        @click="cancel"
      />
    </div>
  </div>
</template>

<script>
import formInput from "../form/formInput.vue";
export default {
  components: { formInput },
  props: {
    config: {
      type: Object
    },
    model: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      cfg: { display: false, withoutCheck: true },
      value: "",
      isDisplay: false
    };
  },
  watch: {
    config: {
      handler: function(newValue, oldValue) {
        if (newValue != undefined) {
          newValue.withoutCheck = true;
          this.cfg = newValue;
          this.initIsDisplay();
        }
      },
      immediate: true
    },
    model: {
      handler: function(newValue, oldValue) {
        if (newValue) {
          this.value = newValue;
          this.initIsDisplay();
        }
      },
      immediate: true
    },
    value(newValue, oldValue) {
      this.$emit("update:model", newValue);
    }
  },
  methods: {
    initIsDisplay() {
      this.isDisplay = this.config.display && this.value;
    },
    display() {
      this.isDisplay = true;
    },
    cancel() {
      this.isDisplay = false;
      this.value = "";
    }
  }
};
</script>

<style scoped lang="scss">
.addition-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
  :first-child {
    flex: 1;
  }
  .q-btn {
    margin-left: 6px;
  }
}
.addition-wrap {
  margin-top: 10px;
}
</style>
