import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const page = Math.max(Number(req.query.page ?? 0), 0);
  const limit = Math.min(Math.max(Number(req.query.limit ?? 50), 10), 500);
  const offset = page * limit;

  const r = await pool.query(
    `SELECT "publicId" as id, "firstName", "lastName", email, "phoneNumber", age, gender, status
     FROM "User"
     ORDER BY "lastName" ASC
     OFFSET $1 LIMIT $2`,
    [offset, limit]
  );

  res.status(200).json({
    items: r.rows,
    page,
    limit,
    nextPage: r.rows.length === limit ? page + 1 : null,
  });
}