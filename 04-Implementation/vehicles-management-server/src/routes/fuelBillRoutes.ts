// express
import express from "express";

// project imports
import { protect, restrictTo } from "../controllers/authController";
import {
  getAllFuelBill,
  getFuelBill,
  createFuelBill,
  updateFuelBill,
  deleteFuelBill,
  getUserFuelBills,
  getVehicleFuelBills,
  getReservationFuelBills,
} from "../controllers/fuelBillController";

/** Start Router **/
const router = express.Router();
router
  // Access with Token
  .use(protect)
  .get("/getUserFuelBills/:userId", getUserFuelBills)
  .get("/getReservationFuelBills/:reservationId", getReservationFuelBills)
  .post("", restrictTo("admin", "user"), createFuelBill)
  .patch("/:id", updateFuelBill)
  .delete("/:id", deleteFuelBill)
  // Only access for admin
  .get("/getAllFuelBill", restrictTo("admin"), getAllFuelBill)
  .get(
    "/getVehicleFuelBills/:vehicleId",
    restrictTo("admin"),
    getVehicleFuelBills
  )
  .get("/:id", restrictTo("admin"), getFuelBill);
/** End Router **/

export default router;
