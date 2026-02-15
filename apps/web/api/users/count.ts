import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: any, res: any) {
  const result = await pool.query(`SELECT COUNT(*) FROM "User"`);

  res.status(200).json({
    totalRecords: Number(result.rows[0].count),
  });
}