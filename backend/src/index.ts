import "dotenv/config";
import express from "express";
import cors from "cors";
import adminRouter from "./routes/admin/index.ts";
import publicRouter from "./routes/public/index.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";


const app = express();

app.use(cors());
app.use(express.json()); // json형태의 요청 body를 파싱하는 미들웨어

app.use("/api/admin", adminRouter);
app.use("/api/public", publicRouter)
app.get("/api/healthz", (_, res) => res.send("OK"));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API listening on ${PORT}`));
