export type StudentStatus = 'PAID' | 'FREE_TRIAL' | 'DICTATION';

export interface AllUsersData {
  testCode: string; // rowId
  parentId: string;
  parentName: string;
  phoneNumber: string;
  details: string;
  leadStatus: string; // statusId
  lastFollowupAt: Date;
  studentName: string;
  createdAt: Date;
  lastAttendedAt?: Date;
  admin: {
    name: string;
    id: string;
  };
  grade: string;
  status: StudentStatus;
}

export interface AllUsersResponse {
  page: {
    total: number;
    currentPage: number;
    limit: number;
  };
  data: AllUsersData[];
}

export interface LeadStatus {
  id: string;
  label: string;
  value: string;
}

export interface AllUsersFilters {
  q?: string;
  phoneNumber?: string;
  leadStatus?: string;
  createdAtBefore?: string;
  createdAtAfter?: string;
  page?: number;
  limit?: number;
}

export interface AllUsersApiParams extends AllUsersFilters {
  page?: number;
  offset?: number;
}
