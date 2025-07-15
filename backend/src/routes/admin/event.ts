import { Router } from "express";
import { optionalAuth, requireAdmin, requireAuth } from "../../middlewares/auth.ts";
import { getEventAdmin, getEventFields, getEventsAdmin, updateEvent, uploadCsv, uploadCSVFieldData } from "../../controllers/eventsController.ts";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// event router
router.get("/list", requireAuth, requireAdmin, getEventsAdmin);
router.get("/:id", requireAuth, requireAdmin, getEventAdmin);
router.get("/:id/fields", requireAuth, requireAdmin, getEventFields);

router.put("/:id", requireAuth, requireAdmin, updateEvent);

router.post("/upload", requireAuth, requireAdmin, upload.single('file'), uploadCsv);
router.put("/update/:id/fields", requireAuth, requireAdmin, uploadCSVFieldData);
export default router;