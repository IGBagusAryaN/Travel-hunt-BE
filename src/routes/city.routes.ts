import express from 'express'
import {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} from '../controllers/city.controller'
import { authenticate } from '../middlewares/auth';
const router = express.Router()

router.post('/', authenticate, createCity)
router.get('/', authenticate, getAllCities)
router.get('/:id',authenticate, getCityById)
router.put('/:id',authenticate, updateCity)
router.delete('/:id',authenticate, deleteCity)

export default router
