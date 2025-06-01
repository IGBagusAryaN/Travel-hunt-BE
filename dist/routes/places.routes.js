"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const places_controller_1 = require("../controllers/places.controller");
const upload_1 = __importDefault(require("../middlewares/upload"));
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticate, upload_1.default.single('image'), places_controller_1.createPlace);
router.get('/', auth_1.authenticate, places_controller_1.getAllPlaces);
router.get('/:id', auth_1.authenticate, places_controller_1.getPlaceById);
router.put('/:id', auth_1.authenticate, places_controller_1.updatePlace);
router.delete('/:id', auth_1.authenticate, places_controller_1.deletePlace);
exports.default = router;
