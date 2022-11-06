<template>
  <div class="component-main-wrap" ref="content">
    <div class="form-title" v-if="$attrs.formTitle">{{ $attrs.formTitle }}</div>
    <template v-if="questionList.length > 0">
      <!--使用draggable组件-->
      <draggable
        v-model="questionList"
        chosenClass="dragging"
        forceFallback="true"
        animation="300"
        @start="onDragStart"
        @end="onDragEnd"
        :handle="'.candrag'"
        :delay="100"
        :touchStartThreshold="20"
      >
        <transition-group>
          <div
            class="question-card card-style not-allow-select"
            :class="{
              candrag: item.canDrag,
              showEditor: index == showComponentEditorIndex
            }"
            v-for="(item, index) in questionList"
            :key="
              `${item.subjectConfig.categoryId}_${item.subjectConfig.titleNum}`
            "
            @click.stop="showComponentEditor(index)"
          >
            <div class="question-title-wrap">
              <!-- 题号 -->
              <div class="title-num num" v-if="item.subjectConfig.titleNum">
                {{ item.subjectConfig.titleNum }}
              </div>
              <!-- 题目 -->
              <div
                class="question-title"
                :class="{ mandatory: item.subjectConfig.mandatory }"
              >
                {{ item.subjectConfig.title }}
                <!-- <span class="asterisk" v-if="item.subjectConfig.mandatory">
                  *
                </span> -->
              </div>
              <!-- 题目右侧工具栏 -->
              <div class="question-tool-wrap">
                <template v-if="item.canDrag">
                  <q-icon
                    size="sm"
                    name="import_export"
                    @click.stop="setCannotDrag(index)"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="center middle"
                      transition-show="scale"
                      transition-hide="scale"
                      :offset="[10, 18]"
                      >Draggable
                    </q-tooltip>
                  </q-icon>
                </template>
                <template v-else>
                  <q-icon
                    size="sm"
                    name="mobiledata_off"
                    @click.stop="setCanDrag(index)"
                  >
                    <q-tooltip
                      anchor="top middle"
                      self="center middle"
                      transition-show="scale"
                      transition-hide="scale"
                      :offset="[10, 18]"
                      >Non draggable
                    </q-tooltip>
                  </q-icon>
                </template>
                <q-icon
                  size="sm"
                  name="content_copy"
                  @click.stop="copyQuestion(index)"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="center middle"
                    transition-show="scale"
                    transition-hide="scale"
                    :offset="[10, 18]"
                    >copy
                  </q-tooltip>
                </q-icon>
                <q-icon
                  size="sm"
                  name="delete"
                  @click.stop="deleteQuestion(index)"
                >
                  <q-tooltip
                    anchor="top middle"
                    self="center middle"
                    transition-show="scale"
                    transition-hide="scale"
                    :offset="[10, 18]"
                    >delete
                  </q-tooltip>
                </q-icon>
              </div>
            </div>
            <!-- 题目组件内容 -->
            <div class="question-content">
              <component-content
                :config="item.subjectConfig"
                :type="item.choiceType"
                :options="item.options"
              />
            </div>
          </div>
        </transition-group>
      </draggable>
      <!-- 底部保存按钮 -->
      <div class="save-wrap">
        <q-btn
          outline
          color="white"
          text-color="primary"
          class="full-width card-style"
          label="Save and fill in the questionnaire "
          size="lg"
          @click="saveQuestion"
        />
      </div>
      <!-- <div>{{ drag ? "拖拽中" : "拖拽停止" }}</div> -->
    </template>
    <template v-else>
      <!-- 没有题目时占位提示框 -->
      <div class="empty-wrap card-style">
        <q-icon name="touch_app" color="primary" size="lg" class="q-mr-sm" />
        Please click on the left to add questions
      </div>
    </template>
    <!-- 开发模式可导入导出配置 -->
    <div class="save-wrap" v-if="developMode">
      <q-btn
        outline
        color="white"
        text-color="primary"
        class="full-width card-style"
        label="Import Configuration"
        size="lg"
        @click="importQuestion"
      />
      <q-btn
        outline
        color="white"
        text-color="primary"
        class="full-width card-style"
        label="Export Configuration"
        size="lg"
        @click="exportQuestion"
      />
    </div>
    <export-dialog :code="exportCode" :show.sync="showExportDialog" />
    <import-dialog @importCode="importCode" :show.sync="showImportDialog" />
  </div>
</template>

<script>
//导入draggable组件
import draggable from "vuedraggable";
import coontent from "./componentContent.js";
import componentContent from "./componentContent.vue";
import exportDialog from "./exportDialog.vue";
import importDialog from "./importDialog.vue";
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;

export default {
  components: {
    draggable,
    componentContent,
    exportDialog,
    importDialog
  },
  props: {
    showComponentEditorIndex: {
      type: [Number, String],
      default: null
    },
    developMode: {
      type: Boolean,
      default: false
    },
    // 已有配置
    questionConfig: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      drag: false,
      //定义要被拖拽对象的数组
      questionList: [],
      showExportDialog: false,
      showImportDialog: false,
      exportCode: null
    };
  },
  watch: {
    questionList: {
      handler(newValue, oldValue) {
        this.setTitleNum();
        this.setCategory();
      },
      immediate: true,
      deep: true
    },
    questionConfig: {
      handler(newValue, oldValue) {
        if (newValue) {
          // 注入已有配置
          this.questionList = newValue;
        }
      },
      immediate: true
    }
  },
  created() {
    // 监听content变化
    coontent.$on("addQuestion", template => {
      this.addQuestion(template);
    });
  },
  beforeDestroy() {
    content.$off("addQuestion", content => {});
  },
  methods: {
    //开始拖拽事件
    onDragStart() {
      this.drag = true;
    },
    //拖拽结束事件
    onDragEnd(e) {
      // console.log("onDragEnd", e);
      const { oldIndex, newIndex } = e;
      const { showComponentEditorIndex } = this;
      this.drag = false;

      if (showComponentEditorIndex == oldIndex) {
        // 如在编辑则更换编辑index
        this.showComponentEditor(newIndex);
      } else if (showComponentEditorIndex == newIndex) {
        // 如在拖动后的位置是原本编辑的位置，则去找员原来编辑的位置
        if (oldIndex > newIndex) {
          // 往上移
          this.showComponentEditor(showComponentEditorIndex + 1);
        } else {
          // 往下移
          this.showComponentEditor(showComponentEditorIndex - 1);
        }
      } else if (
        oldIndex < showComponentEditorIndex &&
        newIndex >= showComponentEditorIndex
      ) {
        this.showComponentEditor(showComponentEditorIndex - 1);
      } else if (
        oldIndex > showComponentEditorIndex &&
        newIndex <= showComponentEditorIndex
      ) {
        this.showComponentEditor(showComponentEditorIndex + 1);
      }
      // 重设序号
      this.setTitleNum();
      // 重设分类
      this.setCategory();
    },
    // 根据下标设置题目序号
    setTitleNum() {
      let { questionList } = this;
      let nowTitleNum = 1;
      for (let item of questionList) {
        if (item.subjectConfig.isShowTitleNum != false) {
          item.subjectConfig.titleNum = nowTitleNum;
          nowTitleNum++;
        } else {
          item.subjectConfig.titleNum = "";
        }
      }
    },
    // 根据分类线设置题目分类
    setCategory() {
      let { questionList } = this;
      let categoryTitle = "";
      let categoryId = 0;

      for (let item of questionList) {
        if (item.choiceType == "DOMAIN") {
          categoryTitle = item.subjectConfig.title;
          categoryId++;
          item.subjectConfig.categoryId = categoryId;
          item.subjectConfig.categoryTitle = categoryTitle;
        } else {
          item.subjectConfig.categoryTitle = categoryTitle;
          item.subjectConfig.categoryId = categoryId;
        }
      }
    },
    showComponentEditor(index) {
      this.$emit("showComponentEditorIndex", index);
      coontent.$emit("showComponentEditorContent", this.questionList[index]);
    },
    setCanDrag(index) {
      //   console.log("setCanDrag", index);
      this.questionList[index].canDrag = true;
    },
    setCannotDrag(index) {
      //   console.log("setCannotDrag", index);
      this.questionList[index].canDrag = false;
    },
    copyQuestion(index) {
      let cotent = this.deepClone(this.questionList[index]);
      let cotent1 = this.delObjectId(cotent); // 删除对象中id
      console.log(JSON.stringify(cotent1));
      this.questionList.splice(index+1, 0, cotent1);
      // 紧接着弹出该题的编辑框
      const newIndex = index + 1;
      this.showComponentEditor(newIndex);
    },
    deleteQuestion(index) {
      this.$q
        .dialog({
          title: "Delete Reminder",
          message: '<span class="text-red">Are you sure you want to delete?</span>',
          cancel: {
            flat: true,
            label: "cancel"
          },
          ok: {
            label: "confirm"
          },
          html: true
        })
        .onOk(() => {
          //   console.log(">>>> OK");
          this.questionList.splice(index, 1);
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    },
    addQuestion(template) {
      template = this.deepClone(template);

      this.questionList.push(template);
      const questionIndex = this.questionList.length - 1;
      this.scrollToBottom(questionIndex);
    },
    scrollToBottom: function(questionIndex) {
      this.$nextTick(() => {
        let el = this.$el.querySelectorAll(".question-card");
        el = el[questionIndex];
        setScrollPosition(getScrollTarget(el), el.offsetTop, 600);
      });
    },
    saveQuestion() {
      const { questionList } = this;
      this.$emit("save", questionList);
      // this.$q.notify({
      //   position: "top",
      //   type: "positive",
      //   message: "保存成功"
      // });
    },
    // 导入配置弹窗
    importQuestion() {
      this.showImportDialog = true;
    },
    // 导出配置弹窗
    exportQuestion() {
      this.exportCode = this.questionList;
      this.showExportDialog = true;
    },
    // 导入配置
    importCode(event) {
      // this.questionList = event;
      event = JSON.parse(event);
      if (Array.isArray(event)) {
        this.questionList = event;
        this.$q.notify({
          position: "top",
          type: "positive",
          message: "Import form succeeded"
        });
      } else if (typeof event == "object") {
        this.questionList.push(event);
        this.$q.notify({
          position: "top",
          type: "positive",
          message: "Successfully imported the title"
        });
      } else {
        this.$q.notify({
          position: "top",
          type: "warning",
          message: "Incorrect import configuration format"
        });
      }
    },
    // 删除对象中的id
    delObjectId(obj) {
      let template = this.deepClone(obj);
      if (this.isArray(template)) {
        // 是数组
        for (let item of template) {
          item = this.delObjectId(item);
        }
      } else if (this.isObject(template)) {
        // 是对象
        // if (template.id) {
        //   delete template.id;
        // }
        for (let key in template) {
          if (key == "id") {
            delete template.id;
          }
          let item = template[key];
          item = this.delObjectId(item);
        }
      }
      return template;
    },
    isArray(arr) {
      return Object.prototype.toString.call(arr) === "[object Array]";
    },
    isObject(obj) {
      return Object.prototype.toString.call(obj) === "[object Object]";
    },
    deepClone(obj) {
      // 对常见的“非”值，直接返回原来值
      if ([null, undefined, NaN, false].includes(obj)) return obj;
      if (typeof obj !== "object" && typeof obj !== "function") {
        //原始类型直接返回
        return obj;
      }
      var o = this.isArray(obj) ? [] : {};
      for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
          o[i] = typeof obj[i] === "object" ? this.deepClone(obj[i]) : obj[i];
        }
      }
      return o;
    }
  }
};
</script>
<style lang="scss" scoped>
.component-main-wrap {
  position: relative;
  padding: 20px 290px 30px;
  line-height: 1.4;
}
.form-title {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  text-align: center;
}
/*被拖拽对象的样式*/
.question-card {
  padding: 18px 26px 18px 60px;
  margin: 20px 0;
}
/*选中样式*/
.question-card.dragging {
  cursor: move !important;
  border: solid 2px var(--primary) !important;
  box-shadow: var(--ShadowSizeMd) var(--blueShadow) !important;
}
.showEditor {
  border: solid 2px var(--secondary) !important;
  box-shadow: var(--ShadowSizeMd) var(--blueShadow) !important;
}
.can-drag {
  cursor: move;
}
.question-card {
  &:hover {
    .question-tool-wrap {
      opacity: 1;
    }
  }
}
.question-title-wrap {
  position: relative;
  padding-right: 130px;
  .title-num {
    font-size: 16px;
    font-weight: bold;
    position: absolute;
    left: -30px;
  }
  .question-title {
    font-weight: bold;
    font-size: 16px;
    min-height: 16px;
  }
  .mandatory::after {
    content: "*";
    color: #ff6d56;
    margin-left: 5px;
    font-size: 20px;
    position: absolute;
    bottom: -6px;
  }
  .question-tool-wrap {
    opacity: 0;
    width: 120px;
    // border: 1px solid red;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: #999;
    .q-icon {
      cursor: pointer;
      &:hover {
        color: var(--primary);
      }
      + .q-icon {
        margin-left: 14px;
      }
    }
  }
}
.question-content {
  margin-top: 18px;
}
.empty-wrap {
  border: 2px dashed var(--link);
  padding: 20px;
  margin: 20px 0;
  color: #777ba0;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.save-wrap {
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  button + button {
    margin-left: 8px !important;
  }
}
</style>
