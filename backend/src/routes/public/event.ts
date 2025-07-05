import { Router } from "express";
import { getEvent, getEvents } from "../../controllers/eventsController.ts";

const router = Router();

// event router
router.get("/list", getEvents);
router.get("/:id", getEvent);

export default router;