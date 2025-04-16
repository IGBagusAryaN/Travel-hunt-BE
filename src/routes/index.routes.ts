import { Router } from "express";
import authRoutes from "./auth.routes";
import cityRoutes from "./city.routes";
import placesRoutes from "./places.routes";
import criteriasRoutes from "./criterias.routes";
import placeScoresRoutes from "./place-scores-routes";
import recommendationsRoutes from "./recomendation.routes";
import userRoutes from "./user.routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/city", cityRoutes);
router.use("/places", placesRoutes);
router.use("/criterias", criteriasRoutes);
router.use("/place-scores", placeScoresRoutes);
router.use("/recommendations", recommendationsRoutes);
router.use("/users", userRoutes);
export default router;
