export type Gender = "male" | "female";
export type UserStatus = "active" | "inactive" | "blocked";

export interface User {
  id: string;
  cursor: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: Gender;
  status: UserStatus;
}

export interface UsersResponse {
  items: User[];
  nextCursor: string | null;
}

export interface UsersCountResponse {
  totalRecords: number;
}

export interface UserViewModel {
  id: string;
  cursor: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  age: string;
  gender: string;
  status: string;
}


export type Status = "active" | "inactive" | "blocked";

export type UsersPageParams = {
  page: number;
  pageSize: number;

  search?: string;

  gender?: "all" | Gender;
  status?: "all" | Status;

  sortBy?: "id" | "age" | "lastName";
  sortDir?: "asc" | "desc";
};


export type UsersPageResponse = {
  items: User[];
  page: number;
  pageSize: number;
};