import {
  IBackendRes,
  ICompany,
  IAccount,
  IUser,
  IModelPaginate,
  IGetAccount,
  IJob,
  IResume,
  IPermission,
  IRole,
  ISubscribers,
  IHrRegistration,
} from "@/types/backend";
import axios from "config/axios-customize";

/**
 * 
Module Auth
 */
export const callRegister = (
  name: string,
  email: string,
  password: string,
  age: number,
  gender: string,
  address: string
) => {
  return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
    name,
    email,
    password,
    age,
    gender,
    address,
  });
};

export const callLogin = (username: string, password: string) => {
  return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
    username,
    password,
  });
};

export const callFetchAccount = () => {
  return axios.get<IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

export const callRefreshToken = () => {
  return axios.get<IBackendRes<IAccount>>("/api/v1/auth/refresh");
};

export const callLogout = () => {
  return axios.post<IBackendRes<string>>("/api/v1/auth/logout");
};

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileUpload", file);
  return axios<IBackendRes<{ fileName: string }>>({
    method: "post",
    url: "/api/v1/files/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      folder_type: folderType,
    },
  });
};

/**
 * 
Module Company
 */
export const callCreateCompany = (
  name: string,
  address: string,
  description: string,
  logo: string,
  image: string,
  linkUrl: string,
  minScale: number,
  maxScale: number
) => {
  return axios.post<IBackendRes<ICompany>>("/api/v1/companies", {
    name,
    address,
    description,
    logo,
    image,
    linkUrl,
    minScale,
    maxScale,
  });
};

export const callUpdateCompany = (
  id: string,
  name: string,
  address: string,
  description: string,
  logo: string,
  image: string,
  linkUrl: string,
  minScale: number,
  maxScale: number
) => {
  return axios.patch<IBackendRes<ICompany>>(`/api/v1/companies/${id}`, {
    name,
    address,
    description,
    logo,
    image,
    linkUrl,
    minScale,
    maxScale,
  });
};

export const callDeleteCompany = (id: string) => {
  return axios.delete<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
};

export const callFetchCompany = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<ICompany>>>(
    `/api/v1/companies?${query}`
  );
};

export const callFetchCompanyById = (id: string) => {
  return axios.get<IBackendRes<ICompany>>(`/api/v1/companies/${id}`);
};
export const callNumberOfCompany = () => {
  return axios.post(`/api/v1/companies/companyCount`);
};

/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
  return axios.post<IBackendRes<IUser>>("/api/v1/users", { ...user });
};

export const callUpdateUser = (user: IUser) => {
  return axios.patch<IBackendRes<IUser>>(`/api/v1/users`, { ...user });
};

export const callDeleteUser = (id: string) => {
  return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
};

export const callFetchUser = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IUser>>>(
    `/api/v1/users?${query}`
  );
};
export const callNumberOfUser = () => {
  return axios.post(`/api/v1/users/userCount`);
};
/**
 * 
Module Job
 */
export const callCreateJob = (job: IJob) => {
  return axios.post<IBackendRes<IJob>>("/api/v1/jobs", { ...job });
};

export const callUpdateJob = (job: IJob, id: string) => {
  return axios.patch<IBackendRes<IJob>>(`/api/v1/jobs/${id}`, { ...job });
};

export const callDeleteJob = (id: string) => {
  return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
};

export const callFetchJob = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
};

export const callFetchSuggestJob = (query: string) => {
  return axios.get(`/api/v1/jobs/matching-by-user?${query}`);
};
export const callFetchJobWithAdmin = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IJob>>>(
    `/api/v1/jobs/admin?${query}`
  );
};
export const callNumberOfJobs = () => {
  return axios.post(`/api/v1/jobs/jobCount`);
};

export const callFetchJobById = (id: string) => {
  return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
};
/**
 * 
Module Save new
 */
export const callSaveJob = async (jobId: string, userId: string) => {
  return axios.post(`api/v1/saved-jobs/${jobId}`, { userId });
};

export const callFetchSavedJobs = async (userId: string) => {
  try {
    const response = await axios.get(`api/v1/saved-jobs/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    throw error;
  }
};

export const callDeleteSavedJob = async (jobId: string, userId: string) => {
  try {
    const response = await axios.delete(`api/v1/saved-jobs/${jobId}`, {
      data: { userId },
    });
    return response;
  } catch (error) {
    console.error("Error deleting saved job:", error);
    throw error;
  }
};

/**
 * 
Module Resume
 */
export const callCreateResume = (
  url: string,
  typeUrl: string,
  companyId: any,
  jobId: any
) => {
  return axios.post<IBackendRes<IResume>>("/api/v1/resumes", {
    url,
    typeUrl,
    companyId,
    jobId,
  });
};

export const callUpdateResumeStatus = (id: any, status: string) => {
  return axios.patch<IBackendRes<IResume>>(`/api/v1/resumes/${id}`, { status });
};

export const callDeleteResume = (id: string) => {
  return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
};

export const callFetchResume = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IResume>>>(
    `/api/v1/resumes?${query}`
  );
};
export const callFetchResumeWithAdmin = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IResume>>>(
    `/api/v1/resumes/admin?${query}`
  );
};
export const callFetchResumeById = (id: string) => {
  return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
};

export const callFetchResumeByUser = () => {
  return axios.post<IBackendRes<IResume[]>>(`/api/v1/resumes/by-user`);
};

// export const callNumberOfResumeOverTime = () => {
//     return axios.post(`/api/v1/resume-builders/count-by-date?startDate=2024-10-10&endDate=2024-11-29`);
// }
// API call với tham số startDate và endDate
export const callNumberOfResumeOverTime = (
  startDate: String,
  endDate: String
) => {
  return axios.post(
    `/api/v1/resume-builders/count-by-date?startDate=${startDate}&endDate=${endDate}`
  );
};

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
  return axios.post<IBackendRes<IPermission>>("/api/v1/permissions", {
    ...permission,
  });
};

export const callUpdatePermission = (permission: IPermission, id: string) => {
  return axios.patch<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`, {
    ...permission,
  });
};

export const callDeletePermission = (id: string) => {
  return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
};

export const callFetchPermission = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IPermission>>>(
    `/api/v1/permissions?${query}`
  );
};

export const callFetchPermissionById = (id: string) => {
  return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
};

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
  return axios.post<IBackendRes<IRole>>("/api/v1/roles", { ...role });
};

export const callUpdateRole = (role: IRole, id: string) => {
  return axios.patch<IBackendRes<IRole>>(`/api/v1/roles/${id}`, { ...role });
};

export const callDeleteRole = (id: string) => {
  return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
};

export const callFetchRole = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IRole>>>(
    `/api/v1/roles?${query}`
  );
};

export const callFetchRoleById = (id: string) => {
  return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
};

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
  return axios.post<IBackendRes<ISubscribers>>("/api/v1/subscribers", {
    ...subs,
  });
};

export const callGetSubscriberSkills = () => {
  return axios.post<IBackendRes<ISubscribers>>("/api/v1/subscribers/skills");
};

export const callUpdateSubscriber = (subs: ISubscribers) => {
  return axios.patch<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, {
    ...subs,
  });
};

export const callDeleteSubscriber = (id: string) => {
  return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
};

export const callFetchSubscriber = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(
    `/api/v1/subscribers?${query}`
  );
};

export const callFetchSubscriberById = (id: string) => {
  return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
};

export const callSendNewJob = (jobId: string) => {
  return axios.post<IBackendRes<any>>(`/api/v1/mail/send-job/${jobId}`);
};

/**
 * 
Hr Registration
 */
export const callFetchHrRegister = (query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IHrRegistration>>>(
    `/api/v1/hr-registration/admin?${query}`
  );
};
export const callFetchHrRegisterById = (id: string) => {
  return axios.get<IBackendRes<IHrRegistration>>(
    `/api/v1/hr-registration/${id}`
  );
};

export const callUpdateHrRegister = (
  id: string,
  IHrRegistration: IHrRegistration
) => {
  return axios.patch<IBackendRes<IHrRegistration>>(
    `/api/v1/hr-registration/${id}`,
    {
      ...IHrRegistration,
    }
  );
};
export const callDeleteHrRegister = (id: string) => {
  return axios.delete<IBackendRes<IHrRegistration>>(
    `/api/v1/hr-registration/${id}`
  );
};
