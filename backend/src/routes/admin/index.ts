import { Router } from "express";
import eventRouter from "./event.ts";
import authRouter from "./auth.ts";


const router = Router();

router.use("/event", eventRouter);
router.use("/auth", authRouter);


export default router;