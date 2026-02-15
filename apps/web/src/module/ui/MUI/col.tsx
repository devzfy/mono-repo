import type { GridColDef } from "@mui/x-data-grid";
import type { User } from "../../types/User";
import { getCachedScore } from "../../../lib/scoreCache";
import { expensiveScore } from "../../../lib/expensiveScore";

export const columns: GridColDef<User>[] = [
  { field: "firstName", headerName: "First", flex: 1 },
  { field: "lastName", headerName: "Last", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "age", headerName: "Age", width: 90 },
  { field: "gender", headerName: "Gender", width: 110 },
  { field: "status", headerName: "Status", width: 110 },
  {
    field: "computedScore",
    headerName: "Computed Score",
    width: 160,
    sortable: false,
    renderCell: (params) => {
      const s = getCachedScore(params.row.id, () => expensiveScore(params.row));
      return <span>{s.toFixed(1)}</span>;
    },
  },
];