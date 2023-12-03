// express
import express from "express";

// project imports
import {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword, validateEmail,
} from "../controllers/authController";
import {
  getAllUsers,
  getUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  activeUser,
  blockUser,
  getPendingUsers,
  acceptPendingUser,
  setNotificationToken,
} from "../controllers/userController";

/** Start Router **/
const router = express.Router();
router
  .post("/validateEmail", validateEmail)
  .post("/signup", signup)
  .post("/login", login)
  .post("/forgotPassword", forgotPassword)
  .patch("/resetPassword", resetPassword)
  // Access with Token
  .use(protect)
  .patch("/updatePassword", updatePassword)
  .patch("/setNotificationToken", setNotificationToken)
  .get("/getMe", getMe)
  .post("/updateMe", updateMe)
  .delete("/deleteMe", deleteMe)
  // Only access for admin
  .use(restrictTo("admin"))
  .get("/getPendingUsers", getPendingUsers)
  .post("/acceptPendingUser/:userId", acceptPendingUser)
  .get("/getAllUsers", getAllUsers)
  .get("/getUser/:id", getUser)
  .delete("/deleteUser/:id", deleteUser)
  .patch("/activeUser/:userId", activeUser)
  .patch("/blockUser/:userId", blockUser);
/** End Router **/

export default router;
