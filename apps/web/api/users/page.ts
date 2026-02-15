import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const allowedSort = new Set(["lastName", "age", "email", "status", "gender"]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const page = Math.max(Number(req.query.page ?? 0), 0);
    const limit = Math.min(Math.max(Number(req.query.limit ?? 150), 10), 500);
    const offset = page * limit;

    const gender = typeof req.query.gender === "string" ? req.query.gender : "all";
    const status = typeof req.query.status === "string" ? req.query.status : "all";
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

    const sortByRaw = typeof req.query.sortBy === "string" ? req.query.sortBy : "lastName";
    const sortDirRaw = typeof req.query.sortDir === "string" ? req.query.sortDir : "asc";

    const sortBy = allowedSort.has(sortByRaw) ? sortByRaw : "lastName";
    const sortDir = sortDirRaw === "desc" ? "DESC" : "ASC";

    const where: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (gender !== "all") {
      where.push(`gender = $${idx++}`);
      params.push(gender);
    }
    if (status !== "all") {
      where.push(`status = $${idx++}`);
      params.push(status);
    }
    if (search) {
      where.push(`(
        "firstName" ILIKE $${idx} OR
        "lastName" ILIKE $${idx} OR
        email ILIKE $${idx}
      )`);
      params.push(`${search}%`);
      idx++;
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    params.push(offset, limit);

    const sql = `
      SELECT
        "publicId" as id,
        "firstName", "lastName", email, "phoneNumber", age, gender, status
      FROM "User"
      ${whereSql}
      ORDER BY "${sortBy}" ${sortDir}, "publicId" ASC
      OFFSET $${idx} LIMIT $${idx + 1}
    `;

    const r = await pool.query(sql, params);

    res.status(200).json({
      items: r.rows,
      page,
      limit,
      nextPage: r.rows.length === limit ? page + 1 : null,
    });
  } catch (e: any) {
    res.status(500).json({ error: "users/page failed", message: e?.message ?? String(e) });
  }
}