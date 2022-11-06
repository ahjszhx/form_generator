<template>
  <form-title
    :title="cfg.title"
    :mandatory="cfg.mandatory"
    :titleNum="cfg.titleNum"
    :titlePosition="cfg.titlePosition"
    :subtitle="cfg.subtitle"
  >
    <div
      class="checkbox-wrap"
      :class="{ error: iserror, withoutCheck: cfg.withoutCheck }"
    >
      <template v-if="screenWidth > 640">
        <q-option-group
          class="checkbox-options-box"
          type="checkbox"
          v-model="value"
          :options="options"
          color="primary"
          inline
          :disable="cfg.disable"
        />
      </template>
      <template v-else>
        <q-list class="checkbox-options-box">
          <q-item
            tag="label"
            v-for="(item, index) in opt"
            :key="index"
            class="checkbox-options-item"
          >
            <q-item-section avatar>
              <q-checkbox
                v-model="value"
                :val="item.value"
                color="primary"
                :disable="cfg.disable || item.disable"
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
 * minLength(最少要选)
 * maxLength(最多能选)
 * disable(不可用)
 * withoutCheck(不需要校验)
 * isShowTitleNum(是否显示序号)
 *
 * options:
 * [{label:"",value:""}]
 * 方法：
 * change：
 * 传出选择内容
 */
import formTitle from "./formTitle.vue";
const util = require("./utils/util");

export default {
  name: "formCheckbox",
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
      type: [String, Number, Array, Object, Boolean],
      default: ""
    }
  },
  data() {
    return {
      value: [],
      cfg: {},
      opt: [],
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
    options: {
      handler: function(newValue, oldValue) {
        this.initOpt(newValue);
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
      // 检测是否已经到达可选上限
      this.isMax();
      this.verify();
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
    initOpt(options) {
      for (let item of options) {
        item.disable = false;
      }
      this.opt = options;
    },
    errorState(errorText) {
      this.iserror = true;
      this.errorText = errorText;
    },
    normalState() {
      this.iserror = false;
      this.errorText = " ";
    },
    // 检测是否已经到达可选上限
    isMax() {
      const {
        value,
        opt,
        cfg: { maxLength }
      } = this;
      let newOpt = opt;

      if (value.length >= maxLength) {
        // 已经到达上限，把未选选项设为disable
        for (let item of newOpt) {
          item.disable = true;
        }
        for (let item of value) {
          let optIndex = opt.findIndex(value => {
            return value.value === item;
          });
          newOpt[optIndex].disable = false;
        }
      } else {
        for (let item of newOpt) {
          item.disable = false;
        }
      }
      this.opt = newOpt;
    },
    //校验
    verify() {
      const { cfg, value } = this;
      //   console.log("input verify");
      //长度要求
      //format要求
      if (cfg.withoutCheck) {
        this.normalState();
      } else if (cfg.mandatory && util.isEmpty(value)) {
        this.errorState(`Please select at least 1 item`);
      } else if (cfg.minLength && cfg.minLength > value.length) {
        this.errorState(`Please select at least ${cfg.minLength} items`);
      } else if (cfg.maxLength && cfg.maxLength < value.length) {
        this.errorState(`Please select at most ${cfg.maxLength} items`);
      } else {
        this.normalState();
      }
    }
  }
};
</script>

<style scoped>
@import url("form.scss");
.checkbox-options-box {
  margin-left: 0px;
  border-radius: 4px;
  border: 2px solid transparent;
}
@media screen and (max-width: 640px) {
  .checkbox-options-box {
    border: 1px solid rgba(0, 0, 0, 0.24);
  }
  .checkbox-options-item + .checkbox-options-item {
    border-top: 1px solid rgba(0, 0, 0, 0.24);
  }
}

.error .checkbox-options-box {
  border-width: 2px;
  border: 2px solid var(--q-color-negative) !important;
}
</style>
