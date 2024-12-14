export const ALL_PERMISSIONS = {
  COMPANIES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/v1/companies",
      module: "COMPANIES",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/v1/companies",
      module: "COMPANIES",
    },
    UPDATE: {
      method: "PATCH",
      apiPath: "/api/v1/companies/:id",
      module: "COMPANIES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/v1/companies/:id",
      module: "COMPANIES",
    },
  },
  JOBS: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/v1/jobs", module: "JOBS" },
    CREATE: { method: "POST", apiPath: "/api/v1/jobs", module: "JOBS" },
    UPDATE: { method: "PATCH", apiPath: "/api/v1/jobs/:id", module: "JOBS" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/jobs/:id", module: "JOBS" },
  },
  PERMISSIONS: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/v1/permissions",
      module: "PERMISSIONS",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/v1/permissions",
      module: "PERMISSIONS",
    },
    UPDATE: {
      method: "PATCH",
      apiPath: "/api/v1/permissions/:id",
      module: "PERMISSIONS",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/v1/permissions/:id",
      module: "PERMISSIONS",
    },
  },
  RESUMES: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/v1/resumes",
      module: "RESUMES",
    },
    CREATE: { method: "POST", apiPath: "/api/v1/resumes", module: "RESUMES" },
    UPDATE: {
      method: "PATCH",
      apiPath: "/api/v1/resumes/:id",
      module: "RESUMES",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/v1/resumes/:id",
      module: "RESUMES",
    },
  },
  ROLES: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/v1/roles", module: "ROLES" },
    CREATE: { method: "POST", apiPath: "/api/v1/roles", module: "ROLES" },
    UPDATE: { method: "PATCH", apiPath: "/api/v1/roles/:id", module: "ROLES" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/roles/:id", module: "ROLES" },
  },
  USERS: {
    GET_PAGINATE: { method: "GET", apiPath: "/api/v1/users", module: "USERS" },
    CREATE: { method: "POST", apiPath: "/api/v1/users", module: "USERS" },
    UPDATE: { method: "PATCH", apiPath: "/api/v1/users/:id", module: "USERS" },
    DELETE: { method: "DELETE", apiPath: "/api/v1/users/:id", module: "USERS" },
  },
  HR_REGISTRATION: {
    GET_PAGINATE: {
      method: "GET",
      apiPath: "/api/v1/hr-registration/admin",
      module: "HR_REGISTRATION",
    },
    CREATE: {
      method: "POST",
      apiPath: "/api/v1/hr-registration",
      module: "HR_REGISTRATION",
    },
    UPDATE: {
      method: "PATCH",
      apiPath: "/api/v1/hr-registration/:id",
      module: "HR_REGISTRATION",
    },
    DELETE: {
      method: "DELETE",
      apiPath: "/api/v1/hr-registration/:id",
      module: "HR_REGISTRATION",
    },
  },
};

export const ALL_MODULES = {
  AUTH: "AUTH",
  COMPANIES: "COMPANIES",
  FILES: "FILES",
  JOBS: "JOBS",
  PERMISSIONS: "PERMISSIONS",
  RESUMES: "RESUMES",
  ROLES: "ROLES",
  USERS: "USERS",
  SUBSCRIBERS: "SUBSCRIBERS",
  TEMPLATE: "TEMPLATE",
  HR_REGISTRATION: "HR_REGISTRATION",
};
