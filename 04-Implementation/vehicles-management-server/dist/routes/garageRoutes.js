"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const garageController_1 = require("../controllers/garageController");
const router = express_1.default.Router();
router
    // Access with Token
    .use(authController_1.protect)
    .get("/getAllGarages", (0, authController_1.restrictTo)("admin", "user"), garageController_1.getAllGarages)
    .get("/:id", (0, authController_1.restrictTo)("admin", "user"), garageController_1.getGarage)
    // Only access for admin
    .post("", (0, authController_1.restrictTo)("admin"), garageController_1.createGarage)
    .patch("/:id", (0, authController_1.restrictTo)("admin"), garageController_1.updateGarage)
    .delete("/:id", (0, authController_1.restrictTo)("admin"), garageController_1.deleteGarage);
exports.default = router;
