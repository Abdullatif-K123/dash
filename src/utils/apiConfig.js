export const API_ROUTES = {
  domainName: "https://gaca.somee.com",
  auth: {
    post: "https://gaca.somee.com/api/Auth/Login",
  },
  user: {
    getAll: "https://gaca.somee.com/api/User/GetAllPagination",
    post: "https://gaca.somee.com/api/User/Create",
    put: "https://gaca.somee.com/api/User/Update",
    delete: "https://gaca.somee.com/api/User/Delete",
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
