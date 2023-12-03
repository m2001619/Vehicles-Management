"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const vehicleController_1 = require("../controllers/vehicleController");
const router = express_1.default.Router();
router
    .use(authController_1.protect) // Access with Token
    .get("/getAvailableVehicles", (0, authController_1.restrictTo)("admin", "user"), vehicleController_1.getAvailableVehicles)
    .get("/getGarageVehicles/:garageId", (0, authController_1.restrictTo)("admin", "user"), vehicleController_1.getGarageVehicles)
    .get("/getAllVehicles", (0, authController_1.restrictTo)("admin", "user"), vehicleController_1.getAllVehicles)
    .post("", (0, authController_1.restrictTo)("admin"), vehicleController_1.createVehicle)
    .get("/getAskReturnVehicles", (0, authController_1.restrictTo)("admin"), vehicleController_1.getAskReturnVehicles)
    .get("/getUserLikeVehicles/:userId", (0, authController_1.restrictTo)("admin", "user"), vehicleController_1.getUserLikeVehicles)
    .get("/:id", (0, authController_1.restrictTo)("admin", "user"), vehicleController_1.getVehicle)
    .get("/nearlyVehicle/:distance/center/:coordinates/unit/:unit", (0, authController_1.restrictTo)("user"), vehicleController_1.getNearlyVehicle)
    .patch("/:id", (0, authController_1.restrictTo)("admin"), vehicleController_1.updateVehicle)
    .patch("/acceptReturnVehicle/:id", (0, authController_1.restrictTo)("admin"), vehicleController_1.acceptReturnVehicle)
    .patch("/askToReturnVehicle/:id", (0, authController_1.restrictTo)("user"), vehicleController_1.askToReturnVehicle)
    .patch("/reUseVehicle/:id", (0, authController_1.restrictTo)("user"), vehicleController_1.reUseVehicle)
    .patch("/likeVehicle/:id", (0, authController_1.restrictTo)("user"), vehicleController_1.likeVehicle)
    .patch("/dislikeVehicle/:id", (0, authController_1.restrictTo)("user"), vehicleController_1.dislikeVehicle)
    .delete("/:id", (0, authController_1.restrictTo)("admin"), vehicleController_1.deleteVehicle);
exports.default = router;
