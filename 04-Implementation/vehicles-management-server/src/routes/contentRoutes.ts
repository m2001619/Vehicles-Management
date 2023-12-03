// express
import express from "express";

// project imports
import { getContent, updateContent } from "../controllers/contentController";
import { protect, restrictTo } from "../controllers/authController";

/** Start Router **/
const router = express.Router();
router
  .get("", getContent)
  .use(protect)
  .patch("/:id", restrictTo("admin"), updateContent);
/** End Router **/

export default router;
