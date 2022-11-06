const routes = [
  {
    path: "/",
    component: () => import("layouts/WePcLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/home/index.vue"),
        meta: { title: "FormGenerator" }
      }
    ]
  },
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        name: "login",
        path: "login",
        component: () => import("pages/Login/Login.vue"),
        meta: { title: "FormGenerator", pass: true }
      }
    ]
  },
  {
    path: "/demo",
    component: () => import("layouts/WePcLayout.vue"),
    children: [
      {
        path: "globalcss",
        component: () => import("pages/demo/GlobalCss.vue"),
        meta: { title: "FormGenerator", pass: true }
      },
      {
        path: "form",
        component: () => import("pages/demo/Form.vue"),
        meta: { title: "FormGenerator", pass: true }
      },
      {
        path: "form_editor",
        component: () => import("pages/demo/FormEditor.vue"),
        meta: { title: "FormGenerator", pass: true }
      },
      {
        path: "form_fill",
        component: () => import("pages/demo/FormFill.vue"),
        meta: { title: "FormGenerator", pass: true }
      },
      {
        path: "form_render",
        component: () => import("pages/demo/FormFillDemo.vue"),
        meta: { title: "FormGenerator", pass: true }
      },
      {
        path: "form_read",
        component: () => import("pages/demo/FormRead.vue"),
        meta: { title: "FormGenerator", pass: true }
      },
      {
        path: "table_card",
        component: () => import("pages/demo/TableCardDemo.vue"),
        meta: { title: "FormGenerator", pass: true }
      }
    ]
  },
  {
    path: "/basic",
    component: () => import("layouts/WePcLayout.vue"),
    children: [
      {
        path: "tree",
        component: () => import("pages/basic/Area.vue"),
        meta: { title: "FormGenerator" }
      },
      {
        path: "log",
        component: () => import("pages/basic/Log.vue"),
        meta: { title: "FormGenerator" }
      },
      {
        path: "proTree",
        component: () => import("pages/rbac/proTree.vue"),
        meta: { title: "FormGenerator" }
      },
      {
        path: "proTreeChild",
        component: () => import("pages/rbac/proTreeChild.vue"),
        meta: { title: "FormGenerator" }
      },
      {
        path: "roleAction",
        component: () => import("pages/rbac/roleAction.vue"),
        meta: { title: "FormGenerator" }
      },
      {
        path: "mypwd",
        component: () => import("pages/basic/MyPwd.vue"),
        meta: { title: "FormGenerator", pass: true }
      }
    ]
  },
  {
    path: "/home", // 首页
    component: () => import("layouts/WePcLayout.vue"),
    children: [
      {
        path: "index",
        component: () => import("pages/home/index.vue"),
        meta: { title: "FormGenerator" }
      }
    ]
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("pages/Login/Logout.vue"),
    meta: { title: "FormGenerator", pass: true }
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/*",
    name: "404",
    component: () => import("pages/Error404.vue"),
    meta: { title: "FormGenerator", pass: true }
  }
];

export default routes;
