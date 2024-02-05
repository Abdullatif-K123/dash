export const API_ROUTES = {
  domainName: "https://gaca.somee.com",
  auth: {
    post: "https://gaca.somee.com/api/Auth/Login",
    forgetOtp: "https://gaca.somee.com/api/Auth/ForgetPasswordOTP",
    forgetPass: "https://gaca.somee.com/api/Auth/ForgetPassword",
    resetPass: "https://gaca.somee.com/api/Auth/ResetPassword",
  },
  profile: {
    get: "https://gaca.somee.com/api/Profile/GetMyProfileData",
    put: "https://gaca.somee.com/api/Profile/UpdateMyProfileData",
    changePassPut: "https://gaca.somee.com/api/Profile/UpdateMyProfilePassword",
  },
  user: {
    getAll: "https://gaca.somee.com/api/User/GetAllPagination",
    post: "https://gaca.somee.com/api/User/Create",
    put: "https://gaca.somee.com/api/User/Update",
    putPassword: "https://gaca.somee.com//api/User/UpdatePassword",
    delete: "https://gaca.somee.com/api/User/Delete",
  },
  socialMedia: {
    get: "https://gaca.somee.com/api/Social/GetData",
    post: "https://gaca.somee.com/api/Social/Update",
  },
  links: {
    getAll: "https://gaca.somee.com/api/Link/GetAllPagination",
    get: "https://gaca.somee.com/api/Link/GetById",
    post: "https://gaca.somee.com/api/Link/Create",
    put: "https://gaca.somee.com/api/link/update",
    delete: "https://gaca.somee.com/api/Link/Delete",
  },
  statistics: {
    get: "https://gaca.somee.com/api/Statistics/GetData",
  },
  blogs: {
    getAll: "https://gaca.somee.com/api/Blog/GetAllPagination",
    get: "https://gaca.somee.com/api/Blog/GetById",
    post: "https://gaca.somee.com/api/Blog/Create",
    put: "https://gaca.somee.com/api/Blog/Update",
    delete: "https://gaca.somee.com/api/Blog/Delete",
  },
  media: {
    BlogPost: "https://gaca.somee.com/api/Media/UploadFile/MediaType/blog/Id",
    StakeholderPost: "https://gaca.somee.com/api/Media/UploadFile/MediaType/stakeholder/Id",
    doucmentPost: "https://gaca.somee.com/api/Media/UploadFile/MediaType/ducoment/Id",
  },
  masterPlan: {
    get: "https://gaca.somee.com/api/Masterplan/GetData",
    put: "https://gaca.somee.com/api/Masterplan/Update",
  },
  masterPlanContext: {
    get: "https://gaca.somee.com/api/Masterplancontext/GetContextById",
    post: "https://gaca.somee.com/api/Masterplancontext/Create",
    put: "https://gaca.somee.com/api/Masterplancontext/Update",
    delete: "https://gaca.somee.com/api/Masterplancontext/Delete",
  },
  topic: {
    get: "https://gaca.somee.com/api/Topic/GetContextById",
    post: "https://gaca.somee.com/api/Topic/Create",
    put: "https://gaca.somee.com/api/Topic/Update",
    delete: "https://gaca.somee.com/api/Topic/Delete",
  },
  sup_topic: {
    get: "https://gaca.somee.com/api/SubTopic/GetContextById",
    post: "https://gaca.somee.com/api/SubTopic/Create",
    put: "https://gaca.somee.com/api/SubTopic/Update",
    delete: "https:gaca.somee.com/api/SubTopic/Delete",
  },
  sup_topic_addendum: {
    get: "https://gaca.somee.com/api/SubTopicAddendum/GetContextById/",
    post: "https://gaca.somee.com/api/SubTopicAddendum/Create",
    put: "https://gaca.somee.com/api/SubTopicAddendum/Update",
    delete: "https://gaca.somee.com/api/SubTopicAddendum/Delete",
  },
  stakeholder: {
    getAll: "https://gaca.somee.com/api/Stakeholder/GetAllPagination",
    post: "https://gaca.somee.com/api/Stakeholder/Create",
    put: "https://gaca.somee.com/api/Stakeholder/Update",
    delete: "https://gaca.somee.com/api/Stakeholder/Delete",
  },
  document: {
    getAll: "https://gaca.somee.com/api/Document/GetAllPagination",
    post: "https://gaca.somee.com/api/Document/Create",
    put: "https://gaca.somee.com/api/Document/Update",
    delete: "https://gaca.somee.com/api/Document/Delete",
  },
  message: {
    getAll: "https://gaca.somee.com/api/Message/GetAllPagination",
    get: "https://gaca.somee.com/api/Message/GetById",
    delete: "https://gaca.somee.com/api/Message/Delete",
  },
  home: {
    get: "https://gaca.somee.com/api/Home/GetData",
    put: "https://gaca.somee.com/api/Home/Update",
  },
  about: {
    get: "https://gaca.somee.com/api/About/GetData",
    put: "https://gaca.somee.com/api/About/Update",
  },
};
