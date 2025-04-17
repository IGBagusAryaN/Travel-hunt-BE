import express from 'express';
import { getRecommendations } from '../controllers/recomendation.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/',authenticate, getRecommendations);

export default router;
