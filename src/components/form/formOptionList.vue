<template>
  <div class="option-list-wrap">
    <div class="btn-wrap" v-if="$attrs.optionsSourceUrl">
      <template v-if="subjectConfig.optionsSourceId">
        <q-btn
          size="sm"
          color="primary"
          flat
          label="Not use"
          @click="cancelSource"
        /><q-btn
          size="sm"
          color="primary"
          flat
          icon-right="source"
          label="Toggle Option Source"
          @click="useSource"
        />
      </template>
      <template v-else>
        <q-btn
          size="sm"
          color="primary"
          flat
          icon-right="source"
          label="Use Option Source"
          @click="useSource"
        />
      </template>
    </div>
    <draggable
      v-model="list"
      chosenClass="dragging"
      forceFallback="true"
      animation="300"
      :delay="100"
      :touchStartThreshold="20"
      class="option-list"
      handle=".type-icon"
      :class="[{ 'list-disable': disable }]"
    >
      <div class="option-item" v-for="(item, index) of list" :key="index">
        <q-icon
          class="type-icon q-mr-sm"
          :name="iconDict[config.type]"
          size="sm"
        />
        <template v-if="!developMode">
          <q-input
            class="q-mr-sm"
            standout="bg-primary text-white"
            v-model="item.label"
            :ref="`input_item_${index}`"
            dense
            :readonly="disable"
          />
        </template>
        <div v-else>
          <div class="input-line">
            <div>Label</div>
            <q-input
              class="q-mr-sm"
              standout="bg-info text-white"
              v-model="item.label"
              :ref="`input_item_${index}`"
              dense
              @focus="focusLabel(index)"
              :readonly="disable"
            />
          </div>
          <!-- <div class="input-line">
            <div>attribute</div>
            <q-input
              class="q-mr-sm"
              standout="bg-info text-white"
              v-model="item.value"
              :ref="`input_item_${index}`"
              dense
              :readonly="disable"
            />
          </div> -->
          <div class="input-line">
            <div>score</div>
            <q-input
              class="q-mr-sm"
              placeholder="(Optional)"
              standout="bg-info text-white"
              v-model="item.score"
              :ref="`input_item_${index}`"
              dense
              @focus="focusScore(index)"
              :readonly="disable"
            />
          </div>
        </div>
        <q-icon
          class="delete-icon"
          name="remove_circle_outline"
          size="sm"
          v-if="list.length > 1"
          @click="deleteItem(index)"
        />
      </div>
    </draggable>
    <div class="list-add">
      <q-btn
        color="primary"
        flat
        icon="add"
        label="Add Options"
        @click="addItem"
      />
    </div>
    <selectSourceDialog
      :show.sync="showSelectSourceDialog"
      v-bind="$attrs"
      @change="selectSource"
    />
  </div>
</template>

<script>
/**
 * 传入参数
 * model(默认值，已有值)
 *
 * config:
 * type(类型，选项前方icon不同)[radio|select|checkbox]
 * developMode(是否是开发者模式，开发者模式可以自定义value内容)[True,False]
 * isShowTitleNum(是否显示序号)
 *
 * model
 * 方法：
 * change：
 * 传出内容
 */
import selectSourceDialog from "./selectSourceDialog";
const IconDict = {
  RADIO: "radio_button_unchecked",
  CHECKBOX: "check_box_outline_blank",
  SELECTOR: "arrow_drop_down"
};
const util = require("./utils/util");

import draggable from "vuedraggable";

export default {
  name: "formOptionList",
  components: {
    draggable,
    selectSourceDialog
  },
  props: {
    config: {
      type: Object,
      default: {}
    },
    model: {
      type: [String, Number, Array, Object, Boolean],
      default: ""
    },
    developMode: {
      type: Boolean,
      default: false
    },
    subjectConfig: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      disable: false, // 是否允许被改动
      list: [],
      oriList: [], // 如使用选项源，则保存原有选择
      iconDict: IconDict, // 候选项左侧图标
      showSelectSourceDialog: false // 选择消息来源弹窗
    };
  },
  watch: {
    model: {
      handler: function(newValue, oldValue) {
        this.list = newValue;
      },
      immediate: true
    },
    list: {
      handler: function(newValue, oldValue) {
        console.log(newValue);
        let list = newValue;
        for (let item of list) {
        }
        list.forEach((item, index) => {
          if (util.isEmpty(item.value)) {
            item.value = index;
          }
        });
        this.$emit("change", list);
        this.$emit("update:model", list);
      },
      deep: true
    }
  },
  methods: {
    focusLabel(index) {
      this.$nextTick(() => {
        this.$refs[`input_item_${index}`][0].select();
      });
    },
    focusScore(index) {
      this.$nextTick(() => {
        this.$refs[`input_item_${index}`][1].select();
      });
    },
    deleteItem(index) {
      this.list.splice(index, 1);
    },
    addItem() {
      const { list } = this;
      const newIndex = list.length;
      let newItem = {
        label: `Option${newIndex + 1}`,
        value: `${newIndex + 1}`,
        score: ""
      };
      this.list.push(newItem);
      this.$nextTick(() => {
        this.$refs[`input_item_${newIndex}`][0].select();
      });
    },
    useSource() {
      this.showSelectSourceDialog = true;
    },
    cancelSource() {
      delete this.subjectConfig.optionsSourceId;
      delete this.subjectConfig.optionsVersionId;
      this.disable = false;
      this.list = this.oriList;
      this.oriList = [];
    },
    selectSource(event) {
      console.log(event);
      this.subjectConfig.optionsSourceId = event.optionsSourceId;
      this.subjectConfig.optionsVersionId = event.optionsVersionId;
      this.oriList = this.list; // 保存原数据
      this.list = event.options;
      this.disable = true; // 不允许修改
    }
  }
};
</script>

<style lang="scss" scoped>
.list-add {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.option-list-wrap {
  display: flex;
  flex-direction: column;
}
.option-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px auto;
  .type-icon:hover {
    cursor: move;
  }
  .delete-icon {
    color: var(--grey);
  }
  .delete-icon:hover {
    cursor: pointer;
    color: var(--red);
  }
}
.input-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  color: var(--grey);
  + .input-line {
    margin-top: 4px;
  }
  > div {
    margin-right: 2px;
  }
}
.btn-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
}
.list-disable {
  pointer-events: none;
}
</style>
