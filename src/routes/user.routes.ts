// routes/userRoutes.ts
import express from 'express';
import { getCurrentUser } from '../controllers/user-controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/me', authenticate, getCurrentUser);

export default router;
