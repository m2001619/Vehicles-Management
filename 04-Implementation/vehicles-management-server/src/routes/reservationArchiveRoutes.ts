// express
import express from "express";

// project imports
import { protect, restrictTo } from "../controllers/authController";
import {
  getAllReservations,
  getReservation,
  deleteReservation,
  getMyActiveReservation,
  getMyArchiveReservations,
  updateReservation,
} from "../controllers/reservationArchiveController";

/** Start Router **/
const router = express.Router();
router
  // Access with Token
  .use(protect)
  // Only access for admin
  .get("/getAllReservations", restrictTo("admin"), getAllReservations)
  .get(
    "/getMyArchiveReservations",
    restrictTo("user"),
    getMyArchiveReservations
  )
  .get("/getMyActiveReservation", restrictTo("user"), getMyActiveReservation)
  .get("/:id", restrictTo("admin"), getReservation)
  .patch("/:id", restrictTo("admin"), updateReservation)
  .delete("/:id", restrictTo("admin"), deleteReservation);
/** End Router **/

export default router;
