<template>
  <q-dialog v-model="dialogShow">
    <q-card style="max-width: 60vw;min-width:60vw;">
      <q-toolbar class="card-top">
        <q-toolbar-title class="text-center">
          <span class="text-weight-bold">导入配置</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <!-- 弹出内容 -->
      <div class="q-pa-md" style="max-width: 100%;min-height:400px;">
        <q-input
          ref="importInput"
          autogrow
          v-model="importCode"
          filled
          type="textarea"
        />
      </div>
      <q-btn class="full-width" color="primary" label="导入" @click="iCode" />
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogShow: false,
      importCode: ""
    };
  },
  props: {
    show: Boolean,
    code: [Object, Array]
  },
  watch: {
    show(newValue, oldValue) {
      this.dialogShow = newValue;
    },
    dialogShow(newValue, oldValue) {
      if (!newValue) {
        this.$emit("update:show", newValue);
      } else {
        this.$nextTick(() => {
          this.$refs.importInput.focus()
        });
      }
    }
  },
  methods: {
    iCode() {
      this.$emit("importCode", this.importCode);
      this.dialogShow = false;
      this.importCode = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.card-top {
  position: sticky;
  top: 0;
  background-color: #fff;
  border-bottom: 1px solid #999;
}
.export-code {
  overflow-y: auto;
}
</style>
