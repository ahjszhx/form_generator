<template>
  <div>
    <q-img :src="thumbSrc" @error="errorImg" />
  </div>
</template>

<script>
const FileApplicationTpyeDict = {
  "vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
  msword: "word",
  "vnd.ms-powerpoint": "ppt",
  "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  pdf: "pdf",
  "x-zip-compressed": "zip"
};
export default {
  props: {
    file: {
      type: Object
    }
  },
  data() {
    return {
      fileApplicationTpyeDict: FileApplicationTpyeDict
    };
  },
  computed: {
    thumbSrc() {
      const { file, fileApplicationTpyeDict } = this;
      let type = file.type.split("/");
      let thumbSrc = "";
      if (type.length < 2) {
        thumbSrc = require(`./img/file/unknown.png`);
      } else if (type[0] == "image" && file.tempPath) {
        thumbSrc = file.tempPath;
      } else if (type[0] != "application") {
        thumbSrc = require(`./img/file/${type[0]}.png`);
      } else if (type[0] == "application") {
        let tag = fileApplicationTpyeDict[type[1]];
        if (tag !== undefined) {
          thumbSrc = require(`./img/file/${tag}.png`);
        } else {
          thumbSrc = require(`./img/file/unknown.png`);
        }
      } else {
        thumbSrc = require(`./img/file/unknown.png`);
      }
      return thumbSrc;
    }
  },
  methods: {
    errorImg(e) {
      // console.log("errorImg", e);
      this.file.tempPath = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.q-img {
  width: 30px;
  height: 30px;
  margin-right: 12px;
}
</style>
