import axiosInstance from "../../lib/axios";
import type { User } from "../types/User";

export type GenderFilter = "all" | "male" | "female";
export type StatusFilter = "all" | "active" | "inactive" | "blocked";
export type SortDir = "asc" | "desc";

export const user = {
  getAll: (p: {
    limit: number;
    cursor?: string | null;
    search?: string;
    gender?: GenderFilter;
    status?: StatusFilter;
    sortBy?: string;
    sortDir?: SortDir;
  }) =>
    axiosInstance
      .get("/api/users", {
        params: {
          limit: p.limit,
          cursor: p.cursor ?? undefined,
          search: p.search?.trim() || undefined,
          gender: p.gender ?? "all",
          status: p.status ?? "all",
          sortBy: p.sortBy || undefined,
          sortDir: p.sortDir || undefined,
        },
      })
      .then((res) => res.data as { items: User[]; nextCursor: string | null }),

  getOne: (id: string) =>
    axiosInstance.get(`/api/users/${id}`).then((res) => res.data),

  getCount: (p: {
    search?: string;
    gender?: GenderFilter;
    status?: StatusFilter;
    sortBy?: string;
    sortDir?: SortDir;
  }) =>
    axiosInstance
      .get("/api/users/count", {
        params: {
          search: p.search?.trim() || undefined,
          gender: p.gender ?? "all",
          status: p.status ?? "all",
          sortBy: p.sortBy || undefined,
          sortDir: p.sortDir || undefined,
        },
      })
      .then((res) => res.data as { totalRecords: number }),

  getPage: (p: any) =>
    axiosInstance.get("/api/users/page", { params: p }).then(r => r.data),
};