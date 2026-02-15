import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit ?? 150), 10), 500);
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : null;

    // Infinite scroll uchun sortingni "publicId" (stable) qilamiz
    // Search/filter bo'lsa ham OK
    const gender = typeof req.query.gender === "string" ? req.query.gender : "all";
    const status = typeof req.query.status === "string" ? req.query.status : "all";
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

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

    // cursor bo'lsa keyset
    if (cursor) {
      where.push(`"publicId" > $${idx++}`);
      params.push(cursor);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    params.push(limit);

    const sql = `
      SELECT
        "publicId" as id,
        "firstName", "lastName", email, "phoneNumber", age, gender, status
      FROM "User"
      ${whereSql}
      ORDER BY "publicId" ASC
      LIMIT $${idx}
    `;

    const r = await pool.query(sql, params);

    const items = r.rows;
    const nextCursor = items.length ? items[items.length - 1].id : null;

    res.status(200).json({ items, nextCursor });
  } catch (e: any) {
    res.status(500).json({ error: "users failed", message: e?.message ?? String(e) });
  }
}