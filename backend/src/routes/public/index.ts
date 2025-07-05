import { Router } from "express";
import eventRouter from "./event.ts";


const router = Router();

router.use("/event", eventRouter);

export default router;