import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.ts"
import eventRouter from "./routes/event.ts"
import { errorHandler } from "./middleware/errorHandler.ts";


const app = express();

app.use(cors());
app.use(express.json()); // json형태의 요청 body를 파싱하는 미들웨어

app.use("/api/auth", authRouter)
app.use("/api/events", eventRouter);
app.get("/api/healthz", (_, res) => res.send("OK"));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
