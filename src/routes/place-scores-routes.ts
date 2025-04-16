import express from 'express';
import {
  getAllPlaceScores,
  getPlaceScoreById,
  createPlaceScore,
  updatePlaceScore,
  deletePlaceScore,
} from '../controllers/place-scores-controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/',authenticate, getAllPlaceScores);
router.get('/:id',authenticate, getPlaceScoreById);
router.post('/',authenticate, createPlaceScore);
router.put('/:id',authenticate, updatePlaceScore);
router.delete('/:id',authenticate, deletePlaceScore);

export default router;
