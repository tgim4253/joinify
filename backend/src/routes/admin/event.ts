import { Router } from "express";
import { optionalAuth, requireAdmin, requireAuth } from "../../middlewares/auth.ts";
import { getEventAdmin, getEventsAdmin, updateEvent } from "../../controllers/eventsController.ts";

const router = Router();

// event router
router.get("/list", requireAuth, requireAdmin, getEventsAdmin);
router.get("/:id", requireAuth, requireAdmin, getEventAdmin);

router.put("/:id", requireAuth, requireAdmin, updateEvent)

export default router;