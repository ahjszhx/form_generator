/*
 * @Author: ZhangHX
 * @LastEditors: ZhangHX
 * @Date: 2021-05-27 16:20:58
 * @LastEditTime: 2021-05-27 16:39:52
 * @Email: ahjszhx@126.com
 * @FilePath: /form_generator_web/src/boot/register-component.js
 * @Environment: Win 10
 * @Description: 
 */

import Vue from 'vue'
import formInput from "../components/form/formInput";
import formRadio from "../components/form/formRadio";
import formCheckbox from "../components/form/formCheckbox";
import formSelect from "../components/form/formSelect";
import formOptionList from "../components/form/formOptionList";
import formDomainLine from "../components/form/formDomainLine";
import formUpload from "../components/form/formUpload";
import formFill from "../components/formFill/index";
import formFillCategory from "../components/formFill/formFillCategory";
import formEditor from "../components/formEditor/index";
import formComponent from "../components/form/formComponent";
import formSwitch from "../components/form/formSwitch";
import formDescr from "../components/form/formDescr";
import formRichTextEditor from "../components/form/formRichTextEditor";
import tableCard from "../components/TableCard";
Vue.component("formInput", formInput); // 输入框表单组件
Vue.component("formRadio", formRadio); // 单选项表单组件
Vue.component("formCheckbox", formCheckbox); // 多选项表单组件
Vue.component("formSelect", formSelect); // 下拉选择表单组件
Vue.component("formOptionList", formOptionList); // 候选项设置器
Vue.component("formDomainLine", formDomainLine); // 分区表单组件
Vue.component("formUpload", formUpload); // 上传表单组件
Vue.component("formFill", formFill); // 表单渲染器
Vue.component("formEditor", formEditor); // 表单编辑器
Vue.component("formComponent", formComponent); // 全局自定义组件
Vue.component("formSwitch", formSwitch); // 开关表单组件
Vue.component("formDescr", formDescr); // 备注说明表单组件
Vue.component("formRichTextEditor", formRichTextEditor); // 富文本编辑组件
Vue.component("tableCard", tableCard); // 表格卡片组件
Vue.component("formFillCategory", formFillCategory); // 表单渲染器