import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import type { User } from "../../types/User";
import { Badge } from "../../../components/ui/badge";
import { getCachedScore } from "../../../lib/scoreCache";
import { expensiveScore } from "../../../lib/expensiveScore";

export const useTableColumn = () => {
  return useMemo<ColumnDef<User>[]>(
    () => [
      { accessorKey: "firstName", header: "First" },
      { accessorKey: "lastName", header: "Last" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "age", header: "Age" },
      { accessorKey: "gender", header: "Gender", cell: ({ row }) => row.original.gender.toUpperCase() },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.original.status === 'active' ? "default" : "destructive"}>{row.original.status}</Badge> },
      {
        id: "score",
        header: "Computed Score",
        cell: ({ row }) => {
          const s = getCachedScore(row.original.id, () => expensiveScore(row.original));
          return <span>{Number.isFinite(s) ? s.toFixed(1) : "--"}</span>;
        },
      },
    ],
    []
  )
}