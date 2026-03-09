import express from "express";
import { createUser, getUsers, changePassword, getMe } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createUserSchema, changePasswordSchema } from "../validators/userValidators.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getMe);
router.get("/", getUsers);
router.post("/", validateRequest(createUserSchema), createUser);
router.patch("/me/password", validateRequest(changePasswordSchema), changePassword);

export default router;
