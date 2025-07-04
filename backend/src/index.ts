// Express + Prisma basic server
import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import authRouter from "./routes/auth"

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json()); // json형태의 요청 body를 파싱하는 미들웨어

app.use("/api/auth", authRouter)
app.get("/api/healthz", (_, res) => res.send("OK"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
