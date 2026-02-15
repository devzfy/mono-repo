import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebounced } from "../../../hooks/useDebounced";
import type { GenderFilter, StatusFilter } from "../../api/user";
import { useUsersInfinite } from "../../hooks/useUsersInfinite";
import { useUsersTotal } from "../../hooks/useUsersTotal";
import { LoadingRows } from "../../../pages/LoadingRows";
import { useTableColumn } from "./col";



export type User = {
  id: string;
  cursor: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: "male" | "female";
  status: string;
};

export default function UsersWowTable() {
  const columns = useTableColumn()
  const limit = 150;

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);

  const [gender, setGender] = useState<GenderFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const [sorting, setSorting] = useState<SortingState>([
    { id: "lastName", desc: false },
  ]);
  const sortBy = sorting[0]?.id;
  const sortDir = sorting[0]?.desc ? "desc" : "asc";

  const q = useUsersInfinite({
    search: debouncedSearch,
    gender,
    status,
    sortBy,
    sortDir,
    limit,
  });

  const totalQ = useUsersTotal({
    search: debouncedSearch,
    gender,
    status,
    sortBy,
    sortDir,
  });

  const data = useMemo(
    () => q.data?.pages.flatMap((p: any) => p.items) ?? [],
    [q.data]
  );



  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 54,
    overscan: 15,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const last = virtualRows[virtualRows.length - 1];
    if (
      last &&
      q.hasNextPage &&
      !q.isFetchingNextPage &&
      last.index > rows.length - 40
    ) {
      q.fetchNextPage();
    }
  }, [virtualRows, rows.length, q]);

  useEffect(() => {
    parentRef.current?.scrollTo({ top: 0 });
  }, [debouncedSearch, gender, status, sortBy, sortDir]);

  const isUpdatingRows = q.isFetching && !q.isFetchingNextPage;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-3 flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="flex-1 min-w-64 px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as GenderFilter)}
            className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer hover:border-primary/50"
          >
            <option value="all">All gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer hover:border-primary/50"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-4 px-2 py-2 text-sm text-muted-foreground">
          <span>
            Loaded <span className="font-semibold text-foreground">{rows.length.toLocaleString()}</span>
          </span>
          <span className="text-border">·</span>
          <span>
            Total{" "}
            <span className="font-semibold text-foreground">
              {totalQ.isLoading
                ? "…"
                : totalQ.data?.totalRecords?.toLocaleString() ?? "—"}
            </span>
          </span>
          {q.isFetchingNextPage && (
            <>
              <span className="text-border">·</span>
              <span className="text-primary animate-pulse">Loading more…</span>
            </>
          )}
        </div>
      </div>

      <div
        ref={parentRef}
        className="relative h-[650px] overflow-auto border border-border rounded-xl shadow-sm bg-card"
      >
        <div
          className="sticky top-0 bg-muted border-b border-border font-semibold text-sm text-foreground z-10 grid gap-0"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {table.getHeaderGroups().map((hg) =>
            hg.headers.map((h) => (
              <div
                key={h.id}
                onClick={h.column.getToggleSortingHandler()}
                className="px-4 py-3 cursor-pointer select-none hover:bg-muted/70 transition-colors flex items-center gap-2 group whitespace-nowrap"
              >
                <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                {h.column.getIsSorted() === "asc" && (
                  <span className="text-primary group-hover:scale-110 transition-transform">↑</span>
                )}
                {h.column.getIsSorted() === "desc" && (
                  <span className="text-primary group-hover:scale-110 transition-transform">↓</span>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
          {rows.length === 0 && !isUpdatingRows && !q.isError ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No users found
            </div>
          ) : null}

          {q.isError ? (
            <div className="absolute inset-0 flex items-center justify-center text-destructive font-medium">
              Error loading rows
            </div>
          ) : null}

          {virtualRows.map((vr) => {
            const row = rows[vr.index];
            if (!row) return null;

            return (
              <div
                key={row.id}
                className="absolute w-full border-b border-border hover:bg-muted/30 transition-colors grid gap-0"
                style={{
                  top: 0,
                  left: 0,
                  transform: `translateY(${vr.start}px)`,
                  gridTemplateColumns: "repeat(7, 1fr)",
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="px-4 py-3 text-sm text-foreground flex items-center overflow-hidden"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {isUpdatingRows && (
          <LoadingRows title="Updating rows…" />
        )}
      </div>
    </div>
  );
}
