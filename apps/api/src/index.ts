import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });



async function main() {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    preflight: true,
  });

  app.get("/health", async () => ({ ok: true }));

  app.get("/api/users", async (req) => {
    const q = z.object({
      cursor: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      gender: z.enum(["male", "female", "all"]).optional(),
      status: z.enum(["active", "inactive", "blocked", "all"]).optional(),
      sortBy: z.enum(["id", "age", "lastName"]).optional(),
      sortDir: z.enum(["asc", "desc"]).optional(),
    }).parse(req.query);

    const where: any = {};
    const limit = Math.min(Math.max(Number(q.limit ?? 150), 10), 500);
    const cursorId = q.cursor ? BigInt(q.cursor) : undefined;

    if (cursorId) where.id = { gt: cursorId };

    if ((q.gender ?? "all") !== "all") {
      where.gender = q.gender;
    }

    if ((q.status ?? "all") !== "all") {
      where.status = q.status;
    }

    if (q.search?.trim()) {
      const term = q.search.trim();
      where.OR = [
        { firstName: { startsWith: term, mode: "insensitive" } },
        { lastName: { startsWith: term, mode: "insensitive" } },
        { email: { startsWith: term, mode: "insensitive" } },
      ];
    }

    const sort = q.sortBy ?? "id";
    const dir = q.sortDir ?? "asc";

    const items = await prisma.user.findMany({
      where,
      orderBy: { [sort]: dir },
      take: limit,
      select: {
        id: true,
        publicId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        age: true,
        gender: true,
        status: true,
      },
    });

    return {
      items: items.map((u) => ({
        id: u.publicId,
        cursor: u.id.toString(),
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        age: u.age,
        gender: u.gender,
        status: u.status,
      })),
      nextCursor: items.length ? items[items.length - 1].id.toString() : null,
    };
  });
  app.get("/api/users/count", async (req) => {
    const q = z.object({
      search: z.string().optional(),
      gender: z.enum(["male", "female", "all"]).optional(),
      status: z.enum(["active", "inactive", "blocked", "all"]).optional(),
      sortBy: z.enum(["id", "age", "lastName"]).optional(),
      sortDir: z.enum(["asc", "desc"]).optional(),
    }).parse(req.query);

    const where: any = {};

    if ((q.gender ?? "all") !== "all") where.gender = q.gender;
    if ((q.status ?? "all") !== "all") where.status = q.status;

    if (q.search?.trim()) {
      const term = q.search.trim();
      where.OR = [
        { firstName: { startsWith: term, mode: "insensitive" } },
        { lastName: { startsWith: term, mode: "insensitive" } },
        { email: { startsWith: term, mode: "insensitive" } },
      ];
    }

    const count = await prisma.user.count({ where });
    return { totalRecords: count };
  });
  app.patch("/api/users/:id", async (req) => {
    const params = z.object({ id: z.string() }).parse(req.params);

    const body = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      age: z.number().optional(),
      status: z.string().optional()
    }).parse(req.body);

    // 25% failure simulation
    if (Math.random() < 0.25) {
      throw new Error("Simulated failure");
    }

    const updated = await prisma.user.update({
      where: { publicId: params.id },
      data: body
    });

    return {
      id: updated.publicId,
      firstName: updated.firstName,
      lastName: updated.lastName,
      age: updated.age,
      status: updated.status
    };
  });

  app.get("/api/users/page", async (req) => {
    const q = z.object({
      page: z.string().optional(),
      pageSize: z.string().optional(),
      search: z.string().optional(),
      gender: z.enum(["male", "female", "all"]).optional(),
      status: z.enum(["active", "inactive", "blocked", "all"]).optional(),
      sortBy: z.enum(["id", "age", "lastName"]).optional(),
      sortDir: z.enum(["asc", "desc"]).optional(),
    }).parse(req.query);

    const page = Math.max(Number(q.page ?? 0), 0);
    const pageSize = Math.min(Math.max(Number(q.pageSize ?? 50), 10), 200);
    const skip = page * pageSize;

    const where: any = {};

    if ((q.gender ?? "all") !== "all") where.gender = q.gender;
    if ((q.status ?? "all") !== "all") where.status = q.status;

    if (q.search?.trim()) {
      const term = q.search.trim();
      where.OR = [
        { firstName: { startsWith: term, mode: "insensitive" } },
        { lastName: { startsWith: term, mode: "insensitive" } },
        { email: { startsWith: term, mode: "insensitive" } },
      ];
    }

    const sortBy = q.sortBy ?? "lastName";
    const sortDir = q.sortDir ?? "asc";

    const items = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortDir },
      skip,
      take: pageSize,
      select: {
        id: true,
        publicId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        age: true,
        gender: true,
        status: true,
      },
    });

    return {
      items: items.map((u) => ({
        id: u.publicId,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phoneNumber: u.phoneNumber,
        age: u.age,
        gender: u.gender,
        status: u.status,
      })),
      page,
      pageSize,
    };
  });

  const port = Number(process.env.PORT ?? 4000);
  await app.listen({ port, host: "0.0.0.0" });

  console.log(`API running at http://localhost:${port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
