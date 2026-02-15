import type { User, UserViewModel } from "../types/User";

export const userAdapter = (user: User): UserViewModel => ({
  id: user.id,
  cursor: user.cursor,
  fullName: `${user.firstName} ${user.lastName}`,
  email: user.email,
  phoneNumber: user.phoneNumber ?? "--",
  age: typeof user.age === "number" ? String(user.age) : "--",
  gender: user.gender ?? "--",
  status: user.status ?? "--",
});

export const userMapper = (data: User[]) => {
  return data.map(userAdapter) || []
}