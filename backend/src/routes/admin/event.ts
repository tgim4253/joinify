import { Router } from "express";
import { optionalAuth, requireAdmin, requireAuth } from "../../middlewares/auth.ts";
import { createEvent, getEventAdmin, getEventsAdmin } from "../../controllers/eventsController.ts";

const router = Router();

// event router
router.get("/list", requireAuth, requireAdmin, getEventsAdmin);
router.get("/:id", requireAuth, requireAdmin, getEventAdmin);

// router.post("/", requireAuth, requireAdmin, createEvent)

export default router;