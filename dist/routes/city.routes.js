"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const city_controller_1 = require("../controllers/city.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticate, city_controller_1.createCity);
router.get('/', auth_1.authenticate, city_controller_1.getAllCities);
router.get('/:id', auth_1.authenticate, city_controller_1.getCityById);
router.put('/:id', auth_1.authenticate, city_controller_1.updateCity);
router.delete('/:id', auth_1.authenticate, city_controller_1.deleteCity);
exports.default = router;
