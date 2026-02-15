export default function handler(req, res) {
  res.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    dbHost: process.env.DATABASE_URL?.includes("localhost") ? "localhost" : "remote",
  });
}