"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const place_scores_controller_1 = require("../controllers/place-scores-controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, place_scores_controller_1.getAllPlaceScores);
router.get('/:id', auth_1.authenticate, place_scores_controller_1.getPlaceScoreById);
router.post('/', auth_1.authenticate, place_scores_controller_1.createPlaceScore);
router.put('/:id', auth_1.authenticate, place_scores_controller_1.updatePlaceScore);
router.delete('/:id', auth_1.authenticate, place_scores_controller_1.deletePlaceScore);
exports.default = router;
