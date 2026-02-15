import { useMemo, useState } from "react";
import { DataGrid, type GridColDef, type GridSortModel } from "@mui/x-data-grid";
import { Box, TextField, MenuItem } from "@mui/material";

import { useDebounced } from "../../../hooks/useDebounced";
import { useUsersTotal } from "../../hooks/useUsersTotal";
import { useUsersWithPage } from "../../hooks/useUsersWithPage";
import { getCachedScore } from "../../../lib/scoreCache";
import { expensiveScore } from "../../../lib/expensiveScore";
import { type StatusFilter } from "../../api/user";
import type { User } from "../../types/User";


export default function MUIDataGrid() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);

  const [status, setStatus] = useState<StatusFilter>("all");

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "lastName", sort: "asc" },
  ]);

  const sortBy = (sortModel[0]?.field as "id" | "age" | "lastName" | undefined) ?? "lastName";
  const sortDir = (sortModel[0]?.sort as "asc" | "desc" | undefined) ?? "asc";

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 50 });

  const q = useUsersWithPage({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    search: debouncedSearch,
    gender: "all",
    status,
    sortBy,
    sortDir,
  });

  const totalQ = useUsersTotal({
    search: debouncedSearch,
    gender: "all",
    status,
    sortBy,
    sortDir,
  });

  const rows = useMemo<User[]>(() => q.data?.items ?? [], [q.data]);

  const columns: GridColDef<User>[] = [
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

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPaginationModel((m) => ({ ...m, page: 0 }));
          }}
          size="small"
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusFilter);
            setPaginationModel((m) => ({ ...m, page: 0 }));
          }}
          size="small"
          sx={{ width: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="blocked">Blocked</MenuItem>
        </TextField>

        <Box sx={{ ml: "auto", opacity: 0.8 }}>
          Total{" "}
          <b>
            {totalQ.isLoading ? "…" : totalQ.data?.totalRecords?.toLocaleString() ?? "—"}
          </b>
        </Box>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={(m) => setSortModel(m)}
        paginationMode="server"
        rowCount={totalQ.data?.totalRecords ?? 0}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={q.isFetching}
        pageSizeOptions={[25, 50, 100]}
        sx={{ height: 750 }}
      />
    </Box>
  );
}