"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user-controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/me', auth_1.authenticate, user_controller_1.getCurrentUser);
exports.default = router;
