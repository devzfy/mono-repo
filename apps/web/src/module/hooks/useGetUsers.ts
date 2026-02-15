import { useQuery } from "@tanstack/react-query"
import { user } from "../api/user"
import type { UsersResponse } from "../types/User"
import { userMapper } from "../service/user-adapter"

export const useGetUsers = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: user.getAll,
    select: (res: UsersResponse) => userMapper(res.items)
  })

  return { data, isLoading, error }
}