import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: any, res: any) {
  const limit = Number(req.query.limit ?? 50);

  const result = await pool.query(
    `SELECT "publicId", "firstName", "lastName", email, age, gender, status
     FROM "User"
     ORDER BY "lastName"
     LIMIT $1`,
    [limit]
  );

  res.status(200).json({ items: result.rows });
}