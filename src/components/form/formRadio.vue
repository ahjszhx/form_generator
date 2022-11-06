<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div
      class="radio-wrap"
      :class="{ error: iserror, withoutCheck: cfg.withoutCheck }"
    >
      <template v-if="screenWidth > 640">
        <q-option-group
          class="radio-options-box"
          v-model="value"
          :options="options"
          color="primary"
          inline
          :disable="cfg.disable"
        />
      </template>
      <template v-else>
        <q-list class="radio-options-box">
          <q-item
            tag="label"
            v-for="(item, index) in options"
            :key="index"
            class="radio-options-item"
          >
            <q-item-section avatar>
              <q-radio
                v-model="value"
                :val="item.value"
                color="primary"
                :disable="cfg.disable"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
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
 * mandatory(是否必填)
 * disable(不可用)[True|False]
 * withoutCheck(不需要校验)
 * isShowTitleNum(是否显示序号)
 *
 * options:
 * [{label:"",value:""}]
 * 
 * 方法：
 * change：
 * 传出选择内容
 */
import formTitle from "./formTitle.vue";
const util = require("./utils/util");

export default {
  name: "formRadio",
  components: { formTitle },
  props: {
    config: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    model: {
      type: [String, Number, Boolean],
      default: ""
    }
  },
  data() {
    return {
      value: "",
      cfg: {},
      iserror: false,
      errorText: " ",
      screenWidth: null //屏幕尺寸
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
        if (util.isFill(newValue)) {
          this.value = newValue;
        }
      },
      immediate: true
    },
    value(newValue, oldValue) {
      this.$emit("change", newValue);
      this.$emit("update:model", newValue);
      if (this.iserror) {
        // 已处于错误状态则每次更新都检测
        this.verify();
      }
    }
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      //屏幕尺寸变化就重新赋值
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  methods: {
    initCfg(config) {
      this.cfg = config;
    },
    errorState(errorText) {
      this.iserror = true;
      this.errorText = errorText;
    },
    normalState() {
      this.iserror = false;
      this.errorText = " ";
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("form.scss");
.radio-options-box {
  margin-left: 0px;
  border-radius: 4px;
  border: 2px solid transparent;
}
@media screen and (max-width: 640px) {
  .radio-options-box {
    border: 1px solid rgba(0, 0, 0, 0.24);
  }
  .radio-options-item + .radio-options-item {
  border-top: 1px solid rgba(0, 0, 0, 0.24);
}
}

.error .radio-options-box {
  border-color: var(--q-color-negative) !important;
  border-width: 2px;
}
.q-field__bottom {
  position: absolute;
}
</style>
