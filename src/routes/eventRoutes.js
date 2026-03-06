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

router.use(authMiddleware);

router.get("/", getEvents);
router.post("/", validateRequest(createEventSchema), createEvent);
router.get("/:id", getEventById);
router.patch("/:id", validateRequest(updateEventSchema), updateEvent);
router.delete("/:id", deleteEvent);

export default router;
