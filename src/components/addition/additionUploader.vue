<template>
  <div class="addition-wrap">
    <template v-if="cfg.display && !isDisplay">
      <q-btn
        size="sm"
        color="primary"
        flat
        icon="upload"
        label="Upload attachments"
        @click="display"
      />
    </template>
    <div v-else-if="cfg.display" class="addition-line">
      <formUpload
        :config="cfg"
        :model.sync="value"
        v-bind="$attrs"
      ></formUpload>
      <q-btn
        v-if="value.length == 0"
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
export default {
  props: {
    config: {
      type: Object
    },
    model: {
      type: [String, Number, Array],
      default: ""
    }
  },
  data() {
    return {
      cfg: { display: false, withoutCheck: true },
      value: [],
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
      this.isDisplay = this.config.display && this.value.length > 0;
    },
    display() {
      this.isDisplay = true;
    },
    cancel() {
      this.isDisplay = false;
      this.value = [];
    }
  }
};
</script>

<style scoped lang="scss">
.addition-line {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  [class^="title-"] {
    flex: 1;
    max-width: 100%;
  }
  //   :first-child {
  //     flex: 1;
  //   }
  .q-btn {
    margin-left: 6px;
  }
}

.addition-wrap {
  margin-top: 10px;
}
</style>
