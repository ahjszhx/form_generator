<template>
  <transition name="slideFade">
    <div class="component-selector-wrap" transiton="slideFade" v-if="show">
      <div class="category-wrap" v-for="(category, index) of list" :key="index">
        {{ category.categoryName }}
        <div class="component-list-wrap">
          <div class="component-list not-allow-select" v-for="(item, c) of category.components" :key="c" @click="selectComponent(item)">
            <q-icon size="sm" :name="item.icon" />
            <div>{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import coontent from "./componentContent";
const componentsList = [
  {
    categoryName: "Input Component",
    components: {
      INPUT: {
        icon: "font_download",
        text: "Input box ",
        template: {
          canDrag: true,
          choiceType: "INPUT",
          subjectConfig: {
            title: "Please fill in this item",
            titleNum: "",
            format: "TEXT",
            placerHolder: "Please fill in here",
            mandatory: true,
            remarkConfig: { display: false,format:"TEXT" },
            uploaderConfig: { display: false, format: "FILE" }
          }
        }
      }, // 输入框
      RADIO: {
        icon: "radio_button_checked",
        text: "Radio button",
        template: {
          canDrag: true,
          choiceType: "RADIO",
          subjectConfig: {
            title: "Please select an option",
            titleNum: "",
            mandatory: true,
            remarkConfig: { display: false,format:"TEXT" },
            uploaderConfig: { display: false, format: "FILE" }
          },
          options: [
            { label: "Option1", value: "1" },
            { label: "Option2", value: "2" }
          ]
        }
      }, // 单选框
      CHECKBOX: {
        icon: "check_box",
        text: "Check box",
        template: {
          canDrag: true,
          choiceType: "CHECKBOX",
          subjectConfig: {
            title: "Please select the following options (multiple choices)",
            titleNum: "",
            mandatory: true,
            remarkConfig: { display: false,format:"TEXT" },
            uploaderConfig: { display: false, format: "FILE" }
          },
          options: [
            { label: "Option1", value: "1" },
            { label: "Option2", value: "2" }
          ]
        }
      }, // 多选框
      SELECTOR: {
        icon: "arrow_drop_down_circle",
        text: "drop-down menu",
        template: {
          canDrag: true,
          choiceType: "SELECTOR",
          subjectConfig: {
            title: "Please select an option",
            titleNum: "",
            placerHolder: "Please click here to select options",
            mandatory: true,
            remarkConfig: { display: false,format:"TEXT" },
            uploaderConfig: { display: false, format: "FILE" }
          },
          options: [
            { label: "Option1", value: "1" },
            { label: "Option2", value: "2" }
          ]
        }
      } // 下拉菜单
    }
  },
  {
    categoryName: "Uploader",
    components: {
      FILEUPLOADER: {
        icon: "file_upload",
        text: "File upload",
        template: {
          canDrag: true,
          choiceType: "FILEUPLOADER",
          subjectConfig: {
            title: "Please upload the file",
            format: "FILE",
            maxFileCount: "1",
            titleNum: "",
            mandatory: true,
            remarkConfig: { display: false,format:"TEXT" },
            uploaderConfig: { display: false, format: "FILE" }
          }
        }
      }, // 文件上传
      IMAGEUPLOADER: {
        icon: "add_photo_alternate",
        text: "Image upload",
        template: {
          canDrag: true,
          choiceType: "IMAGEUPLOADER",
          subjectConfig: {
            title: "Please upload the picture",
            format: "IMAGE",
            maxFileCount: "1",
            titleNum: "",
            mandatory: true,
            remarkConfig: { display: false,format:"TEXT" },
            uploaderConfig: { display: false, format: "FILE" }
          }
        }
      } // 图片上传
    }
  },
  {
    categoryName: "Tool",
    components: {
      FILEUPLOADER: {
        icon: "more_horiz",
        text: "Category line",
        template: {
          canDrag: true,
          choiceType: "DOMAIN",
          subjectConfig: {
            title: "Category",
            titleNum: "",
            isShowTitleNum:false // 不显示序号
          }
        }
      }, // 分类线
      DESCR: {
        icon: "info",
        text: "Remark",
        template: {
          canDrag: true,
          choiceType: "DESCR",
          subjectConfig: {
            content:"<p>Please read this description and fill in</p>",
            isShowTitleNum:false // 不显示序号
          }
        }
      } // 备注说明
      
    }
  }
];
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: function () {
        return componentsList;
      }
    },
    developMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 选择了问题类型
    selectComponent(content) {
      console.log("selectComponent", content);
      coontent.$emit("addQuestion", content.template);
    }
  }
};
</script>

<style lang="scss" scoped>
.component-selector-wrap {
  position: fixed;
  //   top: var(--headerHeight);
  //   left: -10px;
  width: 280px;
  margin-left: -10px;
  min-height: calc(100% - var(--headerHeight));
  background: var(--white);
  z-index: 5;
  border: 1px solid var(--link);
  padding: 18px;
  padding-left: 28px;
  padding-right: 12px;
  border-radius: var(--radius);
}
.slideFade-enter,
.slideFade-enter-active {
  animation: slideFade-dialog-fade-in 0.5s var(--bezier);
}
.slideFade-leave,
.slideFade-leave-active {
  animation: slideFade-dialog-fade-out 0.5s var(--bezier) forwards;
}

@keyframes slideFade-dialog-fade-in {
  0% {
    transform: translate3d(-100%, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes slideFade-dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(-100%, 0, 0);
    opacity: 1;
  }
}
.category-wrap + .category-wrap {
  margin-top: 18px;
}
.component-list-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 6px;
  .q-icon {
    margin-right: 6px;
  }
  .component-list {
    background-color: #fff;
    width: 112px;
    margin: 0 7px 7px 0;
    border: 2px solid var(--link);
    padding: 0 6px;
    border-radius: 2px;
    color: #777ba0;
    font-size: 12px;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
  }
  .component-list:hover {
    color: var(--primary);
    border-color: var(--primary);
  }
}
</style>
