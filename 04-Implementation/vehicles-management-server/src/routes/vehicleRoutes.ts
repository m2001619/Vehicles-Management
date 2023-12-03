// express
import express from "express";

// project imports
import { protect, restrictTo } from "../controllers/authController";
import {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailableVehicles,
  askToReturnVehicle,
  getAskReturnVehicles,
  acceptReturnVehicle,
  getGarageVehicles,
  reUseVehicle,
  likeVehicle,
  dislikeVehicle,
  getUserLikeVehicles,
  getNearlyVehicle,
  getRequestedVehicles,
  blockActiveVehicle,
} from "../controllers/vehicleController";

/** Start Router **/
const router = express.Router();
router
  .use(protect) // Access with Token
  .get(
    "/getAvailableVehicles",
    restrictTo("admin", "user"),
    getAvailableVehicles
  )
  .get(
    "/getGarageVehicles/:garageId",
    restrictTo("admin", "user"),
    getGarageVehicles
  )
  .get("/getAllVehicles", restrictTo("admin", "user"), getAllVehicles)
  .post("", restrictTo("admin"), createVehicle)
  .get("/getAskReturnVehicles", restrictTo("admin"), getAskReturnVehicles)
  .get("/getRequestedVehicles", restrictTo("admin"), getRequestedVehicles)
  .get(
    "/getUserLikeVehicles/:userId",
    restrictTo("admin", "user"),
    getUserLikeVehicles
  )
  .get("/:id", restrictTo("admin", "user"), getVehicle)
  .get(
    "/nearlyVehicle/:distance/center/:coordinates/unit/:unit",
    restrictTo("user"),
    getNearlyVehicle
  )
  .patch("/:id", restrictTo("admin"), updateVehicle)
  .patch("/blockActiveVehicle/:id", restrictTo("admin"), blockActiveVehicle)
  .patch("/acceptReturnVehicle/:id", restrictTo("admin"), acceptReturnVehicle)
  .patch("/askToReturnVehicle/:id", restrictTo("user"), askToReturnVehicle)
  .patch("/reUseVehicle/:id", restrictTo("user"), reUseVehicle)
  .patch("/likeVehicle/:id", restrictTo("user"), likeVehicle)
  .patch("/dislikeVehicle/:id", restrictTo("user"), dislikeVehicle)
  .delete("/:id", restrictTo("admin"), deleteVehicle);
/** End Router **/

export default router;
