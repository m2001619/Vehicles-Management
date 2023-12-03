// express
import express from "express";

// project imports
import { protect, restrictTo } from "../controllers/authController";
import {
  deleteRequest,
  updateRequest,
  getAllRequests,
  getVehicleRequests,
  getRequest,
  acceptRequest,
  requestVehicle,
} from "../controllers/requestController";

/** Start Router **/
const router = express.Router();
router
  .use(protect) // Access with Token
  .get("/getAllRequests", restrictTo("admin"), getAllRequests)
  .get(
    "/getVehicleRequests/:vehicleId",
    restrictTo("admin"),
    getVehicleRequests
  )
  .get("/:id", restrictTo("admin", "user"), getRequest)
  .post("/requestVehicle/:vehicleId", restrictTo("user"), requestVehicle)
  .patch("/:id", restrictTo("admin", "user"), updateRequest)
  .patch("/acceptRequest/:id", restrictTo("admin"), acceptRequest)
  .delete("/:id", restrictTo("admin", "user"), deleteRequest);
/** End Router **/

export default router;
