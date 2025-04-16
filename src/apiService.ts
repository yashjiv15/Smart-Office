  // src/apiService.ts
  import { Json } from 'sequelize/types/utils';
  import axiosInstance from './axiosInstance';


  const API_URL = 'http://localhost:3000';

  interface LoginUserRequest {
    email: string;
    password: string;
  }
  interface ForgotPasswordRequest {
    email: string;
  }

  interface VerifyOtpRequest {
    email: string;
    otp: string;
  }

  interface ResetPasswordRequest {
    email: string;
    newPassword: string;
  }
  export interface UserData {
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    user_role: string;
  }
  export interface UpdateUserData {
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    user_role: string;
  }
  export interface CustomerData {
    first_name: string;
    last_name: string;
    spoc_name: string;
    spoc_mobile: string;
    company_name: string;
    company_registration_number: string;
    company_mobile: string;
    email: string;
    mobile: string;
    company_gst: string;
    pan: string;
    adhaar: string;
    
  }

  export interface ViewCustomerData {
    customer_id: string;
    first_name: string;
    last_name: string;
    spoc_name: string;
    spoc_mobile: string;
    company_name: string;
    company_registration_number: string;
    company_mobile: string;
    email: string;
    mobile: string;
    company_gst: string;
    pan: string;
    adhaar: string;
    
  }
  export interface ViewDocumentData {
    
    document_id: string;
    document_name: string;
    created_by: string;
    created_at: Date;
    updated_by: string;
    updated_at: Date;
    is_deleted: boolean;
    
    
  }
  export interface RoleData {
    role_id: number;
    role_name: string;
    created_by: string | null;
    created_at: string;
    updated_by: string | null;
    updated_at: string;
    is_deleted: boolean;
  }
  export interface WorkMasterData {
  
    work_master_id: string;
    work_master: string;
    work_document:string[];
    work_cost:string;

  }
  
  export interface ViewWorkMasterData {
    work_master_id:string;
    work_master: string;
    work_document: string[]; // Ensure this is an array of strings
    work_cost:string;
    created_by: string | null;
    created_at: string;
    updated_by: string | null;
    updated_at: string;
    is_deleted: boolean;
  }
  export interface AddRoleData {
  
    role_name: string;
  
  }

  export interface UpdateRoleData {
  
    role_name: string;
  old_role_name:string;
  }


  // New function to update a customer
  export interface UpdateCustomerData {
    customer_id: string;
    first_name: string;
    last_name: string;
    spoc_name: string;
    spoc_mobile: string;
    company_name: string;
    company_registration_number: string;
    company_mobile: string;
    email: string;
    mobile: string;
    company_gst: string;
    pan: string;
    adhaar: string;
    
  }

  export interface StatusItem {
    status_id: number;
    status: string;
  }
  
  export interface ViewWorkData {
    work_documents(work_documents: any): void;
    work_master: any;
    work_id: string;
    enquiry_id: string;
    customer_name: string;
    work_status: string;
    work_details: {
      work_master: string;
      work_cost: string;
      work_documents: string[]; // Array of strings for work documents
      work_owner: string;
      work_owner_role: string;
      work_task_status: string;
      work_task_created_at: string;
      work_task_updated_at: string;
      work_task_complete_time: string;
      status_list: StatusItem[]; // Updated to an array of StatusItem
      work_document_vs_customer_document: string[];
    }[];
    created_by: string | null;
    created_at: string;
    updated_by: string | null;
    updated_at: string;
    is_deleted: boolean;
    enquiry_date: string; // Add enquiry_date here
    session_user_role: string;
  }
  
  export const updateCustomer = async (updateData: UpdateCustomerData) => {
    try {
      const response = await axiosInstance.put(`${API_URL}/api/routes/update-customer`, updateData);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  // Define type for customer_id parameter
  interface DeleteCustomerRequest {
    customer_id: string; // Ensure customer_id is explicitly defined as a number
  }

  // Function to delete a customer by customer_id
  export const deleteCustomer = async ({ customer_id }: DeleteCustomerRequest) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/api/routes/delete-customer`, { data: { customer_id } });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };


  export const loginUser = async ({ email, password }: LoginUserRequest) => {
    try {
      const response = await axiosInstance.post<{ token: string, permissions: string[] }>('/api/routes/user-login', { email, password });
  
      // Store the session email and token in local storage
      localStorage.setItem('sessionEmail', email);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('sessionPermissions', JSON.stringify(response.data.permissions));
  
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  
  export function hasPermission(requiredPermission: string): boolean {
    const sessionPermissions = localStorage.getItem('sessionPermissions');
    if (!sessionPermissions) return false;
    const permissionsArray = JSON.parse(sessionPermissions);
    return permissionsArray.includes(requiredPermission);
  }
  
  export const logoutUser = async () => {
    try {
      await axiosInstance.post('/api/routes/user-logout');
  
      // Clear session data from local storage
      localStorage.removeItem('sessionEmail');
      localStorage.removeItem('authToken');
      localStorage.removeItem('sessionPermissions');
    } catch (error: any) {
      throw error.response.data;
    }
  };
  export const forgotPassword = async ({ email }: ForgotPasswordRequest) => {
    try {
      const response = await axiosInstance.post<{ message: string }>(`${API_URL}/api/routes/forgot-password`, { email });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  export const verifyOtp = async ({ email, otp }: VerifyOtpRequest) => {
    try {
      const response = await axiosInstance.post<{ message: string }>(`${API_URL}/api/routes/verify-otp`, { email, otp });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  export const resetPassword = async ({ email, newPassword }: ResetPasswordRequest) => {
    try {
      const response = await axiosInstance.post<{ message: string }>(`${API_URL}/api/routes/reset-password`, { email, newPassword });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };




  export const addCustomer = async (customerData: CustomerData) => {
    try {
      const response = await axiosInstance.post(`${API_URL}/api/routes/add-customer`, customerData);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  export const viewCustomers = async () => {
    try {
      const response = await axiosInstance.get<ViewCustomerData[]>(`${API_URL}/api/routes/view-customers`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  export const viewRoles = async () => {
    try {
      const response = await axiosInstance.post<RoleData[]>(`${API_URL}/api/routes/view-roles`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching roles:', error.response.data || error.message);  // Log error message
      throw error.response.data;
    }
  };
  export const viewWorkMaster = async () => {
    try {
      const response = await axiosInstance.post<ViewWorkMasterData[]>(`${API_URL}/api/routes/view-work-master`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching work master:', error.response.data || error.message);  // Log error message
      throw error.response.data;
    }
  };
  export const viewWork = async () => {
    try {
      const response = await axiosInstance.post<ViewWorkData[]>(`${API_URL}/api/routes/view-work`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching work master:', error.response.data || error.message);  // Log error message
      throw error.response.data;
    }
  };
  export const deleteRole = async (role_name: string): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/api/routes/delete-roles`, { data: { role_name } });
  };
  export const deleteWorkMaster = async (work_master_id: string): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/api/routes/delete-work-master`, { data: { work_master_id } });
  };
  export const viewUsers = async () => {
    try {
      const response = await axiosInstance.post<UserData[]>(`${API_URL}/api/routes/view-users`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };




  export const addUser = async (userData: UserData): Promise<void> => {
    try {
      await axiosInstance.post('/api/routes/add-users', userData);
    } catch (error: any) {
      throw error.response.data;
    }
  };
  export const addWorkMaster = async (workMasterData: WorkMasterData): Promise<void> => {
    try {
      await axiosInstance.post('/api/routes/add-work-master', workMasterData);
    } catch (error: any) {
      throw error.response.data;
    }
  };
  export const addRole = async (roleData: AddRoleData): Promise<void> => {
    try {
      await axiosInstance.post('/api/routes/add-roles', roleData);
    } catch (error: any) {
      throw error.response.data;
    }
  };
  export const updateRole = async (roleData: UpdateRoleData): Promise<void> => {
    try {
      await axiosInstance.put('/api/routes/update-roles', roleData);
    } catch (error: any) {
      throw error.response.data;
    }
  };
  export const updateWorkMaster = async (workMasterData: WorkMasterData): Promise<void> => {
    try {
      await axiosInstance.put('/api/routes/update-work-master', workMasterData);
    } catch (error: any) {
      throw error.response.data;
    }
  };


  export const updateUser = async (userData: UpdateUserData): Promise<void> => {
    await axiosInstance.put(`${API_URL}/api/routes/update-users`, userData);
  };

  export const deleteUser = async (email: string): Promise<void> => {
    await axiosInstance.delete(`${API_URL}/api/routes/delete-users`, { data: { email } });
  };

export interface DocumentData {
  document_name: string;
}

export const addDocument = async (documentData: DocumentData): Promise<void> => {
  try {
    await axiosInstance.post('/api/routes/add-document', documentData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface ViewDocumentData {
  document_id: string;
  document_name: string;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  is_deleted: boolean;
}

export const viewDocuments = async (): Promise<ViewDocumentData[]> => {
  try {
    const response = await axiosInstance.get('/api/routes/view-document');
    return response.data.documents;
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface UpdateDocumentData {
  document_name: string;
  old_document_name: string;
}

export const updateDocument = async (documentData: UpdateDocumentData): Promise<void> => {
  try {
    await axiosInstance.put('/api/routes/update-document', documentData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export const deleteDocument = async (documentName: string): Promise<void> => {
  try {
    await axiosInstance.delete('/api/routes/delete-document', { data: { document_name: documentName } });
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface EnquiryData {
  customer_id?: string;
  work_enquiry: object;
}

export const addEnquiry = async (enquiryData: EnquiryData): Promise<void> => {
  try {
    await axiosInstance.post('/api/routes/add-enquiry', enquiryData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface FetchCustomerData {
  customer_id: string;
  first_name: string;
  last_name: string;
}

export const fetchCustomer = async (email_mobile: string): Promise<FetchCustomerData> => {
  try {
    const response = await axiosInstance.get<FetchCustomerData>(`${API_URL}/api/routes/fetch-customer`, {
      params: { email_mobile },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface WorkEnquiry {
  work_master?: string;
  work_document?: string;
  work_cost?: string;
}

export interface ViewEnquiryData {
  enquiry_id: number;
  customer_id: number;
  customer_name: string;
  work_enquiry: WorkEnquiry[];
  enquiry_status: string;
  created_by?: string;
  created_at: Date;
  updated_by?: string;
  updated_at: Date;
  is_deleted?: boolean;
}

export const viewEnquiry = async (): Promise<ViewEnquiryData[]> => {
  try {
    const response = await axiosInstance.get<ViewEnquiryData[]>('/api/routes/view-enquiry');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching enquiries:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export interface UpdateEnquiryData {
  enquiry_id: number;
  new_status: string; // Assuming status is a string, adjust if it's a number or another type
}

export const updateEnquiry = async (enquiryData: UpdateEnquiryData): Promise<void> => {
  try {
    await axiosInstance.put('/api/routes/update-enquiry', enquiryData);
  } catch (error: any) {
    throw error.response?.data || new Error('An error occurred while updating the enquiry');
  }
};

export const deleteEnquiry = async (enquiryId: number): Promise<void> => {
  try {
    await axiosInstance.delete('/api/routes/delete-enquiry', { data: { enquiry_id: enquiryId } });
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface FetchEnquiryStatus {
  status_id: number;
  status: string;
  status_for: string;
}

export const fetchEnquiryStatus = async (): Promise<FetchEnquiryStatus[]> => {
  try {
    const response = await axiosInstance.get<FetchEnquiryStatus[]>(`${API_URL}/api/routes/fetch-enquiry-status`);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface PermissionData {
  permission_title: string;
}

export const addPermission = async (permissionData: PermissionData): Promise<void> => {
  try {
    await axiosInstance.post('/api/routes/add-permission', permissionData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface ViewPermissionData {
  permission_name: string;
  permission_title: string;

}

export const viewPermissions = async (): Promise<ViewPermissionData[]> => {
  try {
    const response = await axiosInstance.post<ViewPermissionData[]>(`${API_URL}/api/routes/view-permission`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching permissions:', error.response?.data || error.message); // Log error message
    throw error.response?.data || error.message;
  }
};

export interface UpdatePermissionData {
  permission_title: string;
  new_permission_title?: string; // Make this optional for adding permissions
}

export const updatePermission = async (updatePermissionData: UpdatePermissionData): Promise<void> => {
  try {
    await axiosInstance.put('/api/routes/update-permission', updatePermissionData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export const deletePermission = async (permissionTitle: string): Promise<void> => {
  try {
    await axiosInstance.delete('/api/routes/delete-permission', { data: { permission_title: permissionTitle } });
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface RolePermissionData {
  role_name: string;
  permissions: string[];
}

export const addRolePermission = async (rolePermissionData: RolePermissionData): Promise<void> => {
  try {
    await axiosInstance.post('/api/routes/add-role-permission', rolePermissionData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface ViewRolePermissionData {
  permissions: string[];
}

export const viewRolePermissions = async (role_name: string): Promise<ViewRolePermissionData> => {
  try {
    const response = await axiosInstance.post<ViewRolePermissionData>(`${API_URL}/api/routes/view-role-permission`, { role_name });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching role permissions:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export interface AssignWorkTaskData {
  work_id: string;
  work_master: string; // Use work_master instead of work_master_id
  first_name: string;
  last_name: string;
}


export const assignWorkTask  = async (assignWorkTaskData: AssignWorkTaskData): Promise<void> => {
  try {
    await axiosInstance.post('/api/routes/add-work-task', assignWorkTaskData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface RevokeWorkTaskData {
  work_id: string;
  work_master: string;
}

export const revokeWorkTask = async (revokeWorkTaskData: RevokeWorkTaskData): Promise<void> => {
  try {
    await axiosInstance.post('/api/routes/delete-work-task', revokeWorkTaskData);
  } catch (error: any) {
    throw error.response.data;
  }
};

export interface UpdateWorkTaskData {
  work_id: string;
  work_master: string; // Change to work_master
  work_documents?: string[]; // Ensure this is an array and optional
  work_task_status?: string; // Make optional
}

export const updateWorkTask  = async (updateWorkTaskData: UpdateWorkTaskData): Promise<void> => {
  try {
    await axiosInstance.put('/api/routes/update-work-task', updateWorkTaskData);
  } catch (error: any) {
    throw error.response.data;
  }
};
