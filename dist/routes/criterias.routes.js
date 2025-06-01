"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const criterias_controller_1 = require("../controllers/criterias.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, criterias_controller_1.getAllCriterias);
router.get('/:id', auth_1.authenticate, criterias_controller_1.getCriteriaById);
router.post('/', auth_1.authenticate, criterias_controller_1.createCriteria);
router.put('/:id', auth_1.authenticate, criterias_controller_1.updateCriteria);
router.delete('/:id', auth_1.authenticate, criterias_controller_1.deleteCriteria);
exports.default = router;
