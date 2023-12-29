"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// express
const express_1 = __importDefault(require("express"));
// project imports
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
/** Start Router **/
const router = express_1.default.Router();
router
    .post("/validateEmail", authController_1.validateEmail)
    .post("/signup", authController_1.signup)
    .post("/login", authController_1.login)
    .post("/forgotPassword", authController_1.forgotPassword)
    .patch("/resetPassword", authController_1.resetPassword)
    // Access with Token
    .use(authController_1.protect)
    .patch("/updatePassword", authController_1.updatePassword)
    .patch("/setNotificationToken", userController_1.setNotificationToken)
    .get("/getMe", userController_1.getMe)
    .post("/updateMe", userController_1.updateMe)
    .delete("/deleteMe", userController_1.deleteMe)
    // Only access for admin
    .use((0, authController_1.restrictTo)("admin"))
    .get("/getPendingUsers", userController_1.getPendingUsers)
    .post("/acceptPendingUser/:userId", userController_1.acceptPendingUser)
    .get("/getAllUsers", userController_1.getAllUsers)
    .get("/getUser/:id", userController_1.getUser)
    .delete("/deleteUser/:id", userController_1.deleteUser)
    .patch("/activeUser/:userId", userController_1.activeUser)
    .patch("/blockUser/:userId", userController_1.blockUser);
/** End Router **/
exports.default = router;
