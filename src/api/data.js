import axios from "axios";
import { enc } from "crypto-js";
import { Notify, Loading, QSpinnerBars } from "quasar";
import {
  url_prefix,
  goto_login_url,
  url_prefix_ws,
  url_prefix_upload,
  url_prefix_download,
  url_prefix_download_new
} from "../utils/co_util.js";
import { encrypt } from "./aes";
var errorCount = 0;

axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  config => {
    Loading.show({
      spinner: QSpinnerBars,
      spinnerColor: "white",
      spinnerSize: 50,
      delay: 400 // ms
    });
    return config;
  },
  err => {
    Notify.create({
      message: "request timeout!",
      position: "top",
      color: "negative"
    });
    return Promise.reject(err);
  }
);
axios.interceptors.response.use(
  data => {
    Loading.hide();
    if (data.status && data.status === 200 && data.data.status === "error") {
      Notify.create({
        message: data.data.msg,
        position: "top",
        color: "negative"
      });
      return;
    }
    if (data.data.code === 606) {
      errorCount = errorCount + 1;
      window.setTimeout(function () {
        if (errorCount !== 0) {
          Notify.create({
            message: "权限不足，请联系管理员",
            position: "top",
            color: "red",
            icon: "warning"
          });
          errorCount = 0;
        }
      }, 2000);
      return;
    }
    if (data.data.code === 2000) {
      errorCount = errorCount + 1;
      window.setTimeout(function () {
        window.location.href = goto_login_url(process.env.DEV);
      }, 2000);
      Notify.create({
        message: "User not logged in or expired",
        position: "top",
        color: "red",
        icon: "warning"
      });
      return;
    }
    if (data.data.code === 909) {
      errorCount = errorCount + 1;
      window.setTimeout(function () {
        if (errorCount !== 0) {
          Notify.create({
            message: "填写的数据过长",
            position: "top",
            color: "red",
            icon: "warning"
          });
          errorCount = 0;
        }
      }, 2000);
      return;
    }
    return data;
  },
  err => {
    Loading.hide();
    if (err.toString() === "Error: Network Error") {
      Notify.create({
        message: "网络错误....",
        position: "top",
        color: "orange",
        icon: "warning"
      });
      return Promise.reject(err);
    }
    if (err.response.status === 504 || err.response.status === 404) {
      Notify.create({
        message: "Link not found",
        position: "top",
        color: "negative"
      });
    } else if (err.response.status === 403) {
      Notify.create({
        message: "权限不足!",
        position: "top",
        color: "negative"
      });
    } else {
      Notify.create({
        message: "Undefined error!",
        position: "top",
        color: "negative"
      });
    }
    return Promise.reject(err);
  }
);

export const baseUrl = () => {
  return url_prefix(process.env.DEV);
};
export const baseWXUrl = () => {
  return url_prefix_ws(process.env.DEV);
};
export const getFileUrl = () => {
  return url_prefix_upload(process.env.DEV);
};
export const getDownloadUrl = () => {
  return url_prefix_download(process.env.DEV);
};
export const getDownloadUrlNew = () => {
  return url_prefix_download_new(process.env.DEV);
};
export const getMenuList = oid => {
  const param = new URLSearchParams();
  param.append("oid", oid);
  return axios.post(baseUrl() + "/i-user/getMenu", param);
};

export const getIdRecordPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  param.append("deviceName", filter.deviceName);
  param.append("deviceModel", filter.deviceModel);
  param.append("indate1", filter.date.replace(/\//g, "-"));
  return axios.post(baseUrl() + "/id-record/get-page", param);
};

// 尾随页面相关
export const getFollowRecordPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  param.append("deviceName", filter.deviceName);
  param.append("deviceModel", filter.deviceModel);
  param.append("indate1", filter.date.replace(/\//g, "-"));
  param.append("status", filter.status.value);
  return axios.post(baseUrl() + "/follow-record/get-follow-page", param);
};

export const deleteFollowInfoById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/follow-record/delete-one", param);
};

export const RemoveWarnById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/follow-record/remove-warn-one", param);
};

export const removeOverWarnById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/visitor/remove-over-warn", param);
};

export const getVrecordPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", 1);
  param.append("size", 5);
  return axios.post(baseUrl() + "/visitor-record/get-page", param);
};

export const getVrecords = () => {
  return axios.post(baseUrl() + "/visitor-record/get-records");
};

export const ssoCheck = (appcode, token, once, timestamp) => {
  const param = new URLSearchParams();
  param.append("appCode", appcode);
  param.append("token", token);
  param.append("once", once);
  param.append("timestamp", timestamp);
  return axios.post(baseUrl() + "/sso/sso-check", param);
};

export const getVisitorInsidePage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  param.append("visitedName", filter.visitedName);
  param.append("visitedDormName", filter.visitedDormName);
  param.append("visitorSource", "内部");
  // param.append('deviceName', filter.deviceName)
  param.append("createdTime1", filter.date.replace(/\//g, "-"));
  param.append("status", filter.status.value);
  return axios.post(baseUrl() + "/visitor/get-visitor-page", param);
};

export const getVisitorOutsidePage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  param.append("visitedName", filter.visitedName);
  param.append("visitedDormName", filter.visitedDormName);
  param.append("visitorSource", "外部");
  // param.append('deviceName', filter.deviceName)
  param.append("createdTime1", filter.date.replace(/\//g, "-"));
  param.append("status", filter.status.value);
  return axios.post(baseUrl() + "/visitor/get-visitor-page", param);
};

export const getFaceInputPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("inputType", filter.inputType);
  param.append("userId", filter.userId);
  param.append("username", filter.username);
  return axios.post(baseUrl() + "/face-input/get-face-page", param);
};

export const addFace = info => {
  const param = new URLSearchParams();
  param.append("inputType", info.inputType);
  param.append("phone", info.phone);
  param.append("idCard", info.idCard);
  param.append("userId", info.userId);
  param.append("username", info.username);
  param.append("faceUrl", info.img);
  param.append("visitorId", info.visitorId);
  param.append("sex", info.sex);
  return axios.post(baseUrl() + "/face-input/add-face", param);
};

export const addVisitorInside = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("gender", info.gender);
  param.append("phone", info.phone);
  param.append("idCard", info.idCard);
  param.append("visitedName", info.visitedName);
  param.append("visitedDormName", info.visitedDormName);
  param.append("relationship", info.relationship);
  param.append("visitorSource", "内部");
  param.append("faceUrl", info.faceUrl);
  param.append("indate", info.indate.replace(/T/g, " "));
  param.append("visitorId", info.visitorId);
  return axios.post(baseUrl() + "/visitor/add-visitor", param);
};

export const addVisitorOutside = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("gender", info.gender);
  param.append("phone", info.phone);
  param.append("idCard", info.idCard);
  param.append("visitedName", info.visitedName);
  param.append("visitedDormName", info.visitedDormName);
  param.append("relationship", info.relationship);
  param.append("visitorSource", "外部");
  param.append("faceUrl", info.faceUrl);
  param.append("visitorId", info.visitorId);
  param.append("indate", info.indate);
  return axios.post(baseUrl() + "/visitor/add-visitor", param);
};

export const updateFace = info => {
  const param = new URLSearchParams();
  param.append("inputType", info.inputType);
  param.append("phone", info.phone);
  param.append("idCard", info.idCard);
  param.append("userId", info.userId);
  param.append("username", info.username);
  param.append("faceUrl", info.img);
  param.append("id", info.id);
  param.append("sex", info.sex);
  return axios.post(baseUrl() + "/face-input/update-face", param);
};

export const updateVisitorInside = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("gender", info.gender);
  param.append("phone", info.phone);
  param.append("idCard", info.idCard);
  param.append("visitedName", info.visitedName);
  param.append("visitedDormName", info.visitedDormName);
  param.append("relationship", info.relationship);
  param.append("visitorSource", "内部");
  param.append("id", info.id);
  param.append("faceUrl", info.faceUrl);
  param.append("indate", info.indate);
  return axios.post(baseUrl() + "/visitor/update-visitor", param);
};

export const updateVisitorOutside = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("gender", info.gender);
  param.append("phone", info.phone);
  param.append("idCard", info.idCard);
  param.append("visitedName", info.visitedName);
  param.append("visitedDormName", info.visitedDormName);
  param.append("relationship", info.relationship);
  param.append("visitorSource", "外部");
  param.append("id", info.id);
  param.append("faceUrl", info.faceUrl);
  param.append("indate", info.indate);
  return axios.post(baseUrl() + "/visitor/update-visitor", param);
};

export const deleteInfoById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/visitor/delete-visitor", param);
};

export const deleteFaceById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/face-input/delete-face", param);
};

export const getFollowRecordCounts = () => {
  const param = new URLSearchParams();
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/follow-record/counts", param);
};

export const getVisitorInWarnCounts = () => {
  const param = new URLSearchParams();
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/visitor/inWarnCounts", param);
};

export const getVisitorOutWarnCounts = () => {
  const param = new URLSearchParams();
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/visitor/outWarnCounts", param);
};

// 通知有关
export const getNoticePage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("noticeObject", filter.noticeObject);
  param.append("title", filter.title);
  param.append("createdTime1", filter.date.replace(/\//g, "-"));
  param.append("type", filter.type);
  return axios.post(baseUrl() + "/notice/get-page", param);
};

export const addNotice = info => {
  const param = new URLSearchParams();
  param.append("title", info.title);
  param.append("content", info.content);
  param.append("noticeObject", info.noticeObject);
  param.append("type", info.type);
  return axios.post(baseUrl() + "/notice/add", param);
};

export const deleteNoticeById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/notice/delete", param);
};

export const updateNotice = info => {
  const param = new URLSearchParams();
  param.append("title", info.title);
  param.append("content", info.content);
  param.append("noticeObject", info.noticeObject);
  param.append("type", info.type);
  param.append("id", info.id);
  return axios.post(baseUrl() + "/notice/update", param);
};

// 公告有关
export const getAnnPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("object", filter.object);
  param.append("title", filter.title);
  param.append("createdTime1", filter.date.replace(/\//g, "-"));
  // param.append('type', filter.type)
  return axios.post(baseUrl() + "/announcement/get-page", param);
};

export const addAnn = info => {
  const param = new URLSearchParams();
  param.append("title", info.title);
  param.append("content", info.content);
  param.append("object", info.object);
  // param.append('type', info.type)
  return axios.post(baseUrl() + "/announcement/add", param);
};

export const deleteAnnById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/announcement/delete", param);
};

export const updateAnn = info => {
  const param = new URLSearchParams();
  param.append("title", info.title);
  param.append("content", info.content);
  param.append("object", info.object);
  // param.append('type', info.type)
  param.append("id", info.id);
  return axios.post(baseUrl() + "/announcement/update", param);
};

export const getKaoQinPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("UserID", filter.userId);
  param.append("RecordTime", filter.recordTime.replace(/\//g, "-"));
  return axios.post(baseUrl() + "/kq-insertkq/get-page", param);
};

export const addKaoQin = info => {
  const param = new URLSearchParams();
  param.append("UserID", info.UserID);
  param.append("RecordTime", info.RecordTime);
  param.append("time", info.time);
  return axios.post(baseUrl() + "/kq-insertkq/add", param);
};

export const getKaoQinLogPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("UserID", filter.userId);
  param.append("RecordTime", filter.recordTime.replace(/\//g, "-"));
  return axios.post(baseUrl() + "/kq-insertkq-log/get-page", param);
};

// 登录
export const adminLogin = (uname, passwd, code) => {
  const param = new URLSearchParams();
  param.append("userId", uname);
  param.append("password", passwd);
  param.append("verifyInput", code);
  return axios.post(baseUrl() + "/sso/user-login", param);
};

// 注册
export const register = (uname, passwd, repasswd, code) => {
  const param = new URLSearchParams();
  param.append("userId", uname);
  param.append("password", passwd);
  param.append("repassword", repasswd);
  param.append("verifyInput", code);
  return axios.post(baseUrl() + "/login/register", param);
};

export const adminLogout = () => {
  const param = new URLSearchParams();
  return axios.post(baseUrl() + "/login/out", param);
};

// 教委项目
export const getPlanPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.planName);
  param.append("collegeNames", filter.collegeNames);
  param.append("ifSend", filter.ifSend.value);
  param.append("type", filter.type);
  param.append("date", filter.createdTime.replace(/\//g, "-"));
  return axios.post(baseUrl() + "/plan/get-page", param);
};

// 教委项目
export const getQuestionGroupPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  // param.append('id', filter.groupId)
  // param.append('collegeNames', filter.collegeNames)
  // param.append('ifSend', filter.ifSend.value)
  // param.append('type', filter.type)
  param.append("date", filter.createdTime.replace(/\//g, "-"));
  return axios.post(baseUrl() + "/question-group/get-page", param);
};

// 教委项目
export const getQuestionsPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("groupId", filter.groupId);
  // param.append('id', filter.groupId)
  // param.append('collegeNames', filter.collegeNames)
  // param.append('ifSend', filter.ifSend.value)
  // param.append('type', filter.type)
  // param.append('date', filter.createdTime.replace(/\//g, '-'))
  return axios.post(baseUrl() + "/question/get-page2", param);
};

export const addPlan = (info, planBId, type) => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("profile", info.profile);
  param.append("collegeNames", info.collegeNames);
  param.append("questions", info.questions);
  param.append("questionTypes", info.type);
  param.append("type", info.useVirusModel);
  param.append("planBId", planBId);
  param.append("planType", type);
  param.append("tagIds", info.tag);
  // param.append('time', info.time)
  return axios.post(baseUrl() + "/plan/add", param);
};

// 添加通知
export const addAnnounce = (info, planBId, type, files) => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("profile", info.profile);
  param.append("collegeNames", info.collegeNames);
  param.append("questions", info.questions);
  param.append("questionTypes", info.type);
  param.append("type", info.useVirusModel);
  param.append("planBId", planBId);
  param.append("planType", type);
  param.append("noticeText", info.noticeText);
  param.append("image", info.image);
  param.append("files", files);
  param.append("endTime", info.endTime);
  param.append("tagIds", info.tag);
  param.append("questionGroupIds", info.group);
  param.append("questionMusts", info.must);
  param.append("startTime", info.startTime);
  param.append("rate", info.rate);
  // param.append('time', info.time)
  return axios.post(baseUrl() + "/plan/add-announce", param);
};

// 添加问题
export const addQuestions = info => {
  const param = new URLSearchParams();
  param.append("questions", info.questions);
  param.append("questionTypes", info.type);
  param.append("questionMusts", info.must);
  param.append("groupId", info.groupId);
  // param.append('time', info.time)
  return axios.post(baseUrl() + "/question/add", param);
};

export const deletePlanById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/jw-plan/delete/id", param);
};

export const deleteAnnounceById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/plan/delete/announce/id", param);
};

export const sendPlanById = (id, type) => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("planType", type);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/plan/send/id", param);
};

// 学校
export const getCollegeNames = () => {
  const param = new URLSearchParams();
  // param.append('id', id)
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/college/get-colleges", param);
};

// 标签
export const getTags = () => {
  const param = new URLSearchParams();
  // param.append('id', id)
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/college/get-tags", param);
};

export const getCollegePage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.collegeName);
  // param.append('date', filter.createdTime.replace(/\//g, '-'))
  return axios.post(baseUrl() + "/college/get-page", param);
};

export const addCollege = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("phone", info.phone);
  param.append("postCode", info.postCode);
  param.append("address", info.address);
  // param.append('address', info.address)
  // param.append('phone', info.phone)
  // param.append('postCode', info.postCode)
  // param.append('idWechat', info.wechatId)
  return axios.post(baseUrl() + "/college/add", param);
};

export const changeCollege = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("phone", info.phone);
  param.append("postCode", info.postCode);
  param.append("address", info.address);
  param.append("id", info.id);
  // param.append('address', info.address)
  // param.append('phone', info.phone)
  // param.append('postCode', info.postCode)
  // param.append('idWechat', info.wechatId)
  return axios.post(baseUrl() + "/college/update", param);
};

export const changeArea = info => {
  const param = new URLSearchParams();
  param.append("campusName", info.campus.label);
  param.append("campusId", info.campus.value);
  param.append("name", info.name);
  param.append("id", info.id);
  // param.append('address', info.address)
  // param.append('phone', info.phone)
  // param.append('postCode', info.postCode)
  // param.append('idWechat', info.wechatId)
  return axios.post(baseUrl() + "/area/update", param);
};

export const deleteCollegeById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/college/delete", param);
};

export const getAllCollegeAnswerByPlanId = (pagination, id) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("id", id);
  // param.append('departmentName', filter.departmentName)
  // param.append('date', filter.createdTime.replace(/\//g, '-'))
  return axios.post(baseUrl() + "/plan/get-answers", param);
};

export const getreplyCollegeAnswerByPlanId = (pagination, id) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("id", id);
  param.append("ifSend", 1);
  // param.append('departmentName', filter.departmentName)
  // param.append('date', filter.createdTime.replace(/\//g, '-'))
  return axios.post(baseUrl() + "/plan/get-answers/ifSend", param);
};

export const getunreplyCollegeAnswerByPlanId = (pagination, id) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("id", id);
  param.append("ifSend", 0);
  return axios.post(baseUrl() + "/plan/get-answers/ifSend", param);
};

export const getDetail = (pagination, collegeName, planId) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("collegeName", collegeName);
  param.append("planId", planId);
  return axios.post(baseUrl() + "/answer/get-detail", param);
};

export const getIfNewReply = () => {
  const param = new URLSearchParams();
  return axios.post(baseUrl() + "/answer/if-new-reply", param);
};

export const pcAccount = () => {
  const param = new URLSearchParams();
  return axios.post(baseUrl() + "/login/account", param);
};

export const getTelPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  // param.append('collegeName', collegeName)
  // param.append('planId', planId)
  return axios.post(baseUrl() + "/jw-plan/get-tel", param);
};

export const submitAnswers = info => {
  const param = new URLSearchParams();
  param.append("planId", info.planId);
  param.append("questionContent", info.questions);
  param.append("content", info.answers);
  // param.append('userId', userId)
  return axios.post(baseUrl() + "/jw-answer/submit", param);
};

export const getAnswersById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  // param.append('userId', userId)
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/jw-answer/get-answers/id", param);
};

// 填报通讯录页面
export const getTelPageByUserId = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  // param.append('userId', id)
  param.append("ifSend", filter.ifSend.value);
  param.append("name", filter.name);
  param.append("date", filter.createdTime.replace(/\//g, "-"));
  param.append("type", filter.type);
  // param.append('createdTime',info.createdTime)
  return axios.post(baseUrl() + "/jw-plan/get-plans/userId", param);
};

export const getStuffByName = name => {
  return axios.get(baseUrl() + "/common/stuffs/name?name=" + name);
};

export const getVeriCode = () => {
  // return axios.post(baseUrl() + '/login/getVerify')
  return axios.get(baseUrl() + "/login/getVerify", {
    responseType: "arraybuffer"
  });
};

export const checkVeriCode = code => {
  const param = new URLSearchParams();
  param.append("verifyInput", code);
  return axios.post(baseUrl() + "/login/checkVerify", param);
};

export const getLoginNumber = userId => {
  const param = new URLSearchParams();
  param.append("userId", userId);
  // console.log(userId)
  return axios.post(baseUrl() + "/login/get-loginErrorNum", param);
};

export const updatePassword = info => {
  const param = new URLSearchParams();
  param.append("userId", info.userId);
  param.append("exPassword", info.exPassword);
  param.append("newPassword", info.newPassword);
  param.append("repeatPassword", info.repeatPassword);
  // console.log(userId)
  return axios.post(baseUrl() + "/user/update-password", param);
};

export const addRoleUser = info => {
  const param = new URLSearchParams();
  param.append("userId", info.stuffInfo.value);
  param.append("roleName", info.roleName.label);
  param.append("roleCode", info.roleName.value);
  param.append("depName", info.depname.label);
  param.append("depId", info.depname.value);
  param.append("systemName", info.systemName);
  return axios.post(baseUrl() + "/child/add", param);
};

export const getCollegeByName = name => {
  const param = new URLSearchParams();
  param.append("name", name);
  return axios.post(baseUrl() + "/child/get-college/name", param);
};
export const updateImage = info => {
  const param = new URLSearchParams();
  param.append("userId", info.userId);
  param.append("image", info.image);
  // console.log(userId)
  return axios.post(baseUrl() + "/user/update-image", param);
};

export const getImageByUserId = userId => {
  const param = new URLSearchParams();
  param.append("userId", userId);
  // console.log(userId)
  return axios.post(baseUrl() + "/user/image/userId", param);
};

export const getUserName = () => {
  return axios.get(baseUrl() + "/i-user/account");
  // return axios.get(baseUrl() + '/login/account')
};

export const getCampusPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  param.append("collegeId", filter.collegeId);
  return axios.post(baseUrl() + "/campus/get-page", param);
};

export const getAreaPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  param.append("campusId", filter.campusId);
  return axios.post(baseUrl() + "/area/get-page", param);
};

export const getBuildingPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("name", filter.name);
  param.append("areaId", filter.areaId);
  return axios.post(baseUrl() + "/building/get-page", param);
};

export const getDormPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("dormName", filter.name);
  param.append("buildingId", filter.buildingId);
  return axios.post(baseUrl() + "/dorm/get-page", param);
};

export const addCampus = info => {
  const param = new URLSearchParams();
  param.append("collegeId", info.collegeInfo.value);
  param.append("collegeName", info.collegeInfo.label);
  param.append("name", info.name);
  param.append("telPerson", info.telPerson);
  param.append("address", info.address);
  param.append("telPhone", info.telPhone);
  return axios.post(baseUrl() + "/campus/add", param);
};

export const addBuilding = info => {
  const param = new URLSearchParams();
  param.append("areaId", info.area.value);
  param.append("areaName", info.area.label);
  param.append("name", info.name);
  param.append("zoneAdminId", info.zoneAdminId);
  param.append("zoneAdminName", info.zoneAdminName);
  param.append("isHeight", info.isHeight.value);
  // param.append('telPhone', info.telPhone)
  return axios.post(baseUrl() + "/building/add", param);
};

export const changeBuilding = info => {
  const param = new URLSearchParams();
  param.append("areaId", info.area.value);
  param.append("areaName", info.area.label);
  param.append("name", info.name);
  param.append("zoneAdminId", info.zoneAdminId);
  param.append("zoneAdminName", info.zoneAdminName);
  param.append("isHeight", info.isHeight.value);
  param.append("id", info.id);
  return axios.post(baseUrl() + "/building/update", param);
};

export const getColleges = () => {
  const param = new URLSearchParams();
  return axios.get(baseUrl() + "/college/get-list", param);
};

export const getCampuses = () => {
  const param = new URLSearchParams();
  return axios.get(baseUrl() + "/campus/get-list", param);
};

export const getAreas = () => {
  const param = new URLSearchParams();
  return axios.get(baseUrl() + "/area/get-list", param);
};

export const updateUser = info => {
  const param = new URLSearchParams();
  param.append("username", info.username);
  param.append("userId", info.userId);
  // param.append('type', info.type)
  param.append("phone", info.phone);
  param.append("id", info.id);
  return axios.post(baseUrl() + "/user/update", param);
};

export const getAreasByCampus = info => {
  const param = new URLSearchParams();
  param.append("campusId", info.campus.value);
  param.append("campusName", info.campus.label);
  return axios.post(baseUrl() + "/location/get-areas/campus", param);
};

export const deleteNodeById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/i-location/delete/note", param);
};

export const moveNode = (id1, id2) => {
  const param = new URLSearchParams();
  param.append("beforeId", id1);
  param.append("afterId", id2);
  return axios.post(baseUrl() + "/i-location/move", param);
};

export const getRoles = () => {
  return axios.get(baseUrl() + "/rbac/getAllRoles");
};

export const addArea = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  param.append("campusId", info.campus.value);
  param.append("campusName", info.campus.label);
  return axios.post(baseUrl() + "/area/add", param);
};

export const deleteAreaById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/area/delete", param);
};

export const deleteBuildingById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/building/delete", param);
};

export const changeCampus = info => {
  const param = new URLSearchParams();
  param.append("address", info.address);
  param.append("telPhone", info.telPhone);
  param.append("telPerson", info.telPerson);
  param.append("name", info.name);
  param.append("collegeName", info.collegeName);
  param.append("id", info.id);
  return axios.post(baseUrl() + "/campus/update", param);
};

export const deleteCampusById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/campus/delete", param);
};

export const addDorm = info => {
  const param = new URLSearchParams();
  param.append("buildingId", info.building.value);
  param.append("name", info.name);
  // param.append('bedNumber', info.bedNumber)
  // param.append('belong', info.belong)
  param.append("floorName", info.floorName);
  return axios.post(baseUrl() + "/dorm/add", param);
};

export const addChildNode = info => {
  const param = new URLSearchParams();
  param.append("nodeName", info.name);
  param.append("pid", info.id);
  param.append("type", info.type);
  param.append("level", info.level);
  return axios.post(baseUrl() + "/i-location/add-node", param);
};

export const addFatherNode = info => {
  const param = new URLSearchParams();
  param.append("nodeName", info.name);
  param.append("pid", info.pid);
  param.append("id", info.id);
  param.append("type", info.type);
  param.append("level", info.level);
  return axios.post(baseUrl() + "/i-location/add-father-node", param);
};

export const getInfoById = (id, pid) => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("pid", pid);
  return axios.post(baseUrl() + "/location/get-info/id", param);
};

export const deleteDormById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/dorm/delete", param);
};

export const getIfHaveChildren = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/location/get-if-have-children", param);
};

export const getChildrenByKey = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/i-location/get-children/key", param);
};

export const getAreasByCampusId = campusId => {
  const param = new URLSearchParams();
  param.append("campusId", campusId);
  return axios.post(baseUrl() + "/area/get-list/campusId", param);
};

export const getBuildingsByAreaId = info => {
  const param = new URLSearchParams();
  param.append("areaId", info.area.value);
  return axios.post(baseUrl() + "/building/get-list/areaId", param);
};

export const getLocationTree = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  return axios.post(baseUrl() + "/i-location/tree", param);
};

export const getLocationById = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("username", filter.name);
  param.append("id", filter.id);
  param.append("role", filter.role);
  return axios.post(baseUrl() + "/i-location/info/id", param);
};

export const getLocationRoleById = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("username", filter.name);
  param.append("job", filter.job);
  param.append("id", filter.id);
  param.append("roleName", filter.roleName.label);
  param.append("roleCode", filter.roleName.value);
  param.append("systemName", filter.systemName);
  return axios.post(baseUrl() + "/i-location/role/info/id", param);
};

export const addLocation = info => {
  const param = new URLSearchParams();
  param.append("type", info.type);
  param.append("locationName", info.locationName);
  param.append("parentName", info.parentName);
  return axios.post(baseUrl() + "/i-location/add", param);
};

export const getLocationTreePower = () => {
  return axios.get(baseUrl() + "/i-location/tree-power");
};

export const getUserLocationChildren = (
  id,
  nodeName,
  tagId,
  userId,
  userType
) => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("nodeName", nodeName);
  param.append("userId", userId);
  param.append("userType", userType);
  param.append("tagId", tagId);
  return axios.post(baseUrl() + "/i-location/get-children/key", param);
};
export const bindUserLocation = (locationId, type, tagId, userId, userType) => {
  const param = new URLSearchParams();
  param.append("locationId", locationId);
  param.append("type", type);
  param.append("userId", userId);
  param.append("userType", userType);
  param.append("tagId", tagId);
  return axios.post(baseUrl() + "/i-location/bind/user-location", param);
};

export const getGroupLocationChildren = (id, nodeName, groupId) => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("nodeName", nodeName);
  param.append("groupId", groupId);
  return axios.post(baseUrl() + "/device-group/get-children/key", param);
};
export const bindGroupLocation = (locationId, type, groupId) => {
  const param = new URLSearchParams();
  param.append("locationId", locationId);
  param.append("type", type);
  param.append("groupId", groupId);
  return axios.post(baseUrl() + "/device-group/bind/group-location", param);
};

export const deleteUserById = (id) => {
  const param = new URLSearchParams();
  param.append("userId", id);
  return axios.post(baseUrl() + "/i-user/delete", param);
};

export const deleteRoleUserById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/child/delete", param);
};

// 组别

export const addTag = info => {
  const param = new URLSearchParams();
  param.append("name", info.name);
  return axios.post(baseUrl() + "/i-tag/add", param);
};

export const deleteTagById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/i-tag/delete", param);
};

export const getTagUserPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("tagName", filter.tagName);
  param.append("username", filter.username);
  param.append("collegeName", filter.collegeName);
  return axios.post(baseUrl() + "/i-tag-user/get-page", param);
};

export const addTagUser = info => {
  const param = new URLSearchParams();
  param.append("tagName", info.tagName);
  param.append("username", info.username);
  param.append("userId", info.userId);
  return axios.post(baseUrl() + "/tag/tag-user/add", param);
};

export const deleteTagUserById = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/tag/tag-user/del", param);
};

export const getUserDepartment = id => {
  const param = new URLSearchParams();
  param.append("userId", id);
  return axios.post(baseUrl() + "/i-user/department", param);
};

export const getDepartments = id => {
  const param = new URLSearchParams();
  param.append("userId", id);
  return axios.post(baseUrl() + "/i-user/departments", param);
};

export const getDepartByMent = name => {
  const param = new URLSearchParams();
  param.append("name", name);
  return axios.post(baseUrl() + "/i-user/depart", param);
};

//获取学校通讯录列表
export const getPhoneCollegeList = (page, size, collegeid, uname) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("collegeid", collegeid);
  param.append("uname", uname);
  return axios.post(baseUrl() + "/phone/school_one", param);
};
//编辑学校通讯录列表
export const editCollegePhone = form => {
  const param = new URLSearchParams();
  param.append("id", form.id);
  param.append("collegeid", form.collegeid);
  param.append("collegename", form.collegename);
  param.append("depname", form.depname);
  param.append("uname", form.uname);
  param.append("phone", form.phone);
  return axios.post(baseUrl() + "/phone/phone_edit", param);
};
export const changeDepartment = info => {
  const param = new URLSearchParams();
  param.append("department", info.department);
  param.append("depart", info.depart);
  param.append("userId", info.userId);
  return axios.post(baseUrl() + "/i-user/change/department", param);
};
//删除学校通讯录列表
export const delCollegePhone = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("del", true);
  return axios.post(baseUrl() + "/phone/phone_edit", param);
};
//获取学校用户组
export const groupType = value => {
  const param = new URLSearchParams();
  param.append("value", value);
  return axios.post(baseUrl() + "/phone/phone_sync_type", param);
};
//根据学校查询用户
export const groupTypeUsers = (value, username) => {
  const param = new URLSearchParams();
  param.append("value", value);
  param.append("username", username);
  return axios.post(baseUrl() + "/phone/phone_sync_user", param);
};
//获取同步通讯录
export const telephoneSyncPage = (page, size, uname) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("uname", uname);
  return axios.post(baseUrl() + "/phone/phone_sync", param);
};
//添加同步通讯录
export const telephoneSyncAdd = form => {
  const param = new URLSearchParams();
  param.append("qtype", form.qtype);
  param.append("uid", form.uid);
  param.append("uname", form.uname);
  param.append("depname", form.depname);
  return axios.post(baseUrl() + "/phone/phone_sync_add", param);
};
//删除同步通讯录
export const delPhoneSync = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/phone/phone_sync_del", param);
};
//发布问卷
export const releaseQuestion = (qid, data) => {
  const param = new URLSearchParams();
  param.append("qid", qid);
  param.append("data", data);
  return axios.post(baseUrl() + "/question/release", param);
};
//发布问卷日志
export const releaseLogPage = (page, size, qid, sdt, edt) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("qid", qid);
  param.append("sdt", sdt);
  param.append("edt", edt);
  return axios.post(baseUrl() + "/question/infos", param);
};
//编辑定时任务
export const editMession = (qid, form, data) => {
  const param = new URLSearchParams();
  param.append("id", form.id);
  param.append("qid", qid);
  param.append("title", form.title);
  param.append("dt", form.dt);
  param.append("remarks", form.remarks);
  param.append("sdt", form.sdt);
  param.append("edt", form.edt);
  param.append("cycle", form.cycle);
  param.append("data", data);
  param.append("jobgroupname", "question");
  param.append("jobmethod", "QuestionJob");
  return axios.post(baseUrl() + "/question/mession_time", param);
};
//查看任务列表
export const messionPage = (page, size, qid, title) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("qid", qid);
  param.append("title", title);
  return axios.post(baseUrl() + "/question/mession_page", param);
};
//查看任务发送对象列表
export const messionObjectPage = (page, size, mid) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("mid", mid);
  return axios.post(baseUrl() + "/question/mession_object_page", param);
};
//启用禁用任务
export const changeMessionStatus = (id, status) => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("status", status);
  return axios.post(baseUrl() + "/question/mession_status", param);
};
//删除任务
export const delMessionStatus = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("del", true);
  return axios.post(baseUrl() + "/question/mession_status", param);
};

// 高校公示信息
export const getCollegesBySearch = name => {
  const param = new URLSearchParams();
  param.append("collegeName", name);
  return axios.post(baseUrl() + "/i-college/collegeName", param);
};

//获取问卷列表
export const QuestionInfoPage = (page, size, filter) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("name", filter.name);
  param.append("username", filter.username);
  return axios.post(baseUrl() + "/question/info_page", param);
};
//添加问卷
export const infoSet = form => {
  const param = new URLSearchParams();
  param.append("id", form.id);
  param.append("name", form.name);
  param.append("overview", form.overview);
  param.append("remarks", form.remarks);
  return axios.post(baseUrl() + "/question/info_set", param);
};
//删除问卷
export const infoDel = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/question/info_del", param);
};
//编辑问卷题目
export const saveQForm = (data, title, qid) => {
  const param = new URLSearchParams();
  param.append("data", data);
  param.append("domainId", title.domainId);
  param.append("domainTitle", title.domainTitle);
  param.append("qid", qid);
  return axios.post(baseUrl() + "/question/info_question_set", param);
};
//获取问卷题目
export const getQSubject = qid => {
  const param = new URLSearchParams();
  param.append("qid", qid);
  return axios.get(baseUrl() + "/question/info_content?qid=" + qid);
};
//获取编辑问卷内容
export const getQSubjectEdit = qid => {
  const param = new URLSearchParams();
  param.append("qid", qid);
  return axios.get(baseUrl() + "/question/edit_content?qid=" + qid);
};
//获取对应推送问卷列表
export const userInfoPage = (page, size, filter) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("name", filter.name);
  if (filter.yue != null) {
    param.append("yue", filter.yue.value);
  }
  if (filter.fin != null) {
    param.append("fin", filter.fin.value);
  }
  return axios.post(baseUrl() + "/question/user_info_page", param);
};
//获取填报问卷
export const getQSubjects = id => {
  const param = new URLSearchParams();
  return axios.get(baseUrl() + "/question/user_info_one?id=" + id);
};
//填写问卷
export const saveQAnswer = (data, id, fin) => {
  const param = new URLSearchParams();
  param.append("data", data);
  param.append("id", id);
  param.append("fin", fin);
  return axios.post(baseUrl() + "/question/user_info_update", param);
};
//获取填报的问卷答案
export const getQMake = id => {
  return axios.get(baseUrl() + "/question/user_info_answer?id=" + id);
};
// 首页-消息中心
export const getIndexMessage = () => {
  return axios.get(baseUrl() + "/index/messages");
};
// 首页-数据中心
export const getIndexSchoolData = () => {
  return axios.get(baseUrl() + "/index/school-data");
};
// 首页-获取用户的session信息
export const getIndexSessionUser = () => {
  return axios.get(baseUrl() + "/index/session-user");
};
// 首页-待办事项分页
export const getIndexTodoPages = (appid, page, size, type) => {
  const param = new URLSearchParams();
  param.append("appid", appid);
  param.append("page", page);
  param.append("size", size);
  param.append("type", type);
  return axios.get(baseUrl() + "/index/todo-pages", param);
};
// 首页-事务中心
export const getIndexTransaction = () => {
  return axios.get(baseUrl() + "/index/transaction-center");
};

//信息报表发送
//发布问卷
export const releaseQuestionReport = (qid, data) => {
  const param = new URLSearchParams();
  param.append("qid", qid);
  param.append("data", data);
  return axios.post(baseUrl() + "/inforeport/release", param);
};
//发布问卷日志
export const releaseLogPageReport = (page, size, qid, sdt, edt) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("qid", qid);
  param.append("sdt", sdt);
  param.append("edt", edt);
  return axios.post(baseUrl() + "/inforeport/infos", param);
};
//编辑定时任务
export const editMessionReport = (qid, form, data) => {
  const param = new URLSearchParams();
  param.append("id", form.id);
  param.append("qid", qid);
  param.append("title", form.title);
  param.append("dt", form.dt);
  param.append("remarks", form.remarks);
  param.append("sdt", form.sdt);
  param.append("edt", form.edt);
  param.append("cycle", form.cycle);
  param.append("data", data);
  return axios.post(baseUrl() + "/inforeport/mession_time", param);
};
//查看任务列表
export const messionPageReport = (page, size, qid, title) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("qid", qid);
  param.append("title", title);
  return axios.post(baseUrl() + "/inforeport/mession_page", param);
};
//查看任务发送对象列表
export const messionObjectPageReport = (page, size, mid) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("mid", mid);
  return axios.post(baseUrl() + "/inforeport/mession_object_page", param);
};
//启用禁用任务
export const changeMessionStatusReport = (id, status) => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("status", status);
  return axios.post(baseUrl() + "/inforeport/mession_status", param);
};
//删除任务
export const delMessionStatusReport = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  param.append("del", true);
  return axios.post(baseUrl() + "/inforeport/mession_status", param);
};

//获取问卷列表
export const QuestionInfoPageReport = (page, size, filter) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("name", filter.name);
  param.append("username", filter.username);
  return axios.post(baseUrl() + "/inforeport/info_page", param);
};
//添加问卷
export const infoSetReport = form => {
  const param = new URLSearchParams();
  param.append("id", form.id);
  param.append("name", form.name);
  param.append("overview", form.overview);
  param.append("remarks", form.remarks);
  return axios.post(baseUrl() + "/inforeport/info_set", param);
};
//删除问卷
export const infoDelReport = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/inforeport/info_del", param);
};
//编辑问卷题目
export const saveQFormReport = (data, title, qid) => {
  const param = new URLSearchParams();
  param.append("data", data);
  param.append("domainId", title.domainId);
  param.append("domainTitle", title.domainTitle);
  param.append("qid", qid);
  return axios.post(baseUrl() + "/inforeport/info_question_set", param);
};
//获取问卷题目
export const getQSubjectReport = qid => {
  const param = new URLSearchParams();
  param.append("qid", qid);
  return axios.get(baseUrl() + "/inforeport/info_content?qid=" + qid);
};
//获取对应推送问卷列表
export const userInfoPageReport = (page, size, filter) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("name", filter.name);
  if (filter.yue != null) {
    param.append("yue", filter.yue.value);
  }
  if (filter.fin != null) {
    param.append("fin", filter.fin.value);
  }
  return axios.post(baseUrl() + "/inforeport/user_info_page", param);
};
//获取填报问卷
export const getQSubjectsReport = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.get(baseUrl() + "/inforeport/user_info_one?id=" + id);
};
//填写问卷
export const saveQAnswerReport = (data, id, fin) => {
  const param = new URLSearchParams();
  param.append("data", data);
  param.append("id", id);
  param.append("fin", fin);
  return axios.post(baseUrl() + "/inforeport/user_info_update", param);
};
//获取填报的问卷答案
export const getQMakeReport = id => {
  return axios.get(baseUrl() + "/inforeport/user_info_answer?id=" + id);
};

//

//获取会议信息(管理)
export const MeetInfoPage = (page, size, filter) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("title", filter.title);
  param.append("username", filter.sponsor);
  return axios.post(baseUrl() + "/meeting/list", param);
};
//会议管理获取报名状态
export const MeetUnitsPage = (page, size, filter) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("id", filter.id);
  param.append("name", filter.name);
  param.append("status", filter.status);
  return axios.post(baseUrl() + "/meet/manage_units", param);
};
//撤回会议
export const meetDel = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/meet/del", param);
};
//获取会议信息(个人)
export const MeetInfoPagePersonal = (page, size, filter) => {
  const param = new URLSearchParams();
  param.append("page", page);
  param.append("size", size);
  param.append("title", filter.title);
  param.append("sponsor", filter.sponsor);
  return axios.post(baseUrl() + "/meet/personal", param);
};
//根据管理员所在区域获取对应通讯录
export const phoneManageList = () => {
  const param = new URLSearchParams();
  param.append("time", new Date());
  return axios.post(baseUrl() + "/phone/manage_list", param);
};
//管理员编辑通讯录
export const phoneManageEdit = data => {
  const param = new URLSearchParams();
  param.append("data", data);
  return axios.post(baseUrl() + "/phone/manage_edit", param);
};

// 用户 User
export const getUserPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("userId", filter.userId);
  param.append("username", filter.username);
  param.append("gender", filter.gender);
  param.append("job", filter.job);
  return axios.post(baseUrl() + "/i-user/get-page", param);
};

export const addUser = info => {
  const param = new URLSearchParams();
  param.append("userId", info.userId);
  param.append("username", info.username);
  param.append("gender", info.gender);
  param.append("job", info.job);
  param.append("phone", info.phone);
  param.append("idCard", info.idCard);
  param.append("college", info.parentName);
  param.append("campus", info.depart);
  return axios.post(baseUrl() + "/i-user/add", param);
};

export const updateUserInfo = info => {
  const param = new URLSearchParams();
  // param.append('userId', info.userId)
  // param.append('username', info.username)
  // param.append('gender', info.gender)
  param.append("id", info.id);
  param.append("job", info.job);
  param.append("phone", info.phone);
  // param.append('idCard', info.idCard)
  param.append("college", info.college);
  param.append("campus", info.campus);
  return axios.post(baseUrl() + "/i-user/update", param);
};

export const changePassword = info => {
  const param = new URLSearchParams();
  let rePassword = encrypt(info.rePassword);
  let newPassword = encrypt(info.newPassword);
  let confirmPassword = encrypt(info.confirmPassword);
  param.append("id", info.id);
  param.append("rePassword", rePassword);
  param.append("newPassword", newPassword);
  param.append("confirmPassword", confirmPassword);
  return axios.post(baseUrl() + "/i-user/update-password", param);
};

export const changePasswordInitial = info => {
  const param = new URLSearchParams();
  let rePassword = encrypt(info.rePassword);
  let newPassword = encrypt(info.newPassword);
  let confirmPassword = encrypt(info.confirmPassword);
  param.append("rePassword", rePassword);
  param.append("newPassword", newPassword);
  param.append("confirmPassword", confirmPassword);
  return axios.post(baseUrl() + "/i-user/update-password-initial", param);
};
export const exportUser = filter => {
  window.open(baseUrl() + "/i-user/export");
};

export const importUserIn = file => {
  let formData = new FormData();
  formData.append("file", file);
  let config = {
    headers: { "Content-Type": "multipart/form-data" }
  };
  return axios.post(baseUrl() + "/i-user/import-user", formData, config);
};

// 日志
export const getLogPage = (pagination, filter) => {
  const param = new URLSearchParams();
  param.append("page", pagination.page);
  param.append("size", pagination.rowsPerPage);
  param.append("userId", filter.userId);
  param.append("username", filter.username);
  return axios.post(baseUrl() + "/i-log/get-page", param);
};

// 子系统
export const getRoleNames = () => {
  return axios.get(baseUrl() + "/child/get-roles");
};

export const getSystemNames = () => {
  return axios.get(baseUrl() + "/child/get-systems");
};

//校验旧密码
export const validOldPasswd = pwd => {
  const param = new URLSearchParams();
  let enpwd = encrypt(pwd);
  param.append("pwd", enpwd);
  return axios.post(baseUrl() + "/i-user/valid-password", param);
};

//校验时间
export const InfoCheckTime = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/inforeport/check_time", param);
};

//重置登录错误次数
export const resetError = id => {
  const param = new URLSearchParams();
  param.append("id", id);
  return axios.post(baseUrl() + "/i-user/reset-error", param);
};
