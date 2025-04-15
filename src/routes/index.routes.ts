import { Router } from 'express';
import authRoutes from './auth.routes';
import cityRoutes from './city.routes';
import placesRoutes from './places.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/city', cityRoutes);
router.use('/places', placesRoutes )
export default router;
