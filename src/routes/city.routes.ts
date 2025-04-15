import express from 'express'
import {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  deleteCity,
} from '../controllers/city.controller'

const router = express.Router()

router.post('/', createCity)
router.get('/', getAllCities)
router.get('/:id', getCityById)
router.put('/:id', updateCity)
router.delete('/:id', deleteCity)

export default router
