import { useQuery } from "@tanstack/react-query";
import { user, type GenderFilter, type SortDir, type StatusFilter } from "../api/user";

export function useUsersTotal(p: {
  search: string;
  gender?: GenderFilter;
  status?: StatusFilter;
  sortBy?: string;
  sortDir?: SortDir;
}) {
  return useQuery({
    queryKey: ["usersTotal", p],
    queryFn: () =>
      user.getCount({
        search: p.search,
        gender: p.gender,
        status: p.status,
        sortBy: p.sortBy,
        sortDir: p.sortDir,
      }),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}