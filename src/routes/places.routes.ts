import express from 'express'
import {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} from '../controllers/places.controller'
import upload from '../middlewares/upload';
import { authenticate } from '../middlewares/auth';
const router = express.Router()

router.post('/',authenticate, upload.single('image'), createPlace);
router.get('/',authenticate, getAllPlaces)
router.get('/:id',authenticate, getPlaceById)
router.put('/:id',authenticate, updatePlace)
router.delete('/:id',authenticate, deletePlace)

export default router
