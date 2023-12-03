// express
import express from "express";

// project imports
import { protect, restrictTo } from "../controllers/authController";
import {
  getAllGarages,
  createGarage,
  deleteGarage,
  updateGarage,
  getGarage,
  blockActiveGarage,
} from "../controllers/garageController";

/** Start Router **/
const router = express.Router();
router
  // Access with Token
  .use(protect)
  .get("/getAllGarages", restrictTo("admin", "user"), getAllGarages)
  .get("/:id", restrictTo("admin", "user"), getGarage)
  // Only access for admin
  .post("", restrictTo("admin"), createGarage)
  .patch("/:id", restrictTo("admin"), updateGarage)
  .patch("/blockActiveGarage/:id", restrictTo("admin"), blockActiveGarage)
  .delete("/:id", restrictTo("admin"), deleteGarage);
/** End Router **/
export default router;
