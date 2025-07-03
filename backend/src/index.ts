// Express + Prisma basic server
import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.get("/healthz", (_, res) => res.send("OK"));

app.get("/users", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(4000, () => console.log("🚀 API listening on 4000"));
