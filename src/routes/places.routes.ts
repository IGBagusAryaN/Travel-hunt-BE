import express from 'express'
import {
  createPlace,
  getAllPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} from '../controllers/places.controller'
import upload from '../middlewares/upload';
const router = express.Router()

router.post('/', upload.single('image'), createPlace);
router.get('/', getAllPlaces)
router.get('/:id', getPlaceById)
router.put('/:id', updatePlace)
router.delete('/:id', deletePlace)

export default router
