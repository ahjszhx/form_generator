<!--
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-05-12 17:03:43
 * @LastEditTime: 2021-05-31 14:04:18
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/components/form/formRichTextEditor.vue
 * @Environment: Win 10
 * @Description: 
-->
<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div class="richtext-editor-wrap">
      <div id="richtexteditor"></div>
    </div>
  </form-title>
</template>

<script>
/**
 * 传入参数
 * model(默认值，已有值)
 *
 * config:
 * isShowTitleNum(是否显示序号)
 *
 * options:
 * [{label:"",value:""}]
 *
 * optionValue(option中值字段的名称)
 * optionLabel(option中标签字段的名称)
 *
 * 方法：
 * change：
 * 传出选择内容
 */
import axios from "axios";
import E from "wangeditor";
import formTitle from "./formTitle.vue";
export default {
  name: "formRichTextEditor",
  components: { formTitle },
  props: {
    config: {
      type: Object,
      required: true
    },
    model: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      cfg: {},
      value: ""
    };
  },
  watch: {
    config: {
      handler: function (newValue, oldValue) {
        this.initCfg(newValue);
      }
    },
    model: {
      handler: function (newValue, oldValue) {
        if (newValue) {
          this.value = newValue;
        }
      },
      immediate: true
    },
    value (newValue, oldValue) {
      this.$emit("change", newValue);
      this.$emit("update:model", newValue);
    }
  },
  mounted () {
    this.createEditor();
  },
  methods: {
    initCfg (config) {
      this.cfg = config;
    },
    createEditor () {
      const that = this;
      const editor = new E("#richtexteditor");
      // 配置菜单栏，删减菜单，调整顺序
      editor.config.menus = [
        "bold",
        "fontSize",
        "foreColor",
        "backColor",
        "italic",
        "justify",
        "list",
        "todo",
        "underline",
        "image"
      ];
      // 配置全屏功能按钮是否展示
      editor.config.showFullScreen = false;
      // 自定义上传图片
      editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        console.log(resultFiles);
        that.uploadFile(resultFiles).then(imgUrlList => {
          for (let imgUrl of imgUrlList) {
            // 上传图片，返回结果，将图片插入到编辑器中
            insertImgFn(imgUrl);
          }
        });
      };
      editor.config.onchange = function (newHtml) {
        console.log("change 之后最新的 html", newHtml);
        that.value = newHtml;
      };

      editor.create();
      // 初始化富文本内内容
      editor.txt.html(that.value);
    },
    uploadFile (files) {
      const that = this;
      return new Promise(function (resolve, reject) {
        const uploadUrl = that.$attrs.uploadUrl;
        const downloadUrl = that.$attrs.downloadUrl;
        var forms = new FormData();
        var configs = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        for (let file of files) {
          forms.append(`${file.name}`, file);
        }
        axios
          .post(uploadUrl, forms, configs)
          .then(res => {
            // console.log(res);
            if (res.data.suc) {
              // 接受返回的uuid，读取时通过uuid获取文件
              const list = res.data.data;
              let req = [];
              if (Array.isArray(list)) {
                for (let item of list) {
                  req.push(`${downloadUrl}?fileName=${item}`);
                }
              } else {
                req.push(`${downloadUrl}?fileName=${list}`);
              }
              resolve(req);
            }
          })
          .catch(error => {
            console.log("error", error);
            reject(error);
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
</style>
