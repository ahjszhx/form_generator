<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div
      class="upload-wrap"
      :class="{
        error: iserror,
        withoutCheck: cfg.withoutCheck,
        disable: cfg.disable,
        image: cfg.format == 'IMAGE'
      }"
    >
      <div
        class="uploader-input-wrap file-list"
        v-for="(item, index) of value"
        :key="index"
      >
        <div class="file-line">
          <div class="file-thumb">
            <file-thumb :file="item" />
          </div>
          <div class="file-name" :href="item.sizeText">{{ item.name }}</div>
          <!-- <div style="color:#999;">（{{ item.sizeText }}）</div> -->
        </div>
        <div class="file-btn">
          <template v-if="item.uploadStatus == 'error'">
            <q-img class="error-icon" src="./img/file/error.png">
              <q-tooltip
                anchor="top middle"
                self="center middle"
                transition-show="scale"
                transition-hide="scale"
                :offset="[12, 30]"
              >
                <div style="text-align:center;">
                  Upload failed {{ item.errorText }}
                </div>
              </q-tooltip>
            </q-img>
          </template>
          <template v-else>
            <LoadingAndTick
              :model="item.uploadStatus"
              :width="22"
              loadingColor="#999"
              style="margin-right: 4px;"
            ></LoadingAndTick>
          </template>

          <a
            :href="`${$attrs.downloadUrl}?fileName=${item.uuid}&realName=${item.name}`"
            :download="item.name"
          >
            <q-icon
              name="get_app"
              size="sm"
              color="blue"
              v-if="$attrs.downloadUrl && item.uuid"
            >
              <q-tooltip
                anchor="top middle"
                self="center middle"
                transition-show="scale"
                transition-hide="scale"
                :offset="[12, 22]"
                >Download files
              </q-tooltip>
            </q-icon>
          </a>

          <q-icon
            name="do_disturb_on"
            size="sm"
            color="red"
            @click="delFile(index)"
          >
            <q-tooltip
              anchor="top middle"
              self="center middle"
              transition-show="scale"
              transition-hide="scale"
              :offset="[12, 22]"
              >Delete File
            </q-tooltip>
          </q-icon>
        </div>
      </div>
      <div
        class="uploader-input-wrap"
        @click="clickUploader"
        v-if="value.length < cfg.maxFileCount"
      >
        <div>
          <template v-if="cfg.format == 'FILE'">
            <q-icon name="drive_folder_upload" size="sm" color="primary" />
            Select File
          </template>
          <template v-else-if="cfg.format == 'IMAGE'">
            <q-icon name="add_photo_alternate" size="sm" color="primary" />
            Select a picture
          </template>
          <template v-if="cfg.maxFileCount && cfg.maxFileCount > 1">
            (Up to {{ cfg.maxFileCount }} files can be uploaded, within {{ cfg.maxFileSize }}M each)
          </template>
          <template v-else>（Uploading is allowed {{ cfg.maxFileSize }}within 2M）</template>
        </div>
        <input
          type="file"
          ref="uploader"
          @change="chooseFile"
          multiple
          :accept="cfg.accept"
          style="display: none;"
        />
      </div>
      <div class="q-field__bottom row items-start" v-if="!cfg.withoutCheck">
        <div class="q-field__messages col text-negative">{{ errorText }}</div>
      </div>
    </div>
  </form-title>
</template>

<script>
/**
 * 传入参数
 * model(默认值，已有值)
 *
 * config:
 * format(上传类型)[file|image]
 * mandatory(是否必填)
 * placerHolder(占位符)
 * disable(不可用)[True|False]
 * readonly(只读)[True|False]
 * withoutCheck(不需要校验)
 * isShowTitleNum(是否显示序号)
 *
 *
 *
 * 方法：
 * change：
 * 传出选择内容
 */
import formTitle from "./formTitle.vue";
import axios from "axios";
import LoadingAndTick from "../LoadingAndTick.vue";
import fileThumb from "./fileThumb.vue";
import { baseUrl } from "src/api/data";
const util = require("./utils/util");

export default {
  name: "formUpload",
  components: {
    formTitle,
    LoadingAndTick,
    fileThumb
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    model: {
      type: [Object, Array, String],
      default: undefined
    },
    uploadUrl: {
      type: String,
      default: `${baseUrl()}/img/upload`,
    }
  },
  data() {
    return {
      value: {},
      cfg: {},
      value: [],
      iserror: false,
      errorText: ""
    };
  },
  watch: {
    config: {
      handler: function(newValue, oldValue) {
        this.initCfg(newValue);
      },
      immediate: true
    },
    model: {
      handler: function(newValue, oldValue) {
        if (util.isFill(newValue) && typeof newValue == "object") {
          this.value = newValue;
        }
      },
      immediate: true
    },
    value(newValue, oldValue) {
      this.$emit("change", newValue);
      this.$emit("update:model", newValue);
      //   this.verify();
    }
  },
  methods: {
    initCfg(config) {
      // 允许上传的类型，如是图片则设为(image/*)
      if (!config.format) {
        config.format = "FILE";
      }
      if (!config.accept && config.format === "IMAGE") {
        config.accept = "image/*";
      }
      //   最大上传文件数量
      if (!config.maxFileCount) {
        config.maxFileCount = 1;
      }
      //   最大文件大小
      if (!config.maxFileSize) {
        config.maxFileSize = 10;
      }
      this.cfg = config;
    },
    errorState(errorText) {
      this.iserror = true;
      this.errorText = errorText;
    },
    normalState() {
      this.iserror = false;
      this.errorText = " ";
    },
    chooseFile() {
      const uploaderDOM = this.$refs.uploader;
      const fileList = uploaderDOM.files;
      const { value, cfg } = this;
      if (value.length + fileList.length > cfg.maxFileCount) {
        // 超过允许上传数量
        this.$q.notify({
          position: "top",
          type: "warning",
          message: "Exceeds the allowed upload quantity"
        });
        return;
      }
      for (let item of fileList) {
        if (item.size / 1024 > cfg.maxFileSize * 1024) {
          // 上传图片大于设置大小
          this.$q.notify({
            position: "top",
            type: "warning",
            message: "The upload size exceeds the upper limit"
          });
        } else {
          console.log();
          //   允许上传
          let sizeText =
            item.size / 1024 < 1024
              ? `${(item.size / 1024).toFixed(2)}KB`
              : `${(item.size / 1024 / 1024).toFixed(2)}MB`;
          let temp = {
            name: item.name,
            size: item.size,
            sizeText: sizeText,
            uuid: "",
            tempPath: this.getObjectURL(item),
            uploadStatus: "loading",
            type: item.type
          };
          this.value.push(temp);
          const thisIndex = this.value.length - 1;
          if (cfg.format == "IMAGE") {
            // 图片需要压缩
            this.createImage(item).then(newFile => {
              console.log(newFile);
              this.uploadFile(newFile, thisIndex);
            });
          } else if (cfg.format == "FILE") {
            this.uploadFile(item, thisIndex);
          }
        }
      }
      // console.log(fileList);
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    clickUploader() {
      const { cfg } = this;
      if (cfg.disable) {
        return;
      }
      const uploaderDOM = this.$refs.uploader;
      uploaderDOM.click();
    },
    // 创建图片
    async createImage(file) {
      let that = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let range; // range为压缩的程度，数值越小，压缩的文件越小，图片也会越模糊
        const fileSize = file.size / 1024 / 1024;
        if (fileSize > 10) {
          range = 0.5;
        } else if (fileSize > 6) {
          range = 0.6;
        } else if (fileSize > 3) {
          range = 0.7;
        } else if (fileSize > 1) {
          range = 0.8;
        } else {
          range = 1;
        }
        reader.onload = e => {
          let result = e.target.result;
          let img = new Image();
          img.src = result;
          // console.log("********未压缩前的图片大小********");
          // console.log(result.length / 1024);
          if (range < 1) {
            img.onload = function() {
              const base64Data = that.compressImage(img, range);
              const blob = that.base64ToBlob(base64Data);
              const newfile = that.blobToFile(blob, file.name);
              console.log(newfile);
              resolve(newfile);
            };
          } else {
            console.log(file);
            resolve(file);
          }
        };
        // 读取图像
        return reader.readAsDataURL(file);
      });
    },
    // 压缩图片
    compressImage(img, size) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", size);
      //   console.log("*******压缩后的图片大小*******");
      //   console.log(ndata.length / 1024);
      return ndata;
    },
    base64ToBlob(base64Data) {
      let arr = base64Data.split(","),
        fileType = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        l = bstr.length,
        u8Arr = new Uint8Array(l);

      while (l--) {
        u8Arr[l] = bstr.charCodeAt(l);
      }
      return new Blob([u8Arr], {
        type: fileType
      });
    },
    blobToFile(newBlob, fileName) {
      newBlob.lastModifiedDate = new Date();
      newBlob.name = fileName;
      return newBlob;
    },
    uploadFile(file, index) {
      const uploadUrlA = this.$attrs.uploadUrl;
      const uploadUrlB = this.uploadUrl;
      const uploadUrl = uploadUrlA ? uploadUrlA : uploadUrlB;
      var forms = new FormData();
      var configs = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      forms.append(`${file.name}`, file);
      axios
        .post(uploadUrl, forms, configs)
        .then(res => {
          console.log(res);
          if (res.data.suc) {
            // 接受返回的uuid，读取时通过uuid获取文件
            this.value[index].uuid = res.data.data;
            this.value[index].uploadStatus = "tick";
          }
        })
        .catch(error => {
          console.log("error", error);
          this.value[index].uploadStatus = "error";
          this.value[index].errorText = error;
        });
    },
    delFile(index) {
      this.value.splice(index, 1);
    },
    downloadFile(item) {
      const uuid = item.uuid;
      const name = item.name;
      if (!uuid) {
        return;
      }
      const url = `${this.$attrs.downloadUrl}?fileName=${uuid}&oldname=${name}`;
      window.open(url);
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
a {
  text-decoration: none;
}
.upload-wrap {
  &.disable {
    .uploader-input-wrap {
      cursor: not-allowed !important;
    }
  }
}
.uploader-input-wrap {
  position: relative;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  background: #ffffff;
  padding: 6px 12px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: var(--black);
  cursor: pointer;
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  &.file-list {
    cursor: default;

    justify-content: space-between;
    .file-line {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;
      padding-right: 100px;
    }
    .file-thumb {
      width: 30px;
      height: 30px;
      margin-right: 12px;
    }
    .file-btn {
      position: absolute;
      right: 6px;
      display: flex;
      align-items: center;
    }
    .error-icon {
      width: 20px !important;
      height: 20px !important;
      margin-right: 4px;
    }
    .file-name {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      text-align: left;
    }
    .file-name::after {
      content: " (" attr(href) ")";
      color: #999;
      margin-left: 10px;
    }
    .q-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .q-icon {
      cursor: pointer;
      padding: 6px;
    }
  }
}
.uploader-input-wrap + .uploader-input-wrap {
  margin-top: 10px;
}
</style>
