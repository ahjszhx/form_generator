<template>
  <div class="q-pa-md q-gutter-sm">
    <div class="text-h5">上传（formUpload）</div>
    <template>
      <formUpload
        :config="upload.subjectConfig"
        @change="upload.data = $event"
        uploadUrl="http://xxx.hq.gench.edu.cn:9801/api/pc/img/upload"
        downloadUrl="http://xxx.hq.gench.edu.cn:9801/api/pc/img/download"
        :model="upload.data"
      ></formUpload>
    </template>
    <div class="text-h5">输入框（formInput）</div>
    <template>
      <formInput
        :config="input1.subjectConfig"
        @change="input1.data = $event"
        @getState="input1.state = $event"
      ></formInput>
      <formInput
        :config="input2.subjectConfig"
        @change="input2.data = $event"
        @getState="input2.state = $event"
      ></formInput>
      <formInput
        :config="input3.subjectConfig"
        @change="input3.data = $event"
        @getState="input3.state = $event"
      ></formInput>
      <formInput
        :config="input4.subjectConfig"
        @change="input4.data = $event"
        @getState="input4.state = $event"
      ></formInput>
      <formInput
        :config="input5.subjectConfig"
        @change="input5.data = $event"
        @getState="input5.state = $event"
      ></formInput>
      <formInput
        :config="input6.subjectConfig"
        @change="input6.data = $event"
        @getState="input6.state = $event"
      ></formInput>
      <formInput
        :config="input7.subjectConfig"
        @change="input7.data = $event"
        @getState="input7.state = $event"
      ></formInput>
    </template>
    <div class="text-h5">单选（formRadio）</div>
    <template>
      <formRadio
        :config="radio.subjectConfig"
        :options="radio.options"
        @change="radio.data = $event"
      />
    </template>
    <div class="text-h5">多选（formCheckbox）</div>
    <template>
      <formCheckbox
        :config="checkbox.subjectConfig"
        :options="checkbox.options"
        @change="checkbox.data = $event"
      />
    </template>
    <div class="text-h5">下拉选择（formSelect）</div>
    <template>
      <formSelect
        :config="select.subjectConfig"
        :options="select.options"
        @change="select.data = $event"
      />
    </template>
  </div>
</template>

<script>
import formInput from "../../components/form/formInput";
import formRadio from "../../components/form/formRadio";
import formCheckbox from "../../components/form/formCheckbox";
import formSelect from "../../components/form/formSelect";

export default {
  components: {
    formInput,
    formRadio,
    formCheckbox,
    formSelect
  },
  data() {
    return {
      input1: {
        data: "",
        state: false,
        subjectConfig: {
          mandatory: true,
          format: "TEXT",
          placerHolder: "这是占位符",
          title: "这是标题",
          titleNum: "1"
        }
      },
      input2: {
        data: "",
        state: false,
        subjectConfig: {
          mandatory: true,
          format: "PHONE",
          placerHolder: "这是手机号码输入框",
          title: "这是标题",
          titleNum: "2",
          titlePosition: "left"
        }
      },
      input3: {
        data: "",
        state: false,
        subjectConfig: {
          mandatory: true,
          format: "IDCARD",
          placerHolder: "这是身份证号码输入框"
        }
      },
      input4: {
        data: "",
        state: false,
        subjectConfig: {
          mandatory: true,
          format: "EMAIL",
          placerHolder: "这是邮箱输入框"
        }
      },
      input5: {
        data: "",
        state: false,
        subjectConfig: {
          mandatory: true,
          format: "text",
          maxLength: 20,
          minLength: 5,
          placerHolder: "这是限制5-20个字输入框"
        }
      },
      input6: {
        data: "",
        state: false,
        subjectConfig: {
          mandatory: true,
          format: "DAY",
          placerHolder: "这是天输入框"
        }
      },
      input7: {
        data: "",
        state: false,
        subjectConfig: {
          mandatory: true,
          format: "MINUTE",
          placerHolder: "这是时间输入框"
        }
      },
      radio: {
        data: "",
        subjectConfig: {
          mandatory: true,
          title: "这是在左标题",
          titleNum: "1",
          titlePosition: "left"
        },
        options: [
          { label: "男", value: "1" },
          { label: "女", value: "0" }
        ]
      },
      checkbox: {
        data: "",
        subjectConfig: {
          mandatory: true,
          minLength: 2,
          maxLength: 3,
          title: "这是在上标题",
          titleNum: "1",
          titlePosition: "top"
        },
        options: [
          { label: "炸鸡", value: "a" },
          { label: "汉堡", value: "b" },
          { label: "薯条", value: "c" },
          { label: "鸡块", value: "d" },
          { label: "鸡米花", value: "e" },
          { label: "鸡柳", value: "f" },
          { label: "鸡翅", value: "g" },
          { label: "鸡腿", value: "h" },
          { label: "鸡胸肉", value: "i" }
        ]
      },
      select: {
        data: "",
        subjectConfig: {
          mandatory: true,
          placerHolder: "请选择食品",
          title: "这是在左标题",
          titleNum: "1",
          titlePosition: "top"
        },
        options: [
          { label: "炸鸡", value: "a" },
          { label: "汉堡", value: "b" },
          { label: "薯条", value: "c" },
          { label: "鸡块", value: "d" },
          { label: "鸡米花", value: "e" },
          { label: "鸡柳", value: "f" },
          { label: "鸡翅", value: "g" },
          { label: "鸡腿", value: "h" },
          { label: "鸡胸肉", value: "i" }
        ]
      },
      upload: {
        data: "",
        subjectConfig: {
          format: "FILE",
          maxFileCount:"1",
          maxFileSize:"30",
          mandatory: true,
          placerHolder: "请选择食品",
          title: "这是在左标题",
          titleNum: "1",
          titlePosition: "top"
        }
      }
    };
  }
};
</script>

<style></style>
