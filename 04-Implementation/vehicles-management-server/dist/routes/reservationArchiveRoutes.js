"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// express
const express_1 = __importDefault(require("express"));
// project imports
const authController_1 = require("../controllers/authController");
const reservationArchiveController_1 = require("../controllers/reservationArchiveController");
/** Start Router **/
const router = express_1.default.Router();
router
    // Access with Token
    .use(authController_1.protect)
    // Only access for admin
    .get("/getAllReservations", (0, authController_1.restrictTo)("admin"), reservationArchiveController_1.getAllReservations)
    .get("/getMyArchiveReservations", (0, authController_1.restrictTo)("user"), reservationArchiveController_1.getMyArchiveReservations)
    .get("/getMyActiveReservation", (0, authController_1.restrictTo)("user"), reservationArchiveController_1.getMyActiveReservation)
    .get("/:id", (0, authController_1.restrictTo)("admin"), reservationArchiveController_1.getReservation)
    .patch("/:id", (0, authController_1.restrictTo)("admin"), reservationArchiveController_1.updateReservation)
    .delete("/:id", (0, authController_1.restrictTo)("admin"), reservationArchiveController_1.deleteReservation);
/** End Router **/
exports.default = router;
