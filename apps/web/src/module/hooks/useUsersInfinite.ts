import { useInfiniteQuery } from "@tanstack/react-query";
import { user, type GenderFilter, type SortDir, type StatusFilter } from "../api/user";

export function useUsersInfinite(p: {
  search: string;
  gender: GenderFilter;
  status: StatusFilter;
  sortBy?: string;
  sortDir?: SortDir;
  limit: number;
}) {
  return useInfiniteQuery({
    queryKey: ["users", p],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      user.getAll({
        limit: p.limit,
        cursor: pageParam,
        search: p.search,
        gender: p.gender,
        status: p.status,
        sortBy: p.sortBy,
        sortDir: p.sortDir,
      }),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    placeholderData: (prev) => prev,

    staleTime: 10_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}