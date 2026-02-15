import type { User } from "../module/ui/Tanstack";

export function expensiveScore(u: User): number {
  let x = 0;
  const s = `${u.firstName}|${u.lastName}|${u.email}|${u.phoneNumber}|${u.age}|${u.gender}|${u.status}`;
  for (let i = 0; i < s.length; i++) x = (x * 33 + s.charCodeAt(i)) >>> 0;
  for (let i = 0; i < 300; i++) x = (x ^ (x << 13) ^ (x >>> 7)) >>> 0;
  return (x % 1000) / 10;
}