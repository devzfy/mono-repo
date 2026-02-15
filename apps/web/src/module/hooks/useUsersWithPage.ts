import { useQuery } from "@tanstack/react-query";
import type { UsersPageParams, UsersPageResponse } from "../types/User";
import { user } from "../api/user";

export function useUsersWithPage(params: UsersPageParams) {
  return useQuery<UsersPageResponse>({
    queryKey: ["usersPage", params],
    queryFn: () => user.getPage(params),
    placeholderData: (prev) => prev,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });
}