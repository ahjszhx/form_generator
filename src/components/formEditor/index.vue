<template>
  <div class="from-editor-wrap" @click="hiddenComponentEditor">
    <component-editor
      @click.stop.native=""
      :show="showEditor"
      :showComponentEditorIndex="showComponentEditorIndex"
      v-bind="$attrs"
    ></component-editor>
    <component-selector
      :show="showSelector"
      v-bind="$attrs"
    ></component-selector>

    <component-main
      :showComponentEditorIndex="showComponentEditorIndex"
      v-bind="$attrs"
      @showComponentEditorIndex="showComponentEditorIndex = $event"
      @save="save"
    ></component-main>
  </div>
</template>

<script>
import componentEditor from "./componentEditor.vue";
import componentMain from "./componentMain.vue";
import componentSelector from "./componentSelector";
export default {
  components: { componentEditor, componentMain, componentSelector },
  props: {},
  data() {
    return {
      showSelector: true,
      showComponentEditorIndex: null
    };
  },
  computed: {
    showEditor() {
      return (
        // 是数字并且大于0时显示<component-editor>
        typeof this.showComponentEditorIndex === "number" &&
        this.showComponentEditorIndex >= 0
      );
    }
  },
  methods: {
    hiddenComponentEditor() {
      // console.log("hiddenComponentEditor");
      this.showComponentEditorIndex = null;
    },
    save(event) {
      this.$emit("save", event);
    }
  }
};
</script>
<style lang="scss" scoped>
.from-editor-wrap {
  background-color: var(--ghostWhite);
  min-height: calc(100vh - var(--headerHeight));
  position: relative;
  overflow: hidden;
}
@media screen and (max-width: 1280px) {
  .from-editor-wrap {
    min-width: 1024px;
  }
}
</style>
