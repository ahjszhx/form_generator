<template>
  <q-dialog v-model="dialogShow">
    <q-card style="max-width: 60vw;min-width:60vw;">
      <q-toolbar class="card-top">
        <q-btn
          class="copy-icon"
          flat
          round
          dense
          icon="content_copy"
          :data-clipboard-text="JSON.stringify(code)"
          @click="copy"
        >
          <q-tooltip
            anchor="top middle"
            self="center middle"
            transition-show="scale"
            transition-hide="scale"
            :offset="[10, 18]"
            >复制
          </q-tooltip>
        </q-btn>

        <q-toolbar-title class="text-center">
          <span class="text-weight-bold">导出配置</span>
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <!-- 弹出内容 -->
      <div class="bg-code export-code">
        <pre class="doc-code language-html">
              <code class="doc-code__inner language-html">{{ code }}</code>
          </pre>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import Clipboard from "clipboard";
export default {
  data() {
    return {
      dialogShow: false
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
      }
    }
  },
  methods: {
    copy() {
      let clipboard = new Clipboard(".copy-icon"); // 这里括号里填写上面点击事件绑定的class名
      clipboard.on("success", e => {
        // 复制成功，提示根据自己项目实际使用的UI来写
        this.$q.notify({
          position: "top",
          type: "positive",
          message: "复制成功"
        });
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制，提示根据自己项目实际使用的UI来写
        this.$q.notify({
          position: "top",
          type: "warning",
          message: "该浏览器不支持自动复制"
        });
        // 释放内存
        clipboard.destroy();
      });
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
