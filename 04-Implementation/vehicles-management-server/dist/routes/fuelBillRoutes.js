"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const fuelBillController_1 = require("../controllers/fuelBillController");
const router = express_1.default.Router();
router
    // Access with Token
    .use(authController_1.protect)
    .get("/getUserFuelBills/:userId", fuelBillController_1.getUserFuelBills)
    .get("/getReservationFuelBills/:reservationId", fuelBillController_1.getReservationFuelBills)
    .post("", (0, authController_1.restrictTo)("admin", "user"), fuelBillController_1.createFuelBill)
    .patch("/:id", fuelBillController_1.updateFuelBill)
    .delete("/:id", fuelBillController_1.deleteFuelBill)
    // Only access for admin
    .get("/getAllFuelBill", (0, authController_1.restrictTo)("admin"), fuelBillController_1.getAllFuelBill)
    .get("/getVehicleFuelBills/:vehicleId", (0, authController_1.restrictTo)("admin"), fuelBillController_1.getVehicleFuelBills)
    .get("/:id", (0, authController_1.restrictTo)("admin"), fuelBillController_1.getFuelBill);
exports.default = router;
