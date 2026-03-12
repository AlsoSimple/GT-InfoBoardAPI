import express from "express";
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
} from "../controllers/eventController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createEventSchema, updateEventSchema } from "../validators/eventValidators.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", authMiddleware, validateRequest(createEventSchema), createEvent);
router.patch("/:id", authMiddleware, validateRequest(updateEventSchema), updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
