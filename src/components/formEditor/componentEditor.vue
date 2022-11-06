<template>
  <transition name="slideFade">
    <div class="component-editor-wrap" transiton="slideFade" v-if="show">
      <div class="editor-box" v-for="(column, i) of editorConfig" :key="i">
        <div class="editor-column-title">{{ column.columnTitle }}</div>
        <div v-for="(setting, index) of column.settingList" :key="index">
          <div
            v-if="!setting.hidden"
            :is="setting.type"
            v-bind="$attrs"
            :model.sync="setting.formConfig.model"
            @change="changeSetting($event, setting)"
            :config="setting.formConfig"
            :options="setting.formOptions"
            :subjectConfig="showComponentContent.subjectConfig"
          ></div>
        </div>
      </div>
      <!-- <div style="word-wrap: break-word; ">
        {{ JSON.stringify(showComponentContent) }}
      </div> -->
    </div>
  </transition>
</template>

<script>
import formInput from "../form/formInput.vue";
import FormOptionList from "../form/formOptionList.vue";
import content from "./componentContent";
const util = require("./utils/util");

export default {
  components: { formInput, FormOptionList },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    showComponentEditorIndex: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      showComponentContent: { subjectConfig: {} },
      editorConfig: []
    };
  },
  watch: {
    showComponentContent: {
      handler(newValue, oldValue) {
        console.log("change ediorConfig1");
        this.setEditorConfig();
      },
      deep: true
    }
  },
  created() {
    // 监听content变化
    content.$on("showComponentEditorContent", content => {
      this.getComponentContent(content);
    });
  },
  beforeDestroy() {
    content.$off("showComponentEditorContent", content => {});
  },
  methods: {
    getComponentContent(content) {
      if (content.subjectConfig.remarkConfig === undefined) {
        content.subjectConfig.remarkConfig = {};
      }
      if (content.subjectConfig.uploaderConfig === undefined) {
        content.subjectConfig.uploaderConfig = {};
      }
      this.showComponentContent = content;
    },
    changeSetting(event, setting) {
      let settingValue = setting.value.split(".");
      switch (settingValue.length) {
        case 1:
          this.showComponentContent[settingValue[0]] = event;
          break;
        case 2:
          this.showComponentContent[settingValue[0]][settingValue[1]] = event;
          break;
        case 3:
          this.showComponentContent[settingValue[0]][settingValue[1]][
            settingValue[2]
          ] = event;
          break;
      }
      this.setEditorConfig();
    },
    setEditorConfig() {
      let config = [];
      const { showComponentContent } = this;
      if (showComponentContent.choiceType === "DOMAIN") {
        let cfg = {
          columnTitle: "Category Line Settings",
          settingList: [
            {
              type: "form-input",
              value: "subjectConfig.title",
              formConfig: {
                subtitle: true,
                title: "Category Title",
                model: showComponentContent.subjectConfig.title
                  ? showComponentContent.subjectConfig.title
                  : ""
              }
            }
          ]
        };
        config.push(cfg);
      } else if (showComponentContent.choiceType === "DESCR") {
        let cfg = {
          columnTitle: "Remarks Settings",
          settingList: [
            {
              type: "form-rich-text-editor",
              value: "subjectConfig.content",
              formConfig: {
                subtitle: true,
                title: "Remarks Details",
                model: showComponentContent.subjectConfig.content
                  ? showComponentContent.subjectConfig.content
                  : ""
              }
            }
          ]
        };
        config.push(cfg);
      } else {
        let cfg = {
          columnTitle: "Whole question setting",
          settingList: [
            {
              type: "form-input",
              value: "subjectConfig.title",
              formConfig: {
                subtitle: true,
                title: "title",
                model: showComponentContent.subjectConfig.title
                  ? showComponentContent.subjectConfig.title
                  : ""
              }
            },
            {
              type: "form-radio",
              value: "subjectConfig.mandatory",
              formConfig: {
                subtitle: true,
                title: "Required",
                model: showComponentContent.subjectConfig.mandatory
                  ? showComponentContent.subjectConfig.mandatory
                  : false
              },
              formOptions: [
                { label: "Required", value: true },
                { label: "Not required", value: false }
              ]
            },
            {
              type: "form-switch",
              value: "subjectConfig.remarkConfig.display",
              formConfig: {
                subtitle: true,
                title: "Whether to attach remarks",
                withoutCheck: true,
                titlePosition: "between",
                model: showComponentContent.subjectConfig.remarkConfig.display
                  ? showComponentContent.subjectConfig.remarkConfig.display
                  : false
                // model: util.IsExists(showComponentContent.subjectConfig.remarkConfig.display)
                //   ? util.IsExists(showComponentContent.subjectConfig.remarkConfig.display)
                //   : false
              }
            },
            {
              type: "form-input",
              value: "subjectConfig.remarkConfig.placerHolder",
              formConfig: {
                subtitle: true,
                title: "Remarks>Input box placeholder text",
                model: showComponentContent.subjectConfig.remarkConfig
                  .placerHolder
                  ? showComponentContent.subjectConfig.remarkConfig.placerHolder
                  : ""
              },
              hidden: !showComponentContent.subjectConfig.remarkConfig.display
            },
            {
              type: "form-select",
              value: "subjectConfig.remarkConfig.format",
              formConfig: {
                subtitle: true,
                title: "Remarks>Content Format",
                titlePosition: "between",
                model: showComponentContent.subjectConfig.remarkConfig.format
                  ? showComponentContent.subjectConfig.remarkConfig.format
                  : "TEXT"
              },
              formOptions: [
                { label: "unlimited", value: "TEXT" },
                { label: "password", value: "PASSWORD" },
                { label: "number", value: "NUMBER" },
                { label: "phone number", value: "PHONE" },
                { label: "ID number", value: "IDCARD" },
                { label: "mailbox", value: "EMAIL" },
                { label: "date", value: "DAY" },
                { label: "time", value: "MINUTE" }
              ],
              hidden: !showComponentContent.subjectConfig.remarkConfig.display
            },
            {
              type: "form-switch",
              value: "subjectConfig.uploaderConfig.display",
              formConfig: {
                subtitle: true,
                title: "Attach file or not",
                withoutCheck: true,
                titlePosition: "between",
                model: showComponentContent.subjectConfig.uploaderConfig.display
                  ? showComponentContent.subjectConfig.uploaderConfig.display
                  : false
              }
            },
            {
              type: "form-select",
              value: "subjectConfig.uploaderConfig.maxFileCount",
              formConfig: {
                subtitle: true,
                title: "Attachments>Maximum upload quantity",
                titlePosition: "between",
                model: showComponentContent.subjectConfig.uploaderConfig
                  .maxFileCount
                  ? showComponentContent.subjectConfig.uploaderConfig
                      .maxFileCount
                  : "1"
              },
              formOptions: [
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
                { label: "6", value: "6" },
                { label: "7", value: "7" },
                { label: "8", value: "8" },
                { label: "9", value: "9" },
                { label: "10", value: "10" }
              ],
              hidden: !showComponentContent.subjectConfig.uploaderConfig.display
            },
            {
              type: "form-select",
              value: "subjectConfig.uploaderConfig.maxFileSize",
              formConfig: {
                subtitle: true,
                title: "Attachments>Maximum File Size",
                titlePosition: "between",
                model: showComponentContent.subjectConfig.uploaderConfig
                  .maxFileSize
                  ? showComponentContent.subjectConfig.uploaderConfig
                      .maxFileSize
                  : "5"
              },
              formOptions: [
                { label: "2MB", value: "2" },
                { label: "5MB", value: "5" },
                { label: "10MB", value: "10" },
                { label: "20MB", value: "20" },
                { label: "30MB", value: "30" }
              ],
              hidden: !showComponentContent.subjectConfig.uploaderConfig.display
            }
          ]
        };
        config.push(cfg);
      }
      if (showComponentContent.choiceType === "INPUT") {
        let cfg = {
          columnTitle: "Input box settings",
          settingList: [
            {
              type: "form-input",
              value: "subjectConfig.placerHolder",
              formConfig: {
                subtitle: true,
                title: "Placeholder text",
                model: showComponentContent.subjectConfig.placerHolder
                  ? showComponentContent.subjectConfig.placerHolder
                  : ""
              }
            },
            {
              type: "form-select",
              value: "subjectConfig.format",
              formConfig: {
                subtitle: true,
                title: "Fill in content format",
                titlePosition: "between",
                model: showComponentContent.subjectConfig.format
                  ? showComponentContent.subjectConfig.format
                  : "TEXT"
              },
              formOptions: [
                { label: "unlimited", value: "TEXT" },
                { label: "password", value: "PASSWORD" },
                { label: "number", value: "NUMBER" },
                { label: "phone number", value: "PHONE" },
                { label: "ID number", value: "IDCARD" },
                { label: "mailbox", value: "EMAIL" },
                { label: "date", value: "DAY" },
                { label: "time", value: "MINUTE" }
              ]
            },
            {
              type: "form-input",
              value: "subjectConfig.minLength",
              formConfig: {
                subtitle: true,
                title: "Minimum input words",
                titlePosition: "between",
                format: "NUMBER",
                maxLength: 4,
                model: showComponentContent.subjectConfig.minLength
                  ? showComponentContent.subjectConfig.minLength
                  : ""
              }
            },
            {
              type: "form-input",
              value: "subjectConfig.maxLength",
              formConfig: {
                subtitle: true,
                title: "Maximum input words",
                titlePosition: "between",
                format: "NUMBER",
                maxLength: 4,
                model: showComponentContent.subjectConfig.maxLength
                  ? showComponentContent.subjectConfig.maxLength
                  : ""
              }
            }
          ]
        };
        config.push(cfg);
      } else if (showComponentContent.choiceType === "RADIO") {
        let cfg = {
          columnTitle: "Candidate Settings",
          settingList: [
            {
              type: "form-option-list",
              value: "options",
              formConfig: {
                type: showComponentContent.choiceType,
                model: showComponentContent.options
                  ? showComponentContent.options
                  : []
              }
            }
          ]
        };
        config.push(cfg);
      } else if (showComponentContent.choiceType === "CHECKBOX") {
        let cfg = [
        {
            columnTitle: "Multi check box setting",
            settingList: [
              {
                type: "form-input",
                value: "subjectConfig.minLength",
                formConfig: {
                  subtitle: true,
                  title: "Minimum selections",
                  titlePosition: "between",
                  format: "NUMBER",
                  maxLength: 4,
                  model: showComponentContent.subjectConfig.minLength
                    ? showComponentContent.subjectConfig.minLength
                    : ""
                }
              },
              {
                type: "form-input",
                value: "subjectConfig.maxLength",
                formConfig: {
                  subtitle: true,
                  title: "Maximum selections",
                  titlePosition: "between",
                  format: "NUMBER",
                  maxLength: 4,
                  model: showComponentContent.subjectConfig.maxLength
                    ? showComponentContent.subjectConfig.maxLength
                    : ""
                }
              }
            ]
          },
          {
            columnTitle: "Candidate Settings",
            settingList: [
              {
                type: "form-option-list",
                value: "options",
                formConfig: {
                  type: showComponentContent.choiceType,
                  model: showComponentContent.options
                    ? showComponentContent.options
                    : []
                }
              }
            ]
          }
        ];
        config.push(...cfg);
      } else if (showComponentContent.choiceType === "SELECTOR") {
        let cfg = [
          {
            columnTitle: "Drop down box settings",
            settingList: [
              {
                type: "form-input",
                value: "subjectConfig.placerHolder",
                formConfig: {
                  subtitle: true,
                  title: "Placeholder text",
                  model: showComponentContent.subjectConfig.placerHolder
                    ? showComponentContent.subjectConfig.placerHolder
                    : ""
                }
              }
            ]
          },
          {
            columnTitle: "Candidate Settings",
            settingList: [
              {
                type: "form-option-list",
                value: "options",
                formConfig: {
                  type: showComponentContent.choiceType,
                  model: showComponentContent.options
                    ? showComponentContent.options
                    : []
                }
              }
            ]
          }
        ];
        config.push(...cfg);
      } else if (
        showComponentContent.choiceType === "FILEUPLOADER" ||
        showComponentContent.choiceType === "IMAGEUPLOADER"
      ) {
        let cfg = [
          {
            columnTitle: "Upload Settings",
            settingList: [
              {
                type: "form-select",
                value: "subjectConfig.maxFileCount",
                formConfig: {
                  subtitle: true,
                  title: "Maximum number of uploaded files",
                  titlePosition: "between",
                  model: showComponentContent.subjectConfig.maxFileCount
                    ? showComponentContent.subjectConfig.maxFileCount
                    : "1"
                },
                formOptions: [
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4", value: "4" },
                  { label: "5", value: "5" },
                  { label: "6", value: "6" },
                  { label: "7", value: "7" },
                  { label: "8", value: "8" },
                  { label: "9", value: "9" },
                  { label: "10", value: "10" }
                ]
              },
              {
                type: "form-select",
                value: "subjectConfig.maxFileSize",
                formConfig: {
                  subtitle: true,
                  title: "Maximum upload file size",
                  titlePosition: "between",
                  model: showComponentContent.subjectConfig.maxFileSize
                    ? showComponentContent.subjectConfig.maxFileSize
                    : "5"
                },
                formOptions: [
                  { label: "2MB", value: "2" },
                  { label: "5MB", value: "5" },
                  { label: "10MB", value: "10" },
                  { label: "20MB", value: "20" },
                  { label: "30MB", value: "30" }
                ]
              }
            ]
          }
        ];
        config.push(...cfg);
      }
      this.editorConfig = config;
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.component-editor-wrap {
  position: fixed;
  top: var(--headerHeight);
  bottom: 0;
  right: -10px;
  width: 280px;
  // min-height: 100%;
  background: var(--white);
  z-index: 5;
  border: 1px solid var(--link);
  padding: 18px;
  padding-right: 28px;
  border-radius: var(--radius);
  overflow-y: auto;
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
    transform: translate3d(100%, 0, 0);
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
    transform: translate3d(100%, 0, 0);
    opacity: 1;
  }
}
.editor-box {
}
.editor-column-title {
  font-size: 16px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dde5ed;
  margin-bottom: 8px;
}
</style>
