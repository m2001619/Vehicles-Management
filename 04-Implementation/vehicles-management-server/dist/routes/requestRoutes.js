"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const requestController_1 = require("../controllers/requestController");
const router = express_1.default.Router();
router
    .use(authController_1.protect) // Access with Token
    .get("/getAllRequests", (0, authController_1.restrictTo)("admin"), requestController_1.getAllRequests)
    .get("/getVehicleRequests/:vehicleId", (0, authController_1.restrictTo)("admin"), requestController_1.getVehicleRequests)
    .get("/:id", (0, authController_1.restrictTo)("admin", "user"), requestController_1.getRequest)
    .post("/requestVehicle/:vehicleId", (0, authController_1.restrictTo)("user"), requestController_1.requestVehicle)
    .patch("/:id", (0, authController_1.restrictTo)("admin", "user"), requestController_1.updateRequest)
    .patch("/:id", (0, authController_1.restrictTo)("admin", "user"), requestController_1.updateRequest)
    .patch("/acceptRequest/:id", (0, authController_1.restrictTo)("admin"), requestController_1.acceptRequest)
    .delete("/:id", (0, authController_1.restrictTo)("admin", "user"), requestController_1.deleteRequest);
exports.default = router;
