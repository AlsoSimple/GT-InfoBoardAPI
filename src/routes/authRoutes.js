import express from 'express';
import { login, logout } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { loginSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);

export default router;