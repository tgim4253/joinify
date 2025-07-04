import { Router } from "express";
import { optionalAuth, requireAdmin, requireAuth } from "../middleware/auth.ts";
import { createEvent, listEvents } from "../controllers/eventsController.ts";

const router = Router();

// event router
router.get("/", optionalAuth, listEvents);

// router.post("/", requireAuth, requireAdmin, createEvent)

export default router;