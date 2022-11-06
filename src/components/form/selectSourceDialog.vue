<template>
  <q-dialog v-model="dialogShow">
    <q-card style="max-width: 30vw;min-width:30vw;">
      <q-toolbar class="card-top">
        <q-toolbar-title class="text-center">
          <span class="text-weight-bold">Select Option Source</span>
        </q-toolbar-title>
        <q-btn class="close-icon" flat round dense icon="close" v-close-popup />
      </q-toolbar>
      <!-- 弹出内容 -->
      <div class="q-pa-md" style="max-width: 100%;min-height:400px;">
        <form-select
          :config="sourceSelectConfig"
          :options="sourceList"
          :model.sync="optionsSourceId"
          option-value="sourceId"
          option-label="sourceName"
        />
        <form-select
          v-if="optionsSourceId"
          :config="versionSelectConfig"
          :options="
            sourceList[
              sourceList.findIndex(val => val.sourceId == optionsSourceId)
            ].version
          "
          :model.sync="optionsVersionId"
          option-value="versionId"
          option-label="versionName"
        />
      </div>
      <div class="card-bottom">
        <q-btn color="grey" flat label="cancel" @click="cancel" />
        <q-btn color="primary" label="confirm" @click="ok" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      dialogShow: false,
      importCode: "",
      sourceSelectConfig: {
        title: "Select Candidate Source",
        placerHolder: "Please click here to select the source"
      },
      versionSelectConfig: {
        title: "Select Candidate Version",
        placerHolder: "Please click here to select a version"
      },
      sourceList: [],
      optionsSourceId: null, // 选中的来源id
      optionsVersionId: null // 选中的来源版本id
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
        this.getSource();
      }
    },
    optionsSourceId(newValue, oldValue) {
      if (newValue !== oldValue) {
        // 改动了,清空版本id
        // console.log("改动了,清空版本id");
        this.optionsVersionId = null;
      }
    }
  },
  methods: {
    request(method, url, data) {
      let params = new URLSearchParams();
      for (var key in data) {
        if (data[key] != null) {
          if (typeof data[key] === "object") {
            params.append(key, JSON.stringify(data[key]));
          } else {
            params.append(key, data[key]);
          }
        }
      }
      return axios[method](url, {
        params: params
      });
    },
    cancel() {
      this.dialogShow = false;
    },
    ok() {
      const { optionsSourceId, optionsVersionId } = this;
      if (optionsSourceId === null || optionsVersionId === null) {
        this.$q.notify({
          position: "top",
          type: "positive",
          message: "Please select the option source and version correctly"
        });
      } else {
        // 提交获取option
        this.getOptions(optionsSourceId, optionsVersionId);
      }
    },
    // 获取来源列表
    getSource() {
      const { optionsSourceUrl } = this.$attrs;
      this.request("get", `${optionsSourceUrl}`, { parent: 1 }).then(res => {
        // console.log(res);
        this.sourceList = res.data;
      });
    },
    getOptions(optionsSourceId, optionsVersionId) {
      const { optionsSourceUrl } = this.$attrs;
      this.request("get", `${optionsSourceUrl}`, {
        parent: 2,
        sourceId: optionsSourceId,
        versionId: optionsVersionId
      }).then(res => {
        // console.log(res);
        let req = {
          optionsSourceId: optionsSourceId,
          optionsVersionId: optionsVersionId,
          options: res.data.map(val => {
            return { label: val.label, value: val.value };
          })
        };
        // console.log(req);
        this.$emit("change", req);
        this.dialogShow = false;
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
  border-bottom: 1px solid rgb(224, 224, 224);
}
.close-icon {
  position: absolute;
  right: 8px;
}
.text-weight-bold {
  font-size: 18px;
}
.card-bottom {
  position: sticky;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid rgb(224, 224, 224);
  padding: 12px 18px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  button + button {
    margin-left: 12px;
  }
}
</style>
