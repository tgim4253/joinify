import { Router } from "express";
import { optionalAuth, requireAdmin, requireAuth } from "../../middlewares/auth.ts";
import { getEventAdmin, getEventsAdmin, updateEvent, uploadCsv } from "../../controllers/eventsController.ts";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// event router
router.get("/list", requireAuth, requireAdmin, getEventsAdmin);
router.get("/:id", requireAuth, requireAdmin, getEventAdmin);

router.put("/:id", requireAuth, requireAdmin, updateEvent);

router.post("/upload", upload.single('file'), uploadCsv);

export default router;