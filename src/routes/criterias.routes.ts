import express from 'express';
import {
  getAllCriterias,
  getCriteriaById,
  createCriteria,
  updateCriteria,
  deleteCriteria,
} from '../controllers/criterias.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/',authenticate, getAllCriterias);
router.get('/:id',authenticate, getCriteriaById);
router.post('/',authenticate, createCriteria);
router.put('/:id',authenticate, updateCriteria);
router.delete('/:id',authenticate, deleteCriteria);

export default router;
